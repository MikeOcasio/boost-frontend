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

// get platform by id
export const fetchPlatformById = async (platformId) => {
  try {
    const { data } = await axios.get(`${apiUrl}/api/platforms/${platformId}`);

    return data;
  } catch (error) {
    return { error: "Failed to fetch platform by id. Please try again!" };
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

export const enableSubplatform = async (platformData) => {
  try {
    const sessionToken = await getSessionToken();

    const response = await axios.put(
      `${apiUrl}/api/platforms/${platformData.id}`,
      { has_sub_platforms: platformData.has_sub_platforms },
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
export const addSubplatform = async (data, platformId) => {
  try {
    const sessionToken = await getSessionToken();
    if (!sessionToken) {
      return { error: "Failed to add subplatform. Please try again!" };
    }

    const response = await axios.post(
      `${apiUrl}/api/platforms/${platformId}/sub_platforms`,
      {
        sub_platform: {
          name: data.name,
        },
      },
      {
        headers: {
          Authorization: `Bearer ${sessionToken}`,
        },
      }
    );

    return response.data;
  } catch (error) {
    const errorMessage = error.response?.data?.message || error.message;
    console.error("Failed to add subplatform:", error);

    return {
      error: errorMessage || "An error occurred while adding the subplatform.",
    };
  }
};

// update subplatform
export const updateSubplatform = async (data, platformId) => {
  try {
    const sessionToken = await getSessionToken();
    if (!sessionToken) {
      return { error: "Failed to add subplatform. Please try again!" };
    }

    const response = await axios.put(
      `${apiUrl}/api/platforms/${platformId}/sub_platforms/${data.id}`,
      {
        sub_platform: {
          name: data.name,
        },
      },
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
export const deleteSubplatform = async (platformId, subPlatformId) => {
  try {
    const sessionToken = await getSessionToken();
    if (!sessionToken) {
      return { error: "Failed to add subplatform. Please try again!" };
    }

    const response = await axios.delete(
      `${apiUrl}/api/platforms/${platformId}/sub_platforms/${subPlatformId}`,
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
