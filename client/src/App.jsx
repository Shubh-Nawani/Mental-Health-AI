import { Routes, Route } from 'react-router-dom';
import { SignedIn, SignedOut, RedirectToSignIn } from '@clerk/clerk-react';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Chat from './pages/Chat';
import Login from './pages/Login';
import Signup from './pages/Signup';

/**
 * ProtectedChat renders the Chat component only for signed-in users.
 * If the user isn't signed in, it redirects them to the login screen.
 */
function ProtectedChat() {
  return (
    <>
      <SignedIn>
        <Chat />
      </SignedIn>
      <SignedOut>
        <RedirectToSignIn />
      </SignedOut>
    </>
  );
}

export default function App() {
  return (
    <div className="min-h-screen flex flex-col bg-[#0a0b10]">
      <Navbar />
      <main className="flex-1">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/chat" element={<ProtectedChat />} />
        </Routes>
      </main>
    </div>
  );
}
