/**
 * Audio Utility functions for manipulating AudioBuffer objects.
 */

/**
 * Slices an AudioBuffer from startTime to endTime.
 * @param {AudioContext} audioContext
 * @param {AudioBuffer} buffer
 * @param {number} startSeconds
 * @param {number} endSeconds
 * @returns {AudioBuffer}
 */
export const sliceAudioBuffer = (audioContext, buffer, startSeconds, endSeconds) => {
  const startOffset = Math.max(0, Math.floor(startSeconds * buffer.sampleRate));
  const endOffset = Math.min(buffer.length, Math.floor(endSeconds * buffer.sampleRate));
  const frameCount = endOffset - startOffset;

  if (frameCount <= 0) return null;

  const newBuffer = audioContext.createBuffer(
    buffer.numberOfChannels,
    frameCount,
    buffer.sampleRate
  );

  for (let i = 0; i < buffer.numberOfChannels; i++) {
    const channelData = buffer.getChannelData(i).slice(startOffset, endOffset);
    newBuffer.copyToChannel(channelData, i);
  }

  return newBuffer;
};

/**
 * Concatenates two AudioBuffers.
 * @param {AudioContext} audioContext
 * @param {AudioBuffer} buffer1
 * @param {AudioBuffer} buffer2
 * @returns {AudioBuffer}
 */
export const concatenateAudioBuffers = (audioContext, buffer1, buffer2) => {
  if (!buffer1) return buffer2;
  if (!buffer2) return buffer1;

  const frameCount = buffer1.length + buffer2.length;
  const newBuffer = audioContext.createBuffer(
    Math.max(buffer1.numberOfChannels, buffer2.numberOfChannels),
    frameCount,
    buffer1.sampleRate
  );

  for (let i = 0; i < newBuffer.numberOfChannels; i++) {
    const channelData = new Float32Array(frameCount);
    if (i < buffer1.numberOfChannels) {
      channelData.set(buffer1.getChannelData(i), 0);
    }
    if (i < buffer2.numberOfChannels) {
      channelData.set(buffer2.getChannelData(i), buffer1.length);
    }
    newBuffer.copyToChannel(channelData, i);
  }

  return newBuffer;
};

/**
 * Downmixes an AudioBuffer to Mono and resamples it to the target rate.
 * @param {AudioBuffer} buffer
 * @param {number} targetSampleRate
 * @returns {Promise<AudioBuffer>}
 */
export const processAudioForExport = async (buffer, targetSampleRate = 24000) => {
  // 1. Mono Downmix logic
  let monoBuffer;
  if (buffer.numberOfChannels > 1) {
    const offlineCtx = new OfflineAudioContext(1, buffer.length, buffer.sampleRate);
    const source = offlineCtx.createBufferSource();
    source.buffer = buffer;
    source.connect(offlineCtx.destination);
    source.start();
    monoBuffer = await offlineCtx.startRendering();
  } else {
    monoBuffer = buffer;
  }

  // 2. Resampling logic if sample rate differs
  if (monoBuffer.sampleRate !== targetSampleRate) {
    const targetLength = Math.round(monoBuffer.duration * targetSampleRate);
    const resampleCtx = new OfflineAudioContext(1, targetLength, targetSampleRate);
    const source = resampleCtx.createBufferSource();
    source.buffer = monoBuffer;
    source.connect(resampleCtx.destination);
    source.start();
    return await resampleCtx.startRendering();
  }

  return monoBuffer;
};
