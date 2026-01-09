# Gemma-2 Web Inference Lab

A high-performance web application for running Gemma-2-2B language model inference directly in your browser using WebGPU acceleration.

## Features

### Core Inference
- **Local Execution**: Runs entirely in your browser using WebLLM
- **WebGPU Acceleration**: 5-10x faster than CPU inference
- **Streaming Output**: Token-by-token streaming for responsive feel
- **Full Parameter Control**: Temperature, top-p, top-k, penalties, and more

### Advanced Controls
- **Presets**: Quick settings for Balanced, Creative, Precise, and Fast modes
- **System Prompts**: Customize the assistant's behavior
- **Stop Sequences**: Configure custom stopping conditions
- **Reproducible**: Optional seed for deterministic outputs

### Benchmarking Suite
- **Performance Testing**: Run multiple inference iterations
- **Statistical Analysis**: Mean, median, std dev, min/max tokens/sec
- **Custom Prompts**: Test with your own prompts
- **Export Results**: Save benchmark data as JSON

### Real-Time Statistics
- **Live Metrics**: Tokens/sec, total tokens, generation time
- **Session Tracking**: Cumulative stats across conversation
- **Per-Message Stats**: Individual timing for each response
- **Model Status**: Loading progress and readiness indicator

### Data Management
- **Export Sessions**: Download full conversation history
- **JSON Format**: Human-readable export format
- **Benchmark Results**: Include performance data in exports

## Technology Stack

- **WebLLM**: ML inference engine with WebGPU support
- **React 18**: Modern UI framework with hooks
- **TypeScript**: Type-safe development
- **Zustand**: Lightweight state management (optimized for performance)
- **Vite**: Fast build tool with optimized code splitting
- **Tailwind CSS**: Utility-first styling

## Performance

See [PERFORMANCE.md](./PERFORMANCE.md) for detailed optimization report.

**Quick Stats**:
- Token generation: 20-60 tok/s (hardware dependent)
- First token latency: 100-300ms
- Bundle size: ~2 MB gzipped
- Memory usage: ~500 MB browser, ~2-3 GB GPU

## Requirements

- **Modern Browser**: Chrome/Edge 113+, Firefox with WebGPU enabled
- **WebGPU Support**: Required for GPU acceleration
- **GPU Memory**: 4+ GB recommended
- **Internet**: Initial download (~2 MB), then fully offline

## Usage

1. **Wait for Model Load**: The app automatically downloads and initializes Gemma-2
2. **Start Chatting**: Type your message and press Enter
3. **Adjust Parameters**: Use the right panel to tune inference settings
4. **Run Benchmarks**: Test performance with various prompts
5. **Export Data**: Download your session for analysis

## Project Structure

```
src/
├── components/       # React UI components
├── hooks/           # useWebLLM inference hook
├── store/           # Zustand state management
├── types.ts         # TypeScript interfaces
└── constants.ts     # Default configurations
```

## Development

```bash
npm install
npm run dev
```

## Build

```bash
npm run build
npm run preview
```

## License

MIT
