"use server";

import axios from "axios";
import { getSessionToken } from "./get-session-token";
import { apiUrl } from "../api-url";

// get all promotion
export const fetchAllPromotions = async () => {
  try {
    const sessionToken = await getSessionToken();

    if (!sessionToken) {
      return { error: "No token found. Please login again." };
    }

    const { data } = await axios.get(`${apiUrl}/promotions`, {
      headers: {
        Authorization: `Bearer ${sessionToken}`,
      },
    });

    return data;
  } catch (error) {
    const errorMessage = error.response?.data || error.message;
    console.error("Failed to fetch all promotions:", errorMessage);

    return {
      error: errorMessage || "An error occurred while fetching the promotions.",
    };
  }
};
