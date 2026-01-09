# Gemma-2 Inference Lab - Complete User Guide

## Table of Contents

1. [Introduction](#introduction)
2. [Getting Started](#getting-started)
3. [System Requirements](#system-requirements)
4. [Understanding Parameters](#understanding-parameters)
5. [Reading Statistics](#reading-statistics)
6. [Running Benchmarks](#running-benchmarks)
7. [Prompt Engineering](#prompt-engineering)
8. [Troubleshooting](#troubleshooting)
9. [Performance Optimization](#performance-optimization)
10. [FAQ](#faq)

---

## Introduction

Gemma-2 Inference Lab is a browser-based application that runs the Gemma-2-2B language model locally on your device using WebGPU acceleration. All processing happens on your machine—no data is sent to external servers.

### Key Features

- **Local Execution**: Complete privacy, everything runs in your browser
- **WebGPU Acceleration**: Hardware-accelerated inference (5-10x faster than CPU)
- **Real-Time Streaming**: Token-by-token output for responsive interaction
- **Full Parameter Control**: Fine-tune every aspect of model behavior
- **Benchmarking Suite**: Measure and optimize performance
- **Session Export**: Save conversations and benchmark results

---

## Getting Started

### First Launch

1. **Open the Application**: Navigate to the app in your browser
2. **Wait for Model Loading**: The first launch downloads ~2GB of model data
   - Progress is shown in the Statistics panel
   - Download is cached for offline use
   - Typically takes 2-10 minutes depending on connection speed
3. **Start Chatting**: Once "Ready" appears, type your first message

### Quick Start Tour

On your first visit, an interactive tour guides you through:
- Chat interface
- Statistics dashboard
- Parameter controls
- Benchmarking tools

You can restart the tour anytime from Help → Restart Tour.

### Keyboard Shortcuts

| Shortcut | Action |
|----------|--------|
| `?` | Open Help |
| `Enter` | Send message |
| `Shift + Enter` | New line in message |

---

## System Requirements

### Minimum Requirements

- **Browser**: Chrome 113+, Edge 113+, or Firefox with WebGPU enabled
- **GPU**: Any GPU with WebGPU support
- **RAM**: 4GB system memory
- **GPU Memory**: 2GB VRAM minimum
- **Storage**: 3GB free space (for model cache)

### Recommended Configuration

- **Browser**: Latest Chrome or Edge
- **GPU**: Modern dedicated GPU (NVIDIA, AMD, or Apple Silicon)
- **RAM**: 8GB+ system memory
- **GPU Memory**: 4GB+ VRAM
- **Connection**: Stable internet for initial download

### Checking WebGPU Support

1. Visit `chrome://gpu` (or equivalent in your browser)
2. Look for "WebGPU" in the feature status list
3. It should show "Hardware accelerated" or "Enabled"

### Enabling WebGPU (if needed)

**Chrome/Edge:**
1. Navigate to `chrome://flags`
2. Search for "WebGPU"
3. Enable "Unsafe WebGPU" (temporary, until stable)
4. Restart browser

**Firefox:**
1. Navigate to `about:config`
2. Search for `dom.webgpu.enabled`
3. Set to `true`
4. Restart browser

---

## Understanding Parameters

Parameters control how the model generates text. Adjusting these lets you balance creativity, coherence, speed, and style.

### Temperature (0.0 - 2.0)

**What it does**: Controls randomness in token selection.

**How it works**:
- Low values make the model deterministic and focused
- High values increase diversity and creativity
- At 0.0, the model always picks the most likely token

**When to use**:
- **0.1 - 0.4**: Coding, math, factual Q&A
- **0.5 - 0.8**: General conversation, explanations
- **0.9 - 1.2**: Creative writing, brainstorming
- **1.3 - 2.0**: Experimental, very creative outputs

**Example**:
```
Prompt: "Write about a sunset"

Temperature 0.3: "The sun set over the horizon, creating orange
and pink hues in the sky."

Temperature 1.2: "Crimson flames danced across the twilight canvas,
painting dreams in amber whispers."
```

### Top P (0.0 - 1.0)

**What it does**: Nucleus sampling - considers only tokens whose cumulative probability reaches P.

**How it works**:
- The model ranks all possible next tokens by probability
- Selects from the smallest set of tokens whose probabilities sum to P
- Filters out unlikely tokens

**When to use**:
- **0.5 - 0.7**: Very focused, deterministic outputs
- **0.8 - 0.92**: Balanced (recommended starting point)
- **0.93 - 0.98**: More diverse, creative outputs
- **0.99 - 1.0**: Maximum diversity

**Tip**: Lower Top-P when you want consistency, raise it for variety.

### Top K (1 - 100)

**What it does**: Limits token selection to the K most likely candidates.

**How it works**:
- At each step, only consider the top K probable tokens
- Prevents selection of very unlikely tokens
- Works together with Top-P

**When to use**:
- **10 - 30**: Very focused, predictable
- **40 - 60**: Balanced (typical range)
- **70 - 100**: More exploration

**Tip**: Top-K of 50 with Top-P of 0.95 is a good baseline.

### Max Tokens (64 - 2048)

**What it does**: Sets the maximum length of the response.

**How it works**:
- 1 token ≈ 0.75 words on average
- Model stops generating after reaching this limit
- Actual response may be shorter if model decides to stop

**When to use**:
- **64 - 256**: Quick answers, chat responses
- **256 - 512**: Paragraphs, explanations
- **512 - 1024**: Long-form content, detailed answers
- **1024 - 2048**: Essays, articles

**Tip**: Lower max tokens = faster responses. Set to what you need.

### Repetition Penalty (1.0 - 2.0)

**What it does**: Discourages the model from repeating the same tokens.

**How it works**:
- Values > 1.0 reduce probability of already-used tokens
- Higher values = stronger penalty against repetition
- Applied to all previously generated tokens

**When to use**:
- **1.0**: No penalty (may cause repetition)
- **1.1 - 1.2**: Gentle reduction of repetition (recommended)
- **1.3 - 1.5**: Stronger variety, less likely to repeat phrases
- **1.6+**: Very strong penalty (may reduce coherence)

**Warning**: Too high can make outputs incoherent as the model avoids natural repetitions.

### Frequency Penalty (0.0 - 2.0)

**What it does**: Reduces probability based on how many times a token has appeared.

**How it works**:
- Proportional to frequency of use
- Encourages using different words
- Each occurrence increases the penalty

**When to use**:
- **0.0**: No penalty
- **0.1 - 0.5**: Subtle vocabulary diversity
- **0.6 - 1.0**: Noticeable effect on word choice
- **1.0+**: Strong push for variety

### Presence Penalty (0.0 - 2.0)

**What it does**: Reduces probability if a token has appeared at all (regardless of frequency).

**How it works**:
- Binary: either the token appeared or it didn't
- Encourages new topics and concepts
- Doesn't scale with frequency

**When to use**:
- **0.0**: No penalty
- **0.1 - 0.5**: Gentle topic diversity
- **0.6 - 1.0**: Encourages exploring new angles
- **1.0+**: Strong push to avoid any repetition

### Seed (Optional)

**What it does**: Sets a random seed for reproducible outputs.

**How it works**:
- Same seed + same prompt + same parameters = same output
- Useful for testing and debugging
- Leave empty for random behavior

**When to use**:
- Testing parameter changes
- Reproducible benchmarks
- Debugging issues
- Demonstrating consistent behavior

---

## Reading Statistics

The Statistics Dashboard shows real-time performance metrics.

### Model Status

- **Green dot - Ready**: Model loaded and ready for inference
- **Yellow dot - Loading X%**: Model downloading/initializing
- **Red dot - Not loaded**: Model failed to load or not started

### Messages

Total count of messages exchanged in this session (user + assistant).

### Total Tokens

Cumulative count of all tokens generated by the model.
- 1 token ≈ 0.75 words
- 1000 tokens ≈ 750 words
- Useful for tracking session complexity

### Average Speed (tok/s)

Mean generation speed across all messages in tokens per second.

**Performance Ranges**:
- **10-20 tok/s**: Low-end GPU or CPU fallback
- **20-40 tok/s**: Mid-range GPU (typical laptop)
- **40-60 tok/s**: High-end GPU (desktop/workstation)
- **60+ tok/s**: Excellent GPU with optimal conditions

**Factors affecting speed**:
- GPU capability and memory
- Max tokens setting (longer responses = more time)
- Parameter complexity
- Browser overhead
- Background applications

### Total Time

Cumulative time spent generating responses.
- Measured in seconds
- Includes all messages in session
- Useful for understanding overall workload

---

## Running Benchmarks

Benchmarks measure your system's inference performance with statistical rigor.

### Purpose

- Understand your hardware's capabilities
- Compare different parameter configurations
- Track performance over time
- Identify optimization opportunities
- Verify consistent performance

### Running a Benchmark

1. **Select Test Prompts**: Check one or more prompts to test
2. **Set Iterations**: Choose how many times to run each prompt (5-10 recommended)
3. **Click "Run Benchmark"**: Wait for all iterations to complete
4. **Review Results**: Examine statistical summary

### Understanding Results

#### Mean (Average)

- Average tokens/sec across all runs
- Best single indicator of overall performance
- Use this to compare configurations

#### Median

- Middle value when results are sorted
- Less affected by outliers than mean
- Good indicator of typical performance

#### Standard Deviation (Std Dev)

- Measures consistency/stability
- Lower = more predictable performance
- Higher = more variation between runs

**What it means**:
- **< 2.0**: Very stable performance
- **2.0 - 5.0**: Normal variance
- **> 5.0**: High variability (investigate causes)

#### Range (Min - Max)

- Worst and best performance observed
- Wide range suggests inconsistent conditions
- Useful for identifying edge cases

### Benchmark Best Practices

1. **Run 5+ iterations**: Fewer runs = less reliable statistics
2. **Close background apps**: Reduce GPU/CPU competition
3. **Use consistent prompts**: Compare apples to apples
4. **Let system warm up**: First run is often slower
5. **Test one variable at a time**: Isolate parameter effects
6. **Export results**: Save data for long-term tracking

### Example Benchmark Workflow

**Goal**: Find optimal temperature for speed vs quality

1. Set temperature to 0.3, run 5 iterations
2. Note mean tok/s and sample quality
3. Increase temperature to 0.7, run 5 iterations
4. Compare results
5. Adjust based on findings

---

## Prompt Engineering

Effective prompts yield better responses. Here are techniques to improve your results.

### Basic Principles

1. **Be Specific**: Vague prompts get vague answers
2. **Provide Context**: Explain the scenario or role
3. **Use Examples**: Show the format you want
4. **Iterate**: Refine based on responses

### Techniques

#### Role Assignment

```
Good: "You are an expert Python developer. Explain list comprehensions."
Bad: "Explain list comprehensions"
```

#### Few-Shot Learning

```
Good: "Translate to French:
English: Hello → French: Bonjour
English: Goodbye → French: Au revoir
English: Thank you →"

Bad: "Translate 'Thank you' to French"
```

#### Output Formatting

```
Good: "List 5 benefits of exercise in this format:
1. [Benefit]: [Explanation]"

Bad: "Tell me about exercise benefits"
```

#### Chain of Thought

```
Good: "Solve this step by step:
If a train travels 60 mph for 2 hours, how far does it go?
Step 1: Identify the formula
Step 2: Plug in values
Step 3: Calculate"

Bad: "How far does a 60 mph train go in 2 hours?"
```

### Task-Specific Tips

#### Code Generation

- Specify language and version
- Describe expected inputs/outputs
- Mention any constraints
- Use temperature 0.3-0.5

#### Creative Writing

- Set the scene/genre
- Define character traits
- Specify tone and style
- Use temperature 0.9-1.2

#### Data Analysis

- Provide clear data format
- State the question clearly
- Specify output format
- Use temperature 0.4-0.7

#### Summarization

- State desired length
- Mention key points to include
- Specify audience level
- Use temperature 0.5-0.8

---

## Troubleshooting

### Model Won't Load

**Symptoms**: Stuck at loading, error messages, timeout

**Solutions**:
1. Check internet connection stability
2. Ensure sufficient disk space (~3GB)
3. Clear browser cache and reload
4. Try incognito/private mode
5. Disable browser extensions
6. Check browser console for errors (F12)

**Still not working?**
- Try a different browser
- Check if WebGPU is enabled
- Verify GPU drivers are up to date

### Slow Performance

**Symptoms**: Low tok/s (<10), long wait times

**Solutions**:
1. Close other GPU-intensive applications
2. Reduce max tokens setting
3. Lower temperature and Top-P
4. Close unnecessary browser tabs
5. Restart browser to clear memory
6. Check GPU usage in Task Manager

**Hardware limitations?**
- Integrated GPUs will be slower than dedicated
- Older GPUs may not have optimal WebGPU support
- CPU fallback is very slow (not recommended)

### Browser Crashes

**Symptoms**: Tab crashes, "Out of Memory" errors

**Solutions**:
1. Close all other tabs before loading model
2. Increase browser memory limit (if possible)
3. Use a 64-bit browser version
4. Reduce max tokens to lower memory usage
5. Try on a device with more RAM

**Prevention**:
- Don't open multiple instances
- Export and clear sessions regularly
- Restart browser between long sessions

### Poor Output Quality

**Symptoms**: Repetitive, nonsensical, or off-topic responses

**Solutions**:
1. Adjust temperature (try 0.7 for balanced output)
2. Increase repetition penalty (1.1-1.3)
3. Make prompts more specific and detailed
4. Use system prompts to set behavior
5. Try different preset configurations
6. Rephrase your questions

**Check parameters**:
- Temperature too high = incoherent
- Temperature too low = boring/repetitive
- Penalties too high = awkward phrasing

### WebGPU Not Available

**Symptoms**: "WebGPU not supported" error

**Solutions**:
1. Update to latest browser version
2. Enable WebGPU in browser flags
3. Update GPU drivers
4. Check if GPU supports WebGPU
5. Try a different browser (Chrome recommended)

**Checking compatibility**:
- Visit [WebGPU Report](https://webgpureport.org/)
- Check `chrome://gpu` for WebGPU status

### Generation Stops Unexpectedly

**Symptoms**: Responses cut off mid-sentence

**Possible causes**:
1. Reached max tokens limit (increase it)
2. Model generated stop sequence
3. Browser performance throttling
4. Memory pressure

**Solutions**:
- Increase max tokens
- Check if output looks complete
- Close background apps
- Restart browser

---

## Performance Optimization

### For Speed

1. **Reduce max tokens**: Lower = faster responses
2. **Lower temperature**: Less computation per token
3. **Smaller Top-K**: Faster sampling
4. **Close background apps**: Free up GPU resources
5. **Use dedicated GPU**: Much faster than integrated
6. **Wired connection**: For initial model download

### For Quality

1. **Increase temperature**: More creative outputs (0.7-0.9)
2. **Use repetition penalty**: Avoid boring repetition (1.1-1.3)
3. **Craft better prompts**: Garbage in, garbage out
4. **Use examples**: Show the format you want
5. **Iterate**: Refine prompts based on results

### For Consistency

1. **Use seed parameter**: Reproducible outputs
2. **Lower temperature**: More deterministic (0.3-0.5)
3. **Lower Top-P**: Less randomness (0.8-0.9)
4. **Keep browser stable**: Avoid switching tabs during generation

### For Memory Efficiency

1. **Clear sessions regularly**: Export then clear
2. **Lower max tokens**: Reduce memory footprint
3. **Restart browser**: Clear accumulated memory
4. **Close other tabs**: Reduce browser overhead

---

## FAQ

### General Questions

**Q: Is my data sent to external servers?**
A: No. All processing happens locally in your browser. No data leaves your device.

**Q: Why is the initial load so slow?**
A: The model is ~2GB and must be downloaded on first use. After that, it's cached.

**Q: Can I use this offline?**
A: Yes, after the initial download. The model is cached in your browser.

**Q: Does this work on mobile?**
A: WebGPU support on mobile is limited. Desktop browsers work best.

**Q: What languages does the model support?**
A: Gemma-2 primarily supports English but has some multilingual capability.

### Performance Questions

**Q: Why is my performance slower than advertised?**
A: Performance depends heavily on your GPU. Check system requirements and close background apps.

**Q: What's a good tokens/sec rate?**
A: 20-40 tok/s is typical for mid-range hardware. 40+ is excellent.

**Q: Does temperature affect speed?**
A: Slightly. Higher temperature requires more computation but the effect is minor.

**Q: Will performance improve over time?**
A: WebGPU and browser optimizations are continually improving.

### Parameter Questions

**Q: What's the best temperature setting?**
A: Depends on your task. 0.7 is a good starting point for most uses.

**Q: Should I adjust Top-P and Top-K together?**
A: Yes, they work together. Start with Top-P 0.95 and Top-K 50.

**Q: Why does the model repeat itself?**
A: Increase repetition penalty to 1.1-1.3.

**Q: What's the difference between frequency and presence penalties?**
A: Frequency scales with usage count; presence is binary (used or not).

### Technical Questions

**Q: Which browsers are supported?**
A: Chrome and Edge 113+ have the best support. Firefox requires manual WebGPU enabling.

**Q: How much GPU memory do I need?**
A: 2GB minimum, 4GB+ recommended.

**Q: Can I use multiple models?**
A: This version includes only Gemma-2-2B.

**Q: Can I fine-tune the model?**
A: No, this is inference-only. The model is pre-trained and frozen.

**Q: Where is the model cache stored?**
A: In your browser's IndexedDB storage, managed automatically.

**Q: Can I clear the cache to free space?**
A: Yes, via browser settings, but you'll need to re-download the model.

### Troubleshooting Questions

**Q: The model won't load. What should I do?**
A: See the [Troubleshooting](#troubleshooting) section for detailed steps.

**Q: I get WebGPU errors. Help?**
A: Update your browser and GPU drivers. Enable WebGPU in flags if needed.

**Q: Browser crashes when loading model. Why?**
A: Likely insufficient RAM or GPU memory. Close other tabs and apps.

**Q: Output quality is poor. How do I fix it?**
A: Adjust parameters (try temperature 0.7, repetition penalty 1.2) and improve prompts.

---

## Additional Resources

- **In-App Help**: Press `?` to open the help modal
- **Quick Tips**: Shown in sidebar for contextual guidance
- **Interactive Tour**: Restart from Help menu
- **WebGPU Info**: [webgpureport.org](https://webgpureport.org/)
- **Model Details**: [Gemma-2 on Hugging Face](https://huggingface.co/google/gemma-2-2b)

---

## Getting Help

If you encounter issues not covered in this guide:

1. Check the browser console for errors (F12)
2. Verify system requirements are met
3. Try the troubleshooting steps
4. Test in a different browser
5. Check WebGPU compatibility

**Remember**: Performance varies by hardware. Lower-end GPUs will have slower inference speeds, but the application should still function correctly.

---

*Last updated: 2026-01-08*
