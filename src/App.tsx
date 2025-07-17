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
    <div className="relative h-full bg-custom-golden overflow-hidden">
        <GameController onDebugUpdate={setDebugData} />
      {debugData.gameState && (
        <DebugPanel 
          gameState={debugData.gameState} 
          currentSequenceButtons={debugData.currentSequenceButtons}
        />
      )}
    </div>
  )
}

export default App
