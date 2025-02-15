import axios from "axios";
import dotenv from "dotenv";
import { logError, logInfo } from "../utils/logger.js";
import { Agent } from "https";
dotenv.config();

const MODELS = {
  HUGGINGFACE: "facebook/blenderbot-400M-distill",
  GEMINI: "gemini-1.5-pro"
};

const MODEL_CONFIGS = {
  huggingface: {
    temperature: 0.7,
    max_length: 200,
    top_k: 50,
    top_p: 0.95
  },
  gemini: {
    temperature: 0.7,
    topP: 0.8,
    maxOutputTokens: 250
  }
};

// Create clients with proper configuration
const huggingFaceClient = axios.create({
  baseURL: "https://api-inference.huggingface.co",
  headers: {
    'Authorization': `Bearer ${process.env.HUGGINGFACE_API_KEY}`,
    'Content-Type': 'application/json'
  },
  httpsAgent: new Agent({ rejectUnauthorized: false }),
  timeout: 30000,
  retry: 2,
  retryDelay: 1000
});

const geminiClient = axios.create({
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json'
  },
  // Add SSL verification bypass for development
  httpsAgent: new Agent({ 
    rejectUnauthorized: false 
  })
});

export const getHuggingFaceResponse = async (message, chatHistory) => {
  try {
    const response = await huggingFaceClient.post(
      `/models/${MODELS.HUGGINGFACE}`,
      {
        inputs: message,  // Simplified input format
        parameters: {
          do_sample: true,
          max_length: 200,  // Changed from max_new_tokens
          temperature: 0.7,
          top_k: 50,
          top_p: 0.95
        }
      }
    );

    const generatedText = response.data[0]?.generated_text;
    if (!generatedText) return null;

    const quality = analyzeResponseQuality(generatedText, message);
    return {
      response: generatedText,
      confidence: quality.score,
      source: 'huggingface',
      metrics: quality.metrics
    };
  } catch (error) {
    logError("HuggingFace Error:", error);
    return null;
  }
};
export const getGeminiResponse = async (message, chatHistory) => {
  try {
    const prompt = buildGeminiPrompt(message, formatChatHistory(chatHistory));
    const response = await geminiClient.post(
      `https://generativelanguage.googleapis.com/v1/models/${MODELS.GEMINI}:generateContent`,
      {
        contents: [{
          role: "user",
          parts: [{
            text: prompt
          }]
        }],
        generationConfig: {
          temperature: 0.7,
          topP: 0.8,
          maxOutputTokens: 250
        }
      },
      {
        params: {
          key: process.env.GEMINI_API_KEY
        },
        headers: {
          'Content-Type': 'application/json'
        }
      }
    );

    const generatedText = formatResponse(response.data?.candidates?.[0]?.content?.parts?.[0]?.text);
    if (!generatedText) return null;

    const quality = analyzeResponseQuality(generatedText, message, prompt);
    return {
      response: generatedText,
      confidence: quality.score,
      source: 'gemini',
      metrics: quality.metrics
    };
  } catch (error) {
    [`logError`](server/utils/logger.js)("Gemini Error:", error);
    return null;
  }
};



function formatChatHistory(history) {
  if (!history?.length) return '';
  return history
    .slice(-3)
    .map(msg => `${msg.role}: ${msg.text}`)
    .join('\n');
}


function buildGeminiPrompt(message, history) {
  return `You are a compassionate mental health assistant. Respond naturally and conversationally, while maintaining professionalism. Keep responses concise and friendly.

Previous Context:
${history}

Current Message: "${message}"

Guidelines:
- Start with a warm, natural greeting when appropriate
- Show empathy through conversational language
- Give practical advice in a friendly way
- Use casual transitions between topics
- Include gentle questions to encourage conversation
- Keep medical terminology minimal unless specifically asked
- Use markdown formatting for emphasis and structure

Remember to:
- Highlight emotional words in _italics_
- Use **bold** for key points
- Break long responses into readable paragraphs
- Use bullet points sparingly and naturally
- End with an open-ended question

Respond in a way that feels like talking to a supportive friend who happens to be a mental health professional.`;
}

