import Axios from "axios";

// Instância do Axios para fazer requisições
const axiosApp = Axios.create({
  baseURL: "http://localhost:3001", // Define a baseURL diretamente aqui
  timeout: 20000,
});

axiosApp.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");

    if (token) {
      config.headers.Authorization = `Bearer ${JSON.parse(token)}`;
    } else {
    }

    return config;
  },
  (error) => {
    // Captura erros de configuração de requisição
    return Promise.reject(error);
  }
);

axiosApp.interceptors.response.use(
  (response) => {
    // Captura a resposta antes de resolvê-la
    return response;
  },
  (error) => {
    // Captura erros de resposta, como 4xx ou 5xx
    return Promise.reject(error);
  }
);

export default axiosApp;
