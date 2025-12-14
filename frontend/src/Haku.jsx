import { useEffect, useState } from "react";
import ReactPaginate from 'react-paginate';
import { useParams } from "react-router-dom";
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
    const [filterGenrePop, setFilterGenrePop] = useState(false);

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

    const search = (selectedGenreId) => {
        fetch(`https://api.themoviedb.org/3/search/movie?api_key=${process.env.REACT_APP_TMDB_API_KEY}&query=${query}&include_adult=false&language=en-US&page=${page}`,{
            headers: {
                'Authorization': "Bearer " + process.env.REACT_APP_TMDB_LUKUOIKEUDEN_TUNNUS,
                'Content-Type': 'application/json'
            }
        })
            .then(response => response.json())
            .then(json => {
                 const filtered = selectedGenreId
            ? json.results.filter(movie =>
                  movie.genre_ids.includes(selectedGenreId)
              )
            : json.results;
                setMovies(filtered)
                setPageCount(json.total_pages)
            })
            .catch(error => {
                console.log(error)
            })
    }

    useEffect(() => {
        search()
    }, [page, query])

    function filterGenreSetter(){
        if(filterGenrePop===false)
        {
        setFilterGenrePop(true);
        }else setFilterGenrePop(false);
    }



    return (
        <>
            <div id="container">
                <h3>Search for movies</h3> 
                <input 
                value={query} 
                onChange={e => setQuery(e.target.value)}
                onKeyDown={(e)=>{
                    if(e.key=== "Enter"){
                        search();
                    }
                }}
                ></input><button onClick={search} type="button">Search</button>
                <button onClick={() =>filterGenreSetter()} type="button">Filter by genre</button>
                {filterGenrePop && (
                        <div className="filter-buttons">
                            
                            <button className="filter-button" onClick={() => search(10759)}>Action & adventure</button>
                            <button className="filter-button" onClick={() => search(16)}>Animation</button>
                            <button className="filter-button" onClick={() => search(35)}>Comedy</button>
                            <button className="filter-button" onClick={() => search(99)}>Documentary</button>
                            <button className="filter-button" onClick={() => search(18)}>Drama</button>
                            <button className="filter-button" onClick={() => search(10762)}>Kids</button>
                            <button className="filter-button" onClick={() => search(10751)}>Family</button>
                            <button className="filter-button" onClick={() => search(10765)}>Sci-Fi & Fantasy</button>
                            <button className="delete-filter-button" onClick={() => search()}>Delete filter</button>
                        </div>
                        
                    )}
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