import { useSelector } from 'react-redux';
import { RootState } from '@/store';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { MoreVertical, Phone, Video } from 'lucide-react';

export const ChatHeader = () => {
  const { conversations, selectedConversationId } = useSelector((state: RootState) => state.conversations);
  const currentUserId = useSelector((state: RootState) => state.auth.user?._id);

  const selectedConversation = conversations.find((c) => c._id === selectedConversationId);

  if (!selectedConversation) return null;

  const getOtherParticipant = () => {
    if (selectedConversation.type === 'direct' && selectedConversation.participants) {
      return selectedConversation.participants.find((p) => p._id !== currentUserId);
    }
    return null;
  };

  const other = getOtherParticipant();
  const displayName = selectedConversation.title || other?.username || 'Unknown';
  const displayPic = other?.profilePic;
  const status = other?.status;

  const getStatusText = () => {
    if (!other) return '';
    if (status === 'online') return 'Online';
    if (status === 'away') return 'Away';
    if (other.lastSeen) {
      return `Last seen ${new Date(other.lastSeen).toLocaleString()}`;
    }
    return 'Offline';
  };

  return (
    <div className="border-b p-4 bg-card">
      <div className="max-w-4xl mx-auto flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Avatar className="h-10 w-10">
            <AvatarImage src={displayPic} />
            <AvatarFallback className="gradient-primary text-primary-foreground">
              {displayName[0]?.toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <div>
            <p className="font-semibold">{displayName}</p>
            <p className="text-xs text-muted-foreground">{getStatusText()}</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" className="hover:bg-muted transition-smooth">
            <Phone className="h-5 w-5" />
          </Button>
          <Button variant="ghost" size="icon" className="hover:bg-muted transition-smooth">
            <Video className="h-5 w-5" />
          </Button>
          <Button variant="ghost" size="icon" className="hover:bg-muted transition-smooth">
            <MoreVertical className="h-5 w-5" />
          </Button>
        </div>
      </div>
    </div>
  );
};
