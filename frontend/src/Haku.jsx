import { useEffect, useState, useRef } from "react";
import ReactPaginate from 'react-paginate';
import "./Haku.css";
import { useLocation } from "react-router-dom";

const url = 'https://api.themoviedb.org/3/search/movie?query=asdf&include_adult=false&language=en-US&page=1'

function Haku() {

    const [movies, setMovies] = useState([])
    const [page, setPage] = useState(1)
    const [pageCount, setPageCount] = useState(0)
    
    const [query, setQuery] = useState(queryFromUrl)
    const location = useLocation();
    const params = new URLSearchParams(location.search);
    const queryFromUrl = params.get("query") || "";
    




    const Movies = () => {
        return (
            <div id="results">
                {movies && movies.map(movie => (
                    <div key={movie.id} id="items">
                        <p>{movie.title} ({movie.release_date.substr(0, 4)}) </p>
                        <img src={`https://image.tmdb.org/t/p/w154${movie.poster_path}`} alt="Elokuvan juliste" />
                    </div>
                ))}
            </div>
        )
    }

    const search = () => {
        fetch('https://api.themoviedb.org/3/search/movie?query=' + query + '&include_adult=false&language=en-US&page=' + page, {
            headers: {
                'Authorization': 'Bearer ' + process.env.REACT_APP_TMDB_LUKUOIKEUDEN_TUNNUS,
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
            <div id="top">
                <h3>Hae Elokuvia</h3>
                <input value={query} onChange={e => setQuery(e.target.value)}></input><button onClick={search} type="button">Hae</button>
            </div>
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
    )
}

export default Haku;