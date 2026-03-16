import Icon from '@/components/ui/icon';
import { notifications } from '@/data/mockData';

const iconMap: Record<string, string> = {
  message: 'MessageCircle',
  group: 'Users',
  call: 'PhoneMissed',
  story: 'CirclePlay',
};

const colorMap: Record<string, string> = {
  message: '#8B5CF6',
  group: '#22D3EE',
  call: '#EF4444',
  story: '#EC4899',
};

export default function NotificationsPanel() {
  const unread = notifications.filter(n => !n.read);
  const read = notifications.filter(n => n.read);

  return (
    <div className="flex-1 flex flex-col animate-slide-in-right">
      <div className="px-6 py-5 border-b border-white/5">
        <div className="flex items-center justify-between mb-1">
          <h2 className="text-xl font-black font-golos gradient-text">Уведомления</h2>
          {unread.length > 0 && (
            <button className="text-xs text-neon-purple hover:text-neon-cyan transition-colors font-rubik">
              Прочитать все
            </button>
          )}
        </div>
        {unread.length > 0 && (
          <span className="text-xs text-white/30 font-rubik">{unread.length} непрочитанных</span>
        )}
      </div>

      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-1">
        {unread.length > 0 && (
          <>
            <p className="text-xs font-bold text-white/30 uppercase tracking-wider font-rubik px-2 mb-3">Новые</p>
            {unread.map((notif, i) => (
              <div
                key={notif.id}
                className={`glass-strong rounded-2xl p-4 flex items-center gap-4 hover-lift animate-fade-in-up stagger-${Math.min(i + 1, 6)} border border-neon-purple/10 cursor-pointer`}
              >
                <div className="relative flex-shrink-0">
                  <div
                    className="w-12 h-12 rounded-2xl flex items-center justify-center text-sm font-bold text-white"
                    style={{ background: notif.color }}
                  >
                    {notif.avatar}
                  </div>
                  <span
                    className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full flex items-center justify-center"
                    style={{ background: colorMap[notif.type] }}
                  >
                    <Icon name={iconMap[notif.type]} size={10} className="text-white" />
                  </span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-white font-rubik leading-snug">{notif.text}</p>
                  <p className="text-xs text-white/30 mt-1 font-rubik">{notif.time}</p>
                </div>
                <span className="w-2.5 h-2.5 rounded-full bg-neon-purple animate-pulse-neon flex-shrink-0"></span>
              </div>
            ))}
          </>
        )}

        {read.length > 0 && (
          <>
            <div className="flex items-center gap-2 mt-5 mb-3 px-2">
              <p className="text-xs font-bold text-white/20 uppercase tracking-wider font-rubik">Прочитанные</p>
              <div className="flex-1 h-px bg-white/5"></div>
            </div>
            {read.map((notif, i) => (
              <div
                key={notif.id}
                className={`glass rounded-2xl p-4 flex items-center gap-4 opacity-60 hover:opacity-100 transition-opacity hover-lift animate-fade-in-up stagger-${Math.min(i + 1, 6)} cursor-pointer`}
              >
                <div className="relative flex-shrink-0">
                  <div
                    className="w-12 h-12 rounded-2xl flex items-center justify-center text-sm font-bold text-white"
                    style={{ background: notif.color }}
                  >
                    {notif.avatar}
                  </div>
                  <span
                    className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full flex items-center justify-center"
                    style={{ background: colorMap[notif.type] }}
                  >
                    <Icon name={iconMap[notif.type]} size={10} className="text-white" />
                  </span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-white/70 font-rubik leading-snug">{notif.text}</p>
                  <p className="text-xs text-white/25 mt-1 font-rubik">{notif.time}</p>
                </div>
              </div>
            ))}
          </>
        )}
      </div>
    </div>
  );
}
