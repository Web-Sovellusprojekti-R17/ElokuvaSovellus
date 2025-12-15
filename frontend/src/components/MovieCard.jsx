import { useNavigate } from "react-router-dom";
import "./MovieCard.css";


const MovieCard = ({ movie }) => {
  const navigate = useNavigate();
  
  const showMoviePage = () => {
    navigate(`/movies/${movie.id}`);
  };
  
  return (
    <div className="movie-card" key={movie.id} onClick={showMoviePage}>
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