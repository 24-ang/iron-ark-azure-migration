import React, { useState, useEffect } from 'react';
import { X, Settings as SettingsIcon, Volume2, VolumeX, Monitor, Save, LogOut, User, Cpu } from 'lucide-react';
import { AppSettings, GameState } from '../../../types';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  settings: AppSettings;
  avatarUrl: string;
  onSaveSettings: (newSettings: AppSettings) => void;
  onSaveGame: (slotId?: number | string) => void;
  onLoadGame: (slotId: number | string) => void;
  onUpdateAvatar: (url: string) => void;
  onExitGame: () => void;
  gameState: GameState;
  onUpdateGameState: (newState: GameState) => void;
  initialView?: string;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  onClose,
  settings,
  onSaveSettings,
  onExitGame,
}) => {
  const [formData, setFormData] = useState<AppSettings>(settings);
  const [volume, setVolume] = useState(70);
  const [sfxEnabled, setSfxEnabled] = useState(true);
  const [scanlineIntensity, setScanlineIntensity] = useState(25);

  useEffect(() => {
    if (isOpen) {
      setFormData(settings);
      const savedVolume = localStorage.getItem('wasteland_volume');
      const savedSfx = localStorage.getItem('wasteland_sfx');
      const savedScanlines = localStorage.getItem('wasteland_scanlines');
      
      if (savedVolume) setVolume(parseInt(savedVolume));
      if (savedSfx) setSfxEnabled(savedSfx !== 'false');
      if (savedScanlines) setScanlineIntensity(parseInt(savedScanlines));
    }
  }, [isOpen, settings]);

  const handleSave = () => {
    localStorage.setItem('wasteland_volume', volume.toString());
    localStorage.setItem('wasteland_sfx', sfxEnabled.toString());
    localStorage.setItem('wasteland_scanlines', scanlineIntensity.toString());
    
    // Apply scanline intensity
    document.documentElement.style.setProperty(
      '--scanline-opacity',
      (scanlineIntensity / 100).toString()
    );
    
    onSaveSettings(formData);
    onClose();
  };

  const handleExitToMenu = () => {
    if (confirm('返回主菜单将结束当前游戏，未保存的进度将丢失。确定继续？')) {
      onExitGame();
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-90 backdrop-blur-sm">
      {/* Modal Container */}
      <div className="w-full max-w-3xl mx-4 bg-background border-2 border-cta panel max-h-[90vh] flex flex-col">
        
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-steel-gray">
          <div className="flex items-center gap-3">
            <SettingsIcon size={32} className="text-cta phosphor-glow" />
            <h2 className="terminal-text text-2xl text-cta phosphor-glow">SYSTEM CONFIGURATION</h2>
          </div>
          <button onClick={onClose} className="text-gray hover:text-cta transition-colors">
            <X size={24} />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          
          {/* Audio Settings */}
          <div className="panel p-6 space-y-4">
            <h3 className="terminal-text text-cta mb-4 flex items-center gap-2">
              <Volume2 size={20} />
              AUDIO CONFIGURATION
            </h3>
            
            {/* Volume */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="terminal-text text-gray">MASTER VOLUME</span>
                <span className="terminal-text text-amber">{volume}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                value={volume}
                onChange={(e) => setVolume(parseInt(e.target.value))}
                className="w-full accent-cta"
              />
            </div>

            {/* SFX Toggle */}
            <div className="flex items-center justify-between">
              <span className="terminal-text text-gray">SOUND EFFECTS</span>
              <button
                onClick={() => setSfxEnabled(!sfxEnabled)}
                className={`btn px-6 ${sfxEnabled ? 'border-cta text-cta' : 'border-gray text-gray'}`}
              >
                {sfxEnabled ? 'ENABLED' : 'DISABLED'}
              </button>
            </div>
          </div>

          {/* Visual Settings */}
          <div className="panel p-6 space-y-4">
            <h3 className="terminal-text text-cta mb-4 flex items-center gap-2">
              <Monitor size={20} />
              VISUAL CONFIGURATION
            </h3>
            
            {/* Scanline Intensity */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="terminal-text text-gray">CRT SCANLINE INTENSITY</span>
                <span className="terminal-text text-amber">{scanlineIntensity}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                value={scanlineIntensity}
                onChange={(e) => setScanlineIntensity(parseInt(e.target.value))}
                className="w-full accent-cta"
              />
              <div className="terminal-text text-xs text-gray mt-2">
                Adjust the intensity of CRT screen effect
              </div>
            </div>
          </div>

          {/* System Info */}
          <div className="panel p-6">
            <h3 className="terminal-text text-cta mb-4 flex items-center gap-2">
              <Cpu size={20} />
              SYSTEM INFORMATION
            </h3>
            <div className="space-y-2 terminal-text text-sm text-gray">
              <div className="flex justify-between">
                <span>VERSION:</span>
                <span className="text-amber">WASTELAND 2155 v3.7.2</span>
              </div>
              <div className="flex justify-between">
                <span>BUILD:</span>
                <span className="text-amber">20550207-CLASSIFIED</span>
              </div>
              <div className="flex justify-between">
                <span>NEURAL CORE:</span>
                <span className="text-cta">GEMINI AI</span>
              </div>
            </div>
          </div>

          {/* Danger Zone */}
          <div className="panel p-6 border-danger">
            <h3 className="terminal-text text-danger mb-4 flex items-center gap-2">
              <LogOut size={20} />
              DANGER ZONE
            </h3>
            <button
              onClick={handleExitToMenu}
              className="btn-secondary w-full py-3 border-danger text-danger hover:bg-danger hover:text-background"
            >
              EXIT TO MAIN MENU
            </button>
            <div className="terminal-text text-xs text-gray mt-2 text-center">
              Warning: Unsaved progress will be lost
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-steel-gray flex gap-4">
          <button onClick={onClose} className="btn flex-1">
            CANCEL
          </button>
          <button onClick={handleSave} className="btn-primary flex-1 flex items-center justify-center gap-2">
            <Save size={18} />
            SAVE CONFIGURATION
          </button>
        </div>
      </div>
    </div>
  );
};
