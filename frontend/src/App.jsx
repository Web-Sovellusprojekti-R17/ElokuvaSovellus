import { useEffect, useState, useRef } from "react";
import { Routes, Route, useNavigate, Link } from "react-router-dom";
import "./App.css";
import Haku from "./Haku";
import MoviePage from "./pages/MoviePage";
import UserSettings from "./pages/UserSettings";
import RemoveSettings from "./pages/RemoveSettings";
import PasswordSettings from "./pages/PasswordSettings";
import { useAuth } from "./contexts/AuthContext.js";

function App() {
  const [movies, setMovies] = useState([]);
  const [upcomingMovies, setUpcomingMovies] = useState([]);
  const [favoriteMovieIDs, setFavoriteMovieIDs] = useState([]);
  const [favoriteMovies, setFavoriteMovies] = useState([]);
  const { user, accessToken} = useAuth();
  const [loading, setLoading] = useState(true);

  const containerRef = useRef();

  const apiUrl = `https://api.themoviedb.org/3/movie/now_playing?api_key=${process.env.REACT_APP_TMDB_API_KEY}&language=en-US&page=1`;
  const apiUrlUpcoming = `https://api.themoviedb.org/3/movie/top_rated?api_key=${process.env.REACT_APP_TMDB_API_KEY}&language=en-US&page=1`;
  async function fetchMovies() {
    try {
      const res = await fetch(apiUrl);
      if (!res.ok) throw new Error("Network error");
      const data = await res.json();
      setMovies(data.results);

      const res2 = await fetch(apiUrlUpcoming);
      if (!res2.ok) throw new Error("Network error");
      const data2 = await res2.json();
      setUpcomingMovies(data2.results);
    } catch (err) {
      console.error("Error fetching movies:", err);
    } finally {
      setLoading(false);
    }

  }

async function fetchFavorites() {
   if (!user) return;
  try {
    const response = await fetch(
      `${process.env.REACT_APP_API_URL}favorites/${user.id}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
          "Authorization": `Bearer ${accessToken}`,
        },
        credentials: "include",
      }
    );

    if (!response.ok) {
      throw new Error(`error status: ${response.status}`);
    }

    const data = await response.json();
    const ids = Array.isArray(data) ? data.slice(0, 8) : [];

    setFavoriteMovieIDs(ids);
  } catch (err) {
    console.error("There was an error fetching favorites", err);
  }
}

async function fetchMovieDetails(movieID) {
  try {
    const response = await fetch(
      `https://api.themoviedb.org/3/movie/${movieID}?api_key=${process.env.REACT_APP_TMDB_API_KEY}&language=en-US`
    );

    if (!response.ok) {
      throw new Error(`error status: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error(`Error fetching details for movie ID ${movieID}:`, error);
    return null;
  }
}

  useEffect(() => {
    fetchMovies();
    
    if (user && accessToken) {
    fetchFavorites();
  }
  }, [user,accessToken]);

  useEffect(() => {
        if (favoriteMovieIDs.length === 0) {
            setFavoriteMovies([]);
            return;
        }

        async function loadMovies() {
            const movies = await Promise.all(
                favoriteMovieIDs.map((id) => fetchMovieDetails(id))
            );

            setFavoriteMovies(movies.filter(Boolean));
        }

        loadMovies();
    }, [favoriteMovieIDs]);

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
            tabIndex={0}
        />
        <div className="title">{title || name}</div>
      </div>
    );
  }


  return (
  <>
  <div className="app">
    {loading ? (
      <p>Loading movies...</p>
    ) : (
      <Routes>
        <Route path="/" element={
          <div className="container">
            <h1>Now in theaters</h1>
            <div ref={containerRef} className="scroll-container">
              <div className="movies-container">
                {movies.map((movie) => (
                  <div className="movie" key={movie.id} >
                    <MovieCard media={movie} />
                  </div>
                ))}
              </div>
            </div>
            <h1>Top rated</h1>
            <div ref={containerRef} className="scroll-container">
              <div className="movies-container">
                {upcomingMovies.map((movie) => (
                  <div className="movie" key={movie.id} >
                    <MovieCard media={movie} />
                  </div>
                ))}
              </div>
            </div>
            <div className="your-favorites-top" style={{display: user && favoriteMovies.length>0 ? "block" : "none"}}>
            <h1 >Your favorites</h1> <Link to="/favorites" className="nav-link">See more</Link>
            </div>
            <div ref={containerRef} className="scroll-container" style={{display: user && favoriteMovies.length>0 ? "block" : "none"}}>
              <div  className="movies-container">
                {favoriteMovies.map((movie) => (
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
        <Route path="/about" element={<h1>About page</h1>} />
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
