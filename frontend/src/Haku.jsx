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
    const [filterInput, setFilterInput] = useState('')
    const [filterGenrePop, setFilterGenrePop] = useState(false);
    const [filteredGenreId, setFilteredGenreId] = useState(0);

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

const search = (selectedGenreId = filteredGenreId, year = filterInput) => {
  fetch(
    `https://api.themoviedb.org/3/search/movie?api_key=${process.env.REACT_APP_TMDB_API_KEY}&query=${query}&include_adult=false&language=en-US&page=${page}`,
    {
      headers: {
        Authorization: "Bearer " + process.env.REACT_APP_TMDB_LUKUOIKEUDEN_TUNNUS,
        "Content-Type": "application/json",
      },
    }
  )
    .then(res => res.json())
    .then(json => {
      let results = json.results;
        setFilteredGenreId(selectedGenreId);

      if (selectedGenreId && selectedGenreId !== 0) {
        results = results.filter(movie =>
          movie.genre_ids.includes(selectedGenreId)
        );
      }

      if (year) {
        results = results.filter(movie =>
          movie.release_date?.startsWith(year)
        );
      }

      setMovies(results);
      setPageCount(json.total_pages);
    })
    .catch(console.log);
};

    useEffect(() => {
        search(filteredGenreId)
    }, [page])

    function filterGenreSetter(){
        if(filterGenrePop===false)
        {
        setFilterGenrePop(true);
        }else setFilterGenrePop(false);
    }



    return (
        <>
            <div id="container">
               <div className="search-container">
                <h3>Hae Elokuvia</h3> 
                <input 
                value={query} 
                onChange={e => setQuery(e.target.value)}
                onKeyDown={(e)=>{
                    if(e.key=== "Enter"){
                        search(0,0);
                    }
                }}
                ></input><button onClick={search} type="button">Hae</button>
                <button onClick={() =>filterGenreSetter()} type="button">Filters</button>
                {filterGenrePop && (
                        <div className="filter-components">
                            <div className="filter-buttons">
                            <button className="filter-button" onClick={() => search(10759)}>Action & adventure</button>
                            <button className="filter-button" onClick={() => search(16)}>Animation</button>
                            <button className="filter-button" onClick={() => search(35)}>Comedy</button>
                            <button className="filter-button" onClick={() => search(99)}>Documentary</button>
                            <button className="filter-button" onClick={() => search(18)}>Drama</button>
                            <button className="filter-button" onClick={() => search(10762)}>Kids</button>
                            <button className="filter-button" onClick={() => search(10751)}>Family</button>
                            <button className="filter-button" onClick={() => search(10765)}>Sci-Fi & Fantasy</button>
                            <button className="delete-filter-button" onClick={() => search(0,0)}>Delete filters</button>
                            </div>
                            <div className="filter-buttons-year">

                                <input 
                                className="filter-input-year"
                                type="number"
                                min="1900"
                                max={new Date().getFullYear()}
                                placeholder="Release year"
                                value={filterInput} 
                                onChange={e => setFilterInput(e.target.value)}  /><button className="delete-filter-button" onClick={() => search(filteredGenreId,filterInput)}>Filter by year</button>
                            </div>
                        </div>
                       
                    )}
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
        </>
        
    )
}

export default Haku;