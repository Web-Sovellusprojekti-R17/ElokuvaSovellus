import "./MoviePage.css";
import Navbar from "../components/NavBar";
import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";



export default function MoviePage() {
    const { id } = useParams();
    const [movie, setMovie] = useState(null);

    const renderStars = (rating) => {
        const stars = Math.round(rating / 2);
        return "★".repeat(stars) + "☆".repeat(5 - stars);
    };

    const renderReviewStars = (rating) => {
        return "★".repeat(rating) + "☆".repeat(5 - rating);
    };

    const [cast, setCast] = useState([]);
    const [visibleCount, setVisibleCount] = useState(8);
    const [reviews, setReviews] = useState([]);
    const [reviewInput, setReviewInput] = useState('');
    const [userStars, setUserStars] = useState(1);
    const [editUserStars, setEditUserStars] = useState(1);
    const [editedReview, setEditedReview] =useState(0);
    const [editReviewInput, setEditReviewInput] = useState('');

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
        async function fetchReviews() {
            axios.get(`http://localhost:3001/review/${id}`)
                .then((response) => {
                    console.log(response);
                    setReviews(Array.isArray(response.data) ? response.data : []);

                })
                .catch((err) => {
                    console.error('There was an error fetching users', err)
                })
        }



        fetchMovie();
        fetchReviews();
    }, [id]);

    function handleSendButton(type, review_id) {
        if (type === "new") {
            const newPost = {
                movie_ID: id,
                user_ID: 1,
                review: reviewInput,
                rating: userStars
            }

            axios
                .post('http://localhost:3001/review', newPost)
                .then(() => {
                    console.log("post created succesfully!");
                    window.location.reload();
                })
                .catch((err) => {
                    console.error('There was an error fetching users', err);
                })
        } else if (type === "edit") {
            const newPut = {

                review: editReviewInput,
                rating: editUserStars
            }

            axios
                .put(`http://localhost:3001/review/${review_id}`, newPut)
                .then(() => {
                    console.log("review updated succesfully!");
                    window.location.reload();
                })
                .catch((err) => {
                    console.error('There was an error updating review', err);
                })
        }
    }

    function handleRemoveButton(id) {
        axios.delete(`http://localhost:3001/review/${id}`)
            .then(() => {
                console.log("review deleted succesfully!");
                window.location.reload();
            })
            .catch((err) => {
                console.error('There was an error deleting review', err);
            })

    }

    function handleEditButton(id) {
        setEditedReview(id);
    }

    if (!movie) return <p>Elokuvaa ladataan...</p>;

    return (
        <>
            <Navbar />
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


                    {Array.isArray(reviews) && reviews.length > 0 ? (
                        reviews.map((review) => (
                            <div className="review-card" key={review.review_id}>
                                <h4>User id:{review.user_id} Review id: {review.review_id}</h4>
                                <p className="stars">{renderReviewStars(review.rating)}</p>
                                <p>{review.review}</p>
                                <div className="review-buttons">
                                    <button className="review-edit-button" style={{ display: review.user_id === 1 && editedReview != review.review_id ? "block" : "none" }} onClick={() => handleEditButton(review.review_id)}>Edit</button><button className="review-edit-button" style={{ display: review.user_id === 1 && editedReview != review.review_id ? "block" : "none" }} onClick={() => handleRemoveButton(review.review_id)}>Delete</button>
                                </div>
                                <div className="editing-screen" style={{ display: editedReview === review.review_id ? "block" : "none" }}>
                                    <textarea className="edit-review-input" value={editReviewInput} onChange={e => setEditReviewInput(e.target.value)} />
                                    <div className="user-review-star-container">
                                        <button className="edit-review-star" style={{ color: editUserStars >= 1 ? "gold" : "white" }} onClick={() => setEditUserStars(1)}>★</button>
                                        <button className="edit-review-star" style={{ color: editUserStars >= 2 ? "gold" : "white" }} onClick={() => setEditUserStars(2)}>★</button>
                                        <button className="edit-review-star" style={{ color: editUserStars >= 3 ? "gold" : "white" }} onClick={() => setEditUserStars(3)}>★</button>
                                        <button className="edit-review-star" style={{ color: editUserStars >= 4 ? "gold" : "white" }} onClick={() => setEditUserStars(4)}>★</button>
                                        <button className="edit-review-star" style={{ color: editUserStars >= 5 ? "gold" : "white" }} onClick={() => setEditUserStars(5)}>★</button>
                                    </div>
                                    <button className="send-review-button" onClick={() => handleSendButton("edit", review.review_id)}>Send</button>
                                </div>
                            </div>
                        ))
                    ) : (
                        <p>Ei arvosteluja vielä.</p>
                    )}
                </div>

                <div className="user-review">
                    <h2>Write a review and give a rating for this movie!</h2>
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
                    <button className="send-review-button" onClick={() => handleSendButton("new")}>Send</button>
                </div>


            </div>
        </>
    );
}