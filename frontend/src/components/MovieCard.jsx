import React from "react";
import "./MovieCard.css";

const MovieCard = ({ movie }) => {
  return (
    <div className="movie-card">
      <img className="poster" src={movie.poster} alt={movie.title} />
      <div className="info">
        <h2>{movie.title}</h2>
        <p className="year">{movie.year}</p>
        <p className="rating">⭐ {movie.rating}/10</p>
      </div>
    </div>
  );
};

export default MovieCard;
