import ChatHistory from "../models/ChatHistory.js";
import User from "../models/User.js";
import { logError } from "../utils/logger.js";

export const createNewChat = async (req, res) => {
  try {
    const { userId, title } = req.body;
    
    const newChat = new ChatHistory({
      userId,
      title: title || "New Chat",
      messages: []
    });
    await newChat.save();

    // Add chat to user's chats array
    await User.findByIdAndUpdate(userId, {
      $push: { chats: newChat._id }
    });

    res.status(201).json(newChat);
  } catch (error) {
    logError("Create Chat Error:", error);
    res.status(500).json({ error: "Failed to create chat" });
  }
};

export const getUserChats = async (req, res) => {
  try {
    const { userId } = req.params;
    const { page = 1, limit = 10 } = req.query;

    const chats = await ChatHistory.find({ userId })
      .select('title lastInteraction messages')
      .sort({ lastInteraction: -1 })
      .skip((page - 1) * limit)
      .limit(limit);

    res.json({
      chats,
      page: parseInt(page),
      limit: parseInt(limit)
    });
  } catch (error) {
    logError("Get Chats Error:", error);
    res.status(500).json({ error: "Failed to fetch chats" });
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