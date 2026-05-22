import { useState } from 'react';
import './ChatInput.css';

function ChatInput({ isLoading, onSendMessage }) {
  const [message, setMessage] = useState('');

  const trimmedMessage = message.trim();
  const isSendDisabled = isLoading || !trimmedMessage;

  const handleSubmit = (event) => {
    event.preventDefault();

    if (isSendDisabled) {
      return;
    }

    onSendMessage(trimmedMessage);
    setMessage('');
  };

  return (
    <form className="chat-input-form" onSubmit={handleSubmit}>
      <label className="sr-only" htmlFor="chat-message">
        Message
      </label>
      <textarea
        id="chat-message"
        value={message}
        onChange={(event) => setMessage(event.target.value)}
        onKeyDown={(event) => {
          if (event.key === 'Enter' && !event.shiftKey) {
            handleSubmit(event);
          }
        }}
        placeholder="Type your message..."
        rows={1}
        disabled={isLoading}
      />
      <button type="submit" disabled={isSendDisabled} aria-label="Send message">
        Send
      </button>
    </form>
  );
}

export default ChatInput;
