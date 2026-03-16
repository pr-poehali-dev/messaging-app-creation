import Icon from '@/components/ui/icon';
import { currentUser } from '@/data/mockData';

type Tab = 'chats' | 'contacts' | 'notifications' | 'search' | 'profile' | 'settings';

interface SidebarProps {
  activeTab: Tab;
  onTabChange: (tab: Tab) => void;
  unreadCount: number;
  notifCount: number;
}

const navItems: { tab: Tab; icon: string; label: string }[] = [
  { tab: 'chats', icon: 'MessageCircle', label: 'Чаты' },
  { tab: 'contacts', icon: 'Users', label: 'Контакты' },
  { tab: 'search', icon: 'Search', label: 'Поиск' },
  { tab: 'notifications', icon: 'Bell', label: 'Уведомления' },
  { tab: 'profile', icon: 'User', label: 'Профиль' },
  { tab: 'settings', icon: 'Settings', label: 'Настройки' },
];

export default function Sidebar({ activeTab, onTabChange, unreadCount, notifCount }: SidebarProps) {
  return (
    <aside className="w-20 flex flex-col items-center py-6 gap-2 border-r border-white/5 relative z-10">
      {/* Logo */}
      <div className="mb-4 relative animate-fade-in-up">
        <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-neon-purple to-neon-cyan flex items-center justify-center neon-glow animate-float">
          <span className="text-white font-golos font-black text-lg">N</span>
        </div>
      </div>

      {/* Nav items */}
      <nav className="flex flex-col gap-1 flex-1">
        {navItems.map(({ tab, icon, label }, i) => {
          const isActive = activeTab === tab;
          const badge = tab === 'chats' ? unreadCount : tab === 'notifications' ? notifCount : 0;
          return (
            <button
              key={tab}
              onClick={() => onTabChange(tab)}
              title={label}
              className={`relative group w-12 h-12 rounded-2xl flex items-center justify-center transition-all duration-300 hover-lift animate-fade-in-up stagger-${i + 1} ${
                isActive
                  ? 'nav-item-active neon-glow'
                  : 'hover:bg-white/5 text-white/40 hover:text-white/80'
              }`}
            >
              <Icon
                name={icon}
                size={22}
                className={isActive ? 'text-neon-purple' : 'text-current'}
              />
              {badge > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-gradient-to-br from-neon-pink to-neon-purple rounded-full text-[10px] font-bold text-white flex items-center justify-center animate-scale-in">
                  {badge > 9 ? '9+' : badge}
                </span>
              )}
              {/* Tooltip */}
              <span className="absolute left-14 bg-card border border-white/10 text-white text-xs px-2 py-1 rounded-lg whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-50 font-rubik">
                {label}
              </span>
            </button>
          );
        })}
      </nav>

      {/* Avatar */}
      <button
        onClick={() => onTabChange('profile')}
        className="w-12 h-12 rounded-2xl overflow-hidden relative hover-lift transition-all"
      >
        <div
          className="w-full h-full flex items-center justify-center text-white font-bold text-sm"
          style={{ background: currentUser.color }}
        >
          {currentUser.avatar}
        </div>
        <span className="absolute bottom-0.5 right-0.5 w-3 h-3 rounded-full status-online border-2 border-background"></span>
      </button>
    </aside>
  );
}
