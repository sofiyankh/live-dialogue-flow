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
import { Conversation, Message, User } from '@/types';

const Index = () => {
  const [authMode, setAuthMode] = useState<'login' | 'signup'>('login');
  const { isAuthenticated, token, user } = useSelector((state: RootState) => state.auth);
  const dispatch = useDispatch();

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
        lastSeen: new Date(),
      },
      {
        _id: '3',
        username: 'Bob Smith',
        email: 'bob@example.com',
        status: 'away',
        lastSeen: new Date(Date.now() - 3600000),
      },
      {
        _id: '4',
        username: 'Charlie Brown',
        email: 'charlie@example.com',
        status: 'offline',
        lastSeen: new Date(Date.now() - 86400000),
      },
    ];

    const mockConversations: Conversation[] = [
      {
        _id: 'conv1',
        participantIds: ['1', '2'],
        participants: [user!, mockUsers[0]],
        type: 'direct',
        lastMessageAt: new Date(),
        unreadCount: 2,
        lastMessage: {
          _id: 'msg3',
          conversationId: 'conv1',
          senderId: '2',
          text: 'Hey! How are you doing?',
          status: 'delivered',
          createdAt: new Date(Date.now() - 300000),
          deleted: false,
        },
      },
      {
        _id: 'conv2',
        participantIds: ['1', '3'],
        participants: [user!, mockUsers[1]],
        type: 'direct',
        lastMessageAt: new Date(Date.now() - 3600000),
        unreadCount: 0,
        lastMessage: {
          _id: 'msg2',
          conversationId: 'conv2',
          senderId: '1',
          text: 'See you tomorrow!',
          status: 'read',
          createdAt: new Date(Date.now() - 3600000),
          deleted: false,
        },
      },
      {
        _id: 'conv3',
        participantIds: ['1', '4'],
        participants: [user!, mockUsers[2]],
        type: 'direct',
        lastMessageAt: new Date(Date.now() - 86400000),
        unreadCount: 0,
        lastMessage: {
          _id: 'msg1',
          conversationId: 'conv3',
          senderId: '4',
          text: 'Thanks for your help!',
          status: 'read',
          createdAt: new Date(Date.now() - 86400000),
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
          createdAt: new Date(Date.now() - 600000),
          deleted: false,
        },
        {
          _id: 'msg1-2',
          conversationId: 'conv1',
          senderId: '2',
          text: 'Hey! How are you doing?',
          status: 'delivered',
          createdAt: new Date(Date.now() - 300000),
          deleted: false,
        },
        {
          _id: 'msg1-3',
          conversationId: 'conv1',
          senderId: '2',
          text: 'Want to grab coffee later?',
          status: 'delivered',
          createdAt: new Date(Date.now() - 299000),
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
          createdAt: new Date(Date.now() - 7200000),
          deleted: false,
        },
        {
          _id: 'msg2-2',
          conversationId: 'conv2',
          senderId: '1',
          text: 'Yes, just submitted it!',
          status: 'read',
          createdAt: new Date(Date.now() - 3700000),
          deleted: false,
        },
        {
          _id: 'msg2-3',
          conversationId: 'conv2',
          senderId: '1',
          text: 'See you tomorrow!',
          status: 'read',
          createdAt: new Date(Date.now() - 3600000),
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
          createdAt: new Date(Date.now() - 86400000),
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

  return (
    <div className="h-screen flex flex-col md:flex-row overflow-hidden">
      {/* Conversations sidebar - permanent on mobile */}
      <div className="w-full md:w-80 lg:w-96 flex-shrink-0">
        <ConversationList />
      </div>

      {/* Chat area */}
      <div className="flex-1 flex flex-col min-w-0">
        <ChatHeader />
        <MessageList />
        <Composer />
      </div>
    </div>
  );
};

export default Index;
