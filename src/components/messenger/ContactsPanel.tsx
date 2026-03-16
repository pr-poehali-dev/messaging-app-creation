import Icon from '@/components/ui/icon';
import { contacts } from '@/data/mockData';

interface ContactsPanelProps {
  onStartChat?: (contactId: string) => void;
}

export default function ContactsPanel({ onStartChat }: ContactsPanelProps) {
  const groups = {
    'Онлайн': contacts.filter(c => c.status === 'online'),
    'Недавно': contacts.filter(c => c.status === 'away'),
    'Не в сети': contacts.filter(c => c.status === 'offline'),
  };

  return (
    <div className="flex-1 flex flex-col animate-slide-in-right">
      <div className="px-6 py-5 border-b border-white/5">
        <h2 className="text-xl font-black font-golos gradient-text mb-4">Контакты</h2>
        <div className="relative">
          <Icon name="Search" size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30" />
          <input
            type="text"
            placeholder="Найти контакт..."
            className="w-full bg-white/5 border border-white/8 rounded-xl pl-9 pr-4 py-2.5 text-sm text-white/80 placeholder-white/25 focus:outline-none focus:border-neon-purple/50 transition-all font-rubik"
          />
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-6">
        {Object.entries(groups).map(([group, members]) => (
          members.length > 0 && (
            <div key={group}>
              <div className="flex items-center gap-2 mb-3">
                <span className="text-xs font-bold text-white/30 uppercase tracking-wider font-rubik">{group}</span>
                <span className="text-xs text-white/20">({members.length})</span>
                <div className="flex-1 h-px bg-white/5 ml-1"></div>
              </div>
              <div className="space-y-1">
                {members.map((contact, i) => (
                  <div
                    key={contact.id}
                    className={`glass rounded-2xl p-4 flex items-center gap-4 hover-lift animate-fade-in-up stagger-${Math.min(i + 1, 6)} group`}
                  >
                    <div className="relative flex-shrink-0">
                      <div
                        className="w-12 h-12 rounded-2xl flex items-center justify-center text-sm font-bold text-white"
                        style={{ background: contact.color }}
                      >
                        {contact.avatar}
                      </div>
                      <span className={`absolute bottom-0 right-0 w-3.5 h-3.5 rounded-full border-2 border-background ${
                        contact.status === 'online' ? 'status-online' :
                        contact.status === 'away' ? 'status-away' : 'status-offline'
                      }`}></span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-white font-golos text-sm">{contact.name}</p>
                      <p className="text-xs text-white/35 font-rubik truncate">{contact.bio}</p>
                      <p className="text-[11px] text-white/20 font-rubik mt-0.5">{contact.username}</p>
                    </div>
                    <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button className="w-8 h-8 rounded-xl glass flex items-center justify-center text-white/40 hover:text-neon-cyan transition-colors">
                        <Icon name="Phone" size={14} />
                      </button>
                      <button
                        onClick={() => onStartChat?.(contact.id)}
                        className="w-8 h-8 rounded-xl bg-neon-purple/20 flex items-center justify-center text-neon-purple hover:bg-neon-purple/30 transition-colors"
                      >
                        <Icon name="MessageCircle" size={14} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )
        ))}
      </div>
    </div>
  );
}
