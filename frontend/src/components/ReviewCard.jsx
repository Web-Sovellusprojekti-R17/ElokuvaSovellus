import { useState } from "react";
import "./ReviewCard.css";
import axios from "axios";
import { useAuth } from "../contexts/AuthContext.js";

const ReviewCard = ({ review }) => {
    const [editedReview, setEditedReview] = useState(0);
    const [editUserStars, setEditUserStars] = useState(1);
    const [editReviewInput, setEditReviewInput] = useState('');
    const { user, accessToken } = useAuth();

    function handleSendButton() {
        axios.put(`${process.env.REACT_APP_API_URL}review/${review.review_id}`,
            new URLSearchParams({
                review: editReviewInput,
                rating: editUserStars
            }),
            {
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded",
                    "Authorization": `Bearer ${accessToken}`
                },
                withCredentials: true
            }
        ).then(() => {
            console.log("review updated succesfully!");
            window.location.reload();
        }).catch((err) => {
            console.error('There was an error updating review', err);
        })

    }
    function handleEditButton() {
        setEditedReview(review.review_id);
    }

    function handleRemoveButton() {
        axios.delete(`${process.env.REACT_APP_API_URL}review/${review.review_id}`,
            {
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded",
                    "Authorization": `Bearer ${accessToken}`
                },
                withCredentials: true
            }
        ).then(() => {
            console.log("review deleted succesfully!");
            window.location.reload();
        }).catch((err) => {
            console.error('There was an error deleting review', err);
        })

    }

    const renderReviewStars = (rating) => {
        return "★".repeat(rating) + "☆".repeat(5 - rating);
    };

    return (
        <div className="review-card">
            <h4>User: {review.username}</h4>
            <p>{new Date(review.review_date).toISOString().split("T")[0]}</p>
            <p className="stars">{renderReviewStars(review.rating)}</p>
            <p>{review.review}</p>
            <div className="review-buttons">
                {user && user.id === review.user_id && (
                    <>
                        <button
                            className="review-edit-button"
                            onClick={() => handleEditButton()}>
                            Edit
                        </button>

                        <button
                            className="review-edit-button"
                            onClick={() => handleRemoveButton()}>
                            Delete
                        </button>
                    </>
                )}

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
                <button className="send-review-button" onClick={() => handleSendButton(review.review_id)}>Send</button>
            </div>
        </div>
    );
};

export default ReviewCard;