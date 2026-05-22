import { useMemo, useState } from 'react';
import ChatWindow from './components/ChatWindow/ChatWindow.jsx';
import { sendChatMessage } from './services/chatApi.js';

const createMessage = (role, content) => ({
  id: crypto.randomUUID(),
  role,
  content,
  createdAt: new Date().toISOString()
});

const initialMessages = [
  createMessage(
    'assistant',
    'Hi, I am your AI assistant. Ask me anything and I will help you think it through.'
  )
];

function App() {
  const [messages, setMessages] = useState(initialMessages);
  const [isLoading, setIsLoading] = useState(false);

  const subtitle = useMemo(() => {
    return isLoading ? 'Thinking...' : 'Ready to chat';
  }, [isLoading]);

  const handleSendMessage = async (message) => {
    const userMessage = createMessage('user', message);

    setMessages((currentMessages) => [...currentMessages, userMessage]);
    setIsLoading(true);

    try {
      const reply = await sendChatMessage(message);
      setMessages((currentMessages) => [
        ...currentMessages,
        createMessage('assistant', reply)
      ]);
    } catch (error) {
      setMessages((currentMessages) => [
        ...currentMessages,
        createMessage(
          'assistant',
          error.message ||
            'I could not reach the AI service right now. Please try again shortly.'
        )
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="app-shell">
      <ChatWindow
        messages={messages}
        isLoading={isLoading}
        onSendMessage={handleSendMessage}
        subtitle={subtitle}
      />
    </main>
  );
}

export default App;
