import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const BASE_URL = 'http://localhost:8080/api';

// Create new chat
// Route: POST /api/chats/new
// Controller: createNewChat in chatManagementController.js
export const createNewChat = createAsyncThunk(
    'chat/createNewChat',
    async (_, { rejectWithValue, getState }) => {
      try {
        const { auth } = getState();
        if (!auth.user?.userId || !auth.token) {
          throw new Error('User not authenticated');
        }
  
        const response = await axios.post(`${BASE_URL}/chats/new`, 
          { userId: auth.user.userId },
          { 
            headers: { 
              Authorization: `Bearer ${auth.token}`,
              'Content-Type': 'application/json'
            } 
          }
        );
  
        if (!response.data?.chatId) {
          throw new Error('Invalid response from server');
        }
  
        return {
          chatId: response.data.chatId,
          title: response.data.title,
          timestamp: response.data.timestamp
        };
      } catch (error) {
        console.error('Create chat error:', error);
        return rejectWithValue({ 
          error: error.response?.data?.message || 'Failed to create chat' 
        });
      }
    }
  );

// Get user's chats
// Route: GET /api/chats/user/:userId
// Controller: getUserChats in chatManagementController.js
export const getUserChats = createAsyncThunk(
  'chat/getUserChats',
  async (_, { rejectWithValue, getState }) => {
    try {
      const { auth } = getState();
      const response = await axios.get(
        `${BASE_URL}/chats/user/${auth.user?.userId}`,
        { headers: { Authorization: `Bearer ${auth.token}` } }
      );
      // Server returns { chats: [{ _id, title, messages, lastMessage, lastInteraction }] }
      return response.data;
    } catch (error) {
      console.error('Get chats error:', error);
      return rejectWithValue({ error: 'Failed to fetch chats' });
    }
  }
);

// Switch chat
// Route: GET /api/chats/:chatId/user/:userId
// Controller: switchChat in chatManagementController.js
export const switchChat = createAsyncThunk(
  'chat/switchChat',
  async ({ userId, chatId }, { rejectWithValue, getState }) => {
    try {
      const { auth } = getState();
      const response = await axios.get(
        `${BASE_URL}/chats/${chatId}/user/${userId}`,
        { headers: { Authorization: `Bearer ${auth.token}` } }
      );
      // Server returns { chatId, title, messages: [{ text, role, timestamp, source }] }
      return response.data;
    } catch (error) {
      console.error('Switch chat error:', error);
      return rejectWithValue({ error: 'Failed to switch chat' });
    }
  }
);

// Send message
// Route: POST /api/chat
// Controller: chatWithBot in chatController.js
export const sendMessage = createAsyncThunk(
  'chat/sendMessage',
  async ({ message, chatId }, { rejectWithValue, getState }) => {
    try {
      const { auth } = getState();
      const response = await axios.post(`${BASE_URL}/chat`,
        { 
          message,
          userId: auth.user?.userId,
          chatId 
        },
        { headers: { Authorization: `Bearer ${auth.token}` } }
      );
      // Server returns { response, source, confidence, metrics, timestamp, messageId }
      return { 
        ...response.data,
        originalMessage: message 
      };
    } catch (error) {
      console.error('Send message error:', error);
      return rejectWithValue({ error: 'Failed to send message' });
    }
  }
);

// Delete chat
// Route: DELETE /api/chats/:chatId/user/:userId
// Controller: deleteChat in chatManagementController.js
export const deleteChat = createAsyncThunk(
  'chat/deleteChat',
  async ({ chatId }, { rejectWithValue, getState }) => {
    try {
      const { auth } = getState();
      await axios.delete(
        `${BASE_URL}/chats/${chatId}/user/${auth.user?.userId}`,
        { headers: { Authorization: `Bearer ${auth.token}` } }
      );
      return chatId;
    } catch (error) {
      console.error('Delete chat error:', error);
      return rejectWithValue({ error: 'Failed to delete chat' });
    }
  }
);

