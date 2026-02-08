
import React, { useState } from 'react';
import { X, Globe, Crown, Mic2, AlertTriangle, Scroll, Clock, Radar, ListChecks, Swords, Flag } from 'lucide-react';
import { WorldState } from '../../../types';

interface DynamicWorldModalProps {
  isOpen: boolean;
  onClose: () => void;
  worldState?: WorldState;
  npcStates?: any[];
  gameTime?: string;
  onSilentWorldUpdate?: () => void;
}

type WorldTab = 'GUILD' | 'DENATUS' | 'RUMORS' | 'TRACKING' | 'FACTIONS' | 'WAR_GAME';

export const DynamicWorldModal: React.FC<DynamicWorldModalProps> = ({ 
    isOpen, 
    onClose,
    worldState,
    gameTime,
    onSilentWorldUpdate
}) => {
  const [activeTab, setActiveTab] = useState<WorldTab>('GUILD');

  const parseGameTime = (input?: string) => {
      if (!input) return null;
      const dayMatch = input.match(/第(\d+)日/);
      const timeMatch = input.match(/(\d{1,2}):(\d{2})/);
      if (!dayMatch || !timeMatch) return null;
      const day = parseInt(dayMatch[1], 10);
      const hour = parseInt(timeMatch[1], 10);
      const minute = parseInt(timeMatch[2], 10);
      if ([day, hour, minute].some(n => Number.isNaN(n))) return null;
      return day * 24 * 60 + hour * 60 + minute;
  };

  const safeWorldState = worldState || {
      异常指数: 0,
      公会声望: 50,
      头条新闻: [],
      街头传闻: [],
      废土董事会: {
          下次会议开启时间: "UNKNOWN",
          会议主题: "TBD",
          讨论内容: [],
          最终结果: "PENDING"
      },
      NPC后台跟踪: [],
      势力格局: { S级: [], A级: [], B级至I级: [], 备注: "Not set" },
      区域战争: { 状态: "Not Started", 参战势力: [], 形式: "", 争夺目标: "", 开始时间: "", 结束时间: "", 结果: "", 备注: "" },
      下次更新: "UNKNOWN"
  };

  const nowValue = parseGameTime(gameTime);
  const nextValue = parseGameTime(safeWorldState.下次更新);
  const isUpdateDue = nowValue !== null && nextValue !== null ? nowValue >= nextValue : false;

  if (!isOpen) return null;

  return (
    <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-md p-0 md:p-4 animate-in zoom-in-95 duration-200">
      <div className="w-full h-full md:h-[85vh] md:max-w-6xl bg-[#0f172a] border-0 md:border-4 border-[#3b82f6] relative flex flex-col shadow-[0_0_50px_rgba(59,130,246,0.3)]">
        
        {/* Header */}
        <div className="bg-[#1e3a8a] p-4 flex justify-between items-center border-b-2 border-[#3b82f6] shrink-0">
             <div className="flex items-center gap-3 text-white">
                <Globe className="animate-spin-slow" />
                <div>
                    <h2 className="text-xl md:text-3xl font-display uppercase tracking-widest text-shadow-sm truncate">WORLD INTELLIGENCE</h2>
                    <div className="text-[10px] font-mono opacity-70">WORLD MONITOR SYSTEM // ORARIO</div>
                </div>
             </div>
             <button onClick={onClose} className="p-2 hover:bg-white hover:text-[#1e3a8a] text-white transition-colors border border-white rounded-full">
                <X size={24} />
             </button>
        </div>

        {/* Sidebar + Content Layout */}
        <div className="flex flex-col md:flex-row flex-1 overflow-hidden">
            {/* Sidebar */}
            <div className="w-full md:w-64 bg-[#020617] border-b md:border-b-0 md:border-r border-[#1e293b] p-0 md:p-4 flex md:flex-col shrink-0 overflow-x-auto">
                <TabButton 
                    label="GUILD NEWS" 
                    icon={<Scroll size={18}/>} 
                    active={activeTab === 'GUILD'} 
                    onClick={() => setActiveTab('GUILD')} 
                />
                <TabButton 
                    label="THE BOARD" 
                    icon={<Crown size={18}/>} 
                    active={activeTab === 'DENATUS'} 
                    onClick={() => setActiveTab('DENATUS')} 
                />
                <TabButton 
                    label="RUMORS" 
                    icon={<Mic2 size={18}/>} 
                    active={activeTab === 'RUMORS'} 
                    onClick={() => setActiveTab('RUMORS')} 
                />
                <TabButton 
                    label="FACTIONS" 
                    icon={<Flag size={18}/>} 
                    active={activeTab === 'FACTIONS'} 
                    onClick={() => setActiveTab('FACTIONS')} 
                />
                <TabButton 
                    label="ZONE WAR" 
                    icon={<Swords size={18}/>} 
                    active={activeTab === 'WAR_GAME'} 
                    onClick={() => setActiveTab('WAR_GAME')} 
                />
                <TabButton 
                    label="TRACKING" 
                    icon={<Radar size={18}/>} 
                    active={activeTab === 'TRACKING'} 
                    onClick={() => setActiveTab('TRACKING')} 
                />
            </div>

            {/* Main Content */}
            <div className="flex-1 p-4 md:p-8 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] bg-[#0f172a] relative overflow-y-auto custom-scrollbar pb-32 md:pb-8">
                
                {/* Next Update Indicator */}
                <div className="absolute top-4 right-4 flex items-center gap-3 bg-black/50 px-3 py-2 rounded border border-blue-900/50">
                    <Clock size={12} className="text-blue-400" />
                    <div className="flex flex-col leading-tight">
                        <span className="text-[10px] text-zinc-400 font-mono">Current Time: {gameTime || "Unknown"}</span>
                        <span className="text-[10px] text-zinc-400 font-mono">Next Update: {safeWorldState.下次更新 || "Calculating..."}</span>
                        <span className={`text-[10px] font-mono ${isUpdateDue ? 'text-green-400' : 'text-zinc-500'}`}>
                            {isUpdateDue ? 'UPDATE READY' : 'MONITORING'}
                        </span>
                    </div>
                    {isUpdateDue && onSilentWorldUpdate && (
                        <button
                            onClick={onSilentWorldUpdate}
                            className="ml-2 px-2 py-1 text-[10px] uppercase tracking-widest bg-blue-600 text-white hover:bg-blue-500"
                        >
                            SILENT UPDATE
                        </button>
                    )}
                </div>

                {activeTab === 'GUILD' && <GuildPanel world={safeWorldState} />}
                {activeTab === 'DENATUS' && <DenatusPanel world={safeWorldState} />}
                {activeTab === 'RUMORS' && <RumorsPanel world={safeWorldState} />}
                {activeTab === 'FACTIONS' && <FactionsPanel world={safeWorldState} />}
                {activeTab === 'WAR_GAME' && <WarGamePanel world={safeWorldState} />}
                {activeTab === 'TRACKING' && <TrackingPanel world={safeWorldState} />}
            </div>
        </div>
      </div>
    </div>
  );
};

