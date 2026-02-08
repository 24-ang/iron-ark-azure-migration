import React, { useState, useEffect } from 'react';
import { Command, X, RotateCcw, Loader2, Square } from 'lucide-react';
import { CombatState } from '../../../types';

interface GameInputProps {
  onSendMessage: (msg: string) => void;
  onReroll?: () => void;
  onStopInteraction?: () => void;
  isProcessing: boolean;
  combatState: CombatState;
  commandQueue: { id: string, text: string, undoAction?: () => void }[];
  onRemoveCommand?: (id: string) => void;
  draftInput?: string;
  setDraftInput?: (val: string) => void;
  enableCombatUI?: boolean;
  isHellMode?: boolean;
}

export const GameInput: React.FC<GameInputProps> = ({ 
    onSendMessage, 
    onReroll, 
    onStopInteraction,
    isProcessing, 
    combatState, 
    commandQueue, 
    onRemoveCommand,
    draftInput,
    setDraftInput,
    enableCombatUI,
    isHellMode
}) => {
    const [input, setInput] = useState('');
    const actionBtnSize = 'h-[52px] sm:h-[60px] w-[60px] sm:w-[70px]'; // Reduced from 90px

    useEffect(() => {
        if (draftInput !== undefined) {
            setInput(draftInput);
        }
    }, [draftInput]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setInput(e.target.value);
        if (setDraftInput) setDraftInput(e.target.value);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (isProcessing) return;
        const hasCommands = commandQueue.length > 0;
        if (!input.trim() && !hasCommands) return;
        const safeInput = input.trim() ? input : 'Execute User Command';
        onSendMessage(safeInput);
        setInput('');
        if (setDraftInput) setDraftInput('');
    };

    const handleStop = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        if (onStopInteraction) onStopInteraction();
    };

    // Theme logic - Strict Green/Amber
    const borderColor = isProcessing ? 'border-amber-500/80 shadow-[0_0_15px_rgba(245,158,11,0.4)]' : (isHellMode ? 'border-zinc-800 group-hover:border-red-600 group-hover:shadow-[0_0_20px_rgba(220,38,38,0.3)]' : 'border-zinc-800 group-hover:border-green-500 group-hover:shadow-[0_0_20px_rgba(34,197,94,0.3)]');
    const caretColor = isHellMode ? 'text-red-500' : 'text-green-500';

    return (
        <div className="p-6 z-20 bg-gradient-to-t from-black via-zinc-950 to-transparent pt-4">
            
            {commandQueue.length > 0 && (
                <div className="mb-3 animate-in slide-in-from-bottom-2">
                    <div className="flex items-center gap-2 text-[10px] text-zinc-500 uppercase tracking-widest mb-2 font-bold">
                        <Command size={10} />
                        USER COMMS
                    </div>
                    <div className="flex flex-wrap gap-2">
                        {commandQueue.map(cmd => (
                            <div key={cmd.id} className="bg-black border border-amber-900/50 text-amber-500/80 text-xs px-2 py-1 flex items-center gap-2 rounded-sm font-mono">
                                <span>{cmd.text}</span>
                                <button 
                                    type="button"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        onRemoveCommand?.(cmd.id);
                                    }}
                                    className="hover:text-amber-300"
                                    title="Remove Command"
                                    aria-label="Remove Command"
                                >
                                    <X size={12} />
                                </button>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            <form onSubmit={handleSubmit} className="relative group max-w-4xl mx-auto">
                {/* Unified border frame wrapping all elements */}
                <div className={`bg-black border-2 transition-all duration-300 shadow-lg ${borderColor}`}>
                    <div className="flex items-stretch">
                        {/* Left button - LOGO / REROLL */}
                        <div className={`relative ${actionBtnSize} border-r border-zinc-800 flex items-center justify-center bg-zinc-950 group/reroll`}>
                            {onReroll ? (
                                <button
                                    type="button"
                                    onClick={!isProcessing ? onReroll : undefined}
                                    disabled={isProcessing}
                                    title="REROLL SYSTEM"
                                    aria-label="REROLL SYSTEM"
                                    className={`w-full h-full flex items-center justify-center transition-all
                                        ${isProcessing 
                                            ? 'opacity-50 cursor-not-allowed text-zinc-600' 
                                            : 'text-green-600/50 hover:text-green-500 hover:bg-green-950/20'
                                        }
                                    `}
                                >
                                    <span className="font-display text-4xl font-bold pt-1">
                                        {`<`}
                                    </span>
                                </button>
                            ) : (
                                <div className="text-zinc-600 flex items-center justify-center w-full h-full select-none cursor-default">
                                    <span className="font-display text-4xl font-bold opacity-30 pt-1">
                                        {`<`}
                                    </span>
                                </div>
                            )}
                        </div>

                        {/* Center input field */}
                        <div className="flex-1 relative flex flex-col justify-center">
                            <div className="flex justify-end px-2 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                                {isProcessing && (
                                    <span className="text-[9px] text-amber-500 animate-pulse font-mono tracking-widest uppercase">
                                        /// PROCESSING ///
                                    </span>
                                )}
                            </div>

                            <div className="relative bg-zinc-950 flex items-center px-4 py-2">
                                <input
                                    type="text"
                                    value={input}
                                    onChange={handleInputChange}
                                    placeholder={isProcessing ? "PROCESSING..." : combatState.是否战斗中 ? (enableCombatUI ? "COMBAT ACTIVE | FREE ACTION..." : "COMBAT MODE | AWAITING COMMAND...") : "WHAT WILL YOU DO?"}
                                    disabled={isProcessing}
                                    className="flex-1 bg-transparent text-zinc-100 font-mono text-base px-2 py-1 outline-none placeholder-zinc-700 disabled:cursor-not-allowed tracking-wide"
                                    onKeyDown={(e) => {
                                        if (e.key === 'Enter' && !e.shiftKey && !e.nativeEvent.isComposing) {
                                            e.preventDefault();
                                            handleSubmit(e as any);
                                        }
                                    }}
                                    autoFocus
                                />
                            </div>
                        </div>

                        {/* Right button - ACT */}
                        <button 
                            type={isProcessing ? "button" : "submit"}
                            onClick={isProcessing ? handleStop : undefined}
                            className={`text-black ${actionBtnSize} border-l border-zinc-800 transition-all flex items-center justify-center
                                ${isProcessing 
                                    ? 'bg-red-800 text-white hover:bg-red-700' 
                                    : `bg-zinc-100 hover:bg-green-500 hover:text-black`
                                }
                            `}
                        >
                            <div className="font-display uppercase tracking-widest text-4xl font-bold pt-1">
                                {isProcessing ? (
                                    <Square size={20} fill="currentColor" />
                                ) : '>'}
                            </div>
                        </button>
                    </div>
                </div>
            </form>
        </div>
    );
};
