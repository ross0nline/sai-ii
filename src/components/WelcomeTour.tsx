import { useState, useEffect } from 'react';
import { X, ChevronRight, ChevronLeft, Sparkles } from 'lucide-react';
import { useHelpStore } from '../store/helpStore';

const tourSteps = [
  {
    title: 'Welcome to Gemma-2 Inference Lab',
    content: 'Run powerful language models directly in your browser with WebGPU acceleration. No data leaves your device!',
    target: null,
  },
  {
    title: 'Chat Interface',
    content: 'Type your messages here and interact with the Gemma-2 model. Press Enter to send, or Shift+Enter for a new line.',
    highlight: 'chat-input',
  },
  {
    title: 'Statistics Dashboard',
    content: 'Monitor real-time performance metrics including tokens per second, generation time, and model status.',
    highlight: 'stats-dashboard',
  },
  {
    title: 'Parameter Controls',
    content: 'Fine-tune the model\'s behavior with temperature, top-p, penalties, and more. Try different presets to get started!',
    highlight: 'parameter-controls',
  },
  {
    title: 'Benchmarking',
    content: 'Test your system\'s performance with structured benchmarks. Great for comparing configurations and hardware.',
    highlight: 'benchmark-panel',
  },
  {
    title: 'Ready to Start!',
    content: 'You\'re all set! The model will load automatically. When ready, start chatting or adjust parameters. Press ? anytime for help.',
    target: null,
  },
];

export function WelcomeTour() {
  const { hasSeenWelcome, markWelcomeSeen, markTourCompleted } = useHelpStore();
  const [currentStep, setCurrentStep] = useState(0);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (!hasSeenWelcome) {
      const timer = setTimeout(() => setIsVisible(true), 500);
      return () => clearTimeout(timer);
    }
  }, [hasSeenWelcome]);

  const handleClose = () => {
    setIsVisible(false);
    markWelcomeSeen();
    markTourCompleted();
  };

  const handleNext = () => {
    if (currentStep < tourSteps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      handleClose();
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSkip = () => {
    markWelcomeSeen();
    setIsVisible(false);
  };

  if (!isVisible || hasSeenWelcome) return null;

  const step = tourSteps[currentStep];

  return (
    <>
      <div className="fixed inset-0 bg-black/60 z-40 transition-opacity" />

      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none">
        <div className="bg-white rounded-xl shadow-2xl max-w-lg w-full p-6 pointer-events-auto animate-in fade-in slide-in-from-bottom-4">
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="bg-blue-100 p-2 rounded-lg">
                <Sparkles className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-slate-800">{step.title}</h3>
                <p className="text-sm text-slate-500">
                  Step {currentStep + 1} of {tourSteps.length}
                </p>
              </div>
            </div>
            <button
              onClick={handleClose}
              className="p-1 hover:bg-slate-100 rounded transition-colors"
              aria-label="Close tour"
            >
              <X className="w-5 h-5 text-slate-400" />
            </button>
          </div>

          <p className="text-slate-600 leading-relaxed mb-6">{step.content}</p>

          <div className="flex items-center gap-2 mb-6">
            {tourSteps.map((_, index) => (
              <div
                key={index}
                className={`h-2 flex-1 rounded-full transition-colors ${
                  index === currentStep
                    ? 'bg-blue-600'
                    : index < currentStep
                    ? 'bg-blue-300'
                    : 'bg-slate-200'
                }`}
              />
            ))}
          </div>

          <div className="flex items-center justify-between">
            <button
              onClick={handleSkip}
              className="px-4 py-2 text-sm text-slate-600 hover:text-slate-800 transition-colors"
            >
              Skip Tour
            </button>

            <div className="flex items-center gap-2">
              {currentStep > 0 && (
                <button
                  onClick={handlePrevious}
                  className="flex items-center gap-2 px-4 py-2 text-sm text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
                >
                  <ChevronLeft className="w-4 h-4" />
                  Previous
                </button>
              )}
              <button
                onClick={handleNext}
                className="flex items-center gap-2 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
              >
                {currentStep === tourSteps.length - 1 ? 'Get Started' : 'Next'}
                {currentStep < tourSteps.length - 1 && <ChevronRight className="w-4 h-4" />}
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
