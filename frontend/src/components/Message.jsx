import { motion } from 'framer-motion';
import ReactMarkdown from 'react-markdown';


const TypingAnimation = () => {
  return (
    <div className="flex items-center space-x-2 p-2">
      {[0, 1, 2].map((dot) => (
        <motion.div
          key={dot}
          className="w-2 h-2 bg-gray-400 rounded-full"
          animate={{
            y: ["0%", "-50%", "0%"]
          }}
          transition={{
            duration: 0.6,
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
      transition={{ duration: 0.3 }}
      className={`flex ${isBot ? 'justify-start' : 'justify-end'} mb-4`}
    >
      <div className={`max-w-[70%] p-4 rounded-lg shadow-sm ${
        isBot ? 'bg-white border border-gray-100' : 'bg-blue-600 text-white'
      }`}>
        <div className={`text-sm markdown-content ${
          isBot ? 'text-gray-800' : 'text-white'
        }`}>
          {isTyping && isBot ? (
            <TypingAnimation />
          ) : (
            <ReactMarkdown
              components={{
                p: ({children}) => (
                  <p className="mb-2 leading-relaxed">{children}</p>
                ),
                ul: ({children}) => (
                  <ul className="space-y-1 my-2 list-disc pl-4">{children}</ul>
                ),
                li: ({children}) => (
                  <li className="mb-1">{children}</li>
                ),
                strong: ({children}) => (
                  <strong className="font-medium">{children}</strong>
                ),
                em: ({children}) => (
                  <em className="italic opacity-90">{children}</em>
                ),
                blockquote: ({children}) => (
                  <blockquote className="border-l-4 border-gray-200 pl-3 my-2 italic">
                    {children}
                  </blockquote>
                ),
              }}
            >
              {message}
            </ReactMarkdown>
          )}
        </div>
        {timestamp && !isTyping && (
          <p className={`text-xs ${
            isBot ? 'text-gray-400' : 'text-white/70'
          } mt-2 text-right`}>
            {new Date(timestamp).toLocaleTimeString()}
          </p>
        )}
      </div>
    </motion.div>
  );
};

export default Message;