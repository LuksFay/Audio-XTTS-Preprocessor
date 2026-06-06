import React, { useEffect, useRef, useState, useImperativeHandle, forwardRef } from 'react';
import WaveSurfer from 'wavesurfer.js';
import RegionsPlugin from 'wavesurfer.js/dist/plugins/regions.js';
import audioBufferToWav from 'audiobuffer-to-wav';

const WaveformWorkspace = forwardRef(({ audioBuffer, onRegionChange }, ref) => {
  const containerRef = useRef(null);
  const wavesurferRef = useRef(null);
  const regionsRef = useRef(null);
  const blobUrlRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);

  useImperativeHandle(ref, () => ({
    playPause: () => wavesurferRef.current?.playPause(),
    getSelection: () => {
      const region = regionsRef.current?.getRegions()[0];
      return region ? { start: region.start, end: region.end } : null;
    },
    getCurrentTime: () => wavesurferRef.current?.getCurrentTime() || 0,
    getDuration: () => wavesurferRef.current?.getDuration() || 0,
  }));

  useEffect(() => {
    if (!containerRef.current || !audioBuffer) return;

    // Cleanup previous blob URL if it exists
    if (blobUrlRef.current) {
      URL.revokeObjectURL(blobUrlRef.current);
    }

    const ws = WaveSurfer.create({
      container: containerRef.current,
      waveColor: '#6366f1',
      progressColor: '#4338ca',
      cursorColor: '#1e293b',
      barWidth: 2,
      barRadius: 3,
      responsive: true,
      height: 128,
      normalize: true,
    });

    const regions = ws.registerPlugin(RegionsPlugin.create());
    regionsRef.current = regions;

    // Convert AudioBuffer to Blob URL for Wavesurfer v7
    const wav = audioBufferToWav(audioBuffer);
    const blob = new Blob([wav], { type: 'audio/wav' });
    const url = URL.createObjectURL(blob);
    blobUrlRef.current = url;

    // Extract peaks for instant rendering
    const peaks = [];
    for (let i = 0; i < audioBuffer.numberOfChannels; i++) {
      peaks.push(audioBuffer.getChannelData(i));
    }

    ws.load(url, peaks, audioBuffer.duration);

    ws.on('ready', () => {
      // Create an initial region covering the whole buffer
      regions.addRegion({
        start: 0,
        end: ws.getDuration(),
        color: 'rgba(99, 102, 241, 0.2)',
        drag: true,
        resize: true,
      });
    });

    ws.on('play', () => setIsPlaying(true));
    ws.on('pause', () => setIsPlaying(false));

    regions.on('region-updated', (region) => {
      onRegionChange?.(region.start, region.end);
    });

    wavesurferRef.current = ws;

    return () => {
      ws.destroy();
      if (blobUrlRef.current) {
        URL.revokeObjectURL(blobUrlRef.current);
        blobUrlRef.current = null;
      }
    };
  }, [audioBuffer]);

  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
      <div ref={containerRef} className="w-full" />
      <div className="flex justify-center mt-4 space-x-4">
        <button
          onClick={() => wavesurferRef.current?.playPause()}
          className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors font-medium"
        >
          {isPlaying ? 'Pause' : 'Play'}
        </button>
      </div>
    </div>
  );
});

export default WaveformWorkspace;
