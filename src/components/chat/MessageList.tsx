import { useEffect, useRef } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '@/store';
import { ScrollArea } from '@/components/ui/scroll-area';
import { MessageBubble } from './MessageBubble';

export const MessageList = () => {
  const { selectedConversationId } = useSelector((state: RootState) => state.conversations);
  const messages = useSelector((state: RootState) =>
    selectedConversationId ? state.messages.messagesByConversation[selectedConversationId] || [] : []
  );
  const currentUserId = useSelector((state: RootState) => state.auth.user?._id);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

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
    <ScrollArea className="flex-1 gradient-chat p-4" ref={scrollRef}>
      <div className="space-y-4 max-w-4xl mx-auto">
        {messages.length === 0 ? (
          <div className="text-center text-muted-foreground py-8">
            No messages yet. Start the conversation!
          </div>
        ) : (
          messages.map((message, index) => {
            const isOwn = message.senderId === currentUserId;
            const showDateSeparator =
              index === 0 ||
              new Date(message.createdAt).toDateString() !==
                new Date(messages[index - 1].createdAt).toDateString();

            return (
              <div key={message._id}>
                {showDateSeparator && (
                  <div className="flex items-center justify-center my-4">
                    <span className="text-xs text-muted-foreground bg-card px-3 py-1 rounded-full">
                      {new Date(message.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                )}
                <MessageBubble message={message} isOwn={isOwn} />
              </div>
            );
          })
        )}
      </div>
    </ScrollArea>
  );
};
