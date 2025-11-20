import { useEffect, useState,useRef } from "react";
import "./App.css";
import UserIconWithAuth from './components/LoginButt.jsx'


function App() {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);


  const containerRef = useRef();

  const apiUrl = `https://api.themoviedb.org/3/movie/now_playing?api_key=${process.env.REACT_APP_API_KEY}&language=en-US&page=1`;


  useEffect(() => {
    async function fetchMovies() {
      try {
        const res = await fetch(apiUrl);
        if (!res.ok) throw new Error("Verkkovirhe");
        const data = await res.json();
        setMovies(data.results);
      } catch (err) {
        console.error("Virhe haettaessa elokuvia:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchMovies();
  }, []);

  function MovieCard({media}) {
    const {title,name,backdrop_path} = media;

    return(
      <div className="movie_item">
      <img
      src={`https://image.tmdb.org/t/p/w500/${backdrop_path}`}
      className="movie_img"
      alt={title||name}
      />
      <div className = "title">{title || name}</div>
    </div>
    );
  }

  if (loading) return <p>Ladataan elokuvia...</p>;

  return (
    <div className="container">
       <UserIconWithAuth/>
      <h1>Nyt elokuvateatterissa</h1>
      <div ref ={containerRef}
      style={{
        width: "1400px",
        overflowX: "scroll",
        scrollBehavior: "smooth",
      }}>
      <div className="movies-container">
        {movies.map((movie)=>(
          <div className="movie">
          <MovieCard key={movie.id} media = {movie}/>
          </div>
        ))}
      </div>
      </div>
    </div>

  );
}

export default App;
