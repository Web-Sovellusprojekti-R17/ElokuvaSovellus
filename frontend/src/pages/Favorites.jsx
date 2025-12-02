import { useEffect, useState } from "react";
import MovieCard from "../components/MovieCard";

export default function Favorites() {
    const [favoriteMovies, setFavoriteMovies] = useState([]);

    useEffect(() => {
        const token = localStorage.getItem("accessToken");

        fetch("http://localhost:3001/api/favorites/user", {
            headers: {
                Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
                "Content-Type": "application/json",
            },
        })
            .then(res => res.json())
            .then(data => {

                if (!Array.isArray(data)) return;

                Promise.all(
                    data.map(fav =>
                        fetch(
                            `https://api.themoviedb.org/3/movie/${fav.movie_id}?api_key=${process.env.REACT_APP_TMDB_API_KEY}&language=fi-FI`
                        ).then(res => res.json())
                    )
                ).then(movies => setFavoriteMovies(movies));
            })
            .catch(err => console.error("Error loading favorites:", err));
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
