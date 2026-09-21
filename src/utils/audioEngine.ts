// Procedural Web Audio Engine & Cinematic Soundtrack for Kung Fu Panda Interactive Experience
import { getAssetUrl } from './assetPath';

class SoundEngine {
  private ctx: AudioContext | null = null;
  private isMuted: boolean = true;
  private ambientGain: GainNode | null = null;
  private ambientOscs: OscillatorNode[] = [];
  private isAmbientPlaying: boolean = false;
  private musicAudio: HTMLAudioElement | null = null;
  private fadeAnimId: number | null = null;
  private readonly TARGET_MUSIC_VOL = 0.38;

  private initContext() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      this.ctx = new AudioCtx();
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  private initMusic() {
    if (!this.musicAudio && typeof window !== 'undefined') {
      this.musicAudio = new Audio();
      this.musicAudio.src = getAssetUrl('assets/panda_theme.mp3');
      this.musicAudio.loop = true;
      this.musicAudio.volume = 0;
      this.musicAudio.preload = 'auto';
    }
  }

  // Smooth cinematic ease-in-out volume ramp (fade in / fade out)
  private fadeMusic(targetVol: number, durationMs: number) {
    this.initMusic();
    if (!this.musicAudio) return;

    if (this.fadeAnimId !== null) {
      cancelAnimationFrame(this.fadeAnimId);
      this.fadeAnimId = null;
    }

    const audio = this.musicAudio;
    const startVol = audio.volume;

    if (targetVol > 0 && audio.paused) {
      audio.play().catch(() => {
        // Autoplay policy: will start on user interaction
      });
    }

    const startTime = performance.now();

    const step = (now: number) => {
      const elapsed = now - startTime;
      const t = Math.min(1, Math.max(0, elapsed / durationMs));
      // Smooth sinusoidal ease-in-out curve
      const ease = 0.5 - 0.5 * Math.cos(t * Math.PI);
      const cur = startVol + (targetVol - startVol) * ease;
      audio.volume = Math.max(0, Math.min(1, cur));

      if (t < 1) {
        this.fadeAnimId = requestAnimationFrame(step);
      } else {
        audio.volume = targetVol;
        if (targetVol === 0) {
          audio.pause();
        }
        this.fadeAnimId = null;
      }
    };

    this.fadeAnimId = requestAnimationFrame(step);
  }

  public setMuted(muted: boolean) {
    this.isMuted = muted;
    this.initContext();

    // Fade music: 2500ms fade-in, 2000ms fade-out
    if (muted) {
      this.fadeMusic(0.0, 2000);
      if (this.ambientGain && this.ctx) {
        this.ambientGain.gain.setTargetAtTime(0, this.ctx.currentTime, 0.5);
      }
    } else {
      this.fadeMusic(this.TARGET_MUSIC_VOL, 2500);
      if (this.ambientGain && this.ctx) {
        this.ambientGain.gain.setTargetAtTime(0.06, this.ctx.currentTime, 0.5);
      }
      if (!this.isAmbientPlaying) {
        this.startAmbient();
      }
    }
  }

  public toggleMute(): boolean {
    this.setMuted(!this.isMuted);
    return this.isMuted;
  }

  public getMuted(): boolean {
    return this.isMuted;
  }

  public isPlaying(): boolean {
    return !this.isMuted;
  }

  // 1. Ambient Temple Resonance (Subtle 108Hz / 432Hz harmonic singing bowl drone)
  public startAmbient() {
    if (this.isAmbientPlaying || !this.ctx) return;
    this.initContext();
    if (!this.ctx) return;

    try {
      const now = this.ctx.currentTime;
      this.ambientGain = this.ctx.createGain();
      this.ambientGain.gain.setValueAtTime(this.isMuted ? 0 : 0.12, now);
      this.ambientGain.connect(this.ctx.destination);

      // Low fundamental and harmonics
      const freqs = [108, 162, 216, 432];
      this.ambientOscs = freqs.map((f, i) => {
        const osc = this.ctx!.createOscillator();
        const g = this.ctx!.createGain();
        osc.type = i === 0 ? 'sine' : 'triangle';
        osc.frequency.setValueAtTime(f + (Math.random() * 0.4 - 0.2), now);

        // Slow LFO modulation for organic breathing effect
        const lfo = this.ctx!.createOscillator();
        const lfoGain = this.ctx!.createGain();
        lfo.frequency.setValueAtTime(0.1 + i * 0.05, now);
        lfoGain.gain.setValueAtTime(1.5, now);
        lfo.connect(osc.frequency);
        lfo.start(now);

        g.gain.setValueAtTime((1 / (i + 1)) * 0.2, now);
        osc.connect(g);
        g.connect(this.ambientGain!);
        osc.start(now);
        return osc;
      });

      this.isAmbientPlaying = true;
    } catch {
      // Audio autoplay policy fallback
    }
  }

