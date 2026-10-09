import React from 'react';

interface AdSenseBannerProps {
  slotType: 'leaderboard' | 'in-feed' | 'rectangle' | 'sticky-bottom';
  className?: string;
}

export const AdSenseBanner: React.FC<AdSenseBannerProps> = ({ slotType, className = '' }) => {
  return (
    <div className={`w-full flex flex-col items-center my-4 overflow-hidden ${className}`}>
      {/* Strict AdSense policy: Must be clearly labeled ADVERTISEMENT */}
      <span className="text-[10px] font-semibold tracking-wider text-neutral-400 uppercase mb-1">
        Advertisement
      </span>

      {/* Responsive Ad Container */}
      <div className="w-full flex items-center justify-center rounded-xl border border-dashed border-neutral-700 bg-neutral-900/60 p-2 sm:p-4 text-center">
        {slotType === 'leaderboard' && (
          <div className="w-full max-w-[728px] h-[90px] sm:h-[90px] flex flex-col items-center justify-center bg-neutral-950/80 rounded-lg border border-neutral-800 text-xs text-neutral-400">
            <span className="font-semibold text-neutral-300">Responsive Leaderboard Ad Slot</span>
            <span className="text-[11px] text-neutral-400 mt-1">Google AdSense (728x90 Desktop / 320x50 Mobile)</span>
          </div>
        )}

        {slotType === 'in-feed' && (
          <div className="w-full h-24 sm:h-28 flex flex-col items-center justify-center bg-neutral-950/80 rounded-lg border border-neutral-800 text-xs text-neutral-400">
            <span className="font-semibold text-neutral-300">In-Feed Native Game Ad Placement</span>
            <span className="text-[11px] text-neutral-400 mt-1">Optimized for high CTR & user engagement</span>
          </div>
        )}

        {slotType === 'rectangle' && (
          <div className="w-[300px] h-[250px] flex flex-col items-center justify-center bg-neutral-950/80 rounded-lg border border-neutral-800 text-xs text-neutral-400">
            <span className="font-semibold text-neutral-300">Medium Rectangle 300x250</span>
            <span className="text-[11px] text-neutral-400 mt-1">Google AdSense Display Unit</span>
          </div>
        )}

        {slotType === 'sticky-bottom' && (
          <div className="w-full max-w-[468px] h-[60px] flex flex-col items-center justify-center bg-neutral-950/90 rounded-lg border border-neutral-800 text-xs text-neutral-400">
            <span className="font-semibold text-neutral-300">Mobile Banner 320x50</span>
          </div>
        )}
      </div>
    </div>
  );
};
