import React, { useState, useEffect } from 'react';
import { fetchMovies, addToList, getMyList } from '../src/api';

export default function Movies() {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [addedMovies, setAddedMovies] = useState(new Set());
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const loadData = async () => {
      try {
        const moviesData = await fetchMovies();
        setMovies(moviesData);
      } catch (err) {
        setError(err.message);
        setLoading(false);
        return;
      }
      try {
        const myListData = await getMyList();
        const myListMovies = myListData.filter(item => item.item_type === 'movie').map(item => item.item_id);
        setAddedMovies(new Set(myListMovies));
      } catch (err) {
        // If not logged in, leave addedMovies empty
      }
      setLoading(false);
    };
    loadData();
  }, []);

  if (loading) return <div>Loading movies...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div style={{
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      padding: '20px',
      background: 'linear-gradient(135deg, #1e40af 0%, #3b82f6 100%)',
      minHeight: '100vh',
      color: 'white'
    }}>
      <h1 style={{ textAlign: 'center', marginBottom: '20px' }}>Movies</h1>
      <input
        type="text"
        placeholder="Search movies..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        style={{
          marginBottom: '20px',
          padding: '8px',
          width: '100%',
          maxWidth: '400px',
          fontSize: '16px',
          borderRadius: '4px',
          border: '1px solid #ccc'
        }}
      />
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))',
        gap: '20px'
      }}>
        {movies.filter(movie => movie.title.toLowerCase().includes(searchTerm.toLowerCase())).map((movie) => (
          <div key={movie.rank} style={{
            background: 'rgba(255, 255, 255, 0.1)',
            borderRadius: '8px',
            padding: '15px',
            border: '1px solid rgba(255, 255, 255, 0.2)',
            transition: 'transform 0.2s',
            cursor: 'pointer',
            position: 'relative'
          }}
          onMouseEnter={(e) => e.target.style.transform = 'scale(1.05)'}
          onMouseLeave={(e) => e.target.style.transform = 'scale(1)'}
          >
            <h3>{movie.title}</h3>
            <p>Genre: {movie.genre}</p>
            <p>Year: {movie.year}</p>
            <p>Rating: {movie.rating}</p>
            <button
              onClick={async (e) => {
                e.stopPropagation();
                try {
                  await addToList('movie', movie.title);
                  setAddedMovies(prev => new Set(prev).add(movie.title));
                  alert('Added to MyList');
                } catch (err) {
                  alert('Login to add to MyList');
                }
              }}
              style={{
                position: 'absolute',
                top: '10px',
                right: '10px',
                background: 'rgba(0,0,0,0.5)',
                border: 'none',
                borderRadius: '4px',
                color: 'white',
                padding: '2px 8px',
                cursor: addedMovies.has(movie.title) ? 'default' : 'pointer',
                fontSize: '14px',
                pointerEvents: addedMovies.has(movie.title) ? 'none' : 'auto'
              }}
              title="Add to MyList"
              disabled={addedMovies.has(movie.title)}
            >
              {addedMovies.has(movie.title) ? "ADDED" : "+"}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
