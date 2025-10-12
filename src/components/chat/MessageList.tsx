import { useEffect, useRef, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '@/store';
import { ScrollArea } from '@/components/ui/scroll-area';
import { MessageBubble } from './MessageBubble';
import { MessageSearch } from './MessageSearch';
import { Message } from '@/types';
import { deleteMessage, updateMessage } from '@/store/messagesSlice';
import { Button } from '@/components/ui/button';
import { Search } from 'lucide-react';

export const MessageList = () => {
  const dispatch = useDispatch();
  const [searchQuery, setSearchQuery] = useState('');
  const [showSearch, setShowSearch] = useState(false);
  const { selectedConversationId, conversations } = useSelector((state: RootState) => state.conversations);
  const messages = useSelector((state: RootState) =>
    selectedConversationId ? state.messages.messagesByConversation[selectedConversationId] || [] : []
  );
  const currentUserId = useSelector((state: RootState) => state.auth.user?._id);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Get current conversation and participants at the top level
  const selectedConversation = conversations.find(c => c._id === selectedConversationId);
  const participants = selectedConversation?.participants || [];

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const filteredMessages = searchQuery
    ? messages.filter(m => m.text.toLowerCase().includes(searchQuery.toLowerCase()))
    : messages;

  const handleReply = (message: Message) => {
    // Will be handled by Composer in next update
    console.log('Reply to:', message);
  };

  const handleEdit = (message: Message) => {
    const newText = prompt('Edit message:', message.text);
    if (newText && newText !== message.text) {
      dispatch(updateMessage({
        ...message,
        text: newText,
        editedAt: new Date().toISOString(),
      }));
    }
  };

  const handleDelete = (messageId: string) => {
    if (confirm('Delete this message?') && selectedConversationId) {
      dispatch(deleteMessage({ conversationId: selectedConversationId, messageId }));
    }
  };

  if (!selectedConversationId) {
    return (
      <div className="flex-1 flex items-center justify-center gradient-chat">
        <div className="text-center text-muted-foreground">
          <p className="text-lg mb-2">Select a conversation to start messaging</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col gradient-chat">
      <div className="flex items-center justify-end p-2 border-b">
        <Button variant="ghost" size="icon" onClick={() => setShowSearch(!showSearch)}>
          <Search className="h-5 w-5" />
        </Button>
      </div>
      
      {showSearch && (
        <MessageSearch 
          onSearch={setSearchQuery} 
          onClose={() => {
            setShowSearch(false);
            setSearchQuery('');
          }} 
        />
      )}
      
      <ScrollArea className="flex-1 p-4" ref={scrollRef}>
        <div className="space-y-4 max-w-4xl mx-auto">
          {filteredMessages.length === 0 ? (
            <div className="text-center text-muted-foreground py-8">
              {searchQuery ? 'No messages found' : 'No messages yet. Start the conversation!'}
            </div>
          ) : (
            filteredMessages.map((message, index) => {
              const isOwn = message.senderId === currentUserId;
              const showDateSeparator =
                index === 0 ||
                new Date(message.createdAt).toDateString() !==
                  new Date(filteredMessages[index - 1].createdAt).toDateString();

              // Get sender info from participants (already fetched at top level)
              const sender = participants.find(p => p._id === message.senderId);

              return (
                <div key={message._id}>
                  {showDateSeparator && (
                    <div className="flex items-center justify-center my-4">
                      <span className="text-xs text-muted-foreground bg-card px-3 py-1 rounded-full shadow-sm">
                        {new Date(message.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                  )}
                  <MessageBubble 
                    message={message} 
                    isOwn={isOwn} 
                    sender={sender} 
                    onReply={handleReply}
                    onEdit={handleEdit}
                    onDelete={handleDelete}
                  />
                </div>
              );
            })
          )}
        </div>
      </ScrollArea>
    </div>
  );
};
