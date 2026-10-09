import React from 'react';
import { X, Sparkles, Gamepad2, Award, Zap, HeartHandshake } from 'lucide-react';

interface AboutModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AboutUsModal: React.FC<AboutModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-neutral-950/85 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-3xl bg-neutral-900 border border-neutral-800 rounded-2xl shadow-2xl overflow-hidden my-auto max-h-[85vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-neutral-800 bg-neutral-950/60">
          <div className="flex items-center gap-2.5">
            <span className="p-2 bg-amber-500/10 text-amber-400 rounded-lg">
              <Gamepad2 className="w-5 h-5" />
            </span>
            <h2 className="text-lg font-bold text-neutral-100 font-display">About Arcade100</h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-neutral-400 hover:text-white hover:bg-neutral-800 rounded-lg transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto text-xs text-neutral-300 space-y-5 leading-relaxed">
          <div>
            <h3 className="text-base font-bold text-neutral-100 font-display mb-1">
              Welcome to Arcade100 — The Free Web Gaming Hub
            </h3>
            <p className="text-neutral-400">
              Arcade100 was founded with a single mission: to bring back the timeless joy of classic arcade, puzzle, brain, and sports gaming directly to your browser with zero installation, zero downloads, and complete mobile phone touch compatibility.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
            <div className="p-4 bg-neutral-950 rounded-xl border border-neutral-800 flex flex-col gap-2">
              <Zap className="w-5 h-5 text-amber-400" />
              <h4 className="text-sm font-bold text-neutral-100">100 Instant Games</h4>
              <p className="text-[11px] text-neutral-400">
                Every game in our curated 100-game catalog is 100% playable inside any modern web browser on iOS, Android, or desktop.
              </p>
            </div>

            <div className="p-4 bg-neutral-950 rounded-xl border border-neutral-800 flex flex-col gap-2">
              <Award className="w-5 h-5 text-emerald-400" />
              <h4 className="text-sm font-bold text-neutral-100">Mobile-First Touch</h4>
              <p className="text-[11px] text-neutral-400">
                Built with ergonomic on-screen D-Pads, jump buttons, action keys, and swipe touch targets meeting WCAG accessibility standards.
              </p>
            </div>

            <div className="p-4 bg-neutral-950 rounded-xl border border-neutral-800 flex flex-col gap-2">
              <HeartHandshake className="w-5 h-5 text-blue-400" />
              <h4 className="text-sm font-bold text-neutral-100">Fair & Safe Play</h4>
              <p className="text-[11px] text-neutral-400">
                Family-friendly casual gaming, high scores saved automatically, and full compliance with global advertising and privacy rules.
              </p>
            </div>
          </div>

          <div>
            <h4 className="text-sm font-bold text-neutral-100 font-display mb-1">Our Technology</h4>
            <p>
              Arcade100 harnesses modern web standards including HTML5 Canvas 2D rendering, Web Audio API synthesis for responsive haptic-style game sound effects, and CSS hardware-accelerated transforms for fluid 60 FPS mobile performance without draining battery life.
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-3 border-t border-neutral-800 bg-neutral-950/60 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 bg-amber-500 hover:bg-amber-400 text-neutral-950 font-bold rounded-lg text-xs cursor-pointer"
          >
            Start Playing
          </button>
        </div>
      </div>
    </div>
  );
};
