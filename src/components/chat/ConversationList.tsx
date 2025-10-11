import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '@/store';
import { selectConversation, resetUnreadCount } from '@/store/conversationsSlice';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { formatDistanceToNow } from 'date-fns';

export const ConversationList = () => {
  const dispatch = useDispatch();
  const { conversations, selectedConversationId } = useSelector((state: RootState) => state.conversations);
  const currentUserId = useSelector((state: RootState) => state.auth.user?._id);

  const handleSelectConversation = (conversationId: string) => {
    dispatch(selectConversation(conversationId));
    dispatch(resetUnreadCount(conversationId));
  };

  const getOtherParticipant = (conversation: any) => {
    if (conversation.type === 'direct' && conversation.participants) {
      return conversation.participants.find((p: any) => p._id !== currentUserId);
    }
    return null;
  };

  const getDisplayName = (conversation: any) => {
    if (conversation.title) return conversation.title;
    const other = getOtherParticipant(conversation);
    return other?.username || 'Unknown';
  };

  const getDisplayPic = (conversation: any) => {
    const other = getOtherParticipant(conversation);
    return other?.profilePic;
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'online':
        return 'bg-[hsl(var(--online-status))]';
      case 'away':
        return 'bg-[hsl(var(--away-status))]';
      default:
        return 'bg-[hsl(var(--offline-status))]';
    }
  };

  return (
    <div className="h-full flex flex-col border-r">
      <div className="p-4 border-b">
        <h2 className="text-xl font-semibold">Messages</h2>
      </div>
      
      <ScrollArea className="flex-1">
        {conversations.length === 0 ? (
          <div className="p-8 text-center text-muted-foreground">
            No conversations yet
          </div>
        ) : (
          <div className="divide-y">
            {conversations.map((conversation) => {
              const other = getOtherParticipant(conversation);
              const isSelected = conversation._id === selectedConversationId;
              
              return (
                <button
                  key={conversation._id}
                  onClick={() => handleSelectConversation(conversation._id)}
                  className={`w-full p-4 flex items-start gap-3 hover:bg-muted/50 transition-smooth ${
                    isSelected ? 'bg-muted' : ''
                  }`}
                >
                  <div className="relative">
                    <Avatar className="h-12 w-12">
                      <AvatarImage src={getDisplayPic(conversation)} />
                      <AvatarFallback className="gradient-primary text-primary-foreground">
                        {getDisplayName(conversation)[0]?.toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    {conversation.type === 'direct' && other && (
                      <span
                        className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-card ${getStatusColor(
                          other.status
                        )}`}
                      />
                    )}
                  </div>

                  <div className="flex-1 min-w-0 text-left">
                    <div className="flex items-center justify-between mb-1">
                      <p className="font-medium truncate">{getDisplayName(conversation)}</p>
                      {conversation.lastMessage && (
                        <span className="text-xs text-muted-foreground ml-2 flex-shrink-0">
                          {formatDistanceToNow(new Date(conversation.lastMessage.createdAt), {
                            addSuffix: false,
                          })}
                        </span>
                      )}
                    </div>
                    <div className="flex items-center justify-between">
                      <p className="text-sm text-muted-foreground truncate">
                        {conversation.lastMessage?.text || 'No messages yet'}
                      </p>
                      {conversation.unreadCount > 0 && (
                        <Badge className="ml-2 flex-shrink-0 gradient-primary text-primary-foreground">
                          {conversation.unreadCount}
                        </Badge>
                      )}
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        )}
      </ScrollArea>
    </div>
  );
};
