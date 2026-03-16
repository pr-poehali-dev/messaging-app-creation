import { useState, useEffect } from 'react';
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import LoginScreen, { User } from '@/components/auth/LoginScreen';
import Sidebar from '@/components/messenger/Sidebar';
import ChatList from '@/components/messenger/ChatList';
import ChatWindow from '@/components/messenger/ChatWindow';
import ContactsPanel from '@/components/messenger/ContactsPanel';
import NotificationsPanel from '@/components/messenger/NotificationsPanel';
import SearchPanel from '@/components/messenger/SearchPanel';
import ProfilePanel from '@/components/messenger/ProfilePanel';
import SettingsPanel from '@/components/messenger/SettingsPanel';
import { chats, notifications } from '@/data/mockData';
import { api } from '@/lib/api';

type Tab = 'chats' | 'contacts' | 'notifications' | 'search' | 'profile' | 'settings';

export default function App() {
  const [token, setToken] = useState<string | null>(() => localStorage.getItem('nc_token'));
  const [user, setUser] = useState<User | null>(() => {
    const u = localStorage.getItem('nc_user');
    return u ? JSON.parse(u) : null;
  });
  const [checking, setChecking] = useState(true);
  const [activeTab, setActiveTab] = useState<Tab>('chats');
  const [selectedChatId, setSelectedChatId] = useState<string | null>('c1');

  const unreadCount = chats.reduce((sum, c) => sum + c.unread, 0);
  const notifCount = notifications.filter(n => !n.read).length;

  useEffect(() => {
    const verify = async () => {
      const savedToken = localStorage.getItem('nc_token');
      if (!savedToken) { setChecking(false); return; }
      try {
        const res = await api.getMe(savedToken);
        if (res.user) {
          setToken(savedToken);
          setUser(res.user);
        } else {
          localStorage.removeItem('nc_token');
          localStorage.removeItem('nc_user');
          setToken(null);
          setUser(null);
        }
      } catch {
        // Network error — keep cached session
      } finally {
        setChecking(false);
      }
    };
    verify();
  }, []);

  const handleLogin = (newToken: string, newUser: User) => {
    localStorage.setItem('nc_token', newToken);
    localStorage.setItem('nc_user', JSON.stringify(newUser));
    setToken(newToken);
    setUser(newUser);
  };

  const handleLogout = async () => {
    if (token) await api.logout(token).catch(() => {});
    localStorage.removeItem('nc_token');
    localStorage.removeItem('nc_user');
    setToken(null);
    setUser(null);
  };

  const handleTabChange = (tab: Tab) => {
    setActiveTab(tab);
    if (tab !== 'chats') setSelectedChatId(null);
  };

  if (checking) {
    return (
      <div className="h-screen w-screen flex items-center justify-center bg-background">
        <div className="text-center animate-fade-in-up">
          <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-neon-purple to-neon-cyan mx-auto mb-4 flex items-center justify-center neon-glow animate-float">
            <span className="text-white font-golos font-black text-4xl">N</span>
          </div>
          <div className="flex gap-1.5 justify-center mt-4">
            <span className="w-2 h-2 rounded-full bg-neon-purple typing-dot"></span>
            <span className="w-2 h-2 rounded-full bg-neon-purple typing-dot"></span>
            <span className="w-2 h-2 rounded-full bg-neon-purple typing-dot"></span>
          </div>
        </div>
      </div>
    );
  }

  if (!token || !user) {
    return (
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <LoginScreen onLogin={handleLogin} />
      </TooltipProvider>
    );
  }

  const renderMainContent = () => {
    switch (activeTab) {
      case 'chats':
        return (
          <>
            <ChatList selectedChatId={selectedChatId} onSelectChat={setSelectedChatId} />
            <ChatWindow chatId={selectedChatId} />
          </>
        );
      case 'contacts':
        return <ContactsPanel onStartChat={() => setActiveTab('chats')} />;
      case 'notifications':
        return <NotificationsPanel />;
      case 'search':
        return <SearchPanel />;
      case 'profile':
        return <ProfilePanel user={user} token={token} onUpdate={setUser} onLogout={handleLogout} />;
      case 'settings':
        return <SettingsPanel onLogout={handleLogout} />;
      default:
        return null;
    }
  };

  return (
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <div className="h-screen w-screen flex overflow-hidden bg-background relative">
        <div className="pointer-events-none fixed inset-0 overflow-hidden">
          <div className="absolute top-[-20%] left-[-10%] w-[60%] h-[60%] rounded-full opacity-[0.06] blur-3xl animate-float" style={{ background: '#8B5CF6' }} />
          <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] rounded-full opacity-[0.04] blur-3xl" style={{ background: '#22D3EE' }} />
          <div className="absolute top-[40%] right-[20%] w-[30%] h-[30%] rounded-full opacity-[0.03] blur-3xl" style={{ background: '#EC4899' }} />
        </div>
        <Sidebar activeTab={activeTab} onTabChange={handleTabChange} unreadCount={unreadCount} notifCount={notifCount} />
        <main className="flex-1 flex overflow-hidden">
          {renderMainContent()}
        </main>
      </div>
    </TooltipProvider>
  );
}
