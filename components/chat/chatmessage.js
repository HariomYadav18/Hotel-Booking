export default function ChatMessage({ role = 'user', text }) {
  const isUser = role === 'user';
  return (
    <div className={`flex ${isUser ? 'justify-end' : 'justify-start'}`}>
      <div className={`max-w-xs px-3 py-2 rounded-lg text-sm ${isUser ? 'bg-primary-600 text-white' : 'bg-gray-200 text-gray-800'}`}>
        {text}
      </div>
    </div>
  );
}


