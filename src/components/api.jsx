import axios from 'axios';

const API_KEY = 'e1aee8ae';
const BASE_URL = 'http://www.omdbapi.com/';

export const searchMovies = async (title) => {
  const response = await axios.get(`${BASE_URL}?s=${title}&apikey=${API_KEY}`);
  return response.data;
};

export const getMovieDetails = async (id) => {
  const response = await axios.get(`${BASE_URL}?i=${id}&apikey=${API_KEY}`);
  return response.data;
};
