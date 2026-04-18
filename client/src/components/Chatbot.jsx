import { useState, useRef, useEffect } from 'react';

const BOT_AVATAR = '🏠';
const USER_AVATAR = '👤';

const QUICK_ACTIONS = [
  { label: '🏡 Buy Property', text: 'I want to buy a property' },
  { label: '🔑 Rent Property', text: 'I am looking to rent a property' },
  { label: '📝 List My Property', text: 'How do I list my property for sale?' },
  { label: '💰 Pricing Info', text: 'What are the property prices?' },
];

// Simple markdown-ish renderer
function renderMessage(text) {
  const lines = text.split('\n');
  return lines.map((line, i) => {
    // Bold text **text**
    const boldified = line.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
    // Inline links [text](/path)
    const linked = boldified.replace(
      /\[([^\]]+)\]\(([^)]+)\)/g,
      '<a href="$2" style="color:#60a5fa;text-decoration:underline;" onclick="window.location.href=\'$2\';return false;">$1</a>'
    );
    return (
      <span key={i}>
        {i > 0 && <br />}
        <span dangerouslySetInnerHTML={{ __html: linked }} />
      </span>
    );
  });
}

export default function Chatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      id: 1,
      role: 'bot',
      text: "👋 Hi! I'm your **RealEstate AI Assistant**. I can help you find properties, understand pricing, list your home, and much more!\n\nWhat can I help you with today?",
      time: new Date(),
    },
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [hasUnread, setHasUnread] = useState(false);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
      inputRef.current?.focus();
      setHasUnread(false);
    }
  }, [messages, isOpen]);

  const sendMessage = async (text) => {
    const msgText = text || input.trim();
    if (!msgText || isTyping) return;

    const userMsg = {
      id: Date.now(),
      role: 'user',
      text: msgText,
      time: new Date(),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setIsTyping(true);

    try {
      const res = await fetch('/api/chatbot', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: msgText }),
      });
      const data = await res.json();
      const botMsg = {
        id: Date.now() + 1,
        role: 'bot',
        text: data.reply || "Sorry, I couldn't process that. Please try again.",
        time: new Date(),
      };
      setMessages((prev) => [...prev, botMsg]);
      if (!isOpen) setHasUnread(true);
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now() + 1,
          role: 'bot',
          text: '❌ Something went wrong. Please check your connection and try again.',
          time: new Date(),
        },
      ]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleKey = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const formatTime = (date) =>
    date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  const clearChat = () => {
    setMessages([
      {
        id: 1,
        role: 'bot',
        text: "👋 Hi! I'm your **RealEstate AI Assistant**. I can help you find properties, understand pricing, list your home, and much more!\n\nWhat can I help you with today?",
        time: new Date(),
      },
    ]);
  };

  return (
    <>
      {/* ── Floating Button ────────────────────────────────── */}
      <button
        id="chatbot-toggle-btn"
        onClick={() => { setIsOpen((o) => !o); setHasUnread(false); }}
        style={{
          position: 'fixed',
          bottom: '24px',
          right: '24px',
          width: '60px',
          height: '60px',
          borderRadius: '50%',
          background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 50%, #06b6d4 100%)',
          border: 'none',
          cursor: 'pointer',
          boxShadow: '0 8px 32px rgba(99,102,241,0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '26px',
          zIndex: 9999,
          transition: 'transform 0.3s ease, box-shadow 0.3s ease',
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.transform = 'scale(1.1)';
          e.currentTarget.style.boxShadow = '0 12px 40px rgba(99,102,241,0.7)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = 'scale(1)';
          e.currentTarget.style.boxShadow = '0 8px 32px rgba(99,102,241,0.5)';
        }}
        title="Chat with AI Assistant"
      >
        {isOpen ? '✕' : '💬'}
        {hasUnread && !isOpen && (
          <span style={{
            position: 'absolute', top: '-4px', right: '-4px',
            width: '18px', height: '18px', borderRadius: '50%',
            background: '#ef4444', border: '2px solid white',
            fontSize: '10px', color: 'white', display: 'flex',
            alignItems: 'center', justifyContent: 'center', fontWeight: 'bold',
          }}>!</span>
        )}
      </button>

      {/* ── Chat Window ────────────────────────────────────── */}
      <div
        id="chatbot-window"
        style={{
          position: 'fixed',
          bottom: '96px',
          right: '24px',
          width: '370px',
          height: '560px',
          borderRadius: '20px',
          background: 'linear-gradient(160deg, #0f172a 0%, #1e1b4b 50%, #0f172a 100%)',
          border: '1px solid rgba(99,102,241,0.3)',
          boxShadow: '0 24px 80px rgba(0,0,0,0.5), 0 0 0 1px rgba(99,102,241,0.2)',
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
          zIndex: 9998,
          transform: isOpen ? 'scale(1) translateY(0)' : 'scale(0.8) translateY(20px)',
          opacity: isOpen ? 1 : 0,
          pointerEvents: isOpen ? 'all' : 'none',
          transition: 'all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)',
          transformOrigin: 'bottom right',
          fontFamily: "'Inter', -apple-system, sans-serif",
        }}
      >
        {/* Header */}
        <div style={{
          background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 60%, #06b6d4 100%)',
          padding: '14px 16px',
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
          flexShrink: 0,
        }}>
          <div style={{
            width: '42px', height: '42px', borderRadius: '50%',
            background: 'rgba(255,255,255,0.2)', display: 'flex',
            alignItems: 'center', justifyContent: 'center', fontSize: '20px',
            border: '2px solid rgba(255,255,255,0.4)',
          }}>
            {BOT_AVATAR}
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ color: 'white', fontWeight: '700', fontSize: '15px', lineHeight: 1 }}>
              RealEstate AI
            </div>
            <div style={{ color: 'rgba(255,255,255,0.8)', fontSize: '11px', marginTop: '2px', display: 'flex', alignItems: 'center', gap: '4px' }}>
              <span style={{ width: '7px', height: '7px', borderRadius: '50%', background: '#4ade80', display: 'inline-block', boxShadow: '0 0 6px #4ade80' }}></span>
              Online · Ready to help
            </div>
          </div>
          <button
            id="chatbot-clear-btn"
            onClick={clearChat}
            title="Clear chat"
            style={{
              background: 'rgba(255,255,255,0.15)', border: 'none', borderRadius: '8px',
              color: 'white', cursor: 'pointer', padding: '6px 10px', fontSize: '11px',
              transition: 'background 0.2s',
            }}
            onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.25)'}
            onMouseLeave={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.15)'}
          >
            🗑 Clear
          </button>
        </div>

        {/* Messages */}
        <div style={{
          flex: 1, overflowY: 'auto', padding: '12px',
          display: 'flex', flexDirection: 'column', gap: '10px',
          scrollbarWidth: 'thin',
          scrollbarColor: 'rgba(99,102,241,0.3) transparent',
        }}>
          {messages.map((msg) => (
            <div
              key={msg.id}
              style={{
                display: 'flex',
                flexDirection: msg.role === 'user' ? 'row-reverse' : 'row',
                alignItems: 'flex-end',
                gap: '8px',
                animation: 'slideIn 0.3s ease',
              }}
            >
              {/* Avatar */}
              <div style={{
                width: '28px', height: '28px', borderRadius: '50%', flexShrink: 0,
                background: msg.role === 'bot'
                  ? 'linear-gradient(135deg,#6366f1,#8b5cf6)'
                  : 'linear-gradient(135deg,#06b6d4,#0284c7)',
                display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '13px',
              }}>
                {msg.role === 'bot' ? BOT_AVATAR : USER_AVATAR}
              </div>

              {/* Bubble */}
              <div style={{
                maxWidth: '78%',
                background: msg.role === 'bot'
                  ? 'rgba(255,255,255,0.06)'
                  : 'linear-gradient(135deg,#6366f1,#8b5cf6)',
                border: msg.role === 'bot' ? '1px solid rgba(99,102,241,0.2)' : 'none',
                borderRadius: msg.role === 'bot' ? '16px 16px 16px 4px' : '16px 16px 4px 16px',
                padding: '10px 13px',
                color: 'white',
                fontSize: '13px',
                lineHeight: '1.6',
                wordBreak: 'break-word',
              }}>
                {renderMessage(msg.text)}
                <div style={{
                  fontSize: '10px',
                  color: 'rgba(255,255,255,0.4)',
                  marginTop: '4px',
                  textAlign: msg.role === 'user' ? 'right' : 'left',
                }}>
                  {formatTime(msg.time)}
                </div>
              </div>
            </div>
          ))}

          {/* Typing indicator */}
          {isTyping && (
            <div style={{ display: 'flex', alignItems: 'flex-end', gap: '8px' }}>
              <div style={{
                width: '28px', height: '28px', borderRadius: '50%',
                background: 'linear-gradient(135deg,#6366f1,#8b5cf6)',
                display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '13px',
              }}>
                {BOT_AVATAR}
              </div>
              <div style={{
                background: 'rgba(255,255,255,0.06)',
                border: '1px solid rgba(99,102,241,0.2)',
                borderRadius: '16px 16px 16px 4px',
                padding: '12px 16px',
                display: 'flex', gap: '4px', alignItems: 'center',
              }}>
                {[0, 1, 2].map((i) => (
                  <div key={i} style={{
                    width: '7px', height: '7px', borderRadius: '50%',
                    background: '#6366f1',
                    animation: `bounce 1.2s ${i * 0.2}s infinite`,
                  }} />
                ))}
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Quick Actions */}
        {messages.length <= 2 && (
          <div style={{
            padding: '0 12px 8px',
            display: 'flex', flexWrap: 'wrap', gap: '6px',
          }}>
            {QUICK_ACTIONS.map((qa) => (
              <button
                key={qa.label}
                onClick={() => sendMessage(qa.text)}
                style={{
                  background: 'rgba(99,102,241,0.15)',
                  border: '1px solid rgba(99,102,241,0.3)',
                  borderRadius: '20px', color: 'rgba(255,255,255,0.85)',
                  padding: '5px 10px', fontSize: '11px', cursor: 'pointer',
                  transition: 'all 0.2s', whiteSpace: 'nowrap',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = 'rgba(99,102,241,0.35)';
                  e.currentTarget.style.borderColor = 'rgba(99,102,241,0.6)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = 'rgba(99,102,241,0.15)';
                  e.currentTarget.style.borderColor = 'rgba(99,102,241,0.3)';
                }}
              >
                {qa.label}
              </button>
            ))}
          </div>
        )}

        {/* Input */}
        <div style={{
          padding: '10px 12px',
          borderTop: '1px solid rgba(99,102,241,0.2)',
          display: 'flex', gap: '8px', alignItems: 'flex-end',
          background: 'rgba(0,0,0,0.2)',
          flexShrink: 0,
        }}>
          <textarea
            ref={inputRef}
            id="chatbot-input"
            rows={1}
            placeholder="Ask about properties, pricing, renting..."
            value={input}
            onChange={(e) => {
              setInput(e.target.value);
              e.target.style.height = 'auto';
              e.target.style.height = Math.min(e.target.scrollHeight, 80) + 'px';
            }}
            onKeyDown={handleKey}
            style={{
              flex: 1,
              background: 'rgba(255,255,255,0.06)',
              border: '1px solid rgba(99,102,241,0.3)',
              borderRadius: '12px',
              color: 'white',
              padding: '10px 13px',
              fontSize: '13px',
              resize: 'none',
              outline: 'none',
              fontFamily: 'inherit',
              lineHeight: '1.4',
              minHeight: '40px',
              maxHeight: '80px',
              transition: 'border-color 0.2s',
            }}
            onFocus={(e) => e.target.style.borderColor = 'rgba(99,102,241,0.7)'}
            onBlur={(e) => e.target.style.borderColor = 'rgba(99,102,241,0.3)'}
          />
          <button
            id="chatbot-send-btn"
            onClick={() => sendMessage()}
            disabled={!input.trim() || isTyping}
            style={{
              width: '40px', height: '40px', borderRadius: '12px', flexShrink: 0,
              background: (!input.trim() || isTyping)
                ? 'rgba(99,102,241,0.3)'
                : 'linear-gradient(135deg,#6366f1,#8b5cf6)',
              border: 'none', cursor: (!input.trim() || isTyping) ? 'not-allowed' : 'pointer',
              color: 'white', fontSize: '16px',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              transition: 'all 0.2s',
              transform: (!input.trim() || isTyping) ? 'none' : 'scale(1)',
            }}
            onMouseEnter={(e) => {
              if (input.trim() && !isTyping) e.currentTarget.style.transform = 'scale(1.1)';
            }}
            onMouseLeave={(e) => { e.currentTarget.style.transform = 'scale(1)'; }}
          >
            ➤
          </button>
        </div>
      </div>

      {/* CSS Animations */}
      <style>{`
        @keyframes bounce {
          0%, 80%, 100% { transform: translateY(0); }
          40% { transform: translateY(-6px); }
        }
        @keyframes slideIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        #chatbot-window ::-webkit-scrollbar { width: 4px; }
        #chatbot-window ::-webkit-scrollbar-track { background: transparent; }
        #chatbot-window ::-webkit-scrollbar-thumb { background: rgba(99,102,241,0.4); border-radius: 4px; }
        #chatbot-window textarea::placeholder { color: rgba(255,255,255,0.35); }
      `}</style>
    </>
  );
}
