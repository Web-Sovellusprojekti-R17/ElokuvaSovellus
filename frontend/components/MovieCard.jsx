export default MovieCard = ({ movie }) => {


const MovieCard = ({ movie }) => {
  return (
    <div className="bg-gray-800 text-white rounded-2xl shadow-lg overflow-hidden w-64 transition-transform transform hover:scale-105">
      <img
        src={movie.poster}
        alt={movie.title}
        className="w-full h-96 object-cover"
      />
      <div className="p-4">
        <h2 className="text-xl font-semibold">{movie.title}</h2>
        <p className="text-sm text-gray-400 mb-1">{movie.year}</p>
        <p className="text-yellow-400 font-medium mb-2">⭐ {movie.rating}/10</p>
        <p className="text-sm line-clamp-3 text-gray-300 mb-3">
          {movie.description}
        </p>
        <button className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded-lg text-sm">
          More Info
        </button>
      </div>
    </div>
  );
};

}
