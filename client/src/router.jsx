import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { SignIn, SignUp, SignedIn, SignedOut, RedirectToSignIn } from '@clerk/clerk-react';
import Home from './pages/Home';
import Chat from './pages/Chat';

export default function App() {
	return (
		<BrowserRouter>
			<Routes>
				<Route path='/' element={<Home />} />
				<Route
					path='/chat'
					element={
						<SignedIn>
							<Chat />
						</SignedIn>
					}
				/>
				<Route path='/sign-in' element={<SignIn />} />
				<Route path='/sign-up' element={<SignUp />} />
				<Route path='*' element={<RedirectToSignIn />} />
			</Routes>
		</BrowserRouter>
	);
};