import React, { useEffect, useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { useParams, Link } from 'react-router-dom';

function PokemonDetails() {
  const typeColors = {
    normal: "bg-gray-300",
    fire: "bg-red-400",
    water: "bg-blue-400",
    grass: "bg-green-400",
    electric: "bg-yellow-300",
    ice: "bg-blue-200",
    fighting: "bg-red-700",
    poison: "bg-purple-400",
    ground: "bg-yellow-600",
    flying: "bg-indigo-300",
    psychic: "bg-pink-400",
    bug: "bg-lime-400",
    rock: "bg-yellow-800",
    ghost: "bg-indigo-700",
    dragon: "bg-purple-600",
    dark: "bg-gray-700",
    steel: "bg-gray-500",
    fairy: "bg-pink-300",
  };

  const { name } = useParams();
  const [pokemon, setPokemon] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchPokemon() {
      const res = await fetch(`https://pokeapi.co/api/v2/pokemon/${name}`);
      const data = await res.json();
      setPokemon(data);
      setLoading(false);
    }
    fetchPokemon();
  }, [name]);

  if (loading) return <p className="p-4 text-center text-gray-200">Loading...</p>;

  const chartData = pokemon.stats.map(stat => ({
    name: stat.stat.name,
    value: stat.base_stat,
  }));

  return (
    <div className="p-4 max-w-4xl mx-auto pokemon-details-page">
    
      <Link to="/">
        <button className="mb-4 px-4 py-2 bg-gray-200 rounded hover:bg-gray-300">
          ← Back
        </button>
      </Link>

      <div className="bg-white shadow-lg rounded-lg p-6 flex flex-col md:flex-row gap-8">
        
        <div className="flex flex-col items-center md:items-start md:flex-1">
          <h1 className="text-3xl capitalize font-bold text-center md:text-left">{pokemon.name}</h1>
          <img 
            src={pokemon.sprites.front_default}
            alt={pokemon.name}
            className="mt-4 w-32 h-32 object-contain"
          />
          <p className="mt-4"><strong>Height:</strong> {pokemon.height}</p>
          <p><strong>Weight:</strong> {pokemon.weight}</p>

          <p className="mt-4 font-semibold">Types:</p>
          <ul className="flex gap-2 mt-1 flex-wrap">
            {pokemon.types.map(t => (
              <li
                key={t.type.name}
                className={`px-3 py-1 rounded-full text-white text-sm capitalize font-bold text-gray-50 ${typeColors[t.type.name] || 'bg-gray-400'}`}
              >
                {t.type.name}
              </li>
            ))}
          </ul>
        </div>


        <div className="flex flex-col md:flex-1 border-t md:border-t-0 md:border-l border-gray-300 md:pl-6 pt-6 md:pt-0">
          <p className="font-semibold">Abilities:</p>
          <ul className="list-disc list-inside mt-1">
            {pokemon.abilities.map(({ ability, is_hidden }) => (
              <li key={ability.name} className="capitalize">
                {ability.name} {is_hidden ? "(Hidden Ability)" : ""}
              </li>
            ))}
          </ul>

          <div className="mt-6">
            <h2 className="font-semibold text-lg mb-2">Base Stats:</h2>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={chartData}>
                <XAxis dataKey="name" stroke="#8884d8" />
                <YAxis />
                <Tooltip />
                  <Bar dataKey="value" fill="#9400D3" barSize={30} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}

export default PokemonDetails;
