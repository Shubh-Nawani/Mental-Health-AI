import { Link } from 'react-router-dom';
import { SignedIn, SignedOut, UserButton, useAuth } from '@clerk/clerk-react';
import { Home, Info, MessageCircle, LogIn, UserPlus } from 'lucide-react';
import { motion } from 'framer-motion';

export default function Navbar() {
  const { isLoaded } = useAuth();

  const scrollToBottom = () => {
    window.scrollTo({
      top: document.body.scrollHeight,
      behavior: 'smooth'
    });
  };

  const NavLink = ({ to, children, onClick }) => (
    <Link to={to} onClick={onClick}>
      <motion.div
        whileHover={{ backgroundColor: '#ffffff' }}
        transition={{ duration: 0.2 }}
        className="text-white hover:text-black px-4 py-2 rounded-lg flex items-center gap-2"
      >
        {children}
      </motion.div>
    </Link>
  );

  return (
    <nav className="bg-black py-6">
      <div className="container mx-auto px-6">
        <div className="flex items-center justify-center space-x-8">
          <div className="flex items-center space-x-6">
            <NavLink to="/">
              <Home size={20} />
              HOME
            </NavLink>
            <NavLink to="/#about" onClick={scrollToBottom}>
              <Info size={20} />
              ABOUT
            </NavLink>
            <NavLink to="/chat">
              <MessageCircle size={20} />
              CHAT
            </NavLink>
            
            {isLoaded && (
              <>
                <SignedIn>
                  <UserButton
                    afterSignOutUrl="/"
                    appearance={{
                      elements: {
                        userButtonBox: 'hover:bg-white hover:text-black rounded-full p-2 transition duration-300 ease-in-out'
                      }
                    }}
                  />
                </SignedIn>
                <SignedOut>
                  <NavLink to="/login">
                    <LogIn size={20} />
                    LOGIN
                  </NavLink>
                  <NavLink to="/signup">
                    <UserPlus size={20} />
                    SIGNUP
                  </NavLink>
                </SignedOut>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}