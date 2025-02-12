import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect } from 'react';
import { User, ArrowRight } from 'lucide-react';

export default function Home() {
  const [currentHero, setCurrentHero] = useState(0);

  const heroContent = [
    {
      title: "Your Mental Health Partner",
      description: "Experience confidential, empathetic support powered by advanced AI technology. Available whenever you need it, we're here to help you navigate challenges with understanding, guidance, and a safe space to share.",
    },
    {
      title: "Personalized Support For You",
      description: "Your wellbeing matters deeply. Share your thoughts and feelings in a safe, supportive, and judgment-free space, where you can express yourself freely with the assurance of complete privacy and confidentiality.",
    }
  ];

  const testimonials = [
    {
      name: "Sarah Johnson",
      role: "Student",
      content: "This AI mental health service helped me manage my anxiety during finals. The 24/7 availability made all the difference."
    },
    {
      name: "Michael Chen",
      role: "Professional",
      content: "Having a judgment-free space to discuss my concerns has been invaluable. The AI's responses are surprisingly insightful."
    },
    {
      name: "Emily Rodriguez",
      role: "Teacher",
      content: "The personalized support and coping strategies provided by this service have helped me maintain better work-life balance."
    }
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentHero((prev) => (prev + 1) % heroContent.length);
    }, 10000);
    return () => clearInterval(timer);
  }, []);

  const TestimonialCard = ({ testimonial }) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="bg-gray-900 p-6 rounded-lg"
    >
      <div className="flex items-center mb-4">
        <div className="bg-gray-800 p-2 rounded-full">
          <User size={32} className="text-white" />
        </div>
        <div className="ml-4">
          <h3 className="font-semibold">{testimonial.name}</h3>
          <p className="text-gray-400">{testimonial.role}</p>
        </div>
      </div>
      <p className="text-gray-300">{testimonial.content}</p>
    </motion.div>
  );

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="bg-black text-white"
    >
      {/* Hero Section */}
      <section
        className="min-h-[90vh] relative overflow-hidden bg-cover bg-center bg-fixed flex items-start justify-center pt-40"
        style={{
          backgroundImage: "url('https://images.unsplash.com/photo-1614853036460-e8cff7410ee9?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D')"
        }}
      >
        <div className="absolute inset-0 bg-black bg-opacity-20"></div>
        <AnimatePresence mode="wait">
          <motion.div
            key={currentHero}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            className="relative z-10 text-center"
          >
            <div className="container mx-auto px-6">
              <h1 className="text-7xl font-bold mb-8 leading-tight bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-300">
                {heroContent[currentHero].title}
              </h1>
              <p className="text-xl text-gray-200 mb-12 max-w-3xl mx-auto">
                {heroContent[currentHero].description}
              </p>
              <Link to="/chat">
                <motion.div
                  whileHover={{ backgroundColor: 'rgba(255, 255, 255, 0.9)' }}
                  transition={{ duration: 0.2 }}
                  className="inline-flex items-center gap-2 px-6 py-3 bg-white text-black text-xl font-semibold rounded-lg"
                >
                  Start Chat <ArrowRight size={22} />
                </motion.div>
              </Link>
            </div>
          </motion.div>
        </AnimatePresence>
      </section>

      {/* Testimonials Section */}
      <section className="py-20">
        <div className="container mx-auto px-6">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-5xl font-bold mb-8 text-center"
          >
            User Testimonials
          </motion.h2>
          <p className="text-center text-gray-300 mb-12 max-w-3xl mx-auto">
            These are the testimonials from our valued users. We care deeply about your experiences and feedback, as they help us improve. We're committed to providing the best support possible and appreciate your time in sharing your thoughts.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <TestimonialCard key={index} testimonial={testimonial} />
            ))}
          </div>
        </div>
      </section>
    </motion.div>
  );
}