import { useState } from 'react';
import Icon from '@/components/ui/icon';
import { chats, stories } from '@/data/mockData';

interface ChatListProps {
  selectedChatId: string | null;
  onSelectChat: (id: string) => void;
}

export default function ChatList({ selectedChatId, onSelectChat }: ChatListProps) {
  const [filter, setFilter] = useState<'all' | 'unread' | 'groups'>('all');

  const filtered = chats.filter(c => {
    if (filter === 'unread') return c.unread > 0;
    if (filter === 'groups') return c.type === 'group';
    return true;
  });

  return (
    <div className="w-80 flex flex-col border-r border-white/5 animate-slide-in-left">
      {/* Header */}
      <div className="px-5 pt-5 pb-3">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-xl font-black font-golos gradient-text">Сообщения</h1>
          <button className="w-8 h-8 rounded-xl glass flex items-center justify-center hover:neon-glow transition-all text-white/60 hover:text-white">
            <Icon name="SquarePen" size={16} />
          </button>
        </div>

        {/* Search */}
        <div className="relative mb-4">
          <Icon name="Search" size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30" />
          <input
            type="text"
            placeholder="Поиск чатов..."
            className="w-full bg-white/5 border border-white/8 rounded-xl pl-9 pr-4 py-2.5 text-sm text-white/80 placeholder-white/25 focus:outline-none focus:border-neon-purple/50 transition-all font-rubik"
          />
        </div>

        {/* Filters */}
        <div className="flex gap-2">
          {[
            { key: 'all', label: 'Все' },
            { key: 'unread', label: 'Непрочитанные' },
            { key: 'groups', label: 'Группы' },
          ].map(({ key, label }) => (
            <button
              key={key}
              onClick={() => setFilter(key as typeof filter)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                filter === key
                  ? 'bg-neon-purple text-white'
                  : 'glass text-white/40 hover:text-white/70'
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* Stories row */}
      <div className="px-3 pb-3">
        <div className="flex gap-3 overflow-x-auto pb-1 scrollbar-hide">
          {stories.map((story) => (
            <button key={story.id} className="flex flex-col items-center gap-1.5 flex-shrink-0">
              <div className={`p-0.5 rounded-2xl ${story.viewed ? 'bg-white/10' : 'story-ring'}`}>
                <div
                  className="w-12 h-12 rounded-xl flex items-center justify-center text-sm font-bold text-white relative"
                  style={{ background: story.color }}
                >
                  {story.avatar}
                  {story.id === 's1' && (
                    <span className="absolute -bottom-1 -right-1 w-5 h-5 bg-neon-purple rounded-full flex items-center justify-center">
                      <Icon name="Plus" size={10} className="text-white" />
                    </span>
                  )}
                </div>
              </div>
              <span className="text-[10px] text-white/50 font-rubik">{story.name}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Chat list */}
      <div className="flex-1 overflow-y-auto px-2 space-y-0.5">
        {filtered.map((chat, i) => (
          <button
            key={chat.id}
            onClick={() => onSelectChat(chat.id)}
            className={`w-full flex items-center gap-3 px-3 py-3 rounded-2xl transition-all text-left hover-lift animate-fade-in-up stagger-${Math.min(i + 1, 6)} ${
              selectedChatId === chat.id
                ? 'glass-strong border border-neon-purple/20'
                : 'hover:glass'
            }`}
          >
            {/* Avatar */}
            <div className="relative flex-shrink-0">
              <div
                className="w-12 h-12 rounded-2xl flex items-center justify-center text-lg font-bold text-white"
                style={{ background: chat.type === 'group' || chat.type === 'bot' ? `linear-gradient(135deg, ${chat.color}, ${chat.color}99)` : chat.color }}
              >
                {chat.type === 'group' || chat.type === 'bot' ? (
                  <span className="text-xl">{chat.avatar}</span>
                ) : (
                  <span className="text-sm">{chat.avatar}</span>
                )}
              </div>
              {chat.online && (
                <span className="absolute bottom-0 right-0 w-3.5 h-3.5 rounded-full status-online border-2 border-background"></span>
              )}
              {chat.pinned && (
                <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-neon-purple/80 flex items-center justify-center">
                  <Icon name="Pin" size={8} className="text-white" />
                </span>
              )}
            </div>

            {/* Info */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between mb-0.5">
                <span className="font-semibold text-sm text-white truncate font-golos">{chat.name}</span>
                <span className="text-[11px] text-white/35 ml-2 flex-shrink-0">{chat.time}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs text-white/40 truncate font-rubik">{chat.lastMessage}</span>
                {chat.unread > 0 && (
                  <span className="ml-2 min-w-5 h-5 px-1.5 bg-gradient-to-br from-neon-purple to-neon-pink rounded-full text-[10px] font-bold text-white flex items-center justify-center flex-shrink-0">
                    {chat.unread}
                  </span>
                )}
              </div>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
