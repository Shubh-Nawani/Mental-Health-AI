import { useDispatch, useSelector } from 'react-redux';
import { createNewChat, switchChat, deleteChat, setCurrentChat } from '../store/features/chatSlice';
import { motion, AnimatePresence } from 'framer-motion';
import { IoAddCircleOutline, IoTrashOutline, IoChatbubbleOutline } from 'react-icons/io5';
import toast from 'react-hot-toast';

const ChatSidebar = () => {
  const dispatch = useDispatch();
  const { chats, currentChat, loading } = useSelector((state) => state.chat);
  const { user } = useSelector((state) => state.auth);

  const handleNewChat = async () => {
    if (loading || !user?.userId) return;
    
    try {
      const result = await dispatch(createNewChat()).unwrap();
      if (result?.chatId) {
        // Set as current chat after creation
        dispatch(setCurrentChat({
          id: result.chatId,
          title: result.title
        }));
        toast.success('New chat created');
      } else {
        throw new Error('Invalid chat data received');
      }
    } catch (error) {
      console.error('Failed to create chat:', error);
      toast.error(error.error || 'Failed to create new chat');
    }
  };

  const handleSwitchChat = async (chatId) => {
    if (loading || currentChat?.id === chatId || !user?.userId) return;

    try {
      // Clear current chat before switching
      dispatch(setCurrentChat(null));
      
      const result = await dispatch(switchChat({ 
        userId: user.userId, 
        chatId 
      })).unwrap();

      if (!result) {
        throw new Error('Failed to load chat data');
      }

      // Set current chat after successful switch
      dispatch(setCurrentChat({
        id: chatId,
        title: result.title,
        messages: result.messages
      }));
    } catch (error) {
      console.error('Switch chat error:', error);
      toast.error('Failed to load chat history');
    }
  };

  const handleDeleteChat = async (chatId, e) => {
    e.stopPropagation();
    if (loading || !user?.userId) return;

    try {
      if (!window.confirm('Are you sure you want to delete this chat?')) {
        return;
      }

      await dispatch(deleteChat({ 
        userId: user.userId, 
        chatId 
      })).unwrap();

      // If deleted chat was current, set first available chat as current
      if (currentChat?.id === chatId) {
        const nextChat = chats.find(chat => chat.id !== chatId);
        dispatch(setCurrentChat(nextChat || null));
      }

      toast.success('Chat deleted successfully');
    } catch (error) {
      console.error('Delete chat error:', error);
      toast.error('Failed to delete chat');
    }
  };

  return (
    <motion.div 
      initial={{ x: -264 }}
      animate={{ x: 0 }}
      className="w-64 bg-gray-800 h-screen flex flex-col shadow-lg"
    >
      <div className="p-4">
        <button
          onClick={handleNewChat}
          disabled={loading || !user?.userId}
          className="w-full flex items-center justify-center gap-2 p-3 text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? (
            <div className="animate-spin rounded-full h-5 w-5 border-2 border-white" />
          ) : (
            <>
              <IoAddCircleOutline size={20} />
              New Chat
            </>
          )}
        </button>
      </div>

      <div className="flex-1 overflow-y-auto">
        <AnimatePresence>
          {chats.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="text-gray-400 text-center p-4"
            >
              <IoChatbubbleOutline size={40} className="mx-auto mb-2" />
              <p>No chats yet</p>
              <p className="text-sm">Start a new conversation</p>
            </motion.div>
          ) : (
            chats.map((chat) => (
              <motion.div
                key={chat.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                onClick={() => handleSwitchChat(chat.id)}
                className={`flex items-center justify-between p-4 cursor-pointer hover:bg-gray-700 transition-colors ${
                  currentChat?.id === chat.id ? 'bg-gray-700' : ''
                }`}
              >
                <div className="flex-1 min-w-0">
                  <h3 className="text-white truncate">{chat.title || 'New Chat'}</h3>
                  {chat.lastMessage && (
                    <p className="text-gray-400 text-sm truncate">
                      {chat.lastMessage}
                    </p>
                  )}
                </div>
                <button
                  onClick={(e) => handleDeleteChat(chat.id, e)}
                  disabled={loading}
                  className="ml-2 p-2 text-gray-400 hover:text-red-500 rounded-full hover:bg-gray-600 transition-colors disabled:opacity-50"
                  title="Delete chat"
                >
                  <IoTrashOutline size={16} />
                </button>
              </motion.div>
            ))
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
};

export default ChatSidebar;