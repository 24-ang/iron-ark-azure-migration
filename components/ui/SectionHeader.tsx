import React from 'react';

interface SectionHeaderProps {
    title: string;
    icon?: React.ReactNode;
    className?: string; // Container class
    textClassName?: string; // Text specific class override
    rightElement?: React.ReactNode;
}

export const SectionHeader: React.FC<SectionHeaderProps> = ({ title, icon, className = '', textClassName = '', rightElement }) => {
    return (
        <div className={`flex items-center justify-between border-b 2px border-green-900/50 pb-2 mb-3 ${className} group`}>
            <div className="flex items-center gap-2">
                {icon && <div className="text-cta animate-pulse">{icon}</div>}
                
                <h3 className={`font-display font-bold italic uppercase tracking-widest text-cta text-shadow-green ${textClassName || 'text-sm md:text-base'}`}>
                    {title}
                </h3>
            </div>
            
            {rightElement && (
                <div className="text-xs">
                    {rightElement}
                </div>
            )}
        </div>
    );
};
