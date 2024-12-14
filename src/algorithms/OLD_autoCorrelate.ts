function autoCorrelate(audioBuffer: Float32Array, sampleRate: number): number {
    const bufferLength: number = audioBuffer.length;
    let rootMeanSquare: number = 0;

    // Calculate root mean square of the buffer
    for (let i = 0; i < bufferLength; i++) {
        const sampleValue: number = audioBuffer[i];
        rootMeanSquare += sampleValue * sampleValue;
    }

    rootMeanSquare = Math.sqrt(rootMeanSquare / bufferLength);

    // Check if signal is too weak
    if (rootMeanSquare < 0.05) {
        return -1;
    }

    let startIndex: number = 0;
    let endIndex: number = bufferLength - 1;
    const significanceThreshold: number = 0.2;

    // Find the start of significant signal from the beginning
    for (let i = 0; i < bufferLength / 2; i++) {
        if (Math.abs(audioBuffer[i]) < significanceThreshold) {
            startIndex = i;
            break;
        }
    }

    // Find the end of significant signal from the end
    for (let i = 1; i < bufferLength / 2; i++) {
        if (Math.abs(audioBuffer[bufferLength - i]) < significanceThreshold) {
            endIndex = bufferLength - i;
            break;
        }
    }

    // Slice the buffer to significant portion
    const significantBuffer = audioBuffer.slice(startIndex, endIndex);
    const significantBufferLength = significantBuffer.length;

    // Calculate correlation coefficients
    const correlationCoefficients: number[] = new Array(significantBufferLength).fill(0);
    for (let i = 0; i < significantBufferLength; i++) {
        for (let j = 0; j < significantBufferLength - i; j++) {
            correlationCoefficients[i] += significantBuffer[j] * significantBuffer[j + i];
        }
    }

    // Find the first peak in correlation
    let peakStartIndex: number = 0;
    while (correlationCoefficients[peakStartIndex] > correlationCoefficients[peakStartIndex + 1]) {
        peakStartIndex++;
    }

    // Find the maximum correlation value and its position
    let maxCorrelationValue: number = -1;
    let maxCorrelationPosition: number = -1;
    for (let i = peakStartIndex; i < significantBufferLength; i++) {
        if (correlationCoefficients[i] > maxCorrelationValue) {
            maxCorrelationValue = correlationCoefficients[i];
            maxCorrelationPosition = i;
        }
    }

    // Parabolic interpolation to improve peak estimation
    let peakPosition: number = maxCorrelationPosition;
    const prevCorrelationValue: number = correlationCoefficients[peakPosition - 1];
    const currentCorrelationValue: number = correlationCoefficients[peakPosition];
    const nextCorrelationValue: number = correlationCoefficients[peakPosition + 1];

    const parabolaCoeffA: number = (prevCorrelationValue + nextCorrelationValue - 2 * currentCorrelationValue) / 2;
    const parabolaCoeffB: number = (nextCorrelationValue - prevCorrelationValue) / 2;

    if (parabolaCoeffA) {
        peakPosition -= parabolaCoeffB / (2 * parabolaCoeffA);
    }

    // Calculate and return fundamental frequency
    return sampleRate / peakPosition;
}

export { autoCorrelate };
