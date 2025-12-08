import { useEffect, useState } from "react";
import MovieCard from "../components/MovieCard";
import { useAuth } from "../contexts/AuthContext.js";
import axios from "axios";

export default function Favorites() {
    const [favoriteMovieIDs, setFavoriteMovieIDs] = useState([]);
    const [favoriteMovies, setFavoriteMovies] = useState([]);
    const { user, accessToken } = useAuth();

    async function fetchMovieDetails(movieID) {
        try {
            const response = await axios.get(
                `https://api.themoviedb.org/3/movie/${movieID}?api_key=${process.env.REACT_APP_TMDB_API_KEY}&language=fi-FI`
            );
            return response.data;
        } catch (error) {
            console.error(`Error fetching details for movie ID ${movieID}:`, error);
            return null;
        }
    }

    async function getFavorites() {
        if (!accessToken || !user) return;

        try {
            const response = await axios.get(
                `${process.env.REACT_APP_API_URL}favorites/${user.id}`,
                {
                    headers: {
                        "Content-Type": "application/x-www-form-urlencoded",
                        "Authorization": `Bearer ${accessToken}`,
                    },
                    withCredentials: true,
                }
            );

            const ids = Array.isArray(response.data) ? response.data : [];
            setFavoriteMovieIDs(ids);
        } catch (err) {
            console.error("There was an error fetching favorites", err);
        }
    }

    // Fetch movie details when IDs change
    useEffect(() => {
        if (favoriteMovieIDs.length === 0) {
            setFavoriteMovies([]);
            return;
        }

        async function loadMovies() {
            const movies = await Promise.all(
                favoriteMovieIDs.map((id) => fetchMovieDetails(id))
            );

            setFavoriteMovies(movies.filter(Boolean)); // remove nulls
        }

        loadMovies();
    }, [favoriteMovieIDs]);

    useEffect(() => {
        getFavorites();
    }, []);

    return (
        <div className="container">
            <h1>Suosikit</h1>

            <div className="movies-container">
                {favoriteMovies.length > 0 ? (
                    favoriteMovies.map((movie) => (
                        <MovieCard key={movie.id} movie={movie} />
                    ))
                ) : (
                    <p>Ei suosikkeja vielä.</p>
                )}
            </div>
        </div>
    );
}
