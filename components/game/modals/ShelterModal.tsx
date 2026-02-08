
import React from 'react';
import { X, Radio, Package, Home, Users, Wrench } from 'lucide-react';
import { FactionState } from '../../../types';
import '../../../src/styles/cassette-futurism.css';

interface ShelterModalProps {
  isOpen: boolean;
  onClose: () => void;
  shelter: FactionState;
}

export const ShelterModal: React.FC<ShelterModalProps> = ({ isOpen, onClose, shelter }) => {
  if (!isOpen) return null;

  // Safety fallback with wasteland theme
  const safeShelter = shelter || {
      名称: "UNNAMED BASE",
      领袖: "Gemini-10.0",
      等级: "I",
      资金: 0,
      仓库: [],
      设施状态: {},
      资源: {
        食物: 0,
        水: 0,
        金属: 0,
        能源: 0,
        医疗: 0
      },
      当前人口: 0,
      最大容量: 10
  };

  const resources = safeShelter.资源 || {
    食物: 0,
    水: 0,
    金属: 0,
    能源: 0,
    医疗: 0
  };

  return (
    <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-md p-4 animate-in fade-in duration-200">
      <div className="modal w-full max-w-4xl relative flex flex-col max-h-[85vh]">
        
        {/* Header */}
        <div className="bg-steel-gray/20 p-4 flex justify-between items-center text-cta shrink-0 border-b border-cta">
             <div className="flex items-center gap-3">
                <Home size={32} />
                <h2 className="text-3xl font-heading uppercase tracking-widest phosphor-glow">HOME BASE</h2>
             </div>
             <button onClick={onClose} className="hover:text-white transition-colors" title="Close" aria-label="Close">
                <X size={24} />
             </button>
        </div>

        <div className="p-8 space-y-8 flex-1 overflow-y-auto custom-scrollbar bg-void/90">
            
            {/* Shelter Name */}
            <div className="text-center">
                <div className="inline-block border-2 border-cta p-6 bg-black/50 mb-4">
                    <h1 className="text-5xl font-heading uppercase text-cta phosphor-glow">{safeShelter.名称}</h1>
                </div>
                <div className="terminal-text text-gray">AI ADMIN: <span className="text-white font-bold uppercase">{safeShelter.领袖 || 'SYSTEM'}</span></div>
            </div>

            {/* Main Stats Grid */}
            <div className="grid grid-cols-2 gap-4">
                <div className="bg-black/40 border border-steel-gray p-4 flex items-center gap-4 hover:border-cta/60 transition-colors">
                    <div className="bg-cta/20 p-3 text-cta border border-cta"><Users /></div>
                    <div>
                        <div className="text-xs text-gray uppercase terminal-text">POPULATION</div>
                        <div className="text-2xl font-mono text-green-500">{safeShelter.当前人口 || 0} / {safeShelter.最大容量 || 10}</div>
                    </div>
                </div>
                <div className="bg-black/40 border border-steel-gray p-4 flex items-center gap-4 hover:border-cta/60 transition-colors">
                    <div className="bg-cta/20 p-3 text-cta border border-cta"><Home /></div>
                    <div>
                        <div className="text-xs text-gray uppercase terminal-text">TIER</div>
                        <div className="text-2xl font-mono text-green-500">Tier {safeShelter.等级}</div>
                    </div>
                </div>
            </div>

            {/* Resources Section */}
            <div className="border-t border-steel-gray pt-4">
                <div className="flex items-center gap-2 mb-4">
                    <Package className="text-cta" />
                    <h3 className="text-cta uppercase font-bold text-xl terminal-text">RESOURCES</h3>
                </div>
                
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    <ResourceCard icon="🍞" label="FOOD" value={resources.食物} color="orange" />
                    <ResourceCard icon="💧" label="WATER" value={resources.水} color="blue" />
                    <ResourceCard icon="⚙️" label="METAL" value={resources.金属} color="gray" />
                    <ResourceCard icon="⚡" label="ENERGY" value={resources.能源} color="yellow" />
                    <ResourceCard icon="💊" label="MEDS" value={resources.医疗} color="green" />
                    <ResourceCard icon="💰" label="CREDITS" value={safeShelter.资金 || 0} color="cyan" />
                </div>
            </div>

            {/* Warehouse Section */}
            <div className="border-t border-steel-gray pt-4">
                <div className="flex items-center gap-2 mb-4">
                    <Wrench className="text-cta" />
                    <h3 className="text-cta uppercase font-bold text-xl terminal-text">STORAGE</h3>
                </div>
                
                <div className="bg-black/50 border border-steel-gray p-4 min-h-[150px]">
                    {safeShelter.仓库 && safeShelter.仓库.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                            {safeShelter.仓库.map((item, idx) => (
                                <div key={idx} className="flex justify-between items-center bg-cta/10 p-2 border border-cta/30 hover:bg-cta/20 code-font">
                                    <span className="text-white text-sm">{item.名称}</span>
                                    <span className="text-cta text-xs font-mono">x{item.数量}</span>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p className="text-gray italic text-center py-10 terminal-text">STORAGE EMPTY</p>
                    )}
                </div>
            </div>

            {/* Facilities Section */}
            <div className="border-t border-steel-gray pt-4">
                <h3 className="text-cta uppercase font-bold mb-2 terminal-text">FACILITY STATUS</h3>
                {safeShelter.设施状态 && Object.keys(safeShelter.设施状态).length > 0 ? (
                    <div className="text-sm text-gray font-mono bg-black/30 p-3 border border-steel-gray">
                        {JSON.stringify(safeShelter.设施状态, null, 2)}
                    </div>
                ) : (
                    <div className="text-sm text-gray italic terminal-text">NO FACILITIES.</div>
                )}
            </div>

        </div>
      </div>
    </div>
  );
};

// Helper component for resource cards
const ResourceCard: React.FC<{icon: string, label: string, value: number, color: string}> = ({icon, label, value, color}) => {
  const colorMap: Record<string, string> = {
    orange: 'border-orange-500/30 hover:border-orange-500/60',
    blue: 'border-blue-500/30 hover:border-blue-500/60',
    gray: 'border-steel-gray hover:border-white', // Adjusted for cassette theme
    yellow: 'border-yellow-500/30 hover:border-yellow-500/60',
    green: 'border-green-500/30 hover:border-green-500/60',
    cyan: 'border-cta/30 hover:border-cta/60'
  };

  return (
    <div className={`bg-black/40 border ${colorMap[color] || colorMap.cyan} p-3 transition-colors`}>
      <div className="text-2xl mb-1">{icon}</div>
      <div className="text-xs text-gray uppercase terminal-text">{label}</div>
      <div className="text-lg font-mono text-white">{value.toLocaleString()}</div>
    </div>
  );
};
