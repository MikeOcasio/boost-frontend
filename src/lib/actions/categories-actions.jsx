"use server";

import axios from "axios";
import { getSessionToken } from "./get-session-token";
import { apiUrl } from "../api-url";

// get categories
export const fetchCategories = async () => {
  try {
    const { data } = await axios.get(`${apiUrl}/api/categories`);

    return data;
  } catch (error) {
    return { error: "Failed to fetch categories. Please try again!" };
  }
};

// add category
export const addCategory = async (categoryData) => {
  try {
    const sessionToken = await getSessionToken();

    const response = await axios.post(
      `${apiUrl}/api/categories`,
      {
        name: categoryData.name,
        description: categoryData.description,
        is_active: categoryData.is_active,
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
    console.error("Failed to add category:", errorMessage);

    return {
      error: errorMessage || "An error occurred while adding the category.",
    };
  }
};

// update category
export const updateCategory = async (categoryData) => {
  try {
    const sessionToken = await getSessionToken();

    const response = await axios.put(
      `${apiUrl}/api/categories/${categoryData.id}`,
      {
        name: categoryData.name,
        description: categoryData.description,
        is_active: categoryData.is_active,
        image: categoryData.image,
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
    console.error("Failed to update category:", errorMessage);

    return {
      error: errorMessage || "An error occurred while updating the category.",
    };
  }
};

// delete category
export const deleteCategory = async (categoryId) => {
  try {
    const sessionToken = await getSessionToken();

    const response = await axios.delete(
      `${apiUrl}/api/categories/${categoryId}`,
      {
        headers: {
          Authorization: `Bearer ${sessionToken}`,
        },
      }
    );

    return response.data;
  } catch (error) {
    const errorMessage = error.response?.data || error.message;
    console.error("Failed to delete category:", errorMessage);

    return {
      error: errorMessage || "An error occurred while deleting the category.",
    };
  }
};
