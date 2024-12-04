"use server";

import axios from "axios";
import { getSessionToken } from "./get-session-token";
import { apiUrl } from "../api-url";

// get all promotion
export const fetchAllPromotions = async () => {
  const sessionToken = await getSessionToken();
  if (!sessionToken) {
    return { error: "No token found. Please login again." };
  }

  try {
    const response = await axios.get(`${apiUrl}/api/promotions`, {
      headers: {
        Authorization: `Bearer ${sessionToken}`,
      },
    });

    return response.data;
  } catch (error) {
    const errorMessage = error.response?.data || error.message;
    console.error("Failed to fetch all promotions:", errorMessage);

    return {
      error: errorMessage || "An error occurred while fetching the promotions.",
    };
  }
};

// get promotion by id
export const fetchPromotionById = async (promotionId) => {
  const sessionToken = await getSessionToken();
  if (!sessionToken) {
    return { error: "No token found. Please login again." };
  }

  try {
    const response = await axios.get(
      `${apiUrl}/api/promotions/${promotionId}`,
      { headers: { Authorization: `Bearer ${sessionToken}` } }
    );

    return response.data;
  } catch (error) {
    const errorMessage = error.response?.data || error.message;
    console.error("Failed to fetch promotion:", errorMessage);

    return {
      error: "An error occurred while fetching the promotion.",
    };
  }
};

// create a new promotion
export const createPromotion = async (data) => {
  const sessionToken = await getSessionToken();
  if (!sessionToken) {
    return { error: "No token found. Please login again." };
  }

  try {
    const response = await axios.post(`${apiUrl}/api/promotions`, data, {
      headers: { Authorization: `Bearer ${sessionToken}` },
    });

    return response.data;
  } catch (error) {
    const errorMessage = error.response?.data || error.message;
    console.error("Failed to create promotion:", errorMessage);

    return {
      error: "An error occurred while creating the promotion.",
    };
  }
};

// update promotion
export const updatePromotion = async (data) => {
  const sessionToken = await getSessionToken();
  if (!sessionToken) {
    return { error: "No token found. Please login again." };
  }

  try {
    const response = await axios.patch(
      `${apiUrl}/api/promotions/${data.id}`,
      data,
      { headers: { Authorization: `Bearer ${sessionToken}` } }
    );

    return response.data;
  } catch (error) {
    const errorMessage = error.response?.data || error.message;
    console.error("Failed to update promotion:", errorMessage);

    return {
      error: "An error occurred while updating the promotion.",
    };
  }
};

// delete promotion
export const deletePromotion = async (promotionId) => {
  const sessionToken = await getSessionToken();
  if (!sessionToken) {
    return { error: "No token found. Please login again." };
  }

  try {
    const response = await axios.delete(
      `${apiUrl}/api/promotions/${promotionId}`,
      { headers: { Authorization: `Bearer ${sessionToken}` } }
    );

    return response.data;
  } catch (error) {
    const errorMessage = error.response?.data || error.message;
    console.error("Failed to delete promotion:", errorMessage);

    return {
      error: "An error occurred while deleting the promotion.",
    };
  }
};

// verify promotion code
export const fetchPromotionByCode = async (code) => {
  const sessionToken = await getSessionToken();
  if (!sessionToken) {
    return { error: "No token found. Please login again." };
  }

  try {
    const response = await axios.get(`${apiUrl}/api/promotions/by_code`, {
      params: {
        params: {
          code,
        },
      },
      headers: {
        Authorization: `Bearer ${sessionToken}`,
      },
    });

    return response.data;
  } catch (error) {
    const errorMessage =
      error.response?.data?.error || error.response?.data || error.message;
    console.error("Failed to verify promotion code:", errorMessage);

    return {
      error:
        errorMessage || "An error occurred while verifying the promotion code.",
    };
  }
};
