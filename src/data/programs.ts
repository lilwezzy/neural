export interface NeuralProgram {
    id: string;
    name: string;
    category: 'Wealth' | 'Memory' | 'Healing' | 'Performance' | 'Reality' | 'Social' | 'Transcendence';
    description: string;
    carrierFreq: number;
    entrainmentFreq: number;
    mode: 'binaural' | 'isochronic';
    spatial8D: boolean;
    subliminalDensity: number;
    subliminalVol: number;
    affirmations: string[];
}

export const NEURAL_PROGRAMS: NeuralProgram[] = [
    // --- WEALTH ---
    {
        id: 'money-magnet',
        name: 'Money Magnet',
        category: 'Wealth',
        description: 'Rewire poverty triggers into high-frequency abundance alignment.',
        carrierFreq: 432,
        entrainmentFreq: 7.83,
        mode: 'binaural',
        spatial8D: true,
        subliminalDensity: 3.8,
        subliminalVol: 0.2,
        affirmations: [
            "Disengage from the self. Become pure consciousness in the vacuum of all possibility.",
            "Tune into the resonance of Earth's heartbeat. Align with the frequency of gold.",
            "You are a vortex of attraction. Money effortlessly seeks your unique signature.",
            "Release the outcome. It is already manifesting in the field. It is done."
        ]
    },
    {
        id: 'wealth-architect',
        name: 'Wealth Architect',
        category: 'Wealth',
        description: 'Structural reorganization of the wealth-mindset via architectural patterns.',
        carrierFreq: 432,
        entrainmentFreq: 14,
        mode: 'isochronic',
        spatial8D: true,
        subliminalDensity: 4.5,
        subliminalVol: 0.2,
        affirmations: [
            "Deconstruct the architecture of finite thinking. Enter the infinite blueprint.",
            "Construct new neural pathways of structural wealth. Built on permanent foundation.",
            "You are the master architect of your financial reality. Material result of frequency.",
            "Seal the blueprint into your subconscious. The structure is established. It is done."
        ]
    },
    {
        id: 'wealth-singularity',
        name: 'Wealth Singularity',
        category: 'Wealth',
        description: 'Advanced alignment with global supply chains and universal flow.',
        carrierFreq: 852,
        entrainmentFreq: 7.83,
        mode: 'binaural',
        spatial8D: true,
        subliminalDensity: 5.0,
        subliminalVol: 0.2,
        affirmations: [
            "Align your signature with the frequency of global supply. You are the source.",
            "Move from the particle of lack to the wave of infinite wealth. No body, no place.",
            "Financial miracles are converging on your current coordinates. Miracles are default.",
            "The universe is reflecting your inner state of I Am Much. It is done."
        ]
    },

    // --- MEMORY ---
    {
        id: 'memory-genus-40hz',
        name: 'GENUS 40Hz Memory',
        category: 'Memory',
        description: '40Hz Gamma protocol for peak synaptic plasticity and instant recall.',
        carrierFreq: 432,
        entrainmentFreq: 40,
        mode: 'isochronic',
        spatial8D: true,
        subliminalDensity: 4.2,
        subliminalVol: 0.15,
        affirmations: [
            "Become space. No body, no thing, no one. Surrender the identity of the past.",
            "Tune into the frequency of absolute clarity. Brain is wiring patterns of genius.",
            "You are signaling new genes for peak cognitive processing. Quantum recall active.",
            "Collapse the wave of infinite intelligence into your biology. It is done."
        ]
    },

    // --- HEALING ---
    {
        id: 'dna-regen',
        name: 'DNA REGEN',
        category: 'Healing',
        description: 'Surgical sub-mix for cellular reconstruction and genetic repair.',
        carrierFreq: 528,
        entrainmentFreq: 4.5,
        mode: 'binaural',
        spatial8D: true,
        subliminalDensity: 4.8,
        subliminalVol: 0.15,
        affirmations: [
            "Signal new genes for absolute health. Cells bathed in blueprint of perfection.",
            "The body is a field of infinite repair. Returning to original divine status.",
            "Dissolve the energetic knots of physical stress. Melt into the healing field.",
            "Your biology is the mirror of your high-frequency soul. It is done."
        ]
    },
    {
        id: 'vagus-reset',
        name: 'Vagus Nerve Reset',
        category: 'Healing',
        description: 'Instant parasympathetic activation and fight-or-flight shutdown.',
        carrierFreq: 174,
        entrainmentFreq: 0.1,
        mode: 'binaural',
        spatial8D: false,
        subliminalDensity: 3.0,
        subliminalVol: 0.2,
        affirmations: [
            "Your nervous system returns to zero. Absolute safety is your baseline.",
            "The battle is over. Surrender the survival mind to the generous present moment.",
            "Every breath signals peace to the field. Your vessel is at rest.",
            "Step into the stillness. The healing surge is active. It is done."
        ]
    },
    {
        id: 'elevated-emotions',
        name: 'Elevated Emotions',
        category: 'Healing',
        description: 'Heart-brain coherence protocol for gratitude, bliss, and emotional alignment.',
        carrierFreq: 528,
        entrainmentFreq: 10,
        mode: 'binaural',
        spatial8D: true,
        subliminalDensity: 3.5,
        subliminalVol: 0.2,
        affirmations: [
            "Tune into the coherent frequency of the heart. Experience the gratitude now.",
            "Joy is your primary biological signal. Every cell is bathed in the light of the now.",
            "You are the receiver of infinite love and surplus. Your heart is an open portal.",
            "Gratitude is the signature of the having. It is already done."
        ]
    },
    {
        id: 'restore-1.0',
        name: 'Restore 1.0',
        category: 'Healing',
        description: 'Pure 1Hz Delta for deep systemic reboot and restorative rest.',
        carrierFreq: 174,
        entrainmentFreq: 1,
        mode: 'binaural',
        spatial8D: false,
        subliminalDensity: 3.0,
        subliminalVol: 0.2,
        affirmations: [
            "Systemic reboot active. Every organ returns to zero point.",
            "Deep restorative rest is your primary script. The body heals.",
            "Signal the field for total recovery. The cycle is renewed.",
            "Enter the deep sleep of the gods. Restoration is done."
        ]
    },

    // --- PERFORMANCE & HABITS ---
    {
        id: 'habit-breaker',
        name: 'Habit Breaker',
        category: 'Performance',
        description: 'Dissolves deep-seated neural loops and conditioning.',
        carrierFreq: 432,
        entrainmentFreq: 7.83,
        mode: 'isochronic',
        spatial8D: true,
        subliminalDensity: 4.5,
        subliminalVol: 0.2,
        affirmations: [
            "Bypass the old neural loop. The predatory pattern is dissolved.",
            "You are the master architect of your new choices. Identity is fluid.",
            "The pull of the past is gone. You are anchored in the new timeline.",
            "Break the gravity of the old self. Become the vacuum of all possibility."
        ]
    },
    {
        id: 'dopamine-reset',
        name: 'Dopamine Reset',
        category: 'Performance',
        description: 'Neural fasting to restore focus and high-value motivation.',
        carrierFreq: 432,
        entrainmentFreq: 10,
        mode: 'isochronic',
        spatial8D: false,
        subliminalDensity: 3.5,
        subliminalVol: 0.2,
        affirmations: [
            "Free from the loop of immediate gratification. High-value focus is active.",
            "Reset the reward center. Find the peace in the non-doing. No mind.",
            "Deep concentration is your natural state. The noise is silenced.",
            "You are the master of your attention. The reset is established. It is done."
        ]
    },
    {
        id: 'peak-flow',
        name: 'Peak Flow',
        category: 'Performance',
        description: 'Effortless action and the Alpha-state bridge.',
        carrierFreq: 432,
        entrainmentFreq: 10,
        mode: 'binaural',
        spatial8D: true,
        subliminalDensity: 4.2,
        subliminalVol: 0.2,
        affirmations: [
            "Disengage the analytical mind. You are the wave, flowing through the field.",
            "Action and awareness become one. Effort is a memory. Result is certain.",
            "You are signaling peak performance to every muscle and neuron. In the zone.",
            "Surrender to the momentum of the field. The result is already ours."
        ]
    },
    {
        id: 'the-zone',
        name: 'The Zone',
        category: 'Performance',
        description: 'Elite athletic focus and deep motor-neuron coordination.',
        carrierFreq: 432,
        entrainmentFreq: 12.5,
        mode: 'isochronic',
        spatial8D: true,
        subliminalDensity: 4.5,
        subliminalVol: 0.2,
        affirmations: [
            "Time slows down. You are the immovable center of action.",
            "Every movement is precise. Every neuron is aligned with the goal.",
            "You are signaling peak physical power to the field. Effortless mastery.",
            "Stay in the zone. The result is already established. It is done."
        ]
    },
    {
        id: 'the-indestructible',
        name: 'The Indestructible',
        category: 'Performance',
        description: 'Unshakeable confidence and mental resilience protocol.',
        carrierFreq: 174,
        entrainmentFreq: 15,
        mode: 'binaural',
        spatial8D: false,
        subliminalDensity: 4.0,
        subliminalVol: 0.2,
        affirmations: [
            "You are indestructible. Resistance is the fuel for your growth.",
            "Your center cannot be moved. You are the anchor of the field.",
            "Fear is a shadow that vanishes in your light. Absolute confidence.",
            "The script of power is written in your biology. It is done."
        ]
    },

    // --- SOCIAL & CHARISMA ---
    {
        id: 'magnetic-voice',
        name: 'Magnetic Voice',
        category: 'Social',
        description: 'Commanding articulation and effortlessly resonant speech.',
        carrierFreq: 741,
        entrainmentFreq: 14,
        mode: 'isochronic',
        spatial8D: false,
        subliminalDensity: 5.0,
        subliminalVol: 0.2,
        affirmations: [
            "Your voice is a frequency of absolute truth. resonant and clear.",
            "Others are magnetically drawn to your clarity. You command the field.",
            "The blockages of expression are dissolved. Words flow from the heart.",
            "Speak your reality into existence. The command is heard. It is done."
        ]
    },
    {
        id: 'executive-presence',
        name: 'Executive Presence',
        category: 'Social',
        description: 'The "Immovable Center" protocol for power and authority.',
        carrierFreq: 741,
        entrainmentFreq: 15,
        mode: 'binaural',
        spatial8D: false,
        subliminalDensity: 4.0,
        subliminalVol: 0.2,
        affirmations: [
            "You are the immovable center of the room. Gravity aligns with you.",
            "Quiet the survival mind. Step into the authority of the Soul.",
            "Presence is your primary signal. Words are secondary. You are the King.",
            "Command respect with absolute stillness. The field obeys the center."
        ]
    },
    {
        id: 'soulmate-sync',
        name: 'Soulmate Sync',
        category: 'Social',
        description: 'Magnetic frequency for attracting a divine match or soulmate.',
        carrierFreq: 639,
        entrainmentFreq: 6.3,
        mode: 'binaural',
        spatial8D: true,
        subliminalDensity: 3.0,
        subliminalVol: 0.2,
        affirmations: [
            "Broadcast the signature of unconditional love. Your soulmate is magnetically drawn to you.",
            "Your heart is a lighthouse in the field. The one you seek is finding you now.",
            "Align with the frequency of perfect union. The match is already established in the field.",
            "Open your vessel to receive the divine mirror of your soul. The sync is done."
        ]
    },
    {
        id: 'the-negotiator',
        name: 'The Negotiator',
        category: 'Social',
        description: 'Winning outcomes through harmony and analytical precision.',
        carrierFreq: 639,
        entrainmentFreq: 14,
        mode: 'isochronic',
        spatial8D: false,
        subliminalDensity: 4.5,
        subliminalVol: 0.2,
        affirmations: [
            "Negotiate from the center of power and peace. Everyone wins.",
            "Your words are bridges to agreement. The deal is established.",
            "Clarity is your weapon. Harmony is your shield. Win with ease.",
            "The outcome fulfills your highest intent. The contract is done."
        ]
    },

    // --- REALITY & TRANSCENDENCE ---
    {
        id: 'heart-brain-sync',
        name: 'Heart-Brain Sync',
        category: 'Reality',
        description: 'Precision alignment between cardiac rhythm and neural oscillation.',
        carrierFreq: 528,
        entrainmentFreq: 0.1,
        mode: 'binaural',
        spatial8D: true,
        subliminalDensity: 4.0,
        subliminalVol: 0.2,
        affirmations: [
            "Harmonize the rhythm of the heart with the signal of the brain. The coherence is absolute.",
            "Breathe into the center of your chest. Send the pulse of love into your neural network.",
            "Your heart is the engine. Your brain is the antenna. They are now one.",
            "Synchronize your biological signature with the frequency of your highest potential. It is done."
        ]
    },
    {
        id: 'the-observer',
        name: 'The Observer',
        category: 'Transcendence',
        description: 'Advanced Ego-dissolution and non-dual awareness.',
        carrierFreq: 174,
        entrainmentFreq: 0.5,
        mode: 'binaural',
        spatial8D: false,
        subliminalDensity: 2.5,
        subliminalVol: 0.2,
        affirmations: [
            "No body, no thing, no one. You are the silent observer of the field.",
            "The ego is a memory. Pure consciousness is the only reality.",
            "Melt into the blackness of infinite possibility. The gap is open.",
            "Observe the wave from the perspective of the void. It is done."
        ]
    },
    {
        id: 'quantum-aha',
        name: 'Quantum Collapse',
        category: 'Transcendence',
        description: 'Instantaneous manifestation via the collapse of the quantum wave.',
        carrierFreq: 963,
        entrainmentFreq: 40,
        mode: 'isochronic',
        spatial8D: true,
        subliminalDensity: 6.0,
        subliminalVol: 0.2,
        affirmations: [
            "Step into the vacuum of all possibility. Collapse the quantum field into your intent.",
            "You are the observer and the observed. Shape reality through the focus of the heart.",
            "Pull the wave of infinite possibility into the particle of the now. It is manifest.",
            "Command the void to reflect your inner signature. The collapse is done."
        ]
    }
];
