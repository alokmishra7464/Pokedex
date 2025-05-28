import React, { useState, useEffect } from 'react';
import PokemonCard from '../components/PokemonCard';
import { useNavigate } from 'react-router-dom';

function Home() {
  const [pokemonList, setPokemonList] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [displayedPokemon, setDisplayedPokemon] = useState(20);

  const navigate = useNavigate();

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      try {
        const res = await fetch(`https://pokeapi.co/api/v2/pokemon?limit=1300&offset=0`);
        const data = await res.json();
        setPokemonList(data.results);
      } catch (error) {
        console.error("Failed to fetch Pokémon list", error);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  const filteredList = pokemonList.filter((poke) =>
    poke.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleLoadMore = () => {
    setDisplayedPokemon((prev) => prev + 20);
  };

  return (
    <div className="p-4 max-w-5xl mx-auto">
      
      <div className="sticky top-0 z-50 pt-3 pb-3 mb-6 flex items-center justify-between gap-4" style={{ backgroundColor: 'rgb(30, 28, 28)' }}>
        
        <h1 className="text-3xl font-bold text-yellow-400 flex-shrink-0">Pokédex</h1>

        <input
          type="text"
          placeholder="Search Pokémon..."
          className="flex-grow p-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />

        <button
          onClick={() => navigate('/Guess')}
          className="font-bold bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition flex-shrink-0"
        >
          Quiz
        </button>
      </div>

      {loading ? (
        <p className="text-center">Loading...</p>
      ) : (
        <>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {(searchTerm ? filteredList : pokemonList.slice(0, displayedPokemon)).map((poke) => (
              <PokemonCard
                key={poke.name}
                name={poke.name}
                url={poke.url}
              />
            ))}
          </div>

          {!searchTerm && displayedPokemon < pokemonList.length && (
            <div className="mt-8 flex justify-center">
              <button
                onClick={handleLoadMore}
                className="px-6 py-3 bg-yellow-700 text-white rounded hover:bg-yellow-800"
              >
                Load More
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default Home;
