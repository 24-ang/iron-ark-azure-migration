
import React from 'react';
import { Play, Lock, Settings, Github, Save } from 'lucide-react';
import { P5Button } from '../ui/P5Button';

interface MainMenuProps {
  onNewGame: () => void;
  onLoadGame: () => void;
  onOpenSettings: () => void;
}

export const MainMenu: React.FC<MainMenuProps> = ({ onNewGame, onLoadGame, onOpenSettings }) => {
  return (
    <div className="flex flex-col gap-4 w-full max-w-sm z-20 md:transform md:-skew-x-6 md:translate-y-10">
        
        {/* New Game Button */}
        <div className="w-full transform transition-all hover:scale-105 hover:-translate-x-4 duration-300 animate-in slide-in-from-right duration-700 delay-500">
            <button 
                onClick={onNewGame}
                className="group relative w-full py-4 px-8 bg-gradient-to-r from-blue-600 to-blue-700 text-white font-display text-lg md:text-xl tracking-wider transform transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-blue-500/50 border-b-4 border-blue-800 active:border-b-0 active:mt-1 overflow-hidden"
            >
                <span className="relative z-10 flex items-center justify-center gap-3">
                    <Play size={24} className="group-hover:animate-pulse" />
                    启动救援协议
                </span>
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-cyan-500 opacity-0 group-hover:opacity-30 transition-opacity duration-300" />
            </button>
        </div>
        
        {/* Continue Button */}
        <div className="w-full transform transition-all hover:scale-105 hover:translate-x-4 duration-300 animate-in slide-in-from-right duration-700 delay-600">
            <button 
                onClick={onLoadGame}
                className="group relative w-full py-4 px-8 bg-zinc-800 text-white font-display text-lg md:text-xl tracking-wider transform transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-zinc-500/50 border-b-4 border-zinc-900 active:border-b-0 active:mt-1 overflow-hidden"
            >
                <span className="relative z-10 flex items-center justify-center gap-3">
                    <Save size={24} className="group-hover:animate-pulse" />
                    读取存档
                </span>
                <div className="absolute inset-0 bg-gradient-to-r from-zinc-700 to-zinc-600 opacity-0 group-hover:opacity-30 transition-opacity duration-300" />
            </button>
        </div>

        {/* Settings Button */}
        <div className="w-full transform transition-all hover:scale-105 hover:-translate-x-4 duration-300 animate-in slide-in-from-right duration-700 delay-700">
            <button 
                onClick={onOpenSettings}
                className="group relative w-full py-4 px-8 bg-zinc-700 text-white font-display text-lg md:text-xl tracking-wider transform transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-zinc-500/50 border-b-4 border-zinc-800 active:border-b-0 active:mt-1 overflow-hidden"
            >
                <span className="relative z-10 flex items-center justify-center gap-3">
                    <Settings size={24} className="group-hover:animate-pulse" />
                    系统设置
                </span>
                <div className="absolute inset-0 bg-gradient-to-r from-zinc-600 to-zinc-500 opacity-0 group-hover:opacity-30 transition-opacity duration-300" />
            </button>
        </div>

        <div className="w-full transform transition-all hover:scale-105 hover:translate-x-4 duration-300 animate-in slide-in-from-right duration-700 delay-800">
            <P5Button 
                label="GitHub" 
                variant="black" 
                icon={<Github />} 
                onClick={() => window.open('https://github.com/MikuLXK/DXC', '_blank', 'noopener,noreferrer')}
                className="w-full shadow-[10px_10px_0_rgba(255,255,255,0.1)]"
            />
        </div>
    </div>
  );
};
