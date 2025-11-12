import { useEffect, useState,useRef } from "react";
import ReactPaginate from 'react-paginate';
import "./Haku.css";

const url = 'https://api.themoviedb.org/3/search/movie?query=asdf&include_adult=false&language=en-US&page=1'

function Haku(){
    const [movies, setMovies] = useState([])
    const [page, setPage] = useState(1)
    const [pageCount, setPageCount] = useState(0)
    const [query, setQuery] = useState('')

    const containerRef = useRef();

    function MovieCard({media}) {
    const {title,name,backdrop_path} = media;

    return(
      <div className="movie_item">
      <img
      src={  backdrop_path && backdrop_path.length > 0
        ? `https://image.tmdb.org/t/p/w300/${backdrop_path}`
        : "/images/image_placeholder.svg"
    }
      className="movie_img"
      alt={title||name}
      />
      <div className = "title">{title || name}</div>
    </div>
    );
  }

    const Movies = () => {
        return (

            <div className="hakuContainer">
           
                {movies && movies.map(movie => (
                    <MovieCard key={movie.id} media = {movie}/>
                ))}
            
            </div>
        )
        
    }

    const search = () => {
        fetch('https://api.themoviedb.org/3/search/movie?query=' + query + '&include_adult=false&language=en-US&page=' + page,{
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
            <div id="top">
            <h3>Hae Elokuvia</h3> 
            <input value={query} onChange={e => setQuery(e.target.value)}></input><button onClick={search} type="button">Hae</button>
            </div>
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