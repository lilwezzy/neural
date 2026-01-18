/**
 * AudioEngine.ts
 * Refined Signal Stack for 432Hz Neuro-Entrainment
 */

export type EntrainmentMode = 'binaural' | 'isochronic';

export class AudioEngine {
    private ctx: AudioContext | null = null;
    private masterGain: GainNode | null = null;
    private limiter: DynamicsCompressorNode | null = null;

    // Oscillators
    private oscL: OscillatorNode | null = null;
    private oscR: OscillatorNode | null = null;
    private isochronicCarrier: OscillatorNode | null = null;
    private isochronicPulser: OscillatorNode | null = null;
    private subliminalCarrier: OscillatorNode | null = null;
    private subliminalModulator: GainNode | null = null;
    private subliminalSource1x: AudioBufferSourceNode | null = null;
    private subliminalSource2x: AudioBufferSourceNode | null = null;
    private subliminalBuffer: AudioBuffer | null = null;

    // Control Nodes
    public analyzer: AnalyserNode | null = null;
    private entrainmentGain: GainNode | null = null;
    private subliminalGain: GainNode | null = null;
    private spatialPanner: StereoPannerNode | null = null;
    private spatialLFO: OscillatorNode | null = null;
    private subliminalRate: number = 1.0;

    // Constants
    private readonly TUNING_MULTIPLIER = 432 / 440;
    private readonly SILENT_FREQ = 15000; // Bluetooth-optimized carrier (Sweet Spot)

    constructor() { }

    public isInitialized(): boolean {
        return this.ctx !== null && this.analyzer !== null;
    }

    public async init() {
        if (this.ctx) return;
        this.ctx = new (window.AudioContext || (window as any).webkitAudioContext)();

        this.limiter = this.ctx.createDynamicsCompressor();
        this.limiter.threshold.setValueAtTime(-12, this.ctx.currentTime);
        this.limiter.knee.setValueAtTime(40, this.ctx.currentTime);
        this.limiter.ratio.setValueAtTime(12, this.ctx.currentTime);
        this.limiter.attack.setValueAtTime(0.005, this.ctx.currentTime);
        this.limiter.release.setValueAtTime(0.25, this.ctx.currentTime);

        this.masterGain = this.ctx.createGain();
        this.masterGain.gain.setValueAtTime(0.5, this.ctx.currentTime);

        this.entrainmentGain = this.ctx.createGain();
        this.entrainmentGain.gain.setValueAtTime(1.0, this.ctx.currentTime);

        this.subliminalGain = this.ctx.createGain();
        this.subliminalGain.gain.setValueAtTime(0.8, this.ctx.currentTime);

        this.spatialPanner = this.ctx.createStereoPanner();
        this.spatialPanner.pan.setValueAtTime(0, this.ctx.currentTime);

        this.analyzer = this.ctx.createAnalyser();
        this.analyzer.fftSize = 2048;

        // Routing: 
        // [Entrainment] -> [Panner] -> [Master]
        // [Subliminal]  -> [Panner] -> [Master]
        this.entrainmentGain.connect(this.spatialPanner);
        this.subliminalGain.connect(this.spatialPanner);
        this.spatialPanner.connect(this.masterGain);

        this.masterGain.connect(this.limiter);
        this.limiter.connect(this.analyzer);
        this.analyzer.connect(this.ctx.destination);
    }

    public async stopSystem() {
        if (this.ctx) {
            await this.ctx.close();
            this.ctx = null;
            this.masterGain = null;
            this.entrainmentGain = null;
            this.subliminalGain = null;
            this.analyzer = null;
            this.spatialLFO = null;
        }
    }

