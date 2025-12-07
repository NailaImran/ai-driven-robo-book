import { HardwareSpec, CostModel, CostCalculation } from '../types';

/**
 * Format currency to USD
 */
export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

/**
 * Calculate break-even point between two cost models
 * Returns the month when costs equalize, or undefined if never
 */
export function calculateBreakEven(
  model1: CostModel,
  model2: CostModel,
  maxMonths: number = 60
): number | undefined {
  for (let month = 1; month <= maxMonths; month++) {
    const cost1 = model1.capex + model1.opexMonthly * month;
    const cost2 = model2.capex + model2.opexMonthly * month;

    // Check if costs have crossed over
    if (month > 1) {
      const prevCost1 = model1.capex + model1.opexMonthly * (month - 1);
      const prevCost2 = model2.capex + model2.opexMonthly * (month - 1);

      if (
        (prevCost1 <= prevCost2 && cost1 >= cost2) ||
        (prevCost1 >= prevCost2 && cost1 <= cost2)
      ) {
        return month;
      }
    }
  }

  return undefined;
}

/**
 * Filter hardware by budget with tolerance
 */
export function filterByBudget(
  hardware: HardwareSpec[],
  budget: number,
  tolerance: number = 0.1
): HardwareSpec[] {
  const maxBudget = budget * (1 + tolerance);
  return hardware.filter((item) => item.price <= maxBudget);
}

/**
 * Calculate total cost for a hardware configuration
 */
export function calculateTotalCost(components: HardwareSpec[]): number {
  return components.reduce((total, component) => total + component.price, 0);
}

/**
 * Score hardware based on use case match
 */
export function scoreHardwareMatch(
  hardware: HardwareSpec,
  targetUseCase: string,
  userExperience: 'beginner' | 'intermediate' | 'expert'
): number {
  let score = 0;

  // Use case match (40 points)
  if (hardware.useCase.includes(targetUseCase)) {
    score += 40;
  }

  // Availability bonus (20 points)
  if (hardware.availability === 'in-stock') {
    score += 20;
  } else if (hardware.availability === 'pre-order') {
    score += 10;
  }

  // Price efficiency (20 points) - inverse relationship
  const maxPrice = 10000;
  score += 20 * (1 - hardware.price / maxPrice);

  // Experience level match (20 points)
  // Beginners prefer widely available, well-documented hardware
  // Experts can handle more specialized equipment
  if (userExperience === 'beginner') {
    // Favor popular, documented platforms
    if (
      hardware.manufacturer === 'NVIDIA' ||
      hardware.manufacturer === 'Intel'
    ) {
      score += 20;
    }
  } else if (userExperience === 'expert') {
    // More flexibility for experts
    score += 15;
  }

  return Math.min(score, 100);
}

/**
 * Calculate total cost over time for a cost model
 */
export function calculateCostOverTime(
  model: CostModel,
  timeframeYears: number,
  usageHoursPerWeek: number = 40
): CostCalculation {
  const months = timeframeYears * 12;
  const totalOpex = model.opexMonthly * months;
  const totalCost = model.capex + totalOpex;

  // Adjust cloud costs based on actual usage
  let adjustedTotalCost = totalCost;
  if (model.setupType === 'cloud') {
    // Cloud costs are usage-based (168 hours per week max)
    const usageFactor = usageHoursPerWeek / 168;
    adjustedTotalCost = model.capex + totalOpex * usageFactor;
  }

  return {
    setupType: model.setupType,
    timeframeYears,
    usageHoursPerWeek,
    totalCost: adjustedTotalCost,
    monthlyCost: adjustedTotalCost / months,
  };
}

/**
 * Estimate reading time for content (words per minute)
 */
export function estimateReadingTime(wordCount: number, wpm: number = 200): number {
  return Math.ceil(wordCount / wpm);
}

/**
 * Generate slug from title
 */
export function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

/**
 * Check if device is mobile
 */
export function isMobile(): boolean {
  if (typeof window === 'undefined') return false;
  return window.innerWidth < 768;
}
