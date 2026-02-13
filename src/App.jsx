import { Routes, Route, useNavigate } from 'react-router-dom'
import MusicPlayer from './components/MusicPlayer'
import TitleScreen from './screens/TitleScreen'
import Screen2 from './screens/Screen2'
import Screen3 from './screens/Screen3'
import Screen4 from './screens/Screen4'
import Screen5 from './screens/Screen5'

function App() {
  const navigate = useNavigate()

  return (
    <>
      <MusicPlayer />
      <Routes>
        <Route path="/" element={<TitleScreen onStart={() => navigate('/2')} />} />
        <Route path="/1" element={<TitleScreen onStart={() => navigate('/2')} />} />
        <Route path="/2" element={<Screen2 onProceed={() => navigate('/3')} />} />
        <Route path="/3" element={<Screen3 onComplete={() => navigate('/4')} />} />
        <Route path="/4" element={<Screen4 onProceed={() => navigate('/5')} />} />
        <Route path="/5" element={<Screen5 />} />
      </Routes>
    </>
  )
}

export default App
