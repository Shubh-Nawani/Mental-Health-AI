export async function getChatbotResponse(message) {
	return new Promise((resolve) => {
		setTimeout(() => {
			resolve({ text: `I understand. Tell me more about "${message}".`, sender: 'bot' });
		}, 1000);
	});
}