import apiService from './apiService';

/**
 * Frontend ECO AI Service
 * Delegates all AI processing securely to the backend POST /api/ai/chat endpoint.
 * Never exposes Gemini API keys or calls Google APIs directly from the browser.
 */

export async function askEcoAi({ message, history = [], image = null, imageMime = 'image/jpeg', productContext = null }) {
  try {
    const data = await apiService.sendAiChat({
      message,
      history,
      image,
      imageMime,
      productContext
    });

    if (data && data.success && data.answer) {
      return {
        success: true,
        answer: data.answer,
        modelUsed: data.modelUsed || 'Google Gemini AI'
      };
    }

    return {
      success: false,
      answer: data?.error || "Sorry, ECO AI is temporarily unavailable. Please try again."
    };
  } catch (err) {
    console.warn("ECO AI service error:", err.message);
    return {
      success: false,
      answer: "Sorry, ECO AI is temporarily unavailable. Please check your network connection and try again."
    };
  }
}

export default askEcoAi;
