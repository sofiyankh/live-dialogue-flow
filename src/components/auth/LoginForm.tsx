import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { loginStart, loginSuccess } from '@/store/authSlice';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

interface LoginFormProps {
  onToggleMode: () => void;
}

export const LoginForm = ({ onToggleMode }: LoginFormProps) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const dispatch = useDispatch();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    dispatch(loginStart());

    // Mock login - replace with actual API call
    setTimeout(() => {
      const mockUser = {
        _id: '1',
        username: 'Demo User',
        email: email,
        status: 'online' as const,
        lastSeen: new Date().toISOString(),
      };
      const mockToken = 'mock-jwt-token';

      dispatch(loginSuccess({ user: mockUser, token: mockToken }));
    }, 500);
  };

  return (
    <Card className="w-full max-w-md shadow-lg">
      <CardHeader>
        <CardTitle className="text-2xl">Welcome back</CardTitle>
        <CardDescription>Sign in to continue to LiveChat</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <Button type="submit" className="w-full gradient-primary text-primary-foreground">
            Sign In
          </Button>
          
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-card px-2 text-muted-foreground">Or</span>
            </div>
          </div>

          <Button
            type="button"
            variant="outline"
            className="w-full"
            onClick={() => {
              setEmail('demo@livechat.com');
              setPassword('demo123');
              setTimeout(() => {
                const event = new Event('submit', { bubbles: true, cancelable: true });
                document.querySelector('form')?.dispatchEvent(event);
              }, 100);
            }}
          >
            Try Demo Account
          </Button>

          <div className="text-center text-sm">
            <span className="text-muted-foreground">Don't have an account? </span>
            <button
              type="button"
              onClick={onToggleMode}
              className="text-primary hover:underline font-medium"
            >
              Sign up
            </button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};
