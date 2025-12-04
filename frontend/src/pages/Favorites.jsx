import { useEffect, useState } from "react";
import MovieCard from "../components/MovieCard";
import { useAuth, accessToken } from "../contexts/AuthContext.js";

export default function Favorites() {
    const [favoriteMovies, setFavoriteMovies] = useState([]);
        const { user, accessToken } = useAuth();


    function getFavorites(){
         if(!accessToken)
    {
        return;
    }
       
        fetch(`${process.env.REACT_APP_API_URL}favorites/2`, {
            headers: {
                "Content-Type": "application/json",
                    Authorization: `Bearer ${accessToken}`
            },
        })
            .then(res => res.json())
            .then(data => {

                console.log("toimii");
                //if (!Array.isArray(data)) return;

                Promise.all(
                    data.map(fav =>
                        fetch(
                            `https://api.themoviedb.org/3/movie/${fav.movie_id}?api_key=${process.env.REACT_APP_TMDB_API_KEY}&language=fi-FI`
                        ).then(res => res.json())
                    )
                ).then(movies => setFavoriteMovies(movies));
            })
            .catch(err => console.error("Error loading favorites:", err));
    }

   useEffect(() => {

    getFavorites();

   }, [])
   

    return (
        <div className="container">
            <h1>Suosikit</h1>

            <div className="movies-container">
                {favoriteMovies.length > 0 ? (
                    favoriteMovies.map(movie => (
                        <MovieCard key={movie.id} media={movie} />
                    ))
                ) : (
                    <p>Ei suosikkeja vielä.</p>
                )}
            </div>
        </div>
    );
}
