import axios from 'axios';

const BASE = import.meta.env.VITE_API_URL
  ? import.meta.env.VITE_API_URL.replace('/auth', '')
  : 'http://localhost:5000/api/v1';

const userApi = axios.create({ baseURL: `${BASE}/users` });
const repositoryApi = axios.create({ baseURL: `${BASE}/repositories` });

const attachAuthHeader = (config) => {
  const state = JSON.parse(localStorage.getItem('auth-storage'));
  if (state?.state?.token) {
    config.headers.Authorization = `Bearer ${state.state.token}`;
  }
  return config;
};

userApi.interceptors.request.use(attachAuthHeader);
repositoryApi.interceptors.request.use(attachAuthHeader);

export const fetchUserProfile = async (username) => {
  const [{ data: userResponse }, { data: repositoriesResponse }] = await Promise.all([
    userApi.get(`/${username}`),
    repositoryApi.get(`/${username}`),
  ]);

  return {
    ...userResponse.data,
    repositories: repositoriesResponse?.data || [],
  };
};

export const followUser = async (username) => {
  const { data } = await userApi.post(`/${username}/follow`);
  return data;
};

export const unfollowUser = async (username) => {
  const { data } = await userApi.delete(`/${username}/follow`);
  return data;
};
