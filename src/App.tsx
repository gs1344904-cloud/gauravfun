import React, { useState, useMemo } from 'react';
import {
  GAMES_CATALOG,
  GAME_CATEGORIES,
  CATEGORY_DESCRIPTIONS,
  GameInfo,
  GameCategory,
} from './data/gamesList';
import { GameModal } from './components/games/GameModal';
import { PrivacyPolicyModal } from './components/legal/PrivacyPolicyModal';
import { TermsOfServiceModal } from './components/legal/TermsOfServiceModal';
import { AboutUsModal } from './components/legal/AboutUsModal';
import { ContactUsModal } from './components/legal/ContactUsModal';
import { SitemapModal } from './components/legal/SitemapModal';
import { CookieConsentBanner } from './components/legal/CookieConsentBanner';
import { AdSenseBanner } from './components/ads/AdSenseBanner';
import { soundEngine } from './utils/audioEngine';
import arcadeHubImg from './assets/images/arcade_games_hub_1790760735124.jpg';
import {
  Gamepad2,
  Search,
  Heart,
  Play,
  Sparkles,
  Trophy,
  Smartphone,
  Info,
  Volume2,
  VolumeX,
  Layers,
  LayoutGrid,
  ShieldCheck,
  Scale,
  Mail,
  HelpCircle,
  ExternalLink,
  ChevronRight,
  Flame,
  Network,
} from 'lucide-react';

