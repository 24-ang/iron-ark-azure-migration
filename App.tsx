
import React, { useState } from 'react';
import { Screen, GameState } from './types';
import { StartScreen } from './components/StartScreen';
import { Home } from './components/Home';
import { GameInterface } from './components/GameInterface';
import { CharacterCreation } from './components/CharacterCreation';


export default function App() {
  const [currentScreen, setCurrentScreen] = useState<Screen>(Screen.START);
  const [loadedState, setLoadedState] = useState<GameState | undefined>(undefined);

  const bootSystem = () => {
    setCurrentScreen(Screen.HOME);
  };

  const startGame = (savedState?: GameState) => {
    if (savedState) {
        setLoadedState(savedState);
    } else {
        setLoadedState(undefined); 
    }
    setCurrentScreen(Screen.GAME);
  };

  const startNewGameFlow = () => {
    setCurrentScreen(Screen.CHAR_CREATION);
  };

  const finishCharCreation = (initialState: GameState) => {
    setLoadedState(initialState);
    setCurrentScreen(Screen.GAME);
  };

  const exitGame = () => {
    setCurrentScreen(Screen.HOME);
    setLoadedState(undefined);
  };

  return (
    <main className="cassette-futurism-theme w-full h-screen bg-black text-white font-sans antialiased overflow-hidden selection:bg-red-600 selection:text-white">
      {currentScreen === Screen.START && (
        <StartScreen onStart={bootSystem} />
      )}

      {currentScreen === Screen.HOME && (
        <Home onStart={startGame} onNewGame={startNewGameFlow} />
      )}
      
      {currentScreen === Screen.CHAR_CREATION && (
        <CharacterCreation 
            onComplete={finishCharCreation} 
            onBack={() => setCurrentScreen(Screen.HOME)} 
        />
      )}

      {currentScreen === Screen.GAME && (
        <GameInterface onExit={exitGame} initialState={loadedState} />
      )}
    </main>
  );
}
