import React, { useState } from 'react';
import { ChevronDown, ChevronRight } from 'lucide-react';

interface CollapsibleSectionProps {
    title: string;
    icon?: React.ReactNode;
    children: React.ReactNode;
    defaultOpen?: boolean;
    isHellMode?: boolean;
}

export const CollapsibleSection: React.FC<CollapsibleSectionProps> = ({ 
    title, 
    icon, 
    children, 
    defaultOpen = false, 
    isHellMode 
}) => {
    const [isOpen, setIsOpen] = useState(defaultOpen);
    const borderColor = isHellMode ? 'border-red-900' : 'border-green-900';
    const textColor = isHellMode ? 'text-red-400' : 'text-green-400';
    const hoverBg = isHellMode ? 'hover:bg-red-900/20' : 'hover:bg-green-900/20';

    return (
        <div className={`border ${borderColor} bg-black/40 overflow-hidden`}>
            <button 
                onClick={() => setIsOpen(!isOpen)}
                className={`w-full flex items-center justify-between p-2 ${hoverBg} transition-colors cursor-pointer group`}
            >
                <div className="flex items-center gap-2">
                    {icon && <span className={`${textColor} opacity-60 group-hover:opacity-100 transition-opacity`}>{icon}</span>}
                    <span className={`text-xs uppercase tracking-widest font-bold ${textColor}`}>{title}</span>
                </div>
                <div className={`${textColor} opacity-60 transition-transform ${isOpen ? 'rotate-180' : 'rotate-0'}`}>
                    <ChevronDown size={14} />
                </div>
            </button>
            
            {/* Content with Slide Animation */}
            <div 
                className={`transition-all duration-300 ease-in-out overflow-hidden ${isOpen ? 'max-h-[500px] opacity-100' : 'max-h-0 opacity-0'}`}
            >
                <div className="p-2 pt-0 border-t border-zinc-800/50">
                    {children}
                </div>
            </div>
        </div>
    );
};
