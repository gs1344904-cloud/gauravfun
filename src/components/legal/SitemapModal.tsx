import React, { useState } from 'react';
import { X, Network, ExternalLink, Search, Gamepad2, FileCode, Check, Copy } from 'lucide-react';
import { GAMES_CATALOG, GAME_CATEGORIES, GameInfo } from '../../data/gamesList';
import { soundEngine } from '../../utils/audioEngine';

interface SitemapModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectGame: (game: GameInfo) => void;
  onOpenPrivacy: () => void;
  onOpenTerms: () => void;
  onOpenAbout: () => void;
  onOpenContact: () => void;
}

export const SitemapModal: React.FC<SitemapModalProps> = ({
  isOpen,
  onClose,
  onSelectGame,
  onOpenPrivacy,
  onOpenTerms,
  onOpenAbout,
  onOpenContact,
}) => {
  const [filter, setFilter] = useState('');
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const SITEMAP_XML_URL = 'https://ais-pre-5z73mr7eh2w6rvs5sogrow-907639877761.asia-southeast1.run.app/sitemap.xml';

  const copySitemapUrl = () => {
    navigator.clipboard.writeText(SITEMAP_XML_URL);
    soundEngine.playSound('score');
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const filteredGames = GAMES_CATALOG.filter(
    (g) =>
      g.name.toLowerCase().includes(filter.toLowerCase()) ||
      g.category.toLowerCase().includes(filter.toLowerCase()) ||
      g.slug.toLowerCase().includes(filter.toLowerCase())
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-neutral-950/85 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-4xl bg-neutral-900 border border-neutral-800 rounded-2xl shadow-2xl overflow-hidden my-auto max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-neutral-800 bg-neutral-950/60">
          <div className="flex items-center gap-2.5">
            <span className="p-2 bg-amber-500/10 text-amber-400 rounded-lg">
              <Network className="w-5 h-5" />
            </span>
            <div>
              <h2 className="text-base sm:text-lg font-bold text-neutral-100 font-display">
                Arcade100 HTML & XML Sitemap / साइटमैप
              </h2>
              <p className="text-[11px] text-neutral-400">Complete Directory of All 100 Games & Site Pages</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-neutral-400 hover:text-white hover:bg-neutral-800 rounded-lg transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Top Action Bar */}
        <div className="p-4 bg-neutral-950 border-b border-neutral-800 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
          {/* XML link & copy */}
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <a
              href="/sitemap.xml"
              target="_blank"
              rel="noreferrer"
              className="px-3 py-1.5 bg-neutral-800 hover:bg-neutral-700 text-amber-400 font-mono font-semibold rounded-lg flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <FileCode className="w-3.5 h-3.5" />
              <span>/sitemap.xml (Raw File)</span>
              <ExternalLink className="w-3 h-3 text-neutral-400" />
            </a>
            <button
              onClick={copySitemapUrl}
              className="px-3 py-1.5 bg-neutral-900 hover:bg-neutral-800 border border-neutral-800 text-neutral-300 rounded-lg font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Copied XML URL!' : 'Copy URL'}</span>
            </button>
          </div>

          {/* Search in sitemap */}
          <div className="relative w-full sm:w-72">
            <Search className="w-3.5 h-3.5 text-neutral-500 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              placeholder="Search 100 game URLs & pages..."
              className="w-full pl-8 pr-3 py-1.5 bg-neutral-900 border border-neutral-800 rounded-lg text-xs text-neutral-200 placeholder:text-neutral-500 focus:outline-hidden focus:border-amber-500"
            />
          </div>
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto flex-1 space-y-6 text-xs text-neutral-300">
          {/* Section 1: Core Portal Links */}
          <div>
            <h3 className="text-xs font-bold text-amber-400 uppercase tracking-wider mb-2.5 flex items-center gap-1.5">
              <span>Main Portal Pages (5)</span>
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
              <button
                onClick={() => {
                  onClose();
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className="p-3 rounded-lg bg-neutral-950 border border-neutral-800 hover:border-amber-500/50 text-left transition-colors cursor-pointer group"
              >
                <div className="font-bold text-neutral-100 group-hover:text-amber-400">Home Page</div>
                <div className="text-[11px] font-mono text-neutral-500 truncate mt-0.5">/ (All 100 Games)</div>
              </button>

              <button
                onClick={() => {
                  onClose();
                  onOpenTerms();
                }}
                className="p-3 rounded-lg bg-neutral-950 border border-neutral-800 hover:border-amber-500/50 text-left transition-colors cursor-pointer group"
              >
                <div className="font-bold text-neutral-100 group-hover:text-amber-400">Terms and Conditions</div>
                <div className="text-[11px] font-mono text-neutral-500 truncate mt-0.5">/terms-and-conditions</div>
              </button>

              <button
                onClick={() => {
                  onClose();
                  onOpenContact();
                }}
                className="p-3 rounded-lg bg-neutral-950 border border-neutral-800 hover:border-amber-500/50 text-left transition-colors cursor-pointer group"
              >
                <div className="font-bold text-neutral-100 group-hover:text-amber-400">Contact Us Support</div>
                <div className="text-[11px] font-mono text-neutral-500 truncate mt-0.5">/contact-us (gk2774477@gmail.com)</div>
              </button>

              <button
                onClick={() => {
                  onClose();
                  onOpenPrivacy();
                }}
                className="p-3 rounded-lg bg-neutral-950 border border-neutral-800 hover:border-amber-500/50 text-left transition-colors cursor-pointer group"
              >
                <div className="font-bold text-neutral-100 group-hover:text-amber-400">Privacy Policy (GDPR/CCPA)</div>
                <div className="text-[11px] font-mono text-neutral-500 truncate mt-0.5">/privacy-policy</div>
              </button>

              <button
                onClick={() => {
                  onClose();
                  onOpenAbout();
                }}
                className="p-3 rounded-lg bg-neutral-950 border border-neutral-800 hover:border-amber-500/50 text-left transition-colors cursor-pointer group"
              >
                <div className="font-bold text-neutral-100 group-hover:text-amber-400">About Us & Tech</div>
                <div className="text-[11px] font-mono text-neutral-500 truncate mt-0.5">/about-us</div>
              </button>

              <a
                href="/robots.txt"
                target="_blank"
                rel="noreferrer"
                className="p-3 rounded-lg bg-neutral-950 border border-neutral-800 hover:border-amber-500/50 text-left transition-colors cursor-pointer group"
              >
                <div className="font-bold text-neutral-100 group-hover:text-amber-400">Robots.txt Directive</div>
                <div className="text-[11px] font-mono text-neutral-500 truncate mt-0.5">/robots.txt</div>
              </a>
            </div>
          </div>

          {/* Section 2: All 100 Games Categorized */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-xs font-bold text-amber-400 uppercase tracking-wider flex items-center gap-1.5">
                <Gamepad2 className="w-4 h-4" />
                <span>All 100 Games Directory ({filteredGames.length} Listed)</span>
              </h3>
              <span className="text-[11px] text-neutral-500 font-mono">100% Mobile Ready</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2 max-h-[380px] overflow-y-auto p-1 bg-neutral-950/40 rounded-xl border border-neutral-800">
              {filteredGames.map((game) => (
                <button
                  key={game.id}
                  onClick={() => {
                    onClose();
                    onSelectGame(game);
                  }}
                  className="p-2.5 rounded-lg bg-neutral-950 hover:bg-neutral-800/80 border border-neutral-800/80 text-left transition-colors flex items-center justify-between group cursor-pointer"
                >
                  <div className="min-w-0 pr-2">
                    <div className="font-semibold text-neutral-200 group-hover:text-amber-400 transition-colors truncate">
                      #{game.id} {game.name}
                    </div>
                    <div className="text-[10px] text-neutral-500 truncate font-mono">
                      /?game={game.slug}
                    </div>
                  </div>
                  <span className="text-[10px] text-neutral-400 bg-neutral-900 px-1.5 py-0.5 rounded shrink-0">
                    {game.category.split(' ')[0]}
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-3 border-t border-neutral-800 bg-neutral-950/60 flex items-center justify-between text-xs text-neutral-400">
          <span>Search Engine XML & Visual HTML Sitemap</span>
          <button
            onClick={onClose}
            className="px-5 py-2 bg-neutral-800 hover:bg-neutral-700 text-neutral-100 font-semibold rounded-lg text-xs cursor-pointer"
          >
            Close Sitemap
          </button>
        </div>
      </div>
    </div>
  );
};
