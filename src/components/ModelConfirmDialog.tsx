import { X } from 'lucide-react';
import { useModelStore } from '../store/modelStore';
import { getModelById } from '../models';

export function ModelConfirmDialog() {
  const { showSwitchConfirmation, pendingModelId, confirmModelSwitch, cancelModelSwitch } =
    useModelStore();

  if (!showSwitchConfirmation || !pendingModelId) return null;

  const pendingModel = getModelById(pendingModelId);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="bg-white rounded-xl shadow-2xl max-w-md w-full mx-4 animate-in fade-in duration-200">
        <div className="flex items-center justify-between p-6 border-b border-slate-200">
          <h2 className="text-xl font-semibold text-slate-900">Switch Model?</h2>
          <button
            onClick={cancelModelSwitch}
            className="p-1 rounded-lg hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5 text-slate-500" />
          </button>
        </div>

        <div className="p-6 space-y-4">
          <p className="text-slate-700">
            You are about to switch to <span className="font-semibold">{pendingModel?.displayName}</span>.
          </p>

          <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 space-y-2">
            <p className="text-sm text-amber-900 font-medium">Please note:</p>
            <ul className="text-sm text-amber-800 space-y-1 list-disc list-inside">
              <li>Current model will be unloaded</li>
              <li>Any ongoing generation will be stopped</li>
              <li>Model download may take several minutes</li>
              <li>Estimated size: ~{pendingModel?.vramRequired} of storage</li>
            </ul>
          </div>

          {pendingModel && (
            <div className="bg-slate-50 rounded-lg p-4 space-y-2">
              <p className="text-sm font-medium text-slate-700">Model Details:</p>
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div>
                  <span className="text-slate-500">Size:</span>
                  <span className="ml-2 font-medium text-slate-900">{pendingModel.size}</span>
                </div>
                <div>
                  <span className="text-slate-500">VRAM:</span>
                  <span className="ml-2 font-medium text-slate-900">{pendingModel.vramRequired}</span>
                </div>
                <div className="col-span-2">
                  <span className="text-slate-500">Context:</span>
                  <span className="ml-2 font-medium text-slate-900">{pendingModel.contextLength}</span>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="flex gap-3 p-6 border-t border-slate-200">
          <button
            onClick={cancelModelSwitch}
            className="flex-1 px-4 py-2.5 rounded-lg border border-slate-300 text-slate-700 font-medium hover:bg-slate-50 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={confirmModelSwitch}
            className="flex-1 px-4 py-2.5 rounded-lg bg-blue-600 text-white font-medium hover:bg-blue-700 transition-colors shadow-sm"
          >
            Switch Model
          </button>
        </div>
      </div>
    </div>
  );
}
