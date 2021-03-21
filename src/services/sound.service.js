import Emitter from "component-emitter";
import { autoCorrelate } from "../algorithms/autoCorrelate";
require("@mohayonao/web-audio-api-shim/light");

export default () => {
  const events = Emitter({});

  let audioContext = null;
  let analyser = null;
  let mediaStreamSource = null;
  let stream = null;
  let isTunerActive = false;

  const on = (event, arg) => {
    events.on(event, arg);
  };

  const off = (event) => {
    events.off(event);
  };

  const emitAcUpdate = (ac) => {
    events.emit("acUpdate", ac);
  };

  const emitStatusUpdate = (status) => {
    events.emit("statusUpdate", status);
  };

  const errorHandler = (error) => {
    console.error(error);
  };

  const buflen = 2048;
  const buf = new Float32Array(buflen);

  const noteFromPitch = (frequency) => {
    const noteNum = 12 * (Math.log(frequency / 440) / Math.log(2));
    return Math.round(noteNum) + 69;
  };

  // eslint-disable-next-line no-restricted-properties
  const frequencyFromNoteNumber = (note) => 440 * Math.pow(2, (note - 69) / 12);

  const centsOffFromPitch = (frequency, note) =>
    Math.floor(
      1200 * (Math.log(frequency / frequencyFromNoteNumber(note)) / Math.log(2))
    );

  const updatePitch = () => {
    analyser.getFloatTimeDomainData(buf);
    const ac = autoCorrelate(buf, audioContext.sampleRate);
    emitAcUpdate(ac);

    if (!window.requestAnimationFrame) {
      window.requestAnimationFrame = window.webkitRequestAnimationFrame;
    }
    window.requestAnimationFrame(updatePitch);
  };

  const createStreamAudio = () => {
    // Create an AudioNode from the stream.
    mediaStreamSource = audioContext.createMediaStreamSource(stream);

    // Connect it to the destination.
    analyser = audioContext.createAnalyser();
    analyser.fftSize = 2048;
    mediaStreamSource.connect(analyser);
    updatePitch();
  };

  const getUserMedia = async () => {
    stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    try {
      createStreamAudio(stream);
      isTunerActive = true;
      emitStatusUpdate(isTunerActive);
    } catch (e) {
      errorHandler(`getUserMedia threw exception :${e}`);
    }
  };

  const stop = () => {
    stream.getTracks().forEach((track) => {
      track.stop();
    });
    stream = null;
    isTunerActive = false;
    emitStatusUpdate(isTunerActive);
  };

  const start = () => {
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    if (AudioContext) {
      audioContext = new AudioContext();
    } else {
      errorHandler(
        "Sorry, but the Web Audio API is not supported by your browser. Please, consider upgrading to the latest version or downloading Google Chrome or Mozilla Firefox"
      );
      return;
    }
    getUserMedia();
  };

  return {
    on,
    off,
    stop,
    start,
    noteFromPitch,
    centsOffFromPitch,
  };
};
