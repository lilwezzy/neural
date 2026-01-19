import { useState, useEffect } from 'react';
import { AudioEngine } from '../engine/AudioEngine';
import Spectrogram from './Spectrogram';
import { NEURAL_PROGRAMS } from '../data/programs';

const audioEngine = new AudioEngine();

export default function Dashboard() {
    // --- PERSISTED STATE ---
    const [engineOn, setEngineOn] = useState(() => localStorage.getItem('engineOn') === 'true');
    const [masterVol, setMasterVol] = useState(() => parseFloat(localStorage.getItem('masterVol') || '0.5'));
    const [subliminalVol, setSubliminalVol] = useState(() => parseFloat(localStorage.getItem('subliminalVol') || '0.05')); // Default lower for safer start
    const [subliminalOn, setSubliminalOn] = useState(() => localStorage.getItem('subliminalOn') === 'true');
    const [spatial8D, setSpatial8D] = useState(() => localStorage.getItem('spatial8D') !== 'false');
    const [selectedProgramId, setSelectedProgramId] = useState(() => localStorage.getItem('selectedProgramId') || NEURAL_PROGRAMS[0].id);

    // --- NON-PERSISTED SESSION STATE ---
    const [beatHz] = useState(10);
    const [isBufferLoading, setIsBufferLoading] = useState(false);
    const [diagnosticMode, setDiagnosticMode] = useState(false);

    // LocalStorage Effect
    useEffect(() => {
        localStorage.setItem('engineOn', engineOn.toString());
        localStorage.setItem('masterVol', masterVol.toString());
        localStorage.setItem('subliminalVol', subliminalVol.toString());
        localStorage.setItem('subliminalOn', subliminalOn.toString());
        localStorage.setItem('spatial8D', spatial8D.toString());
        localStorage.setItem('selectedProgramId', selectedProgramId);
    }, [engineOn, masterVol, subliminalVol, subliminalOn, spatial8D, selectedProgramId]);

    // --- CONSOLIDATED AUDIO CONTROLLER ---
    useEffect(() => {
        let isActive = true;

        const syncAudio = async () => {
            if (!engineOn) {
                audioEngine.stopAll();
                return;
            }

            await audioEngine.init();
            if (!isActive) return;

            const prog = NEURAL_PROGRAMS.find(p => p.id === selectedProgramId);
            if (!prog) return;

            // 1. Initial Entrainment Start
            audioEngine.startBinaural(prog.carrierFreq, beatHz, true);

            // 2. Buffer Synchronization
            if (subliminalOn) {
                setIsBufferLoading(true);
                try {
                    const url = `/audio/affirmations/${prog.id}.wav`;
                    const buffer = await audioEngine.loadAudioBuffer(url);
                    if (!isActive) return;

                    audioEngine.setSubliminalBuffer(buffer);
                    audioEngine.startSubliminal(diagnosticMode);
                } catch (err) {
                    console.warn(`Neural Engine: State sync failed for ${selectedProgramId}:`, err);
                    audioEngine.setSubliminalBuffer(null);
                } finally {
                    if (isActive) setIsBufferLoading(false);
                }
            } else {
                audioEngine.stopSubliminal();
                setIsBufferLoading(false);
            }
        };

        syncAudio();

        return () => {
            isActive = false;
        };
    }, [engineOn, subliminalOn, selectedProgramId, beatHz, diagnosticMode]);

    // --- REAL-TIME PARAMETER SYNC ---

    const fmt = (val: number) => `${Math.round(val * 100)}%`;

    return (
        <div className="dashboard-container">
            <div className="header">
                <h1>NEURAL ENGINE</h1>
                <p>Maximum Entrainment Signal Stack</p>
            </div>
            <div className="program-select card" style={{ marginBottom: '2rem' }}>
                <h3>Active Neural Protocol</h3>
                <select value={selectedProgramId} onChange={(e) => setSelectedProgramId(e.target.value)}>
                    {NEURAL_PROGRAMS.map(p => (
                        <option key={p.id} value={p.id}>{p.name} — {p.category}</option>
                    ))}
                </select>
            </div>

            <div className="slider-container slider-lime">
                <div className="slider-label">
                    <span>System Master Volume</span>
                    <span className="slider-value">{fmt(masterVol)}</span>
                </div>
                <input
                    type="range"
                    min="0" max="1" step="0.01"
                    value={masterVol}
                    onChange={(e) => setMasterVol(parseFloat(e.target.value))}
                />
            </div>

            <div className="controls-grid">
                <div className="card">
                    <h3>Neural Carrier</h3>
                    <div className="toggle-switch">
                        <label className="switch">
                            <input
                                type="checkbox"
                                checked={engineOn}
                                onChange={(e) => setEngineOn(e.target.checked)}
                            />
                            <span className="slider-round"></span>
                        </label>
                    </div>
                </div>

                <div className="card">
                    <h3>8D Spatial Orbit</h3>
                    <div className="toggle-switch">
                        <label className="switch">
                            <input
                                type="checkbox"
                                checked={spatial8D}
                                onChange={(e) => setSpatial8D(e.target.checked)}
                            />
                            <span className="slider-round"></span>
                        </label>
                    </div>
                    <div style={{ textAlign: 'center', fontSize: '0.6rem', color: '#666', letterSpacing: '0.1em' }}>
                        10S ROTATION CYCLE
                    </div>
                </div>

                <div className="card">
                    <h3>Silent Subliminal</h3>
                    <div className="toggle-switch">
                        <label className="switch">
                            <input
                                type="checkbox"
                                checked={subliminalOn}
                                onChange={(e) => setSubliminalOn(e.target.checked)}
                            />
                            <span className="slider-round"></span>
                        </label>
                    </div>

                    <div className={`slider-container slider-purple ${isBufferLoading ? 'loading-pulse' : ''}`} style={{ marginTop: '1rem', marginBottom: '0.5rem' }}>
                        <div className="slider-label" style={{ fontSize: '0.6rem' }}>
                            <span>{isBufferLoading ? 'FETCHING NEURAL BUFFER...' : 'Subliminal Level'}</span>
                            <span className="slider-value">{fmt(subliminalVol)}</span>
                        </div>
                        <input
                            type="range"
                            min="0" max="1" step="0.01"
                            value={subliminalVol}
                            onChange={(e) => setSubliminalVol(parseFloat(e.target.value))}
                            disabled={isBufferLoading}
                        />
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '0.5rem' }}>
                        <div style={{ fontSize: '0.5rem', color: diagnosticMode ? '#4ade80' : '#444', fontWeight: 800 }}>
                            {diagnosticMode ? 'AUDIBLE MONITOR ACTIVE' : 'SILENT MODE'}
                        </div>
                        <label className="switch" style={{ width: '30px', height: '16px' }}>
                            <input
                                type="checkbox"
                                checked={diagnosticMode}
                                onChange={(e) => setDiagnosticMode(e.target.checked)}
                            />
                            <span className="slider-round small-toggle"></span>
                        </label>
                    </div>

                    <div style={{ textAlign: 'center', fontSize: '0.6rem', color: '#666', letterSpacing: '0.1em', marginTop: '0.5rem' }}>
                        {isBufferLoading ? 'SYNCHRONIZING DUAL-STREAMS...' : 'BLUETOOTH-OPTIMIZED (15KHZ)'}
                    </div>
                </div>
            </div>

            <div className="spectrogram-section">
                <Spectrogram analyzer={audioEngine.analyzer} />
            </div>

            <button
                className={`init-btn ${engineOn ? 'active' : ''}`}
                style={{ marginTop: '2rem' }}
                onClick={() => setEngineOn(!engineOn)}
            >
                {engineOn ? 'SYSTEM ACTIVE' : 'INITIALIZE SYSTEM'}
            </button>
        </div>
    );
}
