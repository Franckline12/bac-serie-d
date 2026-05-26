import axios from "axios";

// Utilise l'URL du fichier d'environnement ou se rabat sur '/api' en local
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "/api",
  timeout: 10000,
});

// Intercepteur réponse : gestion erreur 401 globale
api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      localStorage.removeItem("token");
      delete api.defaults.headers.common["Authorization"];
      window.location.href = "/login";
    }
    return Promise.reject(err);
  },
);

export default api;
