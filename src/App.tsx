import { Suspense } from "react";
import { useRoutes, Routes, Route } from "react-router-dom";
import Home from "./components/home";
import Navbar from "./components/navbar";
import Footer from "./components/footer";
import MovieDetails from "./components/movie-details";
import VideoPlayer from "./components/video-player";
import SearchResults from "./components/search-results";
import MoviesPage from "./components/movies-page";
import TVShowsPage from "./components/tv-shows-page";
import ComingSoon from "./components/coming-soon";
import Watchlist from "./components/watchlist";
import NotFound from "./components/not-found";
import routes from "tempo-routes";

function App() {
  return (
    <Suspense
      fallback={<p className="text-center p-4 text-white">Loading...</p>}
    >
      <div className="bg-black min-h-screen">
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route
            path="/movie/:id"
            element={<MovieDetails mediaType="movie" />}
          />
          <Route path="/tv/:id" element={<MovieDetails mediaType="tv" />} />
          <Route
            path="/watch/movie/:id"
            element={<VideoPlayer mediaType="movie" />}
          />
          <Route
            path="/watch/tv/:id/season/:season/episode/:episode"
            element={<VideoPlayer mediaType="tv" />}
          />
          <Route path="/search" element={<SearchResults />} />
          <Route path="/movies" element={<MoviesPage />} />
          <Route path="/tv" element={<TVShowsPage />} />
          <Route path="/coming-soon" element={<ComingSoon />} />
          <Route path="/watchlist" element={<Watchlist />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
        <Footer />
        {import.meta.env.VITE_TEMPO === "true" && useRoutes(routes)}
      </div>
    </Suspense>
  );
}

export default App;
