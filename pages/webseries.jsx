import React, { useState, useEffect } from 'react';
import { fetchWebSeries, addToList, getMyList } from '../src/api';

export default function WebSeries() {
  const [webseries, setWebseries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [addedSeries, setAddedSeries] = useState(new Set());
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const loadData = async () => {
      try {
        const seriesData = await fetchWebSeries();
        setWebseries(seriesData);
      } catch (err) {
        setError(err.message);
        setLoading(false);
        return;
      }
      try {
        const myListData = await getMyList();
        const myListSeries = myListData.filter(item => item.item_type === 'webseries').map(item => item.item_id);
        setAddedSeries(new Set(myListSeries));
      } catch (err) {
        // If not logged in, leave addedSeries empty
      }
      setLoading(false);
    };
    loadData();
  }, []);

  if (loading) return <div>Loading web series...</div>;
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
      <h1 style={{ textAlign: 'center', marginBottom: '20px' }}>Web Series</h1>
      <input
        type="text"
        placeholder="Search web series..."
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
        {webseries.filter(series => series.series_title.toLowerCase().includes(searchTerm.toLowerCase())).map((series) => (
          <div key={series.series_title} style={{
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
            <h3>{series.series_title}</h3>
            <p>Genre: {series.genre}</p>
            <p>Year: {series.year_released}</p>
            <p>Rating: {series.imdb_rating}</p>
            <p>Seasons: {series.no_of_seasons}</p>
            <button
              onClick={async (e) => {
                e.stopPropagation();
                try {
                  await addToList('webseries', series.series_title);
                  setAddedSeries(prev => new Set(prev).add(series.series_title));
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
                cursor: addedSeries.has(series.series_title) ? 'default' : 'pointer',
                fontSize: '14px',
                pointerEvents: addedSeries.has(series.series_title) ? 'none' : 'auto'
              }}
              title="Add to MyList"
              disabled={addedSeries.has(series.series_title)}
            >
              {addedSeries.has(series.series_title) ? "ADDED" : "+"}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
