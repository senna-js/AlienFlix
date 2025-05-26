import { useState, useEffect } from "react";
import HeroSlider from "./hero-slider";
import MovieRow from "./movie-row";
import { Container } from "./ui/container";
import {
  getTrending,
  getPopular,
  getTopRated,
  getUpcoming,
  getAiringToday,
} from "@/lib/tmdb";

interface Movie {
  id: number;
  title?: string;
  name?: string;
  poster_path: string;
  media_type?: string;
}

function Home() {
  const [trendingMovies, setTrendingMovies] = useState<Movie[]>([]);
  const [trendingTVShows, setTrendingTVShows] = useState<Movie[]>([]);
  const [popularMovies, setPopularMovies] = useState<Movie[]>([]);
  const [popularTVShows, setPopularTVShows] = useState<Movie[]>([]);
  const [topRatedMovies, setTopRatedMovies] = useState<Movie[]>([]);
  const [upcomingMovies, setUpcomingMovies] = useState<Movie[]>([]);
  const [airingToday, setAiringToday] = useState<Movie[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [
          trendingMoviesData,
          trendingTVData,
          popularMoviesData,
          popularTVData,
          topRatedMoviesData,
          upcomingMoviesData,
          airingTodayData,
        ] = await Promise.all([
          getTrending("movie", "week"),
          getTrending("tv", "week"),
          getPopular("movie"),
          getPopular("tv"),
          getTopRated("movie"),
          getUpcoming(),
          getAiringToday(),
        ]);

        setTrendingMovies(trendingMoviesData.results);
        setTrendingTVShows(trendingTVData.results);
        setPopularMovies(popularMoviesData.results);
        setPopularTVShows(popularTVData.results);
        setTopRatedMovies(topRatedMoviesData.results);
        setUpcomingMovies(upcomingMoviesData.results);
        setAiringToday(airingTodayData.results);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  if (isLoading) {
    return (
      <div className="w-full h-screen bg-black flex items-center justify-center">
        <div className="text-white">Loading...</div>
      </div>
    );
  }

  return (
    <div className="bg-black min-h-screen">
      <HeroSlider />
      <Container>
        <div className="pt-8">
          <MovieRow
            title="Trending Movies"
            movies={trendingMovies}
            mediaType="movie"
          />
          <MovieRow
            title="Trending TV Shows"
            movies={trendingTVShows}
            mediaType="tv"
          />
          <MovieRow
            title="Popular Movies"
            movies={popularMovies}
            mediaType="movie"
          />
          <MovieRow
            title="Popular TV Shows"
            movies={popularTVShows}
            mediaType="tv"
          />
          <MovieRow
            title="Top Rated Movies"
            movies={topRatedMovies}
            mediaType="movie"
          />
          <MovieRow
            title="Upcoming Movies"
            movies={upcomingMovies}
            mediaType="movie"
          />
          <MovieRow
            title="TV Shows Airing Today"
            movies={airingToday}
            mediaType="tv"
          />
        </div>
      </Container>
    </div>
  );
}

export default Home;
