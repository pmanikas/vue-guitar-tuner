// Function to calculate the frequency of the input audio signal
export function autoCorrelate(audioBuffer: Float32Array, sampleRate: number): number | null {
    const MIN_FREQUENCY = 82.41; // Low E on a guitar (E2)
    const MAX_FREQUENCY = 1318.51; // High E on a guitar (E6)
    const MIN_PERIOD = Math.floor(sampleRate / MAX_FREQUENCY);
    const MAX_PERIOD = Math.floor(sampleRate / MIN_FREQUENCY);

    let bestOffset = -1;
    let bestCorrelation = 0;
    let rms = 0;

    // Calculate the root mean square (RMS) to estimate signal strength
    for (let i = 0; i < audioBuffer.length; i++) {
        rms += audioBuffer[i] * audioBuffer[i];
    }
    rms = Math.sqrt(rms / audioBuffer.length);

    // If the signal is too weak, return null
    if (rms < 0.01) return null;

    let correlations = new Float32Array(MAX_PERIOD);

    // Perform autocorrelation
    for (let lag = MIN_PERIOD; lag < MAX_PERIOD; lag++) {
        let correlation = 0;
        for (let i = 0; i < audioBuffer.length - lag; i++) {
            correlation += audioBuffer[i] * audioBuffer[i + lag];
        }
        correlations[lag] = correlation;

        // Keep track of the best correlation
        if (correlation > bestCorrelation) {
            bestCorrelation = correlation;
            bestOffset = lag;
        }
    }

    // If no good correlation is found, return null
    if (bestCorrelation < 0.01) return null;

    // Refine the result by interpolating the peak
    let betterOffset = bestOffset;
    if (bestOffset > 0 && bestOffset < correlations.length - 1) {
        const before = correlations[bestOffset - 1];
        const after = correlations[bestOffset + 1];
        if (after > before) {
            betterOffset += (after - before) / (2 * (2 * after - bestCorrelation - before));
        } else {
            betterOffset -= (before - after) / (2 * (2 * before - bestCorrelation - after));
        }
    }

    // Convert the offset back to a frequency
    const frequency = sampleRate / betterOffset;
    return frequency;
}
