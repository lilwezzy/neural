import React, { useEffect, useRef } from 'react';

interface NeuralBackgroundProps {
    pulseRate: number; // Hz
    active: boolean;
}

export const NeuralBackground: React.FC<NeuralBackgroundProps> = ({ pulseRate, active }) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        let animationId: number;
        const particles: Particle[] = [];
        const particleCount = 60;

        class Particle {
            x: number;
            y: number;
            size: number;
            speedX: number;
            speedY: number;
            baseAlpha: number;

            constructor() {
                this.x = Math.random() * canvas!.width;
                this.y = Math.random() * canvas!.height;
                this.size = Math.random() * 1.5 + 0.5;
                this.speedX = (Math.random() - 0.5) * 0.3;
                this.speedY = (Math.random() - 0.5) * 0.3;
                this.baseAlpha = Math.random() * 0.3 + 0.1;
            }

            update() {
                this.x += this.speedX;
                this.y += this.speedY;

                if (this.x > canvas!.width) this.x = 0;
                else if (this.x < 0) this.x = canvas!.width;
                if (this.y > canvas!.height) this.y = 0;
                else if (this.y < 0) this.y = canvas!.height;
            }

            draw(pulseFactor: number) {
                if (!ctx) return;
                const alpha = this.baseAlpha + (pulseFactor * 0.2);
                ctx.fillStyle = `rgba(100, 150, 255, ${alpha})`;
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
                ctx.fill();
            }
        }

        const resize = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        };

        window.addEventListener('resize', resize);
        resize();

        for (let i = 0; i < particleCount; i++) {
            particles.push(new Particle());
        }

        const animate = (time: number) => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            // Calculate pulse based on frequency
            // Use sin wave for smooth pulsing
            const pulseFactor = active
                ? (Math.sin(time * 0.001 * pulseRate * Math.PI * 2) + 1) / 2
                : 0;

            particles.forEach(p => {
                p.update();
                p.draw(pulseFactor);
            });

            // Subtle lines between near particles
            ctx.strokeStyle = `rgba(100, 150, 255, ${0.05 + pulseFactor * 0.03})`;
            ctx.lineWidth = 0.5;
            for (let i = 0; i < particles.length; i++) {
                for (let j = i + 1; j < particles.length; j++) {
                    const dx = particles[i].x - particles[j].x;
                    const dy = particles[i].y - particles[j].y;
                    const distance = Math.sqrt(dx * dx + dy * dy);

                    if (distance < 150) {
                        ctx.beginPath();
                        ctx.moveTo(particles[i].x, particles[i].y);
                        ctx.lineTo(particles[j].x, particles[j].y);
                        ctx.stroke();
                    }
                }
            }

            animationId = requestAnimationFrame(animate);
        };

        animationId = requestAnimationFrame(animate);

        return () => {
            cancelAnimationFrame(animationId);
            window.removeEventListener('resize', resize);
        };
    }, [pulseRate, active]);

    return (
        <canvas
            ref={canvasRef}
            style={{
                position: 'fixed',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                zIndex: -1,
                pointerEvents: 'none',
                background: 'radial-gradient(circle at center, #0a0a0f 0%, #000 100%)'
            }}
        />
    );
};
