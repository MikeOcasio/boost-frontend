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
    // const errorMessage = error.response?.data || error.message;
    // console.error("Failed to fetch all skillmasters:", errorMessage);

    return {
      error: "An error occurred while fetching the skillmasters.",
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
    // const errorMessage = error.response?.data || error.message;
    // console.error("Failed to fetch skillmaster:", errorMessage);

    return {
      error: "An error occurred while fetching the skillmaster.",
    };
  }
};

// get all skillmaster applications
export const fetchAllSkillmasterApplications = async () => {
  const sessionToken = await getSessionToken();
  if (!sessionToken) {
    return { error: "No token found. Please login again." };
  }

  try {
    const { data } = await axios.get(
      `${apiUrl}/users/skillmaster_applications`,
      {
        headers: {
          Authorization: `Bearer ${sessionToken}`,
        },
      }
    );

    return data;
  } catch (error) {
    const errorMessage = error.response?.data || error.message;
    console.error("Failed to fetch applications:", errorMessage);

    return {
      error: "An error occurred while fetching the applications.",
    };
  }
};

// get skillmaster application by id
export const fetchSkillmasterApplicationById = async (id) => {
  try {
    const sessionToken = await getSessionToken();
    if (!sessionToken) {
      return { error: "No token found. Please login again." };
    }

    const { data } = await axios.get(
      `${apiUrl}/users/skillmaster_applications/${id}`,
      {
        headers: {
          Authorization: `Bearer ${sessionToken}`,
        },
      }
    );

    return data;
  } catch (error) {
    const errorMessage = error.response?.data || error.message;
    console.error("Failed to fetch skillmaster application:", errorMessage);

    return {
      error: "An error occurred while fetching the skillmaster application.",
    };
  }
};

// create a new skillmaster application
export const createSkillmasterApplication = async (
  name,
  email,
  message,
  images,
  channels
) => {
  const sessionToken = await getSessionToken();
  if (!sessionToken) {
    return { error: "No token found. Please login again." };
  }

  try {
    const response = await axios.post(
      `${apiUrl}/users/skillmaster_applications`,
      {
        gamer_tag: name,
        email: email,
        reasons: message,
        images: images,
        channels: channels,
      },
      {
        headers: {
          Authorization: `Bearer ${sessionToken}`,
        },
      }
    );
    const data = response.data;
    return data;
  } catch (error) {
    const errorMessage =
      error.response?.data?.error || error.response?.data || error.message;
    console.error("Failed to submit application:", errorMessage);

    return {
      error:
        errorMessage || "An error occurred while submitting the application.",
    };
  }
};

// update skillmaster application
export const updateSkillmasterApplication = async ({ id, status, userId }) => {
  const sessionToken = await getSessionToken();
  if (!sessionToken) {
    return { error: "No token found. Please login again." };
  }

  try {
    const response = await axios.patch(
      `${apiUrl}/users/skillmaster_applications/${id}`,
      {
        status: status,
        reviewer_id: userId,
        reviewed_at: new Date(),
      },
      {
        headers: {
          Authorization: `Bearer ${sessionToken}`,
        },
      }
    );

    return response.data;
  } catch (error) {
    const errorMessage = error.response?.data || error.message;
    console.error("Failed to update application:", errorMessage);

    return {
      error: "An error occurred while updating the application.",
    };
  }
};
