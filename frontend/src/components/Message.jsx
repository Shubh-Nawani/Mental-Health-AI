import { motion } from 'framer-motion';
import ReactMarkdown from 'react-markdown';

const TypingAnimation = () => {
  return (
    <div className="flex items-center space-x-2 p-2">
      {[0, 1, 2].map((dot) => (
        <motion.div
          key={dot}
          className="w-2 h-2 bg-blue-400 rounded-full"
          animate={{
            y: ["0%", "-50%", "0%"],
            opacity: [0.4, 1, 0.4]
          }}
          transition={{
            duration: 0.8,
            repeat: Infinity,
            repeatType: "reverse",
            delay: dot * 0.2
          }}
        />
      ))}
    </div>
  );
};

const Message = ({ message, isBot, timestamp, isTyping }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className={`flex mb-6 ${isBot ? 'justify-start' : 'justify-end'} px-4 sm:px-8 md:px-16 lg:px-32`}
    >
      <div
        className={`relative max-w-2xl p-6 rounded-2xl shadow-lg backdrop-blur-sm
          ${isBot 
            ? 'ml-4 bg-gradient-to-br from-gray-800 to-gray-900 border border-gray-700' 
            : 'mr-4 bg-gradient-to-br from-blue-900 to-blue-950 border border-blue-800'
          }
          transition-all duration-300 hover:shadow-2xl hover:scale-[1.02]`}
      >
        <div className="text-sm text-gray-100 markdown-content">
          {isTyping && isBot ? (
            <TypingAnimation />
          ) : (
            <ReactMarkdown
              components={{
                p: ({ children }) => (
                  <p className="mb-3 leading-relaxed text-gray-100">{children}</p>
                ),
                ul: ({ children }) => (
                  <ul className="space-y-2 my-4 list-disc pl-6 text-gray-100">{children}</ul>
                ),
                li: ({ children }) => (
                  <li className="mb-2">{children}</li>
                ),
                strong: ({ children }) => (
                  <strong className="font-semibold text-blue-200">{children}</strong>
                ),
                em: ({ children }) => (
                  <em className="italic text-blue-100 opacity-90">{children}</em>
                ),
                blockquote: ({ children }) => (
                  <blockquote className="border-l-4 border-blue-500 pl-4 my-4 italic bg-gray-800 bg-opacity-50 py-2 rounded-r">
                    {children}
                  </blockquote>
                ),
                code: ({ children }) => (
                  <code className="bg-gray-800 text-blue-200 px-2 py-1 rounded font-mono text-sm">
                    {children}
                  </code>
                )
              }}
            >
              {message}
            </ReactMarkdown>
          )}
        </div>
        {timestamp && !isTyping && (
          <div className="flex items-center justify-end mt-3 pt-2 border-t border-gray-700/50">
            <p className="text-xs text-gray-400">
              {new Date(timestamp).toLocaleTimeString([], { 
                hour: '2-digit', 
                minute: '2-digit'
              })}
            </p>
          </div>
        )}
        <div 
          className={`absolute top-0 ${isBot ? '-left-2' : '-right-2'} w-4 h-4 
            ${isBot ? 'bg-gray-800' : 'bg-blue-900'} 
            transform rotate-45 border-t border-l
            ${isBot ? 'border-gray-700' : 'border-blue-800'}`}
        />
      </div>
    </motion.div>
  );
};

export default Message;