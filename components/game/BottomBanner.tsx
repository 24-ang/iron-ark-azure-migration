
import React from 'react';
import { Radio } from 'lucide-react';

interface BottomBannerProps {
  isHellMode?: boolean;
  announcements?: string[];
}

export const BottomBanner: React.FC<BottomBannerProps> = ({ isHellMode, announcements }) => {
  const accentText = isHellMode ? 'text-red-500' : 'text-green-500';
  const baseAnnouncements = Array.isArray(announcements)
    ? announcements.filter((item) => typeof item === 'string' && item.trim().length > 0)
    : [];
  const displayItems = baseAnnouncements.length > 0
    ? baseAnnouncements.map((item) => `GUILD BROADCAST: ${item}`)
    : ['GUILD BROADCAST: NO ACTIVE ALERTS'];
  const loopItems = displayItems.length > 1 ? [...displayItems, ...displayItems] : displayItems;

  return (
    <div className="w-full h-10 bg-black/95 flex items-center relative overflow-hidden border-t-2 border-green-500 shadow-[0_0_15px_rgba(34,197,94,0.2)] shrink-0 z-50 backdrop-blur-sm">
        {/* Top accent line */}
        <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-green-500/50 to-transparent"></div>
        
        {/* Left corner accent */}
        <div className="absolute left-0 top-0 w-12 h-full border-r border-green-900/30 bg-gradient-to-r from-green-950/20 to-transparent flex items-center justify-center">
            <Radio size={14} className="text-green-600/50 animate-pulse" />
        </div>
        
        {/* Right corner accent */}
        <div className="absolute right-0 top-0 w-12 h-full border-l border-green-900/30 bg-gradient-to-l from-green-950/20 to-transparent flex items-center justify-center">
            <div className="w-2 h-2 rounded-full bg-green-500/50 animate-pulse"></div>
        </div>
        
        {/* Scrolling Ticker Animation */}
        <div className="absolute whitespace-nowrap animate-marquee flex items-center gap-8 text-zinc-600 font-display uppercase tracking-widest text-lg select-none opacity-50">
            {loopItems.map((item, idx) => (
                <React.Fragment key={`${item}-${idx}`}>
                    <span>{item}</span>
                    {idx < loopItems.length - 1 && <span className={accentText}>///</span>}
                </React.Fragment>
            ))}
        </div>
        
        {/* Style injection for marquee */}
        <style>{`
          @keyframes marquee {
            0% { transform: translateX(0); }
            100% { transform: translateX(-50%); }
          }
          .animate-marquee {
            animation: marquee 30s linear infinite;
          }
        `}</style>
        
        {/* Bottom scan line effect */}
        <div className="absolute bottom-0 left-0 w-full h-[2px] bg-gradient-to-r from-green-900/0 via-green-600/30 to-green-900/0"></div>
        
        {/* Tech detail - small notches */}
        <div className="absolute left-1/4 top-0 w-[2px] h-2 bg-green-700/40"></div>
        <div className="absolute left-1/2 top-0 w-[2px] h-2 bg-green-700/40"></div>
        <div className="absolute left-3/4 top-0 w-[2px] h-2 bg-green-700/40"></div>
    </div>
  );
};
