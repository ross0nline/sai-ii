import { useState, useEffect, useCallback } from 'react';
import { GripVertical } from 'lucide-react';
import { useLayoutStore } from '../store/layoutStore';

export function ResizableDivider() {
  const [isDragging, setIsDragging] = useState(false);
  const { setSidebarWidth, minSidebarWidth, maxSidebarWidth, resetSidebarWidth } = useLayoutStore();

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDoubleClick = useCallback(() => {
    resetSidebarWidth();
  }, [resetSidebarWidth]);

  useEffect(() => {
    if (!isDragging) return;

    const handleMouseMove = (e: MouseEvent) => {
      const container = document.querySelector('[data-layout-container]');
      if (!container) return;

      const containerRect = container.getBoundingClientRect();
      const newWidth = containerRect.right - e.clientX;

      const minChatWidth = 400;
      const maxAllowedSidebarWidth = Math.min(
        maxSidebarWidth,
        containerRect.width - minChatWidth
      );

      const clampedWidth = Math.max(
        minSidebarWidth,
        Math.min(maxAllowedSidebarWidth, newWidth)
      );

      setSidebarWidth(clampedWidth);
    };

    const handleMouseUp = () => {
      setIsDragging(false);
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
    document.body.style.cursor = 'col-resize';
    document.body.style.userSelect = 'none';

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
      document.body.style.cursor = '';
      document.body.style.userSelect = '';
    };
  }, [isDragging, setSidebarWidth, minSidebarWidth, maxSidebarWidth]);

  return (
    <div
      className={`relative flex items-center justify-center w-4 cursor-col-resize group transition-colors ${
        isDragging ? 'bg-blue-200 dark:bg-blue-800' : 'hover:bg-slate-200 dark:hover:bg-slate-700'
      }`}
      onMouseDown={handleMouseDown}
      onDoubleClick={handleDoubleClick}
      title="Drag to resize | Double-click to reset"
    >
      <div
        className={`absolute inset-y-0 left-1/2 -translate-x-1/2 w-1 transition-all ${
          isDragging
            ? 'bg-blue-500 dark:bg-blue-400'
            : 'bg-slate-300 dark:bg-slate-600 group-hover:bg-slate-400 dark:group-hover:bg-slate-500'
        }`}
      />
      <GripVertical
        className={`relative z-10 transition-colors ${
          isDragging
            ? 'text-blue-600 dark:text-blue-300'
            : 'text-slate-400 dark:text-slate-500 group-hover:text-slate-600 dark:group-hover:text-slate-400'
        }`}
        size={16}
      />
    </div>
  );
}
