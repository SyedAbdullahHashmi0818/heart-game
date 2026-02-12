import { Routes, Route, useNavigate } from 'react-router-dom'
import TitleScreen from './screens/TitleScreen'
import Screen2 from './screens/Screen2'
import Screen3 from './screens/Screen3'
import Screen4 from './screens/Screen4'

function App() {
  const navigate = useNavigate()

  return (
    <Routes>
      <Route path="/" element={<TitleScreen onStart={() => navigate('/2')} />} />
      <Route path="/1" element={<TitleScreen onStart={() => navigate('/2')} />} />
      <Route path="/2" element={<Screen2 onProceed={() => navigate('/3')} />} />
      <Route path="/3" element={<Screen3 onComplete={() => navigate('/4')} />} />
      <Route path="/4" element={<Screen4 />} />
    </Routes>
  )
}

export default App
