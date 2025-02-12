import { useState } from 'react';

export default function Chat() {
	const [messages, setMessages] = useState([{ text: 'Hello! How can I support you today?', sender: 'bot' }]);
	const [input, setInput] = useState('');

	const sendMessage = () => {
		if (!input.trim()) return;
		setMessages([...messages, { text: input, sender: 'user' }]);
		setInput('');
	};

	return (
		<div className='h-screen flex flex-col bg-[#0a0b10] text-white p-4'>
			<div className='flex-1 overflow-y-auto space-y-2'>
				{messages.map((msg, i) => (
					<div key={i} className={`p-2 rounded-lg ${msg.sender === 'bot' ? 'bg-gray-700' : 'bg-blue-500 self-end'}`}>
						{msg.text}
					</div>
				))}
			</div>
			<div className='flex p-2 bg-gray-900'>
				<input
					type='text'
					className='flex-1 p-2 bg-gray-800 text-white rounded-l-lg outline-none'
					value={input}
					onChange={(e) => setInput(e.target.value)}
					placeholder='Type a message...'
				/>
				<button onClick={sendMessage} className='px-4 bg-blue-500 rounded-r-lg'>Send</button>
			</div>
		</div>
	);
}