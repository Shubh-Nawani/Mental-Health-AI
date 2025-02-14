import { useSelector } from "react-redux"
import { Link } from "react-router-dom"
import { motion } from "framer-motion"
import { MessageCircle, Lock, Clock, UserRound } from "lucide-react"
import Navbar from "../components/Navbar"

const Home = () => {
  const { token } = useSelector((state) => state.auth)

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
      },
    },
  }

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.5,
      },
    },
  }

  const testimonials = [
    {
      name: "Sarah Johnson",
      role: "Student",
      text: "This AI mental health service helped me manage my anxiety during finals. The 24/7 availability made all the difference.",
    },
    {
      name: "Michael Chen",
      role: "Professional",
      text: "Having a judgment-free space to discuss my concerns has been invaluable. The AI's responses are surprisingly insightful.",
    },
    {
      name: "Emily Rodriguez",
      role: "Teacher",
      text: "The personalized support and coping strategies provided by this service have helped me maintain better work-life balance.",
    },
  ]

  return (
    <div className="min-h-screen">
      <Navbar />

      {/* Hero Section */}
      <motion.div
        className="relative min-h-screen flex items-center justify-center pt-16"
        initial="hidden"
        animate="visible"
        variants={containerVariants}
        style={{
          background: `
            linear-gradient(
              135deg,
              #6b21a8 0%,
              #d946ef 20%,
              #f97316 40%,
              #eab308 60%,
              #22c55e 80%,
              #0ea5e9 100%
            )
          `,
        }}
      >
        <div className="container mx-auto px-4 text-center text-white">
          <motion.h1 className="text-5xl md:text-7xl font-bold mb-6" variants={itemVariants}>
            Mental Health AI Assistant
          </motion.h1>
          <motion.p className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto" variants={itemVariants}>
            Your wellbeing matters deeply. Share your thoughts and feelings in a safe, supportive, and judgment-free
            space, with complete privacy and confidentiality.
          </motion.p>

          <motion.div variants={itemVariants}>
            {!token ? (
              <div className="space-x-4">
                <Link
                  to="/login"
                  className="inline-block px-8 py-4 bg-white text-purple-600 rounded-lg font-semibold hover:bg-opacity-90 transition-all transform hover:scale-105"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="inline-block px-8 py-4 bg-transparent border-2 border-white text-white rounded-lg font-semibold hover:bg-white hover:text-purple-600 transition-all transform hover:scale-105"
                >
                  Register
                </Link>
              </div>
            ) : (
              <Link
                to="/chat"
                className="inline-flex items-center px-8 py-4 bg-white text-purple-600 rounded-lg font-semibold hover:bg-opacity-90 transition-all transform hover:scale-105"
              >
                <MessageCircle className="mr-2" />
                Start Chatting
              </Link>
            )}
          </motion.div>
        </div>
      </motion.div>

      {/* Features Section */}
      <motion.div
        className="py-20 bg-black/95"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
      >
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-8">
            <motion.div
              className="p-6 rounded-xl bg-white/5 backdrop-blur-sm border border-white/10"
              whileHover={{ scale: 1.05 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <Clock className="w-10 h-10 text-purple-400 mb-4" />
              <h3 className="text-xl font-semibold text-white mb-3">24/7 Support</h3>
              <p className="text-gray-300">Access support anytime, anywhere. Our AI is always here to listen.</p>
            </motion.div>

            <motion.div
              className="p-6 rounded-xl bg-white/5 backdrop-blur-sm border border-white/10"
              whileHover={{ scale: 1.05 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <Lock className="w-10 h-10 text-purple-400 mb-4" />
              <h3 className="text-xl font-semibold text-white mb-3">Private & Secure</h3>
              <p className="text-gray-300">Your conversations are private and protected with end-to-end encryption.</p>
            </motion.div>

            <motion.div
              className="p-6 rounded-xl bg-white/5 backdrop-blur-sm border border-white/10"
              whileHover={{ scale: 1.05 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <UserRound className="w-10 h-10 text-purple-400 mb-4" />
              <h3 className="text-xl font-semibold text-white mb-3">Personalized Help</h3>
              <p className="text-gray-300">Get tailored support based on your unique needs and situation.</p>
            </motion.div>
          </div>
        </div>
      </motion.div>

      {/* Testimonials Section */}
      <motion.div
        className="py-20 bg-black"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8 }}
      >
        <div className="container mx-auto px-4">
          <motion.h2
            className="text-4xl font-bold text-center mb-12 text-white"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 1 }}
          >
            User Testimonials
          </motion.h2>
          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={index}
                className="p-6 rounded-xl bg-white/5 backdrop-blur-sm border border-white/10"
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 1.2 + index * 0.2 }}
                whileHover={{ scale: 1.05 }}
              >
                <div className="flex items-center mb-4">
                  <UserRound className="w-10 h-10 text-purple-400 mr-3" />
                  <div>
                    <h3 className="font-semibold text-white">{testimonial.name}</h3>
                    <p className="text-purple-400">{testimonial.role}</p>
                  </div>
                </div>
                <p className="text-gray-300">{testimonial.text}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.div>
    </div>
  )
}

export default Home