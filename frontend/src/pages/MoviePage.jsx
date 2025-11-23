import "./MoviePage.css";
import Navbar from "../components/NavBar";
import { useParams } from "react-router";
import { useEffect, useState } from "react";


export default function MoviePage() {
    let params = useParams()

    const [movie_id, setMovie_id] = useState(params.movieID)
    const [title, setTitle] = useState('')
    const [genres, setGenres] = useState([])
    const [overview, setOverview] = useState('')
    const [year, setYear] = useState('')
    const [runtime, setRuntime] = useState('')
    const [languages, setLanguages] = useState([])
    const [backdrop_path, setBackdropbath] = useState('')


    const renderStars = (rating) => {
        const stars = Math.round(rating / 2);
        return "★".repeat(stars) + "☆".repeat(5 - stars);
    };

    const Genret = () => {
        let genret = ''
        {genres && genres.map(genre => (
            genret += genre.name + ' '
        ))}
        
        return (
            <p><strong>Genret: </strong>{genret} </p>
        )    
    }

    const Kielet = () => {
        let kielet = ''
        {languages && languages.map(language => (
            kielet += language.name + ' '
        ))}
        
        return (
            <p><strong>Kielet: </strong>{kielet} </p>
        ) 
    }
  
    const search = () => {
            fetch(`https://api.themoviedb.org/3/movie/${movie_id}?api_key=${process.env.REACT_APP_TMDB_API_KEY}&language=en-US`,{
                headers: {
                    'Authorization': "Bearer " + process.env.REACT_APP_TMDB_LUKUOIKEUDEN_TUNNUS, 
                    'Content-Type': 'appliction/json'
                }
            })
                .then(respose => respose.json())
                .then(json => {
                    setTitle(json.title)
                    setGenres(json.genres)
                    setOverview(json.overview)
                    setYear(json.release_date.substr(0,4))
                    setRuntime(json.runtime)
                    setLanguages(json.spoken_languages)
                    setBackdropbath(json.backdrop_path)
                })
                .catch(error => {
                    console.log(error)
                })
        }
    
        useEffect(() => {
            search()
        }, [])

    return (
        <>
            <Navbar />
            <div className="movie-container">
                <div className="movie-header">
                    <img
                        className="movie-poster"
                        src={`https://image.tmdb.org/t/p/w500/${backdrop_path}`}
                        alt="Movie Poster"
                    />


                    <div className="movie-info">
                        <h1>{title}</h1>
                        <p className="stars">{renderStars(8.0)}</p>
                        <p><strong>Vuosi: </strong>{year}</p>
                        <Genret />
                        <p><strong>Kesto: </strong>{runtime} min</p>
                        <Kielet />
                        <p><strong>Lisätietoja: </strong>
                            {overview}
                        </p>
                    </div>
                </div>
                <div className="genre-container">
                    <span className="genre-tag">Toiminta</span>
                    <span className="genre-tag">Seikkailu</span>
                    <span className="genre-tag">Fantasia</span>
                </div>


                <h2>Näyttelijät</h2>
                <ul className="actors">
                    <li><strong>Näyttelijä 1</strong> &nbsp;as&nbsp; Hahmo A</li>
                    <li><strong>Näyttelijä 2</strong> &nbsp;as&nbsp; Hahmo B</li>
                    <li><strong>Näyttelijä 3</strong> &nbsp;as&nbsp; Hahmo C</li>
                </ul>


                <h2>Arvostelut</h2>

                <div className="review">
                    <h4>Arvostelu 1</h4>
                    <p className="stars">{renderStars(8.0)}</p>
                    <p>Mahtava leffa boidi!!</p>
                </div>

            </div>
        </>   
    );
}
