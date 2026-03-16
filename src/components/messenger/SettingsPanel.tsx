import { useState } from 'react';
import Icon from '@/components/ui/icon';

interface SettingsPanelProps {
  onLogout?: () => void;
}

export default function SettingsPanel({ onLogout }: SettingsPanelProps) {
  const [notifications, setNotifications] = useState(true);
  const [sounds, setSounds] = useState(true);
  const [twoFactor, setTwoFactor] = useState(false);
  const [theme, setTheme] = useState<'dark' | 'auto'>('dark');

  const Toggle = ({ value, onChange }: { value: boolean; onChange: (v: boolean) => void }) => (
    <button
      onClick={() => onChange(!value)}
      className={`relative w-12 h-6 rounded-full transition-all duration-300 ${value ? 'bg-gradient-to-r from-neon-purple to-neon-cyan neon-glow' : 'bg-white/10'}`}
    >
      <span
        className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all duration-300 shadow-lg ${value ? 'left-7' : 'left-1'}`}
      />
    </button>
  );

  const groups = [
    {
      title: 'Уведомления',
      icon: 'Bell',
      color: '#8B5CF6',
      items: [
        { label: 'Push-уведомления', desc: 'Получать уведомления', value: notifications, onChange: setNotifications },
        { label: 'Звуки', desc: 'Звуковые сигналы', value: sounds, onChange: setSounds },
      ],
    },
    {
      title: 'Приватность',
      icon: 'Shield',
      color: '#EC4899',
      items: [
        { label: 'Двухфакторная защита', desc: 'Дополнительная безопасность', value: twoFactor, onChange: setTwoFactor },
      ],
    },
  ];

  return (
    <div className="flex-1 flex flex-col overflow-y-auto animate-slide-in-right">
      <div className="px-6 py-5 border-b border-white/5">
        <h2 className="text-xl font-black font-golos gradient-text">Настройки</h2>
      </div>

      <div className="px-4 py-4 space-y-4">
        {/* Theme selector */}
        <div className="glass rounded-2xl p-5 animate-fade-in-up">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-8 h-8 rounded-xl bg-neon-cyan/15 flex items-center justify-center">
              <Icon name="Palette" size={16} className="text-neon-cyan" />
            </div>
            <span className="font-semibold text-white font-golos">Тема</span>
          </div>
          <div className="flex gap-3">
            {['dark', 'auto'].map(t => (
              <button
                key={t}
                onClick={() => setTheme(t as typeof theme)}
                className={`flex-1 py-3 rounded-xl text-sm font-semibold transition-all font-rubik ${
                  theme === t ? 'bg-gradient-to-r from-neon-purple to-neon-cyan text-white' : 'glass text-white/40 hover:text-white'
                }`}
              >
                {t === 'dark' ? '🌙 Тёмная' : '⚡ Авто'}
              </button>
            ))}
          </div>
        </div>

        {/* Toggle groups */}
        {groups.map((group, gi) => (
          <div key={group.title} className={`glass rounded-2xl p-5 animate-fade-in-up stagger-${gi + 2}`}>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-xl flex items-center justify-center" style={{ background: `${group.color}20` }}>
                <Icon name={group.icon} size={16} style={{ color: group.color }} />
              </div>
              <span className="font-semibold text-white font-golos">{group.title}</span>
            </div>
            <div className="space-y-4">
              {group.items.map(item => (
                <div key={item.label} className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-white font-rubik">{item.label}</p>
                    <p className="text-xs text-white/30 font-rubik">{item.desc}</p>
                  </div>
                  <Toggle value={item.value} onChange={item.onChange} />
                </div>
              ))}
            </div>
          </div>
        ))}

        {/* Links */}
        <div className="glass rounded-2xl overflow-hidden animate-fade-in-up stagger-4">
          {[
            { label: 'Устройства', icon: 'Monitor', desc: 'Активные сессии', color: '#22D3EE' },
            { label: 'Язык', icon: 'Globe', desc: 'Русский', color: '#10B981' },
            { label: 'Хранилище', icon: 'HardDrive', desc: '2.4 ГБ из 15 ГБ', color: '#F97316' },
            { label: 'Поддержка', icon: 'LifeBuoy', desc: 'Центр помощи', color: '#8B5CF6' },
          ].map((item, i) => (
            <button
              key={item.label}
              className={`w-full flex items-center gap-3 px-5 py-4 hover:bg-white/5 transition-colors text-left ${i > 0 ? 'border-t border-white/5' : ''}`}
            >
              <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: `${item.color}15` }}>
                <Icon name={item.icon} size={16} style={{ color: item.color }} />
              </div>
              <div className="flex-1">
                <p className="text-sm text-white font-rubik">{item.label}</p>
                <p className="text-xs text-white/30 font-rubik">{item.desc}</p>
              </div>
              <Icon name="ChevronRight" size={14} className="text-white/20" />
            </button>
          ))}
        </div>

        {/* Logout */}
        <button onClick={onLogout} className="w-full glass rounded-2xl p-4 flex items-center justify-center gap-2 text-red-400 hover:bg-red-500/10 transition-all border border-red-500/10 hover:border-red-500/20 animate-fade-in-up stagger-5">
          <Icon name="LogOut" size={16} />
          <span className="text-sm font-semibold font-rubik">Выйти из аккаунта</span>
        </button>
      </div>
    </div>
  );
}