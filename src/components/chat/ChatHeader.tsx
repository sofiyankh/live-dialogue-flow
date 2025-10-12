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
    
    // Save theme to localStorage
    localStorage.setItem(`theme-${selectedConversationId}`, JSON.stringify(theme));
    
    // Apply theme styles
    const style = document.getElementById('chat-theme-style') || document.createElement('style');
    style.id = 'chat-theme-style';
    style.innerHTML = `
      :root {
        --chat-sent: ${theme.sentBg};
        --chat-sent-foreground: ${theme.sentText};
        --chat-received: ${theme.receivedBg};
        --chat-received-foreground: ${theme.receivedText};
      }
      .gradient-chat {
        background: ${theme.gradient} !important;
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
          chatContainer.style.backgroundAttachment = 'fixed';
        } else {
          chatContainer.style.background = wallpaperUrl;
        }
      } else {
        chatContainer.style.backgroundImage = '';
        chatContainer.style.background = '';
      }
    }
  };

  // Load saved theme and wallpaper on mount
  useEffect(() => {
    if (selectedConversationId) {
      const savedTheme = localStorage.getItem(`theme-${selectedConversationId}`);
      if (savedTheme) {
        handleThemeChange(JSON.parse(savedTheme));
      }
      
      const savedWallpaper = localStorage.getItem(`wallpaper-${selectedConversationId}`);
      if (savedWallpaper) {
        handleWallpaperChange(savedWallpaper);
      } else {
        handleWallpaperChange(null);
      }
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
    <>
      {activeCall && (
        <CallInterface
          type={activeCall}
          recipientName={displayName}
          recipientImage={displayPic}
          onEndCall={() => setActiveCall(null)}
        />
      )}

      <div className="border-b p-4 bg-card">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <div 
            className="flex items-center gap-3 cursor-pointer hover:opacity-80 transition-smooth"
            onClick={() => setShowProfile(true)}
          >
            <div className="relative">
              <Avatar className="h-10 w-10">
                <AvatarImage src={displayPic} />
                <AvatarFallback className="gradient-primary text-primary-foreground">
                  {displayName[0]?.toUpperCase()}
                </AvatarFallback>
              </Avatar>
              {status === 'online' && (
                <span className="absolute bottom-0 right-0 w-3 h-3 rounded-full bg-[hsl(var(--online-status))] border-2 border-card" />
              )}
            </div>
            <div>
              <p className="font-semibold">{displayName}</p>
              <p className="text-xs text-muted-foreground">{getStatusText()}</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Button 
              variant="ghost" 
              size="icon" 
              className="hover:bg-muted transition-smooth rounded-full"
              onClick={() => setActiveCall('voice')}
            >
              <Phone className="h-5 w-5" />
            </Button>
            <Button 
              variant="ghost" 
              size="icon" 
              className="hover:bg-muted transition-smooth rounded-full"
              onClick={() => setActiveCall('video')}
            >
              <Video className="h-5 w-5" />
            </Button>
            <WallpaperSelector
              conversationId={selectedConversation._id}
              onWallpaperChange={handleWallpaperChange}
            />
            <ThemeSelector 
              conversationId={selectedConversation._id} 
              onThemeChange={handleThemeChange} 
            />
            <ThemeToggle />
            <Button variant="ghost" size="icon" className="hover:bg-muted transition-smooth rounded-full">
              <MoreVertical className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </div>

      <UserProfileDialog 
        user={other || null}
        open={showProfile}
        onOpenChange={setShowProfile}
      />
    </>
  );
};
