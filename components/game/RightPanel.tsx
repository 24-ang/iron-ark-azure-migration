
import React from 'react';
import { Briefcase, Users, ClipboardList, Zap, Settings, Navigation, Smartphone, Globe, Shield, BookOpen, Scroll, Gem, Brain, Radar, Swords, Archive, HardDrive, Loader2, Home } from 'lucide-react';
import { MenuButton } from './right/MenuButton';

interface RightPanelProps {
    onOpenSettings: () => void;
    onOpenInventory: () => void;
    onOpenEquipment: () => void;
    onOpenSocial: () => void;
    onOpenTasks: () => void;
    onOpenSkills: () => void;
    onOpenMap: () => void;
    onOpenPhone: () => void;
    onOpenWorld: () => void;
    onOpenFamilia: () => void;
    onOpenStory: () => void;
    onOpenContract: () => void;
    onOpenLoot: () => void;
    onOpenLootVault: () => void;
    onOpenSaveManager: () => void;
    onOpenMemory: () => void;
    onOpenPresent?: () => void;
    onOpenParty?: () => void;
    isHellMode?: boolean;
    hasPhone?: boolean;
    hasSignal?: boolean;
    phoneProcessing?: boolean;
    phoneProcessingScope?: 'chat' | 'moment' | 'forum' | 'sync' | null;
}

export const RightPanel: React.FC<RightPanelProps> = ({ 
    onOpenSettings, 
    onOpenInventory,
    onOpenEquipment,
    onOpenSocial,
    onOpenTasks,
    onOpenSkills,
    onOpenMap,
    onOpenPhone,
    onOpenWorld,
    onOpenFamilia,
    onOpenStory,
    onOpenContract,
    onOpenLoot,
    onOpenLootVault,
    onOpenSaveManager,
    onOpenMemory,
    onOpenPresent,
    onOpenParty,
    hasPhone = true,
    hasSignal = false, // Default: No signal (Drifter Mode)
    phoneProcessing = false,
    phoneProcessingScope = null
}) => {
  const phoneIndicator = phoneProcessing ? (
        <div className={`w-4 h-4 rounded-full flex items-center justify-center ${phoneProcessingScope === 'sync' ? 'bg-blue-500' : 'bg-orange-500'} shadow-lg animate-pulse`}>
            <Loader2 size={10} className="text-white animate-spin" />
        </div>
    ) : null;

  return (
    <div className="w-full h-full relative flex flex-col p-2 overflow-hidden">
        {/* Background */}
        <div className="absolute inset-0 bg-black pointer-events-none" />
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10 pointer-events-none" />

        {/* Scrollable Area for Buttons */}
        <div className="flex-1 overflow-y-auto custom-scrollbar pr-1 py-2 space-y-0.5">
            
            {/* Primary Actions - Always Available */}
            <MenuButton label="INVENTORY" icon={<Briefcase size={16} />} delay={50} onClick={onOpenInventory} />
            <MenuButton label="VAULT" icon={<Archive size={16} />} delay={70} onClick={onOpenLootVault} />
            <MenuButton label="CACHE" icon={<Gem size={16} />} delay={90} onClick={onOpenLoot} />
            <MenuButton label="GEAR" icon={<Shield size={16} />} delay={110} onClick={onOpenEquipment} />
            <MenuButton label="TECH" icon={<Zap size={16} />} delay={130} onClick={onOpenSkills} />
            <MenuButton label="SQUAD" icon={<Swords size={16} />} delay={150} onClick={onOpenParty || (() => {})} glitch={!hasSignal} />
            
            <div className="border-t border-green-900/30 my-2" />
            
            {/* Navigation & Awareness */}
            <MenuButton label="SCAN" icon={<Radar size={16} />} delay={170} onClick={onOpenPresent || (() => {})} />
            <MenuButton label="MAP" icon={<Navigation size={16} />} delay={190} onClick={onOpenMap} />
            <MenuButton label="LOGS" icon={<Brain size={16} />} delay={210} onClick={onOpenMemory} />
            
            <div className="border-t border-green-900/30 my-2" />
            
            {/* Network / Social - Gated by Signal */}
            <MenuButton label="COMMS" icon={<Smartphone size={16} />} delay={230} onClick={onOpenPhone} disabled={!hasPhone} indicator={phoneIndicator} glitch={!hasSignal} />
            <MenuButton label="WORLD" icon={<Globe size={16} />} delay={250} onClick={onOpenWorld} glitch={!hasSignal} />
            <MenuButton label="SOCIAL" icon={<Users size={16} />} delay={270} onClick={onOpenSocial} glitch={!hasSignal} />
            <MenuButton label="HOME" icon={<Home size={16} />} delay={290} onClick={onOpenFamilia} glitch={!hasSignal} />
            <MenuButton label="TASKS" icon={<ClipboardList size={16} />} delay={310} onClick={onOpenTasks} />
            <MenuButton label="DATA" icon={<HardDrive size={16} />} delay={330} onClick={onOpenSaveManager} />
            
            <div className="border-t border-green-900/30 my-2" />
            
            <MenuButton label="STORY" icon={<BookOpen size={16} />} delay={350} onClick={onOpenStory} glitch={!hasSignal} />
            <MenuButton label="BONDS" icon={<Scroll size={16} />} delay={370} onClick={onOpenContract} glitch={!hasSignal} />
        </div>
        
        {/* Fixed Bottom: Config */}
        <div className="shrink-0 pt-2 border-t border-green-900/50">
            <MenuButton label="CONFIG" icon={<Settings size={16} className="animate-spin-slow" />} delay={400} onClick={onOpenSettings} />
        </div>
    </div>
  );
};
