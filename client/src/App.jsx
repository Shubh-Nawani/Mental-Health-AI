import { Routes, Route } from 'react-router-dom';
import { SignedIn, SignedOut, RedirectToSignIn } from '@clerk/clerk-react';
import Home from './pages/Home';
import Chat from './pages/Chat';
import Login from './pages/Login';

export default function App() {
    return (
        <div className='h-screen flex flex-col bg-[#0a0b10] text-white'>
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