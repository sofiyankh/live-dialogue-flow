// Local event bus that simulates real-time WebSocket messaging between demo accounts
import { Message } from '@/types';

type EventHandler = (...args: any[]) => void;

class ChatEventBus {
  private listeners: Map<string, Set<EventHandler>> = new Map();

  on(event: string, handler: EventHandler) {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, new Set());
    }
    this.listeners.get(event)!.add(handler);
    return () => this.off(event, handler);
  }

  off(event: string, handler: EventHandler) {
    this.listeners.get(event)?.delete(handler);
  }

  emit(event: string, ...args: any[]) {
    this.listeners.get(event)?.forEach(handler => handler(...args));
  }
}

export const chatEventBus = new ChatEventBus();

// Demo users
export const DEMO_USER_1 = {
  _id: 'user-1',
  username: 'Alex Morgan',
  email: 'alex@demo.com',
  status: 'online' as const,
  lastSeen: new Date().toISOString(),
  profilePic: undefined,
};

export const DEMO_USER_2 = {
  _id: 'user-2',
  username: 'Jordan Lee',
  email: 'jordan@demo.com',
  status: 'online' as const,
  lastSeen: new Date().toISOString(),
  profilePic: undefined,
};

export const DEMO_CONVERSATION = {
  _id: 'conv-demo',
  participantIds: [DEMO_USER_1._id, DEMO_USER_2._id],
  participants: [DEMO_USER_1, DEMO_USER_2],
  type: 'direct' as const,
  lastMessageAt: new Date().toISOString(),
  unreadCount: 0,
  lastMessage: undefined as Message | undefined,
};

// Pre-populated messages
export const INITIAL_MESSAGES: Message[] = [
  {
    _id: 'msg-init-1',
    conversationId: 'conv-demo',
    senderId: 'user-1',
    text: 'Hey Jordan! 👋 Welcome to the real-time demo!',
    status: 'read',
    createdAt: new Date(Date.now() - 120000).toISOString(),
    deleted: false,
  },
  {
    _id: 'msg-init-2',
    conversationId: 'conv-demo',
    senderId: 'user-2',
    text: 'Hey Alex! This is awesome, messages sync instantly! 🚀',
    status: 'read',
    createdAt: new Date(Date.now() - 60000).toISOString(),
    deleted: false,
  },
];
