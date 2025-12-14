import { useEffect, useState } from "react";
import MovieCard from "../components/MovieCard";
import { useAuth } from "../contexts/AuthContext.js";
import axios from "axios";
import { useLocation } from "react-router-dom";

export default function Favorites() {
    const [favoriteMovieIDs, setFavoriteMovieIDs] = useState([]);
    const [favoriteMovies, setFavoriteMovies] = useState([]);
    const { user, accessToken, loading } = useAuth();
    const [copied, setCopied] = useState(false);

    const location = useLocation();
    const params = new URLSearchParams(location.search);
    const shareToken = params.get("t");

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

    const handleCopyLink = async () => {
        if (!user) return;
        console.log(user);
        const shareLink = user?.shareToken ? `${window.location.origin}/favorites?t=${user.shareToken}` : null;

        try {
            await navigator.clipboard.writeText(shareLink);
            setCopied(true);
            console.log("Link copied to clipboard:", shareLink);
            setTimeout(() => setCopied(false), 2000);
        } catch (err) {
            console.error("Failed to copy link:", err);
        }
    };

    async function getFavorites() {
        if (shareToken) {
            try {
                const response = await axios.get(
                    `${process.env.REACT_APP_API_URL}favorites/public/${shareToken}`
                );

                const ids = Array.isArray(response.data) ? response.data : [];
                setFavoriteMovieIDs(ids);
            } catch (err) {
                console.error("There was an error fetching public favorites", err);
            }
            return;
        }

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

    useEffect(() => {
        if (loading) return;

        
        if (shareToken) {
            getFavorites();
            return;
        }

        
        if (user && accessToken) {
            getFavorites();
        }
    }, [loading, user, accessToken, shareToken]);

    return (
        <div className="container">
            <h1>Suosikit</h1>
            {user && (
                <div className="share-link-container" style={{ marginBottom: "1rem" }}>
                    <button onClick={handleCopyLink} className="btn btn-primary">
                        {copied ? "Link copied!" : "Copy shareable link"}
                    </button>
                </div>
            )}

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