// Get chat history
// Route: GET /api/chat/history/:userId
// Controller: getChatHistory in chatController.js
export const getChatHistory = createAsyncThunk(
  'chat/getChatHistory',
  async (_, { rejectWithValue, getState }) => {
    try {
      const { auth } = getState();
      const response = await axios.get(
        `${BASE_URL}/chat/history/${auth.user?.userId}`,
        { headers: { Authorization: `Bearer ${auth.token}` } }
      );
      // Server returns { userId, messages, count, page, limit }
      return response.data;
    } catch (error) {
      console.error('Get history error:', error);
      return rejectWithValue({ error: 'Failed to fetch chat history' });
    }
  }
);

const chatSlice = createSlice({
  name: 'chat',
  initialState: {
    chats: [],
    currentChat: null,
    messages: [],
    loading: false,
    error: null
  },
  reducers: {
    resetChatState: (state) => {
        state.chats = [];
        state.currentChat = null;
        state.messages = [];
        state.loading = false;
        state.error = null;
      },
    setCurrentChat: (state, action) => {
        state.currentChat = action.payload;
        if (action.payload === null) {
          state.messages = [];
        }
      },
    clearChat: (state) => {
      state.messages = [];
    },
    addMessage: (state, action) => {
      state.messages.push(action.payload);
    },
    removeTypingIndicator: (state) => {
      state.messages = state.messages.filter(msg => !msg.isTyping);
    }
  },
  extraReducers: (builder) => {
    builder
      // Create new chat
      .addCase(createNewChat.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createNewChat.fulfilled, (state, action) => {
        state.loading = false;
        const newChat = {
          id: action.payload.chatId,
          title: action.payload.title,
          messages: [],
          lastInteraction: action.payload.timestamp
        };
        state.chats.unshift(newChat);
        state.currentChat = newChat;
        state.messages = [];
      })
      .addCase(createNewChat.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.error;
      })
      // Get user chats
      .addCase(getUserChats.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getUserChats.fulfilled, (state, action) => {
        state.loading = false;
        state.chats = action.payload.chats?.map(chat => ({
          id: chat._id || chat.id,
          title: chat.title,
          messages: chat.messages || [],
          lastMessage: chat.lastMessage,
          lastInteraction: chat.lastInteraction
        }));
        if (state.chats?.length > 0 && !state.currentChat) {
          state.currentChat = state.chats[0];
          state.messages = state.chats[0].messages || [];
        }
      })
      .addCase(getUserChats.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.error;
      })
      // Switch chat
      .addCase(switchChat.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(switchChat.fulfilled, (state, action) => {
        state.loading = false;
        state.currentChat = {
          id: action.payload.chatId,
          title: action.payload.title
        };
        state.messages = action.payload.messages || [];
      })
      .addCase(switchChat.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.error;
      })
      // Send message
      .addCase(sendMessage.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(sendMessage.fulfilled, (state, action) => {
        state.loading = false;
        // Only add the bot's response since user message is already added
        const botMessage = {
          text: action.payload.response,
          role: 'bot',
          timestamp: action.payload.timestamp,
          source: action.payload.source,
          confidence: action.payload.confidence,
          metrics: action.payload.metrics
        };
        
        state.messages = [...state.messages.filter(m => !m.isTyping), botMessage];
        
        // Update chat list
        const chatIndex = state.chats.findIndex(c => c.id === state.currentChat?.id);
        if (chatIndex !== -1) {
          state.chats[chatIndex] = {
            ...state.chats[chatIndex],
            lastMessage: action.payload.response,
            lastInteraction: action.payload.timestamp
          };
        }
    })
      .addCase(sendMessage.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.error;
      })
      // Delete chat
      .addCase(deleteChat.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteChat.fulfilled, (state, action) => {
        state.loading = false;
        state.chats = state.chats.filter(chat => chat.id !== action.payload);
        if (state.currentChat?.id === action.payload) {
          state.currentChat = state.chats[0] || null;
          state.messages = state.chats[0]?.messages || [];
        }
      })
      .addCase(deleteChat.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.error;
      })
      // Get chat history
      .addCase(getChatHistory.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getChatHistory.fulfilled, (state, action) => {
        state.loading = false;
        if (state.currentChat) {
          state.messages = action.payload.messages;
        }
      })
      .addCase(getChatHistory.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.error;
      });
  }
});

export const { clearChat, addMessage, removeTypingIndicator, setCurrentChat, resetChatState } = chatSlice.actions;
export default chatSlice.reducer;