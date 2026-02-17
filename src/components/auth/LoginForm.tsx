import { useDispatch } from 'react-redux';
import { loginSuccess } from '@/store/authSlice';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { DEMO_USER_1, DEMO_USER_2 } from '@/services/chatEventBus';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { MessageCircle } from 'lucide-react';

interface LoginFormProps {
  onToggleMode: () => void;
}

export const LoginForm = ({ onToggleMode }: LoginFormProps) => {
  const dispatch = useDispatch();

  const loginAs = (user: typeof DEMO_USER_1) => {
    dispatch(loginSuccess({ user, token: `token-${user._id}` }));
  };

  return (
    <Card className="w-full max-w-sm border shadow-lg">
      <CardHeader className="text-center pb-2">
        <div className="mx-auto mb-3 h-12 w-12 rounded-xl bg-primary flex items-center justify-center">
          <MessageCircle className="h-6 w-6 text-primary-foreground" />
        </div>
        <CardTitle className="text-xl">LiveChat Demo</CardTitle>
        <CardDescription className="text-sm">
          Pick a user to start chatting. Open two tabs to see real-time sync!
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-3 pt-2">
        <Button
          variant="outline"
          className="w-full h-auto py-3 justify-start gap-3"
          onClick={() => loginAs(DEMO_USER_1)}
        >
          <Avatar className="h-9 w-9">
            <AvatarFallback className="bg-primary text-primary-foreground text-sm font-semibold">
              AM
            </AvatarFallback>
          </Avatar>
          <div className="text-left">
            <p className="font-medium text-sm">{DEMO_USER_1.username}</p>
            <p className="text-xs text-muted-foreground">{DEMO_USER_1.email}</p>
          </div>
        </Button>

        <Button
          variant="outline"
          className="w-full h-auto py-3 justify-start gap-3"
          onClick={() => loginAs(DEMO_USER_2)}
        >
          <Avatar className="h-9 w-9">
            <AvatarFallback className="bg-accent text-accent-foreground text-sm font-semibold">
              JL
            </AvatarFallback>
          </Avatar>
          <div className="text-left">
            <p className="font-medium text-sm">{DEMO_USER_2.username}</p>
            <p className="text-xs text-muted-foreground">{DEMO_USER_2.email}</p>
          </div>
        </Button>

        <p className="text-xs text-center text-muted-foreground pt-1">
          Messages sync in real-time across sessions
        </p>
      </CardContent>
    </Card>
  );
};
