import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { Container } from "./ui/container";
import { Link } from "react-router-dom";
import { getImageUrl, searchMulti } from "@/lib/tmdb";

interface SearchResult {
  id: number;
  title?: string;
  name?: string;
  poster_path: string | null;
  profile_path?: string | null;
  media_type: string;
  release_date?: string;
  first_air_date?: string;
}

export default function SearchResults() {
  const [searchParams] = useSearchParams();
  const query = searchParams.get("q") || "";
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [totalResults, setTotalResults] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);

  useEffect(() => {
    const fetchResults = async () => {
      if (!query) {
        setResults([]);
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        const data = await searchMulti(query, currentPage);
        setResults(data.results);
        setTotalResults(data.total_results);
        setTotalPages(data.total_pages);
      } catch (error) {
        console.error("Error searching:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchResults();
  }, [query, currentPage]);

  const loadMoreResults = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  if (isLoading) {
    return (
      <div className="w-full min-h-screen bg-black pt-24">
        <Container>
          <div className="flex items-center justify-center py-20">
            <div className="text-white">Loading...</div>
          </div>
        </Container>
      </div>
    );
  }

  return (
    <div className="w-full min-h-screen bg-black pt-24">
      <Container>
        <div className="py-8">
          <h1 className="text-2xl md:text-3xl font-bold text-white mb-2">
            Search Results for "{query}"
          </h1>
          <p className="text-gray-400 mb-8">{totalResults} results found</p>

          {results.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-300 text-lg">
                No results found for your search.
              </p>
              <p className="text-gray-400 mt-2">
                Try different keywords or check your spelling.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 md:gap-6">
              {results.map((item) => {
                // Skip results without images
                if (!item.poster_path && !item.profile_path) return null;

                const id = item.id;
                const title = item.title || item.name || "Unknown";
                const mediaType = item.media_type;
                const imagePath = item.poster_path || item.profile_path;
                const year =
                  item.release_date || item.first_air_date
                    ? new Date(
                        item.release_date || item.first_air_date || "",
                      ).getFullYear()
                    : "";

                // Skip person results for simplicity
                if (mediaType === "person") return null;

                return (
                  <Link
                    key={`${mediaType}-${id}`}
                    to={`/${mediaType}/${id}`}
                    className="transition-transform duration-300 hover:scale-105"
                  >
                    <div className="relative aspect-[2/3] rounded-md overflow-hidden bg-gray-800">
                      <img
                        src={getImageUrl(imagePath, "w342")}
                        alt={title}
                        className="w-full h-full object-cover"
                        loading="lazy"
                      />
                    </div>
                    <h3 className="mt-2 text-sm text-gray-200 truncate">
                      {title}
                    </h3>
                    {year && <p className="text-xs text-gray-400">{year}</p>}
                  </Link>
                );
              })}
            </div>
          )}

          {currentPage < totalPages && (
            <div className="flex justify-center mt-12">
              <button
                onClick={loadMoreResults}
                className="px-6 py-2 bg-red-600 hover:bg-red-700 text-white rounded-md transition-colors"
              >
                Load More
              </button>
            </div>
          )}
        </div>
      </Container>
    </div>
  );
}
