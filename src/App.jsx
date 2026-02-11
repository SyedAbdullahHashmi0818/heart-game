import { useState } from 'react'
import TitleScreen from './screens/TitleScreen'
import Screen2 from './screens/Screen2'
import Screen3 from './screens/Screen3'

function App() {
  const [currentScreen, setCurrentScreen] = useState(1)

  const handleStart = () => {
    setCurrentScreen(2)
  }

  const handleProceed = () => {
    setCurrentScreen(3)
  }

  return (
    <>
      {currentScreen === 1 && <TitleScreen onStart={handleStart} />}
      {currentScreen === 2 && <Screen2 onProceed={handleProceed} />}
      {currentScreen === 3 && <Screen3 />}
    </>
  )
}

export default App