  public stopAmbient() {
    this.ambientOscs.forEach(osc => {
      try { osc.stop(); } catch {}
    });
    this.ambientOscs = [];
    this.isAmbientPlaying = false;
  }

  // 2. Dynamic Kung Fu Whoosh (Jump / Action transition)
  public playWhoosh() {
    if (this.isMuted || !this.ctx) return;
    this.initContext();
    if (!this.ctx) return;

    const now = this.ctx.currentTime;
    const duration = 0.85;

    // Filtered noise sweep
    const bufferSize = this.ctx.sampleRate * duration;
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = Math.random() * 2 - 1;
    }

    const noise = this.ctx.createBufferSource();
    noise.buffer = buffer;

    const filter = this.ctx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.Q.setValueAtTime(3.5, now);
    filter.frequency.setValueAtTime(180, now);
    filter.frequency.exponentialRampToValueAtTime(2400, now + duration * 0.45);
    filter.frequency.exponentialRampToValueAtTime(320, now + duration);

    const gain = this.ctx.createGain();
    gain.gain.setValueAtTime(0.001, now);
    gain.gain.linearRampToValueAtTime(0.28, now + duration * 0.4);
    gain.gain.exponentialRampToValueAtTime(0.001, now + duration);

    noise.connect(filter);
    filter.connect(gain);
    gain.connect(this.ctx.destination);

    noise.start(now);
    noise.stop(now + duration);
  }

  // 3. Resonant Temple Bronze Gong (Landing impact in action pose)
  public playGong() {
    if (this.isMuted || !this.ctx) return;
    this.initContext();
    if (!this.ctx) return;

    const now = this.ctx.currentTime;
    const duration = 3.5;

    // Rich metallic inharmonics
    const harmonics = [
      { freq: 88, gain: 0.4 },
      { freq: 176, gain: 0.3 },
      { freq: 284, gain: 0.18 },
      { freq: 412, gain: 0.12 },
      { freq: 620, gain: 0.08 },
    ];

    harmonics.forEach(({ freq, gain: targetGain }) => {
      const osc = this.ctx!.createOscillator();
      const g = this.ctx!.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, now);
      // Slight pitch bend on initial strike
      osc.frequency.exponentialRampToValueAtTime(freq * 0.98, now + duration);

      g.gain.setValueAtTime(0.001, now);
      g.gain.linearRampToValueAtTime(targetGain, now + 0.02);
      g.gain.exponentialRampToValueAtTime(0.0001, now + duration);

      osc.connect(g);
      g.connect(this.ctx!.destination);

      osc.start(now);
      osc.stop(now + duration);
    });
  }

  // 4. Silk Cloth Rustle (When cursor touches or flutters the silk banner)
  public playSilkRustle() {
    if (this.isMuted || !this.ctx) return;
    this.initContext();
    if (!this.ctx) return;

    const now = this.ctx.currentTime;
    const duration = 0.35;

    const bufferSize = this.ctx.sampleRate * duration;
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = Math.random() * 2 - 1;
    }

    const noise = this.ctx.createBufferSource();
    noise.buffer = buffer;

    const filter = this.ctx.createBiquadFilter();
    filter.type = 'highpass';
    filter.frequency.setValueAtTime(3200, now);
    filter.frequency.linearRampToValueAtTime(1400, now + duration);

    const gain = this.ctx.createGain();
    gain.gain.setValueAtTime(0.001, now);
    gain.gain.linearRampToValueAtTime(0.08, now + 0.05);
    gain.gain.exponentialRampToValueAtTime(0.001, now + duration);

    noise.connect(filter);
    filter.connect(gain);
    gain.connect(this.ctx.destination);

    noise.start(now);
    noise.stop(now + duration);
  }

  // 5. Button click chime
  public playChime() {
    if (this.isMuted || !this.ctx) return;
    this.initContext();
    if (!this.ctx) return;

    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'triangle';
    osc.frequency.setValueAtTime(880, now);
    osc.frequency.exponentialRampToValueAtTime(1320, now + 0.15);

    gain.gain.setValueAtTime(0.001, now);
    gain.gain.linearRampToValueAtTime(0.12, now + 0.02);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.35);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start(now);
    osc.stop(now + 0.35);
  }
}

export const sound = new SoundEngine();
