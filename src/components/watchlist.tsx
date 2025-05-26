import { useState, useEffect } from "react";
import { Container } from "./ui/container";
import { Link } from "react-router-dom";
import { getImageUrl } from "@/lib/tmdb";
import { Trash2 } from "lucide-react";
import { Button } from "./ui/button";

interface WatchlistItem {
  id: number;
  title: string;
  poster_path: string;
  media_type: string;
  added_at: number;
}

export default function Watchlist() {
  const [watchlist, setWatchlist] = useState<WatchlistItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // In a real app, this would fetch from an API or local storage
    // For demo purposes, we'll create a mock watchlist
    const mockWatchlist: WatchlistItem[] = [
      {
        id: 550,
        title: "Fight Club",
        poster_path: "/pB8BM7pdSp6B6Ih7QZ4DrQ3PmJK.jpg",
        media_type: "movie",
        added_at: Date.now() - 86400000 * 2,
      },
      {
        id: 278,
        title: "The Shawshank Redemption",
        poster_path: "/q6y0Go1tsGEsmtFryDOJo3dEmqu.jpg",
        media_type: "movie",
        added_at: Date.now() - 86400000 * 5,
      },
      {
        id: 1396,
        title: "Breaking Bad",
        poster_path: "/ggFHVNu6YYI5L9pCfOacjizRGt.jpg",
        media_type: "tv",
        added_at: Date.now() - 86400000 * 1,
      },
    ];

    setTimeout(() => {
      setWatchlist(mockWatchlist);
      setIsLoading(false);
    }, 1000); // Simulate loading
  }, []);

  const removeFromWatchlist = (id: number) => {
    setWatchlist(watchlist.filter((item) => item.id !== id));
  };

  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleDateString();
  };

  return (
    <div className="w-full min-h-screen bg-black pt-24">
      <Container>
        <div className="py-8">
          <h1 className="text-2xl md:text-3xl font-bold text-white mb-8">
            My Watchlist
          </h1>

          {isLoading ? (
            <div className="flex items-center justify-center py-20">
              <div className="text-white">Loading...</div>
            </div>
          ) : watchlist.length === 0 ? (
            <div className="text-center py-16 bg-gray-900 rounded-lg">
              <h2 className="text-xl text-white mb-4">
                Your watchlist is empty
              </h2>
              <p className="text-gray-400 mb-6">
                Start adding movies and TV shows to your watchlist
              </p>
              <div className="flex justify-center space-x-4">
                <Link to="/movies">
                  <Button className="bg-red-600 hover:bg-red-700">
                    Browse Movies
                  </Button>
                </Link>
                <Link to="/tv">
                  <Button className="bg-red-600 hover:bg-red-700">
                    Browse TV Shows
                  </Button>
                </Link>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              {watchlist.map((item) => (
                <div
                  key={`${item.media_type}-${item.id}`}
                  className="bg-gray-900 rounded-lg overflow-hidden flex"
                >
                  <Link
                    to={`/${item.media_type}/${item.id}`}
                    className="w-24 md:w-32 flex-shrink-0"
                  >
                    <img
                      src={getImageUrl(item.poster_path, "w185")}
                      alt={item.title}
                      className="w-full h-full object-cover"
                    />
                  </Link>
                  <div className="p-4 flex-grow flex flex-col justify-between">
                    <div>
                      <Link to={`/${item.media_type}/${item.id}`}>
                        <h3 className="text-lg font-medium text-white hover:text-red-500 transition-colors">
                          {item.title}
                        </h3>
                      </Link>
                      <p className="text-sm text-gray-400 mt-1">
                        {item.media_type === "movie" ? "Movie" : "TV Show"}
                      </p>
                      <p className="text-xs text-gray-500 mt-1">
                        Added on {formatDate(item.added_at)}
                      </p>
                    </div>
                    <div className="mt-2">
                      <button
                        onClick={() => removeFromWatchlist(item.id)}
                        className="flex items-center text-sm text-red-500 hover:text-red-400"
                      >
                        <Trash2 className="h-4 w-4 mr-1" />
                        Remove
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </Container>
    </div>
  );
}
