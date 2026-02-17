import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '@/store';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { MoreVertical, Phone, Video } from 'lucide-react';
import { UserProfileDialog } from './UserProfileDialog';
import { ThemeToggle } from '@/components/ThemeToggle';
import { ThemeSelector, ChatTheme } from './ThemeSelector';
import { WallpaperSelector } from './WallpaperSelector';
import { CallInterface } from '../calling/CallInterface';

export const ChatHeader = () => {
  const [showProfile, setShowProfile] = useState(false);
  const [activeCall, setActiveCall] = useState<'voice' | 'video' | null>(null);
  const { conversations, selectedConversationId } = useSelector((state: RootState) => state.conversations);
  const currentUserId = useSelector((state: RootState) => state.auth.user?._id);

  const handleThemeChange = (theme: ChatTheme) => {
    if (!selectedConversationId) return;
    localStorage.setItem(`theme-${selectedConversationId}`, JSON.stringify(theme));
    const extractHSL = (hslString: string) => {
      const match = hslString.match(/hsl\((.*?)\)/);
      return match ? match[1] : hslString;
    };
    const style = document.getElementById('chat-theme-style') || document.createElement('style');
    style.id = 'chat-theme-style';
    style.innerHTML = `
      :root {
        --chat-sent: ${extractHSL(theme.sentBg)};
        --chat-sent-foreground: ${extractHSL(theme.sentText)};
        --chat-received: ${extractHSL(theme.receivedBg)};
        --chat-received-foreground: ${extractHSL(theme.receivedText)};
      }
    `;
    if (!document.getElementById('chat-theme-style')) {
      document.head.appendChild(style);
    }
  };

  const handleWallpaperChange = (wallpaperUrl: string | null) => {
    const chatContainer = document.querySelector('.chat-messages-container') as HTMLElement;
    if (chatContainer) {
      if (wallpaperUrl) {
        if (wallpaperUrl.startsWith('data:image') || wallpaperUrl.startsWith('http')) {
          chatContainer.style.backgroundImage = `url(${wallpaperUrl})`;
          chatContainer.style.backgroundSize = 'cover';
          chatContainer.style.backgroundPosition = 'center';
          chatContainer.style.backgroundRepeat = 'no-repeat';
        } else {
          chatContainer.style.backgroundImage = '';
          chatContainer.style.background = wallpaperUrl;
        }
      } else {
        chatContainer.style.backgroundImage = '';
        chatContainer.style.background = '';
      }
    }
  };

  useEffect(() => {
    if (selectedConversationId) {
      const savedTheme = localStorage.getItem(`theme-${selectedConversationId}`);
      if (savedTheme) handleThemeChange(JSON.parse(savedTheme));
      const savedWallpaper = localStorage.getItem(`wallpaper-${selectedConversationId}`);
      handleWallpaperChange(savedWallpaper || null);
    }
  }, [selectedConversationId]);

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
  const status = other?.status;

  return (
    <>
      {activeCall && (
        <CallInterface
          type={activeCall}
          recipientName={displayName}
          recipientImage={other?.profilePic}
          onEndCall={() => setActiveCall(null)}
        />
      )}
      <div className="border-b px-4 py-2.5 bg-card">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <div
            className="flex items-center gap-2.5 cursor-pointer hover:opacity-80 transition-colors"
            onClick={() => setShowProfile(true)}
          >
            <div className="relative">
              <Avatar className="h-9 w-9">
                <AvatarImage src={other?.profilePic} />
                <AvatarFallback className="bg-primary/10 text-primary text-sm">
                  {displayName[0]?.toUpperCase()}
                </AvatarFallback>
              </Avatar>
              {status === 'online' && (
                <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-[hsl(var(--online-status))] border-2 border-card" />
              )}
            </div>
            <div>
              <p className="font-medium text-sm">{displayName}</p>
              <p className="text-[10px] text-muted-foreground">
                {status === 'online' ? 'Online' : status === 'away' ? 'Away' : 'Offline'}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-1">
            <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => setActiveCall('voice')}>
              <Phone className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => setActiveCall('video')}>
              <Video className="h-4 w-4" />
            </Button>
            <ThemeToggle />
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <MoreVertical className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
      <UserProfileDialog user={other || null} open={showProfile} onOpenChange={setShowProfile} />
    </>
  );
};
