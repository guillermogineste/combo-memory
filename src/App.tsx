import { useState } from 'react'
import { GameBoard } from './components/ui/GameBoard'
import './App.css'

function App() {
  const [activeButtons, setActiveButtons] = useState<number[]>([])

  /**
   * Handle button clicks from the GameBoard
   * @param buttonNumber - The number of the button that was clicked
   */
  const handleButtonClick = (buttonNumber: number) => {
    console.log(`App: Button ${buttonNumber} clicked`) // Debug log
    
    // For now, just toggle the button's active state for demonstration
    setActiveButtons(prev => 
      prev.includes(buttonNumber) 
        ? prev.filter(num => num !== buttonNumber)
        : [...prev, buttonNumber]
    )
  }

  return (
    <div className="min-h-screen bg-slate-900 flex flex-col items-center justify-center p-4">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold text-white mb-2">Simon Says</h1>
        <p className="text-slate-300">Click the buttons to test the interface</p>
      </div>
      
      <GameBoard 
        onButtonClick={handleButtonClick}
        activeButtons={activeButtons}
        disabledButtons={[]}
      />
      
      <div className="mt-8 text-center">
        <p className="text-slate-400 text-sm">
          Active buttons: {activeButtons.length > 0 ? activeButtons.join(', ') : 'None'}
        </p>
      </div>
    </div>
  )
}

export default App
