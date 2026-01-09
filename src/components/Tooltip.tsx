import { useState, useRef, useEffect } from 'react';
import { Info } from 'lucide-react';

interface TooltipProps {
  content: string;
  children?: React.ReactNode;
  icon?: boolean;
}

export function Tooltip({ content, children, icon = true }: TooltipProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [position, setPosition] = useState<'top' | 'bottom'>('top');
  const tooltipRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isVisible && triggerRef.current) {
      const rect = triggerRef.current.getBoundingClientRect();
      const spaceAbove = rect.top;
      const spaceBelow = window.innerHeight - rect.bottom;
      setPosition(spaceBelow < 100 && spaceAbove > spaceBelow ? 'bottom' : 'top');
    }
  }, [isVisible]);

  return (
    <div className="relative inline-block">
      <div
        ref={triggerRef}
        onMouseEnter={() => setIsVisible(true)}
        onMouseLeave={() => setIsVisible(false)}
        onFocus={() => setIsVisible(true)}
        onBlur={() => setIsVisible(false)}
        className="inline-flex items-center cursor-help"
        tabIndex={0}
        role="button"
        aria-label="Show help"
      >
        {children || (icon && <Info className="w-4 h-4 text-slate-400 hover:text-slate-600" />)}
      </div>

      {isVisible && (
        <div
          ref={tooltipRef}
          className={`absolute z-50 px-4 py-3 text-sm text-white bg-slate-900 dark:bg-slate-800 rounded-xl shadow-2xl max-w-xl whitespace-normal leading-relaxed border border-slate-700 ${
            position === 'top' ? 'bottom-full mb-2' : 'top-full mt-2'
          } left-1/2 transform -translate-x-1/2`}
          role="tooltip"
        >
          <div className="font-medium">{content}</div>
          <div
            className={`absolute left-1/2 transform -translate-x-1/2 w-2 h-2 bg-slate-900 dark:bg-slate-800 rotate-45 border-l border-t border-slate-700 ${
              position === 'top' ? 'top-full -mt-1.5' : 'bottom-full -mb-1.5'
            }`}
          />
        </div>
      )}
    </div>
  );
}
