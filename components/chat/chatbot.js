import { useState } from 'react';
import ChatMessage from './chatmessage';

export default function Chatbot() {
  const [messages, setMessages] = useState([{ role: 'assistant', text: 'Hi! How can I help you today?' }]);
  const [input, setInput] = useState('');

  const send = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;
    const userMsg = { role: 'user', text: input };
    setMessages((m) => [...m, userMsg]);
    setInput('');
    try {
      const res = await fetch('/api/chatbot/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: userMsg.text })
      });
      const data = await res.json();
      setMessages((m) => [...m, { role: 'assistant', text: data.reply || 'I will get back to you.' }]);
    } catch (e) {
      setMessages((m) => [...m, { role: 'assistant', text: 'Sorry, there was an error.' }]);
    }
  };

  return (
    <div className="card p-4 space-y-3">
      <div className="space-y-2 max-h-64 overflow-y-auto">
        {messages.map((m, i) => (
          <ChatMessage key={i} role={m.role} text={m.text} />
        ))}
      </div>
      <form onSubmit={send} className="flex space-x-2">
        <input className="input-field" value={input} onChange={(e) => setInput(e.target.value)} placeholder="Type your question..." />
        <button className="btn-primary" type="submit">Send</button>
      </form>
    </div>
  );
}


