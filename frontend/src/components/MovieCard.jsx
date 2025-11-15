import React from "react";
import "./MovieCard.css";

//const url = `https://api.themoviedb.org/3/movie/11?api_key=${REACT_APP_TMDB_LUKUOIKEUDEN_TUNNUS}`

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
