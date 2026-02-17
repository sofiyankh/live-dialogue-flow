import { useEffect, useState, useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '@/store';
import { setConversations, selectConversation, incrementUnreadCount } from '@/store/conversationsSlice';
import { setMessages, addMessage } from '@/store/messagesSlice';
import { loginSuccess, logout } from '@/store/authSlice';
import { chatEventBus, DEMO_USER_1, DEMO_USER_2, DEMO_CONVERSATION, INITIAL_MESSAGES } from '@/services/chatEventBus';
import { LoginForm } from '@/components/auth/LoginForm';
import { ConversationList } from '@/components/chat/ConversationList';
import { MessageList } from '@/components/chat/MessageList';
import { Composer } from '@/components/chat/Composer';
import { ChatHeader } from '@/components/chat/ChatHeader';
import { BottomNavbar } from '@/components/chat/BottomNavbar';
import { useIsMobile } from '@/hooks/use-mobile';
import { Message } from '@/types';
import { Button } from '@/components/ui/button';
import { LogOut, ArrowLeft } from 'lucide-react';

const Index = () => {
  const isMobile = useIsMobile();
  const [mobileView, setMobileView] = useState<'conversations' | 'chat'>('conversations');
  const { isAuthenticated, user } = useSelector((state: RootState) => state.auth);
  const { selectedConversationId } = useSelector((state: RootState) => state.conversations);
  const dispatch = useDispatch();

  // Load data on login
  useEffect(() => {
    if (isAuthenticated && user) {
      const conv = {
        ...DEMO_CONVERSATION,
        participants: [DEMO_USER_1, DEMO_USER_2],
      };
      dispatch(setConversations([conv]));
      dispatch(setMessages({ conversationId: 'conv-demo', messages: [...INITIAL_MESSAGES] }));
      dispatch(selectConversation('conv-demo'));
    }
  }, [isAuthenticated, user?._id]);

  // Listen for messages from the event bus (from other "user")
  const handleIncomingMessage = useCallback((message: Message) => {
    if (!user || message.senderId === user._id) return;
    dispatch(addMessage(message));
    if (selectedConversationId !== message.conversationId) {
      dispatch(incrementUnreadCount(message.conversationId));
    }
  }, [user?._id, selectedConversationId, dispatch]);

  useEffect(() => {
    const unsub = chatEventBus.on('new-message', handleIncomingMessage);
    return unsub;
  }, [handleIncomingMessage]);

  // Auto-switch to chat view on mobile when conversation is selected
  useEffect(() => {
    if (isMobile && selectedConversationId) {
      setMobileView('chat');
    }
  }, [selectedConversationId, isMobile]);

  const handleLogout = () => {
    dispatch(logout());
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-muted/40 flex items-center justify-center p-4">
        <LoginForm onToggleMode={() => {}} />
      </div>
    );
  }

  // Mobile layout
  if (isMobile) {
    return (
      <div className="h-screen flex flex-col bg-background">
        {mobileView === 'conversations' ? (
          <>
            <div className="p-3 border-b bg-card flex items-center justify-between">
              <h1 className="font-semibold text-lg">Chats</h1>
              <div className="flex items-center gap-2">
                <span className="text-xs text-muted-foreground">{user?.username}</span>
                <Button variant="ghost" size="icon" className="h-8 w-8" onClick={handleLogout}>
                  <LogOut className="h-4 w-4" />
                </Button>
              </div>
            </div>
            <div className="flex-1 overflow-hidden">
              <ConversationList />
            </div>
          </>
        ) : (
          <>
            <div className="flex items-center gap-1 px-2 pt-2">
              <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => setMobileView('conversations')}>
                <ArrowLeft className="h-4 w-4" />
              </Button>
            </div>
            <ChatHeader />
            <MessageList />
            <Composer />
          </>
        )}
        <BottomNavbar
          activeView={mobileView}
          onViewChange={setMobileView}
          hasSelectedConversation={!!selectedConversationId}
        />
      </div>
    );
  }

  // Desktop layout
  return (
    <div className="h-screen flex bg-background">
      <div className="w-80 lg:w-96 flex-shrink-0 border-r flex flex-col">
        <div className="p-3 border-b bg-card flex items-center justify-between">
          <h1 className="font-semibold">Chats</h1>
          <div className="flex items-center gap-2">
            <span className="text-xs text-muted-foreground">{user?.username}</span>
            <Button variant="ghost" size="icon" className="h-8 w-8" onClick={handleLogout}>
              <LogOut className="h-4 w-4" />
            </Button>
          </div>
        </div>
        <ConversationList />
      </div>
      <div className="flex-1 flex flex-col min-w-0">
        <ChatHeader />
        <MessageList />
        <Composer />
      </div>
    </div>
  );
};

export default Index;
