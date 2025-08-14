import { useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import css from "./App.module.css";

import SearchBar from "../SearchBar/SearchBar";
import { fetchMovies } from "../../services/movieService";
import type { Movie } from "../../types/movie";
import MovieGrid from "../MovieGrid/MovieGrid";
import Loader from "../Loader/Loader";
import ErrorMessage from "../ErrorMessage/ErrorMessage";
import MovieModal from "../MovieModal/MovieModal";

export default function App() {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(false);
  const [isError, setIsError] = useState(false);
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);

  const handleSubmit = async (value: string) => {
    if (!value.trim()) {
      toast.error("Please enter your search query.");
      return;
    }

    setLoading(true);
    setIsError(false);
    setMovies([]);

    try {
      const data = await fetchMovies(value);
      if (!data.length) {
        toast.error("No movies found for your request.");
        return;
      }
      setMovies(data);
    } catch {
      setIsError(true);
      setMovies([]);
      toast.error("There was an error, please try again...");
    } finally {
      setLoading(false);
    }
  };

  const handleSelectMovie = (movie: Movie) => setSelectedMovie(movie);
  const handleCloseModal = () => setSelectedMovie(null);

  return (
    <div className={css.appBackground}>
      {/* Тости по центру зверху */}
      <Toaster position="top-center" reverseOrder={false} />

      <div className={css.content}>
        <SearchBar onSubmit={handleSubmit} />
      </div>

      {loading && <Loader />}
      {isError && <ErrorMessage />}
      {!loading && !isError && movies.length > 0 && (
        <MovieGrid movies={movies} onSelect={handleSelectMovie} />
      )}

      {selectedMovie && (
        <MovieModal movie={selectedMovie} onClose={handleCloseModal} />
      )}
    </div>
  );
}
