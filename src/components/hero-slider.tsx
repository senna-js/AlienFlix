import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Button } from "./ui/button";
import { Play, Info } from "lucide-react";
import { getTrending, getBackdropUrl } from "@/lib/tmdb";

interface Movie {
  id: number;
  title?: string;
  name?: string;
  backdrop_path: string;
  overview: string;
  media_type: string;
  vote_average: number;
  release_date?: string;
  first_air_date?: string;
}

export default function HeroSlider() {
  const [trending, setTrending] = useState<Movie[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchTrending = async () => {
      try {
        const data = await getTrending("all", "day");
        // Filter to only include items with backdrop images and limit to 5
        const filteredResults = data.results
          .filter((item: Movie) => item.backdrop_path)
          .slice(0, 5);
        setTrending(filteredResults);
      } catch (error) {
        console.error("Error fetching trending:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchTrending();
  }, []);

  useEffect(() => {
    if (trending.length > 0) {
      const interval = setInterval(() => {
        setCurrentIndex((prevIndex) => (prevIndex + 1) % trending.length);
      }, 8000);
      return () => clearInterval(interval);
    }
  }, [trending]);

  const currentItem = trending[currentIndex];

  if (isLoading || !currentItem) {
    return (
      <div className="w-full h-[80vh] bg-gray-900 animate-pulse flex items-center justify-center">
        <div className="text-gray-500">Loading...</div>
      </div>
    );
  }

  const title = currentItem.title || currentItem.name || "";
  const releaseDate =
    currentItem.release_date || currentItem.first_air_date || "";
  const year = releaseDate ? new Date(releaseDate).getFullYear() : "";
  const rating = currentItem.vote_average.toFixed(1);
  const mediaType = currentItem.media_type === "tv" ? "TV Show" : "Movie";
  const detailsUrl = `/${currentItem.media_type}/${currentItem.id}`;

  return (
    <div className="relative w-full h-[80vh] overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0">
        <img
          src={getBackdropUrl(currentItem.backdrop_path, "original")}
          alt={title}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black via-black/70 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/10 to-transparent" />
      </div>

      {/* Content */}
      <div className="absolute inset-0 flex items-center">
        <div className="container mx-auto px-4 md:px-8 lg:px-16 max-w-7xl">
          <div className="max-w-2xl">
            <div className="flex items-center space-x-3 mb-3">
              <span className="bg-red-600 text-white px-2 py-1 text-xs font-medium rounded">
                {mediaType}
              </span>
              {year && <span className="text-gray-300 text-sm">{year}</span>}
              <span className="flex items-center text-yellow-400 text-sm">
                ★ {rating}
              </span>
            </div>

            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4">
              {title}
            </h1>

            <p className="text-gray-300 text-base md:text-lg mb-8 line-clamp-3">
              {currentItem.overview}
            </p>

            <div className="flex flex-wrap gap-4">
              <Button className="bg-red-600 hover:bg-red-700 text-white">
                <Play className="mr-2 h-4 w-4" /> Watch Now
              </Button>
              <Link to={detailsUrl}>
                <Button
                  variant="outline"
                  className="text-white border-white hover:bg-white/20"
                >
                  <Info className="mr-2 h-4 w-4" /> More Info
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Indicators */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex space-x-2">
        {trending.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentIndex(index)}
            className={`w-3 h-3 rounded-full ${index === currentIndex ? "bg-red-600" : "bg-gray-500"}`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
}
