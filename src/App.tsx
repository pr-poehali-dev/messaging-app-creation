import { useState } from 'react';
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import Sidebar from '@/components/messenger/Sidebar';
import ChatList from '@/components/messenger/ChatList';
import ChatWindow from '@/components/messenger/ChatWindow';
import ContactsPanel from '@/components/messenger/ContactsPanel';
import NotificationsPanel from '@/components/messenger/NotificationsPanel';
import SearchPanel from '@/components/messenger/SearchPanel';
import ProfilePanel from '@/components/messenger/ProfilePanel';
import SettingsPanel from '@/components/messenger/SettingsPanel';
import { chats, notifications } from '@/data/mockData';

type Tab = 'chats' | 'contacts' | 'notifications' | 'search' | 'profile' | 'settings';

export default function App() {
  const [activeTab, setActiveTab] = useState<Tab>('chats');
  const [selectedChatId, setSelectedChatId] = useState<string | null>('c1');

  const unreadCount = chats.reduce((sum, c) => sum + c.unread, 0);
  const notifCount = notifications.filter(n => !n.read).length;

  const handleTabChange = (tab: Tab) => {
    setActiveTab(tab);
    if (tab !== 'chats') setSelectedChatId(null);
  };

  const renderMainContent = () => {
    switch (activeTab) {
      case 'chats':
        return (
          <>
            <ChatList
              selectedChatId={selectedChatId}
              onSelectChat={(id) => setSelectedChatId(id)}
            />
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
        return <ProfilePanel />;
      case 'settings':
        return <SettingsPanel />;
      default:
        return null;
    }
  };

  return (
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <div className="h-screen w-screen flex overflow-hidden bg-background relative">
        {/* Ambient background orbs */}
        <div className="pointer-events-none fixed inset-0 overflow-hidden">
          <div
            className="absolute top-[-20%] left-[-10%] w-[60%] h-[60%] rounded-full opacity-[0.06] blur-3xl animate-float"
            style={{ background: '#8B5CF6' }}
          />
          <div
            className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] rounded-full opacity-[0.04] blur-3xl"
            style={{ background: '#22D3EE', animationDelay: '1.5s' }}
          />
          <div
            className="absolute top-[40%] right-[20%] w-[30%] h-[30%] rounded-full opacity-[0.03] blur-3xl"
            style={{ background: '#EC4899' }}
          />
        </div>

        {/* Sidebar */}
        <Sidebar
          activeTab={activeTab}
          onTabChange={handleTabChange}
          unreadCount={unreadCount}
          notifCount={notifCount}
        />

        {/* Main content */}
        <main className="flex-1 flex overflow-hidden">
          {renderMainContent()}
        </main>
      </div>
    </TooltipProvider>
  );
}
