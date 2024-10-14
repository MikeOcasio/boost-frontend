"use server";

import axios from "axios";
import { getSessionToken } from "./get-session-token";
import { apiUrl } from "../api-url";

// get all skillmasters
export const fetchAllSkillmasters = async () => {
  try {
    const sessionToken = await getSessionToken();

    if (!sessionToken) {
      return { error: "No token found. Please login again." };
    }

    const { data } = await axios.get(
      `${apiUrl}/users/member-data/skillmasters`,
      {
        headers: {
          Authorization: `Bearer ${sessionToken}`,
        },
      }
    );

    return data;
  } catch (error) {
    const errorMessage = error.response?.data || error.message;
    console.error("Failed to fetch all skillmasters:", errorMessage);

    return {
      error:
        errorMessage || "An error occurred while fetching the skillmasters.",
    };
  }
};

// get skillmaster by id
export const fetchSkillmasterById = async (skillmasterId) => {
  try {
    const sessionToken = await getSessionToken();
    if (!sessionToken) {
      return { error: "No token found. Please login again." };
    }

    const { data } = await axios.get(
      `${apiUrl}/users/member-data/:id/skillmasters/${skillmasterId}`,
      {
        headers: {
          Authorization: `Bearer ${sessionToken}`,
        },
      }
    );

    return data;
  } catch (error) {
    const errorMessage = error.response?.data || error.message;
    console.error("Failed to fetch skillmaster:", errorMessage);

    return {
      error:
        errorMessage || "An error occurred while fetching the skillmaster.",
    };
  }
};
