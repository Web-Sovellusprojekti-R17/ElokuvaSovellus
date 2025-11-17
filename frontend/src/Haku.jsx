import { useEffect, useState } from "react";
import ReactPaginate from 'react-paginate';
import "./Haku.css";
import MovieCard from "./components/MovieCard";

const url = 'https://api.themoviedb.org/3/search/movie?query=asdf&include_adult=false&language=en-US&page=1'

function Haku(){
    const [movies, setMovies] = useState([])
    const [page, setPage] = useState(1)
    const [pageCount, setPageCount] = useState(0)
    
    const [query, setQuery] = useState(queryFromUrl)
    const location = useLocation();
    const params = new URLSearchParams(location.search);
    const queryFromUrl = params.get("query") || "";
    



    const Movies = () => {
        return (
            <ul>
                {movies && movies.map(movie => (
                    MovieCard({ movie })
                    // <div key={movie.id} id="items">
                    //     <p>{movie.title} ({movie.release_date.substr(0,4)}) </p>
                    //     <img src={`https://image.tmdb.org/t/p/w154${movie.poster_path}`} alt="Elokuvan juliste" />
                    // </div>
                ))}
            </ul>
        )
        
    }

    const search = () => {
        fetch(`https://api.themoviedb.org/3/search/movie?api_key=${process.env.REACT_APP_API_KEY}&query=${query}&include_adult=false&language=en-US&page=${page}`,{
            headers: {
                'Authorization': "Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiIyMjZkN2EyMTQzZjE4NGRmMGRkMjFhZTRiZGJkY2JhNiIsIm5iZiI6MTc2Mjg2Nzk4OC4yMjIwMDAxLCJzdWIiOiI2OTEzM2IxNDE0ZGM3M2IzMjNkMjYxYjIiLCJzY29wZXMiOlsiYXBpX3JlYWQiXSwidmVyc2lvbiI6MX0.7k2WPMa9FuHdI6Hllyb5b7ME7eHUnJdSCSI0BOKoZnE", 
                'Content-Type': 'appliction/json'
            }
        })
            .then(respose => respose.json())
            .then(json => {
                setMovies(json.results)
                setPageCount(json.total_pages)
            })
            .catch(error => {
                console.log(error)
            })
    }

    useEffect(() => {
        search()
    }, [page])



    return (
        <div id="container">
            <h3>Hae Elokuvia</h3> 
            <input value={query} onChange={e => setQuery(e.target.value)}></input><button onClick={search} type="button">Hae</button>
            <Movies />
            <ReactPaginate
                breakLabel="..."
                nextLabel="next >"
                onPageChange={(e) => setPage(e.selected + 1)}
                pageRangeDisplayed={5}
                pageCount={pageCount}
                previousLabel="< previous"
                renderOnZeroPageCount={null}
            />
        </div>
    )
}

export default Haku;