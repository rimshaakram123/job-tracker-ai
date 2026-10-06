import { useState, useRef, useEffect } from 'react';
import { aiService } from '../services/aiService';
import { useAuth } from '../context/AuthContext';

interface Message {
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

const QUICK_PROMPTS = [
  'How can I improve my resume?',
  'What skills should I learn next?',
  'Help me prepare for an interview',
  'Why am I getting rejected?',
];

export default function Assistant() {
  const { user } = useAuth();
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'assistant',
      content: `Hi ${user?.name || 'there'}! 👋 I'm your AI Career Assistant. Ask me anything about your job search, resume, interviews, or career growth.`,
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const send = async (text?: string) => {
    const msg = text || input.trim();
    if (!msg || loading) return;

    setMessages((prev) => [
      ...prev,
      { role: 'user', content: msg, timestamp: new Date() },
    ]);
    setInput('');
    setLoading(true);

    try {
      const reply = await aiService.chat(msg);
      setMessages((prev) => [
        ...prev,
        { role: 'assistant', content: reply, timestamp: new Date() },
      ]);
    } catch (err: any) {
      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          content: '⚠️ Sorry, something went wrong. Please try again.',
          timestamp: new Date(),
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen flex flex-col"
      style={{ background: 'var(--color-bg)' }}
    >
      <div className="max-w-4xl w-full mx-auto p-6 flex-1 flex flex-col">
        <div className="mb-6">
          <h1 className="text-3xl font-bold">🤖 AI Career Assistant</h1>
          <p className="text-sm mt-1" style={{ color: 'var(--color-muted)' }}>
            Personalized advice based on your applications & resume
          </p>
        </div>

        {/* Messages */}
        <div
          className="card flex-1 mb-4"
          style={{ minHeight: 400, maxHeight: '60vh', overflowY: 'auto' }}
        >
          {messages.map((m, i) => (
            <div
              key={i}
              style={{
                display: 'flex',
                justifyContent: m.role === 'user' ? 'flex-end' : 'flex-start',
                marginBottom: '1rem',
              }}
            >
              <div
                style={{
                  maxWidth: '80%',
                  padding: '0.75rem 1rem',
                  borderRadius: '1rem',
                  background:
                    m.role === 'user' ? 'var(--color-primary)' : 'var(--color-surface-2)',
                  color: m.role === 'user' ? 'white' : 'var(--color-text)',
                  whiteSpace: 'pre-wrap',
                  lineHeight: 1.5,
                }}
              >
                {m.content}
              </div>
            </div>
          ))}

          {loading && (
            <div style={{ display: 'flex', justifyContent: 'flex-start' }}>
              <div
                style={{
                  padding: '0.75rem 1rem',
                  borderRadius: '1rem',
                  background: 'var(--color-surface-2)',
                  color: 'var(--color-muted)',
                }}
              >
                Thinking...
              </div>
            </div>
          )}

          <div ref={bottomRef} />
        </div>

        {/* Quick prompts */}
        {messages.length <= 1 && (
          <div className="flex flex-wrap gap-2 mb-4">
            {QUICK_PROMPTS.map((p) => (
              <button
                key={p}
                onClick={() => send(p)}
                className="text-sm px-3 py-2 rounded-lg"
                style={{
                  background: 'var(--color-surface-2)',
                  border: '1px solid var(--color-border)',
                  color: 'var(--color-text)',
                  cursor: 'pointer',
                }}
              >
                {p}
              </button>
            ))}
          </div>
        )}

        {/* Input */}
        <div className="flex gap-3">
          <input
            className="input-field flex-1"
            placeholder="Ask anything about your career..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && send()}
            disabled={loading}
          />
          <button onClick={() => send()} className="btn-primary" disabled={loading}>
            Send
          </button>
        </div>
      </div>
    </div>
  );
}