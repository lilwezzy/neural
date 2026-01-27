import { useState, useEffect, useRef } from 'react';
import { AudioEngine } from '../engine/AudioEngine';
import Spectrogram from './Spectrogram';
import { NEURAL_PROGRAMS, type NeuralProgram } from '../data/programs';
import { NeuralBackground } from './NeuralBackground';
import { useSessionHistory, usePreferences } from '../hooks/useSession';
import { canAccessProgram } from '../data/pricing';
import PricingModal from './PricingModal';

const audioEngine = new AudioEngine();

export default function Dashboard() {
    // --- PERSISTED STATE (from hooks) ---
    const { masterVolume, setMasterVolume, subliminalVolume, setSubliminalVolume, lastProgram, setLastProgram } = usePreferences();
    const { sessions, addSession, clearSessions, getTotalTime } = useSessionHistory();

    // --- LOCAL STATE ---
    const [engineOn, setEngineOn] = useState(false);
    const [subliminalOn, setSubliminalOn] = useState(true);
    const [spatial8D, setSpatial8D] = useState(true);
    const [selectedProgramId, setSelectedProgramId] = useState(lastProgram || NEURAL_PROGRAMS[0].id);
    const [masterVol, setMasterVol] = useState(masterVolume);
    const [subliminalVol, setSubliminalVol] = useState(subliminalVolume);

    // --- SESSION TRACKING ---
    const sessionStartRef = useRef<number | null>(null);
    const currentProgramRef = useRef<NeuralProgram>(NEURAL_PROGRAMS[0]);

    // --- NON-PERSISTED SESSION STATE ---
    const [beatHz] = useState(10);
    const [isBufferLoading, setIsBufferLoading] = useState(false);
    const [diagnosticMode, setDiagnosticMode] = useState(false);
    const [currentAffirmationIndex, setCurrentAffirmationIndex] = useState(0);
    const [showAffirmation, setShowAffirmation] = useState(false);
    const [showPricing, setShowPricing] = useState(false);
    const [lockedProgram, setLockedProgram] = useState<NeuralProgram | null>(null);

    const activeProg = NEURAL_PROGRAMS.find(p => p.id === selectedProgramId) || NEURAL_PROGRAMS[0];
    currentProgramRef.current = activeProg;

    // Track session when engine turns on/off
    useEffect(() => {
        if (engineOn) {
            sessionStartRef.current = Date.now();
        } else if (sessionStartRef.current !== null) {
            const duration = Math.round((Date.now() - sessionStartRef.current) / 1000);
            if (duration >= 10) {
                addSession(activeProg.id, activeProg.name, activeProg.category, duration);
            }
            sessionStartRef.current = null;
        }
    }, [engineOn, activeProg]);

    // Sync last program
    useEffect(() => {
        setLastProgram(selectedProgramId);
    }, [selectedProgramId, setLastProgram]);

    // Affirmation Cycle
    useEffect(() => {
        if (!engineOn || !subliminalOn) {
            setShowAffirmation(false);
            return;
        }

        const cycle = setInterval(() => {
            setShowAffirmation(false);
            setTimeout(() => {
                setCurrentAffirmationIndex(prev => (prev + 1) % activeProg.affirmations.length);
                setShowAffirmation(true);
            }, 2000);
        }, 12000);

        setShowAffirmation(true);
        return () => clearInterval(cycle);
    }, [engineOn, subliminalOn, selectedProgramId, activeProg.affirmations.length]);

    // Update preferences when volumes change
    useEffect(() => {
        setMasterVolume(masterVol);
    }, [masterVol, setMasterVolume]);

    useEffect(() => {
        setSubliminalVolume(subliminalVol);
    }, [subliminalVol, setSubliminalVolume]);

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

            // 1. Initial Entrainment Start
            audioEngine.startBinaural(activeProg.carrierFreq, beatHz, true);

            // 2. Buffer Synchronization
            if (subliminalOn) {
                setIsBufferLoading(true);
                try {
                    const url = `/audio/affirmations/${activeProg.id}.wav`;
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
    }, [engineOn, subliminalOn, selectedProgramId, beatHz, diagnosticMode, activeProg]);

    // --- REAL-TIME PARAMETER SYNC ---
    useEffect(() => {
        if (engineOn && audioEngine.isInitialized()) {
            audioEngine.setMasterVolume(masterVol);
            audioEngine.setEntrainmentVolume(1.0);
            audioEngine.setSubliminalVolume(subliminalVol);
            audioEngine.toggle8D(spatial8D, 0.1);
        }
    }, [masterVol, subliminalVol, spatial8D, engineOn]);

    const fmt = (val: number) => `${Math.round(val * 100)}%`;

    return (
        <>
            <NeuralBackground
                pulseRate={activeProg.entrainmentFreq}
                active={engineOn}
            />

            <div className="dashboard-container">
                <div className="header">
                    <img src="/neural-shift-header.png" alt="Neural Shift" className="brand-header-img" />
                </div>
                <div className="program-select card" style={{ marginBottom: '2rem', minHeight: '120px', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                        <h3 style={{ margin: 0 }}>Active Neural Protocol</h3>
                        <select value={selectedProgramId} onChange={(e) => setSelectedProgramId(e.target.value)} style={{ width: 'auto', maxWidth: '60%' }}>
                            {NEURAL_PROGRAMS.map(p => {
                                const isLocked = !canAccessProgram(p.id);
                                return (
                                    <option key={p.id} value={p.id}>
                                        {p.name} — {p.category}{isLocked ? ' 🔒' : ''}
                                    </option>
                                );
                            })}
                        </select>
                    </div>

                    {!canAccessProgram(activeProg.id) && (
                        <div className="locked-banner">
                            <span>🔒</span> This program requires Pro. 
                            <button onClick={() => { setLockedProgram(activeProg); setShowPricing(true); }}>
                                Upgrade Now
                            </button>
                        </div>
                    )}

                    {subliminalOn && engineOn && (
                        <div className="card-affirmation-display">
                            <div className={`affirmation-text ${showAffirmation ? 'visible' : ''}`}>
                                {activeProg.affirmations[currentAffirmationIndex]}
                            </div>
                        </div>
                    )}
                </div>

                <div className="spectrogram-section" style={{ marginBottom: '2rem' }}>
                    <Spectrogram analyzer={audioEngine.analyzer} />
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
                                <span className="slider-round toggle-purple"></span>
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
                                <span className="slider-round toggle-green"></span>
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
                                <span className="slider-round toggle-purple"></span>
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


                <button
                    className={`init-btn ${engineOn ? 'active' : ''}`}
                    style={{ marginTop: '2rem' }}
                    onClick={() => {
                        if (!engineOn && !canAccessProgram(activeProg.id)) {
                            setLockedProgram(activeProg);
                            setShowPricing(true);
                        } else {
                            setEngineOn(!engineOn);
                        }
                    }}
                >
                    {!canAccessProgram(activeProg.id) 
                        ? '🔒 UPGRADE TO UNLOCK' 
                        : engineOn ? 'SYSTEM ACTIVE' : 'INITIALIZE SYSTEM'}
                </button>

                {/* Session Stats */}
                <div className="card" style={{ marginTop: '2rem', fontSize: '0.75rem' }}>
                    <details>
                        <summary style={{ cursor: 'pointer', userSelect: 'none' }}>
                            📊 Your Progress ({sessions.length} sessions)
                        </summary>
                        <div style={{ marginTop: '1rem', paddingTop: '1rem', borderTop: '1px solid #333' }}>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
                                <div>
                                    <div style={{ color: '#888', fontSize: '0.65rem' }}>TOTAL TIME</div>
                                    <div style={{ fontSize: '1.2rem', color: '#4ade80' }}>
                                        {Math.round(getTotalTime() / 60)} min
                                    </div>
                                </div>
                                <div>
                                    <div style={{ color: '#888', fontSize: '0.65rem' }}>PROGRAMS USED</div>
                                    <div style={{ fontSize: '1.2rem', color: '#6366f1' }}>
                                        {new Set(sessions.map(s => s.programId)).size}
                                    </div>
                                </div>
                            </div>
                            <div style={{ color: '#888', fontSize: '0.65rem', marginBottom: '0.5rem' }}>RECENT SESSIONS</div>
                            {sessions.slice(0, 5).map((session) => (
                                <div key={session.id} style={{ display: 'flex', justifyContent: 'space-between', padding: '0.25rem 0', borderBottom: '1px solid #222' }}>
                                    <span style={{ color: '#ccc' }}>{session.programName}</span>
                                    <span style={{ color: '#666' }}>{Math.round(session.duration / 60)}min</span>
                                </div>
                            ))}
                            <button
                                onClick={() => {
                                    if (confirm('Clear all session history?')) {
                                        clearSessions();
                                    }
                                }}
                                style={{ marginTop: '1rem', background: 'transparent', border: '1px solid #444', color: '#666', padding: '0.5rem 1rem', cursor: 'pointer', fontSize: '0.7rem' }}
                            >
                                Clear History
                            </button>
                        </div>
                    </details>
                </div>
            </div>

            {/* Pricing Modal */}
            <PricingModal
                isOpen={showPricing}
                onClose={() => setShowPricing(false)}
                requestedProgram={lockedProgram}
                trigger="paywall"
            />

            <style>{`
                .locked-banner {
                    background: linear-gradient(135deg, rgba(99, 102, 241, 0.2), rgba(139, 92, 246, 0.2));
                    border: 1px solid #6366f1;
                    border-radius: 8px;
                    padding: 1rem;
                    margin-top: 1rem;
                    display: flex;
                    align-items: center;
                    gap: 0.5rem;
                    font-size: 0.9rem;
                    color: #ccc;
                }
                
                .locked-banner button {
                    background: linear-gradient(135deg, #6366f1, #8b5cf6);
                    border: none;
                    color: white;
                    padding: 0.5rem 1rem;
                    border-radius: 6px;
                    cursor: pointer;
                    font-weight: 600;
                    margin-left: auto;
                }
                
                .locked-banner button:hover {
                    transform: translateY(-1px);
                }
            `}</style>
        </>
    );
}
