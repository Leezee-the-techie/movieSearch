// MovieSearch.js

import React, { useState, useEffect } from 'react';
import { searchMovies, getMovieDetails } from './api'; // Import API helper
import '../App.css'; // Import styles

export default function MovieSearch () {
  const [query, setQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [latestQueries, setLatestQueries] = useState([]);
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [showLatestSearches, setShowLatestSearches] = useState(false); // New state for toggle

  useEffect(() => {
    const storedQueries = JSON.parse(localStorage.getItem('latestQueries')) || [];
    setLatestQueries(storedQueries);
  }, []);

  const handleSearch = async () => {
    if (!query) return;

    const result = await searchMovies(query);
    if (result.Search) {
      setSearchResults(result.Search);
      
      // Update latest queries (keep only the last 5)
      const updatedQueries = [query, ...latestQueries.filter(q => q !== query)].slice(0, 5);
      setLatestQueries(updatedQueries);
      localStorage.setItem('latestQueries', JSON.stringify(updatedQueries));
    }
  };

  const handleSelectMovie = async (movieId) => {
    const movieDetails = await getMovieDetails(movieId);
    setSelectedMovie(movieDetails);
  };

  const toggleLatestSearches = () => {
    setShowLatestSearches(!showLatestSearches);
  };

  return (
    <div className="MovieSearch">
      <h1>Movie Search</h1>
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search for a movie..."
      />
      <button onClick={handleSearch}>Search</button>

      <button className="toggle-latest-btn" onClick={toggleLatestSearches}>
        {showLatestSearches ? 'Hide Latest Searches' : 'Show Latest Searches'}
      </button>

      
      {showLatestSearches && (
        <div>
          <h2>Latest Searches</h2>
          <ul>
            {latestQueries.map((q, index) => (
              <li key={index} onClick={() => setQuery(q)}>{q}</li>
            ))}
          </ul>
        </div>
      )}

     
      {searchResults.length > 0 && (
        <div className="search-results">
          <h2>Search Results</h2>
          <div className="movie-grid">
            {searchResults.map(movie => (
              <div key={movie.imdbID} className="movie-card" onClick={() => handleSelectMovie(movie.imdbID)}>
                <div className="poster-container">
                  <img src={movie.Poster !== "N/A" ? movie.Poster : 'default-poster.jpg'} alt={movie.Title} className="movie-poster" />
                </div>
                <div className="movie-info">
                  <h3>{movie.Title}</h3>
                  <p>{movie.Year}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      
      {selectedMovie && (
        <div className="movie-details">
          <h2>{selectedMovie.Title}</h2>
          <img src={selectedMovie.Poster} alt={selectedMovie.Title} className="movie-poster" />
          <p>{selectedMovie.Plot}</p>
          <p><strong>IMDB Rating:</strong> {selectedMovie.imdbRating}</p>
          <p><strong>Year:</strong> {selectedMovie.Year}</p>
          <p><strong>Director:</strong> {selectedMovie.Director}</p>

          <a href={`https://www.imdb.com/title/${selectedMovie.imdbID}/`} target="_blank" rel="noopener noreferrer">
            <button className="watch-movie-btn">Watch Movie</button>
          </a>
        </div>
      )}
    </div>
  );
};
