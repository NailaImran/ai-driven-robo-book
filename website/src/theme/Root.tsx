import React from 'react';
import { PersonalizationProvider } from '../context/PersonalizationContext';
import RAGChatbot from '../components/RAGChatbot';

// This component wraps the entire app
export default function Root({ children }) {
  return (
    <PersonalizationProvider>
      {children}
      <RAGChatbot />
    </PersonalizationProvider>
  );
}
