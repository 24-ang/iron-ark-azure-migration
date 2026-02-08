import React from 'react';

interface PanelBlockProps {
    title: string;
    icon?: React.ReactNode;
    children: React.ReactNode;
    className?: string;
}

export const PanelBlock: React.FC<PanelBlockProps> = ({ title, icon, children, className = '' }) => {
    return (
        <div className={`border-2 border-green-700/60 bg-black/80 ${className}`}>
            {/* Header Bar */}
            <div className="bg-green-900/20 border-b border-green-700/60 px-3 py-1.5 flex items-center gap-2">
                {icon && <div className="text-green-400">{icon}</div>}
                <span className="text-[11px] font-bold uppercase tracking-widest text-green-400">
                    {title}
                </span>
            </div>
            
            {/* Content */}
            <div className="p-3">
                {children}
            </div>
        </div>
    );
};
