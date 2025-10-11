import { User } from '@/types';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Mail, Phone, Clock } from 'lucide-react';
import { format } from 'date-fns';

interface UserProfileDialogProps {
  user: User | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const UserProfileDialog = ({ user, open, onOpenChange }: UserProfileDialogProps) => {
  if (!user) return null;

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'online': return 'bg-green-500';
      case 'away': return 'bg-yellow-500';
      default: return 'bg-gray-400';
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Profile</DialogTitle>
        </DialogHeader>
        <div className="flex flex-col items-center gap-6 py-4">
          <div className="relative">
            <Avatar className="h-32 w-32">
              <AvatarImage src={user.profilePic} alt={user.username} />
              <AvatarFallback className="text-3xl">
                {user.username.slice(0, 2).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div className={`absolute bottom-2 right-2 h-6 w-6 rounded-full border-4 border-background ${getStatusColor(user.status)}`} />
          </div>

          <div className="text-center space-y-2">
            <h3 className="text-2xl font-semibold">{user.username}</h3>
            <Badge variant={user.status === 'online' ? 'default' : 'secondary'}>
              {user.status}
            </Badge>
          </div>

          <div className="w-full space-y-3">
            <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
              <Mail className="h-5 w-5 text-muted-foreground" />
              <span className="text-sm">{user.email}</span>
            </div>
            
            <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
              <Clock className="h-5 w-5 text-muted-foreground" />
              <span className="text-sm">
                Last seen: {format(new Date(user.lastSeen), 'PPp')}
              </span>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
