import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Phone, Video, PhoneOff, Mic, MicOff, VideoOff } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

interface CallInterfaceProps {
  type: 'voice' | 'video';
  recipientName: string;
  recipientImage?: string;
  onEndCall: () => void;
}

export const CallInterface = ({ type, recipientName, recipientImage, onEndCall }: CallInterfaceProps) => {
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoOff, setIsVideoOff] = useState(false);
  const [callDuration, setCallDuration] = useState(0);
  const localVideoRef = useRef<HTMLVideoElement>(null);
  const remoteVideoRef = useRef<HTMLVideoElement>(null);
  const peerConnectionRef = useRef<RTCPeerConnection | null>(null);
  const localStreamRef = useRef<MediaStream | null>(null);

  useEffect(() => {
    startCall();
    const timer = setInterval(() => {
      setCallDuration(prev => prev + 1);
    }, 1000);

    return () => {
      clearInterval(timer);
      endCall();
    };
  }, []);

  const startCall = async () => {
    try {
      const constraints = {
        audio: true,
        video: type === 'video',
      };

      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      localStreamRef.current = stream;

      if (localVideoRef.current && type === 'video') {
        localVideoRef.current.srcObject = stream;
      }

      // Initialize WebRTC peer connection
      const configuration = {
        iceServers: [{ urls: 'stun:stun.l.google.com:19302' }],
      };
      const pc = new RTCPeerConnection(configuration);
      peerConnectionRef.current = pc;

      // Add local stream tracks to peer connection
      stream.getTracks().forEach(track => {
        pc.addTrack(track, stream);
      });

      // Handle remote stream
      pc.ontrack = (event) => {
        if (remoteVideoRef.current) {
          remoteVideoRef.current.srcObject = event.streams[0];
        }
      };

      // Handle ICE candidates
      pc.onicecandidate = (event) => {
        if (event.candidate) {
          // Send candidate to remote peer via signaling server
          console.log('New ICE candidate:', event.candidate);
        }
      };
    } catch (error) {
      console.error('Error starting call:', error);
    }
  };

  const toggleMute = () => {
    if (localStreamRef.current) {
      const audioTrack = localStreamRef.current.getAudioTracks()[0];
      if (audioTrack) {
        audioTrack.enabled = !audioTrack.enabled;
        setIsMuted(!audioTrack.enabled);
      }
    }
  };

  const toggleVideo = () => {
    if (localStreamRef.current && type === 'video') {
      const videoTrack = localStreamRef.current.getVideoTracks()[0];
      if (videoTrack) {
        videoTrack.enabled = !videoTrack.enabled;
        setIsVideoOff(!videoTrack.enabled);
      }
    }
  };

  const endCall = () => {
    if (localStreamRef.current) {
      localStreamRef.current.getTracks().forEach(track => track.stop());
    }
    if (peerConnectionRef.current) {
      peerConnectionRef.current.close();
    }
    onEndCall();
  };

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="fixed inset-0 bg-background z-50 flex flex-col">
      {/* Remote video/avatar */}
      <div className="flex-1 relative bg-muted/20">
        {type === 'video' ? (
          <video
            ref={remoteVideoRef}
            autoPlay
            playsInline
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="flex flex-col items-center justify-center h-full">
            <Avatar className="h-32 w-32 mb-6">
              <AvatarImage src={recipientImage} alt={recipientName} />
              <AvatarFallback className="text-4xl">
                {recipientName.slice(0, 2).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <h2 className="text-2xl font-semibold mb-2">{recipientName}</h2>
            <p className="text-muted-foreground">{formatDuration(callDuration)}</p>
          </div>
        )}

        {/* Local video (for video calls) */}
        {type === 'video' && (
          <div className="absolute top-4 right-4 w-32 h-40 bg-black rounded-lg overflow-hidden shadow-lg">
            <video
              ref={localVideoRef}
              autoPlay
              playsInline
              muted
              className="w-full h-full object-cover"
            />
          </div>
        )}

        {/* Call duration overlay for video */}
        {type === 'video' && (
          <div className="absolute top-4 left-4 bg-black/50 px-4 py-2 rounded-full">
            <p className="text-white text-sm font-medium">{formatDuration(callDuration)}</p>
          </div>
        )}
      </div>

      {/* Controls */}
      <div className="p-6 bg-card border-t">
        <div className="max-w-md mx-auto flex items-center justify-center gap-4">
          <Button
            variant={isMuted ? 'default' : 'secondary'}
            size="icon"
            className="h-14 w-14 rounded-full transition-smooth"
            onClick={toggleMute}
          >
            {isMuted ? <MicOff className="h-6 w-6" /> : <Mic className="h-6 w-6" />}
          </Button>

          {type === 'video' && (
            <Button
              variant={isVideoOff ? 'default' : 'secondary'}
              size="icon"
              className="h-14 w-14 rounded-full transition-smooth"
              onClick={toggleVideo}
            >
              {isVideoOff ? <VideoOff className="h-6 w-6" /> : <Video className="h-6 w-6" />}
            </Button>
          )}

          <Button
            variant="destructive"
            size="icon"
            className="h-16 w-16 rounded-full transition-smooth hover:scale-110"
            onClick={endCall}
          >
            <PhoneOff className="h-7 w-7" />
          </Button>
        </div>
      </div>
    </div>
  );
};
