import { Button } from '@/components/ui/button';
import { MessageSquare, User, Settings } from 'lucide-react';

interface BottomNavbarProps {
  activeView: 'conversations' | 'chat';
  onViewChange: (view: 'conversations' | 'chat') => void;
  hasSelectedConversation: boolean;
}

export const BottomNavbar = ({ activeView, onViewChange, hasSelectedConversation }: BottomNavbarProps) => {
  return (
    <div className="border-t bg-card flex items-center justify-around py-2 px-4 safe-area-bottom">
      <Button
        variant="ghost"
        size="sm"
        className={`flex flex-col items-center gap-0.5 h-auto py-1.5 px-3 rounded-lg ${
          activeView === 'conversations' ? 'text-primary' : 'text-muted-foreground'
        }`}
        onClick={() => onViewChange('conversations')}
      >
        <MessageSquare className="h-5 w-5" />
        <span className="text-[10px] font-medium">Chats</span>
      </Button>

      {hasSelectedConversation && (
        <Button
          variant="ghost"
          size="sm"
          className={`flex flex-col items-center gap-0.5 h-auto py-1.5 px-3 rounded-lg ${
            activeView === 'chat' ? 'text-primary' : 'text-muted-foreground'
          }`}
          onClick={() => onViewChange('chat')}
        >
          <User className="h-5 w-5" />
          <span className="text-[10px] font-medium">Chat</span>
        </Button>
      )}
    </div>
  );
};
