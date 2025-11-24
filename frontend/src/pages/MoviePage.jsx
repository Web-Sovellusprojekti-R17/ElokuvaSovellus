import "./MoviePage.css";
import Navbar from "../components/NavBar";
import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";


export default function MoviePage() {
    const { id } = useParams();
    const [movie, setMovie] = useState(null);

    const renderStars = (rating) => {
        const stars = Math.round(rating / 2);
        return "★".repeat(stars) + "☆".repeat(5 - stars);
    };

    const [cast, setCast] = useState([]);
    const [visibleCount, setVisibleCount] = useState(8);
    const [reviews, setReviews] = useState([]);

    useEffect(() => {
        async function fetchMovie() {
            try {
                const response = await fetch(
                    `https://api.themoviedb.org/3/movie/${id}?api_key=${process.env.REACT_APP_TMDB_API_KEY}&language=fi-FI`
                );
                const data = await response.json();
                setMovie(data);


                const castResponse = await fetch(
                    `https://api.themoviedb.org/3/movie/${id}/credits?api_key=${process.env.REACT_APP_TMDB_API_KEY}`
                );
                const castData = await castResponse.json();
                setCast(castData.cast.slice(0, 10));
            } catch (error) {
                console.error("Error loading movie:", error);
            }

            //arvostelujen fetch
            //const reviewResponse = await fetch(
            //   `https://api.themoviedb.org/3/movie/${id}/reviews?api_key=${process.env.REACT_APP_TMDB_API_KEY}`
            // );
            //const reviewData = await reviewResponse.json();
            //setReviews(reviewData.results);
        }



        fetchMovie();
    }, [id]);


    if (!movie) return <p>Elokuvaa ladataan...</p>;

    return (
        <>
            <div className="movie-container">
                <div className="movie-header">
                    <img
                        className="movie-poster"
                        src={
                            movie.poster_path
                                ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
                                : "/images/image_placeholder.svg"
                        }
                        alt={movie.title}
                    />

                    <div className="movie-info">
                        <h1>{movie.title}</h1>
                        <p className="stars">{renderStars(movie.vote_average)}</p>
                        <p><strong>Vuosi: </strong>{movie.release_date?.substr(0, 4)}</p>
                        <p><strong>Kesto:</strong> {movie.runtime} min</p>
                        <p><strong>Kielet:</strong> {movie.spoken_languages?.map(lang => lang.english_name).join(", ")}</p>

                        <div className="genre-container">
                            {movie.genres?.map((g) => (
                                <span className="genre-tag" key={g.id}>{g.name}</span>
                            ))}
                        </div>

                        <p><strong>Lisätietoja:</strong> {movie.overview}</p>
                    </div>
                </div>

                <h2>Näyttelijät</h2>

                <div className="actor-grid">
                    {cast.slice(0, visibleCount).map((actor) => (
                        <div key={actor.id} className="actor-card">
                            <img
                                src={
                                    actor.profile_path
                                        ? `https://image.tmdb.org/t/p/w185${actor.profile_path}`
                                        : "/images/image_placeholder.svg"
                                }
                                alt={actor.name}
                            />
                            <p><strong>{actor.name}</strong></p>
                            <p>{actor.character || "Tuntematon"}</p>
                        </div>
                    ))}
                </div>

                {cast.length > 8 && (
                    <button
                        className="show-more-btn"
                        onClick={() =>
                            setVisibleCount(visibleCount === 8 ? cast.length : 8)
                        }
                    >
                        {visibleCount === 8 ? "Näytä lisää" : "Näytä vähemmän"}
                    </button>
                )}


                <h2>Arvostelut</h2>

                <div className="review-section">
                    {reviews.length === 0 ? (
                        <p>Ei arvosteluja vielä.</p>
                    ) : (
                        reviews.map((review) => (
                            <div className="review-card" key={review.id}>
                                <h4>{review.author}</h4>
                                <p className="stars">{renderStars(review.author_details?.rating || 0)}</p>
                                <p>{review.content}</p>
                            </div>
                        ))
                    )}
                </div>

            </div>
        </>
    );
}