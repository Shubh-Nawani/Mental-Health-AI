import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Home, MessageCircle, Info, LogIn, UserPlus, Brain } from "lucide-react";

const Navbar = () => {
  const navVariants = {
    hidden: { y: -100 },
    visible: {
      y: 0,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 20,
        staggerChildren: 0.1
      }
    }
  };

  const linkVariants = {
    hidden: { y: -20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100
      }
    }
  };

  const glowVariants = {
    initial: { opacity: 0.5 },
    animate: {
      opacity: [0.5, 0.8, 0.5],
      transition: {
        duration: 2,
        repeat: Infinity,
        ease: "easeInOut"
      }
    }
  };

  return (
    <motion.nav
      variants={navVariants}
      initial="hidden"
      animate="visible"
      style={{
        position: 'fixed',
        width: '100%',
        zIndex: 50,
        background: 'rgba(0, 0, 0, 0.8)',
        backdropFilter: 'blur(12px)',
        borderBottom: '1px solid rgba(138, 43, 226, 0.1)'
      }}
    >
      <motion.div
        variants={glowVariants}
        initial="initial"
        animate="animate"
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: '1px',
          background: 'linear-gradient(90deg, transparent, rgba(138, 43, 226, 0.3), transparent)'
        }}
      />

      <div style={{
        maxWidth: '1200px',
        margin: '0 auto',
        padding: '0 2rem'
      }}>
        <div style={{
          height: '70px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}>
          <motion.div
            variants={linkVariants}
            whileHover={{ scale: 1.05 }}
          >
            <Link to="/" style={{
              fontSize: '1.5rem',
              fontWeight: 'bold',
              background: 'linear-gradient(45deg, #fff, #a855f7)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem'
            }}>
              <Brain />
              MINDAI
            </Link>
          </motion.div>

          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '2rem'
          }}>
            <motion.div
              variants={linkVariants}
              style={{
                display: 'flex',
                gap: '2rem'
              }}
            >
              {[
                { to: "/", icon: <Home size={20} />, text: "CORE" },
                { to: "/about", icon: <Info size={20} />, text: "INTEL" },
                { to: "/chat", icon: <MessageCircle size={20} />, text: "NEURAL-LINK" }
              ].map((link, index) => (
                <NavLink key={index} {...link} />
              ))}
            </motion.div>

            <motion.div
              variants={linkVariants}
              style={{
                display: 'flex',
                gap: '1rem'
              }}
            >
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                style={{
                  padding: '0.5rem 1rem',
                  borderRadius: '8px',
                  border: '1px solid rgba(138, 43, 226, 0.3)',
                  background: 'transparent',
                  color: '#fff',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem'
                }}
              >
                <LogIn size={20} />
                ACCESS
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                style={{
                  padding: '0.5rem 1rem',
                  borderRadius: '8px',
                  background: 'linear-gradient(45deg, #6b21a8, #1e40af)',
                  color: '#fff',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem'
                }}
              >
                <UserPlus size={20} />
                INITIALIZE
              </motion.button>
            </motion.div>
          </div>
        </div>
      </div>
    </motion.nav>
  );
};

const NavLink = ({ to, icon, text }) => (
  <motion.div
    whileHover={{ scale: 1.05 }}
    whileTap={{ scale: 0.95 }}
  >
    <Link
      to={to}
      style={{
        color: '#fff',
        opacity: 0.8,
        display: 'flex',
        alignItems: 'center',
        gap: '0.5rem',
        transition: 'opacity 0.3s ease'
      }}
      onMouseEnter={e => e.currentTarget.style.opacity = 1}
      onMouseLeave={e => e.currentTarget.style.opacity = 0.8}
    >
      {icon}
      {text}
    </Link>
  </motion.div>
);

export default Navbar;