import { useState, useRef, useEffect } from 'react';
import Icon from '@/components/ui/icon';
import { chats, currentUser } from '@/data/mockData';

interface ChatWindowProps {
  chatId: string | null;
}

export default function ChatWindow({ chatId }: ChatWindowProps) {
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState<Record<string, Array<{ id: string; from: string; text: string; time: string; read: boolean }>>>({});
  const [isTyping, setIsTyping] = useState(false);
  const [showEmojiHint, setShowEmojiHint] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const chat = chats.find(c => c.id === chatId);

  useEffect(() => {
    if (chat) {
      setMessages(prev => ({
        ...prev,
        [chat.id]: prev[chat.id] || chat.messages,
      }));
    }
  }, [chatId]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, chatId]);

  const handleSend = () => {
    if (!message.trim() || !chatId) return;
    const now = new Date();
    const time = `${now.getHours()}:${String(now.getMinutes()).padStart(2, '0')}`;
    const newMsg = { id: `m_${Date.now()}`, from: 'me', text: message, time, read: false };

    setMessages(prev => ({
      ...prev,
      [chatId]: [...(prev[chatId] || []), newMsg],
    }));
    setMessage('');

    setIsTyping(true);
    setTimeout(() => {
      setIsTyping(false);
      const reply = { id: `m_r_${Date.now()}`, from: '1', text: getAutoReply(message), time, read: false };
      setMessages(prev => ({
        ...prev,
        [chatId]: [...(prev[chatId] || []), reply],
      }));
    }, 2000);
  };

  const getAutoReply = (msg: string) => {
    const replies = ['Понял, спасибо! 👍', 'Отлично!', 'Хорошо, займусь этим', 'Договорились! 🤝', 'Ок, посмотрю позже', 'Круто! 🔥', 'Принято ✅'];
    return replies[Math.floor(Math.random() * replies.length)];
  };

  if (!chat || !chatId) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="text-center animate-fade-in-up">
          <div className="w-24 h-24 rounded-3xl bg-gradient-to-br from-neon-purple/20 to-neon-cyan/20 border border-white/10 flex items-center justify-center mx-auto mb-6 animate-float">
            <Icon name="MessageCircle" size={40} className="text-neon-purple/60" />
          </div>
          <h2 className="text-2xl font-black font-golos gradient-text mb-2">NeoChat</h2>
          <p className="text-white/30 font-rubik text-sm">Выберите чат чтобы начать общение</p>
        </div>
      </div>
    );
  }

  const chatMessages = messages[chatId] || chat.messages;

  return (
    <div className="flex-1 flex flex-col animate-fade-in">
      {/* Header */}
      <div className="glass border-b border-white/5 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="relative">
            <div
              className="w-11 h-11 rounded-2xl flex items-center justify-center text-white font-bold text-sm"
              style={{ background: chat.color }}
            >
              {chat.type === 'group' || chat.type === 'bot' ? (
                <span className="text-xl">{chat.avatar}</span>
              ) : (
                <span>{chat.avatar}</span>
              )}
            </div>
            {chat.online && (
              <span className="absolute bottom-0 right-0 w-3 h-3 rounded-full status-online border-2 border-background"></span>
            )}
          </div>
          <div>
            <h2 className="font-bold text-white font-golos text-base">{chat.name}</h2>
            <p className="text-xs text-white/40 font-rubik">
              {isTyping ? (
                <span className="text-neon-green">печатает...</span>
              ) : chat.online ? 'онлайн' : 'был(а) недавно'}
              {chat.type === 'group' && ` · ${chat.members?.length} участника`}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button className="w-9 h-9 rounded-xl glass hover:neon-glow-cyan transition-all flex items-center justify-center text-white/50 hover:text-neon-cyan">
            <Icon name="Phone" size={17} />
          </button>
          <button className="w-9 h-9 rounded-xl glass hover:neon-glow transition-all flex items-center justify-center text-white/50 hover:text-neon-purple">
            <Icon name="Video" size={17} />
          </button>
          <button className="w-9 h-9 rounded-xl glass transition-all flex items-center justify-center text-white/50 hover:text-white">
            <Icon name="Search" size={17} />
          </button>
          <button className="w-9 h-9 rounded-xl glass transition-all flex items-center justify-center text-white/50 hover:text-white">
            <Icon name="MoreVertical" size={17} />
          </button>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-6 py-4 space-y-3">
        {/* Date separator */}
        <div className="flex items-center gap-3 my-4">
          <div className="flex-1 h-px bg-white/5"></div>
          <span className="text-xs text-white/20 font-rubik px-3">Сегодня</span>
          <div className="flex-1 h-px bg-white/5"></div>
        </div>

        {chatMessages.map((msg, i) => {
          const isMe = msg.from === 'me';
          return (
            <div
              key={msg.id}
              className={`flex items-end gap-2 animate-fade-in-up stagger-${Math.min(i + 1, 6)} ${isMe ? 'flex-row-reverse' : ''}`}
            >
              {!isMe && (
                <div
                  className="w-8 h-8 rounded-xl flex items-center justify-center text-xs font-bold text-white flex-shrink-0"
                  style={{ background: chat.color }}
                >
                  {chat.type === 'bot' || chat.type === 'group' ? '🤖' : chat.avatar}
                </div>
              )}
              <div className={`max-w-[70%] group relative`}>
                <div className={`px-4 py-2.5 text-sm font-rubik leading-relaxed ${isMe ? 'chat-bubble-out text-white' : 'chat-bubble-in text-white/85'}`}>
                  {msg.text}
                </div>
                <div className={`flex items-center gap-1 mt-1 ${isMe ? 'justify-end' : ''}`}>
                  <span className="text-[10px] text-white/20">{msg.time}</span>
                  {isMe && (
                    <Icon name={msg.read ? 'CheckCheck' : 'Check'} size={12} className={msg.read ? 'text-neon-cyan' : 'text-white/30'} />
                  )}
                </div>
              </div>
            </div>
          );
        })}

        {/* Typing indicator */}
        {isTyping && (
          <div className="flex items-end gap-2 animate-fade-in">
            <div className="w-8 h-8 rounded-xl flex items-center justify-center text-xs font-bold text-white" style={{ background: chat.color }}>
              {chat.avatar}
            </div>
            <div className="chat-bubble-in px-4 py-3 flex gap-1.5 items-center">
              <span className="w-2 h-2 rounded-full bg-white/40 typing-dot"></span>
              <span className="w-2 h-2 rounded-full bg-white/40 typing-dot"></span>
              <span className="w-2 h-2 rounded-full bg-white/40 typing-dot"></span>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="px-6 py-4 border-t border-white/5">
        <div className="glass rounded-2xl flex items-center gap-3 px-4 py-3 border border-white/8 focus-within:border-neon-purple/40 transition-all">
          <button className="text-white/30 hover:text-neon-pink transition-colors flex-shrink-0" onClick={() => setShowEmojiHint(!showEmojiHint)}>
            <Icon name="Smile" size={20} />
          </button>
          <input
            type="text"
            value={message}
            onChange={e => setMessage(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleSend()}
            placeholder="Написать сообщение..."
            className="flex-1 bg-transparent text-white text-sm placeholder-white/25 focus:outline-none font-rubik"
          />
          <div className="flex items-center gap-2 flex-shrink-0">
            <button className="text-white/30 hover:text-neon-cyan transition-colors">
              <Icon name="Paperclip" size={18} />
            </button>
            <button className="text-white/30 hover:text-neon-purple transition-colors">
              <Icon name="Image" size={18} />
            </button>
            <button className="text-white/30 hover:text-neon-green transition-colors">
              <Icon name="Mic" size={18} />
            </button>
            <button
              onClick={handleSend}
              disabled={!message.trim()}
              className={`w-9 h-9 rounded-xl flex items-center justify-center transition-all ${
                message.trim()
                  ? 'bg-gradient-to-br from-neon-purple to-neon-cyan neon-glow hover:scale-105'
                  : 'bg-white/10 text-white/20'
              }`}
            >
              <Icon name="Send" size={16} className={message.trim() ? 'text-white' : ''} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
