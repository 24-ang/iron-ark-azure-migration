import React from 'react';
import { X, Shield, Coins, Building, Package, Radio, Target } from 'lucide-react';
import { FactionState } from '../../../types';
import '../../../src/styles/cassette-futurism.css';

interface FactionModalProps {
  isOpen: boolean;
  onClose: () => void;
  faction: FactionState;
}

export const FactionModal: React.FC<FactionModalProps> = ({ isOpen, onClose, faction }) => {
  if (!isOpen) return null;

  // Safety fallback
  const safeFaction = faction || {
      名称: "None",
      领袖: "None",
      等级: "I",
      资金: 0,
      仓库: [],
      设施状态: {}
  };

  return (
    <div className="cassette-futurism-theme absolute inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-md p-4 animate-in fade-in duration-200">
      <div className="modal w-full max-w-4xl relative flex flex-col max-h-[85vh]">
        
        <div className="bg-steel-gray/20 p-4 flex justify-between items-center text-cta shrink-0 border-b border-cta">
             <div className="flex items-center gap-3">
                <Shield size={32} />
                <h2 className="text-3xl font-heading uppercase tracking-widest phosphor-glow">FACTION</h2>
             </div>
             <button onClick={onClose} className="hover:text-white transition-colors" title="Close" aria-label="Close">
                <X size={24} />
             </button>
        </div>

        <div className="p-8 space-y-8 flex-1 overflow-y-auto custom-scrollbar bg-void/90">
            
            {/* Header Info */}
            <div className="text-center">
                <div className="inline-block border-2 border-cta p-6 bg-black/50 mb-4">
                    <h1 className="text-5xl font-heading uppercase text-cta phosphor-glow">{safeFaction.名称}</h1>
                </div>
                <div className="terminal-text text-gray">LEADER: <span className="text-white font-bold uppercase">{safeFaction.领袖}</span></div>
            </div>

            {/* Main Stats */}
            <div className="grid grid-cols-2 gap-4">
                <div className="bg-black/40 border border-steel-gray p-4 flex items-center gap-4">
                    <div className="bg-cta/20 p-3 text-cta border border-cta"><Coins /></div>
                    <div>
                        <div className="text-xs text-gray uppercase terminal-text">FACTION FUNDS</div>
                        <div className="text-2xl font-mono text-green-500">{safeFaction.资金?.toLocaleString() || 0} CREDITS</div>
                    </div>
                </div>
                <div className="bg-black/40 border border-steel-gray p-4 flex items-center gap-4">
                    <div className="bg-cta/20 p-3 text-cta border border-cta"><Building /></div>
                    <div>
                        <div className="text-xs text-gray uppercase terminal-text">BASE RANK</div>
                        <div className="text-2xl font-mono text-green-500">Tier {safeFaction.等级}</div>
                    </div>
                </div>
            </div>

            {/* Warehouse Section */}
            <div className="border-t border-steel-gray pt-4">
                <div className="flex items-center gap-2 mb-4">
                    <Package className="text-cta" />
                    <h3 className="text-cta uppercase font-bold text-xl terminal-text">SUPPLY DEPOT</h3>
                </div>
                
                <div className="bg-black/50 border border-steel-gray p-4 min-h-[150px]">
                    {safeFaction.仓库 && safeFaction.仓库.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                            {safeFaction.仓库.map((item, idx) => (
                                <div key={idx} className="flex justify-between items-center bg-cta/10 p-2 border border-cta/30 hover:bg-cta/20 code-font">
                                    <span className="text-white text-sm">{item.名称}</span>
                                    <span className="text-cta text-xs font-mono">x{item.数量}</span>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="flex flex-col items-center justify-center py-10 text-gray opacity-50">
                            <Target size={40} className="mb-2" />
                            <p className="italic terminal-text">DEPOT EMPTY // NO SUPPLIES LOGGED</p>
                        </div>
                    )}
                </div>
            </div>

            {/* Facilities Section */}
            <div className="border-t border-steel-gray pt-4">
                <h3 className="text-cta uppercase font-bold mb-2 terminal-text flex items-center gap-2">
                    <Radio size={18} />
                    FACILITY STATUS
                </h3>
                {safeFaction.设施状态 && Object.keys(safeFaction.设施状态).length > 0 ? (
                    <div className="text-sm text-gray font-mono">
                        {JSON.stringify(safeFaction.设施状态)}
                    </div>
                ) : (
                    <div className="text-sm text-gray italic terminal-text">NO ACTIVE FACILITIES DETECTED.</div>
                )}
            </div>

        </div>
      </div>
    </div>
  );
};
