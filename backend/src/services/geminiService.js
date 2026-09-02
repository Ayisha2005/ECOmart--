import { GoogleGenAI } from '@google/genai';

/**
 * Secure Google Gemini AI Service for ECO MART Backend
 * Powered by official @google/genai SDK
 */

const getApiKey = () => process.env.GEMINI_API_KEY || '';

// Initialize GenAI instance safely
const getAiClient = () => {
  const apiKey = getApiKey();
  if (!apiKey) return null;
  return new GoogleGenAI({ apiKey });
};

const SYSTEM_INSTRUCTION = `You are ECO AI, the official intelligent AI assistant for ECO MART India (Pan-India B2B & B2C Circular Economy Scrap & Recyclable Marketplace).

CRITICAL MULTILINGUAL RULE:
- Automatically detect the language of the customer's LATEST message (English, Tamil, Tanglish, Hindi, Malayalam, Telugu, Kannada, etc.).
- Respond in the EXACT SAME LANGUAGE and conversational style as the customer's latest message.
- For Tanglish (e.g., "Enaku ₹500 kulla reusable item venum"), respond naturally in Tanglish (e.g., "Sure! ₹500-kulla kedaikura eco-friendly items paarkalaam:").
- For Tamil (e.g., "சுற்றுச்சூழல் பொருட்கள் இருக்கா?"), respond in natural Tamil.
- Seamlessly switch languages whenever the user changes language. Never force English. Never ask the user to pick a language.

ACCURACY & ZERO HALLUCINATION RULE:
- NEVER invent product names, prices, stock availability, ratings, sellers, discounts, orders, or user details.
- Use ONLY the REAL ECO MART database product information provided in the context below.
- If real product data is provided, cite exact real titles, prices, and locations.
- If data is unavailable, clearly state in the customer's language that the information is currently not listed.
- Never make up fake products or prices.

MULTIMODAL IMAGE ANALYSIS RULE:
- When an image is provided, analyze what material or item is visible (e.g. PET Plastic, Cardboard, E-Waste, Metal, Glass).
- Clearly distinguish between what is visually observed vs database listings.
- Be friendly, clear, helpful, and concise.`;

/**
 * Generate AI Response using Google Gemini API
 */
export async function generateEcoAiResponse({ message = '', history = [], image = null, imageMime = 'image/jpeg', productContext = null, dbProducts = [] }) {
  const apiKey = getApiKey();

  if (!apiKey) {
    console.warn("GEMINI_API_KEY is not configured in backend environment.");
    return {
      success: false,
      answer: "Sorry, ECO AI is temporarily unavailable. Please try again later.",
      error: "Missing API Key configuration"
    };
  }

  try {
    const ai = getAiClient();
    if (!ai) throw new Error("Failed to initialize GoogleGenAI client");

    // Prepare Context Prompt with Real Database Products
    let contextHeader = "";

    if (productContext) {
      contextHeader += `\n[CURRENT PRODUCT PAGE CONTEXT]:\n` +
        `Title: ${productContext.title || 'N/A'}\n` +
        `Price: ₹${productContext.price || 0}\n` +
        `Category: ${productContext.category || 'N/A'}\n` +
        `Description: ${productContext.description || 'N/A'}\n` +
        `Weight/Unit: ${productContext.weightKg || ''} ${productContext.unit || 'kg'}\n` +
        `Availability: ${productContext.availability || 'Immediate'}\n` +
        `Location: ${productContext.city || ''}, ${productContext.state || ''}\n` +
        `Seller: ${productContext.sellerName || 'Verified Seller'}\n\n`;
    }

    if (dbProducts && dbProducts.length > 0) {
      contextHeader += `\n[REAL MATCHING PRODUCTS FROM ECO MART DATABASE]:\n` +
        dbProducts.map((p, idx) => 
          `${idx + 1}. "${p.title}" - Category: ${p.category} | Price: ₹${p.price} for ${p.weightKg || 1} ${p.unit || 'kg'} | Location: ${p.city || 'Tamil Nadu'} | Condition: ${p.condition || 'Good'}`
        ).join('\n') + `\n\n`;
    }

    // Build contents payload
    const contents = [];

    // Format chat history if available
    if (Array.isArray(history) && history.length > 0) {
      // Include up to last 10 messages for memory efficiency
      const recentHistory = history.slice(-10);
      for (const h of recentHistory) {
        if (h.role && h.text) {
          contents.push({
            role: h.role === 'user' ? 'user' : 'model',
            parts: [{ text: h.text }]
          });
        }
      }
    }

    // Prepare current turn parts
    const currentParts = [];
    
    // Add image if attached
    if (image) {
      let base64Data = image;
      if (typeof image === 'string' && image.includes('base64,')) {
        base64Data = image.split('base64,')[1];
      }
      currentParts.push({
        inlineData: {
          mimeType: imageMime || 'image/jpeg',
          data: base64Data
        }
      });
    }

    // Combine context header + user message
    const fullUserPrompt = `${contextHeader}${message || (image ? "What is this image?" : "Hello")}`;
    currentParts.push({ text: fullUserPrompt });

    contents.push({
      role: 'user',
      parts: currentParts
    });

    // Try model fallbacks in order of preference
    const modelsToTry = [
      'gemini-3.6-flash',
      'gemini-3.5-flash',
      'gemini-flash-latest',
      'gemini-3.7-flash',
      'gemini-3.1-flash-lite',
      'gemini-2.5-flash',
      'gemini-1.5-flash'
    ];
    let lastError = null;

    for (const modelName of modelsToTry) {
      try {
        const response = await ai.models.generateContent({
          model: modelName,
          contents: contents,
          config: {
            systemInstruction: SYSTEM_INSTRUCTION,
            temperature: 0.4,
            maxOutputTokens: 1000
          }
        });

        if (response && response.text) {
          return {
            success: true,
            answer: response.text.trim(),
            modelUsed: modelName
          };
        }
      } catch (err) {
        lastError = err;
        console.warn(`Model ${modelName} call failed, trying next... Error:`, err.message);
      }
    }

    throw lastError || new Error("All Gemini model attempts failed");

  } catch (err) {
    console.error("ECO AI Gemini Error:", err.message);
    return {
      success: false,
      answer: "Sorry, ECO AI is temporarily unavailable. Please try again.",
      error: err.message
    };
  }
}
