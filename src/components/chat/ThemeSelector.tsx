import { useState } from 'react';
import { Palette } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface ThemeSelectorProps {
  conversationId: string;
  onThemeChange: (theme: ChatTheme) => void;
}

export type ChatTheme = {
  name: string;
  sentBg: string;
  sentText: string;
  receivedBg: string;
  receivedText: string;
  gradient: string;
};

const themes: ChatTheme[] = [
  {
    name: 'Default Purple',
    sentBg: '262 83% 58%',
    sentText: '0 0% 100%',
    receivedBg: '0 0% 100%',
    receivedText: '220 20% 10%',
    gradient: 'linear-gradient(180deg, hsl(220 25% 97%), hsl(220 20% 99%))',
  },
  {
    name: 'Ocean Blue',
    sentBg: '210 100% 50%',
    sentText: '0 0% 100%',
    receivedBg: '0 0% 100%',
    receivedText: '220 20% 10%',
    gradient: 'linear-gradient(180deg, hsl(210 100% 98%), hsl(210 100% 99%))',
  },
  {
    name: 'Forest Green',
    sentBg: '142 76% 36%',
    sentText: '0 0% 100%',
    receivedBg: '0 0% 100%',
    receivedText: '220 20% 10%',
    gradient: 'linear-gradient(180deg, hsl(142 30% 97%), hsl(142 30% 99%))',
  },
  {
    name: 'Sunset Orange',
    sentBg: '25 95% 53%',
    sentText: '0 0% 100%',
    receivedBg: '0 0% 100%',
    receivedText: '220 20% 10%',
    gradient: 'linear-gradient(180deg, hsl(25 100% 98%), hsl(25 100% 99%))',
  },
  {
    name: 'Rose Pink',
    sentBg: '330 81% 60%',
    sentText: '0 0% 100%',
    receivedBg: '0 0% 100%',
    receivedText: '220 20% 10%',
    gradient: 'linear-gradient(180deg, hsl(330 100% 98%), hsl(330 100% 99%))',
  },
];

export const ThemeSelector = ({ conversationId, onThemeChange }: ThemeSelectorProps) => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="hover:bg-muted transition-smooth">
          <Palette className="h-5 w-5" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {themes.map((theme) => (
          <DropdownMenuItem key={theme.name} onClick={() => onThemeChange(theme)}>
            <div className="flex items-center gap-2">
              <div
                className="w-4 h-4 rounded-full"
                style={{ background: `hsl(${theme.sentBg})` }}
              />
              {theme.name}
            </div>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
