import React, { useEffect, useRef, useState } from 'react';
import { X, HardDrive, Clock, FileDown, FileUp, Database, Trash2 } from 'lucide-react';
import { GameState, SaveSlot } from '../../../types';

interface SaveManagerModalProps {
  isOpen: boolean;
  onClose: () => void;
  gameState: GameState;
  onSaveGame: (slotId?: number | string) => void;
  onLoadGame: (slotId: number | string) => void;
  onUpdateGameState: (newState: GameState) => void;
}

export const SaveManagerModal: React.FC<SaveManagerModalProps> = ({
  isOpen,
  onClose,
  gameState,
  onSaveGame,
  onLoadGame,
  onUpdateGameState,
}) => {
  const [saveSlots, setSaveSlots] = useState<SaveSlot[]>([]);
  const [autoSlots, setAutoSlots] = useState<SaveSlot[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      loadSaveSlots();
    }
  }, [isOpen]);

  const loadSaveSlots = () => {
    const manual: SaveSlot[] = [];
    for (let i = 1; i <= 3; i++) {
      const raw = localStorage.getItem(`danmachi_save_manual_${i}`);
      if (raw) {
        try {
          const data = JSON.parse(raw);
          manual.push({ id: i, type: 'MANUAL', timestamp: data.timestamp, summary: data.summary, data: data.data });
        } catch (e) {}
      }
    }
    setSaveSlots(manual);

    const auto: SaveSlot[] = [];
    for (let i = 1; i <= 3; i++) {
      const raw = localStorage.getItem(`danmachi_save_auto_${i}`);
      if (raw) {
        try {
          const data = JSON.parse(raw);
          auto.push({ id: `auto_${i}`, type: 'AUTO', timestamp: data.timestamp, summary: data.summary, data: data.data });
        } catch (e) {}
      }
    }
    auto.sort((a, b) => b.timestamp - a.timestamp);
    setAutoSlots(auto);
  };

  const handleExportSave = () => {
    const exportData = {
      id: 'export',
      type: 'EXPORT',
      timestamp: Date.now(),
      summary: `Export: ${gameState.角色?.姓名 || 'Player'} - Lv.${gameState.角色?.等级 || '1'}`,
      data: gameState,
      version: '3.0',
    };

    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `wasteland_save_${gameState.角色?.姓名 || 'player'}_${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleImportSave = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (ev) => {
      try {
        const content = ev.target?.result as string;
        const parsed = JSON.parse(content);
        const stateToLoad = parsed.data ? parsed.data : parsed;

        if (stateToLoad.character && !stateToLoad.角色) stateToLoad.角色 = stateToLoad.character;
        if (stateToLoad.inventory && !stateToLoad.背包) stateToLoad.背包 = stateToLoad.inventory;

        const summary = parsed.summary || stateToLoad.角色?.姓名 || 'Unknown Save';
        const timeStr = parsed.timestamp ? new Date(parsed.timestamp).toLocaleString() : 'Unknown Time';

        if (window.confirm(`Confirm import save?\n\nInfo: ${summary}\nTime: ${timeStr}\n\nWARNING: This will overwrite current unsaved progress!`)) {
          onUpdateGameState(stateToLoad);
          alert('Save imported successfully!');
          onClose();
        }
      } catch (err: any) {
        alert('Import failed: ' + err.message);
      }
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  const handleDeleteSave = (slotId: number) => {
    if (confirm(`Are you sure you want to delete Save Slot ${slotId}?`)) {
      localStorage.removeItem(`danmachi_save_manual_${slotId}`);
      loadSaveSlots();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-90 backdrop-blur-sm">
      {/* Modal Container */}
      <div className="w-full max-w-4xl mx-4 bg-background border-2 border-cta panel max-h-[90vh] flex flex-col">
        
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-steel-gray">
          <div className="flex items-center gap-3">
            <HardDrive size={32} className="text-cta phosphor-glow" />
            <h2 className="terminal-text text-2xl text-cta phosphor-glow">SAVE DATA MANAGEMENT</h2>
          </div>
          <button onClick={onClose} className="text-gray hover:text-cta transition-colors">
            <X size={24} />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          
          {/* Auto Saves */}
          <div>
            <h3 className="terminal-text text-amber mb-3 flex items-center gap-2">
              <Clock size={18} />
              AUTO SAVES
            </h3>
            {autoSlots.length > 0 ? (
              <div className="space-y-2">
                {autoSlots.map((slot) => (
                  <div key={slot.id} className="panel p-4 flex items-center justify-between hover:border-cta transition-colors">
                    <div className="flex-1">
                      <div className="terminal-text text-cta">{slot.summary}</div>
                      <div className="terminal-text text-sm text-gray">{new Date(slot.timestamp).toLocaleString('zh-CN')}</div>
                    </div>
                    <button onClick={() => { onLoadGame(slot.id); onClose(); }} className="btn-secondary px-4 py-2">
                      LOAD
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <div className="panel p-6 text-center terminal-text text-gray">NO AUTO SAVES FOUND</div>
            )}
          </div>

          {/* Manual Saves */}
          <div>
            <h3 className="terminal-text text-cta mb-3 flex items-center gap-2">
              <Database size={18} />
              MANUAL SAVES
            </h3>
            <div className="space-y-2">
              {[1, 2, 3].map((id) => {
                const slot = saveSlots.find((s) => s.id === id);
                return (
                  <div key={id} className="panel p-4 flex items-center gap-4">
                    <div className="terminal-text text-2xl text-amber w-12">#{id}</div>
                    <div className="flex-1">
                      {slot ? (
                        <>
                          <div className="terminal-text text-cta">{slot.summary}</div>
                          <div className="terminal-text text-sm text-gray">{new Date(slot.timestamp).toLocaleString('zh-CN')}</div>
                        </>
                      ) : (
                        <div className="terminal-text text-gray italic">EMPTY SLOT</div>
                      )}
                    </div>
                    <div className="flex gap-2">
                      <button onClick={() => { onSaveGame(id); loadSaveSlots(); }} className="btn px-4 py-2">
                        SAVE
                      </button>
                      {slot && (
                        <>
                          <button onClick={() => { onLoadGame(id); onClose(); }} className="btn-secondary px-4 py-2">
                            LOAD
                          </button>
                          <button onClick={() => handleDeleteSave(id)} className="btn-secondary p-2 hover:text-danger hover:border-danger">
                            <Trash2 size={18} />
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Import/Export */}
          <div className="border-t border-steel-gray pt-6">
            <h3 className="terminal-text text-cta mb-3">BACKUP & MIGRATION</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <button onClick={handleExportSave} className="panel p-6 flex flex-col items-center gap-3 hover:border-cta transition-colors cursor-pointer">
                <FileDown size={32} className="text-cta" />
                <span className="terminal-text text-cta">EXPORT SAVE</span>
                <span className="terminal-text text-xs text-gray">Download .json</span>
              </button>
              <div onClick={() => fileInputRef.current?.click()} className="panel p-6 flex flex-col items-center gap-3 hover:border-cta transition-colors cursor-pointer">
                <FileUp size={32} className="text-cta" />
                <span className="terminal-text text-cta">IMPORT SAVE</span>
                <span className="terminal-text text-xs text-gray">Upload .json</span>
                <input type="file" ref={fileInputRef} className="hidden" accept=".json" onChange={handleImportSave} />
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-steel-gray">
          <button onClick={onClose} className="btn w-full">
            CLOSE
          </button>
        </div>
      </div>
    </div>
  );
};
