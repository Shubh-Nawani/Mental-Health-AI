import express from 'express';
import { chatWithBot, getChatHistory } from '../controllers/chatController.js';
import { register, login } from '../controllers/authController.js';
import { 
  createNewChat, 
  getUserChats, 
  deleteChat 
} from '../controllers/chatManagementController.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

// Auth routes

router.post('/register', register);
router.post('/login', login);

// Chat management routes
router.post('/chats/new', authenticateToken, createNewChat);
router.get('/chats/user/:userId', authenticateToken, getUserChats);
router.delete('/chats/:chatId/user/:userId', authenticateToken, deleteChat);

// Chat interaction routes
router.post('/chat', authenticateToken, chatWithBot);
router.get('/chat/history/:userId', authenticateToken, getChatHistory);

export default router;