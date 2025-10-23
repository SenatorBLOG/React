import { ArrowLeft, MousePointer, Hand, Circle, Ban, HelpCircle } from 'lucide-react';
import { ControlMode, AppSettings } from '../types';
import { ControlButton } from '../components/ControlButton';
import { Switch } from '../components/ui/switch';
import { Slider } from '../components/ui/slider';
import { Button } from '../components/ui/button';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '../components/ui/alert-dialog';
import { useState } from 'react';

interface SettingsProps {
  settings: AppSettings;
  onUpdateSettings: (settings: AppSettings) => void;
  onResetData: () => void;
  onNavigate: (screen: string) => void;
}

export function Settings({ settings, onUpdateSettings, onResetData, onNavigate }: SettingsProps) {
  const [showResetDialog, setShowResetDialog] = useState(false);

  const controlModes: { value: ControlMode; label: string; icon: typeof MousePointer; description: string }[] = [
    { value: 'touch', label: 'Touch Only', icon: MousePointer, description: 'Use buttons and taps' },
    { value: 'gestures', label: 'Gestures Only', icon: Hand, description: 'Swipe and gesture controls' },
    { value: 'both', label: 'Both', icon: Circle, description: 'Touch and gestures' },
    { value: 'disabled', label: 'Disabled', icon: Ban, description: 'No controls' },
  ];

  const handleModeChange = (mode: ControlMode) => {
    onUpdateSettings({ ...settings, controlMode: mode });
  };

  const handleSensitivityChange = (value: number[]) => {
    onUpdateSettings({ ...settings, gestureSensitivity: value[0] });
  };

  const handleFeedbackChange = (checked: boolean) => {
    onUpdateSettings({ ...settings, visualFeedback: checked });
  };

  const confirmReset = () => {
    onResetData();
    setShowResetDialog(false);
    onNavigate('home');
  };

  return (
    <div className="min-h-screen bg-black text-white flex flex-col">
      {/* Header */}
      <header className="flex items-center gap-3 p-4 border-b border-zinc-800">
        <ControlButton
          icon={ArrowLeft}
          onClick={() => onNavigate('home')}
          size="sm"
          label="Back"
        />
        <h1 className="text-xl">Settings</h1>
      </header>

      {/* Content */}
      <main className="flex-1 overflow-auto">
        <div className="p-6 space-y-8 max-w-2xl mx-auto">
          {/* Control Mode */}
          <section>
            <h2 className="text-lg mb-4">Control Mode</h2>
            <div className="space-y-3">
              {controlModes.map((mode) => {
                const Icon = mode.icon;
                return (
                  <button
                    key={mode.value}
                    onClick={() => handleModeChange(mode.value)}
                    className={`w-full flex items-center gap-4 p-4 rounded-lg border-2 transition-colors ${
                      settings.controlMode === mode.value
                        ? 'border-blue-500 bg-blue-500/10'
                        : 'border-zinc-800 bg-zinc-900 hover:bg-zinc-800'
                    }`}
                  >
                    <Icon size={24} className={settings.controlMode === mode.value ? 'text-blue-500' : 'text-zinc-400'} />
                    <div className="flex-1 text-left">
                      <p>{mode.label}</p>
                      <p className="text-sm text-zinc-400">{mode.description}</p>
                    </div>
                  </button>
                );
              })}
            </div>
          </section>

          {/* Gesture Sensitivity */}
          <section>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg">Gesture Sensitivity</h2>
              <span className="text-sm text-zinc-400">{settings.gestureSensitivity}%</span>
            </div>
            <Slider
              value={[settings.gestureSensitivity]}
              onValueChange={handleSensitivityChange}
              min={0}
              max={100}
              step={1}
              className="mb-2"
            />
            <p className="text-sm text-zinc-500">
              Higher sensitivity = easier to trigger gestures
            </p>
          </section>

          {/* Visual Feedback */}
          <section>
            <div className="flex items-center justify-between p-4 bg-zinc-900 rounded-lg">
              <div className="flex-1">
                <h2 className="mb-1">Visual Feedback</h2>
                <p className="text-sm text-zinc-400">
                  Show toast messages when gestures are detected
                </p>
              </div>
              <Switch
                checked={settings.visualFeedback}
                onCheckedChange={handleFeedbackChange}
              />
            </div>
          </section>

          {/* Quick Actions */}
          <section>
            <h2 className="text-lg mb-4">Quick Actions</h2>
            <div className="space-y-3">
              <Button
                onClick={() => onNavigate('gesture-tutorial')}
                variant="outline"
                className="w-full justify-start gap-3 border-zinc-800 hover:bg-zinc-800"
              >
                <HelpCircle size={20} />
                Gesture Tutorial
              </Button>
              <Button
                onClick={() => onNavigate('about')}
                variant="outline"
                className="w-full justify-start gap-3 border-zinc-800 hover:bg-zinc-800"
              >
                <HelpCircle size={20} />
                About & Debug
              </Button>
            </div>
          </section>

          {/* Reset Data */}
          <section>
            <h2 className="text-lg mb-4">Data Management</h2>
            <Button
              onClick={() => setShowResetDialog(true)}
              variant="destructive"
              className="w-full"
            >
              Reset All Data
            </Button>
            <p className="text-sm text-zinc-500 mt-2 text-center">
              This will delete all playlists and settings
            </p>
          </section>
        </div>
      </main>

      {/* Reset Confirmation Dialog */}
      <AlertDialog open={showResetDialog} onOpenChange={setShowResetDialog}>
        <AlertDialogContent className="bg-zinc-900 border-zinc-800">
          <AlertDialogHeader>
            <AlertDialogTitle>Reset All Data?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete all your playlists, tracks, and settings. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="bg-zinc-800 hover:bg-zinc-700">
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmReset}
              className="bg-red-500 hover:bg-red-600"
            >
              Reset Everything
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
