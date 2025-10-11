export interface User {
  _id: string;
  username: string;
  email: string;
  profilePic?: string;
  status: 'online' | 'away' | 'offline';
  lastSeen: string; // ISO string for Redux serialization
}

export interface Message {
  _id: string;
  conversationId: string;
  senderId: string;
  text: string;
  attachments?: Attachment[];
  status: 'sent' | 'delivered' | 'read';
  createdAt: string; // ISO string for Redux serialization
  editedAt?: string;
  deleted: boolean;
}

export interface Attachment {
  url: string;
  type: string;
  meta?: Record<string, any>;
}

export interface Conversation {
  _id: string;
  title?: string;
  participantIds: string[];
  participants?: User[];
  type: 'direct' | 'group';
  lastMessage?: Message;
  lastMessageAt: string; // ISO string for Redux serialization
  unreadCount: number;
}

export interface Notification {
  _id: string;
  userId: string;
  type: 'message' | 'mention' | 'system';
  fromUserId: string;
  conversationId: string;
  messageId?: string;
  payload: any;
  read: boolean;
  createdAt: string; // ISO string for Redux serialization
}

export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  loading: boolean;
  error: string | null;
}

export interface ConversationsState {
  conversations: Conversation[];
  selectedConversationId: string | null;
  loading: boolean;
  error: string | null;
}

export interface MessagesState {
  messagesByConversation: Record<string, Message[]>;
  loading: boolean;
  error: string | null;
}

export interface TypingState {
  [conversationId: string]: string[]; // userIds currently typing
}
