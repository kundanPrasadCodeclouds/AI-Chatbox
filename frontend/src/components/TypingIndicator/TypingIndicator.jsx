import './TypingIndicator.css';

function TypingIndicator() {
  return (
    <div className="typing-row" aria-label="AI is typing">
      <div className="avatar avatar-ai">AI</div>
      <div className="typing-bubble">
        <span />
        <span />
        <span />
      </div>
    </div>
  );
}

export default TypingIndicator;
