import { useState, KeyboardEvent } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '@/store';
import { addMessage } from '@/store/messagesSlice';
import { chatEventBus } from '@/services/chatEventBus';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Send, Paperclip, Smile } from 'lucide-react';
import { Message } from '@/types';

export const Composer = () => {
  const [message, setMessage] = useState('');
  const dispatch = useDispatch();
  const { selectedConversationId } = useSelector((state: RootState) => state.conversations);
  const currentUserId = useSelector((state: RootState) => state.auth.user?._id);

  const handleSendMessage = () => {
    if (!message.trim() || !selectedConversationId || !currentUserId) return;

    const newMessage: Message = {
      _id: `msg-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
      conversationId: selectedConversationId,
      senderId: currentUserId,
      text: message.trim(),
      status: 'sent',
      createdAt: new Date().toISOString(),
      deleted: false,
    };

    // Add to own store
    dispatch(addMessage(newMessage));

    // Broadcast to other sessions via event bus
    chatEventBus.emit('new-message', newMessage);

    setMessage('');
  };

  const handleKeyPress = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  if (!selectedConversationId) return null;

  return (
    <div className="border-t p-3 bg-card">
      <div className="max-w-4xl mx-auto flex items-center gap-2">
        <Button variant="ghost" size="icon" className="text-muted-foreground h-9 w-9 rounded-full shrink-0">
          <Paperclip className="h-4 w-4" />
        </Button>
        
        <div className="flex-1 relative">
          <Input
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={handleKeyPress}
            placeholder="Type a message..."
            className="pr-10 rounded-full h-9"
          />
          <Button
            variant="ghost"
            size="icon"
            className="absolute right-0.5 top-1/2 -translate-y-1/2 text-muted-foreground h-8 w-8 rounded-full"
          >
            <Smile className="h-4 w-4" />
          </Button>
        </div>

        <Button
          onClick={handleSendMessage}
          disabled={!message.trim()}
          size="icon"
          className="rounded-full h-9 w-9 shrink-0"
        >
          <Send className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};
