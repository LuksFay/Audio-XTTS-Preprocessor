import React, { useState, useRef, useCallback } from 'react';
import FileUploader from './components/FileUploader';
import WaveformWorkspace from './components/WaveformWorkspace';
import AudioControls from './components/AudioControls';
import ExportSection from './components/ExportSection';
import { sliceAudioBuffer, concatenateAudioBuffers } from './utils/audioUtils';

function App() {
  const [audioBuffer, setAudioBuffer] = useState(null);
  const [fileName, setFileName] = useState('');
  const [selection, setSelection] = useState(null);
  const waveformRef = useRef(null);
  const audioCtxRef = useRef(new (window.AudioContext || window.webkitAudioContext)());

  const handleFileLoaded = (buffer, name) => {
    setAudioBuffer(buffer);
    setFileName(name);
    setSelection(null);
  };

  const handleRegionChange = (start, end) => {
    setSelection({ start, end });
  };

  const updateBuffer = (newBuffer) => {
    if (newBuffer) {
      setAudioBuffer(newBuffer);
      setSelection(null);
    }
  };

  const onTrim = () => {
    if (!selection || !audioBuffer) return;
    const trimmed = sliceAudioBuffer(audioCtxRef.current, audioBuffer, selection.start, selection.end);
    updateBuffer(trimmed);
  };

  const onCutMiddle = () => {
    if (!selection || !audioBuffer) return;
    const part1 = sliceAudioBuffer(audioCtxRef.current, audioBuffer, 0, selection.start);
    const part2 = sliceAudioBuffer(audioCtxRef.current, audioBuffer, selection.end, audioBuffer.duration);
    const spliced = concatenateAudioBuffers(audioCtxRef.current, part1, part2);
    updateBuffer(spliced);
  };

  const onRemoveStart = () => {
    if (!audioBuffer || !waveformRef.current) return;
    const currentTime = waveformRef.current.getCurrentTime();
    const truncated = sliceAudioBuffer(audioCtxRef.current, audioBuffer, currentTime, audioBuffer.duration);
    updateBuffer(truncated);
  };

  const onRemoveEnd = () => {
    if (!audioBuffer || !waveformRef.current) return;
    const currentTime = waveformRef.current.getCurrentTime();
    const truncated = sliceAudioBuffer(audioCtxRef.current, audioBuffer, 0, currentTime);
    updateBuffer(truncated);
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-12">
      <header className="mb-12 text-center">
        <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight sm:text-5xl">
          Audio <span className="text-indigo-600">XTTS</span> Preprocessor
        </h1>
        <p className="mt-4 text-lg text-slate-600">
          Prepare your voice samples for XTTS v2 AI Voice Cloning.
        </p>
      </header>

      <main>
        {!audioBuffer ? (
          <FileUploader onFileLoaded={handleFileLoaded} />
        ) : (
          <div className="space-y-8">
            <div className="flex justify-between items-center bg-slate-100 p-4 rounded-lg">
              <span className="font-mono text-sm text-slate-500 truncate max-w-xs">
                Editing: {fileName}
              </span>
              <button
                onClick={() => setAudioBuffer(null)}
                className="text-sm text-red-500 hover:text-red-700 font-medium"
              >
                Clear / New File
              </button>
            </div>

            <WaveformWorkspace
              ref={waveformRef}
              audioBuffer={audioBuffer}
              onRegionChange={handleRegionChange}
            />

            <AudioControls
              onTrim={onTrim}
              onCutMiddle={onCutMiddle}
              onRemoveStart={onRemoveStart}
              onRemoveEnd={onRemoveEnd}
              hasSelection={!!selection}
            />

            <ExportSection audioBuffer={audioBuffer} />
          </div>
        )}
      </main>

      <footer className="mt-20 py-8 border-t border-slate-200 text-center text-slate-400 text-sm">
        <p>
          Una herramienta de{' '}
          <a href="https://arcadeestudio.com.br" target="_blank" rel="noopener noreferrer" className="text-indigo-500 hover:text-indigo-600 underline underline-offset-2">
            Arcade Estudio
          </a>
        </p>
      </footer>
    </div>
  );
}

export default App;
