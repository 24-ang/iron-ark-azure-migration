
import React, { useState, useRef, useEffect, useLayoutEffect } from 'react';
import { LogEntry, CombatState, CharacterStats, Skill, TechArt, InventoryItem, Confidant, ActionOption } from '../../types';
import { MessageSquare, Sword, Eye, Loader2, ChevronRight, MousePointer2, Terminal, Layers, ChevronUp, Info, X, ArrowRight } from 'lucide-react';
import { CombatPanel } from './CombatPanel';
import { LogEntryItem } from './center/LogEntry';
import { GameInput } from './center/GameInput';
import { EditLogModal } from './center/EditLogModal';

interface CenterPanelProps {
  logs: LogEntry[];
  combatState: CombatState;
  playerStats: CharacterStats;
  skills: Skill[];
  magic: TechArt[];
  inventory?: InventoryItem[];
  confidants: Confidant[];
  onSendMessage: (msg: string) => void;
  onReroll?: () => void;
  lastRawResponse?: string;
  lastThinking?: string;
  onPlayerAction: (action: 'attack' | 'skill' | 'guard' | 'escape' | 'talk' | 'item', payload?: any) => void;
  isProcessing?: boolean;
  isStreaming?: boolean;
  commandQueue?: { id: string, text: string, undoAction?: () => void }[];
  onRemoveCommand?: (id: string) => void;
  
  onEditLog?: (logId: string, newRawResponse: string) => void;
  onDeleteLog?: (logId: string) => void;
  onEditUserLog?: (logId: string, newText: string) => void;
  onUpdateLogText?: (logId: string, newText: string) => void;
  onStopInteraction?: () => void;
  handleUserRewrite?: (logId: string, newText: string) => void; 
  draftInput?: string;
  setDraftInput?: (val: string) => void;

  actionOptions?: ActionOption[];
  fontSize?: 'small' | 'medium' | 'large'; 
  chatLogLimit?: number | null;
  className?: string;
  enableCombatUI?: boolean;
  isHellMode?: boolean;
}