const TabButton = ({ label, icon, active, onClick }: any) => (
    <button 
        onClick={onClick}
        className={`flex-1 md:flex-none md:w-full text-center md:text-left p-3 flex items-center justify-center md:justify-start gap-2 md:gap-3 font-display uppercase tracking-wide transition-all border-b-4 md:border-b-0 md:border-l-4 whitespace-nowrap text-sm md:text-base
            ${active 
                ? 'bg-[#1e293b] border-blue-500 text-blue-400' 
                : 'border-transparent text-zinc-500 hover:text-white hover:bg-[#0f172a]'
            }
        `}
    >
        {icon} <span>{label}</span>
    </button>
);

// --- Panels ---

const GuildPanel = ({ world }: { world: WorldState }) => (
    <div className="space-y-8 animate-in slide-in-from-bottom-4 duration-500">
        <div className="border-b border-blue-900 pb-2 mb-6">
            <h3 className="text-blue-400 font-display text-2xl uppercase tracking-widest">GUILD OFFICIAL ANNOUNCEMENT</h3>
        </div>

        {/* Threat Level */}
        <div className="bg-[#020617] p-6 border border-blue-900/50 shadow-lg relative overflow-hidden">
             <div className="flex justify-between items-center mb-2 z-10 relative">
                 <h4 className="text-white font-bold uppercase flex items-center gap-2"><AlertTriangle size={18} className="text-red-500"/> Anomaly Index</h4>
                 <span className="text-red-500 font-mono text-2xl font-bold">{world.异常指数}%</span>
             </div>
             <div className="w-full h-4 bg-zinc-900 rounded-full overflow-hidden border border-zinc-700 relative z-10">
                  <div 
                    className="h-full bg-gradient-to-r from-green-600 via-yellow-500 to-red-600 transition-all duration-1000"
                    style={{ width: `${world.异常指数}%` }}
                  />
             </div>
             <p className="text-zinc-500 text-xs mt-3 italic relative z-10">
                  {world.异常指数 < 30 ? "Stable condition. Recommended for new adventurers." : 
                  world.异常指数 < 70 ? "Irregular monster spawns observed in mid-level zones. Caution advised." : 
                  "ALERT! Strengthened species detected in deep zones. High-level adventurers only."}
             </p>
             <div className="absolute right-0 top-0 text-red-900/10 transform rotate-12 pointer-events-none">
                 <AlertTriangle size={150} />
             </div>
        </div>

        {/* News Feed */}
        <div className="space-y-4">
             <div className="flex justify-between items-center">
                 <h4 className="text-blue-300 font-bold uppercase text-sm border-l-4 border-blue-600 pl-2">BREAKING NEWS</h4>
                 <span className="text-[10px] text-zinc-600">SOURCE: GUILD HQ</span>
             </div>
             {world.头条新闻.length > 0 ? (
                 world.头条新闻.map((news, i) => (
                     <div key={i} className="bg-zinc-900/80 p-4 border-l-2 border-zinc-700 hover:border-blue-500 transition-colors flex justify-between group">
                         <p className="text-zinc-300 font-sans text-sm">{news}</p>
                     </div>
                 ))
             ) : (
                 <div className="text-zinc-600 italic p-4 text-center border border-dashed border-zinc-800">No major news.</div>
             )}
        </div>
    </div>
);

