import React, { useState } from 'react';
import audioBufferToWav from 'audiobuffer-to-wav';
import { processAudioForExport } from '../utils/audioUtils';

const ExportSection = ({ audioBuffer }) => {
  const [isExporting, setIsExporting] = useState(false);

  const handleExport = async () => {
    if (!audioBuffer) return;
    setIsExporting(true);

    try {
      // 1. Process: Mono & Resample to 24kHz
      const processedBuffer = await processAudioForExport(audioBuffer, 24000);

      // 2. Convert to WAV
      const wavData = audioBufferToWav(processedBuffer);
      const blob = new Blob([new DataView(wavData)], { type: 'audio/wav' });

      // 3. Download
      const url = URL.createObjectURL(blob);
      const anchor = document.createElement('a');
      anchor.href = url;
      anchor.download = 'mi_voz.wav';
      anchor.click();
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error("Export failed", err);
      alert("Failed to export audio.");
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="mt-8 pt-8 border-t border-slate-200 flex flex-col items-center">
      <button
        onClick={handleExport}
        disabled={isExporting || !audioBuffer}
        className={`px-10 py-4 rounded-full font-bold text-white shadow-lg transition-all transform hover:scale-105 active:scale-95 ${
          isExporting ? 'bg-slate-400' : 'bg-gradient-to-r from-indigo-500 to-purple-600'
        }`}
      >
        {isExporting ? 'Processing...' : 'Export for XTTS v2 (24kHz Mono WAV)'}
      </button>
      <p className="mt-4 text-xs text-slate-400">
        Strict parameters: 24,000Hz, Mono, 16-bit PCM Uncompressed.
      </p>
    </div>
  );
};

export default ExportSection;
