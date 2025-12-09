/**
 * API Client for QuantumPages Backend
 *
 * Handles all communication with the FastAPI backend:
 * - Authentication (signup, signin, session)
 * - Lessons (get, list, mark complete)
 * - Quizzes (get, submit)
 * - Progress (summary, weak areas)
 * - Recommendations (next lesson, search)
 */

class ApiClient {
  private baseUrl: string;
  private token: string | null = null;

  constructor() {
    // Use environment variable or default to localhost for development
    this.baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

    // Restore token from localStorage if available
    if (typeof window !== 'undefined') {
      this.token = localStorage.getItem('auth_token');
    }
  }

  /**
   * Set authentication token
   */
  setToken(token: string): void {
    this.token = token;
    if (typeof window !== 'undefined') {
      localStorage.setItem('auth_token', token);
    }
  }

  /**
   * Clear authentication token
   */
  clearToken(): void {
    this.token = null;
    if (typeof window !== 'undefined') {
      localStorage.removeItem('auth_token');
    }
  }

  /**
   * Get current token
   */
  getToken(): string | null {
    return this.token;
  }

  /**
   * Check if user is authenticated
   */
  isAuthenticated(): boolean {
    return this.token !== null;
  }

  /**
   * Make HTTP request with proper headers and error handling
   */
  private async request(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<any> {
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
      ...(this.token && { Authorization: `Bearer ${this.token}` }),
    };

    const response = await fetch(`${this.baseUrl}/api/v1${endpoint}`, {
      ...options,
      headers,
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      const errorMessage = errorData.detail || `API Error: ${response.statusText}`;
      throw new Error(errorMessage);
    }

    return response.json();
  }

  // ============ Authentication ============

  /**
   * Sign up a new user with background questionnaire
   */
  async signup(data: {
    email: string;
    password: string;
    name: string;
    background: {
      python_experience: number;
      cpp_experience: number;
      ros_experience: number;
      robotics_experience: number;
      learning_goals: string[];
    };
  }): Promise<{
    access_token: string;
    token_type: string;
    user: {
      id: string;
      email: string;
      name: string;
      expertise_level: string;
    };
  }> {
    const result = await this.request('/auth/signup', {
      method: 'POST',
      body: JSON.stringify(data),
    });

    this.setToken(result.access_token);
    return result;
  }

  /**
   * Sign in with email and password
   */
  async signin(
    email: string,
    password: string
  ): Promise<{
    access_token: string;
    token_type: string;
    user: {
      id: string;
      email: string;
      name: string;
      expertise_level: string;
    };
  }> {
    const result = await this.request('/auth/signin', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });

    this.setToken(result.access_token);
    return result;
  }

  /**
   * Get current session/user
   */
  async getSession(): Promise<{
    user: {
      id: string;
      email: string;
      name: string;
      expertise_level: string;
    } | null;
    authenticated: boolean;
  }> {
    return this.request('/auth/session');
  }

  /**
   * Sign out (client-side only, token cleared)
   */
  signout(): void {
    this.clearToken();
  }

  // ============ Users ============

  /**
   * Get current user profile
   */
  async getUserProfile(): Promise<{
    id: string;
    email: string;
    name: string;
    expertise_level: string;
  }> {
    return this.request('/users/me');
  }

  /**
   * Get user preferences
   */
  async getUserPreferences(): Promise<{
    language: string;
    show_detailed_explanations: boolean;
    show_advanced_content: boolean;
    dark_mode: boolean;
  }> {
    return this.request('/users/me/preferences');
  }

  /**
   * Update user preferences
   */
  async updateUserPreferences(preferences: {
    language?: string;
    show_detailed_explanations?: boolean;
    show_advanced_content?: boolean;
    dark_mode?: boolean;
  }): Promise<{
    language: string;
    show_detailed_explanations: boolean;
    show_advanced_content: boolean;
    dark_mode: boolean;
  }> {
    return this.request('/users/me/preferences', {
      method: 'PATCH',
      body: JSON.stringify(preferences),
    });
  }

  /**
   * Get user background information
   */
  async getUserBackground(): Promise<{
    python_experience: number;
    cpp_experience: number;
    ros_experience: number;
    learning_goals: string[];
    expertise_level: string;
  }> {
    return this.request('/users/me/background');
  }

  // ============ Lessons ============

  /**
   * List all lessons or lessons for a chapter
   */
  async listLessons(chapterId?: string): Promise<{
    total: number;
    lessons: Array<{
      id: string;
      chapter_id: string;
      lesson_number: number;
      title: string;
      description: string;
      difficulty: string;
      estimated_duration: number;
      keywords: string[];
      has_quiz: boolean;
    }>;
  }> {
    const params = chapterId ? `?chapter_id=${chapterId}` : '';
    return this.request(`/lessons${params}`);
  }

