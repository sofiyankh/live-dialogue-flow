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
      <div className={`flex ${isOwn ? 'justify-end' : 'justify-start'} mb-1`}>
        <div className="bg-muted text-muted-foreground italic px-3 py-1.5 rounded-lg text-sm">
          This message was deleted
        </div>
      </div>
    );
  }

  return (
    <div className={`flex ${isOwn ? 'justify-end' : 'justify-start'} mb-1 group`}>
      <div className={`flex gap-2 items-end max-w-[80%]`}>
        {!isOwn && sender && (
          <Avatar className="h-7 w-7 shrink-0">
            <AvatarImage src={sender.profilePic} alt={sender.username} />
            <AvatarFallback className="text-[10px] bg-muted">
              {sender.username.slice(0, 2).toUpperCase()}
            </AvatarFallback>
          </Avatar>
        )}

        <div className="flex flex-col gap-0.5">
          {message.replyTo && (
            <div className={`text-xs px-2 py-1 rounded border-l-2 ${
              isOwn ? 'bg-primary/10 border-primary/30' : 'bg-muted border-primary/50'
            }`}>
              <p className="font-medium text-[10px]">{message.replyTo.senderName}</p>
              <p className="truncate opacity-70">{message.replyTo.text}</p>
            </div>
          )}

          <div className="flex items-center gap-1">
            {isOwn && <MessageActions message={message} isOwn={isOwn} onReply={onReply} onEdit={onEdit} onDelete={onDelete} />}

            <div className="flex flex-col gap-1">
              {message.attachments?.map((attachment, idx) => (
                <div key={idx}>
                  {attachment.type.startsWith('video/') && <VideoPlayer url={attachment.url} />}
                  {attachment.type.startsWith('image/') && (
                    <img src={attachment.url} alt="Attachment" className="max-w-xs rounded-lg" />
                  )}
                </div>
              ))}

              <div
                className={`px-3 py-2 rounded-2xl text-sm ${
                  isOwn
                    ? 'bg-primary text-primary-foreground rounded-br-sm'
                    : 'bg-muted text-foreground rounded-bl-sm'
                }`}
              >
                {message.editedAt && <p className="text-[10px] opacity-60 mb-0.5">Edited</p>}
                <p className="whitespace-pre-wrap break-words">{message.text}</p>
                <div className="flex items-center justify-end gap-1 mt-0.5">
                  <span className={`text-[10px] ${isOwn ? 'opacity-70' : 'text-muted-foreground'}`}>
                    {format(new Date(message.createdAt), 'HH:mm')}
                  </span>
                  {isOwn && (
                    <span className="opacity-70">
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
