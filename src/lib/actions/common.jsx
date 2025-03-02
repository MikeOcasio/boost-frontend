"use server";

import axios from "axios";
import { apiUrl } from "../api-url";

// get categories
export const checkAppStatus = async () => {
  try {
    const { data } = await axios.get(`${apiUrl}/api/app_status`);

    return data;
  } catch (error) {
    return { error: "Failed to fetch app status. Please try again!" };
  }
};
