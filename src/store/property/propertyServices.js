import { base_url } from "../../api/axiosConfig";
import axios from "axios";

const getAllProperties = async () => {
  const userData = await localStorage.getItem("admin");
  const getTokenFromLocalStorage = userData ? JSON.parse(userData) : null;

  const headers = {
    Authorization: `Bearer ${
      getTokenFromLocalStorage ? getTokenFromLocalStorage.token : ""
    }`,
  };
  const response = await axios.get(`${base_url}/property/all-properties`, {
    headers,
    withCredentials: true,
  });
  return response.data;
};

const deleteProperty = async (id) => {
  const response = await axios.delete(
    `${base_url}/property/delete-property/${id}`
  );
  return response.data;
};

const editProperty = async (data) => {
  console.log(data);
  const response = await axios.put(
    `${base_url}/properties/${data.id}`,
    data.name
  );
  return response.data;
};

const propertyService = {
  getAllProperties,
  deleteProperty,
  editProperty,
};
export default propertyService;
