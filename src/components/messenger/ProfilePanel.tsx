import { useState } from 'react';
import Icon from '@/components/ui/icon';
import { currentUser } from '@/data/mockData';

export default function ProfilePanel() {
  const [editing, setEditing] = useState(false);
  const [name, setName] = useState(currentUser.name);
  const [bio, setBio] = useState(currentUser.bio);

  const stats = [
    { label: 'Сообщений', value: '1 284', icon: 'MessageCircle', color: '#8B5CF6' },
    { label: 'Контактов', value: '36', icon: 'Users', color: '#22D3EE' },
    { label: 'Групп', value: '8', icon: 'Users2', color: '#EC4899' },
    { label: 'Историй', value: '24', icon: 'CirclePlay', color: '#10B981' },
  ];

  return (
    <div className="flex-1 flex flex-col overflow-y-auto animate-slide-in-right">
      {/* Hero cover */}
      <div className="relative h-40 flex-shrink-0">
        <div className="absolute inset-0 bg-gradient-to-br from-neon-purple via-neon-pink to-neon-cyan opacity-60"></div>
        <div className="absolute inset-0 mesh-bg"></div>
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="animate-spin-slow opacity-30">
            <Icon name="Hexagon" size={120} className="text-white" />
          </div>
        </div>
        <button className="absolute top-4 right-4 w-8 h-8 glass rounded-xl flex items-center justify-center text-white/70 hover:text-white transition-colors">
          <Icon name="Camera" size={14} />
        </button>
      </div>

      {/* Avatar */}
      <div className="px-6 -mt-10 mb-4 flex items-end justify-between">
        <div className="relative">
          <div
            className="w-20 h-20 rounded-3xl border-4 border-background flex items-center justify-center text-2xl font-black text-white neon-glow"
            style={{ background: `linear-gradient(135deg, ${currentUser.color}, #22D3EE)` }}
          >
            {currentUser.avatar}
          </div>
          <span className="absolute bottom-1 right-1 w-4 h-4 rounded-full status-online border-2 border-background"></span>
        </div>
        <button
          onClick={() => setEditing(!editing)}
          className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all font-rubik ${
            editing
              ? 'bg-neon-green/20 text-neon-green border border-neon-green/30'
              : 'glass border border-white/10 text-white/70 hover:text-white'
          }`}
        >
          {editing ? (
            <span className="flex items-center gap-1.5"><Icon name="Check" size={14} /> Сохранить</span>
          ) : (
            <span className="flex items-center gap-1.5"><Icon name="Pencil" size={14} /> Редактировать</span>
          )}
        </button>
      </div>

      <div className="px-6 space-y-6 pb-6">
        {/* Name & bio */}
        <div>
          {editing ? (
            <input
              value={name}
              onChange={e => setName(e.target.value)}
              className="text-2xl font-black font-golos bg-transparent text-white border-b border-neon-purple/50 focus:outline-none w-full mb-2"
            />
          ) : (
            <h2 className="text-2xl font-black font-golos gradient-text">{name}</h2>
          )}
          <p className="text-neon-cyan text-sm font-rubik mb-2">{currentUser.username}</p>
          {editing ? (
            <textarea
              value={bio}
              onChange={e => setBio(e.target.value)}
              className="text-sm text-white/60 font-rubik bg-white/5 rounded-xl p-3 w-full border border-white/10 focus:outline-none focus:border-neon-purple/50 resize-none"
              rows={2}
            />
          ) : (
            <p className="text-sm text-white/50 font-rubik">{bio}</p>
          )}
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 gap-3">
          {stats.map((stat, i) => (
            <div key={stat.label} className={`glass rounded-2xl p-4 hover-lift animate-fade-in-up stagger-${i + 1}`}>
              <div className="flex items-center gap-2 mb-2">
                <div className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ background: `${stat.color}25` }}>
                  <Icon name={stat.icon} size={14} style={{ color: stat.color }} />
                </div>
              </div>
              <p className="text-2xl font-black font-golos text-white">{stat.value}</p>
              <p className="text-xs text-white/35 font-rubik">{stat.label}</p>
            </div>
          ))}
        </div>

        {/* Info */}
        <div className="glass rounded-2xl p-4 space-y-3">
          <p className="text-xs font-bold text-white/30 uppercase tracking-wider font-rubik">Контактная информация</p>
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-neon-purple/15 flex items-center justify-center">
              <Icon name="Phone" size={14} className="text-neon-purple" />
            </div>
            <span className="text-sm text-white/70 font-rubik">{currentUser.phone}</span>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-neon-cyan/15 flex items-center justify-center">
              <Icon name="AtSign" size={14} className="text-neon-cyan" />
            </div>
            <span className="text-sm text-white/70 font-rubik">{currentUser.username}</span>
          </div>
        </div>

        {/* Quick actions */}
        <div className="grid grid-cols-3 gap-2">
          {[
            { label: 'Истории', icon: 'CirclePlay', color: '#EC4899' },
            { label: 'Медиа', icon: 'Image', color: '#22D3EE' },
            { label: 'Ссылки', icon: 'Link', color: '#10B981' },
          ].map(item => (
            <button
              key={item.label}
              className="glass rounded-2xl p-3 flex flex-col items-center gap-2 hover-lift transition-all border border-transparent hover:border-white/10"
            >
              <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: `${item.color}20` }}>
                <Icon name={item.icon} size={20} style={{ color: item.color }} />
              </div>
              <span className="text-xs text-white/50 font-rubik">{item.label}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
