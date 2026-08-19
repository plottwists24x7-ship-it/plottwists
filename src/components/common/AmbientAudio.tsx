"use client";

import { useEffect, useRef, useState } from "react";

interface AmbientAudioProps {
  scrollProgress: number; // 0 to 1
  scrollVelocity: number; // velocity to dim volume when scrolling fast
  activeScene: number;    // 0 to 6 representing current room
  shouldPlay?: boolean;   // Triggered by parent cinematic loader
}

interface AudioKeyframe {
  p: number;
  windGain: number;
  windFreq: number;
  humGain: number;
  delayTime: number;
  feedback: number;
}

const audioKeyframes: AudioKeyframe[] = [
  { p: 0.00, windGain: 0.02, windFreq: 120, humGain: 0.04, delayTime: 0.10, feedback: 0.12 },
  { p: 0.05, windGain: 0.02, windFreq: 120, humGain: 0.04, delayTime: 0.10, feedback: 0.12 },
  { p: 0.18, windGain: 0.15, windFreq: 220, humGain: 0.12, delayTime: 0.05, feedback: 0.06 },
  { p: 0.32, windGain: 0.05, windFreq: 300, humGain: 0.06, delayTime: 0.14, feedback: 0.25 },
  { p: 0.46, windGain: 0.03, windFreq: 200, humGain: 0.00, delayTime: 0.18, feedback: 0.30 },
  { p: 0.60, windGain: 0.25, windFreq: 400, humGain: 0.00, delayTime: 0.12, feedback: 0.35 },
  { p: 0.74, windGain: 0.08, windFreq: 180, humGain: 0.00, delayTime: 0.28, feedback: 0.68 },
  { p: 0.86, windGain: 0.35, windFreq: 350, humGain: 0.00, delayTime: 0.10, feedback: 0.15 },
  { p: 0.94, windGain: 0.00, windFreq: 100, humGain: 0.00, delayTime: 0.00, feedback: 0.00 },
  { p: 1.00, windGain: 0.00, windFreq: 50,  humGain: 0.00, delayTime: 0.00, feedback: 0.00 },
];

function getInterpolatedTarget(p: number) {
  let i = 0;
  while (i < audioKeyframes.length - 1 && p > audioKeyframes[i + 1].p) {
    i++;
  }
  const k0 = audioKeyframes[i];
  const k1 = audioKeyframes[i + 1];
  const t = (p - k0.p) / (k1.p - k0.p);

  return {
    windGain: k0.windGain + (k1.windGain - k0.windGain) * t,
    windFreq: k0.windFreq + (k1.windFreq - k0.windFreq) * t,
    humGain: k0.humGain + (k1.humGain - k0.humGain) * t,
    delayTime: k0.delayTime + (k1.delayTime - k0.delayTime) * t,
    feedback: k0.feedback + (k1.feedback - k0.feedback) * t,
  };
}

