import { X, BookOpen, Sliders, BarChart3, Zap, AlertCircle } from 'lucide-react';
import { useHelpStore } from '../store/helpStore';

const tabs = [
  { id: 'getting-started', label: 'Getting Started', icon: BookOpen },
  { id: 'parameters', label: 'Parameters', icon: Sliders },
  { id: 'statistics', label: 'Statistics', icon: BarChart3 },
  { id: 'benchmarking', label: 'Benchmarking', icon: Zap },
  { id: 'troubleshooting', label: 'Troubleshooting', icon: AlertCircle },
] as const;

export function HelpModal() {
  const { isHelpOpen, currentTab, setHelpOpen, setCurrentTab, resetTour } = useHelpStore();

  if (!isHelpOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={() => setHelpOpen(false)}>
      <div
        className="bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between px-6 py-4 border-b">
          <h2 className="text-2xl font-bold text-slate-800">Help & Guide</h2>
          <button
            onClick={() => setHelpOpen(false)}
            className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
            aria-label="Close help"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex flex-1 overflow-hidden">
          <div className="w-56 border-r bg-slate-50 p-4 overflow-y-auto">
            {tabs.map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                onClick={() => setCurrentTab(id)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-colors mb-2 ${
                  currentTab === id
                    ? 'bg-blue-600 text-white'
                    : 'text-slate-700 hover:bg-slate-100'
                }`}
              >
                <Icon className="w-5 h-5" />
                <span className="text-sm font-medium">{label}</span>
              </button>
            ))}

            <div className="pt-4 mt-4 border-t">
              <button
                onClick={() => {
                  resetTour();
                  setHelpOpen(false);
                }}
                className="w-full px-4 py-2 text-sm text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
              >
                Restart Tour
              </button>
            </div>
          </div>

          <div className="flex-1 p-6 overflow-y-auto">
            {currentTab === 'getting-started' && <GettingStartedContent />}
            {currentTab === 'parameters' && <ParametersContent />}
            {currentTab === 'statistics' && <StatisticsContent />}
            {currentTab === 'benchmarking' && <BenchmarkingContent />}
            {currentTab === 'troubleshooting' && <TroubleshootingContent />}
          </div>
        </div>
      </div>
    </div>
  );
}

function GettingStartedContent() {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-xl font-bold text-slate-800 mb-3">Welcome to Gemma-2 Inference Lab</h3>
        <p className="text-slate-600 leading-relaxed">
          This application runs the Gemma-2-2B language model directly in your browser using WebGPU acceleration.
          No data is sent to external servers - everything happens locally on your device.
        </p>
      </div>

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h4 className="font-semibold text-blue-900 mb-2">System Requirements</h4>
        <ul className="space-y-1 text-sm text-blue-800">
          <li>• Modern browser with WebGPU support (Chrome 113+, Edge 113+)</li>
          <li>• GPU with 4+ GB memory recommended</li>
          <li>• Initial download: ~2 GB (cached for offline use)</li>
        </ul>
      </div>

      <div>
        <h4 className="font-semibold text-slate-800 mb-3">Quick Start Guide</h4>
        <ol className="space-y-3">
          <li className="flex gap-3">
            <span className="flex-shrink-0 w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-bold">1</span>
            <div>
              <strong className="text-slate-800">Wait for Model Loading</strong>
              <p className="text-sm text-slate-600">The app downloads and initializes Gemma-2 automatically. Watch the progress in the Statistics panel.</p>
            </div>
          </li>
          <li className="flex gap-3">
            <span className="flex-shrink-0 w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-bold">2</span>
            <div>
              <strong className="text-slate-800">Start Chatting</strong>
              <p className="text-sm text-slate-600">Type your message in the input box at the bottom and press Enter or click Send.</p>
            </div>
          </li>
          <li className="flex gap-3">
            <span className="flex-shrink-0 w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-bold">3</span>
            <div>
              <strong className="text-slate-800">Adjust Parameters</strong>
              <p className="text-sm text-slate-600">Use the Parameter Controls panel on the right to fine-tune the model's behavior.</p>
            </div>
          </li>
          <li className="flex gap-3">
            <span className="flex-shrink-0 w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-bold">4</span>
            <div>
              <strong className="text-slate-800">Monitor Performance</strong>
              <p className="text-sm text-slate-600">Track tokens per second and other metrics in the Statistics Dashboard.</p>
            </div>
          </li>
        </ol>
      </div>

      <div>
        <h4 className="font-semibold text-slate-800 mb-3">Effective Prompting Tips</h4>
        <ul className="space-y-2 text-sm text-slate-600">
          <li>• <strong>Be specific:</strong> Detailed prompts yield better results</li>
          <li>• <strong>Use examples:</strong> Show the format you want in your prompt</li>
          <li>• <strong>Set context:</strong> Explain the role or scenario clearly</li>
          <li>• <strong>Iterate:</strong> Refine your prompts based on responses</li>
        </ul>
      </div>

      <div>
        <h4 className="font-semibold text-slate-800 mb-3">Keyboard Shortcuts</h4>
        <div className="bg-slate-50 rounded-lg p-4 space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-slate-600">Open Help</span>
            <kbd className="px-2 py-1 bg-white border rounded font-mono text-xs">?</kbd>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-600">Send Message</span>
            <kbd className="px-2 py-1 bg-white border rounded font-mono text-xs">Enter</kbd>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-600">New Line</span>
            <kbd className="px-2 py-1 bg-white border rounded font-mono text-xs">Shift + Enter</kbd>
          </div>
        </div>
      </div>
    </div>
  );
}

function ParametersContent() {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-xl font-bold text-slate-800 mb-3">Understanding Parameters</h3>
        <p className="text-slate-600 leading-relaxed">
          Fine-tune the model's behavior by adjusting these parameters. Each affects how the model generates text.
        </p>
      </div>

      <div className="space-y-4">
        <div className="border-l-4 border-blue-500 pl-4">
          <h4 className="font-semibold text-slate-800 mb-2">Temperature (0.0 - 2.0)</h4>
          <p className="text-sm text-slate-600 mb-2">
            Controls randomness in generation. Lower values make output more focused and deterministic.
          </p>
          <div className="bg-slate-50 rounded p-3 text-sm space-y-1">
            <div><strong>0.1-0.5:</strong> Precise, factual responses (good for coding, math)</div>
            <div><strong>0.7-0.9:</strong> Balanced creativity and coherence (default)</div>
            <div><strong>1.0-2.0:</strong> Very creative, diverse outputs (good for stories)</div>
          </div>
        </div>

        <div className="border-l-4 border-green-500 pl-4">
          <h4 className="font-semibold text-slate-800 mb-2">Top P (0.0 - 1.0)</h4>
          <p className="text-sm text-slate-600 mb-2">
            Nucleus sampling. Considers tokens with cumulative probability up to P.
          </p>
          <div className="bg-slate-50 rounded p-3 text-sm">
            Lower values (0.5-0.8) = more focused, higher values (0.9-1.0) = more diverse
          </div>
        </div>

        <div className="border-l-4 border-purple-500 pl-4">
          <h4 className="font-semibold text-slate-800 mb-2">Top K (1 - 100)</h4>
          <p className="text-sm text-slate-600 mb-2">
            Limits selection to K most likely tokens at each step.
          </p>
          <div className="bg-slate-50 rounded p-3 text-sm">
            Lower K = more predictable, higher K = more variety. Typical: 40-50
          </div>
        </div>

        <div className="border-l-4 border-orange-500 pl-4">
          <h4 className="font-semibold text-slate-800 mb-2">Max Tokens (1 - 2048)</h4>
          <p className="text-sm text-slate-600 mb-2">
            Maximum length of generated response in tokens (~0.75 words per token).
          </p>
          <div className="bg-slate-50 rounded p-3 text-sm">
            512 tokens ≈ 384 words, 1024 tokens ≈ 768 words
          </div>
        </div>

        <div className="border-l-4 border-red-500 pl-4">
          <h4 className="font-semibold text-slate-800 mb-2">Repetition Penalty (1.0 - 2.0)</h4>
          <p className="text-sm text-slate-600 mb-2">
            Discourages repeating the same tokens. Higher = less repetition.
          </p>
          <div className="bg-slate-50 rounded p-3 text-sm">
            Use 1.1-1.3 for most cases. Too high can make output incoherent.
          </div>
        </div>

        <div className="border-l-4 border-teal-500 pl-4">
          <h4 className="font-semibold text-slate-800 mb-2">Frequency & Presence Penalties (-2.0 - 2.0)</h4>
          <p className="text-sm text-slate-600 mb-2">
            Frequency: Reduces likelihood based on token frequency already used<br/>
            Presence: Reduces likelihood if token appears at all
          </p>
          <div className="bg-slate-50 rounded p-3 text-sm">
            Positive values encourage diversity, negative encourages focus
          </div>
        </div>

        <div className="border-l-4 border-slate-500 pl-4">
          <h4 className="font-semibold text-slate-800 mb-2">Seed (Optional)</h4>
          <p className="text-sm text-slate-600 mb-2">
            Sets random seed for reproducible outputs. Same seed + prompt = same result.
          </p>
          <div className="bg-slate-50 rounded p-3 text-sm">
            Useful for testing and comparing parameter changes
          </div>
        </div>
      </div>

      <div className="bg-green-50 border border-green-200 rounded-lg p-4">
        <h4 className="font-semibold text-green-900 mb-2">Preset Recommendations</h4>
        <div className="space-y-2 text-sm text-green-800">
          <div><strong>Balanced:</strong> Temperature 0.7, Top-P 0.95 - Good for general chat</div>
          <div><strong>Creative:</strong> Temperature 1.0, Top-P 0.98 - Best for stories and brainstorming</div>
          <div><strong>Precise:</strong> Temperature 0.3, Top-P 0.9 - Ideal for coding and facts</div>
          <div><strong>Fast:</strong> Max Tokens 256 - Quick responses for simple queries</div>
        </div>
      </div>
    </div>
  );
}

function StatisticsContent() {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-xl font-bold text-slate-800 mb-3">Understanding Statistics</h3>
        <p className="text-slate-600 leading-relaxed">
          Monitor real-time performance metrics to understand your system's inference speed.
        </p>
      </div>

      <div className="space-y-4">
        <div className="bg-white border-2 border-slate-200 rounded-lg p-4">
          <h4 className="font-semibold text-slate-800 mb-2">Model Status</h4>
          <ul className="space-y-2 text-sm text-slate-600">
            <li><strong className="text-slate-800">Loading:</strong> Model is downloading and initializing</li>
            <li><strong className="text-slate-800">Ready:</strong> Model loaded, ready for inference</li>
            <li><strong className="text-slate-800">Generating:</strong> Currently processing your message</li>
          </ul>
        </div>

        <div className="bg-white border-2 border-blue-200 rounded-lg p-4">
          <h4 className="font-semibold text-slate-800 mb-2">Tokens per Second (tok/s)</h4>
          <p className="text-sm text-slate-600 mb-3">
            Measures generation speed. Higher is better. Depends on your GPU and model complexity.
          </p>
          <div className="bg-blue-50 rounded p-3 text-sm space-y-1">
            <div><strong>10-20 tok/s:</strong> Low-end GPU or CPU fallback</div>
            <div><strong>20-40 tok/s:</strong> Mid-range GPU</div>
            <div><strong>40-60+ tok/s:</strong> High-end GPU with WebGPU optimization</div>
          </div>
        </div>

        <div className="bg-white border-2 border-green-200 rounded-lg p-4">
          <h4 className="font-semibold text-slate-800 mb-2">Total Tokens</h4>
          <p className="text-sm text-slate-600">
            Counts all tokens generated in this session. One token ≈ 0.75 words on average.
          </p>
        </div>

        <div className="bg-white border-2 border-purple-200 rounded-lg p-4">
          <h4 className="font-semibold text-slate-800 mb-2">Generation Time</h4>
          <p className="text-sm text-slate-600">
            Shows how long the model took to generate each response. Measured in milliseconds.
          </p>
        </div>

        <div className="bg-white border-2 border-orange-200 rounded-lg p-4">
          <h4 className="font-semibold text-slate-800 mb-2">Session Stats</h4>
          <p className="text-sm text-slate-600 mb-2">
            Cumulative statistics across all messages in current session:
          </p>
          <ul className="space-y-1 text-sm text-slate-600">
            <li>• Total tokens generated</li>
            <li>• Total generation time</li>
            <li>• Average tokens per second</li>
          </ul>
        </div>
      </div>

      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
        <h4 className="font-semibold text-yellow-900 mb-2">Performance Tips</h4>
        <ul className="space-y-1 text-sm text-yellow-800">
          <li>• Close other GPU-intensive applications</li>
          <li>• Use a wired connection for initial model download</li>
          <li>• Lower max tokens for faster responses</li>
          <li>• Restart browser if performance degrades over time</li>
        </ul>
      </div>
    </div>
  );
}

function BenchmarkingContent() {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-xl font-bold text-slate-800 mb-3">Benchmarking Guide</h3>
        <p className="text-slate-600 leading-relaxed">
          Test your system's performance with structured benchmarks to understand inference capabilities.
        </p>
      </div>

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h4 className="font-semibold text-blue-900 mb-2">What is Benchmarking?</h4>
        <p className="text-sm text-blue-800">
          Benchmarking runs multiple inference iterations with the same prompt to measure consistent performance.
          It helps you understand your hardware's capabilities and compare different configurations.
        </p>
      </div>

      <div className="space-y-4">
        <div>
          <h4 className="font-semibold text-slate-800 mb-2">How to Run a Benchmark</h4>
          <ol className="space-y-2 text-sm text-slate-600">
            <li className="flex gap-2">
              <span className="font-bold text-slate-800">1.</span>
              <span>Enter a test prompt (e.g., "Explain quantum computing")</span>
            </li>
            <li className="flex gap-2">
              <span className="font-bold text-slate-800">2.</span>
              <span>Set number of iterations (5-10 recommended)</span>
            </li>
            <li className="flex gap-2">
              <span className="font-bold text-slate-800">3.</span>
              <span>Click "Run Benchmark" and wait for completion</span>
            </li>
            <li className="flex gap-2">
              <span className="font-bold text-slate-800">4.</span>
              <span>Review statistical results in the results table</span>
            </li>
          </ol>
        </div>

        <div className="bg-white border-2 border-slate-200 rounded-lg p-4">
          <h4 className="font-semibold text-slate-800 mb-3">Understanding Results</h4>
          <div className="space-y-3 text-sm">
            <div>
              <strong className="text-slate-800">Mean (Average):</strong>
              <p className="text-slate-600">Average tokens/sec across all runs. Best overall indicator.</p>
            </div>
            <div>
              <strong className="text-slate-800">Median:</strong>
              <p className="text-slate-600">Middle value. Less affected by outliers than mean.</p>
            </div>
            <div>
              <strong className="text-slate-800">Std Dev (Standard Deviation):</strong>
              <p className="text-slate-600">Measures consistency. Lower is more stable.</p>
            </div>
            <div>
              <strong className="text-slate-800">Min/Max:</strong>
              <p className="text-slate-600">Worst and best performance observed.</p>
            </div>
          </div>
        </div>

        <div>
          <h4 className="font-semibold text-slate-800 mb-2">Use Cases</h4>
          <ul className="space-y-2 text-sm text-slate-600">
            <li>• <strong>Hardware Testing:</strong> Compare performance across devices</li>
            <li>• <strong>Parameter Tuning:</strong> Find optimal settings for speed vs quality</li>
            <li>• <strong>Stability Checks:</strong> Verify consistent performance over time</li>
            <li>• <strong>Optimization:</strong> Identify performance bottlenecks</li>
          </ul>
        </div>

        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <h4 className="font-semibold text-green-900 mb-2">Best Practices</h4>
          <ul className="space-y-1 text-sm text-green-800">
            <li>• Run at least 5 iterations for reliable statistics</li>
            <li>• Use consistent prompts for comparisons</li>
            <li>• Close background apps during benchmarking</li>
            <li>• Let system warm up with 1-2 test runs first</li>
            <li>• Export results for later analysis</li>
          </ul>
        </div>
      </div>
    </div>
  );
}

function TroubleshootingContent() {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-xl font-bold text-slate-800 mb-3">Troubleshooting</h3>
        <p className="text-slate-600 leading-relaxed">
          Common issues and solutions to help you get the most out of the inference lab.
        </p>
      </div>

      <div className="space-y-4">
        <div className="bg-red-50 border-l-4 border-red-500 p-4">
          <h4 className="font-semibold text-red-900 mb-2">WebGPU Not Available</h4>
          <p className="text-sm text-red-800 mb-2">
            <strong>Symptoms:</strong> Model won't load, error about WebGPU support
          </p>
          <p className="text-sm text-red-800 mb-2"><strong>Solutions:</strong></p>
          <ul className="space-y-1 text-sm text-red-800 ml-4">
            <li>• Update to Chrome/Edge 113+ or latest Firefox</li>
            <li>• Enable WebGPU in browser flags (chrome://flags)</li>
            <li>• Update GPU drivers</li>
            <li>• Check if GPU supports WebGPU</li>
          </ul>
        </div>

        <div className="bg-orange-50 border-l-4 border-orange-500 p-4">
          <h4 className="font-semibold text-orange-900 mb-2">Slow Performance</h4>
          <p className="text-sm text-orange-800 mb-2">
            <strong>Symptoms:</strong> Low tokens/sec (&lt;10), long response times
          </p>
          <p className="text-sm text-orange-800 mb-2"><strong>Solutions:</strong></p>
          <ul className="space-y-1 text-sm text-orange-800 ml-4">
            <li>• Close other tabs and GPU apps</li>
            <li>• Reduce max tokens setting</li>
            <li>• Check GPU memory usage</li>
            <li>• Restart browser to clear memory</li>
            <li>• Disable browser extensions temporarily</li>
          </ul>
        </div>

        <div className="bg-yellow-50 border-l-4 border-yellow-500 p-4">
          <h4 className="font-semibold text-yellow-900 mb-2">Model Loading Fails</h4>
          <p className="text-sm text-yellow-800 mb-2">
            <strong>Symptoms:</strong> Loading stuck, download errors
          </p>
          <p className="text-sm text-yellow-800 mb-2"><strong>Solutions:</strong></p>
          <ul className="space-y-1 text-sm text-yellow-800 ml-4">
            <li>• Check internet connection stability</li>
            <li>• Clear browser cache and reload</li>
            <li>• Ensure sufficient disk space (~2GB)</li>
            <li>• Try different network (avoid VPN)</li>
            <li>• Wait and retry during off-peak hours</li>
          </ul>
        </div>

        <div className="bg-purple-50 border-l-4 border-purple-500 p-4">
          <h4 className="font-semibold text-purple-900 mb-2">Poor Output Quality</h4>
          <p className="text-sm text-purple-800 mb-2">
            <strong>Symptoms:</strong> Repetitive, nonsensical, or off-topic responses
          </p>
          <p className="text-sm text-purple-800 mb-2"><strong>Solutions:</strong></p>
          <ul className="space-y-1 text-sm text-purple-800 ml-4">
            <li>• Adjust temperature (try 0.7 for balanced results)</li>
            <li>• Increase repetition penalty to 1.1-1.3</li>
            <li>• Make prompts more specific and detailed</li>
            <li>• Try different preset configurations</li>
            <li>• Use system prompts to set context</li>
          </ul>
        </div>

        <div className="bg-blue-50 border-l-4 border-blue-500 p-4">
          <h4 className="font-semibold text-blue-900 mb-2">Browser Crashes</h4>
          <p className="text-sm text-blue-800 mb-2">
            <strong>Symptoms:</strong> Tab crashes, "Out of Memory" errors
          </p>
          <p className="text-sm text-blue-800 mb-2"><strong>Solutions:</strong></p>
          <ul className="space-y-1 text-blue-800 ml-4">
            <li>• Close unused tabs before loading model</li>
            <li>• Increase browser memory limit if possible</li>
            <li>• Use device with more RAM/GPU memory</li>
            <li>• Reduce max tokens to lower memory usage</li>
          </ul>
        </div>
      </div>

      <div className="bg-slate-100 border border-slate-300 rounded-lg p-4">
        <h4 className="font-semibold text-slate-800 mb-2">Still Having Issues?</h4>
        <p className="text-sm text-slate-600 mb-3">
          If problems persist after trying these solutions:
        </p>
        <ul className="space-y-1 text-sm text-slate-600">
          <li>• Check browser console for error messages (F12)</li>
          <li>• Try a different browser (Chrome recommended)</li>
          <li>• Test on a different device to isolate hardware issues</li>
          <li>• Review system requirements in Getting Started tab</li>
        </ul>
      </div>
    </div>
  );
}
