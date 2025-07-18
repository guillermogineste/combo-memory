import { useState } from 'react'
import { GameController } from './components/game/GameController'
import { DebugPanel } from './components/dev/DebugPanel'
import { useURLParams } from './hooks/useURLParams'
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

  const { isDebugMode } = useURLParams()

  console.log('Debug mode enabled:', isDebugMode()) // Debug statement

  return (
    <div className="app-container">
      <div className="relative h-full">
        <GameController onDebugUpdate={setDebugData} />
        {debugData.gameState && isDebugMode() && (
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
