import Emitter from "component-emitter";
import { autoCorrelate as algo } from "../algorithms/auto-correlate";

type EventCallback = (...args: any[]) => void;

interface SoundService {
    on(event: string, arg: EventCallback): void;
    off(event: string): void;
    stop(): void;
    start(): void;
    noteFromPitch(frequency: number): number;
    centsOffFromPitch(frequency: number, note: number): number;
}

export default function (): SoundService {
    const events = Emitter({});

    const buflen: number = 2048;
    const buf: Float32Array = new Float32Array(buflen);

    let audioContext: AudioContext | null = null;
    let analyser: AnalyserNode | null = null;
    let mediaStreamSource: MediaStreamAudioSourceNode | null = null;
    let stream: MediaStream | null = null;
    let isTunerActive: boolean = false;

    function on(event: string, arg: EventCallback): void {
        events.on(event, arg);
    }

    function off(event: string): void {
        events.off(event);
    }

    function emitAcUpdate(ac: number): void {
        events.emit("acUpdate", ac);
    }

    function emitStatusUpdate(status: boolean): void {
        events.emit("statusUpdate", status);
    }

    function errorHandler(error: string): void {
        console.error(error);
    }

    function noteFromPitch(frequency: number): number {
        const noteNum: number = 12 * (Math.log(frequency / 440) / Math.log(2));
        return Math.round(noteNum) + 69;
    }

    function frequencyFromNoteNumber(note: number): number {
        return 440 * Math.pow(2, (note - 69) / 12);
    }

    function centsOffFromPitch(frequency: number, note: number): number {
        return Math.floor(1200 * (Math.log(frequency / frequencyFromNoteNumber(note)) / Math.log(2)));
    }

    function updatePitch(): void {
        if (analyser) {
            analyser.getFloatTimeDomainData(buf);
            const frequency: number = algo(buf, audioContext!.sampleRate) || 0;
            emitAcUpdate(frequency);
        }

        setTimeout(updatePitch, 100);
    }

    function createStreamAudio(): void {
        if (audioContext && stream) {
            mediaStreamSource = audioContext.createMediaStreamSource(stream);

            analyser = audioContext.createAnalyser();
            analyser.fftSize = 2048;
            mediaStreamSource.connect(analyser);
            updatePitch();
        }
    }

    async function getUserMedia(): Promise<void> {
        try {
            stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            createStreamAudio();
            isTunerActive = true;
            emitStatusUpdate(isTunerActive);
        } catch (e) {
            errorHandler(`getUserMedia threw exception: ${e}`);
        }
    }

    function stop(): void {
        if (!stream) return;

        stream.getTracks().forEach((track) => track.stop());

        stream = null;
        isTunerActive = false;

        emitStatusUpdate(isTunerActive);
    }

    function start(): void {
        const AudioContext = window.AudioContext;

        if (!AudioContext)
            return errorHandler(
                "Sorry, but the Web Audio API is not supported by your browser. Please, consider upgrading to the latest version or downloading Google Chrome or Mozilla Firefox"
            );

        audioContext = new AudioContext();
        getUserMedia();
    }

    return {
        on,
        off,
        stop,
        start,
        noteFromPitch,
        centsOffFromPitch,
    };
}
