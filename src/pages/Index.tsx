import { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '@/store';
import { setConversations } from '@/store/conversationsSlice';
import { setMessages } from '@/store/messagesSlice';
import { socketService } from '@/services/socket';
import { LoginForm } from '@/components/auth/LoginForm';
import { ConversationList } from '@/components/chat/ConversationList';
import { MessageList } from '@/components/chat/MessageList';
import { Composer } from '@/components/chat/Composer';
import { ChatHeader } from '@/components/chat/ChatHeader';
import { BottomNavbar } from '@/components/chat/BottomNavbar';
import { Conversation, Message, User } from '@/types';
import { useIsMobile } from '@/hooks/use-mobile';

const Index = () => {
  const [authMode, setAuthMode] = useState<'login' | 'signup'>('login');
  const [mobileView, setMobileView] = useState<'conversations' | 'chat'>('conversations');
  const { isAuthenticated, token, user } = useSelector((state: RootState) => state.auth);
  const { selectedConversationId } = useSelector((state: RootState) => state.conversations);
  const dispatch = useDispatch();
  const isMobile = useIsMobile();

  useEffect(() => {
    if (isAuthenticated && token) {
      // Connect to socket
      socketService.connect(token);

      // Load mock data
      loadMockData();

      return () => {
        socketService.disconnect();
      };
    }
  }, [isAuthenticated, token]);

  const loadMockData = () => {
    // Mock conversations
    const mockUsers: User[] = [
      {
        _id: '2',
        username: 'Alice Johnson',
        email: 'alice@example.com',
        status: 'online',
        lastSeen: new Date().toISOString(),
      },
      {
        _id: '3',
        username: 'Bob Smith',
        email: 'bob@example.com',
        status: 'away',
        lastSeen: new Date(Date.now() - 3600000).toISOString(),
      },
      {
        _id: '4',
        username: 'Charlie Brown',
        email: 'charlie@example.com',
        status: 'offline',
        lastSeen: new Date(Date.now() - 86400000).toISOString(),
      },
    ];

    const mockConversations: Conversation[] = [
      {
        _id: 'conv1',
        participantIds: ['1', '2'],
        participants: [user!, mockUsers[0]],
        type: 'direct',
        lastMessageAt: new Date().toISOString(),
        unreadCount: 2,
        lastMessage: {
          _id: 'msg3',
          conversationId: 'conv1',
          senderId: '2',
          text: 'Hey! How are you doing?',
          status: 'delivered',
          createdAt: new Date(Date.now() - 300000).toISOString(),
          deleted: false,
        },
      },
      {
        _id: 'conv2',
        participantIds: ['1', '3'],
        participants: [user!, mockUsers[1]],
        type: 'direct',
        lastMessageAt: new Date(Date.now() - 3600000).toISOString(),
        unreadCount: 0,
        lastMessage: {
          _id: 'msg2',
          conversationId: 'conv2',
          senderId: '1',
          text: 'See you tomorrow!',
          status: 'read',
          createdAt: new Date(Date.now() - 3600000).toISOString(),
          deleted: false,
        },
      },
      {
        _id: 'conv3',
        participantIds: ['1', '4'],
        participants: [user!, mockUsers[2]],
        type: 'direct',
        lastMessageAt: new Date(Date.now() - 86400000).toISOString(),
        unreadCount: 0,
        lastMessage: {
          _id: 'msg1',
          conversationId: 'conv3',
          senderId: '4',
          text: 'Thanks for your help!',
          status: 'read',
          createdAt: new Date(Date.now() - 86400000).toISOString(),
          deleted: false,
        },
      },
    ];

    const mockMessages: Record<string, Message[]> = {
      conv1: [
        {
          _id: 'msg1-1',
          conversationId: 'conv1',
          senderId: '1',
          text: 'Hi Alice! 👋',
          status: 'read',
          createdAt: new Date(Date.now() - 600000).toISOString(),
          deleted: false,
        },
        {
          _id: 'msg1-2',
          conversationId: 'conv1',
          senderId: '2',
          text: 'Hey! How are you doing?',
          status: 'delivered',
          createdAt: new Date(Date.now() - 300000).toISOString(),
          deleted: false,
        },
        {
          _id: 'msg1-3',
          conversationId: 'conv1',
          senderId: '2',
          text: 'Want to grab coffee later?',
          status: 'delivered',
          createdAt: new Date(Date.now() - 299000).toISOString(),
          deleted: false,
        },
      ],
      conv2: [
        {
          _id: 'msg2-1',
          conversationId: 'conv2',
          senderId: '3',
          text: 'Did you finish the project?',
          status: 'read',
          createdAt: new Date(Date.now() - 7200000).toISOString(),
          deleted: false,
        },
        {
          _id: 'msg2-2',
          conversationId: 'conv2',
          senderId: '1',
          text: 'Yes, just submitted it!',
          status: 'read',
          createdAt: new Date(Date.now() - 3700000).toISOString(),
          deleted: false,
        },
        {
          _id: 'msg2-3',
          conversationId: 'conv2',
          senderId: '1',
          text: 'See you tomorrow!',
          status: 'read',
          createdAt: new Date(Date.now() - 3600000).toISOString(),
          deleted: false,
        },
      ],
      conv3: [
        {
          _id: 'msg3-1',
          conversationId: 'conv3',
          senderId: '4',
          text: 'Thanks for your help!',
          status: 'read',
          createdAt: new Date(Date.now() - 86400000).toISOString(),
          deleted: false,
        },
      ],
    };

    dispatch(setConversations(mockConversations));
    Object.entries(mockMessages).forEach(([conversationId, messages]) => {
      dispatch(setMessages({ conversationId, messages }));
    });
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen gradient-chat flex items-center justify-center p-4">
        <LoginForm onToggleMode={() => setAuthMode(authMode === 'login' ? 'signup' : 'login')} />
      </div>
    );
  }

  // Auto-switch to chat view on mobile when conversation is selected
  useEffect(() => {
    if (isMobile && selectedConversationId && mobileView === 'conversations') {
      setMobileView('chat');
    }
  }, [selectedConversationId, isMobile, mobileView]);

  return (
    <div className="h-screen flex flex-col md:flex-row overflow-hidden">
      {/* Desktop: Always show sidebar */}
      {/* Mobile: Show based on mobileView */}
      <div 
        className={`w-full md:w-80 lg:w-96 flex-shrink-0 ${
          isMobile ? (mobileView === 'conversations' ? 'block' : 'hidden') : 'block'
        }`}
      >
        <ConversationList />
      </div>

      {/* Chat area */}
      <div 
        className={`flex-1 flex flex-col min-w-0 ${
          isMobile ? (mobileView === 'chat' ? 'block pb-16' : 'hidden') : 'block'
        }`}
      >
        {selectedConversationId && (
          <>
            <ChatHeader />
            <MessageList />
            <Composer />
          </>
        )}
        {!selectedConversationId && !isMobile && (
          <div className="flex-1 flex items-center justify-center text-muted-foreground">
            Select a conversation to start messaging
          </div>
        )}
      </div>

      {/* Bottom navbar - only on mobile */}
      {isMobile && (
        <BottomNavbar
          activeView={mobileView}
          onViewChange={setMobileView}
          hasActiveChat={!!selectedConversationId}
        />
      )}
    </div>
  );
};

export default Index;
