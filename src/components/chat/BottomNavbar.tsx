import { MessageSquare, Users } from 'lucide-react';

interface BottomNavbarProps {
  activeView: 'conversations' | 'chat';
  onViewChange: (view: 'conversations' | 'chat') => void;
  hasActiveChat: boolean;
}

export const BottomNavbar = ({ activeView, onViewChange, hasActiveChat }: BottomNavbarProps) => {
  return (
    <div className="fixed bottom-0 left-0 right-0 bg-card border-t border-border backdrop-blur-md bg-card/80 z-50">
      <div className="flex items-center justify-around h-16 px-4">
        <button
          onClick={() => onViewChange('conversations')}
          className={`flex flex-col items-center justify-center gap-1 px-6 py-2 rounded-full transition-all ${
            activeView === 'conversations'
              ? 'bg-primary text-primary-foreground'
              : 'text-muted-foreground hover:text-foreground'
          }`}
        >
          <Users className="h-5 w-5" />
          <span className="text-xs font-medium">Chats</span>
        </button>

        <button
          onClick={() => onViewChange('chat')}
          disabled={!hasActiveChat}
          className={`flex flex-col items-center justify-center gap-1 px-6 py-2 rounded-full transition-all ${
            activeView === 'chat' && hasActiveChat
              ? 'bg-primary text-primary-foreground'
              : hasActiveChat
              ? 'text-muted-foreground hover:text-foreground'
              : 'text-muted-foreground/50 cursor-not-allowed'
          }`}
        >
          <MessageSquare className="h-5 w-5" />
          <span className="text-xs font-medium">Messages</span>
        </button>
      </div>
    </div>
  );
};