    public startBinaural(carrierFreq: number, beatFreq: number, hybrid: boolean = true) {
        if (!this.ctx || !this.entrainmentGain) return;
        this.stopEntrainment();

        const tunedCarrier = carrierFreq * this.TUNING_MULTIPLIER;

        // --- LAYER 1: BINAURAL BEAT ---
        this.oscL = this.ctx.createOscillator();
        this.oscR = this.ctx.createOscillator();
        const pannerL = this.ctx.createStereoPanner();
        const pannerR = this.ctx.createStereoPanner();
        pannerL.pan.setValueAtTime(-1, this.ctx.currentTime);
        pannerR.pan.setValueAtTime(1, this.ctx.currentTime);

        this.oscL.frequency.setValueAtTime(tunedCarrier - (beatFreq / 2), this.ctx.currentTime);
        this.oscR.frequency.setValueAtTime(tunedCarrier + (beatFreq / 2), this.ctx.currentTime);

        this.oscL.connect(pannerL).connect(this.entrainmentGain);
        this.oscR.connect(pannerR).connect(this.entrainmentGain);

        // --- LAYER 2: ISOCHRONIC SUB-STACK (HYBRID) ---
        if (hybrid) {
            this.isochronicCarrier = this.ctx.createOscillator();
            this.isochronicPulser = this.ctx.createOscillator();
            const pulseGain = this.ctx.createGain();

            this.isochronicCarrier.frequency.setValueAtTime(tunedCarrier, this.ctx.currentTime);
            this.isochronicPulser.type = 'square';
            this.isochronicPulser.frequency.setValueAtTime(beatFreq, this.ctx.currentTime);

            this.isochronicCarrier.connect(pulseGain).connect(this.entrainmentGain);
            this.isochronicPulser.connect(pulseGain.gain);

            this.isochronicCarrier.start();
            this.isochronicPulser.start();
        }

        this.oscL.start();
        this.oscR.start();
    }

    public async loadAudioBuffer(url: string): Promise<AudioBuffer> {
        if (!this.ctx) await this.init();
        if (!this.ctx) throw new Error('AudioContext not initialized');

        const response = await fetch(url);
        const arrayBuffer = await response.arrayBuffer();
        return await this.ctx.decodeAudioData(arrayBuffer);
    }

    public setSubliminalBuffer(buffer: AudioBuffer | null) {
        this.subliminalBuffer = buffer;
    }

    public startSubliminal(transparency: boolean = false) {
        if (!this.ctx || !this.subliminalGain) return;
        this.stopSubliminal();

        const tunedCarrier = this.SILENT_FREQ * this.TUNING_MULTIPLIER;
        const carrierFreq = transparency ? 3000 : tunedCarrier;

        this.subliminalCarrier = this.ctx.createOscillator();
        this.subliminalCarrier.frequency.setValueAtTime(carrierFreq, this.ctx.currentTime);

        // AM Modulation Node
        this.subliminalModulator = this.ctx.createGain();
        this.subliminalModulator.gain.setValueAtTime(0, this.ctx.currentTime);

        if (this.subliminalBuffer) {
            const startTime = this.ctx.currentTime + 0.05;

            // --- STREAM 1: THE BLUEPRINT (1.0x Speed) ---
            this.subliminalSource1x = this.ctx.createBufferSource();
            this.subliminalSource1x.buffer = this.subliminalBuffer;
            this.subliminalSource1x.loop = true;
            this.subliminalSource1x.playbackRate.setValueAtTime(this.subliminalRate, this.ctx.currentTime);
            this.subliminalSource1x.connect(this.subliminalModulator.gain);

            // --- STREAM 2: THE MOMENTUM (2.1x Speed) ---
            // This creates the "Neural Pincer" maneuver for accelerated manifestation.
            this.subliminalSource2x = this.ctx.createBufferSource();
            this.subliminalSource2x.buffer = this.subliminalBuffer;
            this.subliminalSource2x.loop = true;
            // We multiply the base rate by 2.1 for the momentum stream
            this.subliminalSource2x.playbackRate.setValueAtTime(this.subliminalRate * 2.1, this.ctx.currentTime);

            // Apply a slight low-pass to the momentum stream to keep it smooth
            const momentumFilter = this.ctx.createBiquadFilter();
            momentumFilter.type = 'lowpass';
            momentumFilter.frequency.setValueAtTime(4000, this.ctx.currentTime);

            // Momentum stream sits at a slightly lower relative gain inside the pincer
            const momentumGain = this.ctx.createGain();
            momentumGain.gain.setValueAtTime(0.7, this.ctx.currentTime);

            this.subliminalSource2x.connect(momentumFilter).connect(momentumGain).connect(this.subliminalModulator.gain);

            // Synchronized Start
            this.subliminalSource1x.start(startTime);
            this.subliminalSource2x.start(startTime);
        } else {
            // Consistent carrier amplitude if no buffer provided
            this.subliminalModulator.gain.setValueAtTime(0.15, this.ctx.currentTime);
        }

        const highPass = this.ctx.createBiquadFilter();
        highPass.type = 'highpass';
        highPass.frequency.setValueAtTime(this.SILENT_FREQ, this.ctx.currentTime);
        highPass.Q.setValueAtTime(1, this.ctx.currentTime);

        if (!transparency) {
            this.subliminalCarrier.connect(this.subliminalModulator).connect(highPass).connect(this.subliminalGain);
        } else {
            this.subliminalCarrier.connect(this.subliminalModulator).connect(this.subliminalGain);
        }

        this.subliminalCarrier.start();
    }

