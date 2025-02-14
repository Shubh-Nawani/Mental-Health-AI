import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { getUserChats, sendMessage, addMessage, removeTypingIndicator, resetChatState } from '../store/features/chatSlice';
import { logout } from '../store/features/authSlice';
import ChatSidebar from '../components/ChatSidebar';
import Message from '../components/Message';
import { Send, LogOut, PanelLeft, MessageCircle, Plus } from 'lucide-react';
import toast from 'react-hot-toast';
import { motion } from 'framer-motion';

const Chat = () => {
  const [input, setInput] = useState('');
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const messagesEndRef = useRef(null);
  const messageContainerRef = useRef(null);
  const inputRef = useRef(null);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  
  const { messages, loading, currentChat } = useSelector((state) => state.chat);
  const { user, token, isAuthenticated } = useSelector((state) => state.auth);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ 
      behavior: 'smooth',
      block: 'end'
    });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    const loadChats = async () => {
      try {
        if (!isAuthenticated || !token || !user?.userId) {
          navigate('/login');
          return;
        }
        await dispatch(getUserChats()).unwrap();
      } catch (error) {
        console.error('Failed to load chats:', error);
        toast.error('Failed to load chat history');
      }
    };

    if (isAuthenticated && token && user?.userId) {
      loadChats();
    }
  }, [dispatch, isAuthenticated, token, user?.userId, navigate]);

  useEffect(() => {
    const handleKeyPress = (e) => {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        handleSubmit(e);
      }
    };

    inputRef.current?.addEventListener('keypress', handleKeyPress);
    return () => inputRef.current?.removeEventListener('keypress', handleKeyPress);
  }, [input]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const messageText = input.trim();
    if (!messageText || !currentChat?.id || loading) return;

    try {
      setInput('');

      dispatch(addMessage({
        text: messageText,
        role: 'user',
        timestamp: new Date().toISOString()
      }));

      dispatch(addMessage({
        text: '',
        role: 'bot',
        isTyping: true,
        timestamp: new Date().toISOString()
      }));

      await dispatch(sendMessage({
        message: messageText,
        chatId: currentChat.id
      })).unwrap();

      dispatch(removeTypingIndicator());

    } catch (error) {
      console.error('Send message error:', error);
      dispatch(removeTypingIndicator());
      toast.error('Failed to send message');
    }
  };

  const handleLogout = () => {
    dispatch(resetChatState());
    dispatch(logout());
    navigate('/login');
  };

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <div className="h-screen flex bg-gradient-to-b from-gray-900 via-gray-900 to-black text-white overflow-hidden">
      <ChatSidebar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />

      <div className="flex-1 flex flex-col relative">
        <div className="bg-gray-900/80 backdrop-blur-md p-6 flex justify-between items-center border-b border-gray-800 shadow-lg">
          <button 
            onClick={toggleSidebar}
            className="p-2 hover:bg-gray-800 rounded-xl transition-all duration-300 hover:scale-110 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <PanelLeft size={24} className="text-gray-300" />
          </button>
          <h1 className="text-xl font-semibold bg-gradient-to-r from-blue-400 to-blue-200 bg-clip-text text-transparent">
            {currentChat?.title || 'Mental Health AI Chat'}
          </h1>
          <button
            onClick={handleLogout}
            className="p-2 hover:bg-gray-800 rounded-xl transition-all duration-300 hover:scale-110 focus:outline-none focus:ring-2 focus:ring-blue-500"
            title="Logout"
          >
            <LogOut size={24} className="text-gray-300" />
          </button>
        </div>

        <div
          ref={messageContainerRef}
          className="flex-1 overflow-y-auto space-y-4 py-8 pb-32 bg-gradient-to-b from-gray-900 to-black custom-scrollbar scroll-smooth"
        >
          {messages.length === 0 ? (
            <div className="text-center text-gray-400 mt-16 px-4">
              <div className="flex flex-col items-center space-y-6">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ 
                    duration: 0.5, 
                    type: "spring",
                    stiffness: 260,
                    damping: 20 
                  }}
                  className="relative"
                >
                  <div className="w-20 h-20 rounded-full bg-gradient-to-br from-gray-800 to-gray-700 flex items-center justify-center shadow-xl">
                    <MessageCircle size={36} className="text-blue-400" />
                  </div>
                  <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
                    <Plus size={16} className="text-white" />
                  </div>
                </motion.div>
                <div className="space-y-2">
                  <p className="text-xl font-medium text-gray-200">Welcome to Your AI Assistant</p>
                  <p className="text-sm text-gray-400 max-w-md mx-auto">
                    Start a conversation by typing your message below. I'm here to help with your questions and concerns.
                  </p>
                </div>
              </div>
            </div>
          ) : (
            <>
              {messages.map((msg, idx) => (
                <Message
                  key={`${msg.timestamp}-${idx}`}
                  message={msg.text}
                  isBot={msg.role === 'bot'}
                  isTyping={msg.isTyping}
                  timestamp={msg.timestamp}
                />
              ))}
              <div ref={messagesEndRef} className="h-4" />
            </>
          )}
        </div>

        <div className="absolute bottom-0 left-0 right-0 flex justify-center pb-8 px-4">
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="w-full max-w-2xl"
          >
            <form
              onSubmit={handleSubmit}
              className="relative"
            >
              <motion.div 
                className="bg-gray-900/90 backdrop-blur-md p-3 rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.3)] border border-gray-800"
                whileHover={{ y: -2 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <div className="flex items-center gap-3">
                  <input
                    ref={inputRef}
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder={currentChat ? "Type your message..." : "Select or create a chat to start"}
                    className="flex-1 p-3 bg-gray-800/50 border border-gray-700 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300 text-gray-100 placeholder-gray-400"
                    disabled={loading || !currentChat}
                  />
                  <motion.button
                    type="submit"
                    disabled={loading || !input.trim() || !currentChat}
                    className="p-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-900"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    {loading ? (
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                    ) : (
                      <Send size={20} />
                    )}
                  </motion.button>
                </div>
              </motion.div>
            </form>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Chat;