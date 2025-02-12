import { useState } from 'react';

export default function Login() {
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');

	const handleLogin = () => {
		alert('Login functionality to be implemented.');
	};

	return (
		<div className='h-screen flex flex-col items-center justify-center bg-[#0a0b10] text-white'>
			<h2 className='text-3xl mb-4'>Login</h2>
			<input
				type='email'
				className='p-2 mb-2 w-64 bg-gray-800 text-white rounded'
				placeholder='Email'
				value={email}
				onChange={(e) => setEmail(e.target.value)}
			/>
			<input
				type='password'
				className='p-2 mb-4 w-64 bg-gray-800 text-white rounded'
				placeholder='Password'
				value={password}
				onChange={(e) => setPassword(e.target.value)}
			/>
			<button onClick={handleLogin} className='px-6 py-2 bg-blue-500 rounded hover:bg-blue-600'>Login</button>
		</div>
	);
}