    public stopEntrainment() {
        [this.oscL, this.oscR, this.isochronicCarrier, this.isochronicPulser].forEach(osc => {
            if (osc) {
                try { osc.stop(); } catch (e) { }
                osc.disconnect();
            }
        });
        this.oscL = this.oscR = this.isochronicCarrier = this.isochronicPulser = null;
    }

    public stopSubliminal() {
        if (this.subliminalCarrier) {
            try { this.subliminalCarrier.stop(); } catch (e) { }
            this.subliminalCarrier.disconnect();
        }
        [this.subliminalSource1x, this.subliminalSource2x].forEach(src => {
            if (src) {
                try { src.stop(); } catch (e) { }
                src.disconnect();
            }
        });
        this.subliminalCarrier = null;
        this.subliminalModulator = null;
        this.subliminalSource1x = null;
        this.subliminalSource2x = null;
    }

    public stopAll() {
        this.stopEntrainment();
        this.stopSubliminal();
    }

    public setMasterVolume(val: number) {
        if (this.masterGain && this.ctx) {
            const gain = Math.pow(val, 3);
            this.masterGain.gain.setTargetAtTime(gain, this.ctx.currentTime, 0.05);
        }
    }

    public setEntrainmentVolume(val: number) {
        if (this.entrainmentGain && this.ctx) {
            const gain = Math.pow(val, 3);
            this.entrainmentGain.gain.setTargetAtTime(gain, this.ctx.currentTime, 0.05);
        }
    }

    public setSubliminalVolume(val: number) {
        if (this.subliminalGain && this.ctx) {
            // Power-4 curve for extreme surgical precision at low levels
            const gain = Math.pow(val, 4);
            this.subliminalGain.gain.setTargetAtTime(gain, this.ctx.currentTime, 0.03);
        }
    }

    public setSubliminalRate(rate: number) {
        this.subliminalRate = rate;
        if (this.ctx) {
            if (this.subliminalSource1x) {
                this.subliminalSource1x.playbackRate.setTargetAtTime(rate, this.ctx.currentTime, 0.1);
            }
            if (this.subliminalSource2x) {
                this.subliminalSource2x.playbackRate.setTargetAtTime(rate * 2.1, this.ctx.currentTime, 0.1);
            }
        }
    }

    public toggle8D(enabled: boolean, rotationHz: number = 0.1) {
        if (!this.ctx || !this.spatialPanner) return;

        if (this.spatialLFO) {
            if (!enabled) {
                this.spatialLFO.stop();
                this.spatialLFO.disconnect();
                this.spatialLFO = null;
                this.spatialPanner.pan.setTargetAtTime(0, this.ctx.currentTime, 0.1);
            } else {
                // Smoothly update frequency instead of full restart if possible
                this.spatialLFO.frequency.setTargetAtTime(rotationHz, this.ctx.currentTime, 0.5);
            }
        } else if (enabled) {
            this.spatialLFO = this.ctx.createOscillator();
            this.spatialLFO.frequency.setValueAtTime(rotationHz, this.ctx.currentTime);
            this.spatialLFO.connect(this.spatialPanner.pan);
            this.spatialLFO.start();
        }
    }

    public getContext(): AudioContext | null {
        return this.ctx;
    }
}
