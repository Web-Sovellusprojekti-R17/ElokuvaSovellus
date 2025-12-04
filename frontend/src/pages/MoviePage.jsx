import "./MoviePage.css";
import Navbar from "../components/NavBar";
import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import { useAuth, accessToken } from "../contexts/AuthContext.js";
import { IoBookmarks, IoBookmarksOutline } from "react-icons/io5";
import ReviewCard from "../components/ReviewCard";

export default function MoviePage() {
    const { id } = useParams();
    const [movie, setMovie] = useState(null);
    const { user, accessToken } = useAuth();

    const renderStars = (rating) => {
        const stars = Math.round(rating / 2);
        return "★".repeat(stars) + "☆".repeat(5 - stars);
    };

    const [cast, setCast] = useState([]);
    const [visibleCount, setVisibleCount] = useState(8);
    const [reviews, setReviews] = useState([]);
    const [reviewInput, setReviewInput] = useState('');
    const [userStars, setUserStars] = useState(1);
    const [isFavorite, setIsFavorite] = useState(false);

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
    }

    async function fetchReviews() {
        axios.get(`http://localhost:3001/review/movie/${id}`)
            .then((response) => {
                console.log(response);
                setReviews(Array.isArray(response.data) ? response.data : []);

            })
            .catch((err) => {
                console.error('There was an error fetching users', err)
            })
    }

    useEffect(() => {
        fetchMovie();
        fetchReviews();
    }, [id]);

    const toggleFavorite = async () => {
        try {
            const response = await fetch("http://localhost:3001/api/favorites", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${localStorage.getItem("accessToken")}`
                },
                body: JSON.stringify({ movie_id: id }),
            });

            const data = await response.json();
            setIsFavorite(data.isFavorite);

        } catch (error) {
            console.error("Favorite toggle failed:", error);
        }

    }

    function handleSendButton() {
        axios.post(`${process.env.REACT_APP_API_URL}review/`,
            new URLSearchParams({
                movie_ID: id,
                user_ID: user.id,
                review: reviewInput,
                rating: userStars
            }),
            {
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded",
                    "Authorization": `Bearer ${accessToken}`
                },
                withCredentials: true
            }
        ).then(() => {
            console.log("post created succesfully!");
            window.location.reload();
        }).catch((err) => {
            console.error('There was an error fetching users', err);
        })

    }

    if (!movie) return <p>Elokuvaa ladataan...</p>;
    if (!user) return <p>Arvosteluja ladataan...</p>;

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
                        <button className="fav-btn" onClick={toggleFavorite}>
                            {isFavorite ? <IoBookmarks size={28} /> : <IoBookmarksOutline size={28} />}
                        </button>
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
                    {Array.isArray(reviews) && reviews.length > 0 ? (
                        reviews.map((review) => (
                            <ReviewCard key={review.review_id} review={review} />
                        ))
                    ) : (
                        <p>Ei arvosteluja vielä.</p>
                    )}
                </div>

                <div className="user-review">
                    {user ? <h2>Write a review and give a rating for this movie!</h2> : <h2>Sign in to give a rating for this movie!</h2> }
                    {user && (
                        <>
                            <div className="input-and-label">
                                <textarea className="user-review-input" value={reviewInput} onChange={e => setReviewInput(e.target.value)} /><label className="char-label">Char: {reviewInput.length}</label>
                            </div>
                            <div className="user-review-star-container">
                                <button className="user-review-star" style={{ color: userStars >= 1 ? "gold" : "black" }} onClick={() => setUserStars(1)}>★</button>
                                <button className="user-review-star" style={{ color: userStars >= 2 ? "gold" : "black" }} onClick={() => setUserStars(2)}>★</button>
                                <button className="user-review-star" style={{ color: userStars >= 3 ? "gold" : "black" }} onClick={() => setUserStars(3)}>★</button>
                                <button className="user-review-star" style={{ color: userStars >= 4 ? "gold" : "black" }} onClick={() => setUserStars(4)}>★</button>
                                <button className="user-review-star" style={{ color: userStars >= 5 ? "gold" : "black" }} onClick={() => setUserStars(5)}>★</button>
                            </div>
                            <button className="send-review-button" onClick={() => handleSendButton()}>Send</button>
                        </>
                    )}

                    

                </div>


            </div>
        </>
    );
}