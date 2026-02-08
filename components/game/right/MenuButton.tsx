
import React from 'react';
import { Lock } from 'lucide-react';

interface MenuButtonProps {
    icon: React.ReactNode;
    label: string;
    delay: number;
    colorClass?: string;
    hoverColorClass?: string;
    onClick: () => void;
    disabled?: boolean;
    indicator?: React.ReactNode;
    glitch?: boolean;
}

export const MenuButton: React.FC<MenuButtonProps> = ({ 
    icon, 
    label, 
    delay, 
    onClick, 
    disabled, 
    indicator,
    glitch
}) => {

    // Glitch state for locked features (no signal)
    if (glitch) {
        return (
            <button 
                disabled
                className="w-full group relative h-11 shrink-0 overflow-hidden transition-all duration-200 mb-1.5 rounded-md
                    bg-zinc-900/80 border border-red-900/50 cursor-not-allowed opacity-60"
                style={{ animationDelay: `${delay}ms` }}
            >
                <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-20 animate-pulse" />
                <div className="relative h-full flex items-center px-3 gap-3">
                    <div className="text-red-700 animate-pulse">
                        <Lock size={16} />
                    </div>
                    <span className="text-xs font-mono text-red-800 uppercase tracking-wider blur-[0.3px]">
                        {label.split('').map((c, i) => Math.random() > 0.8 ? String.fromCharCode(33 + Math.floor(Math.random() * 90)) : c).join('')}
                    </span>
                </div>
                <div className="absolute bottom-1 right-2 text-[8px] text-red-700 font-mono animate-pulse">NO SIGNAL</div>
            </button>
        );
    }

    // New clean style matching reference image
    return (
        <button 
            onClick={disabled ? undefined : onClick}
            disabled={disabled}
            className={`w-full group relative h-11 shrink-0 overflow-hidden transition-all duration-200 mb-1.5 rounded-md
                bg-green-900/20 border border-green-700/50
                hover:bg-green-800/40 hover:border-green-500 hover:shadow-[0_0_10px_rgba(34,197,94,0.3)]
                disabled:opacity-40 disabled:cursor-not-allowed
            `}
            style={{ animationDelay: `${delay}ms` }}
        >
            {/* Subtle Grid Texture */}
            <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-5" />
            
            {/* Left Accent Bar */}
            <div className="absolute left-0 top-1 bottom-1 w-1 bg-green-500 rounded-r opacity-80 group-hover:opacity-100 group-hover:shadow-[0_0_5px_#22c55e] transition-all" />

            {/* Content */}
            <div className="relative h-full flex items-center px-4 pl-5 gap-3 z-10">
                <div className="text-green-400 group-hover:text-green-300 transition-colors">
                    {icon}
                </div>
                <span className="text-sm font-mono text-green-300 uppercase tracking-widest group-hover:text-green-200 transition-colors">
                    {label}
                </span>
            </div>
            
            {indicator && (
                <div className="absolute top-2 right-2 z-20 pointer-events-none">
                    {indicator}
                </div>
            )}
        </button>
    );
};
