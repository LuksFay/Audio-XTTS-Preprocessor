import React from 'react';

const AudioControls = ({ onTrim, onCutMiddle, onRemoveStart, onRemoveEnd, hasSelection }) => {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
      <button
        onClick={onTrim}
        disabled={!hasSelection}
        className="flex flex-col items-center p-4 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed group"
        title="Keep only the selected region"
      >
        <span className="text-2xl mb-1 group-hover:scale-110 transition-transform">✂️</span>
        <span className="text-sm font-semibold text-slate-700">Trim / Crop</span>
        <span className="text-xs text-slate-400">Keep inner only</span>
      </button>

      <button
        onClick={onCutMiddle}
        disabled={!hasSelection}
        className="flex flex-col items-center p-4 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed group"
        title="Remove selected region and splice ends"
      >
        <span className="text-2xl mb-1 group-hover:scale-110 transition-transform">🎞️</span>
        <span className="text-sm font-semibold text-slate-700">Cut Middle</span>
        <span className="text-xs text-slate-400">Splice remaining</span>
      </button>

      <button
        onClick={onRemoveStart}
        className="flex flex-col items-center p-4 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 transition-colors group"
        title="Delete everything before playhead"
      >
        <span className="text-2xl mb-1 group-hover:scale-110 transition-transform">⏪</span>
        <span className="text-sm font-semibold text-slate-700">Remove Start</span>
        <span className="text-xs text-slate-400">Delete before playhead</span>
      </button>

      <button
        onClick={onRemoveEnd}
        className="flex flex-col items-center p-4 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 transition-colors group"
        title="Delete everything after playhead"
      >
        <span className="text-2xl mb-1 group-hover:scale-110 transition-transform">⏩</span>
        <span className="text-sm font-semibold text-slate-700">Remove End</span>
        <span className="text-xs text-slate-400">Delete after playhead</span>
      </button>
    </div>
  );
};

export default AudioControls;