  /**
   * Get lesson content with markdown
   */
  async getLesson(lessonId: string): Promise<{
    lesson: {
      id: string;
      chapter_id: string;
      title: string;
      description: string;
      difficulty: string;
      estimated_duration: number;
      keywords: string[];
    };
    user_progress: {
      status: string;
      completion_percentage: number;
      time_spent_seconds: number;
    } | null;
    content_markdown: string;
  }> {
    return this.request(`/lessons/${lessonId}`);
  }

  /**
   * Mark lesson as completed
   */
  async markLessonComplete(
    lessonId: string,
    timeSpentSeconds: number = 0
  ): Promise<{
    message: string;
    progress: {
      status: string;
      completion_percentage: number;
      time_spent_seconds: number;
    };
  }> {
    return this.request(`/lessons/${lessonId}/complete`, {
      method: 'POST',
      body: JSON.stringify({ time_spent_seconds: timeSpentSeconds }),
    });
  }

  /**
   * Update lesson progress
   */
  async updateLessonProgress(
    lessonId: string,
    timeSpentSeconds: number = 0,
    status: string = 'in_progress'
  ): Promise<{
    message: string;
    progress: {
      status: string;
      completion_percentage: number;
      time_spent_seconds: number;
    };
  }> {
    return this.request(`/lessons/${lessonId}/update-progress`, {
      method: 'POST',
      body: JSON.stringify({ time_spent_seconds: timeSpentSeconds, status }),
    });
  }

  // ============ Quizzes ============

  /**
   * Get quiz questions for a chapter
   */
  async getQuiz(chapterId: string): Promise<{
    id: string;
    chapter_id: string;
    title: string;
    total_questions: number;
    passing_score: number;
    questions: Array<{
      question_number: number;
      question_text: string;
      options: string[];
      correct_answer: string;
      explanation: string;
    }>;
  }> {
    return this.request(`/quizzes/${chapterId}`);
  }

  /**
   * Submit quiz answers
   */
  async submitQuiz(
    quizId: string,
    answers: Record<string, string>
  ): Promise<{
    score: number;
    passed: boolean;
    correct_answers: number;
    total_questions: number;
    weak_topics: string[];
  }> {
    return this.request(`/quizzes/${quizId}/submit`, {
      method: 'POST',
      body: JSON.stringify({ answers }),
    });
  }

  /**
   * Get quiz history
   */
  async getQuizHistory(): Promise<{
    total_attempts: number;
    average_score: number;
    history: Array<{
      quiz_id: string;
      chapter_id: string;
      score: number;
      passed: boolean;
      attempted_at: string;
    }>;
  }> {
    return this.request('/quizzes/scores');
  }

  // ============ Progress ============

  /**
   * Get overall progress summary
   */
  async getProgressSummary(): Promise<{
    total_lessons: number;
    completed_lessons: number;
    completion_percentage: number;
    total_time_hours: number;
    quiz_average: number;
    chapters: Array<{
      chapter_id: string;
      completed: number;
      total: number;
      status: string;
    }>;
  }> {
    return this.request('/progress/summary');
  }

  /**
   * Get weak areas from quiz performance
   */
  async getWeakAreas(): Promise<{
    total_weak_areas: number;
    weak_areas: Array<{
      lesson_id: string;
      title: string;
      score: number;
      keywords: string[];
      difficulty: string;
    }>;
  }> {
    return this.request('/progress/weak-areas');
  }

  /**
   * Get progress for a specific lesson
   */
  async getLessonProgress(lessonId: string): Promise<{
    lesson_id: string;
    status: string;
    completion_percentage: number;
    time_spent_seconds: number;
    quiz_score: number | null;
    quiz_attempts: number;
  }> {
    return this.request(`/progress/lessons/${lessonId}`);
  }

  // ============ Recommendations ============

  /**
   * Get personalized next lesson recommendation
   */
  async getRecommendations(): Promise<{
    recommendations: Array<{
      lesson_id: string;
      title: string;
      chapter_id: string;
      difficulty: string;
      estimated_duration: number;
      reason: string;
      relevance_score: number;
    }>;
    user_expertise: string;
    total_available: number;
  }> {
    return this.request('/recommendations/next-lesson');
  }

  /**
   * Search lessons by keywords
   */
  async searchByKeywords(keywords: string): Promise<{
    keywords: string[];
    total_matches: number;
    lessons: Array<{
      lesson_id: string;
      title: string;
      chapter_id: string;
      difficulty: string;
      keywords: string[];
    }>;
  }> {
    return this.request(`/recommendations/by-keywords/${keywords}`);
  }

  /**
   * Get lessons by difficulty level
   */
  async getLessonsByDifficulty(difficulty: string): Promise<{
    difficulty: string;
    total_lessons: number;
    lessons: Array<{
      lesson_id: string;
      title: string;
      difficulty: string;
      user_progress: string;
    }>;
  }> {
    return this.request(`/recommendations/difficulty/${difficulty}`);
  }
}

// Export singleton instance
export const apiClient = new ApiClient();

// Export class for testing
export { ApiClient };
