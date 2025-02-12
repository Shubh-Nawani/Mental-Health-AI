"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { 
  Menu,
  Plus,
  Share2,
  Send,
  Pin,
  MessageSquare,
  ChevronRight,
  Link,
  Image,
  FileText,
  ThumbsUp,
  ThumbsDown,
  RotateCcw,
  Copy,
  Check,
  User,
  Settings,
  LogOut
} from "lucide-react"

export default function Chat() {
  const [messages, setMessages] = useState([])
  const [input, setInput] = useState("")
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const [isTyping, setIsTyping] = useState(false)
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  const [isPinned, setIsPinned] = useState(false)
  const [copiedMessageId, setCopiedMessageId] = useState(null)
  const [previousChats] = useState([
    { id: 1, title: "Project Discussion", date: "Today" },
    { id: 2, title: "Meeting Notes", date: "Yesterday" },
    { id: 3, title: "Product Review", date: "Last week" }
  ])

  useEffect(() => {
    const handleMouseMove = (e) => {
      setMousePosition({ x: e.clientX, y: e.clientY })
    }

    window.addEventListener('mousemove', handleMouseMove)
    return () => window.removeEventListener('mousemove', handleMouseMove)
  }, [])

  const sendMessage = () => {
    if (!input.trim()) return
    setIsTyping(true)
    const newMessage = { 
      id: Date.now(),
      text: input, 
      sender: "user",
    }
    setMessages([...messages, newMessage])
    setInput("")
    
    setTimeout(() => {
      typeMessage("Hello! How can I assist you today?")
    }, 500)
  }

  const typeMessage = async (text) => {
    const messageId = Date.now()
    const newMessage = { 
      id: messageId,
      text: "", 
      sender: "bot", 
      isTyping: true,
    }
    setMessages(prev => [...prev, newMessage])
    
    let currentText = ""
    for (let char of text) {
      currentText += char
      setMessages(prev => [
        ...prev.slice(0, -1),
        { ...newMessage, text: currentText }
      ])
      await new Promise(resolve => setTimeout(resolve, 25))
    }
    
    setMessages(prev => [
      ...prev.slice(0, -1),
      { ...newMessage, text: currentText, isTyping: false }
    ])
    setIsTyping(false)
  }

  const handleCopy = async (text, messageId) => {
    try {
      await navigator.clipboard.writeText(text)
      setCopiedMessageId(messageId)
      setTimeout(() => setCopiedMessageId(null), 2000)
    } catch (err) {
      console.error('Failed to copy text:', err)
    }
  }

  return (
    <div className="h-screen flex flex-col relative overflow-hidden bg-gray-900">
      {/* Cursor follow gradient */}
      <div 
        className="fixed inset-0 pointer-events-none"
        style={{
          background: `radial-gradient(600px circle at ${mousePosition.x}px ${mousePosition.y}px, rgba(29, 78, 216, 0.15), transparent 80%)`,
        }}
      />

      <header className="flex items-center justify-between px-4 py-3 border-b border-gray-800 bg-opacity-50 backdrop-blur-sm relative z-10">
        <div className="flex items-center space-x-2">
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="p-2 hover:bg-gray-800 rounded-lg text-gray-300"
          >
            <Menu className="h-5 w-5" />
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            className="p-2 hover:bg-gray-800 rounded-lg text-gray-300"
          >
            <Plus className="h-5 w-5" />
          </motion.button>
        </div>
        <div className="flex items-center space-x-2">
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setIsPinned(!isPinned)}
            className={`p-2 hover:bg-gray-800 rounded-lg ${isPinned ? 'text-blue-400' : 'text-gray-300'}`}
          >
            <Pin className="h-5 w-5" />
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            className="p-2 hover:bg-gray-800 rounded-lg text-gray-300"
          >
            <Share2 className="h-5 w-5" />
          </motion.button>
        </div>
      </header>

      <div className="flex-1 flex relative">
        <AnimatePresence mode="wait">
          {isSidebarOpen && (
            <motion.div
              initial={{ width: 0, x: -320 }}
              animate={{ width: 320, x: 0 }}
              exit={{ width: 0, x: -320 }}
              className="absolute top-0 left-0 h-full bg-gray-900/30 backdrop-blur-md border-r border-gray-800 z-50"
            >
              <div className="p-4 space-y-4 h-full relative">
                <h2 className="text-lg font-semibold text-gray-100">Previous Chats</h2>
                <div className="space-y-2">
                  {previousChats.map(chat => (
                    <motion.div
                      key={chat.id}
                      whileHover={{ x: 5 }}
                      className="flex items-center space-x-3 p-3 hover:bg-gray-800/50 rounded-lg cursor-pointer"
                    >
                      <MessageSquare className="h-5 w-5 text-gray-400" />
                      <div className="flex-1">
                        <p className="font-medium text-gray-100">{chat.title}</p>
                        <p className="text-sm text-gray-400">{chat.date}</p>
                      </div>
                      <ChevronRight className="h-4 w-4 text-gray-400" />
                    </motion.div>
                  ))}
                </div>

                {/* Account Section - Fixed at bottom */}
                <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-800 bg-gray-900/50 backdrop-blur-sm">
                  <div className="flex items-center space-x-3 p-2">
                    <div className="w-10 h-10 rounded-full bg-gray-700 flex items-center justify-center">
                      <User className="h-5 w-5 text-gray-300" />
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-gray-100">John Doe</p>
                      <p className="text-sm text-gray-400">john@example.com</p>
                    </div>
                  </div>
                  <div className="mt-2 space-y-1">
                    <button className="w-full flex items-center space-x-2 px-2 py-1.5 text-gray-300 hover:bg-gray-800/50 rounded">
                      <Settings className="h-4 w-4" />
                      <span>Settings</span>
                    </button>
                    <button className="w-full flex items-center space-x-2 px-2 py-1.5 text-gray-300 hover:bg-gray-800/50 rounded">
                      <LogOut className="h-4 w-4" />
                      <span>Log out</span>
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="flex-1 flex flex-col">
          {messages.length === 0 ? (
            <div className="flex-1 flex items-center justify-center">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center space-y-4"
              >
                <div className="w-12 h-12 mx-auto bg-gradient-to-br from-blue-400 to-blue-600 rounded-lg flex items-center justify-center">
                  <MessageSquare className="h-6 w-6 text-white" />
                </div>
                <h2 className="text-xl font-semibold text-gray-100">Welcome to Chat</h2>
                <p className="text-gray-400">Start a conversation</p>
              </motion.div>
            </div>
          ) : (
            <div className="flex-1 overflow-y-auto px-4 py-6">
              <div className="max-w-3xl mx-auto space-y-6">
                <AnimatePresence mode="popLayout">
                  {messages.map((msg) => (
                    <motion.div
                      key={msg.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className={`flex flex-col ${msg.sender === "user" ? "items-end" : "items-start"}`}
                    >
                      <div className={`${msg.sender === "user" ? "text-blue-400" : "text-gray-100"} text-lg`}>
                        {msg.text}
                      </div>
                      {msg.sender === "bot" && (
                        <div className="flex items-center space-x-2 mt-1">
                          <div className="flex items-center space-x-2">
                            <motion.button
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.95 }}
                              className="p-1 hover:bg-gray-800 rounded text-gray-400 hover:text-gray-100"
                            >
                              <ThumbsUp className="h-4 w-4" />
                            </motion.button>
                            <motion.button
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.95 }}
                              className="p-1 hover:bg-gray-800 rounded text-gray-400 hover:text-gray-100"
                            >
                              <ThumbsDown className="h-4 w-4" />
                            </motion.button>
                            <motion.button
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.95 }}
                              className="p-1 hover:bg-gray-800 rounded text-gray-400 hover:text-gray-100"
                            >
                              <RotateCcw className="h-4 w-4" />
                            </motion.button>
                            <motion.button
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.95 }}
                              onClick={() => handleCopy(msg.text, msg.id)}
                              className="p-1 hover:bg-gray-800 rounded text-gray-400 hover:text-gray-100"
                            >
                              {copiedMessageId === msg.id ? (
                                <Check className="h-4 w-4 text-green-500" />
                              ) : (
                                <Copy className="h-4 w-4" />
                              )}
                            </motion.button>
                          </div>
                        </div>
                      )}
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            </div>
          )}

          <div className="px-4 pb-6">
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              className="max-w-3xl mx-auto"
            >
              <div className="relative bg-gray-800/50 backdrop-blur-sm rounded-lg shadow-lg">
                <form
                  onSubmit={(e) => {
                    e.preventDefault()
                    sendMessage()
                  }}
                  className="flex items-center p-2"
                >
                  <div className="flex space-x-2 px-2">
                    <button type="button" className="p-2 hover:bg-gray-700 rounded-lg">
                      <Link className="h-5 w-5 text-gray-400" />
                    </button>
                    <button type="button" className="p-2 hover:bg-gray-700 rounded-lg">
                      <Image className="h-5 w-5 text-gray-400" />
                    </button>
                    <button type="button" className="p-2 hover:bg-gray-700 rounded-lg">
                      <FileText className="h-5 w-5 text-gray-400" />
                    </button>
                  </div>
                  <input
                    type="text"
                    className="flex-1 bg-transparent px-4 py-3 focus:outline-none text-gray-100 placeholder-gray-400"
                    placeholder="Ask le Chat or @mention an agent"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                  />
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    type="submit"
                    className="p-2 text-gray-400 hover:text-gray-100"
                  >
                    <Send className="h-5 w-5" />
                  </motion.button>
                </form>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  )
}