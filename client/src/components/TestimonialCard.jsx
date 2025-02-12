import { motion } from 'framer-motion';

export default function TestimonialCard({ testimonial }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      whileHover={{ scale: 1.05 }}
      transition={{ duration: 0.5 }}
      className="bg-gray-800 rounded-xl p-6"
    >
      <div className="flex items-center mb-4">
        <motion.img
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2 }}
          src={testimonial.image}
          alt={testimonial.name}
          className="w-16 h-16 rounded-full"
        />
        <div className="ml-4">
          <motion.h3
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="font-semibold text-lg"
          >
            {testimonial.name}
          </motion.h3>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="text-gray-400"
          >
            {testimonial.role}
          </motion.p>
        </div>
      </div>
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="text-gray-300"
      >
        {testimonial.content}
      </motion.p>
    </motion.div>
  );
}