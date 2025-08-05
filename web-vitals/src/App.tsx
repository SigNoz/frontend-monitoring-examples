import { useState, useEffect, useCallback } from 'react';
import './App.css';

interface Pokemon {
  id: number;
  name: string;
  height: number;
  weight: number;
  types: Array<{ type: { name: string } }>;
  stats: Array<{ base_stat: number; stat: { name: string } }>;
  sprites: {
    front_default: string;
    front_shiny: string;
  };
  abilities: Array<{ ability: { name: string }; is_hidden: boolean }>;
}

function App() {
  const [pokemon, setPokemon] = useState<Pokemon[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [imageLoading, setImageLoading] = useState(true);
  const [showShiny, setShowShiny] = useState(false);

  const fetchPokemon = useCallback(
    async (startId: number, count: number = 20) => {
      try {
        const promises = Array.from({ length: count }, (_, i) =>
          fetch(`https://pokeapi.co/api/v2/pokemon/${startId + i}`).then(
            res => {
              if (!res.ok)
                throw new Error(`Failed to fetch Pokemon ${startId + i}`);
              return res.json();
            }
          )
        );

        const results = await Promise.all(promises);
        setPokemon(results);
        setError(null);
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : 'Unknown error';
        setError(errorMessage);
      } finally {
        setLoading(false);
      }
    },
    []
  );

  useEffect(() => {
    fetchPokemon(1);
  }, [fetchPokemon]);

  const handlePrevious = useCallback(() => {
    setCurrentIndex(prev => {
      return prev === 0 ? pokemon.length - 1 : prev - 1;
    });
    setImageLoading(true);
  }, [pokemon.length]);

  const handleNext = useCallback(() => {
    setCurrentIndex(prev => {
      return prev === pokemon.length - 1 ? 0 : prev + 1;
    });
    setImageLoading(true);
  }, [pokemon.length]);

  const handleImageLoad = useCallback(() => {
    setImageLoading(false);
  }, []);

  const handleShinyToggle = useCallback(() => {
    setShowShiny(prev => !prev);
    setImageLoading(true);
  }, []);

  const handleRefresh = useCallback(() => {
    setLoading(true);
    setCurrentIndex(0);
    setShowShiny(false);
    fetchPokemon(1);
  }, [fetchPokemon]);

  if (loading) {
    return (
      <div className='app'>
        <div className='loading-container'>
          <div className='loading-spinner'></div>
          <h2>Loading Pokemon...</h2>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className='app'>
        <div className='error-container'>
          <h2>Error loading Pokemon</h2>
          <p>{error}</p>
          <button onClick={handleRefresh} className='refresh-btn'>
            Try Again
          </button>
        </div>
      </div>
    );
  }

  const currentPokemon = pokemon[currentIndex];

  return (
    <div className='app'>
      <header className='header'>
        <h1>Pokemon Carousel</h1>
        <p>Web Vitals Demo App</p>
      </header>

      <main className='carousel-container'>
        <div className='carousel'>
          <button
            className='nav-btn prev-btn'
            onClick={handlePrevious}
            aria-label='Previous Pokemon'>
            ←
          </button>

          <div className='pokemon-card'>
            <div className='pokemon-header'>
              <h2 className='pokemon-name'>
                {currentPokemon.name.charAt(0).toUpperCase() +
                  currentPokemon.name.slice(1)}
              </h2>
              <span className='pokemon-id'>#{currentPokemon.id}</span>
            </div>

            <div className='image-container'>
              {imageLoading && <div className='image-skeleton'></div>}
              <img
                src={
                  showShiny
                    ? currentPokemon.sprites.front_shiny
                    : currentPokemon.sprites.front_default
                }
                alt={`${currentPokemon.name} ${showShiny ? 'shiny' : 'normal'}`}
                className={`pokemon-image ${
                  imageLoading ? 'loading' : 'loaded'
                }`}
                onLoad={handleImageLoad}
                onError={() => setImageLoading(false)}
              />
            </div>

            <div className='pokemon-controls'>
              <button
                className={`shiny-btn ${showShiny ? 'active' : ''}`}
                onClick={handleShinyToggle}>
                {showShiny ? '★ Shiny' : '☆ Normal'}
              </button>
            </div>

            <div className='pokemon-info'>
              <div className='info-grid'>
                <div className='info-item'>
                  <span className='label'>Height:</span>
                  <span className='value'>{currentPokemon.height / 10}m</span>
                </div>
                <div className='info-item'>
                  <span className='label'>Weight:</span>
                  <span className='value'>{currentPokemon.weight / 10}kg</span>
                </div>
                <div className='info-item'>
                  <span className='label'>Types:</span>
                  <span className='value'>
                    {currentPokemon.types.map(t => t.type.name).join(', ')}
                  </span>
                </div>
              </div>

              <div className='stats-section'>
                <h3>Base Stats</h3>
                <div className='stats-grid'>
                  {currentPokemon.stats.map(stat => (
                    <div key={stat.stat.name} className='stat-item'>
                      <span className='stat-name'>
                        {stat.stat.name.replace('-', ' ')}
                      </span>
                      <div className='stat-bar'>
                        <div
                          className='stat-fill'
                          style={{
                            width: `${(stat.base_stat / 255) * 100}%`,
                          }}></div>
                      </div>
                      <span className='stat-value'>{stat.base_stat}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className='abilities-section'>
                <h3>Abilities</h3>
                <div className='abilities-list'>
                  {currentPokemon.abilities.map(ability => (
                    <span
                      key={ability.ability.name}
                      className={`ability ${
                        ability.is_hidden ? 'hidden' : ''
                      }`}>
                      {ability.ability.name.replace('-', ' ')}
                      {ability.is_hidden && ' (Hidden)'}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <button
            className='nav-btn next-btn'
            onClick={handleNext}
            aria-label='Next Pokemon'>
            →
          </button>
        </div>

        <div className='carousel-indicators'>
          <span className='indicator-text'>
            {currentIndex + 1} of {pokemon.length}
          </span>
          <div className='indicator-dots'>
            {pokemon.map((_, index) => (
              <button
                key={index}
                className={`indicator-dot ${
                  index === currentIndex ? 'active' : ''
                }`}
                onClick={() => setCurrentIndex(index)}
                aria-label={`Go to Pokemon ${index + 1}`}
              />
            ))}
          </div>
        </div>
      </main>

      <footer className='footer'>
        <p>
          Data from{' '}
          <a
            href='https://pokeapi.co/'
            target='_blank'
            rel='noopener noreferrer'>
            PokeAPI
          </a>
        </p>
        <button onClick={handleRefresh} className='refresh-btn'>
          Refresh Pokemon
        </button>
      </footer>
    </div>
  );
}

export default App;