export default function AmbientAudio({
  scrollProgress,
  scrollVelocity,
  activeScene,
  shouldPlay = false,
}: AmbientAudioProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [showCaption, setShowCaption] = useState("");
  const audioCtxRef = useRef<AudioContext | null>(null);

  // Nodes references for dynamic modulation
  const masterGainRef = useRef<GainNode | null>(null);
  const windFilterRef = useRef<BiquadFilterNode | null>(null);
  const windGainRef = useRef<GainNode | null>(null);
  const humGainRef = useRef<GainNode | null>(null);
  const creakGainRef = useRef<GainNode | null>(null);

  // Spatial Acoustic Reflections Nodes
  const delayNodeRef = useRef<DelayNode | null>(null);
  const feedbackGainRef = useRef<GainNode | null>(null);

  // LFO & noise buffer nodes
  const noiseSourceRef = useRef<AudioBufferSourceNode | null>(null);
  const captionTimeoutRef = useRef<number | null>(null);
  const isPlayingRef = useRef(false);

  // Keep ref of isPlaying for async safety
  useEffect(() => {
    isPlayingRef.current = isPlaying;
  }, [isPlaying]);

  const startAudio = async () => {
    if (audioCtxRef.current) {
      if (audioCtxRef.current.state === "suspended") {
        await audioCtxRef.current.resume();
      }
      setIsPlaying(true);
      return;
    }

    // Initialize AudioContext
    const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    const ctx = new AudioContextClass();
    audioCtxRef.current = ctx;

    // Master Gain
    const masterGain = ctx.createGain();
    masterGain.gain.setValueAtTime(0, ctx.currentTime);
    masterGain.connect(ctx.destination);
    masterGainRef.current = masterGain;

    // 1. Generate Warm Pink Noise for Wind Ambience
    const bufferSize = ctx.sampleRate * 2;
    const noiseBuffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const output = noiseBuffer.getChannelData(0);

    let b0 = 0.0, b1 = 0.0, b2 = 0.0, b3 = 0.0, b4 = 0.0, b5 = 0.0, b6 = 0.0;
    for (let i = 0; i < bufferSize; i++) {
      const white = Math.random() * 2 - 1;
      b0 = 0.99886 * b0 + white * 0.0555179;
      b1 = 0.99332 * b1 + white * 0.0750759;
      b2 = 0.96900 * b2 + white * 0.1538520;
      b3 = 0.86650 * b3 + white * 0.3104856;
      b4 = 0.55000 * b4 + white * 0.5329522;
      b5 = -0.7616 * b5 - white * 0.0168980;
      output[i] = b0 + b1 + b2 + b3 + b4 + b5 + b6 + white * 0.5362;
      output[i] *= 0.11;
      b6 = white * 0.115926;
    }

    const noiseSource = ctx.createBufferSource();
    noiseSource.buffer = noiseBuffer;
    noiseSource.loop = true;

    // Wind filter
    const windFilter = ctx.createBiquadFilter();
    windFilter.type = "lowpass";
    windFilter.frequency.setValueAtTime(250, ctx.currentTime);
    windFilter.Q.setValueAtTime(3, ctx.currentTime);

    const windGain = ctx.createGain();
    windGain.gain.setValueAtTime(0.12, ctx.currentTime);

    noiseSource.connect(windFilter);
    windFilter.connect(windGain);
    windGain.connect(masterGain);
    noiseSource.start();

    noiseSourceRef.current = noiseSource;
    windFilterRef.current = windFilter;
    windGainRef.current = windGain;

    // LFO for slow wind gusts
    const windLFO = ctx.createOscillator();
    windLFO.type = "sine";
    windLFO.frequency.setValueAtTime(0.08, ctx.currentTime);

    const windLFOGain = ctx.createGain();
    windLFOGain.gain.setValueAtTime(120, ctx.currentTime);

    windLFO.connect(windLFOGain);
    windLFOGain.connect(windFilter.frequency);
    windLFO.start();

    // 2. Continuous 50Hz Studio Hum
    const humOsc = ctx.createOscillator();
    humOsc.type = "sine";
    humOsc.frequency.setValueAtTime(50, ctx.currentTime);

    const humFilter = ctx.createBiquadFilter();
    humFilter.type = "lowpass";
    humFilter.frequency.setValueAtTime(100, ctx.currentTime);

    const humGain = ctx.createGain();
    humGain.gain.setValueAtTime(0.08, ctx.currentTime);

    humOsc.connect(humFilter);
    humFilter.connect(humGain);
    humGain.connect(masterGain);
    humOsc.start();
    humGainRef.current = humGain;

    // 3. Programmatic Creaks / Spacing impulses
    const creakGain = ctx.createGain();
    creakGain.gain.setValueAtTime(0.0, ctx.currentTime);
    creakGain.connect(masterGain);
    creakGainRef.current = creakGain;

    const triggerCreak = () => {
      if (!isPlayingRef.current || !audioCtxRef.current) return;
      const currentCtx = audioCtxRef.current;
      
      const creakOsc = currentCtx.createOscillator();
      creakOsc.type = "sawtooth";
      creakOsc.frequency.setValueAtTime(80, currentCtx.currentTime);

      const creakF = currentCtx.createBiquadFilter();
      creakF.type = "bandpass";
      creakF.frequency.setValueAtTime(180, currentCtx.currentTime);
      creakF.Q.setValueAtTime(8, currentCtx.currentTime);

      const cGain = currentCtx.createGain();
      cGain.gain.setValueAtTime(0, currentCtx.currentTime);

      const now = currentCtx.currentTime;
      cGain.gain.linearRampToValueAtTime(0.05, now + 0.1);
      for (let j = 0; j < 10; j++) {
        cGain.gain.setValueAtTime(Math.random() * 0.03 + 0.01, now + 0.1 + j * 0.05);
      }
      cGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.8);

      creakOsc.connect(creakF);
      creakF.connect(cGain);
      cGain.connect(creakGain);
      creakOsc.start();
      creakOsc.stop(now + 0.9);

      if (Math.random() > 0.5) {
        setShowCaption("soft wood creaking");
        if (captionTimeoutRef.current) clearTimeout(captionTimeoutRef.current);
        captionTimeoutRef.current = window.setTimeout(() => setShowCaption(""), 1200);
      }

      const delay = Math.random() * 15000 + 8000;
      setTimeout(triggerCreak, delay);
    };
    setTimeout(triggerCreak, 4000);

    // 4. Spatial Acoustic Reflections (Reverb Delay Line)
    const delayNode = ctx.createDelay();
    delayNode.delayTime.setValueAtTime(0.12, ctx.currentTime);

    const feedbackGain = ctx.createGain();
    feedbackGain.gain.setValueAtTime(0.25, ctx.currentTime);

    delayNode.connect(feedbackGain);
    feedbackGain.connect(delayNode);

    masterGain.connect(delayNode);
    delayNode.connect(ctx.destination);

    delayNodeRef.current = delayNode;
    feedbackGainRef.current = feedbackGain;

    // Fade-in Master Logarithmic Gain
    masterGain.gain.linearRampToValueAtTime(0.8, ctx.currentTime + 2.0);
    setIsPlaying(true);
  };

  const toggleSound = () => {
    if (isPlaying) {
      if (masterGainRef.current && audioCtxRef.current) {
        masterGainRef.current.gain.linearRampToValueAtTime(0, audioCtxRef.current.currentTime + 1.2);
        setTimeout(() => {
          setIsPlaying(false);
        }, 1200);
      }
    } else {
      startAudio();
    }
  };

  // Play immediately if shouldPlay changes from parent loader
  useEffect(() => {
    if (shouldPlay && !isPlaying) {
      startAudio();
    }
  }, [shouldPlay]);

  // Real-time continuous lerped parameters update based on scrollProgress
  useEffect(() => {
    if (!isPlaying || !audioCtxRef.current) return;
    const ctx = audioCtxRef.current;
    const now = ctx.currentTime;

    const targets = getInterpolatedTarget(scrollProgress);

    // 1. Interpolate wind node gains
    if (windGainRef.current && windFilterRef.current) {
      windGainRef.current.gain.setTargetAtTime(targets.windGain, now, 0.2);
      windFilterRef.current.frequency.setTargetAtTime(targets.windFreq, now, 0.3);
    }

    // 2. Interpolate hum drone node gains
    if (humGainRef.current) {
      humGainRef.current.gain.setTargetAtTime(targets.humGain, now, 0.2);
    }

    // 3. Interpolate spatial delay and feedback node parameters (cathedral reverb / echoes bleed)
    if (delayNodeRef.current && feedbackGainRef.current) {
      delayNodeRef.current.delayTime.setTargetAtTime(targets.delayTime, now, 0.3);
      feedbackGainRef.current.gain.setTargetAtTime(targets.feedback, now, 0.3);
    }
  }, [scrollProgress, isPlaying]);

  // Real-time Scroll Velocity & Logarithmic Progress Master Gain Modulations
  useEffect(() => {
    if (!isPlaying || !audioCtxRef.current || !masterGainRef.current) return;
    const ctx = audioCtxRef.current;
    const now = ctx.currentTime;

    // Dim volume if user scrolls rapidly
    const velocityScale = Math.max(0.2, 1 - Math.abs(scrollVelocity) * 0.015);
    
    // Logarithmic progress volume scale: fades wind to 0 from progress 0.90 to 1.0 (End becomes complete silence)
    const progressVolumeScale = scrollProgress > 0.90 ? Math.max(0, (1.0 - scrollProgress) / 0.10) : 1;
    
    const targetMasterVolume = 0.8 * velocityScale * progressVolumeScale;

    masterGainRef.current.gain.setTargetAtTime(targetMasterVolume, now, 0.4);
  }, [scrollVelocity, scrollProgress, isPlaying]);

  // Captions based on activeScene segment changes
  useEffect(() => {
    if (!isPlaying) return;

    let captionText = "";
    if (activeScene === 1) {
      captionText = "faint wind filtering through industrial window";
    } else if (activeScene === 4) {
      captionText = "friction of bristle brushes on cotton canvas";
    } else if (activeScene === 6) {
      captionText = "distant twilight wind chimes";
    }

    setShowCaption(captionText);
    if (captionTimeoutRef.current) clearTimeout(captionTimeoutRef.current);
    if (captionText) {
      captionTimeoutRef.current = window.setTimeout(() => setShowCaption(""), 3500);
    }
  }, [activeScene, isPlaying]);

  // Cleanup timeouts on unmount
  useEffect(() => {
    return () => {
      if (captionTimeoutRef.current) clearTimeout(captionTimeoutRef.current);
    };
  }, []);

  return (
    <div
      style={{
        position: "fixed",
        bottom: "24px",
        right: "32px",
        zIndex: 1000,
        display: "flex",
        flexDirection: "column",
        alignItems: "flex-end",
        gap: "8px",
      }}
      className="select-none text-right font-mono"
    >
      {/* Dynamic Soundscape captions */}
      {showCaption && (
        <span
          style={{
            fontSize: "0.68rem",
            color: "var(--color-sienna-oxide)",
            opacity: 0.7,
            letterSpacing: "0.05em",
            fontStyle: "italic",
            transition: "opacity 0.4s ease",
          }}
        >
          [ {showCaption} ]
        </span>
      )}

      {/* sound toggle trigger */}
      <button
        onClick={toggleSound}
        className="interactive-trigger p-1 text-xs border border-transparent hover:border-[var(--color-graphite-ink)] rounded-[2px] transition-all duration-300"
        style={{
          color: isPlaying ? "var(--color-graphite-ink)" : "var(--color-sienna-oxide)",
          opacity: 0.8,
          letterSpacing: "0.1em",
        }}
        aria-label="Toggle ambient exhibition sound"
      >
        {isPlaying ? "[ Sound On ]" : "[ Sound Off ]"}
      </button>
    </div>
  );
}
