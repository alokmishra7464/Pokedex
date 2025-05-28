import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

function Quiz() {
    const [screen, setScreen] = useState('start'); // 'start' , 'quiz' , 'result'
    const [pokemon, setPokemon] = useState(null);
    const [options, setOptions] = useState([]);
    const [score, setScore] = useState(0);
    const [questionCount, setQuestionCount] = useState(0);
    const [timer, setTimer] = useState(15);
    const [message, setMessage] = useState('');
    const totalQuestions = 5;


    async function getRandomPokemon() {
        const randomId = Math.floor(Math.random() * 1000) + 1;
        const res = await fetch(`https://pokeapi.co/api/v2/pokemon/${randomId}`);
        const data = await res.json();
        setPokemon(data);

        
        const optionIds = new Set([randomId]);
        while (optionIds.size < 4) {
        optionIds.add(Math.floor(Math.random() * 151) + 1);
        }

        const promises = Array.from(optionIds).map((id) =>
        fetch(`https://pokeapi.co/api/v2/pokemon/${id}`).then((res) => res.json())
        );

        const dataList = await Promise.all(promises);
        const names = dataList.map((p) => p.name).sort(() => 0.5 - Math.random());
        setOptions(names);
        setTimer(15);
    }

  // Timer
  useEffect(() => {
    if (screen !== 'quiz') return;

    if (timer === 0) {
      handleNext(false);
      return;
    }

    const interval = setInterval(() => setTimer((t) => t - 1), 1000);
    return () => clearInterval(interval);
  }, [timer, screen]);


  const startQuiz = () => {
    setScore(0);
    setQuestionCount(0);
    setScreen('quiz');
    getRandomPokemon();
  };

  
  const handleAnswer = (name) => {
    const correct = name === pokemon.name;
    setMessage(correct ? 'Correct!' : `Wrong! It was ${pokemon.name}`);
    if (correct) setScore((s) => s + 1);

    setTimeout(() => {
      handleNext(true);
    }, 1500);
  };

  const handleNext = (auto = false) => {
    setMessage('');
    if (questionCount + 1 >= totalQuestions) {
      setScreen('result');
    } else {
      setQuestionCount((c) => c + 1);
      getRandomPokemon();
    }
  };

  
  if (screen === 'start') {
    return (
      <div className="text-center p-6 mt-10">
        <h1 className="text-3xl font-bold mb-4 text-yellow-500">Pokémon Quiz</h1>
        <button
          onClick={startQuiz}
          className="bg-green-500 hover:bg-green-600 text-white px-6 py-3 rounded-lg font-bold"
        >
          Start Quiz
        </button>
      </div>
    );
  }

  // Result Screen
  if (screen === 'result') {
    return (
        
      <div className="text-center p-6 mt-10">
            <Link to="/">
                <button className="mb-4 px-4 py-2 bg-gray-200 rounded hover:bg-gray-300">
                    ← Home
                </button>
            </Link>

        <h2 className="text-2xl font-bold mb-4 text-yellow-500">Quiz Finished!</h2>
        <p className="text-xl mb-2 text-gray-50">Your Score: {score}/{totalQuestions}</p>
        <button
          onClick={startQuiz}
          className="bg-green-500 hover:bg-green-600 text-white px-6 py-2 rounded-lg mt-4"
        >
          Play Again
        </button>
      </div>
    );
  }

  // Quiz Screen
  if (!pokemon) return <p className="text-center mt-10 text-gray-50">Loading...</p>;

  return (
    <div className="max-w-xl mx-auto p-6 text-center bg-white rounded-lg shadow-lg mt-10">
        <Link to="/">
            <button className="mb-4 px-4 py-2 bg-gray-200 rounded hover:bg-gray-300">
                ← Home
            </button>
        </Link>

      <h2 className="text-xl font-bold text-green-600 mb-2">Who's that Pokémon?</h2>

      <div className="mb-4 text-sm text-gray-600">Time Left: <strong>{timer}s</strong></div>
      <img
        src={pokemon.sprites.front_default}
        alt="pokemon"
        className="w-48 h-48 mx-auto mb-6"
      />

      <div className="grid grid-cols-2 gap-4">
        {options.map((name) => (
          <button
            key={name}
            onClick={() => handleAnswer(name)}
            className="bg-yellow-300 px-4 py-2 rounded hover:bg-yellow-400 capitalize font-bold"
          >
            {name}
          </button>
        ))}
      </div>

      <p className="mt-4 font-semibold text-lg">{message}</p>
      <p className="mt-2 text-sm text-gray-500">Score: {score}</p>
    </div>
  );
}

export default Quiz;
