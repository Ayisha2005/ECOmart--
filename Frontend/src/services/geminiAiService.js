import { askEcoAi } from './ecoAiService';

/**
 * Legacy Gemini Service Adapter
 * Delegates calls to the secure ecoAiService (POST /api/ai/chat)
 */

export async function queryGoogleGemini(promptText, imageBase64 = null, mimeType = 'image/jpeg') {
  const result = await askEcoAi({
    message: promptText,
    image: imageBase64,
    imageMime: mimeType
  });

  return {
    success: result.success,
    answer: result.answer,
    source: 'Google Gemini AI (Backend API)'
  };
}

export default queryGoogleGemini;
