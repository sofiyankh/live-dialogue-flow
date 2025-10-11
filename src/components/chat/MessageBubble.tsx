import { Message, User } from '@/types';
import { ExtendedMessage } from '@/types/messageExtensions';
import { format } from 'date-fns';
import { Check, CheckCheck } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { MessageActions } from './MessageActions';
import { VideoPlayer } from './VideoPlayer';

interface MessageBubbleProps {
  message: ExtendedMessage;
  isOwn: boolean;
  sender?: User;
  onReply: (message: Message) => void;
  onEdit: (message: Message) => void;
  onDelete: (messageId: string) => void;
}

export const MessageBubble = ({ message, isOwn, sender, onReply, onEdit, onDelete }: MessageBubbleProps) => {
  if (message.deleted) {
    return (
      <div className={`flex ${isOwn ? 'justify-end' : 'justify-start'} mb-2`}>
        <div className="bg-muted/50 text-muted-foreground italic px-4 py-2 rounded-lg max-w-[70%]">
          This message was deleted
        </div>
      </div>
    );
  }

  return (
    <div className={`flex ${isOwn ? 'justify-end' : 'justify-start'} mb-2 group`}>
      <div className={`flex gap-2 items-end animate-in ${isOwn ? 'slide-in-from-right-4' : 'slide-in-from-left-4'} duration-300`}>
        {!isOwn && sender && (
          <Avatar className="h-8 w-8 shrink-0">
            <AvatarImage src={sender.profilePic} alt={sender.username} />
            <AvatarFallback className="text-xs">
              {sender.username.slice(0, 2).toUpperCase()}
            </AvatarFallback>
          </Avatar>
        )}
        
        <div className="flex flex-col gap-1 max-w-[70%]">
          {message.replyTo && (
            <div className={`text-xs px-3 py-1 rounded-lg border-l-2 ${
              isOwn 
                ? 'bg-[hsl(var(--chat-sent))]/20 border-white/30' 
                : 'bg-muted/50 border-primary/50'
            }`}>
              <p className="font-semibold">{message.replyTo.senderName}</p>
              <p className="truncate opacity-70">{message.replyTo.text}</p>
            </div>
          )}
          
          <div className="flex items-center gap-1">
            {isOwn && <MessageActions message={message} isOwn={isOwn} onReply={onReply} onEdit={onEdit} onDelete={onDelete} />}
            
            <div className="flex flex-col gap-2">
              {message.attachments?.map((attachment, idx) => (
                <div key={idx}>
                  {attachment.type.startsWith('video/') && (
                    <VideoPlayer url={attachment.url} />
                  )}
                  {attachment.type.startsWith('image/') && (
                    <img 
                      src={attachment.url} 
                      alt="Attachment" 
                      className="max-w-md rounded-lg shadow-md"
                    />
                  )}
                </div>
              ))}
              
              <div
                className={`px-4 py-2 rounded-2xl shadow-bubble transition-smooth hover:scale-[1.02] ${
                  isOwn
                    ? 'bg-[hsl(var(--chat-sent))] text-[hsl(var(--chat-sent-foreground))] rounded-br-sm'
                    : 'bg-[hsl(var(--chat-received))] text-[hsl(var(--chat-received-foreground))] rounded-bl-sm'
                }`}
              >
                {message.editedAt && (
                  <p className="text-xs opacity-60 mb-1">Edited</p>
                )}
                <p className="whitespace-pre-wrap break-words">{message.text}</p>
                <div className="flex items-center justify-end gap-1 mt-1">
                  <span className={`text-xs ${isOwn ? 'text-white/70' : 'text-muted-foreground'}`}>
                    {format(new Date(message.createdAt), 'HH:mm')}
                  </span>
                  {isOwn && (
                    <span className="text-white/70">
                      {message.status === 'read' ? (
                        <CheckCheck className="h-3 w-3" />
                      ) : message.status === 'delivered' ? (
                        <CheckCheck className="h-3 w-3 opacity-50" />
                      ) : (
                        <Check className="h-3 w-3 opacity-50" />
                      )}
                    </span>
                  )}
                </div>
              </div>
            </div>
            
            {!isOwn && <MessageActions message={message} isOwn={isOwn} onReply={onReply} onEdit={onEdit} onDelete={onDelete} />}
          </div>
        </div>
      </div>
    </div>
  );
};
