import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Container } from "./ui/container";
import { Button } from "./ui/button";
import { Play, Plus, Star } from "lucide-react";
import MovieRow from "./movie-row";
import { getDetails, getImageUrl, getBackdropUrl } from "@/lib/tmdb";

interface MovieDetailsProps {
  mediaType?: string;
}

export default function MovieDetails({
  mediaType = "movie",
}: MovieDetailsProps) {
  const { id } = useParams<{ id: string }>();
  const [details, setDetails] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchDetails = async () => {
      if (!id) return;

      try {
        setIsLoading(true);
        const data = await getDetails(mediaType, parseInt(id));
        setDetails(data);
      } catch (error) {
        console.error(`Error fetching ${mediaType} details:`, error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDetails();
  }, [id, mediaType]);

  if (isLoading || !details) {
    return (
      <div className="w-full h-screen bg-black flex items-center justify-center">
        <div className="text-white">Loading...</div>
      </div>
    );
  }

  const title = details.title || details.name;
  const releaseDate = details.release_date || details.first_air_date;
  const year = releaseDate ? new Date(releaseDate).getFullYear() : "";

  // Format runtime from minutes to hours and minutes
  const formatRuntime = (minutes: number) => {
    if (!minutes) return "";
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}h ${mins}m`;
  };

  // For TV shows, get the number of seasons and episodes
  const seasonsInfo = details.number_of_seasons
    ? `${details.number_of_seasons} Season${details.number_of_seasons > 1 ? "s" : ""}`
    : "";
  const episodesInfo = details.number_of_episodes
    ? `${details.number_of_episodes} Episode${details.number_of_episodes > 1 ? "s" : ""}`
    : "";

  // Get director for movies or creators for TV shows
  const directors =
    mediaType === "movie"
      ? details.credits?.crew
          ?.filter((person: any) => person.job === "Director")
          .map((director: any) => director.name)
          .join(", ")
      : "";

  const creators =
    mediaType === "tv" && details.created_by?.length > 0
      ? details.created_by.map((creator: any) => creator.name).join(", ")
      : "";

  // Get main cast
  const cast = details.credits?.cast
    ?.slice(0, 5)
    .map((actor: any) => actor.name)
    .join(", ");

  // Get trailer
  const trailer = details.videos?.results?.find(
    (video: any) => video.type === "Trailer" && video.site === "YouTube",
  );

  return (
    <div className="bg-black min-h-screen pt-16">
      {/* Hero Section with Backdrop */}
      <div className="relative w-full h-[70vh]">
        <div className="absolute inset-0">
          <img
            src={getBackdropUrl(details.backdrop_path, "original")}
            alt={title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black via-black/70 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/10 to-transparent" />
        </div>

        <Container className="relative h-full flex items-center">
          <div className="flex flex-col md:flex-row gap-8 items-start">
            {/* Poster */}
            <div className="hidden md:block w-64 flex-shrink-0">
              <img
                src={getImageUrl(details.poster_path, "w500")}
                alt={title}
                className="w-full rounded-md shadow-lg"
              />
            </div>

            {/* Details */}
            <div className="flex-1">
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-2">
                {title}{" "}
                {year && <span className="text-gray-400">({year})</span>}
              </h1>

              <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-gray-300 mb-4">
                {details.vote_average > 0 && (
                  <div className="flex items-center">
                    <Star className="h-4 w-4 text-yellow-400 mr-1" />
                    <span>{details.vote_average.toFixed(1)}/10</span>
                  </div>
                )}
                {releaseDate && (
                  <span>{new Date(releaseDate).toLocaleDateString()}</span>
                )}
                {details.runtime > 0 && (
                  <span>{formatRuntime(details.runtime)}</span>
                )}
                {seasonsInfo && <span>{seasonsInfo}</span>}
                {episodesInfo && <span>{episodesInfo}</span>}
              </div>

              {details.genres && details.genres.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-4">
                  {details.genres.map((genre: any) => (
                    <span
                      key={genre.id}
                      className="px-3 py-1 bg-gray-800 text-gray-300 text-xs rounded-full"
                    >
                      {genre.name}
                    </span>
                  ))}
                </div>
              )}

              {details.tagline && (
                <p className="text-gray-400 italic mb-4">"{details.tagline}"</p>
              )}

              <div className="mb-6">
                <h3 className="text-white text-lg font-medium mb-2">
                  Overview
                </h3>
                <p className="text-gray-300">{details.overview}</p>
              </div>

              {(directors || creators) && (
                <div className="mb-2">
                  <span className="text-gray-400">
                    {mediaType === "movie" ? "Director: " : "Creator: "}
                  </span>
                  <span className="text-white">{directors || creators}</span>
                </div>
              )}

              {cast && (
                <div className="mb-6">
                  <span className="text-gray-400">Cast: </span>
                  <span className="text-white">{cast}</span>
                </div>
              )}

              <div className="flex flex-wrap gap-3">
                <Button
                  className="bg-red-600 hover:bg-red-700"
                  onClick={() => {
                    if (mediaType === "movie") {
                      window.location.href = `/watch/movie/${id}`;
                    } else {
                      // For TV shows, we need the first season and episode
                      // Default to season 1, episode 1 if not available
                      const firstSeason =
                        details.seasons?.find((s: any) => s.season_number > 0)
                          ?.season_number || 1;
                      window.location.href = `/watch/tv/${id}/season/${firstSeason}/episode/1`;
                    }
                  }}
                >
                  <Play className="mr-2 h-4 w-4" /> Watch Now
                </Button>
                {trailer && (
                  <a
                    href={`https://www.youtube.com/watch?v=${trailer.key}`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Button variant="secondary">Watch Trailer</Button>
                  </a>
                )}
                <Button variant="info">
                  <Plus className="mr-2 h-4 w-4" /> Add to Watchlist
                </Button>
              </div>
            </div>
          </div>
        </Container>
      </div>

      {/* Similar and Recommended */}
      <Container className="py-12">
        {details.similar?.results?.length > 0 && (
          <MovieRow
            title={`Similar ${mediaType === "movie" ? "Movies" : "TV Shows"}`}
            movies={details.similar.results}
            mediaType={mediaType}
          />
        )}

        {details.recommendations?.results?.length > 0 && (
          <MovieRow
            title="Recommendations"
            movies={details.recommendations.results}
            mediaType={mediaType}
          />
        )}
      </Container>
    </div>
  );
}
