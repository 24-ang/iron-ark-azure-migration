
import React, { useState } from 'react';
import { Clock, MapPin, Grid, CloudRain, Layers, Sun, Maximize2, Minimize2 } from 'lucide-react';
import { GeoPoint } from '../../types';

interface TopNavProps {
  time: string;
  location: string;
  floor: number;
  weather: string;
  coords: GeoPoint;
  isHellMode?: boolean;
}

export const TopNav: React.FC<TopNavProps> = ({ time, location, floor, weather, coords, isHellMode }) => {
  const [isFullscreen, setIsFullscreen] = useState(false);

  const toggleFullscreen = () => {
      if (!document.fullscreenElement) {
          document.documentElement.requestFullscreen().catch((e) => {
              console.log(`Error attempting to enable fullscreen: ${e.message}`);
          });
      } else {
          if (document.exitFullscreen) {
              document.exitFullscreen();
          }
      }
  };

  React.useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
    };
  }, []);

  // Parse time string "第X日 HH:MM"
  let dayStr = "DAY 1";
  let timeStr = "00:00";
  let fullDateStr = "1000-01-01";
  
  const match = time.match(/第(\d+)日\s+(\d{2}:\d{2})/);
  if (match) {
      dayStr = `DAY ${match[1]}`;
      timeStr = match[2];
      
      const start = new Date("1000-01-01");
      start.setDate(start.getDate() + (parseInt(match[1]) - 1));
      fullDateStr = start.toISOString().split('T')[0];
  } else {
      if(time.includes(' ')) {
        const p = time.split(' ');
        dayStr = p[0];
        timeStr = p[1];
      }
  }

  const coordsString = `X:${Math.round(coords.x)} Y:${Math.round(coords.y)}`;

  // Theme Constants - Terminal Style
  const textColor = isHellMode ? 'text-red-500' : 'text-green-500';
  const glowClass = isHellMode ? '' : 'phosphor-glow';

  return (
    <div className={`w-full relative z-50 bg-black/95 backdrop-blur-sm border-b-2 border-green-500 shadow-[0_0_15px_rgba(34,197,94,0.2)]`}>
      {/* Top accent line */}
      <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-green-500/50 to-transparent"></div>
      
      {/* Main Info Bar */}
      <div className="flex items-center justify-between px-4 py-2 md:py-3">
        
        {/* Left: Day + Time */}
        <div className="flex items-center gap-4">
          <div className="flex flex-col items-start">
            <div className={`terminal-text text-xs md:text-sm ${textColor} ${glowClass} tracking-widest font-bold`}>
              {dayStr}
            </div>
            <div className="text-zinc-500 text-[10px] md:text-xs font-mono">
              {fullDateStr}
            </div>
          </div>
          
          <div className="h-8 w-px bg-zinc-800" />
          
          <div className="flex items-center gap-2">
            <Clock size={14} className={textColor} />
            <span className={`terminal-text text-lg md:text-xl ${textColor} ${glowClass} font-bold tracking-wider`}>
              {timeStr}
            </span>
          </div>
        </div>

        {/* Center: Location */}
        <div className="flex items-center gap-2 flex-1 justify-center">
          <MapPin size={14} className="text-amber" />
          <span className="terminal-text text-amber amber-glow text-sm md:text-base font-bold tracking-wider truncate max-w-xs">
            {location}
          </span>
        </div>

        {/* Right: Floor + Weather + Coords */}
        <div className="flex items-center gap-3 md:gap-4">
          <div className="flex items-center gap-1.5">
            <Layers size={12} className="text-zinc-500" />
            <span className="text-zinc-400 text-xs md:text-sm font-mono">
              F{floor}
            </span>
          </div>

          <div className="h-8 w-px bg-zinc-800 hidden md:block" />

          <div className="hidden md:flex items-center gap-1.5">
            {weather.includes('晴') || weather.includes('Clear') ? (
              <Sun size={12} className="text-amber" />
            ) : (
              <CloudRain size={12} className="text-cyan-500" />
            )}
            <span className="text-zinc-400 text-xs md:text-sm font-mono truncate max-w-[100px]">
              {weather}
            </span>
          </div>

          <div className="h-8 w-px bg-zinc-800 hidden md:block" />

          <div className="hidden md:flex items-center gap-1.5">
            <Grid size={12} className="text-zinc-600" />
            <span className="text-zinc-500 text-[10px] md:text-xs font-mono">
              {coordsString}
            </span>
          </div>

          <button
            onClick={toggleFullscreen}
            className="p-1.5 border border-zinc-800 hover:border-green-500 hover:bg-green-900/20 text-zinc-500 hover:text-green-500 transition-colors"
            title={isFullscreen ? "Exit Fullscreen" : "Enter Fullscreen"}
          >
            {isFullscreen ? <Minimize2 size={14} /> : <Maximize2 size={14} />}
          </button>
        </div>
      </div>
    </div>
  );
};
