import { base_url } from "../../api/axiosConfig";
import axios from "axios";

// Admin Register
const adminRegister = async (data) => {
  const response = await axios.post(`${base_url}/admin/register`, data);
  return response.data;
};

// Admin Login
const adminLogin = async (data) => {
  const response = await axios.post(`${base_url}/admin/login`, data);
  if (response.data) {
    localStorage.setItem("admin", JSON.stringify(response.data));
  }
  return response.data;
};

// Update Profile
const updateProfile = async (data) => {
  const response = await axios.put(`${base_url}/profile/update`, data);
  return response.data;
};

// Change Dark Mode Preference
const changeDarkMode = async (data) => {
  const response = await axios.put(`${base_url}/profile/darkmode`, data);
  return response.data;
};

const authService = {
  adminRegister,
  adminLogin,
  updateProfile,
  changeDarkMode,
};

export default authService;
