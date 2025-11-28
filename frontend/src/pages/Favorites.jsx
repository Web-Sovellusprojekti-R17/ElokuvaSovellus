import { useEffect, useState } from "react";
import MovieCard from "../components/MovieCard";


export default function Favorites() {
    const [favoriteMovies, setFavoriteMovies] = useState([]);

    useEffect(() => {
        const favIds = JSON.parse(localStorage.getItem("favorites")) || [];

        Promise.all(
            favIds.map(id =>
                fetch(`https://api.themoviedb.org/3/movie/${id}?api_key=${process.env.REACT_APP_TMDB_API_KEY}`)
                    .then(res => res.ok ? res.json() : null)
            )
        ).then(data => {
            setFavoriteMovies(data.filter(movie => movie));
        });
    }, []);

    return (
        <div className="container">
            <h1>Suosikit</h1>

            <div className="movies-container">
                {favoriteMovies.length > 0 ? (
                    favoriteMovies.map(movie => (
                        <MovieCard key={movie.id} media={movie} />
                    ))
                ) : (
                    <p>Ei suosikkeja vielä.</p>
                )}
            </div>
        </div>
    );
}