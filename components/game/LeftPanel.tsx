
import React from 'react';
import { CharacterStats, BodyPartStats, Difficulty, StatusEffect } from '../../types';
import { ShieldAlert, Cpu, Activity, Battery, AlertTriangle, Sparkles, Skull, Coins, Zap, Heart, Droplets, Utensils, Grab, Scan, HardDrive, Crosshair, ArrowUpRight, Brain, Shield } from 'lucide-react';
import { VitalBar, StatRow } from './left/LeftPanelComponents';
import { WireframeBody } from './left/WireframeBody';
import { PanelBlock } from '../ui/PanelBlock';

interface LeftPanelProps {
  stats: CharacterStats;
  className?: string;
  isHellMode?: boolean;
  difficulty?: Difficulty;
}

const BodyPartRow = ({ label, data }: { label: string, data: BodyPartStats }) => {
    if (!data) return null;
    const { 当前, 最大 } = data;
    const percent = 最大 > 0 ? Math.min(100, Math.max(0, (当前 / 最大) * 100)) : 0;
    
    let colorClass = 'bg-green-600';
    if (percent < 30) colorClass = 'bg-red-600';
    else if (percent < 60) colorClass = 'bg-amber-500';
    else if (percent < 90) colorClass = 'bg-green-500';
    else colorClass = 'bg-emerald-400';

    return (
        <div className="flex items-center gap-2 text-[10px] uppercase font-bold text-zinc-400">
            <span className="w-8 text-right shrink-0">{label}</span>
            <div className="flex-1 h-1.5 bg-black border border-zinc-800 relative overflow-hidden">
                <div 
                    className={`h-full ${colorClass} transition-all duration-500`} 
                    style={{ width: `${percent}%` }} 
                />
            </div>
            <div className="w-12 text-right font-mono leading-none text-[9px] text-zinc-500">
                {Math.round(percent)}%
            </div>
        </div>
    );
};

const SimpleEquipSlot = ({ label, slotKey, stats, icon }: { label: string, slotKey: string, stats: CharacterStats, icon: React.ReactNode }) => {
    const itemName = stats.装备 ? stats.装备[slotKey] : null;
    
    return (
        <div className="flex items-center gap-2 p-1 border-b border-dashed border-zinc-800/50 hover:bg-green-900/10 transition-colors group">
            <div className="text-zinc-600 group-hover:text-green-500 transition-colors">{icon}</div>
            <div className="flex-1 min-w-0 overflow-hidden flex justify-between items-center">
                <span className="text-[9px] text-zinc-500 font-bold uppercase w-10 shrink-0">{label}</span>
                <span className={`text-[10px] truncate ${itemName ? 'text-zinc-300 group-hover:text-green-300' : 'text-zinc-700 italic'}`}>
                    {itemName || "-"}
                </span>
            </div>
        </div>
    );
};

const StatusBadge: React.FC<{ entry: StatusEffect | string; variant: 'buff' | 'curse' }> = ({ entry, variant }) => {
    // Basic implementation for quick restoration
    const name = typeof entry === 'string' ? entry : entry.名称;
    const color = variant === 'curse' ? 'text-red-400 bg-red-900/20 border-red-800' : 'text-emerald-400 bg-emerald-900/20 border-emerald-800';
    return (
        <span className={`text-[9px] px-1.5 py-0.5 border ${color} rounded flex items-center gap-1`}>
            {variant === 'curse' ? <Skull size={8}/> : <Sparkles size={8}/>}
            {name}
        </span>
    );
};

