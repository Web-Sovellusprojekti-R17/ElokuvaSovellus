import React, { useEffect, useState } from "react";
import "./MovieCard.css";

const MovieCard = () => {
  const [movie, setMovie] = useState(null);

  useEffect(() => {
    async function fetchMovie() {
      try {
        const url = `https://api.themoviedb.org/3/movie/11?api_key=${process.env.REACT_APP_TMDB_API_KEY}`;
        const res = await fetch(url);
        if (!res.ok) throw new Error("Network error");
        const data = await res.json();
        setMovie(data);
      } catch (err) {
        console.error("Error fetching movie:", err);
      }
    }

    fetchMovie();
  }, []);

  if (!movie) return <p>Loading...</p>;

  return (
     <div className="movie-card">
      <img className="poster" src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`} alt={movie.title} />
      <div className="info">
        <h2>{movie.title}</h2>
        <p className="year">{movie.year}</p>
        <p className="rating">⭐ {movie.rating}/10</p>
      </div>
    </div>
  );
};

export default MovieCard;