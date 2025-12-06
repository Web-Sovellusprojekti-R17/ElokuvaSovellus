import { useEffect, useState, useRef } from "react";
import { Routes, Route, useNavigate } from "react-router-dom";
import "./App.css";
import Navbar from "./components/NavBar";
import Haku from "./Haku";
import MoviePage from "./pages/MoviePage";
import UserIconWithAuth from "./components/LoginButt";

import UserSettings from "./pages/UserSettings";
import RemoveSettings from "./pages/RemoveSettings";
import PasswordSettings from "./pages/PasswordSettings";
import Footer from "./components/Footer";
//^tää valitti sitä UserIconWithAuth nii vaihoin tuohon ton /LoginButt

function App() {
  const [movies, setMovies] = useState([]);
  const [favoriteMovies, setFavoriteMovies] = useState([]);
  const [loading, setLoading] = useState(true);

  const containerRef = useRef();

  const apiUrl = `https://api.themoviedb.org/3/movie/now_playing?api_key=${process.env.REACT_APP_TMDB_API_KEY}&language=en-US&page=1`;
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

  useEffect(() => {
    fetchMovies();
  }, []);

  function MovieCard({ media }) {
    const { title, name, backdrop_path } = media;

    const navigate = useNavigate();

    const showMoviePage = () => {
      navigate(`/movies/${media.id}`);
    };

    return (
      <div className="movie_item" onClick={showMoviePage}>
        <img
          src={`https://image.tmdb.org/t/p/w500/${backdrop_path}`}
          className="movie_img"
          alt={title || name}
        />
        <div className="title">{title || name}</div>
      </div>
    );
  }


  return (
    <>

      <div className="app">
        {loading ? (
          <p>Ladataan elokuvia...</p>
        ) : (
          <Routes>
            <Route path="/" element={
              <div className="container">
                {favoriteMovies.length > 0 && (
                  <>
                    <h1>Suosikkisi</h1>
                    <div className="movies-container">
                      {favoriteMovies.map((movie) => (
                        <div className="movie" key={movie.id}>
                          <MovieCard media={movie} />
                        </div>
                      ))}
                    </div>
                  </>
                )}
                <h1>Nyt elokuvateatterissa</h1>
                <div
                  ref={containerRef}
                  style={{
                    width: "1400px",
                    overflowX: "scroll",
                    scrollBehavior: "smooth",
                  }}
                >
                  <div className="movies-container">
                    {movies.map((movie) => (
                      <div className="movie" key={movie.id} >
                        <MovieCard media={movie} />
                      </div>
                    ))}
                  </div>
                </div>

              </div>
            } />
            <Route path="/movie/template" element={<MoviePage />} />
            <Route path="/movies" element={<Haku />} />
            <Route path="/about" element={<h1>About Page</h1>} />
            <Route path="/settings" element={<UserSettings />} />
            <Route path="/settings/remove" element={<RemoveSettings />} />
            <Route path="/settings/password" element={<PasswordSettings />} />
          </Routes>

        )}
      </div>
    </>
  );

}


export default App;
