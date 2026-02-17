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

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'online': return 'bg-[hsl(var(--online-status))]';
      case 'away': return 'bg-[hsl(var(--away-status))]';
      default: return 'bg-[hsl(var(--offline-status))]';
    }
  };

  return (
    <ScrollArea className="flex-1">
      {conversations.length === 0 ? (
        <div className="p-8 text-center text-muted-foreground text-sm">No conversations yet</div>
      ) : (
        <div className="p-2 space-y-1">
          {conversations.map((conversation) => {
            const other = getOtherParticipant(conversation);
            const isSelected = conversation._id === selectedConversationId;

            return (
              <button
                key={conversation._id}
                onClick={() => handleSelectConversation(conversation._id)}
                className={`w-full p-3 flex items-center gap-3 rounded-lg transition-colors text-left ${
                  isSelected ? 'bg-muted' : 'hover:bg-muted/50'
                }`}
              >
                <div className="relative">
                  <Avatar className="h-10 w-10">
                    <AvatarImage src={other?.profilePic} />
                    <AvatarFallback className="bg-primary/10 text-primary text-sm font-medium">
                      {getDisplayName(conversation).slice(0, 2).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  {other && (
                    <span className={`absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full border-2 border-card ${getStatusColor(other.status)}`} />
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-0.5">
                    <p className="font-medium text-sm truncate">{getDisplayName(conversation)}</p>
                    {conversation.lastMessage && (
                      <span className="text-[10px] text-muted-foreground ml-2 shrink-0">
                        {formatDistanceToNow(new Date(conversation.lastMessage.createdAt), { addSuffix: false })}
                      </span>
                    )}
                  </div>
                  <div className="flex items-center justify-between">
                    <p className="text-xs text-muted-foreground truncate">
                      {conversation.lastMessage?.text || 'No messages yet'}
                    </p>
                    {conversation.unreadCount > 0 && (
                      <Badge className="ml-2 shrink-0 h-5 min-w-5 flex items-center justify-center text-[10px] rounded-full">
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
  );
};
