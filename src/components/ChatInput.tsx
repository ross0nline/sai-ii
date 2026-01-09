import { useState, useRef, useEffect } from 'react';
import { Send, Square, Paperclip, X, FileText, Image as ImageIcon } from 'lucide-react';

interface ChatInputProps {
  onSend: (message: string) => void;
  disabled: boolean;
  isGenerating: boolean;
  onStop?: () => void;
}

interface AttachedFile {
  name: string;
  type: string;
  content: string;
  size: number;
}

export function ChatInput({ onSend, disabled, isGenerating, onStop }: ChatInputProps) {
  const [input, setInput] = useState('');
  const [attachedFiles, setAttachedFiles] = useState<AttachedFile[]>([]);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = textareaRef.current.scrollHeight + 'px';
    }
  }, [input]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if ((input.trim() || attachedFiles.length > 0) && !disabled) {
      let messageContent = input.trim();

      if (attachedFiles.length > 0) {
        const filesContext = attachedFiles.map(file => {
          if (file.type.startsWith('image/')) {
            return `[Image: ${file.name}]\n`;
          } else {
            return `[File: ${file.name}]\nContent:\n${file.content}\n`;
          }
        }).join('\n');

        messageContent = filesContext + (messageContent ? '\n\n' + messageContent : '');
      }

      onSend(messageContent);
      setInput('');
      setAttachedFiles([]);
    }
  };

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const newAttachedFiles: AttachedFile[] = [];

    for (let i = 0; i < Math.min(files.length, 5); i++) {
      const file = files[i];

      if (file.size > 5 * 1024 * 1024) {
        alert(`File ${file.name} is too large. Maximum size is 5MB.`);
        continue;
      }

      try {
        const content = await readFileContent(file);
        newAttachedFiles.push({
          name: file.name,
          type: file.type,
          content,
          size: file.size,
        });
      } catch (error) {
        console.error(`Error reading file ${file.name}:`, error);
        alert(`Failed to read file: ${file.name}`);
      }
    }

    setAttachedFiles(prev => [...prev, ...newAttachedFiles]);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const readFileContent = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();

      reader.onload = () => {
        if (file.type.startsWith('image/')) {
          resolve(reader.result as string);
        } else {
          resolve(reader.result as string);
        }
      };

      reader.onerror = () => reject(reader.error);

      if (file.type.startsWith('image/')) {
        reader.readAsDataURL(file);
      } else {
        reader.readAsText(file);
      }
    });
  };

  const removeFile = (index: number) => {
    setAttachedFiles(prev => prev.filter((_, i) => i !== index));
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  return (
    <form id="chat-input" onSubmit={handleSubmit} className="p-6 bg-gradient-to-t from-white via-white to-transparent dark:from-slate-900 dark:via-slate-900">
      <div className="max-w-4xl mx-auto">
        {attachedFiles.length > 0 && (
          <div className="mb-2 flex flex-wrap gap-2">
            {attachedFiles.map((file, index) => (
              <div
                key={index}
                className="flex items-center gap-2 px-3 py-2 bg-blue-50 dark:bg-blue-900/30 border border-blue-200 dark:border-blue-700 rounded-lg text-sm"
              >
                {file.type.startsWith('image/') ? (
                  <ImageIcon className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                ) : (
                  <FileText className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                )}
                <span className="text-blue-900 dark:text-blue-100 font-medium truncate max-w-[150px]">
                  {file.name}
                </span>
                <span className="text-blue-600 dark:text-blue-400 text-xs">
                  {(file.size / 1024).toFixed(1)}KB
                </span>
                <button
                  type="button"
                  onClick={() => removeFile(index)}
                  className="ml-1 p-0.5 hover:bg-blue-100 dark:hover:bg-blue-800 rounded transition-colors"
                >
                  <X className="w-3 h-3 text-blue-600 dark:text-blue-400" />
                </button>
              </div>
            ))}
          </div>
        )}

        <div className="flex gap-3 items-end bg-white dark:bg-slate-800 rounded-3xl shadow-xl border border-slate-200 dark:border-slate-700 p-2 backdrop-blur-sm">
          <input
            ref={fileInputRef}
            type="file"
            accept="text/*,image/*,.txt,.md,.json,.xml,.csv"
            multiple
            onChange={handleFileSelect}
            className="hidden"
          />
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="flex-shrink-0 p-2.5 rounded-2xl hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed ml-1"
            disabled={disabled || attachedFiles.length >= 5}
            title={attachedFiles.length >= 5 ? "Maximum 5 files" : "Attach file (text or image, max 5MB)"}
          >
            <Paperclip className="w-5 h-5 text-slate-500 dark:text-slate-400" />
          </button>

        <textarea
          ref={textareaRef}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={disabled ? 'Loading model...' : 'Message Assistant...'}
          disabled={disabled}
          rows={1}
          className="flex-1 resize-none bg-transparent px-2 py-3 text-[15px] focus:outline-none disabled:text-slate-400 dark:disabled:text-slate-500 max-h-40 overflow-y-auto text-slate-900 dark:text-slate-100 placeholder:text-slate-500 dark:placeholder:text-slate-400"
        />

        {input.trim() && (
          <div className="text-xs text-slate-400 dark:text-slate-500 px-2 pb-3">
            {input.length}
          </div>
        )}

        {isGenerating && onStop ? (
          <button
            type="button"
            onClick={onStop}
            className="flex-shrink-0 bg-gradient-to-br from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white p-3 rounded-2xl transition-all duration-200 shadow-lg hover:shadow-xl hover:scale-105 mr-1"
            title="Stop generation"
          >
            <Square className="w-5 h-5" />
          </button>
        ) : (
          <button
            type="submit"
            disabled={disabled || (!input.trim() && attachedFiles.length === 0)}
            className="flex-shrink-0 bg-gradient-to-br from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 disabled:from-slate-300 disabled:to-slate-300 dark:disabled:from-slate-700 dark:disabled:to-slate-700 disabled:cursor-not-allowed text-white p-3 rounded-2xl transition-all duration-200 shadow-lg hover:shadow-xl disabled:shadow-none hover:scale-105 disabled:scale-100 mr-1"
            title="Send message"
          >
            <Send className="w-5 h-5" />
          </button>
        )}
        </div>
      </div>

      <div className="text-xs text-center text-slate-500 dark:text-slate-400 mt-3">
        Press Enter to send, Shift+Enter for new line
      </div>
    </form>
  );
}
