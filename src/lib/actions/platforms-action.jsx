"use server";

import axios from "axios";
import { getSessionToken } from "./get-session-token";
import { apiUrl } from "../api-url";

// get platforms
export const fetchPlatforms = async () => {
  try {
    const { data } = await axios.get(`${apiUrl}/api/platforms`);

    return data;
  } catch (error) {
    return { error: "Failed to fetch platforms. Please try again!" };
  }
};

// add platform
export const addPlatform = async (platformData) => {
  try {
    const sessionToken = await getSessionToken();

    const response = await axios.post(
      `${apiUrl}/api/platforms`,
      { name: platformData.name },
      {
        headers: {
          Authorization: `Bearer ${sessionToken}`,
        },
      }
    );

    return response.data;
  } catch (error) {
    const errorMessage = error.response?.data?.error || error.message;
    console.error("Failed to add platform:", errorMessage);

    return {
      error: errorMessage || "An error occurred while adding the platform.",
    };
  }
};

// update platform
export const updatePlatform = async (platformData) => {
  try {
    const sessionToken = await getSessionToken();

    const response = await axios.put(
      `${apiUrl}/api/platforms/${platformData.id}`,
      { name: platformData.name },
      {
        headers: {
          Authorization: `Bearer ${sessionToken}`,
        },
      }
    );

    return response.data;
  } catch (error) {
    const errorMessage = error.response?.data?.error || error.message;
    console.error("Failed to update platform:", errorMessage);

    return {
      error: errorMessage || "An error occurred while updating the platform.",
    };
  }
};

// delete platform
export const deletePlatform = async (platformId) => {
  try {
    const sessionToken = await getSessionToken();

    const response = await axios.delete(
      `${apiUrl}/api/platforms/${platformId}`,
      {
        headers: {
          Authorization: `Bearer ${sessionToken}`,
        },
      }
    );

    return response.data;
  } catch (error) {
    const errorMessage = error.response?.data.error || error.message;
    console.error("Failed to delete platform:", errorMessage);

    return {
      error: errorMessage || "An error occurred while deleting the platform.",
    };
  }
};

// need to check from here

// get subplatforms
export const fetchSubplatforms = async (id) => {
  try {
    const sessionToken = await getSessionToken();

    if (!id || !sessionToken) {
      return { error: "Failed to fetch subplatforms. Please try again!" };
    }

    const { data } = await axios.get(
      `${apiUrl}/api/platforms/${id}/sub_platforms`,
      {
        headers: {
          Authorization: `Bearer ${sessionToken}`,
        },
      }
    );

    return data;
  } catch (error) {
    return { error: "Failed to fetch subplatforms. Please try again!" };
  }
};

// add subplatform
export const addSubplatform = async (subplatformData) => {
  try {
    const sessionToken = await getSessionToken();

    const response = await axios.post(
      `${apiUrl}/api/subplatforms`,
      { name: subplatformData.name },
      {
        headers: {
          Authorization: `Bearer ${sessionToken}`,
        },
      }
    );

    return response.data;
  } catch (error) {
    const errorMessage = error.response?.data?.error || error.message;
    console.error("Failed to add subplatform:", errorMessage);

    return {
      error: errorMessage || "An error occurred while adding the subplatform.",
    };
  }
};

// update subplatform
export const updateSubplatform = async (subplatformData) => {
  try {
    const sessionToken = await getSessionToken();

    const response = await axios.put(
      `${apiUrl}/api/subplatforms/${subplatformData.id}`,
      { name: subplatformData.name },
      {
        headers: {
          Authorization: `Bearer ${sessionToken}`,
        },
      }
    );

    return response.data;
  } catch (error) {
    const errorMessage = error.response?.data?.error || error.message;
    console.error("Failed to update subplatform:", errorMessage);

    return {
      error:
        errorMessage || "An error occurred while updating the subplatform.",
    };
  }
};

// delete subplatform
export const deleteSubplatform = async (subplatformId) => {
  try {
    const sessionToken = await getSessionToken();

    const response = await axios.delete(
      `${apiUrl}/api/subplatforms/${subplatformId}`,
      {
        headers: {
          Authorization: `Bearer ${sessionToken}`,
        },
      }
    );

    return response.data;
  } catch (error) {
    const errorMessage = error.response?.data.error || error.message;
    console.error("Failed to delete subplatform:", errorMessage);

    return {
      error:
        errorMessage || "An error occurred while deleting the subplatform.",
    };
  }
};