export default function App() {
  const [activeCategory, setActiveCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [difficultyFilter, setDifficultyFilter] = useState<string>('All');
  const [activeGame, setActiveGame] = useState<GameInfo | null>(null);
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [viewMode, setViewMode] = useState<'grouped' | 'grid'>('grouped');

  // Policy & Information Modals
  const [showPrivacy, setShowPrivacy] = useState<boolean>(false);
  const [showTerms, setShowTerms] = useState<boolean>(false);
  const [showAbout, setShowAbout] = useState<boolean>(false);
  const [showContact, setShowContact] = useState<boolean>(false);
  const [showSitemap, setShowSitemap] = useState<boolean>(false);

  // Favorites state in LocalStorage
  const [favorites, setFavorites] = useState<number[]>(() => {
    try {
      const saved = localStorage.getItem('arcade100_favorites');
      return saved ? JSON.parse(saved) : [1, 2, 3, 21, 22, 41, 56, 71, 86];
    } catch {
      return [1, 2, 3, 21, 22];
    }
  });

  const toggleFavorite = (id: number) => {
    soundEngine.playSound('coin');
    setFavorites((prev) => {
      const next = prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id];
      localStorage.setItem('arcade100_favorites', JSON.stringify(next));
      return next;
    });
  };

  const toggleSound = () => {
    const muted = soundEngine.toggleMute();
    setIsMuted(muted);
  };

  // Filtered games
  const filteredGames = useMemo(() => {
    return GAMES_CATALOG.filter((game) => {
      const matchesSearch =
        game.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        game.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        game.category.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesCat = activeCategory === 'All' || game.category === activeCategory;
      const matchesDiff = difficultyFilter === 'All' || game.difficulty === difficultyFilter;

      return matchesSearch && matchesCat && matchesDiff;
    });
  }, [searchQuery, activeCategory, difficultyFilter]);

  // Group games by category
  const groupedGames = useMemo(() => {
    const map = new Map<GameCategory, GameInfo[]>();
    GAME_CATEGORIES.forEach((cat) => map.set(cat, []));

    filteredGames.forEach((game) => {
      const list = map.get(game.category);
      if (list) list.push(game);
    });

    return map;
  }, [filteredGames]);

  // Launch random game
  const playRandomGame = () => {
    soundEngine.playSound('score');
    const random = GAMES_CATALOG[Math.floor(Math.random() * GAMES_CATALOG.length)];
    setActiveGame(random);
  };

  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-100 flex flex-col selection:bg-amber-500 selection:text-neutral-950 font-sans">
      {/* 1. TOP BAR CONTRACT (Strict 3-Zone Contract as per frontend design guidelines) */}
      <header className="sticky top-0 z-30 bg-neutral-950/90 backdrop-blur-md border-b border-neutral-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          {/* Zone 1: Single text element brand wordmark */}
          <button
            onClick={() => {
              setActiveCategory('All');
              setSearchQuery('');
            }}
            className="flex items-center gap-2.5 text-left cursor-pointer group"
          >
            <span className="p-2 bg-amber-500/10 text-amber-400 rounded-lg group-hover:bg-amber-500 group-hover:text-neutral-950 transition-colors">
              <Gamepad2 className="w-5 h-5" />
            </span>
            <span className="text-xl font-black tracking-tight text-neutral-100 font-display">
              ARCADE<span className="text-amber-400">100</span>
            </span>
          </button>

          {/* Zone 2: Navigation Links (single-line text) */}
          <nav className="hidden lg:flex items-center gap-5 text-xs sm:text-sm font-semibold text-neutral-400">
            <button
              onClick={() => {
                setActiveCategory('All');
                setSearchQuery('');
              }}
              className={`hover:text-amber-400 transition-colors cursor-pointer py-1 ${
                activeCategory === 'All' && !searchQuery ? 'text-amber-400 border-b-2 border-amber-400' : ''
              }`}
            >
              All 100 Games
            </button>
            <button
              onClick={() => setActiveCategory('Arcade & Action')}
              className={`hover:text-amber-400 transition-colors cursor-pointer py-1 ${
                activeCategory === 'Arcade & Action' ? 'text-amber-400 border-b-2 border-amber-400' : ''
              }`}
            >
              Arcade & Action (20)
            </button>
            <button
              onClick={() => setActiveCategory('Puzzle & Brain')}
              className={`hover:text-amber-400 transition-colors cursor-pointer py-1 ${
                activeCategory === 'Puzzle & Brain' ? 'text-amber-400 border-b-2 border-amber-400' : ''
              }`}
            >
              Puzzle & Brain (20)
            </button>
            <button
              onClick={() => setShowTerms(true)}
              className="hover:text-amber-400 transition-colors cursor-pointer py-1 flex items-center gap-1"
            >
              <Scale className="w-3.5 h-3.5 text-amber-400" />
              <span>Terms & Conditions</span>
            </button>
            <button
              onClick={() => setShowContact(true)}
              className="hover:text-amber-400 transition-colors cursor-pointer py-1 flex items-center gap-1"
            >
              <Mail className="w-3.5 h-3.5 text-emerald-400" />
              <span>Contact Us</span>
            </button>
            <button
              onClick={() => setShowSitemap(true)}
              className="hover:text-amber-400 transition-colors cursor-pointer py-1 flex items-center gap-1"
            >
              <Network className="w-3.5 h-3.5 text-amber-400" />
              <span>Sitemap</span>
            </button>
            <button
              onClick={() => setShowAbout(true)}
              className="hover:text-amber-400 transition-colors cursor-pointer py-1"
            >
              About
            </button>
          </nav>

          {/* Zone 3: Primary Actions */}
          <div className="flex items-center gap-2">
            <button
              onClick={toggleSound}
              className="p-2 text-neutral-400 hover:text-white hover:bg-neutral-900 rounded-lg transition-colors cursor-pointer"
              title={isMuted ? 'Unmute Sound FX' : 'Mute Sound FX'}
              aria-label="Toggle Sound"
            >
              {isMuted ? <VolumeX className="w-4 h-4 text-red-400" /> : <Volume2 className="w-4 h-4" />}
            </button>

            <button
              onClick={playRandomGame}
              className="px-3.5 py-1.5 bg-amber-500 hover:bg-amber-400 active:scale-95 text-neutral-950 font-bold rounded-lg text-xs flex items-center gap-1.5 transition-transform shadow-md cursor-pointer whitespace-nowrap"
            >
              <Sparkles className="w-3.5 h-3.5 fill-current" />
              <span>🎲 Random Game</span>
            </button>
          </div>
        </div>

        {/* Mobile Navigation Sub-Bar */}
        <div className="flex lg:hidden items-center justify-between px-4 py-2 border-t border-neutral-800/80 bg-neutral-950 text-xs font-semibold overflow-x-auto gap-3 scrollbar-none">
          <button
            onClick={() => {
              setActiveCategory('All');
              setSearchQuery('');
            }}
            className={`whitespace-nowrap ${activeCategory === 'All' && !searchQuery ? 'text-amber-400 font-bold' : 'text-neutral-400'}`}
          >
            🎮 All 100 Games
          </button>
          <button
            onClick={() => setShowTerms(true)}
            className="text-neutral-300 hover:text-amber-400 whitespace-nowrap flex items-center gap-1"
          >
            <Scale className="w-3 h-3 text-amber-400" />
            <span>Terms & Conditions</span>
          </button>
          <button
            onClick={() => setShowContact(true)}
            className="text-neutral-300 hover:text-amber-400 whitespace-nowrap flex items-center gap-1"
          >
            <Mail className="w-3 h-3 text-emerald-400" />
            <span>Contact</span>
          </button>
          <button
            onClick={() => setShowSitemap(true)}
            className="text-neutral-300 hover:text-amber-400 whitespace-nowrap flex items-center gap-1"
          >
            <Network className="w-3 h-3 text-amber-400" />
            <span>Sitemap</span>
          </button>
        </div>
      </header>

      {/* 2. HERO SHOWCASE SECTION */}
      <section className="relative overflow-hidden border-b border-neutral-800 bg-neutral-950">
        <div className="absolute inset-0 z-0 opacity-20 pointer-events-none">
          <img
            src={arcadeHubImg}
            alt="Arcade Background"
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover object-center"
          />
        </div>
        <div className="absolute inset-0 bg-gradient-to-t from-neutral-950 via-neutral-950/80 to-transparent pointer-events-none" />

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 py-10 sm:py-14 flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="max-w-2xl text-center md:text-left">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-bold uppercase tracking-wider mb-4">
              <Smartphone className="w-3.5 h-3.5" />
              <span>Full Phone Touch Controls · Zero Download Required</span>
            </div>

            <h1 className="text-3xl sm:text-5xl font-black text-neutral-100 font-display tracking-tight leading-tight">
              PLAY 100 FREE <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 via-orange-400 to-amber-500">
                BROWSER ARCADE GAMES
              </span>
            </h1>

            <p className="mt-3.5 text-sm sm:text-base text-neutral-300 leading-relaxed max-w-xl">
              Instant mobile and desktop browser gaming! Explore 100 free unblocked casual, puzzle, sports, card, and retro arcade titles with full touch controls, high score tracking, and smooth 60 FPS performance.
            </p>

            {/* Quick Metrics Bar */}
            <div className="mt-6 flex flex-wrap items-center justify-center md:justify-start gap-4 sm:gap-6 text-xs text-neutral-400 font-medium">
              <div>
                <span className="font-mono text-base font-bold text-amber-400 tabular-nums">100</span>
                <span className="ml-1.5 text-neutral-300 font-semibold">Playable Games</span>
              </div>
              <span className="text-neutral-700">·</span>
              <div>
                <span className="font-mono text-base font-bold text-emerald-400 tabular-nums">6</span>
                <span className="ml-1.5 text-neutral-300 font-semibold">Curated Categories</span>
              </div>
              <span className="text-neutral-700">·</span>
              <div>
                <span className="font-mono text-base font-bold text-blue-400 tabular-nums">100%</span>
                <span className="ml-1.5 text-neutral-300 font-semibold">Touch Screen Ready</span>
              </div>
              <span className="text-neutral-700">·</span>
              <div>
                <span className="font-mono text-base font-bold text-amber-400 tabular-nums">$0</span>
                <span className="ml-1.5 text-neutral-300 font-semibold">Always Free</span>
              </div>
            </div>

            {/* Quick CTAs */}
            <div className="mt-7 flex flex-wrap items-center justify-center md:justify-start gap-3">
              <button
                onClick={() => setActiveGame(GAMES_CATALOG[0])}
                className="px-6 py-3 bg-amber-500 hover:bg-amber-400 active:scale-95 text-neutral-950 font-bold rounded-xl text-xs flex items-center gap-2 shadow-lg transition-transform cursor-pointer"
              >
                <Play className="w-4 h-4 fill-current" /> Play #1 Highway Racer
              </button>
              <button
                onClick={() => setActiveCategory('Puzzle & Brain')}
                className="px-5 py-3 bg-neutral-900 hover:bg-neutral-800 border border-neutral-700 active:scale-95 text-neutral-200 font-semibold rounded-xl text-xs flex items-center gap-2 transition-transform cursor-pointer"
              >
                Browse Puzzle Hub
              </button>
            </div>
          </div>

          {/* Right Featured Card */}
          <div className="w-full sm:w-80 shrink-0 p-4 bg-neutral-900/90 border border-neutral-800 rounded-2xl shadow-2xl flex flex-col gap-3">
            <div className="flex items-center justify-between text-xs">
              <span className="text-amber-400 font-bold flex items-center gap-1.5">
                <Flame className="w-3.5 h-3.5 fill-current" /> Top Trending Today
              </span>
              <span className="text-neutral-500 text-[11px]">Free Web App</span>
            </div>

            <div className="space-y-2">
              {[GAMES_CATALOG[0], GAMES_CATALOG[1], GAMES_CATALOG[20], GAMES_CATALOG[40]].map((g) => (
                <button
                  key={g.id}
                  onClick={() => setActiveGame(g)}
                  className="w-full flex items-center justify-between p-2.5 rounded-xl bg-neutral-950 hover:bg-neutral-800/80 border border-neutral-800/60 transition-colors text-left group cursor-pointer"
                >
                  <div className="min-w-0 pr-2">
                    <div className="text-xs font-bold text-neutral-200 group-hover:text-amber-400 transition-colors truncate">
                      {g.name}
                    </div>
                    <div className="text-[11px] text-neutral-500">{g.category}</div>
                  </div>
                  <span className="p-1.5 bg-amber-500/10 text-amber-400 rounded-lg group-hover:bg-amber-500 group-hover:text-neutral-950 transition-colors shrink-0">
                    <Play className="w-3 h-3 fill-current" />
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 3. RESPONSIVE LEADERBOARD ADSLOT (Google AdSense compliant placement with ADVERTISEMENT label) */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 w-full">
        <AdSenseBanner slotType="leaderboard" />
      </div>

      {/* 4. CATEGORY SELECTOR & FILTER BAR */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-4 w-full">
        {/* Category Cards Carousel / Row */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5 mb-6">
          {GAME_CATEGORIES.map((cat) => {
            const info = CATEGORY_DESCRIPTIONS[cat];
            const isSelected = activeCategory === cat;

            return (
              <button
                key={cat}
                onClick={() => setActiveCategory(isSelected ? 'All' : cat)}
                className={`p-3 rounded-xl border text-left transition-all duration-150 cursor-pointer flex flex-col justify-between ${
                  isSelected
                    ? 'bg-amber-500/10 border-amber-500/80 text-amber-300 shadow-md'
                    : 'bg-neutral-900/60 hover:bg-neutral-900 border-neutral-800 text-neutral-300 hover:border-neutral-700'
                }`}
              >
                <div className="flex items-center justify-between w-full mb-1">
                  <span className="text-xl">{info.icon}</span>
                  <span className="text-[11px] font-mono font-bold text-neutral-400 bg-neutral-950 px-1.5 py-0.5 rounded">
                    {info.count}
                  </span>
                </div>
                <div className="text-xs font-bold font-display truncate">{cat}</div>
              </button>
            );
          })}
        </div>

        {/* Filter Controls Row */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 p-3 bg-neutral-900/80 border border-neutral-800 rounded-xl">
          {/* Search Input */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-neutral-500 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by game title, mechanics, or tags (e.g. 2048, Snake, Cricket, Wordle)..."
              className="w-full pl-9 pr-3 py-2 bg-neutral-950 border border-neutral-800 rounded-lg text-xs text-neutral-100 placeholder:text-neutral-500 focus:outline-hidden focus:border-amber-500"
            />
          </div>

          {/* Difficulty Dropdown */}
          <div className="flex items-center gap-2">
            <span className="text-xs text-neutral-400 font-semibold whitespace-nowrap">Difficulty:</span>
            <select
              value={difficultyFilter}
              onChange={(e) => setDifficultyFilter(e.target.value)}
              className="px-3 py-2 bg-neutral-950 border border-neutral-800 rounded-lg text-xs text-neutral-200 focus:outline-hidden focus:border-amber-500 cursor-pointer"
            >
              <option value="All">All Levels</option>
              <option value="Easy">Easy</option>
              <option value="Medium">Medium</option>
              <option value="Hard">Hard</option>
            </select>
          </div>

          {/* View Mode Toggle */}
          <div className="flex items-center gap-1 bg-neutral-950 p-1 rounded-lg border border-neutral-800">
            <button
              onClick={() => setViewMode('grouped')}
              className={`p-1.5 rounded text-xs transition-colors cursor-pointer ${
                viewMode === 'grouped' ? 'bg-neutral-800 text-amber-400' : 'text-neutral-500 hover:text-neutral-300'
              }`}
              title="Group by Category"
            >
              <Layers className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('grid')}
              className={`p-1.5 rounded text-xs transition-colors cursor-pointer ${
                viewMode === 'grid' ? 'bg-neutral-800 text-amber-400' : 'text-neutral-500 hover:text-neutral-300'
              }`}
              title="All in Single Grid"
            >
              <LayoutGrid className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Results Bar */}
        <div className="flex items-center justify-between text-xs text-neutral-400 mt-3 px-1">
          <span>
            Showing <strong className="text-amber-400 font-mono">{filteredGames.length}</strong> games
            {activeCategory !== 'All' ? ` in ${activeCategory}` : ''}
          </span>
          <span className="text-neutral-500 flex items-center gap-1">
            <Smartphone className="w-3.5 h-3.5 text-emerald-400" />
            Tap any game card to launch with phone touch buttons
          </span>
        </div>
      </section>

      {/* 5. GAMES SHOWCASE (CATEGORY-WISE OR GRID) */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-4 flex-1 w-full space-y-10">
        {viewMode === 'grouped' && activeCategory === 'All' && !searchQuery ? (
          // Grouped by Category with headers and descriptions
          GAME_CATEGORIES.map((cat, catIdx) => {
            const gamesInCat = groupedGames.get(cat) || [];
            const info = CATEGORY_DESCRIPTIONS[cat];

            return (
              <section key={cat} className="space-y-4">
                {/* Category Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-2 border-b border-neutral-800 gap-1">
                  <div>
                    <h2 className="text-xl font-bold text-neutral-100 font-display flex items-center gap-2">
                      <span>{info.icon}</span>
                      <span>{info.title}</span>
                      <span className="text-xs font-mono font-semibold text-neutral-500">({gamesInCat.length})</span>
                    </h2>
                    <p className="text-xs text-neutral-400 mt-0.5">{info.desc}</p>
                  </div>

                  <button
                    onClick={() => setActiveCategory(cat)}
                    className="text-xs font-semibold text-amber-400 hover:text-amber-300 flex items-center gap-1 cursor-pointer self-start sm:self-auto"
                  >
                    <span>View all {gamesInCat.length}</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>

                {/* Games Grid for this Category */}
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {gamesInCat.map((game) => (
                    <GameCard
                      key={game.id}
                      game={game}
                      isFavorite={favorites.includes(game.id)}
                      onToggleFavorite={() => toggleFavorite(game.id)}
                      onPlay={() => {
                        soundEngine.playSound('click');
                        setActiveGame(game);
                      }}
                    />
                  ))}
                </div>

                {/* Native In-Feed AdSense Banner between section 2 and 4 */}
                {(catIdx === 1 || catIdx === 3) && (
                  <AdSenseBanner slotType="in-feed" className="my-6" />
                )}
              </section>
            );
          })
        ) : (
          // Unified Grid View
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {filteredGames.length > 0 ? (
              filteredGames.map((game) => (
                <GameCard
                  key={game.id}
                  game={game}
                  isFavorite={favorites.includes(game.id)}
                  onToggleFavorite={() => toggleFavorite(game.id)}
                  onPlay={() => {
                    soundEngine.playSound('click');
                    setActiveGame(game);
                  }}
                />
              ))
            ) : (
              <div className="col-span-full py-16 text-center bg-neutral-900/40 rounded-2xl border border-neutral-800">
                <Gamepad2 className="w-12 h-12 text-neutral-600 mx-auto mb-3" />
                <h3 className="text-base font-bold text-neutral-200 font-display">No games found</h3>
                <p className="text-xs text-neutral-500 mt-1">
                  Try adjusting your search query or removing the difficulty filter.
                </p>
                <button
                  onClick={() => {
                    setSearchQuery('');
                    setActiveCategory('All');
                    setDifficultyFilter('All');
                  }}
                  className="mt-4 px-5 py-2 bg-amber-500 text-neutral-950 font-bold rounded-lg text-xs cursor-pointer"
                >
                  Reset Filters
                </button>
              </div>
            )}
          </div>
        )}
      </main>

      {/* 5.5 CONTACT & SUPPORT STRIP */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 w-full mt-10">
        <div className="p-5 sm:p-6 bg-gradient-to-r from-neutral-900 via-neutral-900 to-amber-950/40 border border-neutral-800 rounded-2xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4 shadow-xl">
          <div>
            <div className="flex items-center gap-2">
              <span className="p-1.5 bg-amber-500/10 text-amber-400 rounded-lg">
                <Mail className="w-4 h-4" />
              </span>
              <h3 className="text-sm sm:text-base font-bold text-neutral-100 font-display">
                Need Help or Have Game Suggestions? / सहायता व संपर्क
              </h3>
            </div>
            <p className="text-xs text-neutral-400 mt-1 max-w-xl">
              Reach our administration and developer team directly at{' '}
              <a href="mailto:gk2774477@gmail.com" className="font-mono text-amber-400 font-bold hover:underline">
                gk2774477@gmail.com
              </a>{' '}
              for inquiries, feedback, AdSense partnerships, or technical bug reports.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5 shrink-0">
            <button
              onClick={() => setShowContact(true)}
              className="px-4 py-2.5 bg-amber-500 hover:bg-amber-400 active:scale-95 text-neutral-950 font-bold rounded-xl text-xs flex items-center gap-1.5 transition-transform shadow-md cursor-pointer"
            >
              <Mail className="w-3.5 h-3.5" />
              <span>Contact Form (संपर्क)</span>
            </button>
            <button
              onClick={() => setShowTerms(true)}
              className="px-4 py-2.5 bg-neutral-800 hover:bg-neutral-700 active:scale-95 text-neutral-200 font-semibold rounded-xl text-xs flex items-center gap-1.5 transition-transform cursor-pointer border border-neutral-700"
            >
              <Scale className="w-3.5 h-3.5 text-amber-400" />
              <span>Terms & Conditions</span>
            </button>
            <button
              onClick={() => setShowSitemap(true)}
              className="px-4 py-2.5 bg-neutral-800 hover:bg-neutral-700 active:scale-95 text-neutral-200 font-semibold rounded-xl text-xs flex items-center gap-1.5 transition-transform cursor-pointer border border-neutral-700"
            >
              <Network className="w-3.5 h-3.5 text-emerald-400" />
              <span>Sitemap XML & HTML</span>
            </button>
          </div>
        </div>
      </section>

      {/* 6. GOOGLE ADSENSE COMPLIANT FOOTER & LEGAL NAVIGATION */}
      <footer className="mt-16 bg-neutral-950 border-t border-neutral-800 pt-10 pb-8 text-xs text-neutral-400">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex flex-col gap-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {/* Column 1: Brand Info & Direct Support Email */}
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <span className="p-1.5 bg-amber-500/10 text-amber-400 rounded-md">
                  <Gamepad2 className="w-4 h-4" />
                </span>
                <span className="text-lg font-black text-neutral-100 font-display">
                  ARCADE<span className="text-amber-400">100</span>
                </span>
              </div>
              <p className="text-xs text-neutral-400 leading-relaxed">
                The premier hub for 100 free online browser games with zero downloads. Fully optimized with mobile phone touch controls and desktop keyboards.
              </p>
              <div className="pt-2">
                <span className="text-[10px] uppercase font-bold text-neutral-500 block mb-1">Official Support & Inquiries Email:</span>
                <a
                  href="mailto:gk2774477@gmail.com"
                  className="inline-flex items-center gap-1.5 text-xs font-mono font-bold text-amber-400 hover:underline"
                >
                  <Mail className="w-3.5 h-3.5" />
                  <span>gk2774477@gmail.com</span>
                </a>
              </div>
            </div>

            {/* Column 2: Game Categories */}
            <div className="space-y-2">
              <h4 className="text-xs font-bold text-neutral-200 uppercase tracking-wider">Browse Categories</h4>
              <ul className="space-y-1.5 text-xs text-neutral-400">
                {GAME_CATEGORIES.map((cat) => (
                  <li key={cat}>
                    <button
                      onClick={() => setActiveCategory(cat)}
                      className="hover:text-amber-400 transition-colors cursor-pointer"
                    >
                      {cat}
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            {/* Column 3: Trust & Mandatory AdSense Compliance Links */}
            <div className="space-y-2">
              <h4 className="text-xs font-bold text-neutral-200 uppercase tracking-wider">Terms & Compliance</h4>
              <ul className="space-y-1.5 text-xs text-neutral-400">
                <li>
                  <button
                    onClick={() => setShowTerms(true)}
                    className="hover:text-amber-400 transition-colors cursor-pointer flex items-center gap-1.5 font-semibold text-neutral-200"
                  >
                    <Scale className="w-3.5 h-3.5 text-amber-400" />
                    <span>Terms & Conditions (नियम व शर्तें)</span>
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => setShowContact(true)}
                    className="hover:text-amber-400 transition-colors cursor-pointer flex items-center gap-1.5 font-semibold text-neutral-200"
                  >
                    <Mail className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Contact Us (संपर्क करें)</span>
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => setShowSitemap(true)}
                    className="hover:text-amber-400 transition-colors cursor-pointer flex items-center gap-1.5 font-semibold text-neutral-200"
                  >
                    <Network className="w-3.5 h-3.5 text-amber-400" />
                    <span>Sitemap XML & HTML (साइटमैप)</span>
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => setShowPrivacy(true)}
                    className="hover:text-amber-400 transition-colors cursor-pointer flex items-center gap-1.5"
                  >
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Privacy Policy (GDPR / CCPA)</span>
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => setShowAbout(true)}
                    className="hover:text-amber-400 transition-colors cursor-pointer flex items-center gap-1.5"
                  >
                    <Info className="w-3.5 h-3.5 text-blue-400" />
                    <span>About Us & Technology</span>
                  </button>
                </li>
              </ul>
            </div>

            {/* Column 4: Platform Standards */}
            <div className="space-y-2">
              <h4 className="text-xs font-bold text-neutral-200 uppercase tracking-wider">AdSense & Safety</h4>
              <p className="text-xs text-neutral-400 leading-relaxed">
                Arcade100 strictly adheres to Google AdSense Publisher Policies, Webmaster Quality Guidelines, and family-safe casual gaming principles.
              </p>
              <div className="p-3 bg-neutral-900 border border-neutral-800 rounded-xl text-[11px] text-neutral-400">
                <span>Certified for Mobile Responsive Instant Play</span>
              </div>
            </div>
          </div>

          {/* Bottom Copyright */}
          <div className="pt-6 border-t border-neutral-800/80 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-neutral-500">
            <div>© 2026 Arcade100 Games. All rights reserved. Free online browser gaming platform.</div>
            <div className="flex items-center gap-4">
              <button onClick={() => setShowPrivacy(true)} className="hover:text-neutral-300 cursor-pointer">Privacy</button>
              <button onClick={() => setShowTerms(true)} className="hover:text-neutral-300 cursor-pointer">Terms</button>
              <button onClick={() => setShowContact(true)} className="hover:text-neutral-300 cursor-pointer">Contact</button>
              <button onClick={() => setShowSitemap(true)} className="hover:text-neutral-300 cursor-pointer">Sitemap</button>
            </div>
          </div>
        </div>
      </footer>

      {/* 7. MANDATORY COMPLIANCE & GAME MODALS */}
      <GameModal game={activeGame} onClose={() => setActiveGame(null)} />
      <PrivacyPolicyModal isOpen={showPrivacy} onClose={() => setShowPrivacy(false)} />
      <TermsOfServiceModal isOpen={showTerms} onClose={() => setShowTerms(false)} />
      <AboutUsModal isOpen={showAbout} onClose={() => setShowAbout(false)} />
      <ContactUsModal isOpen={showContact} onClose={() => setShowContact(false)} />
      <SitemapModal
        isOpen={showSitemap}
        onClose={() => setShowSitemap(false)}
        onSelectGame={(g) => setActiveGame(g)}
        onOpenPrivacy={() => setShowPrivacy(true)}
        onOpenTerms={() => setShowTerms(true)}
        onOpenAbout={() => setShowAbout(true)}
        onOpenContact={() => setShowContact(true)}
      />
      <CookieConsentBanner onOpenPrivacy={() => setShowPrivacy(true)} />
    </div>
  );
}

// Individual Game Card Component
interface GameCardProps {
  game: GameInfo;
  isFavorite: boolean;
  onToggleFavorite: () => void;
  onPlay: () => void;
}

function GameCard({ game, isFavorite, onToggleFavorite, onPlay }: GameCardProps) {
  return (
    <div className="p-4 rounded-xl border border-neutral-800 bg-neutral-900/60 hover:bg-neutral-900 hover:border-neutral-700 transition-all duration-200 flex flex-col justify-between group shadow-xs">
      <div>
        {/* Top Badges */}
        <div className="flex items-center justify-between gap-2">
          <span className="text-xs font-mono font-bold text-neutral-500">#{game.id}</span>
          <div className="flex items-center gap-1.5">
            {game.badge && (
              <span className="px-2 py-0.5 rounded bg-amber-500/10 text-amber-400 text-[10px] font-bold uppercase tracking-wider">
                {game.badge}
              </span>
            )}
            <button
              onClick={onToggleFavorite}
              className={`p-1 rounded-md hover:bg-neutral-800 transition-colors cursor-pointer ${
                isFavorite ? 'text-red-500 fill-current' : 'text-neutral-600 hover:text-neutral-400'
              }`}
              title="Add to Favorites"
            >
              <Heart className={`w-3.5 h-3.5 ${isFavorite ? 'fill-current' : ''}`} />
            </button>
          </div>
        </div>

        {/* Title */}
        <h3 className="text-base font-bold text-neutral-100 font-display mt-2 group-hover:text-amber-400 transition-colors leading-snug">
          {game.name}
        </h3>

        {/* Metadata */}
        <div className="flex items-center gap-2 text-[11px] text-neutral-400 mt-1">
          <span>{game.category}</span>
          <span>·</span>
          <span
            className={
              game.difficulty === 'Easy'
                ? 'text-emerald-400'
                : game.difficulty === 'Medium'
                ? 'text-amber-400'
                : 'text-rose-400'
            }
          >
            {game.difficulty}
          </span>
          <span>·</span>
          <span className="flex items-center gap-0.5 text-neutral-400">
            <Smartphone className="w-3 h-3 text-emerald-400" /> Touch
          </span>
        </div>

        {/* Detailed Description */}
        <p className="text-xs text-neutral-300 mt-2.5 line-clamp-2 leading-relaxed">
          {game.description}
        </p>
      </div>

      {/* Card Bottom CTA */}
      <div className="mt-4 pt-3 border-t border-neutral-800/80 flex items-center justify-between">
        <span className="text-[11px] text-neutral-500 font-mono tabular-nums">
          {game.plays.toLocaleString()} plays
        </span>
        <button
          onClick={onPlay}
          className="px-3.5 py-1.5 bg-amber-500 group-hover:bg-amber-400 active:scale-95 text-neutral-950 font-bold rounded-lg text-xs flex items-center gap-1.5 transition-transform shadow-md cursor-pointer whitespace-nowrap"
        >
          <Play className="w-3 h-3 fill-current" />
          <span>Play Now</span>
        </button>
      </div>
    </div>
  );
}
