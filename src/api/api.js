import axios from "axios";

const API_URL = "http://localhost:8000";

export const getAlbums = async (page = 1, limit = 10) => {
  const response = await axios.get(`${API_URL}/albums`, {
    params: { page, limit },
  });
  return response.data;
};

export const getAlbumById = async (id) => {
  const response = await axios.get(`${API_URL}/albums/${id}`);
  return response.data;
};

export const getArtists = async () => {
  const response = await axios.get(`${API_URL}/artists`);
  return response.data;
};

export const getArtistById = async (id) => {
  const response = await axios.get(`${API_URL}/artists/${id}`);
  return response.data;
};

export const getGenres = async () => {
  const response = await axios.get(`${API_URL}/genres`);
  return response.data;
};

export const getGenreById = async (id) => {
  const response = await axios.get(`${API_URL}/genres/${id}`);
  return response.data;
};

export const getAlbumsByArtist = async (id) => {
  const response = await axios.get(`${API_URL}/albums/artist/${id}`);
  return response.data;
};

export const getTrackById = async (id) => {
  const response = await axios.get(`${API_URL}/tracks/${id}`);
  return response.data;
};

export const search = async (query, type) => {
  const response = await axios.get(`${API_URL}/search`, {
    params: { query, type },
  });
  return response.data;
};
