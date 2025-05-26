import { useState, useRef } from "react";
import { Link } from "react-router-dom";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { getImageUrl } from "@/lib/tmdb";

interface Movie {
  id: number;
  title?: string;
  name?: string;
  poster_path: string;
  media_type?: string;
}

interface MovieRowProps {
  title: string;
  movies: Movie[];
  mediaType?: string;
}

export default function MovieRow({
  title,
  movies,
  mediaType = "movie",
}: MovieRowProps) {
  const rowRef = useRef<HTMLDivElement>(null);
  const [showLeftArrow, setShowLeftArrow] = useState(false);
  const [showRightArrow, setShowRightArrow] = useState(true);

  const scroll = (direction: "left" | "right") => {
    if (rowRef.current) {
      const { scrollLeft, clientWidth } = rowRef.current;
      const scrollTo =
        direction === "left"
          ? scrollLeft - clientWidth * 0.75
          : scrollLeft + clientWidth * 0.75;

      rowRef.current.scrollTo({
        left: scrollTo,
        behavior: "smooth",
      });
    }
  };

  const handleScroll = () => {
    if (rowRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = rowRef.current;
      setShowLeftArrow(scrollLeft > 0);
      setShowRightArrow(scrollLeft < scrollWidth - clientWidth - 10);
    }
  };

  if (!movies || movies.length === 0) {
    return null;
  }

  return (
    <div className="py-6">
      <h2 className="text-xl md:text-2xl font-bold text-white mb-4">{title}</h2>
      <div className="relative group">
        {showLeftArrow && (
          <button
            className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-black/50 p-2 rounded-full"
            onClick={() => scroll("left")}
            aria-label="Scroll left"
          >
            <ChevronLeft className="h-6 w-6 text-white" />
          </button>
        )}

        <div
          ref={rowRef}
          className="flex overflow-x-scroll scrollbar-hide space-x-4 py-2"
          onScroll={handleScroll}
        >
          {movies.map((movie) => {
            const id = movie.id;
            const title = movie.title || movie.name || "Unknown Title";
            const type = movie.media_type || mediaType;
            const posterPath = movie.poster_path;

            return (
              <Link
                key={id}
                to={`/${type}/${id}`}
                className="flex-none w-[150px] md:w-[180px] transition-transform duration-300 hover:scale-105"
              >
                <div className="relative aspect-[2/3] rounded-md overflow-hidden bg-gray-800">
                  <img
                    src={getImageUrl(posterPath, "w342")}
                    alt={title}
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                </div>
                <h3 className="mt-2 text-sm text-gray-200 truncate">{title}</h3>
              </Link>
            );
          })}
        </div>

        {showRightArrow && (
          <button
            className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-black/50 p-2 rounded-full"
            onClick={() => scroll("right")}
            aria-label="Scroll right"
          >
            <ChevronRight className="h-6 w-6 text-white" />
          </button>
        )}
      </div>
    </div>
  );
}
