import {BrowserRouter as Router, Routes, Route} from 'react-router-dom';
import { useState } from 'react';
import Home from './pages/Home';
import PokemonDetails from './pages/PokemonDetails';
import Guess from './pages/Guess.jsx';

function App() {
  const [count, setCount] = useState(0)

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />}/>
        <Route path="/pokemon/:name" element={<PokemonDetails />} />
        <Route path="/guess" element={<Guess />} />
      </Routes>
    </Router>
  )
}

export default App
