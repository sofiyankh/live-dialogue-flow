import { Play } from 'lucide-react';
import { useState, useRef } from 'react';

interface VideoPlayerProps {
  url: string;
}

export const VideoPlayer = ({ url }: VideoPlayerProps) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  const handlePlay = () => {
    if (videoRef.current) {
      videoRef.current.play();
      setIsPlaying(true);
    }
  };

  return (
    <div className="relative rounded-lg overflow-hidden max-w-md group">
      <video
        ref={videoRef}
        src={url}
        className="w-full rounded-lg"
        controls={isPlaying}
        onEnded={() => setIsPlaying(false)}
        onClick={handlePlay}
      />
      {!isPlaying && (
        <div
          onClick={handlePlay}
          className="absolute inset-0 flex items-center justify-center bg-black/40 cursor-pointer group-hover:bg-black/50 transition-smooth"
        >
          <div className="w-16 h-16 rounded-full bg-white/90 flex items-center justify-center shadow-lg group-hover:scale-110 transition-smooth">
            <Play className="h-8 w-8 text-primary ml-1" fill="currentColor" />
          </div>
        </div>
      )}
    </div>
  );
};
