import React from 'react';
import { BodyPartStats } from '../../../types';

interface WireframeBodyProps {
    bodyParts: {
        头部?: BodyPartStats;
        胸部?: BodyPartStats;
        腹部?: BodyPartStats;
        左臂?: BodyPartStats;
        右臂?: BodyPartStats;
        左腿?: BodyPartStats;
        右腿?: BodyPartStats;
    };
}

const getPartColor = (data?: BodyPartStats) => {
    if (!data) return '#14532d'; // Dark green if no data
    const percent = data.最大 > 0 ? (data.当前 / data.最大) * 100 : 0;
    if (percent <= 0) return '#7f1d1d'; // Red-900 - destroyed
    if (percent < 30) return '#dc2626'; // Red-500 - critical
    if (percent < 60) return '#f59e0b'; // Amber-500 - damaged
    if (percent < 90) return '#22c55e'; // Green-500 - operational
    return '#4ade80'; // Green-400 - optimal
};

export const WireframeBody: React.FC<WireframeBodyProps> = ({ bodyParts }) => {
    const headColor = getPartColor(bodyParts.头部);
    const chestColor = getPartColor(bodyParts.胸部);
    const coreColor = getPartColor(bodyParts.腹部);
    const lArmColor = getPartColor(bodyParts.左臂);
    const rArmColor = getPartColor(bodyParts.右臂);
    const lLegColor = getPartColor(bodyParts.左腿);
    const rLegColor = getPartColor(bodyParts.右腿);

    return (
        <div className="relative w-full h-full flex items-center justify-center p-2">
            {/* Background Grid */}
            <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/graphy.png')] opacity-20" />
            
            {/* SVG Wireframe Figure */}
            <svg 
                viewBox="0 0 100 180" 
                className="w-full h-full max-h-[200px]"
                style={{ filter: 'drop-shadow(0 0 3px rgba(34, 197, 94, 0.5))' }}
            >
                {/* Grid Background Lines */}
                <defs>
                    <pattern id="grid" width="10" height="10" patternUnits="userSpaceOnUse">
                        <path d="M 10 0 L 0 0 0 10" fill="none" stroke="#22c55e" strokeWidth="0.2" opacity="0.3"/>
                    </pattern>
                </defs>
                <rect width="100" height="180" fill="url(#grid)" />
                
                {/* Head */}
                <ellipse cx="50" cy="20" rx="12" ry="14" fill="none" stroke={headColor} strokeWidth="1.5" />
                <circle cx="46" cy="18" r="2" fill={headColor} opacity="0.5" />
                <circle cx="54" cy="18" r="2" fill={headColor} opacity="0.5" />
                
                {/* Neck */}
                <line x1="50" y1="34" x2="50" y2="40" stroke={chestColor} strokeWidth="2" />
                
                {/* Chest/Torso */}
                <path 
                    d="M 35 42 L 35 80 L 50 85 L 65 80 L 65 42 L 50 38 Z" 
                    fill="none" 
                    stroke={chestColor} 
                    strokeWidth="1.5" 
                />
                {/* Chest Detail Lines */}
                <line x1="40" y1="50" x2="60" y2="50" stroke={chestColor} strokeWidth="0.5" opacity="0.5" />
                <line x1="42" y1="60" x2="58" y2="60" stroke={chestColor} strokeWidth="0.5" opacity="0.5" />
                
                {/* Core/Abdomen */}
                <path 
                    d="M 38 82 L 38 100 L 50 105 L 62 100 L 62 82" 
                    fill="none" 
                    stroke={coreColor} 
                    strokeWidth="1.5" 
                />
                
                {/* Left Arm */}
                <line x1="35" y1="45" x2="20" y2="55" stroke={lArmColor} strokeWidth="2" />
                <line x1="20" y1="55" x2="12" y2="85" stroke={lArmColor} strokeWidth="1.5" />
                <circle cx="12" cy="88" r="3" fill="none" stroke={lArmColor} strokeWidth="1" />
                
                {/* Right Arm */}
                <line x1="65" y1="45" x2="80" y2="55" stroke={rArmColor} strokeWidth="2" />
                <line x1="80" y1="55" x2="88" y2="85" stroke={rArmColor} strokeWidth="1.5" />
                <circle cx="88" cy="88" r="3" fill="none" stroke={rArmColor} strokeWidth="1" />
                
                {/* Left Leg */}
                <line x1="42" y1="105" x2="35" y2="140" stroke={lLegColor} strokeWidth="2" />
                <line x1="35" y1="140" x2="30" y2="170" stroke={lLegColor} strokeWidth="1.5" />
                <ellipse cx="30" cy="174" rx="4" ry="2" fill="none" stroke={lLegColor} strokeWidth="1" />
                
                {/* Right Leg */}
                <line x1="58" y1="105" x2="65" y2="140" stroke={rLegColor} strokeWidth="2" />
                <line x1="65" y1="140" x2="70" y2="170" stroke={rLegColor} strokeWidth="1.5" />
                <ellipse cx="70" cy="174" rx="4" ry="2" fill="none" stroke={rLegColor} strokeWidth="1" />
                
                {/* Center Line (Spine) */}
                <line x1="50" y1="40" x2="50" y2="105" stroke="#22c55e" strokeWidth="0.3" opacity="0.3" strokeDasharray="2,2" />
            </svg>
            
            {/* Scan Line Effect */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute w-full h-0.5 bg-gradient-to-r from-transparent via-green-400 to-transparent animate-scan-line opacity-50" />
            </div>
        </div>
    );
};
