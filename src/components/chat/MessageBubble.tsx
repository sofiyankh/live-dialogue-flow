import { Message } from '@/types';
import { format } from 'date-fns';
import { Check, CheckCheck } from 'lucide-react';

interface MessageBubbleProps {
  message: Message;
  isOwn: boolean;
}

export const MessageBubble = ({ message, isOwn }: MessageBubbleProps) => {
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
    <div className={`flex ${isOwn ? 'justify-end' : 'justify-start'} mb-2 animate-in slide-in-from-bottom-2 duration-200`}>
      <div
        className={`px-4 py-2 rounded-2xl shadow-bubble max-w-[70%] transition-smooth ${
          isOwn
            ? 'bg-[hsl(var(--chat-sent))] text-[hsl(var(--chat-sent-foreground))] rounded-br-sm'
            : 'bg-[hsl(var(--chat-received))] text-[hsl(var(--chat-received-foreground))] rounded-bl-sm'
        }`}
      >
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
  );
};
