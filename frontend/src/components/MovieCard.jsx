import React from "react";
import "./MovieCard.css";

//const url = `https://api.themoviedb.org/3/movie/11?api_key=${REACT_APP_TMDB_LUKUOIKEUDEN_TUNNUS}`
// Näyttää tällä hetkellä tmdb:n käyttäjien keskiarvoa, pitää näyttää omien käyttäjien keskiarvo 

const MovieCard = ({ movie }) => {
  return (
    <div className="movie-card">
      <img className="poster" src={`https://image.tmdb.org/t/p/w154${movie.poster_path}`} alt={movie.title} />
      <div className="info">
        <h2>{movie.title}</h2>
        <p className="year">({movie.release_date.substr(0,4)})</p>
        <p className="rating">⭐ {movie.vote_average.toFixed(1)}/10</p>
      </div>
    </div>
  );
};

export default MovieCard;
