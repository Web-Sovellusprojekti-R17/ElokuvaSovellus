import { useEffect, useState } from "react";
import ReactPaginate from 'react-paginate';
import { useParams } from "react-router";
import "./Haku.css";
import MovieCard from "./components/MovieCard";
import Navbar from "./components/NavBar";

const url = 'https://api.themoviedb.org/3/search/movie?query=asdf&include_adult=false&language=en-US&page=1'

function Haku(){
    let params = useParams()
    
    
    const [movies, setMovies] = useState([])
    const [page, setPage] = useState(1)
    const [pageCount, setPageCount] = useState(0)
    const [query, setQuery] = useState(params.query)

    // const location = useLocation();
    // const params = new URLSearchParams(location.search);
    // const queryFromUrl = params.get("query") || "";
    



    const Movies = () => {
        return (
            <ul id="results">
                {movies && movies.map(movie => (
                    MovieCard({ movie })
                ))}
            </ul>
        )
        
    }

    const search = () => {
        fetch(`https://api.themoviedb.org/3/search/movie?api_key=${process.env.REACT_APP_TMDB_API_KEY}&query=${query}&include_adult=false&language=en-US&page=${page}`,{
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
    }, [page, query])



    return (
        <>
            <Navbar />
            <div id="container">
                <h3>Hae Elokuvia</h3> 
                <input 
                value={query} 
                onChange={e => setQuery(e.target.value)}
                onKeyDown={(e)=>{
                    if(e.key=== "Enter"){
                        search();
                    }
                }}
                ></input><button onClick={search} type="button">Hae</button>
                <Movies />
                <ReactPaginate
                    breakLabel="..."
                    nextLabel=" >"
                    onPageChange={(e) => setPage(e.selected + 1)}
                    pageRangeDisplayed={5}
                    pageCount={pageCount}
                    previousLabel="< "
                    renderOnZeroPageCount={null}
                />
            </div>
        </>
        
    )
}

export default Haku;