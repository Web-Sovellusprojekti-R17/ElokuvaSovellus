import { useEffect, useState } from "react";
import "./ArvosteluSivu.css";
import Navbar from "../components/NavBar";
import { useParams } from "react-router";
import MovieCard from "../components/MovieCard";


function ArvosteluSivu(){
    let params = useParams()

    const [movie_id, setMovie_id] = useState(params.movieID)
    const [title, setTitle] = useState('')
    const [year, setYear] = useState('')
    const [poster, setPoster] = useState('')


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
                    setYear(json.release_date.substr(0,4))
                    setPoster(json.poster_path)
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
            <div id="arvostelu-container-kokosivu">
                <div>
                    <img src={`https://image.tmdb.org/t/p/w185${poster}`} alt="Elokuvan juliste" />
                    <p>{title}</p>
                    <p>({year})</p>
                </div>
                <div id="arvostelut">
                    <div id="arvostelu">
                        <p><strong>käyttäjänimi</strong></p>
                        <p>Lorem, ipsum dolor sit amet consectetur adipisicing elit. Ipsum, numquam, provident reprehenderit aperiam eaque veniam deserunt, assumenda sed culpa recusandae ullam dicta. Debitis quis, ipsum natus praesentium sed quae sunt?</p>
                        <p>21.11.2025 14.18</p>
                    </div>
                    <div id="arvostelu">
                        <p><strong>käyttäjänimi</strong></p>
                        <p>Lorem, ipsum dolor sit amet consectetur adipisicing elit. Ipsum, numquam, provident reprehenderit aperiam eaque veniam deserunt, assumenda sed culpa recusandae ullam dicta. Debitis quis, ipsum natus praesentium sed quae sunt?</p>
                        <p>21.11.2025 14.18</p>
                    </div>
                </div>
                
            </div>
            
        </> 
    );
}

export default ArvosteluSivu;