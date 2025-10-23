import { useEffect, useState } from 'react';
import { Music } from 'lucide-react';

interface SplashProps {
  onComplete: () => void;
}

export function Splash({ onComplete }: SplashProps) {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    // Simulate loading
    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setTimeout(onComplete, 300);
          return 100;
        }
        return prev + 10;
      });
    }, 100);

    return () => clearInterval(interval);
  }, [onComplete]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-zinc-900 via-black to-zinc-900 flex flex-col items-center justify-center p-8">
      <div className="flex flex-col items-center gap-8 animate-in fade-in duration-500">
        <div className="relative">
          <div className="absolute inset-0 bg-blue-500 blur-3xl opacity-20 animate-pulse" />
          <div className="relative bg-gradient-to-br from-blue-500 to-purple-600 p-6 rounded-3xl">
            <Music size={64} className="text-white" />
          </div>
        </div>
        
        <h1 className="text-4xl text-center bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
          Audio Player
        </h1>

        <div className="w-64 h-1 bg-zinc-800 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-blue-500 to-purple-600 transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>

        <p className="text-sm text-zinc-500">Loading your music...</p>
      </div>
    </div>
  );
}
