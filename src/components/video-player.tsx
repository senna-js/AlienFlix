import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Container } from "./ui/container";
import { Button } from "./ui/button";
import { ArrowLeft, Monitor, Settings } from "lucide-react";
import {
  availableSources,
  getSourceUrl,
  getDefaultSource,
  savePreferredSource,
  VideoSource,
} from "@/lib/video-sources";
import { getDetails } from "@/lib/tmdb";

interface VideoPlayerProps {
  mediaType?: string;
}

export default function VideoPlayer({ mediaType = "movie" }: VideoPlayerProps) {
  const { id, season, episode } = useParams<{
    id: string;
    season?: string;
    episode?: string;
  }>();
  const navigate = useNavigate();
  const [selectedSource, setSelectedSource] =
    useState<VideoSource>(getDefaultSource());
  const [showSourceMenu, setShowSourceMenu] = useState(false);
  const [details, setDetails] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchDetails = async () => {
      if (!id) return;

      try {
        setIsLoading(true);
        const data = await getDetails(mediaType, parseInt(id));
        setDetails(data);
        document.title = `Watch ${data.title || data.name} - AlienFlix`;
      } catch (error) {
        console.error(`Error fetching ${mediaType} details:`, error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDetails();
  }, [id, mediaType]);

  const handleSourceChange = (source: VideoSource) => {
    setSelectedSource(source);
    savePreferredSource(source.id);
    setShowSourceMenu(false);
  };

  const getVideoUrl = () => {
    if (!id) return "";
    return getSourceUrl(
      selectedSource,
      mediaType,
      id,
      season ? parseInt(season) : undefined,
      episode ? parseInt(episode) : undefined,
    );
  };

  const goBack = () => {
    navigate(-1);
  };

  if (isLoading || !details) {
    return (
      <div className="w-full h-screen bg-black flex items-center justify-center">
        <div className="text-white">Loading...</div>
      </div>
    );
  }

  const title = details.title || details.name;
  const seasonEpisodeInfo =
    mediaType === "tv" && season && episode
      ? `Season ${season} Episode ${episode}`
      : "";

  return (
    <div className="bg-black min-h-screen pt-16">
      <Container className="py-4">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center">
            <Button variant="ghost" className="text-white p-2" onClick={goBack}>
              <ArrowLeft className="h-5 w-5 mr-2" />
              Back
            </Button>
            <h1 className="text-xl md:text-2xl font-bold text-white ml-2">
              {title}{" "}
              {seasonEpisodeInfo && (
                <span className="text-gray-400">| {seasonEpisodeInfo}</span>
              )}
            </h1>
          </div>

          <div className="relative">
            <Button
              variant="outline"
              className="text-white border-white hover:bg-white/20"
              onClick={() => setShowSourceMenu(!showSourceMenu)}
            >
              <Monitor className="mr-2 h-4 w-4" />
              {selectedSource.name}
              <Settings className="ml-2 h-4 w-4" />
            </Button>

            {showSourceMenu && (
              <div className="absolute right-0 mt-2 w-56 rounded-md shadow-lg bg-gray-800 ring-1 ring-black ring-opacity-5 z-50 max-h-96 overflow-y-auto">
                <div className="py-1">
                  {availableSources.map((source) => (
                    <button
                      key={source.id}
                      className={`block w-full text-left px-4 py-2 text-sm ${selectedSource.id === source.id ? "bg-gray-700 text-white" : "text-gray-300 hover:bg-gray-700"}`}
                      onClick={() => handleSourceChange(source)}
                    >
                      {source.name}
                      {source.isFrench && (
                        <span className="ml-2 text-xs text-gray-400">
                          (French)
                        </span>
                      )}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="relative w-full" style={{ paddingTop: "56.25%" }}>
          {" "}
          {/* 16:9 aspect ratio */}
          <iframe
            src={getVideoUrl()}
            className="absolute top-0 left-0 w-full h-full rounded-lg"
            frameBorder="0"
            allowFullScreen
            title={`Watch ${title}`}
          ></iframe>
        </div>

        <div className="mt-4 text-gray-400 text-sm">
          <p>
            If the current server doesn't work, please try another server from
            the dropdown menu above.
          </p>
          <p className="mt-2">
            Note: Some servers may contain ads. We don't host any content; all
            videos are embedded from third-party sources.
          </p>
        </div>
      </Container>
    </div>
  );
}
