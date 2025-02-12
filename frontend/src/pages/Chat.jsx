import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { getUserChats, sendMessage, addMessage, removeTypingIndicator, resetChatState } from '../store/features/chatSlice';
import { logout } from '../store/features/authSlice';
import ChatSidebar from '../components/ChatSidebar';
import Message from '../components/Message';
import { IoSend, IoLogOut } from 'react-icons/io5';
import toast from 'react-hot-toast';

const Chat = () => {
    const [input, setInput] = useState('');
    const messagesEndRef = useRef(null);
    const messageContainerRef = useRef(null);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { messages, loading, currentChat } = useSelector((state) => state.chat);
    const { user, token, isAuthenticated } = useSelector((state) => state.auth);

    const scrollToBottom = () => {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    // Auto scroll when messages update
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
    
    const handleSubmit = async (e) => {
        e.preventDefault();
        const messageText = input.trim();
        if (!messageText || !currentChat?.id) return;
      
        try {
          setInput('');
          
          // Add user message immediately
          dispatch(addMessage({
            text: messageText,
            role: 'user',
            timestamp: new Date().toISOString()
          }));
      
          // Add typing indicator
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

    return (
      <div className="h-screen flex bg-gray-50">
        <ChatSidebar />
        
        <div className="flex-1 flex flex-col">
          <div className="bg-white shadow-sm p-4 flex justify-between items-center">
            <h1 className="text-xl font-semibold text-gray-800">
              {currentChat?.title || 'Mental Health AI Chat'}
            </h1>
            <button 
              onClick={handleLogout}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              title="Logout"
            >
              <IoLogOut size={24} className="text-gray-600" />
            </button>
          </div>
          
          <div 
            ref={messageContainerRef}
            className="flex-1 overflow-y-auto p-4 space-y-4 scroll-smooth scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent hover:scrollbar-thumb-gray-400"
          >
            {messages.length === 0 ? (
              <div className="text-center text-gray-500 mt-8">
                Start a conversation by typing a message below
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
                    source={msg.source}
                  />
                ))}
                <div ref={messagesEndRef} />
              </>
            )}
          </div>

          <form 
            onSubmit={handleSubmit}
            className="bg-white border-t p-4 flex gap-2"
          >
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={currentChat ? "Type your message..." : "Select or create a chat to start"}
              className="flex-1 p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
              disabled={loading || !currentChat}
            />
            <button
              type="submit"
              disabled={loading || !input.trim() || !currentChat}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
            >
              {loading ? (
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
              ) : (
                <IoSend size={20} />
              )}
            </button>
          </form>
        </div>
      </div>
    );
};

export default Chat;