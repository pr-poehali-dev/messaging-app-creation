import { useState } from 'react';
import Icon from '@/components/ui/icon';
import { contacts, chats } from '@/data/mockData';

export default function SearchPanel() {
  const [query, setQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState<'all' | 'chats' | 'contacts' | 'messages'>('all');

  const filteredContacts = query
    ? contacts.filter(c => c.name.toLowerCase().includes(query.toLowerCase()) || c.username.includes(query.toLowerCase()))
    : [];

  const filteredChats = query
    ? chats.filter(c => c.name.toLowerCase().includes(query.toLowerCase()))
    : [];

  const hasResults = filteredContacts.length > 0 || filteredChats.length > 0;

  const trending = ['🔥 React 19', '💻 TypeScript', '🎨 Дизайн UI', '🚀 Стартапы', '🤖 ИИ тренды'];

  return (
    <div className="flex-1 flex flex-col animate-slide-in-right">
      <div className="px-6 py-5 border-b border-white/5">
        <h2 className="text-xl font-black font-golos gradient-text mb-4">Глобальный поиск</h2>
        <div className="relative mb-4">
          <Icon name="Search" size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-neon-purple/60" />
          <input
            type="text"
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder="Поиск людей, чатов, сообщений..."
            autoFocus
            className="w-full glass border border-neon-purple/20 rounded-2xl pl-11 pr-4 py-3 text-sm text-white/90 placeholder-white/25 focus:outline-none focus:border-neon-purple/50 transition-all font-rubik"
          />
          {query && (
            <button onClick={() => setQuery('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-white/30 hover:text-white transition-colors">
              <Icon name="X" size={14} />
            </button>
          )}
        </div>
        <div className="flex gap-2">
          {['all', 'chats', 'contacts', 'messages'].map(f => (
            <button
              key={f}
              onClick={() => setActiveFilter(f as typeof activeFilter)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all capitalize font-rubik ${
                activeFilter === f ? 'bg-neon-purple text-white' : 'glass text-white/40 hover:text-white/70'
              }`}
            >
              {f === 'all' ? 'Все' : f === 'chats' ? 'Чаты' : f === 'contacts' ? 'Контакты' : 'Сообщения'}
            </button>
          ))}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-4 py-4">
        {!query && (
          <div className="space-y-6">
            <div>
              <p className="text-xs font-bold text-white/30 uppercase tracking-wider font-rubik mb-3 px-2">Популярные темы</p>
              <div className="flex flex-wrap gap-2">
                {trending.map((tag, i) => (
                  <button
                    key={i}
                    onClick={() => setQuery(tag.replace(/^[^\s]+ /, ''))}
                    className={`glass rounded-xl px-3 py-2 text-sm text-white/60 hover:text-white hover:border-neon-purple/30 transition-all hover-lift animate-fade-in-up stagger-${Math.min(i + 1, 6)} border border-transparent font-rubik`}
                  >
                    {tag}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <p className="text-xs font-bold text-white/30 uppercase tracking-wider font-rubik mb-3 px-2">Последние поиски</p>
              {['Мария', 'Дизайн', 'Команда'].map((s, i) => (
                <button
                  key={i}
                  onClick={() => setQuery(s)}
                  className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl hover:glass transition-all text-left"
                >
                  <Icon name="Clock" size={14} className="text-white/25" />
                  <span className="text-sm text-white/50 font-rubik">{s}</span>
                  <Icon name="ArrowUpLeft" size={12} className="text-white/20 ml-auto" />
                </button>
              ))}
            </div>
          </div>
        )}

        {query && !hasResults && (
          <div className="text-center py-16">
            <Icon name="SearchX" size={40} className="text-white/15 mx-auto mb-4" />
            <p className="text-white/30 font-rubik">Ничего не найдено</p>
            <p className="text-white/15 text-sm font-rubik mt-1">Попробуйте другой запрос</p>
          </div>
        )}

        {query && hasResults && (
          <div className="space-y-4">
            {filteredContacts.length > 0 && (
              <div>
                <p className="text-xs font-bold text-white/30 uppercase tracking-wider font-rubik mb-2 px-2">Контакты</p>
                {filteredContacts.map((c, i) => (
                  <div key={c.id} className={`glass rounded-2xl p-4 flex items-center gap-3 mb-1 hover-lift animate-fade-in-up stagger-${i + 1}`}>
                    <div className="w-10 h-10 rounded-xl flex items-center justify-center text-sm font-bold text-white flex-shrink-0" style={{ background: c.color }}>{c.avatar}</div>
                    <div>
                      <p className="font-semibold text-white text-sm font-golos">{c.name}</p>
                      <p className="text-xs text-white/30 font-rubik">{c.username}</p>
                    </div>
                    <button className="ml-auto w-8 h-8 rounded-xl bg-neon-purple/20 flex items-center justify-center text-neon-purple">
                      <Icon name="MessageCircle" size={14} />
                    </button>
                  </div>
                ))}
              </div>
            )}
            {filteredChats.length > 0 && (
              <div>
                <p className="text-xs font-bold text-white/30 uppercase tracking-wider font-rubik mb-2 px-2">Чаты</p>
                {filteredChats.map((c, i) => (
                  <div key={c.id} className={`glass rounded-2xl p-4 flex items-center gap-3 mb-1 hover-lift animate-fade-in-up stagger-${i + 1}`}>
                    <div className="w-10 h-10 rounded-xl flex items-center justify-center font-bold text-white flex-shrink-0" style={{ background: c.color }}>
                      {c.type === 'group' ? <span className="text-lg">{c.avatar}</span> : <span className="text-xs">{c.avatar}</span>}
                    </div>
                    <div>
                      <p className="font-semibold text-white text-sm font-golos">{c.name}</p>
                      <p className="text-xs text-white/30 font-rubik">{c.lastMessage}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
