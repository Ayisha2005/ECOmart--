import React from 'react';
import EcoAiChatbot from './EcoAiChatbot';

// Re-export new Google Gemini ECO AI Chatbot component
export const GoogleEcoAiAssistant = (props) => {
  return <EcoAiChatbot {...props} />;
};

export default GoogleEcoAiAssistant;
