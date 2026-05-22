import { useEffect, useRef } from 'react';
import ChatInput from '../ChatInput/ChatInput.jsx';
import MessageBubble from '../MessageBubble/MessageBubble.jsx';
import TypingIndicator from '../TypingIndicator/TypingIndicator.jsx';
import './ChatWindow.css';

function ChatWindow({ messages, isLoading, onSendMessage, subtitle }) {
  const messagesEndRef = useRef(null);

  // Keep the conversation anchored to the newest message.
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  return (
    <section className="chat-layout" aria-label="AI chatbox">
      <header className="chat-header">
        <div>
          <p className="chat-eyebrow">AI Chatbox</p>
          <h1>Ask, refine, and explore</h1>
        </div>
        <span className="chat-status" aria-live="polite">
          {subtitle}
        </span>
      </header>

      <div className="messages-panel">
        <div className="messages-list">
          {messages.map((message) => (
            <MessageBubble key={message.id} message={message} />
          ))}
          {isLoading && <TypingIndicator />}
          <div ref={messagesEndRef} />
        </div>
      </div>

      <ChatInput isLoading={isLoading} onSendMessage={onSendMessage} />
    </section>
  );
}

export default ChatWindow;
