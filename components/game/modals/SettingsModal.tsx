import React, { useState, useEffect } from 'react';
import { X, Settings as SettingsIcon, Cpu, LayoutList, FileText, Brain, Volume2, Monitor, Save, LogOut, Palette } from 'lucide-react';
import { AppSettings, GameState } from '../../../types';
import { SettingsAIServices } from './settings/SettingsAIServices';
import { SettingsContext } from './settings/SettingsContext';

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

type TabView = 'AI' | 'CONTEXT' | 'PROMPTS' | 'MEMORY' | 'VISUAL' | 'WRITING';

export const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  onClose,
  settings,
  onSaveSettings,
  onExitGame,
  gameState,
  onUpdateGameState,
  initialView,
}) => {
  const [activeTab, setActiveTab] = useState<TabView>((initialView as TabView) || 'AI');
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
    if (confirm('Returning to the main menu will end the current session. Unsaved progress will be lost. Continue?')) {
      onExitGame();
      onClose();
    }
  };

  const handleUpdateSettings = (newSettings: AppSettings) => {
    setFormData(newSettings);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-90 backdrop-blur-sm">
      {/* Modal Container */}
      <div className="w-full max-w-6xl h-[90vh] mx-4 bg-background border-2 border-cta panel flex flex-col">
        
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-steel-gray shrink-0">
          <div className="flex items-center gap-3">
            <SettingsIcon size={32} className="text-cta phosphor-glow" />
            <h2 className="terminal-text text-2xl text-cta phosphor-glow">SYSTEM CONFIGURATION</h2>
          </div>
          <button onClick={onClose} className="text-gray hover:text-cta transition-colors">
            <X size={24} />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-steel-gray overflow-x-auto shrink-0">
          {[
            { id: 'AI' as TabView, icon: Cpu, label: 'AI SERVICES' },
            { id: 'CONTEXT' as TabView, icon: LayoutList, label: 'CONTEXT' },
            { id: 'PROMPTS' as TabView, icon: FileText, label: 'PROMPTS' },
            { id: 'MEMORY' as TabView, icon: Brain, label: 'MEMORY' },
            { id: 'VISUAL' as TabView, icon: Monitor, label: 'VISUAL' },
            { id: 'WRITING' as TabView, icon: Palette, label: 'WRITING' },
          ].map(tab => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-6 py-3 terminal-text text-sm border-b-2 transition-colors whitespace-nowrap ${
                  activeTab === tab.id
                    ? 'border-cta text-cta phosphor-glow'
                    : 'border-transparent text-gray hover:text-cta'
                }`}
              >
                <Icon size={16} />
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-hidden">
          {activeTab === 'AI' && (
            <div className="h-full p-6 overflow-y-auto custom-scrollbar wasteland-settings-ai">
              <SettingsAIServices
                settings={formData.aiConfig}
                onUpdate={(newAIConfig) => handleUpdateSettings({ ...formData, aiConfig: newAIConfig })}
                onSave={(newAIConfig) => {
                  handleUpdateSettings({ ...formData, aiConfig: newAIConfig });
                  onSaveSettings({ ...formData, aiConfig: newAIConfig });
                }}
              />
            </div>
          )}

          {activeTab === 'CONTEXT' && (
            <div className="h-full wasteland-settings-context">
              <SettingsContext
                settings={formData}
                onUpdate={handleUpdateSettings}
                gameState={gameState}
                onUpdateGameState={onUpdateGameState}
              />
            </div>
          )}

          {activeTab === 'PROMPTS' && (
            <div className="h-full p-6 overflow-y-auto custom-scrollbar">
              <div className="panel p-6">
                <h3 className="terminal-text text-cta mb-4 flex items-center gap-2">
                  <FileText size={20} />
                  PROMPT MODULES
                </h3>
                <div className="terminal-text text-sm text-gray">
                  Prompt module management coming soon...
                </div>
              </div>
            </div>
          )}

          {activeTab === 'MEMORY' && (
            <div className="h-full p-6 overflow-y-auto custom-scrollbar space-y-4">
              <div className="panel p-6">
                <h3 className="terminal-text text-cta mb-4 flex items-center gap-2">
                  <Brain size={20} />
                  MEMORY CONFIGURATION
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="terminal-text text-sm text-gray mb-2 block">INSTANT LIMIT</label>
                    <input
                      type="number"
                      min="1"
                      max="100"
                      value={formData.memoryConfig?.instantLimit || 10}
                      onChange={(e) => handleUpdateSettings({
                        ...formData,
                        memoryConfig: { ...formData.memoryConfig, instantLimit: parseInt(e.target.value) }
                      })}
                      className="w-full bg-void border border-steel-gray p-2 terminal-text text-cta focus:border-cta outline-none"
                    />
                  </div>
                  <div>
                    <label className="terminal-text text-sm text-gray mb-2 block">SHORT TERM LIMIT</label>
                    <input
                      type="number"
                      min="1"
                      max="100"
                      value={formData.memoryConfig?.shortTermLimit || 20}
                      onChange={(e) => handleUpdateSettings({
                        ...formData,
                        memoryConfig: { ...formData.memoryConfig, shortTermLimit: parseInt(e.target.value) }
                      })}
                      className="w-full bg-void border border-steel-gray p-2 terminal-text text-cta focus:border-cta outline-none"
                    />
                  </div>
                  <div>
                    <label className="terminal-text text-sm text-gray mb-2 block">MEDIUM TERM LIMIT</label>
                    <input
                      type="number"
                      min="1"
                      max="100"
                      value={formData.memoryConfig?.mediumTermLimit || 10}
                      onChange={(e) => handleUpdateSettings({
                        ...formData,
                        memoryConfig: { ...formData.memoryConfig, mediumTermLimit: parseInt(e.target.value) }
                      })}
                      className="w-full bg-void border border-steel-gray p-2 terminal-text text-cta focus:border-cta outline-none"
                    />
                  </div>
                  <div>
                    <label className="terminal-text text-sm text-gray mb-2 block">LONG TERM LIMIT</label>
                    <input
                      type="number"
                      min="1"
                      max="100"
                      value={formData.memoryConfig?.longTermLimit || 5}
                      onChange={(e) => handleUpdateSettings({
                        ...formData,
                        memoryConfig: { ...formData.memoryConfig, longTermLimit: parseInt(e.target.value) }
                      })}
                      className="w-full bg-void border border-steel-gray p-2 terminal-text text-cta focus:border-cta outline-none"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'VISUAL' && (
            <div className="h-full p-6 overflow-y-auto custom-scrollbar space-y-4">
              {/* Avatar & Background */}
              <div className="panel p-6 space-y-4">
                <h3 className="terminal-text text-cta mb-4 flex items-center gap-2">
                  <Palette size={20} />
                  APPEARANCE
                </h3>
                
                {/* Avatar Upload */}
                <div>
                  <label className="terminal-text text-sm text-gray mb-2 block">AVATAR URL</label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={formData.backgroundImage || ''}
                      onChange={(e) => handleUpdateSettings({ ...formData, backgroundImage: e.target.value })}
                      placeholder="https://example.com/avatar.png"
                      className="flex-1 bg-void border border-steel-gray p-2 terminal-text text-cta focus:border-cta outline-none"
                    />
                  </div>
                </div>

                {/* Background Image */}
                <div>
                  <label className="terminal-text text-sm text-gray mb-2 block">BACKGROUND IMAGE URL</label>
                  <input
                    type="text"
                    value={formData.backgroundImage || ''}
                    onChange={(e) => handleUpdateSettings({ ...formData, backgroundImage: e.target.value })}
                    placeholder="https://example.com/background.jpg"
                    className="w-full bg-void border border-steel-gray p-2 terminal-text text-cta focus:border-cta outline-none"
                  />
                </div>

                {/* Font Size */}
                <div>
                  <label className="terminal-text text-sm text-gray mb-2 block">FONT SIZE</label>
                  <div className="flex gap-2">
                    {(['small', 'medium', 'large'] as const).map(size => (
                      <button
                        key={size}
                        onClick={() => handleUpdateSettings({ ...formData, fontSize: size })}
                        className={`btn flex-1 ${formData.fontSize === size ? 'border-cta text-cta' : 'border-gray text-gray'}`}
                      >
                        {size.toUpperCase()}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Chat Log Limit */}
                <div>
                  <label className="terminal-text text-sm text-gray mb-2 block">CHAT LOG DISPLAY LIMIT</label>
                  <div className="flex gap-2 items-center">
                    <input
                      type="number"
                      min="10"
                      max="1000"
                      value={formData.chatLogLimit || 100}
                      onChange={(e) => handleUpdateSettings({ ...formData, chatLogLimit: parseInt(e.target.value) || null })}
                      className="flex-1 bg-void border border-steel-gray p-2 terminal-text text-cta focus:border-cta outline-none"
                    />
                    <button
                      onClick={() => handleUpdateSettings({ ...formData, chatLogLimit: null })}
                      className="btn px-4"
                    >
                      UNLIMITED
                    </button>
                  </div>
                  <div className="terminal-text text-xs text-gray mt-1">
                    Number of messages to display (null = unlimited)
                  </div>
                </div>
              </div>

              {/* Audio */}
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

              {/* Display Settings */}
              <div className="panel p-6 space-y-4">
                <h3 className="terminal-text text-cta mb-4 flex items-center gap-2">
                  <Monitor size={20} />
                  DISPLAY CONFIGURATION
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

                {/* Streaming Output */}
                <div className="flex items-center justify-between">
                  <span className="terminal-text text-gray">STREAMING OUTPUT</span>
                  <button
                    onClick={() => handleUpdateSettings({ ...formData, enableStreaming: !formData.enableStreaming })}
                    className={`btn px-6 ${formData.enableStreaming ? 'border-cta text-cta' : 'border-gray text-gray'}`}
                  >
                    {formData.enableStreaming ? 'ENABLED' : 'DISABLED'}
                  </button>
                </div>

                {/* Action Suggestions */}
                <div className="flex items-center justify-between">
                  <span className="terminal-text text-gray">ACTION SUGGESTIONS</span>
                  <button
                    onClick={() => handleUpdateSettings({ ...formData, enableActionOptions: !formData.enableActionOptions })}
                    className={`btn px-6 ${formData.enableActionOptions ? 'border-cta text-cta' : 'border-gray text-gray'}`}
                  >
                    {formData.enableActionOptions ? 'ENABLED' : 'DISABLED'}
                  </button>
                </div>

                {/* API Protection */}
                <div className="flex items-center justify-between">
                  <span className="terminal-text text-gray">API PROTECTION</span>
                  <button
                    onClick={() => handleUpdateSettings({ ...formData, apiProtectionEnabled: !formData.apiProtectionEnabled })}
                    className={`btn px-6 ${formData.apiProtectionEnabled ? 'border-cta text-cta' : 'border-gray text-gray'}`}
                  >
                    {formData.apiProtectionEnabled ? 'ENABLED' : 'DISABLED'}
                  </button>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'WRITING' && (
            <div className="h-full p-6 overflow-y-auto custom-scrollbar">
              <div className="panel p-6 space-y-4">
                <h3 className="terminal-text text-cta mb-4 flex items-center gap-2">
                  <Palette size={20} />
                  WRITING CONFIGURATION
                </h3>

                <div className="flex items-center justify-between">
                  <span className="terminal-text text-gray">WORD COUNT REQUIREMENT</span>
                  <button
                    onClick={() => handleUpdateSettings({
                      ...formData,
                      writingConfig: { ...formData.writingConfig, enableWordCountRequirement: !formData.writingConfig?.enableWordCountRequirement }
                    })}
                    className={`btn px-6 ${formData.writingConfig?.enableWordCountRequirement ? 'border-cta text-cta' : 'border-gray text-gray'}`}
                  >
                    {formData.writingConfig?.enableWordCountRequirement ? 'ENABLED' : 'DISABLED'}
                  </button>
                </div>

                {formData.writingConfig?.enableWordCountRequirement && (
                  <div>
                    <label className="terminal-text text-sm text-gray mb-2 block">REQUIRED WORD COUNT</label>
                    <input
                      type="number"
                      min="100"
                      max="5000"
                      value={formData.writingConfig?.requiredWordCount || 800}
                      onChange={(e) => handleUpdateSettings({
                        ...formData,
                        writingConfig: { ...formData.writingConfig, requiredWordCount: parseInt(e.target.value) }
                      })}
                      className="w-full bg-void border border-steel-gray p-2 terminal-text text-cta focus:border-cta outline-none"
                    />
                  </div>
                )}

                <div>
                  <label className="terminal-text text-sm text-gray mb-2 block">NARRATIVE PERSPECTIVE</label>
                  <div className="flex gap-2">
                    {['first', 'second', 'third'].map(perspective => (
                      <button
                        key={perspective}
                        onClick={() => handleUpdateSettings({
                          ...formData,
                          writingConfig: { ...formData.writingConfig, narrativePerspective: perspective as any }
                        })}
                        className={`btn flex-1 ${formData.writingConfig?.narrativePerspective === perspective ? 'border-cta text-cta' : 'border-gray text-gray'}`}
                      >
                        {perspective.toUpperCase()}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-steel-gray flex gap-4 shrink-0">
          <button onClick={handleExitToMenu} className="btn-secondary border-danger text-danger hover:bg-danger hover:text-background flex items-center gap-2">
            <LogOut size={18} />
            EXIT TO MENU
          </button>
          <div className="flex-1" />
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
