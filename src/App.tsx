import { useState } from 'react'
import { GameController } from './components/game/GameController'
import { DebugPanel } from './components/dev/DebugPanel'
import type { GameStateData } from './types/Game'
import './App.css'

function App() {
  const [debugData, setDebugData] = useState<{
    gameState: GameStateData | null
    currentSequenceButtons: number[]
  }>({
    gameState: null,
    currentSequenceButtons: []
  })

  return (
    <div className="app-container bg-custom-golden">
      <div className="relative h-full">
        <GameController onDebugUpdate={setDebugData} />
        {debugData.gameState && (
          <DebugPanel 
            gameState={debugData.gameState} 
            currentSequenceButtons={debugData.currentSequenceButtons}
          />
        )}
      </div>
    </div>
  )
}

export default App
