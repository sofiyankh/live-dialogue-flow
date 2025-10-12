import { useState, KeyboardEvent } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '@/store';
import { addMessage } from '@/store/messagesSlice';
import { socketService } from '@/services/socket';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Send, Paperclip, Smile } from 'lucide-react';
import { Message } from '@/types';

export const Composer = () => {
  const [message, setMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const dispatch = useDispatch();
  const { selectedConversationId } = useSelector((state: RootState) => state.conversations);
  const currentUserId = useSelector((state: RootState) => state.auth.user?._id);

  const handleSendMessage = () => {
    if (!message.trim() || !selectedConversationId || !currentUserId) return;

    const tempId = `temp-${Date.now()}`;
    const newMessage: Message = {
      _id: tempId,
      conversationId: selectedConversationId,
      senderId: currentUserId,
      text: message.trim(),
      status: 'sent',
      createdAt: new Date().toISOString(),
      deleted: false,
    };

    // Optimistic UI update
    dispatch(addMessage(newMessage));

    // Send to server via socket
    socketService.sendMessage(selectedConversationId, message.trim(), tempId);

    setMessage('');
    setIsTyping(false);
  };

  const handleKeyPress = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleInputChange = (value: string) => {
    setMessage(value);
    
    if (!isTyping && value.length > 0 && selectedConversationId) {
      setIsTyping(true);
      socketService.sendTyping(selectedConversationId, true);
    } else if (isTyping && value.length === 0 && selectedConversationId) {
      setIsTyping(false);
      socketService.sendTyping(selectedConversationId, false);
    }
  };

  if (!selectedConversationId) return null;

  return (
    <div className="border-t p-4 bg-card/80 backdrop-blur-sm rounded-b-2xl">
      <div className="max-w-4xl mx-auto flex items-center gap-2">
        <Button
          variant="ghost"
          size="icon"
          className="text-muted-foreground hover:text-foreground transition-smooth rounded-full"
        >
          <Paperclip className="h-5 w-5" />
        </Button>
        
        <div className="flex-1 relative">
          <Input
            value={message}
            onChange={(e) => handleInputChange(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Type a message..."
            className="pr-10 transition-smooth focus-visible:ring-primary rounded-full"
          />
          <Button
            variant="ghost"
            size="icon"
            className="absolute right-1 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground rounded-full"
          >
            <Smile className="h-5 w-5" />
          </Button>
        </div>

        <Button
          onClick={handleSendMessage}
          disabled={!message.trim()}
          className="gradient-primary text-primary-foreground transition-bounce hover:scale-105 rounded-full"
          size="icon"
        >
          <Send className="h-5 w-5" />
        </Button>
      </div>
    </div>
  );
};
