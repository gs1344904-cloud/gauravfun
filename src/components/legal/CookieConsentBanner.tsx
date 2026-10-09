import React, { useState, useEffect } from 'react';
import { Cookie, Shield } from 'lucide-react';

interface CookieBannerProps {
  onOpenPrivacy: () => void;
}

export const CookieConsentBanner: React.FC<CookieBannerProps> = ({ onOpenPrivacy }) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem('arcade100_cookie_consent');
    if (!consent) {
      const timer = setTimeout(() => setIsVisible(true), 1200);
      return () => clearTimeout(timer);
    }
  }, []);

  const acceptAll = () => {
    localStorage.setItem('arcade100_cookie_consent', 'accepted');
    setIsVisible(false);
  };

  const decline = () => {
    localStorage.setItem('arcade100_cookie_consent', 'essential_only');
    setIsVisible(false);
  };

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-0 inset-x-0 z-50 p-3 sm:p-4 bg-neutral-950/95 border-t border-neutral-800 shadow-2xl backdrop-blur-md">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-3 text-neutral-300">
          <span className="p-2 bg-amber-500/10 text-amber-400 rounded-lg shrink-0">
            <Cookie className="w-5 h-5" />
          </span>
          <p className="leading-relaxed">
            Arcade100 and trusted third-party partners (such as Google AdSense) utilize cookies and local storage to personalize advertisements, ensure fair high-score tracking, and analyze traffic. Review our{' '}
            <button
              onClick={onOpenPrivacy}
              className="text-amber-400 underline hover:text-amber-300 font-semibold cursor-pointer"
            >
              Privacy Policy
            </button>.
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0 w-full sm:w-auto justify-end">
          <button
            onClick={decline}
            className="px-4 py-2 bg-neutral-800 hover:bg-neutral-700 text-neutral-300 rounded-lg font-semibold text-xs cursor-pointer"
          >
            Essential Only
          </button>
          <button
            onClick={acceptAll}
            className="px-5 py-2 bg-amber-500 hover:bg-amber-400 text-neutral-950 font-bold rounded-lg text-xs cursor-pointer transition-transform active:scale-95"
          >
            Accept All
          </button>
        </div>
      </div>
    </div>
  );
};
