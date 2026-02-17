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

  const handleReply = (message: Message) => console.log('Reply to:', message);
  const handleEdit = (message: Message) => {
    const newText = prompt('Edit message:', message.text);
    if (newText && newText !== message.text) {
      dispatch(updateMessage({ ...message, text: newText, editedAt: new Date().toISOString() }));
    }
  };
  const handleDelete = (messageId: string) => {
    if (confirm('Delete this message?') && selectedConversationId) {
      dispatch(deleteMessage({ conversationId: selectedConversationId, messageId }));
    }
  };

  if (!selectedConversationId) {
    return (
      <div className="flex-1 flex items-center justify-center bg-muted/20">
        <p className="text-sm text-muted-foreground">Select a conversation to start messaging</p>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col bg-background chat-messages-container relative overflow-hidden">
      {showSearch && (
        <MessageSearch
          onSearch={setSearchQuery}
          onClose={() => { setShowSearch(false); setSearchQuery(''); }}
        />
      )}

      <ScrollArea className="flex-1 p-4" ref={scrollRef}>
        <div className="space-y-1 max-w-4xl mx-auto">
          {filteredMessages.length === 0 ? (
            <div className="text-center text-muted-foreground py-8 text-sm">
              {searchQuery ? 'No messages found' : 'No messages yet. Start the conversation!'}
            </div>
          ) : (
            filteredMessages.map((message, index) => {
              const isOwn = message.senderId === currentUserId;
              const showDateSeparator =
                index === 0 ||
                new Date(message.createdAt).toDateString() !==
                  new Date(filteredMessages[index - 1].createdAt).toDateString();
              const sender = participants.find(p => p._id === message.senderId);

              return (
                <div key={message._id}>
                  {showDateSeparator && (
                    <div className="flex items-center justify-center my-3">
                      <span className="text-[10px] text-muted-foreground bg-muted px-2.5 py-0.5 rounded-full">
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

      <div className="absolute top-2 right-2">
        <Button variant="ghost" size="icon" className="h-7 w-7 rounded-full bg-background/80" onClick={() => setShowSearch(!showSearch)}>
          <Search className="h-3.5 w-3.5" />
        </Button>
      </div>
    </div>
  );
};
