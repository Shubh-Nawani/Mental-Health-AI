import { Link } from 'react-router-dom';

export default function Home() {
	return (
		<div className='h-screen flex flex-col items-center justify-center bg-[#0a0b10] text-white'>
			<h1 className='text-4xl font-bold mb-4'>AI Mental Health Consultant</h1>
			<p className='text-lg text-gray-300 mb-6'>Private, empathetic, real-time support.</p>
			<Link to='/chat' className='px-6 py-3 bg-blue-500 rounded-lg text-white hover:bg-blue-600'>
				Start Chat
			</Link>
		</div>
	);
}