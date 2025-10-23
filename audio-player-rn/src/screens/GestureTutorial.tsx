import { useState } from 'react';
import { ArrowLeft, ArrowRight, ArrowUp, ArrowDown, Hand, CheckCircle2, XCircle } from 'lucide-react';
import { ControlButton } from '../components/ControlButton';
import { useGestures } from '../hooks/useGestures';
import { GestureEvent } from '../types';
import { Button } from '../components/ui/button';

interface GestureTutorialProps {
  onNavigate: (screen: string) => void;
}

type TutorialStep = {
  id: string;
  title: string;
  description: string;
  targetGesture: GestureEvent['type'];
  icon: typeof ArrowLeft;
};

const steps: TutorialStep[] = [
  {
    id: 'swipe-left',
    title: 'Swipe Left',
    description: 'Swipe from right to left to go to next track',
    targetGesture: 'swipe-left',
    icon: ArrowLeft,
  },
  {
    id: 'swipe-right',
    title: 'Swipe Right',
    description: 'Swipe from left to right to go to previous track',
    targetGesture: 'swipe-right',
    icon: ArrowRight,
  },
  {
    id: 'double-tap',
    title: 'Double Tap',
    description: 'Quickly tap twice to play/pause',
    targetGesture: 'double-tap',
    icon: Hand,
  },
  {
    id: 'swipe-up',
    title: 'Swipe Up (Optional)',
    description: 'Swipe up to increase volume',
    targetGesture: 'swipe-up',
    icon: ArrowUp,
  },
  {
    id: 'swipe-down',
    title: 'Swipe Down (Optional)',
    description: 'Swipe down to decrease volume',
    targetGesture: 'swipe-down',
    icon: ArrowDown,
  },
];

export function GestureTutorial({ onNavigate }: GestureTutorialProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [attempts, setAttempts] = useState(0);
  const [success, setSuccess] = useState(false);
  const [showFeedback, setShowFeedback] = useState(false);

  const step = steps[currentStep];

  const handleGesture = (gesture: GestureEvent) => {
    setAttempts(prev => prev + 1);
    
    if (gesture.type === step.targetGesture) {
      setSuccess(true);
      setShowFeedback(true);
      setTimeout(() => {
        setShowFeedback(false);
        if (currentStep < steps.length - 1) {
          setCurrentStep(prev => prev + 1);
          setAttempts(0);
          setSuccess(false);
        }
      }, 1000);
    } else {
      setSuccess(false);
      setShowFeedback(true);
      setTimeout(() => setShowFeedback(false), 1000);
    }
  };

  const { handlers } = useGestures({
    enabled: true,
    sensitivity: 50,
    onGesture: handleGesture,
  });

  const handleSkip = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(prev => prev + 1);
      setAttempts(0);
      setSuccess(false);
      setShowFeedback(false);
    } else {
      onNavigate('settings');
    }
  };

  const Icon = step.icon;

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
        <h1 className="text-xl">Gesture Tutorial</h1>
      </header>

      {/* Content */}
      <main className="flex-1 flex flex-col p-6">
        {/* Progress */}
        <div className="mb-8">
          <div className="flex justify-between text-sm text-zinc-400 mb-2">
            <span>Step {currentStep + 1} of {steps.length}</span>
            <span>{Math.round((currentStep / steps.length) * 100)}%</span>
          </div>
          <div className="h-2 bg-zinc-800 rounded-full overflow-hidden">
            <div
              className="h-full bg-blue-500 transition-all duration-300"
              style={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
            />
          </div>
        </div>

        {/* Instruction */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-blue-500/10 rounded-full mb-4">
            <Icon size={40} className="text-blue-500" />
          </div>
          <h2 className="text-2xl mb-2">{step.title}</h2>
          <p className="text-zinc-400">{step.description}</p>
        </div>

        {/* Practice Area */}
        <div
          className="flex-1 bg-gradient-to-br from-zinc-900 to-zinc-800 rounded-2xl flex flex-col items-center justify-center p-8 mb-8 relative overflow-hidden"
          onTouchStart={handlers.onTouchStart}
          onTouchMove={handlers.onTouchMove}
          onTouchEnd={handlers.onTouchEnd}
        >
          {/* Feedback Overlay */}
          {showFeedback && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
              {success ? (
                <div className="flex flex-col items-center gap-4 text-green-500">
                  <CheckCircle2 size={64} />
                  <p className="text-2xl">Perfect!</p>
                </div>
              ) : (
                <div className="flex flex-col items-center gap-4 text-red-500">
                  <XCircle size={64} />
                  <p className="text-2xl">Try Again</p>
                </div>
              )}
            </div>
          )}

          <Hand size={64} className="text-zinc-600 mb-4" />
          <p className="text-xl text-zinc-400 mb-2">Try the gesture here</p>
          {attempts > 0 && (
            <p className="text-sm text-zinc-500">Attempts: {attempts}</p>
          )}
        </div>

        {/* Actions */}
        <div className="space-y-3">
          <Button
            onClick={handleSkip}
            className="w-full bg-blue-500 hover:bg-blue-600"
          >
            {currentStep === steps.length - 1 ? 'Finish Tutorial' : 'Skip Step'}
          </Button>
          {currentStep > 0 && (
            <Button
              onClick={() => {
                setCurrentStep(prev => prev - 1);
                setAttempts(0);
                setSuccess(false);
                setShowFeedback(false);
              }}
              variant="outline"
              className="w-full border-zinc-700 hover:bg-zinc-800"
            >
              Previous Step
            </Button>
          )}
        </div>
      </main>
    </div>
  );
}
