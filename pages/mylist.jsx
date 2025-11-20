import React, { useState, useEffect } from 'react';
import { getMyList, fetchMovies, fetchWebSeries, removeFromList } from '../src/api';

export default function MyList() {
  const [list, setList] = useState([]);
  const [moviesData, setMoviesData] = useState([]);
  const [webseriesData, setWebseriesData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        const [listData, movies, series] = await Promise.all([getMyList(), fetchMovies(), fetchWebSeries()]);
        setList(listData);
        setMoviesData(movies);
        setWebseriesData(series);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  if (loading) return <div>Loading your list...</div>;
  if (error) return <div>Error: {error}</div>;

  const movies = list.filter(item => item.item_type === 'movie');
  const webseries = list.filter(item => item.item_type === 'webseries');

  return (
    <div style={{
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,padding: '20px', background: 'linear-gradient(135deg, #1e40af 0%, #3b82f6 100%)', minHeight: '100vh', color: 'white' }}>
      <h1 style={{ textAlign: 'center', marginBottom: '20px' }}>My List</h1>
      {list.length === 0 ? (
        <p style={{ textAlign: 'center' }}>Your list is empty. Add some movies or web series!</p>
      ) : (
        <>
          <h2 style={{ marginTop: '20px' }}>Movies</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '20px' }}>
            {movies.map((movie) => {
              const movieData = moviesData.find(m => m.title === movie.item_id);
              return (
                <div key={`movie-${movie.item_id}`} style={{
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
                  <h3>{movie.item_id}</h3>
                  <p>Genre: {movieData?.genre || 'N/A'}</p>
                  <p>Year: {movieData?.year || 'N/A'}</p>
                  <p>Rating: {movieData?.rating || 'N/A'}</p>
                  <button
                    onClick={async (e) => {
                      e.stopPropagation();
                      try {
                        await removeFromList(movie.item_type, movie.item_id);
                        const newList = await getMyList();
                        setList(newList);
                        alert('Removed from MyList');
                      } catch (err) {
                        alert('Error removing from MyList: ' + err.message);
                      }
                    }}
                    style={{
                      marginTop: '10px',
                      background: 'red',
                      border: 'none',
                      borderRadius: '4px',
                      color: 'white',
                      padding: '5px 10px',
                      cursor: 'pointer',
                      fontSize: '14px'
                    }}
                  >
                    Remove
                  </button>
                </div>
              );
            })}
        </div>
        <h2 style={{ marginTop: '40px' }}>Web Series</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '20px' }}>
          {webseries.map((series) => {
            const seriesData = webseriesData.find(s => s.series_title === series.item_id);
            return (
              <div key={`webseries-${series.item_id}`} style={{
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
                <h3>{series.item_id}</h3>
                <p>Genre: {seriesData?.genre || 'N/A'}</p>
                <p>Year: {seriesData?.year_released || 'N/A'}</p>
                <p>Rating: {seriesData?.imdb_rating || 'N/A'}</p>
                <p>Seasons: {seriesData?.no_of_seasons || 'N/A'}</p>
                <button
                  onClick={async (e) => {
                    e.stopPropagation();
                      try {
                        await removeFromList(series.item_type, series.item_id);
                        const newList = await getMyList();
                        setList(newList);
                        alert('Removed from MyList');
                      } catch (err) {
                        alert('Error removing from MyList: ' + err.message);
                      }
                  }}
                  style={{
                    marginTop: '10px',
                    background: 'red',
                    border: 'none',
                    borderRadius: '4px',
                    color: 'white',
                    padding: '5px 10px',
                    cursor: 'pointer',
                    fontSize: '14px'
                  }}
                >
                  Remove
                </button>
              </div>
            );
          })}
        </div>
        </>
      )}
    </div>
  );
}
