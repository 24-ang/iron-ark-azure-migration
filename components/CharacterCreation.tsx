
import React, { useState } from 'react';
import { GameState } from '../types';
import { IdentityRoute } from '../types/character';
import { createNewGameState } from '../utils/dataMapper';
import { Terminal, Zap, Cpu, Calendar, AlertTriangle, Package, ArrowRight, ArrowLeft } from 'lucide-react';
import { Difficulty } from '../types/enums';
import '../src/styles/cassette-futurism.css';

interface CharacterCreationProps {
  onComplete: (initialState: GameState) => void;
  onBack: () => void;
}

export const CharacterCreation: React.FC<CharacterCreationProps> = ({ onComplete, onBack }) => {
  const [name, setName] = useState('');
  const [identity, setIdentity] = useState<IdentityRoute>(IdentityRoute.WastelandHyena);
  const [gender, setGender] = useState<'Male' | 'Female'>('Male'); // Was ChassisType
  const [manufactureDate, setManufactureDate] = useState('2155-01-01');
  const [serialNumber, setSerialNumber] = useState(''); // Appearance/Serial
  const [difficulty, setDifficulty] = useState<Difficulty>(Difficulty.NORMAL);
  const [initialPackage, setInitialPackage] = useState<'standard' | 'combat' | 'survival' | 'wealth'>('standard');

  // Identity Routes
  const identityOptions = [
    { id: IdentityRoute.OldWorldGhost, label: 'GHOST', desc: 'Elite / Deep Ruins / Tech+' },
    { id: IdentityRoute.WastelandHyena, label: 'HYENA', desc: 'Commoner / Slums / Surv+' },
    { id: IdentityRoute.HeavyMetalManiac, label: 'MANIAC', desc: 'Hunter / Garage / STR+' },
    { id: IdentityRoute.GlitchRunner, label: 'RUNNER', desc: 'Special / Data Dump / LOG+' },
    { id: IdentityRoute.TechCleric, label: 'CLERIC', desc: 'Knight / Outpost / DEX+' }
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    
    const newState = createNewGameState(
      name,
      gender,
      identity, // identityKey
      0,
      manufactureDate,
      serialNumber,
      '',
      difficulty,
      initialPackage
    );
    onComplete(newState);
  };

  const getDifficultyColor = (d: Difficulty) => {
    switch(d) {
      case Difficulty.EASY: return 'border-green-500 text-green-500';
      case Difficulty.NORMAL: return 'border-cta text-cta';
      case Difficulty.HARD: return 'border-warning text-warning';
      case Difficulty.HELL: return 'border-danger text-danger animate-pulse';
      default: return 'border-steel-gray text-gray';
    }
  };

  return (
      <div className="w-full h-screen bg-boot flex items-center justify-center relative overflow-hidden">
        
        {/* HUD Frame */}
        <div className="hud-frame">
          <div className="hud-corner top-left"></div>
          <div className="hud-corner top-right"></div>
          <div className="hud-corner bottom-left"></div>
          <div className="hud-corner bottom-right"></div>
        </div>

        <div className="w-full h-full max-w-4xl relative z-10 flex flex-col p-4 md:p-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
          
          {/* Header - Fixed at top */}
          <div className="flex-none flex items-center gap-4 mb-4 md:mb-6 border-b border-steel-gray pb-4">
            <button 
              onClick={onBack}
              className="p-2 border border-steel-gray hover:bg-steel-gray/20 text-gray transition-colors"
              title="ABORT SEQUENCE"
            >
              <ArrowLeft size={20} />
            </button>
            <div>
              <h1 className="terminal-text text-2xl md:text-3xl text-green phosphor-glow tracking-wider">
                UNIT INITIALIZATION
              </h1>
              <div className="text-amber text-xs md:text-sm mt-1 terminal-text">
                PROTOCOL: WASTELAND IDENTITY v4.0
              </div>
            </div>
          </div>

          {/* Form Container - Scrollable Area */}
          <div className="flex-1 overflow-y-auto min-h-0 panel p-4 md:p-6 custom-scrollbar">
            <form onSubmit={handleSubmit} className="space-y-6">
              
              {/* Unit Designation (Name) */}
              <div className="space-y-2">
                <label className="text-gray terminal-text text-xs uppercase tracking-widest flex items-center gap-2">
                  <Cpu size={14} /> UNIT DESIGNATION
                </label>
                <div className="relative flex items-center bg-void border border-steel-gray p-3 focus-within:border-cta transition-colors">
                  <span className="text-cta phosphor-glow mr-2">&gt;</span>
                  <input 
                    type="text" 
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="ENTER UNIT NAME..."
                    className="bg-transparent border-none text-green w-full focus:ring-0 font-terminal text-lg placeholder-gray/30 uppercase outline-none"
                    autoFocus
                  />
                </div>
              </div>

              {/* Identity Selection */}
              <div className="space-y-2">
                <label className="text-gray terminal-text text-xs uppercase tracking-widest flex items-center gap-2">
                  <Zap size={14} /> IDENTITY ROUTE
                </label>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {identityOptions.map(opt => (
                    <button
                      key={opt.id}
                      type="button"
                      onClick={() => setIdentity(opt.id)}
                      className={`p-3 border text-left transition-all relative group ${
                        identity === opt.id 
                          ? 'border-cta bg-cta/10 text-cta shadow-[0_0_10px_rgba(34,197,94,0.3)]' 
                          : 'border-steel-gray text-gray hover:border-cta/50 hover:text-green'
                      }`}
                    >
                      <div className="font-heading text-[10px] mb-1">{opt.label}</div>
                      <div className="font-terminal text-[9px] opacity-70">{opt.desc}</div>
                      {identity === opt.id && (
                        <div className="absolute top-1 right-1 w-2 h-2 bg-cta animate-pulse"></div>
                      )}
                    </button>
                  ))}
                </div>
              </div>

              {/* Gender & Date Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-gray terminal-text text-xs uppercase tracking-widest flex items-center gap-2">
                    <Zap size={14} /> GENDER MODEL
                  </label>
                  <div className="flex gap-2">
                    {(['Male', 'Female'] as const).map(type => (
                      <button
                        key={type}
                        type="button"
                        onClick={() => setGender(type)}
                        className={`flex-1 py-3 border font-heading text-[10px] uppercase transition-all ${
                          gender === type
                            ? 'border-cta bg-cta/10 text-cta'
                            : 'border-steel-gray text-gray hover:border-gray'
                        }`}
                      >
                        {type}
                      </button>
                    ))}
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-gray terminal-text text-xs uppercase tracking-widest flex items-center gap-2">
                    <Calendar size={14} /> MANUFACTURE DATE
                  </label>
                  <input 
                    type="date" 
                    value={manufactureDate}
                    onChange={(e) => setManufactureDate(e.target.value)}
                    className="w-full bg-void border border-steel-gray p-3 text-green font-terminal focus:border-cta outline-none"
                  />
                </div>
              </div>

              {/* Serial & Difficulty Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-gray terminal-text text-xs uppercase tracking-widest flex items-center gap-2">
                    <Cpu size={14} /> APPEARANCE / SERIAL
                  </label>
                  <input 
                    type="text" 
                    value={serialNumber}
                    onChange={(e) => setSerialNumber(e.target.value)}
                    placeholder="e.g., Scarred, Chrome Plated..."
                    className="w-full bg-void border border-steel-gray p-3 text-green font-terminal focus:border-cta outline-none placeholder-gray/30"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-gray terminal-text text-xs uppercase tracking-widest flex items-center gap-2">
                    <AlertTriangle size={14} /> DIFFICULTY
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    {Object.values(Difficulty).map(d => (
                      <button
                        key={d}
                        type="button"
                        onClick={() => setDifficulty(d)}
                        className={`p-2 border font-medium text-[9px] transition-all uppercase ${
                          difficulty === d ? getDifficultyColor(d) + ' bg-opacity-10 bg-current' : 'border-steel-gray text-gray hover:border-gray'
                        }`}
                      >
                        {d}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Initial Package */}
              <div className="space-y-2">
                <label className="text-gray terminal-text text-xs uppercase tracking-widest flex items-center gap-2">
                  <Package size={14} /> INITIAL LOADOUT
                </label>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {[
                    { id: 'standard', label: 'STANDARD' },
                    { id: 'combat', label: 'COMBAT' },
                    { id: 'survival', label: 'SURVIVAL' },
                    { id: 'wealth', label: 'WEALTH' }
                  ].map(pkg => (
                    <button
                      key={pkg.id}
                      type="button"
                      onClick={() => setInitialPackage(pkg.id as any)}
                      className={`p-2 border text-center transition-all ${
                        initialPackage === pkg.id 
                          ? 'border-cta text-cta bg-cta/10' 
                          : 'border-steel-gray text-gray hover:border-gray'
                      }`}
                    >
                      <div className="font-heading text-[9px]">{pkg.label}</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Actions */}
              <div className="pt-6 flex gap-4 sticky bottom-0 bg-void/95 backdrop-blur py-4 border-t border-steel-gray/50 mt-4">
                <button 
                  type="submit"
                  disabled={!name.trim()}
                  className="btn-primary flex-1 py-4 terminal-text uppercase flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed bg-cta/10 hover:bg-cta/20 border border-cta text-cta phosphor-glow"
                >
                  <Zap size={20} />
                  <span>INITIALIZE UNIT</span>
                  <ArrowRight size={20} />
                </button>
              </div>

            </form>
          </div>

          {/* Footer */}
          <div className="flex-none mt-4 text-center terminal-text text-[10px] text-gray opacity-50">
            <div>&gt; WASTELAND IDENTITY PROTOCOL ACTIVATED</div>
            <div className="mt-1">&gt; SYNCING NEURAL INTERFACE...</div>
          </div>
        </div>
      </div>
  );
};
