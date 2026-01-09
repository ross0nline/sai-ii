import { useState, useRef, useEffect } from 'react';
import { ChevronDown, Download, CheckCircle2, Circle, Loader2, AlertCircle } from 'lucide-react';
import { useModelStore } from '../store/modelStore';
import { AVAILABLE_MODELS, MODEL_CATEGORIES, getModelById } from '../models';
import type { ModelStatus } from '../types';

interface ModelSelectorProps {
  modelStatus: ModelStatus;
}

export function ModelSelector({ modelStatus }: ModelSelectorProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const dropdownRef = useRef<HTMLDivElement>(null);

  const { selectedModelId, requestModelSwitch, setShouldLoadModel } = useModelStore();

  const currentModel = getModelById(selectedModelId);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [isOpen]);

  const getStatusIcon = () => {
    if (modelStatus.error) {
      return <AlertCircle className="w-4 h-4 text-red-500" />;
    }
    if (modelStatus.isLoading) {
      return <Loader2 className="w-4 h-4 text-amber-500 animate-spin" />;
    }
    if (modelStatus.isReady) {
      return <CheckCircle2 className="w-4 h-4 text-green-500" />;
    }
    return <Circle className="w-4 h-4 text-slate-400" />;
  };

  const getStatusText = () => {
    if (modelStatus.error) return 'Error';
    if (modelStatus.isLoading) {
      const percent = Math.round(modelStatus.progress * 100);
      return `Loading ${percent}%`;
    }
    if (modelStatus.isReady) return 'Ready';
    return 'Not Loaded';
  };

  const filteredModels = AVAILABLE_MODELS.filter((model) => {
    const matchesSearch =
      model.displayName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      model.id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || model.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const handleModelSelect = (modelId: string) => {
    if (modelId === selectedModelId) {
      setIsOpen(false);
      return;
    }

    if (modelStatus.isReady || modelStatus.isLoading) {
      requestModelSwitch(modelId);
    } else {
      useModelStore.getState().setSelectedModelId(modelId);
      setShouldLoadModel(true);
    }
    setIsOpen(false);
    setSearchTerm('');
  };

  const handleLoadCurrentModel = () => {
    setShouldLoadModel(true);
    setIsOpen(false);
  };

  const getButtonStyle = () => {
    if (!modelStatus.isReady && !modelStatus.isLoading && !modelStatus.error) {
      return "flex items-center gap-3 px-4 py-2 bg-gradient-to-br from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white rounded-lg transition-all shadow-lg hover:shadow-xl";
    }
    return "flex items-center gap-3 px-4 py-2 bg-white rounded-lg border border-slate-200 hover:border-slate-300 transition-colors shadow-sm";
  };

  const isNotLoaded = !modelStatus.isReady && !modelStatus.isLoading && !modelStatus.error;

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={getButtonStyle()}
      >
        <div className="flex items-center gap-2">
          {getStatusIcon()}
          <div className="flex flex-col items-start">
            <span className={`text-sm font-medium ${isNotLoaded ? 'text-white' : 'text-slate-900'}`}>
              {currentModel?.displayName || 'Select Model'}
            </span>
            <span className={`text-xs ${isNotLoaded ? 'text-white/90' : 'text-slate-500'}`}>
              {getStatusText()}
            </span>
          </div>
        </div>
        <ChevronDown className={`w-4 h-4 transition-transform ${isNotLoaded ? 'text-white' : 'text-slate-500'} ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div className="absolute top-full right-0 mt-2 w-96 bg-white rounded-xl border border-slate-200 shadow-xl z-50 max-h-[600px] flex flex-col">
          <div className="p-4 border-b border-slate-200 space-y-3">
            <input
              type="text"
              placeholder="Search models..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />

            <div className="flex gap-2 overflow-x-auto pb-1">
              <button
                onClick={() => setSelectedCategory('all')}
                className={`px-3 py-1 rounded-full text-xs font-medium whitespace-nowrap transition-colors ${
                  selectedCategory === 'all'
                    ? 'bg-blue-100 text-blue-700'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                All Models
              </button>
              {MODEL_CATEGORIES.map((category) => (
                <button
                  key={category.value}
                  onClick={() => setSelectedCategory(category.value)}
                  className={`px-3 py-1 rounded-full text-xs font-medium whitespace-nowrap transition-colors ${
                    selectedCategory === category.value
                      ? 'bg-blue-100 text-blue-700'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {category.icon} {category.label}
                </button>
              ))}
            </div>
          </div>

          <div className="overflow-y-auto flex-1">
            {filteredModels.length === 0 ? (
              <div className="p-8 text-center text-slate-500">
                <p className="text-sm">No models found</p>
              </div>
            ) : (
              <div className="p-2">
                {filteredModels.map((model) => (
                  <button
                    key={model.id}
                    onClick={() => handleModelSelect(model.id)}
                    className={`w-full text-left p-3 rounded-lg hover:bg-slate-50 transition-colors ${
                      model.id === selectedModelId ? 'bg-blue-50 border border-blue-200' : ''
                    }`}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="font-medium text-slate-900 text-sm">
                            {model.displayName}
                          </span>
                          {model.id === selectedModelId && (
                            <CheckCircle2 className="w-4 h-4 text-blue-600 flex-shrink-0" />
                          )}
                        </div>
                        <p className="text-xs text-slate-600 mt-0.5 line-clamp-1">
                          {model.description}
                        </p>
                        <div className="flex gap-2 mt-2 flex-wrap">
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-slate-100 text-slate-700 rounded text-xs font-medium">
                            {model.size}
                          </span>
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-slate-100 text-slate-700 rounded text-xs">
                            {model.vramRequired}
                          </span>
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-slate-100 text-slate-700 rounded text-xs">
                            {model.contextLength}
                          </span>
                        </div>
                      </div>
                      {model.id !== selectedModelId && (
                        <Download className="w-4 h-4 text-slate-400 flex-shrink-0 mt-1" />
                      )}
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="p-3 border-t border-slate-200 bg-slate-50">
            <div className="flex items-center justify-between gap-3">
              <p className="text-xs text-slate-600">
                {filteredModels.length} model{filteredModels.length !== 1 ? 's' : ''} available
              </p>
              {isNotLoaded && (
                <button
                  onClick={handleLoadCurrentModel}
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-gradient-to-br from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white rounded-lg transition-all text-xs font-medium shadow-sm hover:shadow-md"
                >
                  <Download className="w-3.5 h-3.5" />
                  Load {currentModel?.displayName}
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
