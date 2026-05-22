import './MessageBubble.css';

function MessageBubble({ message }) {
  const isUser = message.role === 'user';

  return (
    <article className={`message-row ${isUser ? 'message-row-user' : ''}`}>
      <div className={`avatar ${isUser ? 'avatar-user' : 'avatar-ai'}`}>
        {isUser ? 'You' : 'AI'}
      </div>
      <div className={`message-bubble ${isUser ? 'bubble-user' : 'bubble-ai'}`}>
        <p>{message.content}</p>
      </div>
    </article>
  );
}

export default MessageBubble;