function formatResponse(text) {
  if (!text) return null;
  
  // Split into paragraphs and process each
  const paragraphs = text.split('\n').map(line => line.trim()).filter(Boolean);
  
  return paragraphs.map(line => {
    // Format therapeutic terms with subtle emphasis
    line = line.replace(
      /\b(anxiety|stress|depression|overwhelmed|worried|scared)\b/gi,
      '_$1_'
    );
    
    // Format gentle emphasis
    line = line.replace(
      /\b(remember|important|key takeaway|try this)\b:/gi,
      '**$1:**'
    );
    
    // Format suggestions naturally
    if (line.match(/^(Here'?s?( are)? (what|some|a few)|Try these|You could)/i)) {
      return `\n${line}`;
    }
    
    // Format questions with subtle emphasis
    if (line.endsWith('?')) {
      return `\n> ${line}`;
    }
    
    return line;
  }).join('\n\n');
}


function analyzeResponseQuality(response, message, context = '') {
  if (!response) return { score: 0.5, metrics: {} };

  try {
    // Calculate base metrics
    const metrics = {
      contextRelevance: calculateContextRelevance(response, message + ' ' + context),
      emotionalSupport: detectEmotionalSupport(response),
      actionability: measureActionability(response),
      consistency: checkConsistency(response, message)
    };

    // Validate and normalize metrics
    const validatedMetrics = Object.fromEntries(
      Object.entries(metrics)
        .map(([key, value]) => [
          key,
          // Handle NaN and normalize between 0 and 1
          Number.isNaN(value) ? 0.5 : Math.min(Math.max(value, 0), 1)
        ])
        .filter(([_, value]) => typeof value === 'number')  // Ensure only valid numbers
    );

    // Calculate overall score
    const values = Object.values(validatedMetrics);
    const score = values.length > 0 
      ? values.reduce((a, b) => a + b, 0) / values.length 
      : 0.5;

    return { 
      score: Number.isNaN(score) ? 0.5 : Math.min(Math.max(score, 0), 1),
      metrics: validatedMetrics
    };
  } catch (error) {
    [`logError`](server/utils/logger.js)("Response Analysis Error:", error);
    return { 
      score: 0.5, 
      metrics: {
        contextRelevance: 0.5,
        emotionalSupport: 0.5,
        actionability: 0.5,
        consistency: 0.5
      }
    };
  }
}

// Analysis helper functions remain unchanged
function calculateContextRelevance(response, context) {
  if (!response || !context) return 0.5;
  const contextWords = new Set(context.toLowerCase().split(/\s+/));
  const responseWords = response.toLowerCase().split(/\s+/);
  const matches = responseWords.filter(word => contextWords.has(word));
  return Math.min(matches.length / Math.sqrt(contextWords.size), 1);
}

function detectEmotionalSupport(response) {
  if (!response) return 0.5;
  const empathyPatterns = [
    /understand|hear you|must be|feel/i,
    /support|help|guide|assist/i,
    /\?$/m,
    /let's|we can|together/i
  ];
  const matches = empathyPatterns.filter(pattern => pattern.test(response));
  return Math.min((matches.length / empathyPatterns.length) + 0.3, 1);
}

function measureActionability(response) {
  if (!response) return 0.5;
  const actionPatterns = [
    /try|practice|consider|suggest/i,
    /\d\.|^\s*-/m,
    /first|then|next|finally/i,
    /could|would|might|can/i
  ];
  const matches = actionPatterns.filter(pattern => pattern.test(response));
  return Math.min((matches.length / actionPatterns.length) + 0.2, 1);
}

function checkConsistency(response, context) {
  if (!response || !context) return 0.7;
  const contextThemes = extractThemes(context);
  const responseThemes = extractThemes(response);
  const commonThemes = contextThemes.filter(theme => responseThemes.includes(theme));
  return Math.min((commonThemes.length / contextThemes.length) + 0.5, 1);
}

function extractThemes(text) {
  const themes = [
    'anxiety', 'stress', 'depression', 'sleep', 'work',
    'relationship', 'family', 'health', 'future', 'emotion'
  ];
  return themes.filter(theme => text.toLowerCase().includes(theme));
}

