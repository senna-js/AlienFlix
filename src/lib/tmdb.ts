import axios from "axios";

const API_KEY = "3c43b1c1535b1139928eb792e07995c8";
const BASE_URL = "https://api.themoviedb.org/3";
const IMAGE_BASE_URL = "https://image.tmdb.org/t/p/";

export const POSTER_SIZE = {
  small: "w185",
  medium: "w342",
  large: "w500",
  original: "original",
};

export const BACKDROP_SIZE = {
  small: "w300",
  medium: "w780",
  large: "w1280",
  original: "original",
};

const tmdbApi = axios.create({
  baseURL: BASE_URL,
  params: {
    api_key: API_KEY,
    language: "en-US",
  },
});

export const getImageUrl = (path: string | null, size = POSTER_SIZE.medium) => {
  if (!path) return "https://via.placeholder.com/342x513?text=No+Image";
  return `${IMAGE_BASE_URL}${size}${path}`;
};

export const getBackdropUrl = (
  path: string | null,
  size = BACKDROP_SIZE.large,
) => {
  if (!path) return "https://via.placeholder.com/1280x720?text=No+Image";
  return `${IMAGE_BASE_URL}${size}${path}`;
};

export const getTrending = async (
  mediaType = "all",
  timeWindow = "day",
  page = 1,
) => {
  const response = await tmdbApi.get(`/trending/${mediaType}/${timeWindow}`, {
    params: { page },
  });
  return response.data;
};

export const getPopular = async (mediaType = "movie", page = 1) => {
  const response = await tmdbApi.get(`/${mediaType}/popular`, {
    params: { page },
  });
  return response.data;
};

export const getTopRated = async (mediaType = "movie", page = 1) => {
  const response = await tmdbApi.get(`/${mediaType}/top_rated`, {
    params: { page },
  });
  return response.data;
};

export const getUpcoming = async (page = 1) => {
  const response = await tmdbApi.get("/movie/upcoming", {
    params: { page },
  });
  return response.data;
};

export const getAiringToday = async (page = 1) => {
  const response = await tmdbApi.get("/tv/airing_today", {
    params: { page },
  });
  return response.data;
};

export const getDetails = async (mediaType = "movie", id: number) => {
  const response = await tmdbApi.get(`/${mediaType}/${id}`, {
    params: {
      append_to_response: "videos,credits,similar,recommendations",
    },
  });
  return response.data;
};

export const searchMulti = async (query: string, page = 1) => {
  const response = await tmdbApi.get("/search/multi", {
    params: { query, page },
  });
  return response.data;
};

export default tmdbApi;
