import { Routes, Route, Link } from 'react-router-dom';
import { SignedIn, SignedOut, RedirectToSignIn, UserButton } from '@clerk/clerk-react';
import Home from './pages/Home';
import Chat from './pages/Chat';
import Login from './pages/Login';

export default function App() {
    return (
        <div className='h-screen flex flex-col bg-[#0a0b10] text-white'>
            {/* Navbar */}
            <nav className='flex justify-between items-center p-4 bg-gray-900'>
                <Link to='/' className='text-xl font-bold'>Mental Health AI</Link>
                <div className='flex items-center space-x-4'>
                    <SignedIn>
                        <Link to='/chat' className='px-4 py-2 bg-blue-500 rounded-lg hover:bg-blue-600'>Chat</Link>
                        <UserButton afterSignOutUrl='/'/>
                    </SignedIn>
                    <SignedOut>
                        <Link to='/login' className='px-4 py-2 bg-green-500 rounded-lg hover:bg-green-600'>Login</Link>
                    </SignedOut>
                </div>
            </nav>
            {/* Routes */}
            <Routes>
                <Route path='/' element={<Home />} />
                <Route path='/login' element={<Login />} />
                <Route
                    path='/chat'
                    element={
                        <>
                            <SignedIn>
                                <Chat />
                            </SignedIn>
                            <SignedOut>
                                <RedirectToSignIn />
                            </SignedOut>
                        </>
                    }
                />
            </Routes>
        </div>
    );
}