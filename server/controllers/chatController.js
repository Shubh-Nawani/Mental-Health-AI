import ChatHistory from "../models/ChatHistory.js";
import { getRiveResponse } from "../services/rivescriptService.js";
import { getGeminiResponse, getHuggingFaceResponse } from "../services/aiService.js";
import { logInfo, logError } from "../utils/logger.js";

// Input validation middleware
const validateChatInput = (message) => {
  if (!message?.trim()) {
    throw new Error('Message cannot be empty');
  }
  if (message.length > 500) {
    throw new Error('Message too long (max 500 characters)');
  }
  return message.trim();
};

// Get best response from available models
export const getBestResponse = async (message, chatHistory) => {
  try {
    // Try RiveScript first for exact matches
    const riveResponse = await getRiveResponse(chatHistory.userId, message);
    if (riveResponse?.confidence > 0.8) {
      return riveResponse;
    }

    // Try AI models in parallel
    const [geminiRes, huggingfaceRes] = await Promise.all([
      getGeminiResponse(message, chatHistory),
      getHuggingFaceResponse(message, chatHistory)
    ]);

    // Select best response
    const responses = [riveResponse, geminiRes, huggingfaceRes]
      .filter(r => r && r.response);

    if (responses.length === 0) {
      return getFallbackResponse();
    }

    return responses.reduce((best, current) => 
      (current.confidence > best.confidence) ? current : best
    );

  } catch (error) {
    logError("Response Selection Error:", error);
    return getFallbackResponse();
  }
};

export const chatWithBot = async (req, res) => {
  const { userId, message, chatId } = req.body;
  
  try {
    const cleanMessage = validateChatInput(message);
    
    // If no chatId is provided, create a new chat
    let chatHistory;
    if (!chatId) {
      chatHistory = new ChatHistory({
        userId,
        title: "New Chat",
        messages: []
      });
      await chatHistory.save();
    } else {
      chatHistory = await ChatHistory.findOne({ 
        _id: chatId,
        userId,
        isActive: true 
      });
    }

    if (!chatHistory) {
      return res.status(404).json({ error: "Chat not found" });
    }

    logInfo(`Processing message from ${userId}: "${cleanMessage}"`);

    // Get best response from available models
    const { response: botResponse, confidence = 0.5, source = 'fallback', metrics = {} } = 
      await getBestResponse(cleanMessage, chatHistory);

    // Validate metrics before saving
    const validatedMetrics = new Map(
      Object.entries(metrics).map(([key, value]) => [
        key, 
        isNaN(value) ? 0.5 : Math.min(Math.max(value, 0), 1)
      ])
    );

    // Save conversation
    const conversation = {
      user: {
        role: "user",
        text: cleanMessage,
        timestamp: new Date()
      },
      bot: {
        role: "bot",
        text: botResponse,
        source,
        confidence: isNaN(confidence) ? 0.5 : Math.min(Math.max(confidence, 0), 1),
        metrics: validatedMetrics,
        timestamp: new Date()
      }
    };

    chatHistory.messages.push(conversation.user, conversation.bot);
    await chatHistory.save();

    logInfo(`Response sent (${source}, confidence: ${confidence})`);

    res.json({
      response: botResponse,
      source,
      confidence: conversation.bot.confidence,
      metrics: Object.fromEntries(validatedMetrics),
      timestamp: conversation.bot.timestamp,
      messageId: chatHistory.messages[chatHistory.messages.length - 1]._id
    });

  } catch (error) {
    logError("Chat Processing Error:", error);
    res.status(error.message.includes('Message') ? 400 : 500).json({ 
      error: error.message.includes('Message') ? error.message : "Internal Server Error",
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

export const getChatHistory = async (req, res) => {
  try {
    const { userId } = req.params;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 50;
    
    const chatHistory = await ChatHistory.findOne({ userId })
      .select('messages')
      .sort({ 'messages.timestamp': -1 })
      .skip((page - 1) * limit)
      .limit(limit);
    
    if (!chatHistory) {
      return res.status(404).json({ error: "No chat history found" });
    }

    res.json({
      userId: chatHistory.userId,
      messages: chatHistory.messages,
      count: chatHistory.messages.length,
      page,
      limit
    });
  } catch (error) {
    logError("History Retrieval Error:", error);
    res.status(500).json({ 
      error: "Internal Server Error",
      details: process.env.NODE_ENV === 'development' ? error.message : undefined 
    });
  }
};