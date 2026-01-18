import React, { useEffect, useRef } from 'react';

interface SpectrogramProps {
    analyzer: AnalyserNode | null;
}

const Spectrogram: React.FC<SpectrogramProps> = ({ analyzer }) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        if (!analyzer || !canvasRef.current) return;

        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        const bufferLength = analyzer.frequencyBinCount;
        const dataArray = new Uint8Array(bufferLength);

        const render = () => {
            requestAnimationFrame(render);
            analyzer.getByteFrequencyData(dataArray);

            ctx.fillStyle = '#0a0a0a';
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            const barWidth = (canvas.width / bufferLength) * 2.5;
            let barHeight;
            let x = 0;

            for (let i = 0; i < bufferLength; i++) {
                barHeight = dataArray[i] / 2;

                // Dynamic coloring for neural impact
                ctx.fillStyle = `rgb(${barHeight + 50}, 60, 200)`;
                ctx.fillRect(x, canvas.height - barHeight, barWidth, barHeight);

                x += barWidth + 1;
            }
        };

        render();
    }, [analyzer]);

    return (
        <canvas
            ref={canvasRef}
            className="w-full h-32 rounded-lg border border-blue-900/30"
            width={600}
            height={150}
        />
    );
};

export default Spectrogram;