export const LeftPanel: React.FC<LeftPanelProps> = ({ stats, className = '', isHellMode, difficulty }) => {
  const isNormalPlus = difficulty ? difficulty !== Difficulty.EASY : false;
  const showPhysiology = isNormalPlus && !!stats.身体部位;

  return (
    <div className={`w-full h-full relative flex flex-col p-0 overflow-hidden bg-black ${className}`}>
      
      {/* Background Decor - Grid */}
      <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/graphy.png')] opacity-10 pointer-events-none" />
      <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-transparent to-black/80 pointer-events-none" />

      {/* --- Top Header: DAY / TIME (Mocked based on reference) --- */}
      <div className="shrink-0 h-10 border-b border-green-900/50 bg-green-950/20 flex items-center px-4 justify-between relative">
          <div className="flex items-center gap-4">
              <div className="bg-green-900/30 px-2 py-0.5 text-green-400 font-mono text-xs border border-green-700/30">
                  DAY 1
              </div>
              <div className="text-green-500 font-mono text-xs flex items-center gap-1">
                  <Activity size={12} className="animate-pulse" /> 08:00
              </div>
          </div>
          <div className="text-[10px] text-green-600/50 uppercase tracking-widest font-bold">
              WASTELAND OS v1.0
          </div>
          {/* Bottom Grid Line decoration */}
          <div className="absolute bottom-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-green-500/50 to-transparent" />
      </div>

      {/* --- Scrollable Content: Modular Blocks --- */}
      <div className="flex-1 overflow-y-auto custom-scrollbar p-3 space-y-3">
          
          {/* 1. PHYSIOLOGY (Injury) */}
          <PanelBlock title="PHYSIOLOGY" icon={<Scan size={12} />}>
              <div className="flex gap-2 h-32">
                  {/* Wireframe */}
                  <div className="w-1/3 relative border-r border-green-900/30 pr-1">
                      {stats.身体部位 && <WireframeBody bodyParts={stats.身体部位} />}
                  </div>
                  {/* Details */}
                  <div className="flex-1 space-y-1 overflow-y-auto custom-scrollbar pr-1">
                       {stats.身体部位 && (
                           <>
                               <BodyPartRow label="HEAD" data={stats.身体部位.头部} />
                               <BodyPartRow label="CHEST" data={stats.身体部位.胸部} />
                               <BodyPartRow label="CORE" data={stats.身体部位.腹部} />
                               <BodyPartRow label="L.ARM" data={stats.身体部位.左臂} />
                               <BodyPartRow label="R.ARM" data={stats.身体部位.右臂} />
                               <BodyPartRow label="L.LEG" data={stats.身体部位.左腿} />
                               <BodyPartRow label="R.LEG" data={stats.身体部位.右腿} />
                           </>
                       )}
                  </div>
              </div>
          </PanelBlock>

          {/* 2. MENTAL HEALTH (Status Bar + Fatigue) */}
          <PanelBlock title="MENTAL HEALTH" icon={<Brain size={12} />}>
              <div className="space-y-3">
                   {/* Fatigue */}
                  <div className="space-y-1">
                      <div className="flex justify-between text-[9px] uppercase text-zinc-500">
                          <span className="flex items-center gap-1"><AlertTriangle size={10} /> FATIGUE</span>
                          <span>{stats.疲劳度 || 0}%</span>
                      </div>
                      <div className="h-1 bg-zinc-900 border border-zinc-800">
                          <div className={`h-full ${stats.疲劳度 > 50 ? 'bg-amber-600' : 'bg-green-600'}`} style={{ width: `${Math.min(100, stats.疲劳度 || 0)}%` }} />
                      </div>
                  </div>

                  {/* Vitals Grid */}
                  <div className="grid grid-cols-2 gap-3">
                      <div className="space-y-2">
                           <VitalBar label="HP" current={stats.生命值} max={stats.最大生命值} color="bg-green-600" icon={<Heart size={10}/>} compact />
                           <VitalBar label="MP" current={stats.精神力} max={stats.最大精神力} color="bg-emerald-600" icon={<Zap size={10}/>} compact />
                           <VitalBar label="SP" current={stats.体力} max={stats.最大体力} color="bg-amber-600" icon={<Battery size={10}/>} compact />
                      </div>
                      <div className="space-y-2">
                          {/* Currencies Box */}
                          <div className="bg-black border border-green-900/30 p-2 flex flex-col justify-between h-full">
                               <div className="flex justify-between items-center text-[10px]">
                                   <span className="text-zinc-500">VALIS</span>
                                   <span className="text-amber-500 font-mono">{stats.法利?.toLocaleString() || 0}</span>
                               </div>
                               <div className="flex justify-between items-center text-[10px]">
                                   <span className="text-zinc-500">EXCELIA</span>
                                   <span className="text-green-500 font-mono">{stats.经验值?.toLocaleString() || 0}</span>
                               </div>
                          </div>
                      </div>
                  </div>
              </div>
          </PanelBlock>

          {/* 3. COMBAT STATS (Attributes) */}
          <PanelBlock title="COMBAT STATS" icon={<Crosshair size={12} />}>
              <div className="grid grid-cols-2 gap-x-4 gap-y-1">
                  {stats.能力值 && (
                      <>
                        <StatRow label="PWR" val={stats.能力值.力量} />
                        <StatRow label="STR" val={stats.能力值.耐久} />
                        <StatRow label="CTR" val={stats.能力值.灵巧} />
                        <StatRow label="MOB" val={stats.能力值.敏捷} />
                        <StatRow label="NRG" val={stats.能力值.能源} />
                      </>
                  )}
              </div>
          </PanelBlock>

          {/* 4. ABILITIES */}
          <PanelBlock title="PERKS / ABILITIES" icon={<Sparkles size={12} />}>
              <div className="min-h-[60px] max-h-[120px] overflow-y-auto custom-scrollbar space-y-1">
                  {stats.发展能力 && stats.发展能力.length > 0 ? (
                      stats.发展能力.map((da, i) => (
                          <div key={i} className="flex justify-between items-center text-[10px] bg-green-900/10 px-2 py-1 border border-green-900/30">
                              <span className="text-green-300">{da.名称}</span>
                              <span className="text-green-500 font-bold">{da.等级}</span>
                          </div>
                      ))
                  ) : (
                       <div className="text-[10px] text-zinc-600 italic text-center py-2">NO DATA</div>
                  )}
              </div>
          </PanelBlock>
        
          {/* 5. LOADOUT */}
          <PanelBlock title="LOADOUT" icon={<Shield size={12} />}>
              <div className="space-y-1">
                  {stats.装备 && (
                      <>
                          <SimpleEquipSlot label="MAIN" slotKey="主手" stats={stats} icon={<Crosshair size={12}/>} />
                          <SimpleEquipSlot label="SUB" slotKey="副手" stats={stats} icon={<ShieldAlert size={12}/>} />
                          <SimpleEquipSlot label="HEAD" slotKey="头部" stats={stats} icon={<Scan size={12}/>} />
                          <SimpleEquipSlot label="BODY" slotKey="身体" stats={stats} icon={<Cpu size={12}/>} />
                          <SimpleEquipSlot label="ACC" slotKey="饰品" stats={stats} icon={<HardDrive size={12}/>} />
                      </>
                  )}
              </div>
          </PanelBlock>

          {/* Bottom Status Bar (Buffs) */}
          {(stats.状态?.length > 0 || stats.诅咒?.length > 0) && (
              <div className="flex gap-2 flex-wrap pt-2 border-t border-green-900/30">
                  {stats.状态?.map((b, i) => <StatusBadge key={`b-${i}`} entry={b} variant="buff" />)}
                  {stats.系统故障?.map((c, i) => <StatusBadge key={`c-${i}`} entry={c} variant="curse" />)}
              </div>
          )}

      </div>
      
      {/* Footer Mesh */}
      <div className="h-6 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-20 border-t border-green-900/50" />
    </div>
  );
};
