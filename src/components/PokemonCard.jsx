import React from 'react'
import {useState, useEffect} from 'react';
import {Link} from 'react-router-dom';

function PokemonCard({name, url}) {
    const [imgUrl, setImgUrl] = useState('');

    useEffect(() => {
        async function fetchDetails() {
            const res = await fetch(url);
            const data = await res.json();
            setImgUrl(data.sprites.front_default);
        }
        fetchDetails();
    } , [url]);

  return (
    <Link to={`/pokemon/${name}`}>
        <div className="bg-white shadow-md rounded-lg p-4 hover:scale-105 transition transform duration-200 hover:ring-2 hover:ring-yellow-500">
            <img src={imgUrl} alt={name} className='mx-auto w-32 h-32 object-contain' />
            <h2 className="text-center capitalize font-semibold mt-2">{name}</h2>
        </div>
    </Link>
  )
}

export default PokemonCard