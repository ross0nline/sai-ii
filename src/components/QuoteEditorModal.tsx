import { X, Plus, Trash2, ChevronUp, ChevronDown, RotateCcw, Save } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useRobotQuotesStore } from '../store/robotQuotesStore';
import type { RobotQuote } from '../lib/supabase';

export function QuoteEditorModal() {
  const {
    showQuoteEditor,
    setShowQuoteEditor,
    quotes,
    addQuote,
    updateQuote,
    deleteQuote,
    fetchQuotes
  } = useRobotQuotesStore();

  const [editedQuotes, setEditedQuotes] = useState<RobotQuote[]>([]);
  const [newQuote, setNewQuote] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  useEffect(() => {
    setEditedQuotes([...quotes]);
  }, [quotes]);

  const handleClose = () => {
    setShowQuoteEditor(false);
    setNewQuote('');
  };

  const handleUpdateQuote = (index: number, field: keyof RobotQuote, value: string | boolean | number) => {
    const updated = [...editedQuotes];
    updated[index] = { ...updated[index], [field]: value };
    setEditedQuotes(updated);
  };

  const handleMoveUp = (index: number) => {
    if (index === 0) return;
    const updated = [...editedQuotes];
    [updated[index - 1], updated[index]] = [updated[index], updated[index - 1]];
    updated.forEach((quote, i) => {
      quote.display_order = i;
    });
    setEditedQuotes(updated);
  };

  const handleMoveDown = (index: number) => {
    if (index === editedQuotes.length - 1) return;
    const updated = [...editedQuotes];
    [updated[index], updated[index + 1]] = [updated[index + 1], updated[index]];
    updated.forEach((quote, i) => {
      quote.display_order = i;
    });
    setEditedQuotes(updated);
  };

  const handleAddQuote = async () => {
    if (!newQuote.trim()) return;
    await addQuote(newQuote.trim());
    setNewQuote('');
  };

  const handleDeleteQuote = async (id: string) => {
    await deleteQuote(id);
  };

  const handleSaveAll = async () => {
    setIsSaving(true);
    try {
      for (const quote of editedQuotes) {
        await updateQuote(quote.id, quote.quote, quote.display_order, quote.is_active);
      }
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 2000);
    } finally {
      setIsSaving(false);
    }
  };

  const handleResetToDefaults = async () => {
    if (!confirm('Are you sure you want to reset all quotes to defaults? This will delete custom quotes.')) {
      return;
    }

    for (const quote of editedQuotes) {
      await deleteQuote(quote.id);
    }

    await fetchQuotes();
  };

  if (!showQuoteEditor) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden flex flex-col">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Customize Robot Quotes</h2>
            <p className="text-sm text-gray-600 mt-1">Edit what the robot says when you click during downloads</p>
          </div>
          <button
            onClick={handleClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {editedQuotes.map((quote, index) => (
            <div
              key={quote.id}
              className="bg-gray-50 rounded-lg p-4 border-2 border-gray-200 hover:border-blue-300 transition-colors"
            >
              <div className="flex items-start gap-3">
                <div className="flex flex-col gap-1">
                  <button
                    onClick={() => handleMoveUp(index)}
                    disabled={index === 0}
                    className="text-gray-400 hover:text-blue-600 disabled:opacity-30 disabled:cursor-not-allowed"
                    title="Move up"
                  >
                    <ChevronUp className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleMoveDown(index)}
                    disabled={index === editedQuotes.length - 1}
                    className="text-gray-400 hover:text-blue-600 disabled:opacity-30 disabled:cursor-not-allowed"
                    title="Move down"
                  >
                    <ChevronDown className="w-4 h-4" />
                  </button>
                </div>

                <div className="flex-1">
                  <textarea
                    value={quote.quote}
                    onChange={(e) => handleUpdateQuote(index, 'quote', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                    rows={2}
                    maxLength={200}
                  />
                  <div className="flex items-center justify-between mt-2">
                    <label className="flex items-center gap-2 text-sm text-gray-600">
                      <input
                        type="checkbox"
                        checked={quote.is_active}
                        onChange={(e) => handleUpdateQuote(index, 'is_active', e.target.checked)}
                        className="rounded text-blue-600 focus:ring-blue-500"
                      />
                      Enabled
                    </label>
                    <span className="text-xs text-gray-400">
                      {quote.quote.length}/200 characters
                    </span>
                  </div>
                </div>

                <button
                  onClick={() => handleDeleteQuote(quote.id)}
                  className="text-gray-400 hover:text-red-600 transition-colors mt-2"
                  title="Delete quote"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}

          <div className="bg-blue-50 rounded-lg p-4 border-2 border-dashed border-blue-300">
            <div className="flex gap-3">
              <input
                type="text"
                value={newQuote}
                onChange={(e) => setNewQuote(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleAddQuote()}
                placeholder="Add a new quote..."
                className="flex-1 px-3 py-2 border border-blue-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                maxLength={200}
              />
              <button
                onClick={handleAddQuote}
                disabled={!newQuote.trim()}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
              >
                <Plus className="w-4 h-4" />
                Add
              </button>
            </div>
          </div>

          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <p className="text-sm text-yellow-800">
              <strong>Tip:</strong> The robot will cycle through enabled quotes in order when clicked during downloads.
              After cycling through all quotes once, this editor will appear automatically!
            </p>
          </div>
        </div>

        <div className="flex items-center justify-between gap-3 p-6 border-t border-gray-200 bg-gray-50">
          <button
            onClick={handleResetToDefaults}
            className="flex items-center gap-2 px-4 py-2 text-gray-700 hover:bg-gray-200 rounded-lg transition-colors"
          >
            <RotateCcw className="w-4 h-4" />
            Reset to Defaults
          </button>

          <div className="flex items-center gap-3">
            {showSuccess && (
              <span className="text-green-600 text-sm font-medium animate-fade-in">
                Saved successfully!
              </span>
            )}
            <button
              onClick={handleClose}
              className="px-4 py-2 text-gray-700 hover:bg-gray-200 rounded-lg transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleSaveAll}
              disabled={isSaving}
              className="flex items-center gap-2 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <Save className="w-4 h-4" />
              {isSaving ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes fade-in {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        .animate-fade-in {
          animation: fade-in 0.3s ease-out;
        }
      `}</style>
    </div>
  );
}
