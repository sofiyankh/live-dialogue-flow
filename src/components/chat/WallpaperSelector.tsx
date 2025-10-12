import { useState } from 'react';
import { Image, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';

interface WallpaperSelectorProps {
  conversationId: string;
  onWallpaperChange: (wallpaperUrl: string | null) => void;
}

const defaultWallpapers = [
  { name: 'None', url: null },
  { name: 'Gradient Blue', url: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' },
  { name: 'Gradient Pink', url: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)' },
  { name: 'Gradient Green', url: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)' },
  { name: 'Subtle Pattern', url: 'repeating-linear-gradient(45deg, transparent, transparent 10px, rgba(255,255,255,.05) 10px, rgba(255,255,255,.05) 20px)' },
];

export const WallpaperSelector = ({ conversationId, onWallpaperChange }: WallpaperSelectorProps) => {
  const [customImageUrl, setCustomImageUrl] = useState('');

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result as string;
        onWallpaperChange(result);
        localStorage.setItem(`wallpaper-${conversationId}`, result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handlePresetWallpaper = (url: string | null) => {
    onWallpaperChange(url);
    if (url) {
      localStorage.setItem(`wallpaper-${conversationId}`, url);
    } else {
      localStorage.removeItem(`wallpaper-${conversationId}`);
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="hover:bg-muted transition-smooth">
          <Image className="h-5 w-5" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <div className="p-2">
          <label htmlFor="wallpaper-upload" className="cursor-pointer">
            <div className="flex items-center gap-2 p-2 hover:bg-muted rounded-md transition-smooth">
              <Image className="h-4 w-4" />
              <span className="text-sm">Upload Custom Image</span>
            </div>
            <Input
              id="wallpaper-upload"
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleFileUpload}
            />
          </label>
        </div>
        
        <div className="border-t my-1" />
        
        {defaultWallpapers.map((wallpaper) => (
          <DropdownMenuItem 
            key={wallpaper.name} 
            onClick={() => handlePresetWallpaper(wallpaper.url)}
          >
            <div className="flex items-center gap-2 w-full">
              {wallpaper.url ? (
                <div
                  className="w-6 h-6 rounded border"
                  style={{ background: wallpaper.url }}
                />
              ) : (
                <X className="w-6 h-6 text-muted-foreground" />
              )}
              <span>{wallpaper.name}</span>
            </div>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
