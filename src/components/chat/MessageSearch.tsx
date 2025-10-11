import { useState } from 'react';
import { Search, X } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

interface MessageSearchProps {
  onSearch: (query: string) => void;
  onClose: () => void;
}

export const MessageSearch = ({ onSearch, onClose }: MessageSearchProps) => {
  const [query, setQuery] = useState('');

  const handleSearch = (value: string) => {
    setQuery(value);
    onSearch(value);
  };

  return (
    <div className="p-3 border-b bg-card animate-in slide-in-from-top-2 duration-200">
      <div className="max-w-4xl mx-auto flex items-center gap-2">
        <Search className="h-5 w-5 text-muted-foreground" />
        <Input
          value={query}
          onChange={(e) => handleSearch(e.target.value)}
          placeholder="Search messages..."
          className="flex-1"
          autoFocus
        />
        <Button variant="ghost" size="icon" onClick={onClose}>
          <X className="h-5 w-5" />
        </Button>
      </div>
    </div>
  );
};
