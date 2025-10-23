import { ArrowLeft, Music, Trash2, FileText } from 'lucide-react';
import { ControlButton } from '../components/ControlButton';
import { Button } from '../components/ui/button';
import { ScrollArea } from '../components/ui/scroll-area';
import { StorageService } from '../services/storage';
import { useState, useEffect } from 'react';

interface AboutProps {
  onNavigate: (screen: string) => void;
}

export function About({ onNavigate }: AboutProps) {
  const [logs, setLogs] = useState<string[]>([]);

  useEffect(() => {
    setLogs(StorageService.getLogs());
  }, []);

  const handleClearLogs = () => {
    localStorage.removeItem('@APP:logs');
    setLogs([]);
  };

  const appInfo = {
    name: 'Audio Player PWA',
    version: '1.0.0',
    buildDate: 'October 2025',
  };

  const libraries = [
    'React 18',
    'Tailwind CSS 4.0',
    'HTML5 Audio API',
    'Web Storage API',
    'Shadcn/ui Components',
    'Lucide Icons',
  ];

  return (
    <div className="min-h-screen bg-black text-white flex flex-col">
      {/* Header */}
      <header className="flex items-center gap-3 p-4 border-b border-zinc-800">
        <ControlButton
          icon={ArrowLeft}
          onClick={() => onNavigate('settings')}
          size="sm"
          label="Back"
        />
        <h1 className="text-xl">About & Debug</h1>
      </header>

      {/* Content */}
      <main className="flex-1 overflow-auto">
        <div className="p-6 space-y-6 max-w-2xl mx-auto">
          {/* App Info */}
          <section className="bg-zinc-900 rounded-lg p-6">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center">
                <Music size={32} className="text-white" />
              </div>
              <div>
                <h2 className="text-xl">{appInfo.name}</h2>
                <p className="text-sm text-zinc-400">Version {appInfo.version}</p>
              </div>
            </div>
            <div className="text-sm text-zinc-400 space-y-1">
              <p>Build Date: {appInfo.buildDate}</p>
              <p>Progressive Web App</p>
            </div>
          </section>

          {/* Features */}
          <section className="bg-zinc-900 rounded-lg p-6">
            <h2 className="text-lg mb-4">Features</h2>
            <ul className="space-y-2 text-sm text-zinc-400">
              <li className="flex items-start gap-2">
                <span className="text-blue-500">•</span>
                <span>Local audio file playback</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-500">•</span>
                <span>Touch and gesture controls</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-500">•</span>
                <span>Playlist management</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-500">•</span>
                <span>Offline support</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-500">•</span>
                <span>Customizable controls</span>
              </li>
            </ul>
          </section>

          {/* Technologies */}
          <section className="bg-zinc-900 rounded-lg p-6">
            <h2 className="text-lg mb-4">Built With</h2>
            <div className="grid grid-cols-2 gap-2">
              {libraries.map((lib) => (
                <div
                  key={lib}
                  className="px-3 py-2 bg-zinc-800 rounded text-sm text-zinc-300"
                >
                  {lib}
                </div>
              ))}
            </div>
          </section>

          {/* Debug Logs */}
          <section className="bg-zinc-900 rounded-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg">Debug Logs</h2>
              <Button
                onClick={handleClearLogs}
                variant="ghost"
                size="sm"
                className="text-zinc-400 hover:text-white"
              >
                <Trash2 size={16} className="mr-2" />
                Clear
              </Button>
            </div>
            <ScrollArea className="h-64 w-full rounded border border-zinc-800">
              <div className="p-4 font-mono text-xs">
                {logs.length === 0 ? (
                  <p className="text-zinc-500 text-center py-8">No logs yet</p>
                ) : (
                  <div className="space-y-1">
                    {logs.map((log, index) => (
                      <div key={index} className="text-zinc-400">
                        {log}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </ScrollArea>
          </section>

          {/* Storage Info */}
          <section className="bg-zinc-900 rounded-lg p-6">
            <h2 className="text-lg mb-4">Storage</h2>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-zinc-400">Playlists</span>
                <span>{localStorage.getItem('@APP:playlists') ? 'Stored' : 'Empty'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-zinc-400">Settings</span>
                <span>{localStorage.getItem('@APP:settings') ? 'Stored' : 'Empty'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-zinc-400">Current State</span>
                <span>{localStorage.getItem('@APP:current') ? 'Stored' : 'Empty'}</span>
              </div>
            </div>
          </section>

          {/* Privacy Note */}
          <section className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-6">
            <h2 className="text-lg mb-2 text-blue-400">Privacy Note</h2>
            <p className="text-sm text-zinc-300">
              All your audio files and data are stored locally in your browser. 
              Nothing is sent to any server. Your music stays on your device.
            </p>
          </section>
        </div>
      </main>
    </div>
  );
}
