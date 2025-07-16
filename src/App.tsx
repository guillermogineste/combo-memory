import { useState } from 'react'
import { GameController } from './components/GameController'
import { DebugPanel } from './components/ui/DebugPanel'
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
