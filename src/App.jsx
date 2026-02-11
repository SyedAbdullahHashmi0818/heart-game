import { useState } from 'react'
import TitleScreen from './screens/TitleScreen'
import Screen2 from './screens/Screen2'

function App() {
  const [currentScreen, setCurrentScreen] = useState(1)

  const handleStart = () => {
    setCurrentScreen(2)
  }

  return (
    <>
      {currentScreen === 1 && <TitleScreen onStart={handleStart} />}
      {currentScreen === 2 && <Screen2 />}
    </>
  )
}

export default App
