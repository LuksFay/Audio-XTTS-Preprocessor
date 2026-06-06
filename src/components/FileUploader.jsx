import React, { useCallback } from 'react';

const FileUploader = ({ onFileLoaded }) => {
  const handleFileChange = useCallback(async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    processFile(file);
  }, [onFileLoaded]);

  const onDrop = useCallback((e) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (file) processFile(file);
  }, [onFileLoaded]);

  const processFile = async (file) => {
    const reader = new FileReader();
    reader.onload = async (event) => {
      const arrayBuffer = event.target.result;
      const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
      try {
        const audioBuffer = await audioCtx.decodeAudioData(arrayBuffer);
        onFileLoaded(audioBuffer, file.name);
      } catch (err) {
        console.error("Error decoding audio data", err);
        alert("Could not decode audio file. Please ensure it's a valid MP3, WAV, or MPEG file.");
      }
    };
    reader.readAsArrayBuffer(file);
  };

  return (
    <div
      onDragOver={(e) => e.preventDefault()}
      onDrop={onDrop}
      className="border-2 border-dashed border-slate-300 rounded-xl p-12 text-center hover:border-indigo-400 transition-colors cursor-pointer bg-white shadow-sm"
    >
      <input
        type="file"
        id="fileInput"
        className="hidden"
        accept=".mp3,.wav,.mpeg,audio/*"
        onChange={handleFileChange}
      />
      <label htmlFor="fileInput" className="cursor-pointer block">
        <div className="text-4xl mb-4 text-slate-400">🎵</div>
        <p className="text-lg font-medium text-slate-700">Drag & Drop audio file here</p>
        <p className="text-sm text-slate-500 mt-2">or click to browse (.mp3, .wav, .mpeg)</p>
      </label>
    </div>
  );
};

export default FileUploader;
