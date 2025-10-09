import axios from "axios";
import { base_url } from "../../api/axiosConfig";


// Send manual notification
const sendNotification = async (notificationData, token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
  const response = await axios.post(`${base_url}/notification/manual`, notificationData, config);
  return response.data;
};

// Send automatic notification
const sendAutomaticNotification = async (notificationData, token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
  const response = await axios.post(`${base_url}/notification/automatic`, notificationData, config);
  return response.data;
};

// Get all notifications (active + history)
const getNotifications = async (token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
  const response = await axios.get(`${base_url}/notification/`);
  return response.data;
};


const notificationService = {
  sendNotification,
  sendAutomaticNotification,
  getNotifications,
};

export default notificationService;
