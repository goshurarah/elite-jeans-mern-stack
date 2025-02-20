import axios from "axios";

// const api = axios.create({
//   baseURL: "http://localhost:5000",
// });
const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL,
});
export const getAllWorkOrder = async (page = 1) => {
  try {
    const response = await axios.get(`/api/work-orders?page=${page}`);

    return response.data; // Return the data for further use
  } catch (error) {
    console.error("Error fetching tech packs:", error);
    throw error;
  }
};

export const deleteWorkOrder = async (techPackId) => {
  try {
    await api.delete(`/api/work-orders/${techPackId}`);
    return techPackId;
  } catch (error) {
    console.error("Error deleting tech pack:", error);
    throw error;
  }
};
