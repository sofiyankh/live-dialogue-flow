import { io, Socket } from 'socket.io-client';
import { store } from '@/store';
import { addMessage, updateMessage } from '@/store/messagesSlice';
import { updateConversation, incrementUnreadCount } from '@/store/conversationsSlice';
import { addNotification } from '@/store/notificationsSlice';
import { Message } from '@/types';

class SocketService {
  private socket: Socket | null = null;
  private typingTimeouts: Map<string, NodeJS.Timeout> = new Map();

  connect(token: string) {
    // Replace with your backend URL - for demo, we'll use a placeholder
    const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || 'http://localhost:3000';
    
    this.socket = io(SOCKET_URL, {
      auth: { token },
      transports: ['websocket'],
    });

    this.socket.on('connect', () => {
      console.log('Socket connected');
    });

    this.socket.on('disconnect', () => {
      console.log('Socket disconnected');
    });

    this.socket.on('message', (message: Message) => {
      store.dispatch(addMessage(message));
      
      const state = store.getState();
      if (state.conversations.selectedConversationId !== message.conversationId) {
        store.dispatch(incrementUnreadCount(message.conversationId));
      }
    });

    this.socket.on('message:updated', (message: Message) => {
      store.dispatch(updateMessage(message));
    });

    this.socket.on('typing', ({ conversationId, userId }: { conversationId: string; userId: string }) => {
      // Handle typing indicator
      console.log(`User ${userId} is typing in ${conversationId}`);
    });

    this.socket.on('notification', (notification: any) => {
      store.dispatch(addNotification(notification));
    });

    return this.socket;
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }
  }

  sendMessage(conversationId: string, text: string, tempId: string) {
    if (this.socket) {
      this.socket.emit('message:send', { conversationId, text, tempId });
    }
  }

  sendTyping(conversationId: string, isTyping: boolean) {
    if (this.socket) {
      this.socket.emit('typing', { conversationId, isTyping });
    }
  }

  joinConversation(conversationId: string) {
    if (this.socket) {
      this.socket.emit('conversation:join', conversationId);
    }
  }

  leaveConversation(conversationId: string) {
    if (this.socket) {
      this.socket.emit('conversation:leave', conversationId);
    }
  }

  markAsRead(messageId: string) {
    if (this.socket) {
      this.socket.emit('message:read', messageId);
    }
  }
}

export const socketService = new SocketService();
