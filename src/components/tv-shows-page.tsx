import { useState, useEffect } from "react";
import { Container } from "./ui/container";
import { Link } from "react-router-dom";
import {
  getImageUrl,
  getPopular,
  getTopRated,
  getAiringToday,
} from "@/lib/tmdb";

interface TVShow {
  id: number;
  name: string;
  poster_path: string;
  first_air_date: string;
  vote_average: number;
}

export default function TVShowsPage() {
  const [tvShows, setTVShows] = useState<TVShow[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [category, setCategory] = useState<
    "popular" | "top_rated" | "airing_today"
  >("popular");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);

  useEffect(() => {
    const fetchTVShows = async () => {
      try {
        setIsLoading(true);
        let data;

        switch (category) {
          case "popular":
            data = await getPopular("tv", page);
            break;
          case "top_rated":
            data = await getTopRated("tv", page);
            break;
          case "airing_today":
            data = await getAiringToday(page);
            break;
          default:
            data = await getPopular("tv", page);
        }

        if (page === 1) {
          setTVShows(data.results);
        } else {
          setTVShows((prev) => [...prev, ...data.results]);
        }

        setTotalPages(data.total_pages > 20 ? 20 : data.total_pages); // Limit to 20 pages
      } catch (error) {
        console.error("Error fetching TV shows:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchTVShows();
  }, [category, page]);

  const handleCategoryChange = (
    newCategory: "popular" | "top_rated" | "airing_today",
  ) => {
    if (category !== newCategory) {
      setCategory(newCategory);
      setPage(1);
      window.scrollTo(0, 0);
    }
  };

  const loadMore = () => {
    if (page < totalPages) {
      setPage(page + 1);
    }
  };

  const categoryTitles = {
    popular: "Popular TV Shows",
    top_rated: "Top Rated TV Shows",
    airing_today: "TV Shows Airing Today",
  };

  return (
    <div className="w-full min-h-screen bg-black pt-24">
      <Container>
        <div className="py-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8">
            <h1 className="text-2xl md:text-3xl font-bold text-white mb-4 sm:mb-0">
              {categoryTitles[category]}
            </h1>

            <div className="flex space-x-2">
              <button
                onClick={() => handleCategoryChange("popular")}
                className={`px-4 py-2 rounded-md text-sm ${category === "popular" ? "bg-red-600 text-white" : "bg-gray-800 text-gray-300 hover:bg-gray-700"}`}
              >
                Popular
              </button>
              <button
                onClick={() => handleCategoryChange("top_rated")}
                className={`px-4 py-2 rounded-md text-sm ${category === "top_rated" ? "bg-red-600 text-white" : "bg-gray-800 text-gray-300 hover:bg-gray-700"}`}
              >
                Top Rated
              </button>
              <button
                onClick={() => handleCategoryChange("airing_today")}
                className={`px-4 py-2 rounded-md text-sm ${category === "airing_today" ? "bg-red-600 text-white" : "bg-gray-800 text-gray-300 hover:bg-gray-700"}`}
              >
                Airing Today
              </button>
            </div>
          </div>

          {isLoading && page === 1 ? (
            <div className="flex items-center justify-center py-20">
              <div className="text-white">Loading...</div>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 md:gap-6">
                {tvShows.map((show) => {
                  const year = show.first_air_date
                    ? new Date(show.first_air_date).getFullYear()
                    : "";

                  return (
                    <Link
                      key={show.id}
                      to={`/tv/${show.id}`}
                      className="transition-transform duration-300 hover:scale-105"
                    >
                      <div className="relative aspect-[2/3] rounded-md overflow-hidden bg-gray-800">
                        <img
                          src={getImageUrl(show.poster_path, "w342")}
                          alt={show.name}
                          className="w-full h-full object-cover"
                          loading="lazy"
                        />
                        {show.vote_average > 0 && (
                          <div className="absolute top-2 right-2 bg-black/70 text-yellow-400 text-xs font-medium px-2 py-1 rounded-md">
                            ★ {show.vote_average.toFixed(1)}
                          </div>
                        )}
                      </div>
                      <h3 className="mt-2 text-sm text-gray-200 truncate">
                        {show.name}
                      </h3>
                      {year && <p className="text-xs text-gray-400">{year}</p>}
                    </Link>
                  );
                })}
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
