import axios from "axios";

export const getSentiment = async (text) => {
  try {
    const response = await axios.post(process.env.FASTAPI_URL, { text });
    return response.data.sentiment;
  } catch (error) {
    console.error("Error getting sentiment:", error);
    return null;
  }
};
