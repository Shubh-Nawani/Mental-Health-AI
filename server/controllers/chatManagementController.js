import ChatHistory from "../models/ChatHistory.js";
import User from "../models/User.js";
import { logError } from "../utils/logger.js";

export const createNewChat = async (req, res) => {
  try {
    const { userId, title = "New Chat" } = req.body;

    // Generate title if not provided
    const defaultTitle = `Chat ${new Date().toLocaleString()}`;
    
    const newChat = new ChatHistory({
      userId,
      title: title || defaultTitle,
      messages: []
    });
    await newChat.save();

    // Add to user's chats
    await User.findByIdAndUpdate(userId, {
      $push: { chats: newChat._id }
    });

    res.status(201).json({
      chatId: newChat._id,
      title: newChat.title,
      timestamp: newChat.createdAt
    });
  } catch (error) {
    logError("Create Chat Error:", error);
    res.status(500).json({ error: "Failed to create chat" });
  }
};

export const getUserChats = async (req, res) => {
  try {
    const { userId } = req.params;
    const { page = 1, limit = 10 } = req.query;

    const chats = await ChatHistory.find({ userId, isActive: true })
      .select('_id title messages lastInteraction')
      .sort({ lastInteraction: -1 })
      .lean();

    // Format chat previews with messages
    const formattedChats = chats.map(chat => ({
      id: chat._id,
      title: chat.title,
      lastMessage: chat.messages[chat.messages.length - 1]?.text || "",
      messages: chat.messages, // Include full message history
      messageCount: chat.messages.length,
      lastInteraction: chat.lastInteraction
    }));

    res.json({
      chats: formattedChats,
      page: parseInt(page),
      limit: parseInt(limit)
    });
  } catch (error) {
    logError("Get Chats Error:", error);
    res.status(500).json({ error: "Failed to fetch chats" });
  }
};

export const switchChat = async (req, res) => {
  try {
    const { userId, chatId } = req.params;
    
    const chat = await ChatHistory.findOne({ 
      _id: chatId, 
      userId,
      isActive: true 
    });

    if (!chat) {
      return res.status(404).json({ error: "Chat not found" });
    }

    // Return full chat data including all messages
    res.json({
      chatId: chat._id,
      title: chat.title,
      messages: chat.messages.map(msg => ({
        text: msg.text,
        role: msg.role,
        timestamp: msg.timestamp,
        source: msg.source
      }))
    });
  } catch (error) {
    logError("Switch Chat Error:", error);
    res.status(500).json({ error: "Failed to switch chat" });
  }
};

export const deleteChat = async (req, res) => {
  try {
    const { chatId, userId } = req.params;

    await ChatHistory.findOneAndDelete({ _id: chatId, userId });
    await User.findByIdAndUpdate(userId, {
      $pull: { chats: chatId }
    });

    res.json({ message: "Chat deleted successfully" });
  } catch (error) {
    logError("Delete Chat Error:", error);
    res.status(500).json({ error: "Failed to delete chat" });
  }
};