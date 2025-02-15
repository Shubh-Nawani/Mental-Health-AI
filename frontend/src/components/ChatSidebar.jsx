import { useDispatch, useSelector } from 'react-redux';
import { createNewChat, switchChat, deleteChat, setCurrentChat } from '../store/features/chatSlice';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Trash, MessageCircle, PanelLeft } from 'lucide-react';
import toast from 'react-hot-toast';

const ChatSidebar = ({ isOpen, toggleSidebar }) => {
  const dispatch = useDispatch();
  const { chats, currentChat, loading } = useSelector((state) => state.chat);
  const { user } = useSelector((state) => state.auth);

  const handleNewChat = async () => {
    if (loading || !user?.userId) return;

    try {
      const result = await dispatch(createNewChat()).unwrap();
      if (result?.chatId) {
        dispatch(
          setCurrentChat({
            id: result.chatId,
            title: result.title,
          })
        );
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
      dispatch(setCurrentChat(null));

      const result = await dispatch(
        switchChat({
          userId: user.userId,
          chatId,
        })
      ).unwrap();

      if (!result) {
        throw new Error('Failed to load chat data');
      }

      dispatch(
        setCurrentChat({
          id: chatId,
          title: result.title,
          messages: result.messages,
        })
      );
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

      await dispatch(
        deleteChat({
          userId: user.userId,
          chatId,
        })
      ).unwrap();

      if (currentChat?.id === chatId) {
        const nextChat = chats.find((chat) => chat.id !== chatId);
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
      initial={{ x: -300, opacity: 0 }}
      animate={{ x: isOpen ? 0 : -300, opacity: isOpen ? 1 : 0 }}
      transition={{ duration: 0.2, ease: [0.42, 0, 0.58, 1] }}
      className="w-72 bg-gradient-to-b from-gray-800 to-gray-900 h-screen flex flex-col shadow-xl fixed top-0 left-0 z-20 border-r border-gray-700"
    >
      <div className="p-6 flex justify-between items-center border-b border-gray-700">
        <button
          onClick={toggleSidebar}
          className="text-gray-300 hover:text-white transition-colors"
        >
          <PanelLeft size={24} />
        </button>
        <button
          onClick={handleNewChat}
          disabled={loading || !user?.userId}
          className="flex items-center justify-center gap-2 px-4 py-2 text-white bg-blue-600 rounded-xl hover:bg-blue-700 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed hover:scale-105"
        >
          {loading ? (
            <div className="animate-spin rounded-full h-5 w-5 border-2 border-white" />
          ) : (
            <>
              <Plus size={20} />
              <span className="font-medium">New Chat</span>
            </>
          )}
        </button>
      </div>

      <div className="flex-1 overflow-y-auto custom-scrollbar">
        <AnimatePresence>
          {chats.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="text-gray-400 text-center p-8"
            >
              <MessageCircle size={40} className="mx-auto mb-4 text-gray-500" />
              <p className="text-lg font-medium mb-2">No chats yet</p>
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
                className={`flex items-center justify-between p-4 mx-2 my-1 cursor-pointer rounded-xl transition-all duration-300 hover:bg-gray-700/50
                  ${currentChat?.id === chat.id
                    ? 'bg-gray-700/50 shadow-lg border border-gray-600'
                    : 'hover:border hover:border-gray-700'
                  }`}
              >
                <div className="flex-1 min-w-0">
                  <h3 className="text-gray-200 truncate font-medium">
                    {chat.title || 'New Chat'}
                  </h3>
                </div>
                <button
                  onClick={(e) => handleDeleteChat(chat.id, e)}
                  disabled={loading}
                  className="ml-2 p-2 text-gray-400 hover:text-red-400 rounded-lg hover:bg-gray-600/50 transition-all duration-300 disabled:opacity-50"
                  title="Delete chat"
                >
                  <Trash size={16} />
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