
import { useEffect, useState } from "react";
import './App.css'
import MovieCard from './components/MovieCard.jsx'

function App() {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);

const url = process.env.REACT_APP_API_URL || 'http://localhost:3001';

  useEffect(() => {
    async function fetchMovies() {
      try {
        const res = await fetch(`${url}/movies`);
        if (!res.ok) throw new Error("Verkkovirhe");
        const data = await res.json();
        setMovies(data);
      } catch (err) {
        console.error("Virhe haettaessa elokuvia:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchMovies();
  }, []);

  if (loading) return <p>Ladataan elokuvia...</p>;

  return (
    <div style={{ maxWidth: 600, margin: "2rem auto", fontFamily: "sans-serif" }}>
      <h1>Minun Elokuvat tietokannassa</h1>
      {movies.length === 0 ? (
        <p>Ei elokuvia löytynyt.</p>
      ) : (
        <table border="1">
          <thead>
            <tr>
              <th>Name</th>
              <th>Author</th>
              <th>ISBN</th>
            </tr>
          </thead>
          <tbody>
            {movies.map((movie) => (
              <tr key={movie.id}>
                <td>{movie.name}</td>
                <td>{movie.director}</td>
                <td>{movie.year}</td>
              </tr>
            ))}
          </tbody>
        </table>

      )}
    </div>
  );
}

export default App;