const DenatusPanel = ({ world }: { world: WorldState }) => (
    <div className="space-y-8 animate-in slide-in-from-bottom-4 duration-500">
        <div className="border-b border-purple-900 pb-2 mb-6">
            <h3 className="text-purple-400 font-display text-2xl uppercase tracking-widest">WASTELAND BOARD</h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-[#020617] p-6 border border-purple-900/50 relative overflow-hidden">
                <div className="absolute -top-6 -right-6 text-purple-900/20">
                    <Crown size={120} />
                </div>
                <h4 className="text-purple-400 font-bold uppercase mb-4 relative z-10">MEETING OVERVIEW</h4>
                <div className="space-y-3 text-sm text-zinc-300 relative z-10">
                    <div className="flex justify-between border-b border-purple-900/40 pb-2">
                        <span className="text-zinc-500">Next Meeting</span>
                        <span className="text-purple-300 font-mono">{world.废土董事会?.下次会议开启时间 || "UNKNOWN"}</span>
                    </div>
                    <div className="flex justify-between border-b border-purple-900/40 pb-2">
                        <span className="text-zinc-500">Subject</span>
                        <span className="text-purple-200">{world.废土董事会?.会议主题 || "TBD"}</span>
                    </div>
                    <div className="flex justify-between">
                        <span className="text-zinc-500">Outcome</span>
                        <span className="text-emerald-300">{world.废土董事会?.最终结果 || "PENDING"}</span>
                    </div>
                </div>
            </div>

            <div className="bg-[#020617] p-6 border border-zinc-800">
                <h4 className="text-zinc-400 font-bold uppercase mb-4 text-sm">DISCUSSION LOG</h4>
                <div className="space-y-3 max-h-56 overflow-y-auto custom-scrollbar pr-2">
                    {world.废土董事会?.讨论内容?.length > 0 ? (
                        world.废土董事会.讨论内容.map((line: any, idx: number) => (
                            <div key={idx} className="text-xs text-zinc-300 border-b border-zinc-800 pb-2">
                                <span className="text-purple-300 font-bold mr-2">{line.角色}:</span>
                                <span>{line.对话}</span>
                            </div>
                        ))
                    ) : (
                        <div className="text-zinc-600 text-xs italic">No discussion records</div>
                    )}
                </div>
            </div>
        </div>

        <div className="bg-[#020617] p-6 border border-zinc-800">
            <h4 className="text-purple-400 font-bold uppercase mb-3 text-sm">GUILD REPUTATION</h4>
            <div className="flex items-center gap-4">
                <div className="text-4xl font-display text-white">{world.公会声望}</div>
                <div className="flex-1 h-2 bg-zinc-900 rounded-full overflow-hidden">
                    <div className="h-full bg-purple-600" style={{ width: `${Math.min(100, world.公会声望 / 100)}%` }} />
                </div>
            </div>
        </div>
    </div>
);

const RumorsPanel = ({ world }: { world: WorldState }) => (
    <div className="space-y-8 animate-in slide-in-from-bottom-4 duration-500">
        <div className="border-b border-green-900 pb-2 mb-6">
            <h3 className="text-green-400 font-display text-2xl uppercase tracking-widest">STREET RUMORS</h3>
        </div>

        <div className="grid grid-cols-1 gap-4">
             {world.街头传闻.length > 0 ? (
                 world.街头传闻.map((rumor, i) => (
                     <div key={i} className="flex gap-4 items-center bg-[#020617] p-4 border border-zinc-800 hover:border-green-600 transition-colors group">
                         <div className="bg-green-900/20 w-12 h-12 flex items-center justify-center shrink-0 rounded-full group-hover:bg-green-600 group-hover:text-black transition-colors text-green-600">
                             <Mic2 size={20} />
                         </div>
                         <div className="flex-1">
                             <p className="text-zinc-200 text-sm mb-1 font-bold">"{rumor.主题}"</p>
                             <div className="flex items-center gap-2">
                                 <div className="flex-1 h-1 bg-zinc-900 rounded-full overflow-hidden">
                                     <div className="h-full bg-green-600" style={{ width: `${rumor.传播度}%` }} />
                                 </div>
                                 <span className="text-xs text-green-500 font-mono">{rumor.传播度}% SPREAD</span>
                             </div>
                         </div>
                     </div>
                 ))
             ) : (
                 <div className="text-center py-10 text-zinc-600 border border-dashed border-zinc-800">
                     <p>Things are quiet. No special rumors.</p>
                 </div>
             )}
        </div>
    </div>
);

const FactionsPanel = ({ world }: { world: WorldState }) => {
    const tiers = world.势力格局 || { S级: [], A级: [], B级至I级: [], 备注: "" };
    const renderList = (items: string[]) => items.length > 0 ? items.join('、') : 'No records';
    return (
        <div className="space-y-8 animate-in slide-in-from-bottom-4 duration-500">
            <div className="border-b border-amber-900 pb-2 mb-6">
                <h3 className="text-amber-400 font-display text-2xl uppercase tracking-widest">FACTIONS</h3>
            </div>
            <div className="grid grid-cols-1 gap-4">
                <div className="bg-[#020617] p-4 border border-amber-900/40">
                    <div className="text-amber-300 font-bold mb-2">S-TIER FACTIONS</div>
                    <div className="text-zinc-300 text-sm">{renderList(tiers.S级 || [])}</div>
                </div>
                <div className="bg-[#020617] p-4 border border-amber-900/40">
                    <div className="text-amber-200 font-bold mb-2">A-TIER FACTIONS</div>
                    <div className="text-zinc-300 text-sm">{renderList(tiers.A级 || [])}</div>
                </div>
                <div className="bg-[#020617] p-4 border border-amber-900/40">
                    <div className="text-amber-100 font-bold mb-2">B ~ I TIER FACTIONS</div>
                    <div className="text-zinc-300 text-sm">{renderList(tiers.B级至I级 || [])}</div>
                </div>
                {tiers.备注 && (
                    <div className="text-[10px] text-zinc-500 italic px-2">{tiers.备注}</div>
                )}
            </div>
        </div>
    );
};

const WarGamePanel = ({ world }: { world: WorldState }) => {
    const war = world.区域战争 || { 状态: "Not Started", 参战势力: [], 形式: "", 争夺目标: "", 开始时间: "", 结束时间: "", 结果: "", 备注: "" };
    return (
        <div className="space-y-8 animate-in slide-in-from-bottom-4 duration-500">
            <div className="border-b border-red-900 pb-2 mb-6">
                <h3 className="text-red-400 font-display text-2xl uppercase tracking-widest">ZONE WAR</h3>
            </div>
            <div className="bg-[#020617] p-6 border border-red-900/50">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-zinc-300">
                    <div className="flex justify-between border-b border-red-900/30 pb-2">
                        <span className="text-zinc-500">Status</span>
                        <span className="text-red-300 font-mono">{war.状态 || "Not Started"}</span>
                    </div>
                    <div className="flex justify-between border-b border-red-900/30 pb-2">
                        <span className="text-zinc-500">Format</span>
                        <span>{war.形式 || "TBD"}</span>
                    </div>
                    <div className="flex justify-between border-b border-red-900/30 pb-2">
                        <span className="text-zinc-500">Start Time</span>
                        <span>{war.开始时间 || "Unknown"}</span>
                    </div>
                    <div className="flex justify-between border-b border-red-900/30 pb-2">
                        <span className="text-zinc-500">End Time</span>
                        <span>{war.结束时间 || "Unknown"}</span>
                    </div>
                    <div className="md:col-span-2 flex justify-between border-b border-red-900/30 pb-2">
                        <span className="text-zinc-500">Objective</span>
                        <span className="text-red-200">{war.争夺目标 || "Undisclosed"}</span>
                    </div>
                    <div className="md:col-span-2 flex justify-between">
                        <span className="text-zinc-500">Result</span>
                        <span className="text-emerald-300">{war.结果 || "TBD"}</span>
                    </div>
                </div>
                <div className="mt-4 text-xs text-zinc-400">
                    Participants: {(war.参战势力 || []).length > 0 ? war.参战势力.join('、') : "None"}
                </div>
                {war.备注 && <div className="mt-2 text-[10px] text-zinc-500 italic">{war.备注}</div>}
            </div>
        </div>
    );
};

const TrackingPanel = ({ world }: { world: WorldState }) => (
    <div className="space-y-8 animate-in slide-in-from-bottom-4 duration-500">
        <div className="border-b border-cyan-900 pb-2 mb-6">
            <h3 className="text-cyan-400 font-display text-2xl uppercase tracking-widest">NPC TRACKING</h3>
        </div>

        <div className="grid grid-cols-1 gap-4">
             {world.NPC后台跟踪 && world.NPC后台跟踪.length > 0 ? (
                 world.NPC后台跟踪.map((track, i) => (
                     <div key={i} className="flex gap-4 items-start bg-[#020617] p-4 border border-zinc-800 hover:border-cyan-600 transition-colors group">
                         <div className="bg-cyan-900/20 w-12 h-12 flex items-center justify-center shrink-0 rounded-full group-hover:bg-cyan-600 group-hover:text-black transition-colors text-cyan-600">
                             <ListChecks size={20} />
                         </div>
                         <div className="flex-1 space-y-1">
                             <div className="text-zinc-200 text-sm font-bold">{track.NPC}</div>
                             <div className="text-zinc-400 text-xs">Action: {track.当前行动}</div>
                             {track.位置 && <div className="text-[10px] text-zinc-500">Loc: {track.位置}</div>}
                             {track.进度 && <div className="text-[10px] text-emerald-400">Progress: {track.进度}</div>}
                             {track.预计完成 && <div className="text-[10px] text-zinc-500">ETA: {track.预计完成}</div>}
                         </div>
                     </div>
                 ))
             ) : (
                 <div className="text-center py-10 text-zinc-600 border border-dashed border-zinc-800">
                     <p>No active tracking tasks.</p>
                 </div>
             )}
        </div>
    </div>
);
