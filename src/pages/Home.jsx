import React, { useState, useEffect } from 'react';
import PokemonCard from '../components/PokemonCard';
import { useNavigate } from 'react-router-dom';

function Home() {
  const [pokemonList, setPokemonList] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [selectedPokemon, setSelectedPokemon] = useState([]);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);

  const navigate = useNavigate();

  const limit = 20;
  const totalPages = Math.ceil(total / limit);

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      try {
        const offset = (page - 1) * limit;
        const res = await fetch(`https://pokeapi.co/api/v2/pokemon?limit=${limit}&offset=${offset}`);
        const data = await res.json();
        setPokemonList(data.results);
        setTotal(data.count);
      } catch (error) {
        console.error("Failed to fetch Pokémon list", error);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [page]);

  const handleSelect = (name) => {
    setSelectedPokemon(prev =>
      prev.includes(name) ? prev.filter(p => p !== name) : [...prev, name]
    );
  };

  const handleCompare = () => {
    if (selectedPokemon.length >= 2) {
      navigate(`/compare?pokemon=${selectedPokemon.join(',')}`);
    }
  };

  const filteredList = pokemonList.filter((poke) =>
    poke.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    
    <div className='p-4 max-w-5xl mx-auto'>
      <button onClick={() => navigate('/Guess')} className="absolute top-0 right-0 mt-3 mr-4 font-bold bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition">
          Quiz
      </button>

      <h1 className='text-3xl font-bold mb-4 text-center text-yellow-400'>Pokédex</h1>

      <input
        type="text"
        placeholder="Search Pokémon..."
        className="w-full p-3 mb-6 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />

      {loading ? (
        <p className="text-center">Loading...</p>
      ) : (
        <>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {filteredList.map((poke) => (
              <PokemonCard
                key={poke.name}
                name={poke.name}
                url={poke.url}
                isSelected={selectedPokemon.includes(poke.name)}
                onSelect={handleSelect}
              />
            ))}
          </div>

          {selectedPokemon.length >= 2 && (
            <div className="mt-6 text-center">
              <button
                onClick={handleCompare}
                className="px-6 py-3 bg-blue-500 text-white rounded-lg shadow hover:bg-blue-600 transition"
              >
                Compare ({selectedPokemon.length})
              </button>
            </div>
          )}

          <div className="mt-8 flex justify-center items-center gap-4">
            <button
              onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
              disabled={page === 1}
              className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300 disabled:opacity-50"
            >
              ← Previous
            </button>

            <span className="px-4 py-2 font-semibold text-gray-50">
              Page {page} of {totalPages}
            </span>

            <button
              onClick={() => setPage((prev) => Math.min(prev + 1, totalPages))}
              disabled={page === totalPages}
              className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300 disabled:opacity-50"
            >
              Next →
            </button>
          </div>
        </>
      )}
    </div>
  );
}

export default Home;