export const CenterPanel: React.FC<CenterPanelProps> = ({ 
    logs, 
    combatState,
    playerStats,
    skills,
    magic,
    inventory,
    confidants = [],
    onSendMessage, 
    onReroll, 
    onPlayerAction,
    isProcessing,
    isStreaming,
    lastRawResponse,
    lastThinking,
    commandQueue = [],
    onRemoveCommand,
    
    onEditLog,
    onDeleteLog,
    onEditUserLog,
    onUpdateLogText,
    onStopInteraction,
    handleUserRewrite,
    draftInput,
    setDraftInput,

    actionOptions = [],
    fontSize = 'medium',
    chatLogLimit = 30,
    className = '',
    enableCombatUI = true,
    isHellMode
}) => {
  const [showCombatUI, setShowCombatUI] = useState(false); 
  const [editingLogId, setEditingLogId] = useState<string | null>(null);
  const [editContent, setEditContent] = useState('');
  const [editMode, setEditMode] = useState<'AI_RAW' | 'USER_TEXT'>('AI_RAW');
  const [jumpTarget, setJumpTarget] = useState('');
  const [jumpHint, setJumpHint] = useState('');
  const [jumpExpanded, setJumpExpanded] = useState(false);
  const [jumpFocused, setJumpFocused] = useState(false);
  const jumpHideTimer = useRef<number | null>(null);
  
  // Refs for scrolling
  const endRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const logRefs = useRef<Map<string, HTMLDivElement>>(new Map());
  
  const prevProcessing = useRef(isProcessing);
  const prevLogsLength = useRef(logs.length);

  // Theme constants
  const halftoneColor = isHellMode ? 'bg-red-900/10' : 'bg-halftone-green opacity-10';
  const textColor = isHellMode ? 'text-red-500' : 'text-cta';
  const processingText = isHellMode ? 'text-red-600' : 'text-cta';
  const turnDividerColor = isHellMode ? 'border-red-900 text-red-600 shadow-[0_0_10px_rgba(220,38,38,0.2)]' : 'border-green-900 text-cta shadow-[0_0_10px_rgba(34,197,94,0.2)]';
  const turnDividerGradient = isHellMode ? 'from-transparent to-red-900' : 'from-transparent to-green-900';
  const actionBorder = isHellMode ? 'border-red-500/50 hover:border-red-400 hover:bg-red-900/40' : 'border-cta/50 hover:border-green-400 hover:bg-green-900/40';
  const actionIcon = isHellMode ? 'text-red-500' : 'text-cta';
  const actionChevron = isHellMode ? 'text-red-600' : 'text-cta';
  const actionBgHighlight = isHellMode ? 'bg-red-500/10' : 'bg-green-500/10';
  const marqueeTextClass = isHellMode ? 'text-red-200' : 'text-zinc-100';
  const marqueeDuplicateClass = isHellMode ? 'text-red-300/70' : 'text-zinc-300/70';
  const showCombatShortcut = combatState.是否战斗中 && enableCombatUI && !isProcessing;
  const showQuickActions = !isProcessing && !combatState.是否战斗中 && actionOptions.length > 0;
  const hasCommandQueue = commandQueue.length > 0;
  const logPaddingClass = (showQuickActions || showCombatShortcut)
      ? (hasCommandQueue ? 'pb-28 md:pb-60' : 'pb-20 md:pb-48')
      : (hasCommandQueue ? 'pb-20 md:pb-32' : 'pb-6 md:pb-16');
  const actionDockOffset = hasCommandQueue ? 'bottom-[9.5rem] md:bottom-[150px]' : 'bottom-[5.5rem] md:bottom-[95px]';

  const turnIndices = logs
      .map(l => (typeof l.turnIndex === 'number' ? l.turnIndex : null))
      .filter((t): t is number => t !== null);
  const uniqueTurns = Array.from(new Set(turnIndices)).sort((a: number, b: number) => a - b);
  const playableTurns = uniqueTurns.filter((t: number) => t > 0);
  const orderedTurns = playableTurns.length > 0 ? playableTurns : uniqueTurns;
  const totalTurns = orderedTurns.length;
  const limit = chatLogLimit === null ? null : (typeof chatLogLimit === 'number' ? chatLogLimit : 30);
  const startTurnIndex = limit ? Math.max(0, totalTurns - limit) : 0;
  const visibleTurns = orderedTurns.slice(startTurnIndex);
  const visibleTurnSet = new Set(visibleTurns);
  const visibleLogs = logs.filter(l => {
      const t = typeof l.turnIndex === 'number' ? l.turnIndex : null;
      if (t === null) return limit === null;
      if (t === 0) return true;
      return visibleTurnSet.has(t);
  });
  const aiActionSeen = new Set<string>();
  const logIndexMap = new Map<string, number>();
  logs.forEach((log, idx) => logIndexMap.set(log.id, idx));
  const turnThinkingMap = new Map<number, string>();
  logs.forEach((log) => {
      if (typeof log.turnIndex === 'number' && log.thinking && !turnThinkingMap.has(log.turnIndex)) {
          turnThinkingMap.set(log.turnIndex, log.thinking);
      }
  });

  const handleJump = () => {
      const target = parseInt(jumpTarget, 10);
      const maxTurn = totalTurns > 0 ? orderedTurns[orderedTurns.length - 1] : 0;
      const minTurn = totalTurns > 0 ? orderedTurns[0] : 0;
      if (Number.isNaN(target) || (target as any) < minTurn || (target as any) > maxTurn) {
          setJumpHint(`范围: ${minTurn}-${maxTurn || minTurn}`);
          return;
      }
      if (!visibleTurnSet.has(target)) {
          setJumpHint('目标区域未加载');
          return;
      }
      const targetLog = logs.find(l => l.turnIndex === target);
      if (!targetLog) {
          setJumpHint('目标区域不存在');
          return;
      }
      const el = logRefs.current.get(targetLog.id);
      if (el) {
          el.scrollIntoView({ behavior: 'smooth', block: 'center' });
          setJumpHint(`已跳转: ${target}`);
          setJumpExpanded(true);
      }
  };

  // Scroll Logic
  useLayoutEffect(() => {
      if (prevLogsLength.current === 0 && logs.length > 0) {
          endRef.current?.scrollIntoView({ behavior: 'auto' });
      }
  }, []);

  useEffect(() => {
      if (prevProcessing.current === true && isProcessing === false) {
          if (logs.length > 0) {
              const lastLog = logs[logs.length - 1];
              const lastLogElement = logRefs.current.get(lastLog.id);
              if (lastLogElement) {
                  lastLogElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
              } else {
                  endRef.current?.scrollIntoView({ behavior: 'smooth' });
              }
          }
      }
      else if (isStreaming) {
           // use 'auto' instead of 'smooth' to prevent jittering during rapid updates
           endRef.current?.scrollIntoView({ behavior: 'auto', block: 'end' });
      }

      prevProcessing.current = !!isProcessing;
      prevLogsLength.current = logs.length;
      setJumpHint('');
  }, [isProcessing, isStreaming, logs, lastRawResponse]); 

  useEffect(() => {
      if (!jumpExpanded) return;
      if (jumpFocused || jumpTarget) return;
      if (jumpHideTimer.current) {
          window.clearTimeout(jumpHideTimer.current);
      }
      jumpHideTimer.current = window.setTimeout(() => {
          setJumpExpanded(false);
      }, 3500);
      return () => {
          if (jumpHideTimer.current) {
              window.clearTimeout(jumpHideTimer.current);
          }
      };
  }, [jumpExpanded, jumpFocused, jumpTarget, jumpHint]);

  // Fix: Scroll to bottom when exiting combat UI
  useEffect(() => {
      if (!showCombatUI && logs.length > 0) {
          setTimeout(() => {
              endRef.current?.scrollIntoView({ behavior: 'smooth' });
          }, 50);
      }
  }, [showCombatUI]);

  const handleEditAIClick = (log: LogEntry) => {
      if (log.rawResponse) {
          setEditingLogId(log.id);
          setEditContent(log.rawResponse);
          setEditMode('AI_RAW');
      }
  };

  const handleEditUserClick = (logId: string) => {
      const log = logs.find(l => l.id === logId);
      if (log) {
          setEditingLogId(logId);
          setEditContent(log.text);
          setEditMode('USER_TEXT');
      }
  };

  const handleApplyEdit = (content: string, type: 'REWRITE' | 'TEXT_ONLY') => {
      if (editingLogId) {
          if (editMode === 'AI_RAW' && onEditLog) {
              onEditLog(editingLogId, content);
          } else if (editMode === 'USER_TEXT') {
              if (type === 'REWRITE' && handleUserRewrite) {
                  handleUserRewrite(editingLogId, content);
              } else if (type === 'TEXT_ONLY' && onUpdateLogText) {
                  onUpdateLogText(editingLogId, content);
              }
          }
          setEditingLogId(null);
      }
  };

  const setLogRef = (id: string, el: HTMLDivElement | null) => {
      if (el) {
          logRefs.current.set(id, el);
      } else {
          logRefs.current.delete(id);
      }
  };

  const TurnDivider = ({ turn }: { turn?: number }) => {
      if (turn === undefined || turn === 0) return null;
      return (
          <div className="w-full flex items-center justify-center py-6 mb-4">
              <div className={`h-px w-12 md:w-24 bg-gradient-to-r ${turnDividerGradient}`}></div>
              <div className={`mx-4 px-3 py-1 bg-black border ${turnDividerColor} text-[10px] font-display uppercase tracking-[0.2em]`}>
                  Turn {turn}
              </div>
              <div className={`h-px w-12 md:w-24 bg-gradient-to-l ${turnDividerGradient}`}></div>
          </div>
      );
  };
  const TurnThinking = ({ thinking }: { thinking?: string }) => {
      if (!thinking) return null;
      return (
          <div className="flex justify-center -mt-2 mb-6">
              <details className="max-w-[90%] bg-emerald-950/40 border border-emerald-700/60 px-3 py-2 rounded">
                  <summary className="cursor-pointer text-[10px] uppercase tracking-widest text-emerald-300 flex items-center gap-2">
                      <Info size={12} className="text-emerald-400" /> AI ANALYSIS
                  </summary>
                  <div className="mt-2 text-[11px] text-emerald-100 font-mono whitespace-pre-wrap leading-relaxed">
                      {thinking}
                  </div>
              </details>
          </div>
      );
  };

  if (combatState.是否战斗中 && showCombatUI && enableCombatUI) {
      return (
          <div className={`w-full lg:w-[60%] h-full relative flex flex-col bg-zinc-900 md:border-r-4 md:border-black ${className}`}>
              <div className="absolute top-4 right-4 z-50">
                  <button 
                    type="button"
                    onClick={() => setShowCombatUI(false)}
                    className="bg-black/80 text-white border border-white px-3 py-1 text-xs uppercase hover:bg-white hover:text-black flex items-center gap-2"
                  >
                      <MessageSquare size={14} /> <span className="hidden md:inline">RETURN</span> <span className="md:hidden">Back</span>
                  </button>
              </div>

              <CombatPanel 
                  combatState={combatState} 
                  playerStats={playerStats} 
                  skills={skills}
                  magic={magic}
                  inventory={inventory || []}
                  onPlayerAction={(action, payload) => {
                      onPlayerAction(action, payload);
                      setShowCombatUI(false); 
                  }}
              />
          </div>
      );
  }

  return (
    <div className={`w-full h-full relative flex flex-col overflow-hidden ${className}`}>
      
      {/* Background Ambience */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <div className={`absolute inset-0 ${halftoneColor}`} />
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-transparent to-black/80" />
      </div>

      {isProcessing && !isStreaming && (
          <div className="absolute inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center animate-in fade-in">
              <div className={`flex flex-col items-center gap-4 ${processingText}`}>
                  <div className="relative">
                      <Loader2 size={48} className="animate-spin" />
                      <div className="absolute inset-0 flex items-center justify-center">
                          <Eye size={18} className="animate-pulse" />
                      </div>
                  </div>
                  <span className="font-display text-xl uppercase tracking-widest animate-pulse">Processing...</span>
              </div>
          </div>
      )}

      {totalTurns > 0 && (
          <div className="absolute top-4 right-6 z-40 flex flex-col items-end gap-2">
              {/* Toggle Button - Always Visible */}
              <button
                  onClick={() => setJumpExpanded(!jumpExpanded)}
                  className={`
                      h-8 px-3 flex items-center gap-2 rounded-sm
                      bg-black/80 backdrop-blur border border-green-500/50 hover:border-green-400
                      text-green-500 font-mono text-xs uppercase tracking-wider
                      transition-all shadow-[0_0_10px_rgba(34,197,94,0.1)]
                      ${jumpExpanded ? 'bg-green-900/30 border-green-400 shadow-[0_0_15px_rgba(34,197,94,0.3)]' : ''}
                  `}
                  title="Toggle Zone Jump"
              >
                  <Layers size={14} />
                  <span className="font-bold">ZONE JUMP</span>
              </button>

              {/* Dropdown Panel - Absolute Positioned */}
              {jumpExpanded && (
                  <div className="bg-black/95 border border-green-500/50 p-3 shadow-[0_0_30px_rgba(0,0,0,0.8)] flex flex-col gap-3 min-w-[200px] animate-in slide-in-from-top-1 fade-in duration-200 backdrop-blur-md rounded-sm">
                      {/* Header Row */}
                      <div className="flex justify-between items-center text-[10px] text-zinc-500 font-mono border-b border-zinc-800 pb-2">
                          <span className="uppercase tracking-widest text-zinc-400">Current Zone</span>
                          <span className="text-green-400 font-bold">{visibleTurns[0]}-{visibleTurns[visibleTurns.length - 1]} / {orderedTurns[orderedTurns.length - 1]}</span>
                      </div>

                      {/* Input Row */}
                      <div className="flex gap-2 h-8 items-stretch">
                          <input
                              type="number"
                              min={orderedTurns[0] ?? 0}
                              max={orderedTurns[orderedTurns.length - 1] ?? 0}
                              value={jumpTarget}
                              onChange={(e) => setJumpTarget(e.target.value)}
                              onKeyDown={(e) => e.key === 'Enter' && handleJump()}
                              className="flex-1 bg-zinc-900/50 border border-zinc-700 text-green-400 px-2 text-center font-mono text-sm outline-none focus:border-green-500 transition-colors placeholder-zinc-700 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                              placeholder="#"
                              autoFocus
                          />
                          <button
                              onClick={handleJump}
                              className="bg-green-600 hover:bg-green-500 text-black px-4 font-display font-bold text-xs tracking-wider transition-colors flex items-center justify-center shadow-[0_0_10px_rgba(22,163,74,0.4)]"
                          >
                              GO
                          </button>
                      </div>
                      
                      {/* Hint */}
                      <div className="text-[9px] text-zinc-600 text-right italic">
                          Enter zone ID to warp
                      </div>
                  </div>
              )}
          </div>
      )}

      {/* Logs Scroll Area */}
      <div 
        ref={containerRef}
        className={`flex-1 overflow-y-auto p-4 md:p-10 z-10 custom-scrollbar scroll-smooth ${logPaddingClass}`}
      >
        {visibleLogs.map((log) => {
            const globalIndex = logIndexMap.get(log.id) ?? 0;
            const prevLog = logs[globalIndex - 1];
            const isNewTurn = log.turnIndex !== undefined && log.turnIndex > 0 && (!prevLog || log.turnIndex !== prevLog.turnIndex);
            
            const showAiToolbar = !!log.rawResponse;
            const aiActionKey = log.responseId || (log.rawResponse ? `${log.rawResponse}::${log.turnIndex ?? 0}` : '');
            const aiActionAnchor = !!log.rawResponse && !!aiActionKey && !aiActionSeen.has(aiActionKey);
            if (aiActionAnchor) aiActionSeen.add(aiActionKey);

            return (
                <div key={log.id} ref={(el) => setLogRef(log.id, el)}>
                    {isNewTurn && <TurnDivider turn={log.turnIndex} />}
                    {isNewTurn && <TurnThinking thinking={log.turnIndex !== undefined ? turnThinkingMap.get(log.turnIndex) : undefined} />}
                    <LogEntryItem 
                        log={log} 
                        isLatest={globalIndex === logs.length - 1} 
                        playerStats={playerStats} 
                        confidants={confidants}
                        onEditClick={handleEditAIClick}
                        onDelete={onDeleteLog}
                        onEditUserLog={handleEditUserClick}
                        aiActionAnchor={aiActionAnchor}
                        fontSize={fontSize} 
                        showAiToolbar={showAiToolbar}
                        isHellMode={isHellMode}
                    />
                </div>
            );
        })}
        
        {/* Streaming Raw Data Display */}
        {isStreaming && lastRawResponse ? (
            <div className="p-4 my-4 bg-black/90 border-l-4 border-green-500 text-[10px] md:text-xs text-green-400 whitespace-pre-wrap shadow-lg opacity-90 animate-in fade-in slide-in-from-bottom-2 font-mono leading-relaxed break-all">
                <div className="flex items-center gap-2 mb-2 text-green-600 font-bold uppercase tracking-widest border-b border-green-900/50 pb-1">
                    <Terminal size={12} className="animate-pulse" /> Incoming Data Stream...
                </div>
                {lastThinking && (
                    <details className="mb-3 bg-emerald-950/40 border border-emerald-700/60 px-3 py-2 rounded">
                        <summary className="cursor-pointer text-[10px] uppercase tracking-widest text-emerald-300">
                            AI ANALYSIS (Streaming)
                        </summary>
                        <div className="mt-2 text-[10px] text-emerald-100 whitespace-pre-wrap leading-relaxed">
                            {lastThinking}
                        </div>
                    </details>
                )}
                {lastRawResponse}
                <span className="animate-pulse ml-1 text-green-500">_</span>
            </div>
        ) : isStreaming && isProcessing ? (
            <div className={`flex gap-2 items-center p-4 opacity-50 animate-pulse ${textColor}`}>
                <Loader2 size={16} className="animate-spin" />
                <span className="text-xs font-mono">Initializing Stream...</span>
            </div>
        ) : null}

        <div ref={endRef} />
      </div>

      {(showCombatShortcut || showQuickActions) && (
          <div className={`absolute ${actionDockOffset} left-0 w-full z-50 pointer-events-none`}>
              <div className="w-full flex flex-col justify-end gap-3 pointer-events-auto">
                  {showCombatShortcut && (
                      <div className="flex justify-center px-4 md:px-10">
                          <button 
                            type="button"
                            onClick={() => setShowCombatUI(true)}
                            className="bg-red-600 text-white border-2 border-white px-6 py-2 font-display text-base md:text-xl uppercase tracking-widest hover:scale-105 transition-transform flex items-center gap-2 shadow-[0_0_25px_red] animate-pulse"
                          >
                              <Sword size={20} /> ENGAGE
                          </button>
                      </div>
                  )}

                  {showQuickActions && (
                      <>
                          <div className="flex gap-3 overflow-x-auto px-4 pb-3 custom-scrollbar snap-x touch-pan-x items-end">
                              {actionOptions.map((opt, idx) => {
                                  const shouldMarquee = opt.length > 12;
                                  return (
                                  <button
                                      key={idx}
                                      onClick={() => {
                                          if (setDraftInput) setDraftInput(opt);
                                      }}
                                      className={`flex-shrink-0 snap-start bg-zinc-950/95 border text-left p-3 min-w-[140px] max-w-[220px] group transition-all transform active:scale-95 relative overflow-hidden shadow-lg rounded-sm ${actionBorder}`}
                                  >
                                      <div className={`absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity ${actionBgHighlight}`} />
                                      <div className="flex items-center gap-2 mb-1">
                                          <MousePointer2 size={14} className={`${actionIcon} shrink-0`} />
                                          <div className="relative overflow-hidden w-full">
                                              <div className={`flex w-max items-center gap-6 ${shouldMarquee ? 'action-option-marquee' : ''}`}>
                                                  <span className={`font-bold text-xs md:text-sm whitespace-nowrap leading-tight ${marqueeTextClass}`}>
                                                      {opt}
                                                  </span>
                                                  {shouldMarquee && (
                                                      <span className={`font-bold text-xs md:text-sm whitespace-nowrap leading-tight ${marqueeDuplicateClass}`}>
                                                          {opt}
                                                      </span>
                                                  )}
                                              </div>
                                          </div>
                                      </div>
                                      <ChevronRight size={14} className={`absolute bottom-1 right-1 opacity-50 group-hover:opacity-100 transition-all ${actionChevron}`} />
                                  </button>
                              )})}
                              <div className="w-4 flex-shrink-0" />
                          </div>
                      </>
                  )}
              </div>
              <style>{`
                @keyframes actionOptionMarquee {
                  0% { transform: translateX(0); }
                  100% { transform: translateX(-50%); }
                }
                .action-option-marquee {
                  animation: actionOptionMarquee 8s linear infinite;
                }
              `}</style>
          </div>
      )}

      {/* Input Area */}
      <GameInput 
          onSendMessage={onSendMessage} 
          onReroll={onReroll}
          onStopInteraction={onStopInteraction}
          isProcessing={!!isProcessing}
          combatState={combatState}
          commandQueue={commandQueue}
          onRemoveCommand={onRemoveCommand}
          draftInput={draftInput}
          setDraftInput={setDraftInput}
          enableCombatUI={enableCombatUI}
          isHellMode={isHellMode}
      />

      {/* Editing Modal */}
      {editingLogId && (
          <EditLogModal 
            initialContent={editContent} 
            mode={editMode}
            onClose={() => setEditingLogId(null)} 
            onApply={handleApplyEdit} 
          />
      )}
    </div>
  );
};
