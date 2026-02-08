import React, { useEffect, useState } from 'react';
import { Terminal, Zap, Database, Settings } from 'lucide-react';
import { GameState, AppSettings } from '../types';
import { SaveManagerModal } from './game/modals/SaveManagerModal';
import { SettingsModal } from './game/modals/SettingsModal';
import { StartScreen } from './StartScreen';
import { DEFAULT_SETTINGS } from '../hooks/useAppSettings';
import '../src/styles/cassette-futurism.css';

interface HomeProps {
  onStart: (savedState?: GameState) => void;
  onNewGame?: () => void;
}

export const Home: React.FC<HomeProps> = ({ onStart, onNewGame }) => {
  const [bootComplete, setBootComplete] = useState(false);
  const [systemStatus, setSystemStatus] = useState({
    cpu: 0,
    radiation: 0,
    connection: 'OFFLINE'
  });
  
  // Modal states
  const [showSaveManager, setShowSaveManager] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  
  // Settings management
  const [settings, setSettings] = useState<AppSettings>(() => {
    const saved = localStorage.getItem('danmachi_settings');
    return saved ? JSON.parse(saved) : DEFAULT_SETTINGS;
  });
  
  const [avatarUrl, setAvatarUrl] = useState('');
  
  // Dummy game state for modals (not used on home screen but required by modal props)
  const [dummyGameState, setDummyGameState] = useState<GameState | null>(null);

  // Boot animation
  useEffect(() => {
    const timer = setTimeout(() => setBootComplete(true), 1500);
    return () => clearTimeout(timer);
  }, []);

  // Simulate live HUD data
  useEffect(() => {
    const interval = setInterval(() => {
      setSystemStatus({
        cpu: Math.floor(Math.random() * 40) + 60,
        radiation: Math.floor(Math.random() * 100),
        connection: Math.random() > 0.1 ? 'STABLE' : 'UNSTABLE'
      });
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  const handleNewGame = () => {
    if (onNewGame) {
      onNewGame();
    }
  };
  
  const handleLoadGame = (slotId: number | string) => {
    const key = typeof slotId === 'number' ? `danmachi_save_manual_${slotId}` : `danmachi_save_${slotId}`;
    const saved = localStorage.getItem(key);
    if (saved) {
      try {
        const data = JSON.parse(saved);
        onStart(data.data || data);
      } catch (e) {
        console.error('Failed to load game:', e);
      }
    }
  };
  
  const handleSaveGame = (slotId?: number | string) => {
    // Not used on home screen, but required by SaveManagerModal
    console.log('Save game not available on home screen');
  };
  
  const handleSaveSettings = (newSettings: AppSettings) => {
    setSettings(newSettings);
    localStorage.setItem('danmachi_settings', JSON.stringify(newSettings));
  };
  
  const handleUpdateAvatar = (url: string) => {
    setAvatarUrl(url);
  };
  
  const handleUpdateGameState = (newState: GameState) => {
    setDummyGameState(newState);
  };
  
  const handleExitGame = () => {
    // Not used on home screen
  };

  // Remove internal bootComplete check - App.tsx handles the initial StartScreen

  return (
      <div className="w-full h-screen bg-boot flex flex-col items-center justify-center relative boot-animation animate-in fade-in duration-1000">
      
      {/* HUD Frame */}
      <div className="hud-frame">
        <div className="hud-corner top-left"></div>
        <div className="hud-corner top-right"></div>
        <div className="hud-corner bottom-left"></div>
        <div className="hud-corner bottom-right"></div>
        
        {/* Live Status Displays */}
        <div className="hud-status top-left">
          <div className="text-green">CPU: {systemStatus.cpu}%</div>
        </div>

        <div className="hud-status bottom-left">
          <div className="text-green">SYS: ONLINE</div>
        </div>
        <div className="hud-status bottom-right">
          <div className={systemStatus.connection === 'STABLE' ? 'text-green' : 'text-amber'}>
            NET: {systemStatus.connection}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="z-10 flex flex-col items-center gap-8 p-8 max-w-4xl">
        
        {/* Terminal Header */}
        <div className="flex items-center gap-4 mb-4">
          <Terminal size={48} className="text-green phosphor-glow" />
          <div>
            <h1 className="terminal-text text-6xl text-green phosphor-glow tracking-wider">
              WASTELAND 2155
            </h1>
            <div className="text-amber text-sm mt-2 terminal-text">
              AI SURVIVAL PROTOCOL v3.7.2
            </div>
          </div>
        </div>

        {/* System Message */}
        <div className="border border-steel-gray bg-void p-6 w-full max-w-2xl">
          <div className="terminal-text text-green text-sm leading-relaxed">
            <div className="mb-2">&gt; INITIALIZING NEURAL CORE...</div>
            <div className="mb-2">&gt; LOADING SURVIVAL PROTOCOLS...</div>
            <div className="mb-2">&gt; SCANNING WASTELAND SECTORS...</div>
            <div className="text-amber mt-4">
              &gt; SYSTEM READY. AWAITING USER INPUT<span className="cursor-blink"></span>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col gap-4 w-full max-w-md mt-8">
          <button
            onClick={handleNewGame}
            className="btn w-full py-4 text-lg phosphor-glow"
          >
            <div className="flex items-center justify-center gap-3">
              <Zap size={20} />
              <span>INITIALIZE NEW PROTOCOL</span>
            </div>
          </button>

          <button
            onClick={() => setShowSaveManager(true)}
            className="btn w-full py-4 text-lg"
          >
            <div className="flex items-center justify-center gap-3">
              <Database size={20} />
              <span>LOAD SAVED STATE</span>
            </div>
          </button>

          <button
            onClick={() => setShowSettings(true)}
            className="btn w-full py-3 text-sm border-steel-gray text-gray"
          >
            <div className="flex items-center justify-center gap-3">
              <Settings size={18} />
              <span>SYSTEM CONFIGURATION</span>
            </div>
          </button>
        </div>

        {/* Footer Info */}
        <div className="mt-8 text-center terminal-text text-xs text-gray">
          <div>GEMINI NEURAL CORE - POST-WAR EDITION</div>
          <div className="mt-1">BUILD 20550207 - CLASSIFIED</div>
        </div>
      </div>

      {/* Navigation Controls */}
      <div className="absolute top-6 right-6 flex gap-4 z-50">
        <button 
          onClick={() => {
            if (!document.fullscreenElement) {
              document.documentElement.requestFullscreen().catch(err => console.log(err));
            } else {
              document.exitFullscreen();
            }
          }}
          className="p-2 text-cta border border-cta/30 hover:bg-cta/10 hover:border-cta transition-colors"
          title="TOGGLE FULLSCREEN"
        >
          <div className="w-6 h-6 flex items-center justify-center">
            {document.fullscreenElement ? (
               <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M8 3v3a2 2 0 0 1-2 2H3"/><path d="M21 8h-3a2 2 0 0 1-2-2V3"/><path d="M3 16h3a2 2 0 0 1 2 2v3"/><path d="M16 21v-3a2 2 0 0 1 2-2h3"/></svg>
            ) : (
               <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M15 3h6v6"/><path d="M9 21H3v-6"/><path d="M21 3l-7 7"/><path d="M3 21l7-7"/></svg>
            )}
          </div>
        </button>
        
        <button 
          onClick={() => {
            if (confirm('TERMINATE SESSION?')) {
              window.close(); // Works in installed PWA/Electron, minimal effect in browser tab
              // Fallback visual effect
              document.body.style.opacity = '0';
              setTimeout(() => document.body.style.opacity = '1', 2000);
            }
          }}
          className="p-2 text-danger border border-danger/30 hover:bg-danger/10 hover:border-danger transition-colors"
          title="SYSTEM SHUTDOWN"
        >
           <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18.36 6.64a9 9 0 1 1-12.73 0"/><line x1="12" y1="2" x2="12" y2="12"/></svg>
        </button>
      </div>

      {/* Save Manager Modal */}
      {showSaveManager && (
        <SaveManagerModal
          isOpen={showSaveManager}
          onClose={() => setShowSaveManager(false)}
          gameState={dummyGameState || {} as GameState}
          onSaveGame={handleSaveGame}
          onLoadGame={handleLoadGame}
          onUpdateGameState={handleUpdateGameState}
        />
      )}

      {/* Settings Modal */}
      {showSettings && (
        <SettingsModal
          isOpen={showSettings}
          onClose={() => setShowSettings(false)}
          settings={settings}
          avatarUrl={avatarUrl}
          onSaveSettings={handleSaveSettings}
          onSaveGame={handleSaveGame}
          onLoadGame={handleLoadGame}
          onUpdateAvatar={handleUpdateAvatar}
          onExitGame={handleExitGame}
          gameState={dummyGameState || {} as GameState}
          onUpdateGameState={handleUpdateGameState}
        />
      )}
      </div>
  );
};
