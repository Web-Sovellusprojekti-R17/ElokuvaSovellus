import { useEffect, useState } from "react";
import "./ArvosteluSivu.css";
import { useParams } from "react-router";
import ReviewCard from "../components/ReviewCard.jsx";
import axios from "axios";
import { useAuth } from "../contexts/AuthContext.js"; 

function ArvosteluSivu() {
    let params = useParams()

    const [movie_id, setMovie_id] = useState(params.movieID)
    const [title, setTitle] = useState('')
    const [year, setYear] = useState('')
    const [poster, setPoster] = useState('')
    const [reviews, setReviews] = useState([]);
    const { user } = useAuth(); 

    async function fetchReviews() {
        if (!movie_id && !user) 
            return;
        console.log(movie_id ? "true" : "false");
        axios.get(movie_id ? `http://localhost:3001/review/movie/${movie_id}`
                           : `http://localhost:3001/review/user/${user.id}`)
            .then((response) => {
                console.log("Reviews found: " + response);
                setReviews(Array.isArray(response.data) ? response.data : []);

            })
            .catch((err) => {
                console.error('There was an error fetching users', err)
            })

        
    }

    const search = () => {
        if(!movie_id) 
            return;  

        fetch(`https://api.themoviedb.org/3/movie/${movie_id}?api_key=${process.env.REACT_APP_TMDB_API_KEY}&language=en-US`, {
            headers: {
                'Authorization': "Bearer " + process.env.REACT_APP_TMDB_LUKUOIKEUDEN_TUNNUS,
                'Content-Type': 'appliction/json'
            }
        })
            .then(respose => respose.json())
            .then(json => {
                setTitle(json.title)
                setYear(json.release_date.substr(0, 4))
                setPoster(json.poster_path)
            })
            .catch(error => {
                console.log(error)
            })
    }

    useEffect(() => {
        fetchReviews();
        search()
    }, [])

    return (
        <>
            <div id="arvostelu-container-kokosivu">
                <div>
                    <img src={`https://image.tmdb.org/t/p/w185${poster}`} alt="Elokuvan juliste" />
                    <p>{title}</p>
                    <p>({year})</p>
                </div>
                 <div className="review-section">
                    {Array.isArray(reviews) && reviews.length > 0 ? (
                        reviews.map((review) => (
                            <ReviewCard key={review.review_id} review={review} />
                        ))
                    ) : (
                        <p>Ei arvosteluja vielä.</p>
                    )}
                </div>

            </div>

        </>
    );
}

export default ArvosteluSivu;