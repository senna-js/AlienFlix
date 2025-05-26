import { useState, useEffect } from "react";
import { Container } from "./ui/container";
import { Link } from "react-router-dom";
import { getImageUrl, getUpcoming } from "@/lib/tmdb";

interface Movie {
  id: number;
  title: string;
  poster_path: string;
  backdrop_path: string;
  release_date: string;
  overview: string;
}

export default function ComingSoon() {
  const [upcomingMovies, setUpcomingMovies] = useState<Movie[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);

  useEffect(() => {
    const fetchUpcoming = async () => {
      try {
        setIsLoading(true);
        const data = await getUpcoming(page);

        // Filter to only include movies with future release dates
        const today = new Date();
        const filteredMovies = data.results.filter((movie: Movie) => {
          const releaseDate = new Date(movie.release_date);
          return releaseDate > today;
        });

        // Sort by release date (closest first)
        filteredMovies.sort((a: Movie, b: Movie) => {
          return (
            new Date(a.release_date).getTime() -
            new Date(b.release_date).getTime()
          );
        });

        if (page === 1) {
          setUpcomingMovies(filteredMovies);
        } else {
          setUpcomingMovies((prev) => [...prev, ...filteredMovies]);
        }

        setTotalPages(data.total_pages > 10 ? 10 : data.total_pages); // Limit to 10 pages
      } catch (error) {
        console.error("Error fetching upcoming movies:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUpcoming();
  }, [page]);

  const loadMore = () => {
    if (page < totalPages) {
      setPage(page + 1);
    }
  };

  const formatReleaseDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = {
      year: "numeric",
      month: "long",
      day: "numeric",
    };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  return (
    <div className="w-full min-h-screen bg-black pt-24">
      <Container>
        <div className="py-8">
          <h1 className="text-2xl md:text-3xl font-bold text-white mb-8">
            Coming Soon
          </h1>

          {isLoading && page === 1 ? (
            <div className="flex items-center justify-center py-20">
              <div className="text-white">Loading...</div>
            </div>
          ) : (
            <>
              <div className="space-y-8">
                {upcomingMovies.map((movie) => (
                  <div
                    key={movie.id}
                    className="bg-gray-900 rounded-lg overflow-hidden"
                  >
                    <div className="flex flex-col md:flex-row">
                      <div className="md:w-1/4 lg:w-1/5">
                        <Link to={`/movie/${movie.id}`}>
                          <img
                            src={getImageUrl(movie.poster_path, "w342")}
                            alt={movie.title}
                            className="w-full h-full object-cover"
                            loading="lazy"
                          />
                        </Link>
                      </div>
                      <div className="p-4 md:p-6 md:w-3/4 lg:w-4/5">
                        <Link to={`/movie/${movie.id}`}>
                          <h2 className="text-xl md:text-2xl font-bold text-white hover:text-red-500 transition-colors">
                            {movie.title}
                          </h2>
                        </Link>
                        <div className="text-red-500 font-medium my-2">
                          Release Date: {formatReleaseDate(movie.release_date)}
                        </div>
                        <p className="text-gray-300 mt-2 line-clamp-3">
                          {movie.overview}
                        </p>
                        <Link
                          to={`/movie/${movie.id}`}
                          className="inline-block mt-4 text-red-500 hover:text-red-400 font-medium"
                        >
                          More Info
                        </Link>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {isLoading && page > 1 && (
                <div className="flex justify-center mt-8">
                  <div className="text-white">Loading more...</div>
                </div>
              )}

              {page < totalPages && !isLoading && (
                <div className="flex justify-center mt-12">
                  <button
                    onClick={loadMore}
                    className="px-6 py-2 bg-red-600 hover:bg-red-700 text-white rounded-md transition-colors"
                  >
                    Load More
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </Container>
    </div>
  );
}
