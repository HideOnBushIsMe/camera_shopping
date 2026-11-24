import axios from "axios";

const userApi = axios.create({
  baseURL:
    import.meta.env.VITE_USERS_API_URL ||
    "https://6aead7a93d3dd3d37be7523b.mockapi.io/users",
  headers: {
    "Content-Type": "application/json",
  },
});

export default userApi;
