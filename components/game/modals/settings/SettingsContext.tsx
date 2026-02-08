
import React, { useState } from 'react';
import { LayoutList, ArrowUp, ArrowDown, ToggleLeft, ToggleRight, Settings, Code, Eye, EyeOff, Radio, Check, Star, Settings2, Maximize2, Minimize2, Swords } from 'lucide-react';
import { AppSettings, ContextModuleConfig, GameState, Confidant } from '../../../../types';
import { assembleFullPrompt, generateSingleModuleContext } from '../../../../utils/ai';

interface SettingsContextProps {
    settings: AppSettings;
    onUpdate: (newSettings: AppSettings) => void;
    gameState: GameState;
    onUpdateGameState: (gs: GameState) => void;
}

export const SettingsContext: React.FC<SettingsContextProps> = ({ settings, onUpdate, gameState, onUpdateGameState }) => {
    const modules = settings.contextConfig?.modules || [];
    const [selectedModuleId, setSelectedModuleId] = useState<string | null>(null);
    const [previewMode, setPreviewMode] = useState<'FULL' | 'MODULE'>('FULL');
    const [isPreviewExpanded, setIsPreviewExpanded] = useState(false);

    const handleUpdateModule = (id: string, updates: Partial<ContextModuleConfig>) => {
        let newModules = modules.map(m => m.id === id ? { ...m, ...updates } : m);
        onUpdate({ ...settings, contextConfig: { ...settings.contextConfig, modules: newModules } });
    };

    const handleUpdateParams = (id: string, paramKey: string, value: any) => {
        const target = modules.find(m => m.id === id);
        if (!target) return;
        handleUpdateModule(id, { params: { ...target.params, [paramKey]: value } });
    };

    const moveModule = (index: number, direction: 'up' | 'down') => {
        const newModules = [...modules];
        if (direction === 'up' && index > 0) {
            [newModules[index - 1], newModules[index]] = [newModules[index], newModules[index - 1]];
            newModules.forEach((m, i) => m.order = i);
            onUpdate({ ...settings, contextConfig: { ...settings.contextConfig, modules: newModules } });
        } else if (direction === 'down' && index < newModules.length - 1) {
            [newModules[index + 1], newModules[index]] = [newModules[index], newModules[index + 1]];
            newModules.forEach((m, i) => m.order = i);
            onUpdate({ ...settings, contextConfig: { ...settings.contextConfig, modules: newModules } });
        }
    };

    const toggleNPCProp = (npcId: string, prop: keyof Confidant) => {
        const newConfidants = (gameState.社交 || []).map(c => {
            if (c.id === npcId) {
                return { ...c, [prop]: !c[prop] };
            }
            return c;
        });
        onUpdateGameState({ ...gameState, 社交: newConfidants });
    };

    const togglePhoneTarget = (name: string) => {
        if (!activeModule) return;
        const allNames = (gameState.社交 || []).map(c => c.姓名);
        const current = Array.isArray(activeModule.params.targets) && activeModule.params.targets.length > 0
            ? activeModule.params.targets
            : allNames;
        const next = current.includes(name) ? current.filter((n: string) => n !== name) : [...current, name];
        const normalized = next.length === allNames.length ? [] : next;
        handleUpdateParams(activeModule.id, 'targets', normalized);
    };

    const updatePhoneTargetLimit = (name: string, value: number) => {
        if (!activeModule) return;
        const current = activeModule.params.targetLimits || {};
        const next = { ...current };
        if (!value || value < 0) delete next[name];
        else next[name] = value;
        handleUpdateParams(activeModule.id, 'targetLimits', next);
    };

    const getPreviewText = () => {
        if (previewMode === 'MODULE' && selectedModuleId) {
            const mod = modules.find(m => m.id === selectedModuleId);
            if (mod) return generateSingleModuleContext(mod, gameState, settings);
            return "(Module not found)";
        }
        return assembleFullPrompt(settings.promptModules, gameState, settings, [], "(USER INPUT PREVIEW)", []);
    };

    const previewText = getPreviewText();
    const sortedModules = [...modules].sort((a,b) => a.order - b.order);
    const activeModule = selectedModuleId ? modules.find(m => m.id === selectedModuleId) : null;

    return (
        <div className="flex flex-col h-full animate-in slide-in-from-right-8 duration-300 gap-4 overflow-hidden relative">
            <div className="flex items-center gap-3 border-b border-steel-gray pb-4 shrink-0">
                <LayoutList className="text-cta" />
                <h3 className="text-2xl font-display uppercase italic text-cta">CONTEXT MODULE MANAGER</h3>
            </div>

            <div className="flex-1 flex flex-col md:flex-row gap-4 overflow-hidden relative">
                {/* Left Sidebar: List - Hide when expanded */}
                <div className={`md:w-1/3 border-r border-steel-gray bg-black/20 flex flex-col transition-all duration-300 ${isPreviewExpanded ? 'w-0 opacity-0 pointer-events-none md:w-0' : 'w-full'}`}>
                    <div className="p-3 bg-black/40 font-bold text-xs uppercase text-gray border-b border-steel-gray truncate">
                        MODULE SEQUENCE
                    </div>
                    <div className="flex-1 overflow-y-auto custom-scrollbar p-2 space-y-2">
                        {sortedModules.map((mod, index) => (
                            <div 
                                key={mod.id} 
                                onClick={() => setSelectedModuleId(mod.id)}
                                className={`border rounded p-2 cursor-pointer flex items-center gap-2 group transition-all
                                    ${selectedModuleId === mod.id ? 'bg-cta/10 border-cta shadow-sm' : 'bg-transparent border-steel-gray hover:border-cta/50'}
                                    ${!mod.enabled ? 'opacity-50' : ''}
                                `}
                            >
                                <div className="flex flex-col gap-1 mr-1" onClick={(e) => e.stopPropagation()}>
                                    <button onClick={() => moveModule(index, 'up')} disabled={index === 0} className="hover:text-cta disabled:opacity-10 text-gray"><ArrowUp size={10}/></button>
                                    <button onClick={() => moveModule(index, 'down')} disabled={index === modules.length - 1} className="hover:text-cta disabled:opacity-10 text-gray"><ArrowDown size={10}/></button>
                                </div>
                                
                                <div className="flex-1 min-w-0">
                                    <div className={`font-bold text-xs truncate ${selectedModuleId === mod.id ? 'text-cta' : 'text-gray'}`}>{mod.name}</div>
                                    <div className="text-[9px] text-gray/70 font-mono">{mod.type}</div>
                                </div>

                                <button 
                                    onClick={(e) => { e.stopPropagation(); handleUpdateModule(mod.id, { enabled: !mod.enabled }); }} 
                                    className={`${mod.enabled ? 'text-cta' : 'text-gray hover:text-white'}`}
                                >
                                    {mod.enabled ? <ToggleRight size={20}/> : <ToggleLeft size={20}/>}
                                </button>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Right Area: Config & Preview */}
                <div className={`flex-1 flex flex-col bg-transparent overflow-hidden transition-all duration-300 ${isPreviewExpanded ? 'w-full' : ''}`}>
                    
                    {/* Module Configuration (Hidden when expanded) */}
                    {!isPreviewExpanded && (
                        <div className="flex-1 overflow-y-auto custom-scrollbar p-4 bg-black/20 border-b border-steel-gray">
                            {activeModule ? (
                                <div>
                                    <h4 className="font-bold text-sm uppercase text-cta mb-4 flex items-center gap-2 pb-2 border-b border-steel-gray">
                                        <Settings2 size={16} /> MODULE CONFIGURATION: {activeModule.name}
                                    </h4>
                                    
                                    <div className="space-y-6">
                                        {/* Params Config based on Type */}
                                        {activeModule.type === 'SOCIAL_CONTEXT' ? (
                                            <div className="space-y-4">
                                                <div className="grid grid-cols-2 gap-4">
                                                    <div className="bg-void p-3 border border-steel-gray rounded">
                                                        <label className="block text-xs font-bold text-gray mb-1">SPECIAL FOCUS (PRESENT) LIMIT</label>
                                                        <div className="flex items-center gap-2">
                                                            <input 
                                                                type="number" min="1" max="50"
                                                                value={activeModule.params.specialPresentMemoryLimit ?? activeModule.params.specialMemoryLimit ?? 30} 
                                                                onChange={(e) => handleUpdateParams(activeModule.id, 'specialPresentMemoryLimit', parseInt(e.target.value))}
                                                                className="w-16 p-1 border border-steel-gray bg-void text-cta text-xs font-mono"
                                                            />
                                                            <span className="text-[10px] text-gray">ITEMS</span>
                                                        </div>
                                                    </div>
                                                    <div className="bg-void p-3 border border-steel-gray rounded">
                                                        <label className="block text-xs font-bold text-gray mb-1">NORMAL (PRESENT) LIMIT</label>
                                                        <div className="flex items-center gap-2">
                                                            <input 
                                                                type="number" min="0" max="100"
                                                                value={activeModule.params.presentMemoryLimit ?? activeModule.params.normalMemoryLimit ?? 30} 
                                                                onChange={(e) => handleUpdateParams(activeModule.id, 'presentMemoryLimit', parseInt(e.target.value))}
                                                                className="w-16 p-1 border border-steel-gray bg-void text-cta text-xs font-mono"
                                                            />
                                                            <span className="text-[10px] text-gray">ITEMS</span>
                                                        </div>
                                                    </div>
                                                    <div className="bg-void p-3 border border-steel-gray rounded">
                                                        <label className="block text-xs font-bold text-gray mb-1">SPECIAL FOCUS (ABSENT) LIMIT</label>
                                                        <div className="flex items-center gap-2">
                                                            <input 
                                                                type="number" min="0" max="50"
                                                                value={activeModule.params.specialAbsentMemoryLimit ?? 12} 
                                                                onChange={(e) => handleUpdateParams(activeModule.id, 'specialAbsentMemoryLimit', parseInt(e.target.value))}
                                                                className="w-16 p-1 border border-steel-gray bg-void text-cta text-xs font-mono"
                                                            />
                                                            <span className="text-[10px] text-gray">ITEMS</span>
                                                        </div>
                                                    </div>
                                                    <div className="bg-void p-3 border border-steel-gray rounded">
                                                        <label className="block text-xs font-bold text-gray mb-1">NORMAL (ABSENT) LIMIT</label>
                                                        <div className="flex items-center gap-2">
                                                            <input 
                                                                type="number" min="0" max="50"
                                                                value={activeModule.params.absentMemoryLimit ?? 6} 
                                                                onChange={(e) => handleUpdateParams(activeModule.id, 'absentMemoryLimit', parseInt(e.target.value))}
                                                                className="w-16 p-1 border border-steel-gray bg-void text-cta text-xs font-mono"
                                                            />
                                                            <span className="text-[10px] text-gray">ITEMS</span>
                                                        </div>
                                                    </div>
                                                </div>

                                                <div className="border border-steel-gray rounded overflow-hidden bg-void shadow-sm">
                                                    <div className="bg-black/40 px-3 py-2 border-b border-steel-gray text-xs font-bold text-gray flex justify-between">
                                                        <span>NPC STATE OVERRIDE</span>
                                                        <span className="text-[10px] font-normal">Count: {gameState.社交.length}</span>
                                                    </div>
                                                    <div className="max-h-60 overflow-y-auto custom-scrollbar">
                                                        <table className="w-full text-xs text-left">
                                                            <thead className="bg-black/60 text-gray font-medium sticky top-0">
                                                                <tr>
                                                                    <th className="p-2 font-light">Name</th>
                                                                    <th className="p-2 text-center font-light">Present</th>
                                                                    <th className="p-2 text-center font-light">Focus</th>
                                                                    <th className="p-2 text-center font-light">Party</th>
                                                                    <th className="p-2 text-center font-light">Force Context</th>
                                                                </tr>
                                                            </thead>
                                                            <tbody>
                                                                {(gameState.社交 || []).map(c => (
                                                                    <tr key={c.id} className="border-b border-steel-gray/30 hover:bg-cta/5 transition-colors">
                                                                        <td className="p-2 font-bold text-cta">{c.姓名}</td>
                                                                        <td className="p-2 text-center">
                                                                            <button onClick={() => toggleNPCProp(c.id, '是否在场')} className={c.是否在场 ? 'text-cta' : 'text-gray'}>
                                                                                <Eye size={16}/>
                                                                            </button>
                                                                        </td>
                                                                        <td className="p-2 text-center">
                                                                            <button onClick={() => toggleNPCProp(c.id, '特别关注')} className={c.特别关注 ? 'text-amber' : 'text-gray'}>
                                                                                <Star size={16} fill={c.特别关注 ? 'currentColor' : 'none'}/>
                                                                            </button>
                                                                        </td>
                                                                        <td className="p-2 text-center">
                                                                            <button onClick={() => toggleNPCProp(c.id, '是否队友')} className={c.是否队友 ? 'text-cta' : 'text-gray'}>
                                                                                <Swords size={16}/>
                                                                            </button>
                                                                        </td>
                                                                        <td className="p-2 text-center">
                                                                            <button onClick={() => toggleNPCProp(c.id, '强制包含上下文')} className={c.强制包含上下文 ? 'text-blue-400' : 'text-gray'}>
                                                                                <Radio size={16}/>
                                                                            </button>
                                                                        </td>
                                                                    </tr>
                                                                ))}
                                                            </tbody>
                                                        </table>
                                                    </div>
                                                </div>
                                            </div>
                                        ) : activeModule.type === 'PHONE_CONTEXT' ? (
                                            <div className="space-y-4">
                                                <div className="grid grid-cols-3 gap-4">
                                                    <div className="bg-void p-3 border border-steel-gray rounded">
                                                        <label className="block text-xs font-bold text-gray mb-1">CONVERSATION LIMIT</label>
                                                        <div className="flex items-center gap-2">
                                                            <input 
                                                                type="number" min="0" max="100"
                                                                value={activeModule.params.perThreadLimit ?? activeModule.params.perTargetLimit ?? activeModule.params.messageLimit ?? 10} 
                                                                onChange={(e) => handleUpdateParams(activeModule.id, 'perThreadLimit', parseInt(e.target.value))}
                                                                className="w-16 p-1 border border-steel-gray bg-void text-cta text-xs font-mono"
                                                            />
                                                            <span className="text-[10px] text-gray">ITEMS</span>
                                                        </div>
                                                    </div>
                                                    <div className="bg-void p-3 border border-steel-gray rounded">
                                                        <label className="block text-xs font-bold text-gray mb-1">MOMENTS LIMIT</label>
                                                        <div className="flex items-center gap-2">
                                                            <input 
                                                                type="number" min="0" max="50"
                                                                value={activeModule.params.momentLimit ?? 6} 
                                                                onChange={(e) => handleUpdateParams(activeModule.id, 'momentLimit', parseInt(e.target.value))}
                                                                className="w-16 p-1 border border-steel-gray bg-void text-cta text-xs font-mono"
                                                            />
                                                            <span className="text-[10px] text-gray">0=UNLIMITED</span>
                                                        </div>
                                                    </div>
                                                    <div className="bg-void p-3 border border-steel-gray rounded">
                                                        <label className="block text-xs font-bold text-gray mb-1">FORUM LIMIT</label>
                                                        <div className="flex items-center gap-2">
                                                            <input 
                                                                type="number" min="0" max="50"
                                                                value={activeModule.params.forumLimit ?? 6} 
                                                                onChange={(e) => handleUpdateParams(activeModule.id, 'forumLimit', parseInt(e.target.value))}
                                                                className="w-16 p-1 border border-steel-gray bg-void text-cta text-xs font-mono"
                                                            />
                                                            <span className="text-[10px] text-gray">0=UNLIMITED</span>
                                                        </div>
                                                    </div>
                                                </div>

                                                <div className="grid grid-cols-2 gap-4">
                                                    <div className="bg-void p-3 border border-steel-gray rounded flex items-center justify-between">
                                                        <div>
                                                            <div className="text-xs font-bold text-cta">INCLUDE MOMENTS</div>
                                                            <div className="text-[10px] text-gray">OFF: CHAT ONLY</div>
                                                        </div>
                                                        <button 
                                                            onClick={() => handleUpdateParams(activeModule.id, 'includeMoments', !(activeModule.params.includeMoments !== false))}
                                                            className={`${activeModule.params.includeMoments !== false ? 'text-cta' : 'text-gray'}`}
                                                        >
                                                            {activeModule.params.includeMoments !== false ? <ToggleRight size={20}/> : <ToggleLeft size={20}/>}
                                                        </button>
                                                    </div>
                                                    <div className="bg-void p-3 border border-steel-gray rounded flex items-center justify-between">
                                                        <div>
                                                            <div className="text-xs font-bold text-cta">INCLUDE PUBLIC POSTS</div>
                                                            <div className="text-[10px] text-gray">OFF: NO FORUM POSTS</div>
                                                        </div>
                                                        <button 
                                                            onClick={() => handleUpdateParams(activeModule.id, 'includePublicPosts', !(activeModule.params.includePublicPosts !== false))}
                                                            className={`${activeModule.params.includePublicPosts !== false ? 'text-cta' : 'text-gray'}`}
                                                        >
                                                            {activeModule.params.includePublicPosts !== false ? <ToggleRight size={20}/> : <ToggleLeft size={20}/>}
                                                        </button>
                                                    </div>
                                                </div>

                                                <div className="border border-steel-gray rounded overflow-hidden bg-void shadow-sm">
                                                    <div className="bg-black/40 px-3 py-2 border-b border-steel-gray text-xs font-bold text-gray flex justify-between">
                                                        <span>CHARACTER FILTER (EMPTY = ALL)</span>
                                                        <span className="text-[10px] font-normal">Count: {gameState.社交.length}</span>
                                                    </div>
                                                    <div className="max-h-60 overflow-y-auto custom-scrollbar">
                                                        <table className="w-full text-xs text-left">
                                                            <thead className="bg-black/60 text-gray font-medium sticky top-0">
                                                                <tr>
                                                                    <th className="p-2 font-light">Character</th>
                                                                    <th className="p-2 text-center font-light">Show</th>
                                                                    <th className="p-2 text-center font-light">Limit</th>
                                                                </tr>
                                                            </thead>
                                                            <tbody>
                                                                {(gameState.社交 || []).map(c => {
                                                                    const hasFilter = Array.isArray(activeModule.params.targets) && activeModule.params.targets.length > 0;
                                                                    const isEnabled = hasFilter
                                                                        ? activeModule.params.targets.includes(c.姓名)
                                                                        : true;
                                                                    const limitVal = activeModule.params.targetLimits?.[c.姓名] ?? '';
                                                                    return (
                                                                        <tr key={c.id} className="border-b border-steel-gray/30 hover:bg-cta/5 transition-colors">
                                                                            <td className="p-2 font-bold text-cta">{c.姓名}</td>
                                                                            <td className="p-2 text-center">
                                                                                <button onClick={() => togglePhoneTarget(c.姓名)} className={isEnabled ? 'text-cta' : 'text-gray'}>
                                                                                    {isEnabled ? <Eye size={16}/> : <EyeOff size={16}/>}
                                                                                </button>
                                                                            </td>
                                                                            <td className="p-2 text-center">
                                                                                <input 
                                                                                    type="number" min="0" max="100"
                                                                                    value={limitVal}
                                                                                    onChange={(e) => updatePhoneTargetLimit(c.姓名, parseInt(e.target.value))}
                                                                                    placeholder={`${activeModule.params.perThreadLimit ?? activeModule.params.perTargetLimit ?? activeModule.params.messageLimit ?? 10}`}
                                                                                    className="w-12 p-0.5 border border-steel-gray bg-void text-cta text-[10px] font-mono text-center"
                                                                                />
                                                                            </td>
                                                                        </tr>
                                                                    );
                                                                })}
                                                            </tbody>
                                                        </table>
                                                    </div>
                                                </div>
                                            </div>
                                        ) : activeModule.type === 'MAP_CONTEXT' ? (
                                            <div className="space-y-4">
                                                <div className="bg-void p-3 border border-steel-gray rounded flex items-center justify-between">
                                                    <div>
                                                        <div className="text-xs font-bold text-gray">ALWAYS INCLUDE WASTELAND MAP</div>
                                                        <div className="text-[10px] text-gray/70">OFF: ONLY WHEN TRIGGERED</div>
                                                    </div>
                                                    <button 
                                                        onClick={() => handleUpdateParams(activeModule.id, 'alwaysIncludeDungeon', !activeModule.params.alwaysIncludeDungeon)}
                                                        className={`${activeModule.params.alwaysIncludeDungeon ? 'text-cta' : 'text-gray'}`}
                                                    >
                                                        {activeModule.params.alwaysIncludeDungeon ? <ToggleRight size={20}/> : <ToggleLeft size={20}/>}
                                                    </button>
                                                </div>
                                                <div className="bg-void p-3 border border-steel-gray rounded">
                                                    <label className="block text-xs font-bold text-gray mb-1">TRIGGER KEYWORDS (COMMA SEPARATED)</label>
                                                    <input
                                                        type="text"
                                                        value={Array.isArray(activeModule.params.triggerKeywords) ? activeModule.params.triggerKeywords.join(',') : ''}
                                                        onChange={(e) => handleUpdateParams(activeModule.id, 'triggerKeywords', e.target.value.split(',').map(s => s.trim()).filter(Boolean))}
                                                        className="w-full border border-steel-gray rounded p-1 text-xs bg-void text-cta"
                                                        placeholder="map,location,where"
                                                    />
                                                </div>
                                            </div>
                                        ) : (
                                            /* Generic Params */
                                            <div className="grid grid-cols-2 gap-4">
                                                {activeModule.params.messageLimit !== undefined && (
                                                    <div className="bg-void p-3 border border-steel-gray rounded">
                                                        <label className="block text-xs font-bold text-gray mb-1">MESSAGE LIMIT</label>
                                                        <div className="flex items-center gap-2">
                                                            <input 
                                                                type="range" min="1" max="20" className="flex-1 accent-cta"
                                                                value={activeModule.params.messageLimit} 
                                                                onChange={(e) => handleUpdateParams(activeModule.id, 'messageLimit', parseInt(e.target.value))}
                                                            />
                                                            <span className="font-mono text-sm font-bold text-cta">{activeModule.params.messageLimit}</span>
                                                        </div>
                                                    </div>
                                                )}
                                                {activeModule.type === 'MAP_CONTEXT' ? null : activeModule.params.detailLevel !== undefined && (
                                                    <div className="bg-void p-3 border border-steel-gray rounded">
                                                        <label className="block text-xs font-bold text-gray mb-1">DETAIL LEVEL</label>
                                                        <select 
                                                            value={activeModule.params.detailLevel} 
                                                            onChange={(e) => handleUpdateParams(activeModule.id, 'detailLevel', e.target.value)}
                                                            className="w-full border border-steel-gray rounded p-1 text-xs bg-void text-cta"
                                                        >
                                                            <option value="low">LOW (BRIEF)</option>
                                                            <option value="medium">MEDIUM (STANDARD)</option>
                                                            <option value="high">HIGH (DETAILED)</option>
                                                            <option value="raw">RAW JSON</option>
                                                        </select>
                                                    </div>
                                                )}
                                                {Object.keys(activeModule.params).length === 0 && (
                                                    <div className="col-span-2 text-center py-8 text-gray text-xs italic">
                                                        NO CONFIGURATION AVAILABLE FOR THIS MODULE
                                                    </div>
                                                )}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            ) : (
                                <div className="h-full flex flex-col items-center justify-center text-gray">
                                    <Settings size={48} className="mb-4 opacity-20" />
                                    <p className="text-xs uppercase font-bold tracking-widest">SELECT A MODULE TO CONFIGURE</p>
                                </div>
                            )}
                        </div>
                    )}

                    {/* Preview Area */}
                    <div className={`${isPreviewExpanded ? 'flex-1 h-full' : 'h-48'} bg-black/40 border-t border-steel-gray flex flex-col transition-all duration-300 relative`}>
                        <div className="flex justify-between items-center p-2 bg-black text-gray text-[10px] font-bold uppercase tracking-wider shrink-0 border-b border-steel-gray">
                            <span className="flex items-center gap-2"><Code size={12} /> OUTPUT PREVIEW</span>
                            <div className="flex gap-2 items-center">
                                <button onClick={() => setPreviewMode('MODULE')} className={previewMode === 'MODULE' ? 'text-cta' : 'hover:text-white'}>MODULE ONLY</button>
                                <span>|</span>
                                <button onClick={() => setPreviewMode('FULL')} className={previewMode === 'FULL' ? 'text-cta' : 'hover:text-white'}>FULL CONTEXT</button>
                                <div className="w-px h-3 bg-gray mx-1" />
                                <button onClick={() => setIsPreviewExpanded(!isPreviewExpanded)} className="hover:text-white text-gray">
                                    {isPreviewExpanded ? (
                                        <div className="flex items-center gap-1 bg-white/10 px-2 py-0.5 rounded"><Minimize2 size={12}/> EXIT FULL</div>
                                    ) : (
                                        <div className="flex items-center gap-1"><Maximize2 size={12}/> EXPAND</div>
                                    )}
                                </button>
                            </div>
                        </div>
                        <textarea 
                            readOnly 
                            value={previewText}
                            className="flex-1 bg-transparent text-cta font-mono text-[10px] p-3 resize-none outline-none custom-scrollbar leading-relaxed whitespace-pre-wrap"
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};
