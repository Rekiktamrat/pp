import axios from "axios";
import { base_url } from "../../api/axiosConfig";

const API_URL = `${base_url}/notification/schedule`;

// Helper to get auth headers
const getAuthHeaders = async () => {
  const userData = await localStorage.getItem("admin");
  const getTokenFromLocalStorage = userData ? JSON.parse(userData) : null;
  return {
    Authorization: `Bearer ${
      getTokenFromLocalStorage ? getTokenFromLocalStorage.token : ""
    }`,
    Accept: "application/json",
  };
};

const getAll = async () => {
  const headers = await getAuthHeaders();
  const response = await axios.get(`${API_URL}-notifications`, {
    headers,
    withCredentials: true,
  });
  return response.data;
};

const create = async (data) => {
  const headers = await getAuthHeaders();
  const response = await axios.post(`${API_URL}/send`, data, {
    headers,
    withCredentials: true,
  });
  return response.data;
};

const update = async (id, data) => {
  const headers = await getAuthHeaders();
  const response = await axios.put(`${API_URL}/${id}`, data, {
    headers,
    withCredentials: true,
  });
  return response.data;
};

const remove = async (id) => {
  const headers = await getAuthHeaders();
  const response = await axios.delete(`${API_URL}/${id}`, {
    headers,
    withCredentials: true,
  });
  return response.data;
};

const runManual = async (id) => {
  const headers = await getAuthHeaders();
  const response = await axios.post(
    `${API_URL}/run/${id}`,
    {},
    {
      headers,
      withCredentials: true,
    }
  );
  return response.data;
};

const scheduledNotificationService = {
  getAll,
  create,
  update,
  remove,
  runManual,
};

export default scheduledNotificationService;
