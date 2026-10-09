// Audio synthesizer & sound effect manager using Web Audio API for Arcade Games

class SoundEngine {
  private ctx: AudioContext | null = null;
  private isMuted: boolean = false;
  private masterGain: GainNode | null = null;

  private initCtx() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      this.ctx = new AudioCtx();
      this.masterGain = this.ctx.createGain();
      this.masterGain.gain.value = 0.5;
      this.masterGain.connect(this.ctx.destination);
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  public setVolume(val: number) {
    this.initCtx();
    if (this.masterGain) {
      this.masterGain.gain.value = Math.max(0, Math.min(1, val));
    }
  }

  public toggleMute(): boolean {
    this.isMuted = !this.isMuted;
    if (this.masterGain) {
      this.masterGain.gain.value = this.isMuted ? 0 : 0.5;
    }
    return this.isMuted;
  }

  public getIsMuted(): boolean {
    return this.isMuted;
  }

  // --- ARCADE GAME SOUND EFFECTS ---
  public playSound(effect: 'jump' | 'score' | 'hit' | 'win' | 'laser' | 'coin' | 'click' | 'powerup' | 'gameover') {
    this.initCtx();
    if (!this.ctx || !this.masterGain || this.isMuted) return;
    const now = this.ctx.currentTime;

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.connect(gain);
    gain.connect(this.masterGain);

    switch (effect) {
      case 'jump':
        osc.type = 'sine';
        osc.frequency.setValueAtTime(180, now);
        osc.frequency.exponentialRampToValueAtTime(540, now + 0.12);
        gain.gain.setValueAtTime(0.3, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.12);
        osc.start(now);
        osc.stop(now + 0.12);
        break;

      case 'score':
      case 'coin':
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(650, now);
        osc.frequency.setValueAtTime(980, now + 0.08);
        gain.gain.setValueAtTime(0.35, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.2);
        osc.start(now);
        osc.stop(now + 0.2);
        break;

      case 'laser':
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(800, now);
        osc.frequency.exponentialRampToValueAtTime(150, now + 0.1);
        gain.gain.setValueAtTime(0.2, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.1);
        osc.start(now);
        osc.stop(now + 0.1);
        break;

      case 'hit':
        osc.type = 'square';
        osc.frequency.setValueAtTime(180, now);
        osc.frequency.exponentialRampToValueAtTime(60, now + 0.15);
        gain.gain.setValueAtTime(0.4, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.15);
        osc.start(now);
        osc.stop(now + 0.15);
        break;

      case 'powerup':
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(260, now);
        osc.frequency.exponentialRampToValueAtTime(780, now + 0.25);
        gain.gain.setValueAtTime(0.3, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.25);
        osc.start(now);
        osc.stop(now + 0.25);
        break;

      case 'win':
        [440, 554, 659, 880].forEach((f, idx) => {
          if (!this.ctx || !this.masterGain) return;
          const toneOsc = this.ctx.createOscillator();
          const toneGain = this.ctx.createGain();
          toneOsc.type = 'triangle';
          toneOsc.frequency.setValueAtTime(f, now + idx * 0.08);
          toneGain.gain.setValueAtTime(0.25, now + idx * 0.08);
          toneGain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.08 + 0.4);
          toneOsc.connect(toneGain);
          toneGain.connect(this.masterGain);
          toneOsc.start(now + idx * 0.08);
          toneOsc.stop(now + idx * 0.08 + 0.4);
        });
        break;

      case 'gameover':
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(320, now);
        osc.frequency.exponentialRampToValueAtTime(80, now + 0.35);
        gain.gain.setValueAtTime(0.35, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.35);
        osc.start(now);
        osc.stop(now + 0.35);
        break;

      case 'click':
      default:
        osc.type = 'sine';
        osc.frequency.setValueAtTime(400, now);
        gain.gain.setValueAtTime(0.15, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.03);
        osc.start(now);
        osc.stop(now + 0.03);
        break;
    }
  }
}

export const soundEngine = new SoundEngine();
