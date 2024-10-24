"use server";

import axios from "axios";
import { getSessionToken } from "./get-session-token";
import { apiUrl } from "../api-url";

// get all games
export const fetchAllGames = async () => {
  try {
    const { data } = await axios.get(`${apiUrl}/api/products`);

    return data;
  } catch (error) {
    return { error: "Failed to fetch all games. Please try again!" };
  }
};

// get game by id
export const fetchGameById = async (gameId) => {
  try {
    const { data } = await axios.get(`${apiUrl}/api/products/${gameId}`);

    return data;
  } catch (error) {
    return { error: "Failed to fetch game. Please try again!" };
  }
};

// add game
export const addGame = async (gameData) => {
  try {
    const sessionToken = await getSessionToken();

    const response = await axios.post(
      `${apiUrl}/api/products`,
      {
        name: gameData.name,
        description: gameData.description,
        price: gameData.price,
        image: gameData.image,
        is_priority: gameData.is_priority,
        tax: gameData.tax,
        is_active: gameData.is_active,
        most_popular: gameData.most_popular,
        tag_line: gameData.tag_line,
        bg_image: gameData.bg_image,
        primary_color: gameData.primary_color,
        secondary_color: gameData.secondary_color,
        features: gameData.features,
        category_id: gameData.category_id,
        platform_ids: gameData.platform_ids,
        prod_attr_cats: gameData.prod_attr_cats,
        prod_attr_cat_ids: gameData.prod_attr_cat_ids,
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
    console.error("Failed to add game:", errorMessage);

    return {
      error: errorMessage || "An error occurred while adding the game.",
    };
  }
};

// update game
export const updateGame = async (gameData, gameId) => {
  try {
    const sessionToken = await getSessionToken();

    const response = await axios.put(
      `${apiUrl}/api/products/${gameId}`,
      {
        product: {
          name: gameData.name,
          description: gameData.description,
          price: gameData.price,
          image: gameData.image,
          is_priority: gameData.is_priority,
          tax: gameData.tax,
          is_active: gameData.is_active,
          most_popular: gameData.most_popular,
          tag_line: gameData.tag_line,
          bg_image: gameData.bg_image,
          primary_color: gameData.primary_color,
          secondary_color: gameData.secondary_color,
          features: gameData.features,
          category_id: gameData.category_id,
          prod_attr_cat_ids: gameData.prod_attr_cat_ids,
          platform_ids: gameData.platform_ids,
        },
      },
      {
        headers: {
          Authorization: `Bearer ${sessionToken}`,
        },
      }
    );

    console.log("product updated successfully:", response.data);

    return response.data;
  } catch (error) {
    const errorMessage = error.response?.data || error.message;
    console.error("Failed to update game:", errorMessage);

    return {
      error: errorMessage || "An error occurred while updating the game.",
    };
  }
};

// delete game
export const deleteGame = async (gameId) => {
  try {
    const sessionToken = await getSessionToken();

    const response = await axios.delete(`${apiUrl}/api/products/${gameId}`, {
      headers: {
        Authorization: `Bearer ${sessionToken}`,
      },
    });

    return response.data;
  } catch (error) {
    const errorMessage = error.response?.data || error.message;
    console.error("Failed to delete game:", errorMessage);

    return {
      error: errorMessage || "An error occurred while deleting the game.",
    };
  }
};

// get product by attribute
export const fetchProductByAttribute = async (attributeId) => {
  try {
    const { data } = await axios.get(
      `${apiUrl}/api/prod_attr_cats/${attributeId}/products`
    );

    return data;
  } catch (error) {
    return { error: "Failed to fetch product by attribute. Please try again!" };
  }
};

// get product by categories
export const fetchProductByCategories = async (categoryId) => {
  try {
    const { data } = await axios.get(
      `${apiUrl}/api/categories/${categoryId}/products`
    );

    return data;
  } catch (error) {
    return {
      error: "Failed to fetch product by categories. Please try again!",
    };
  }
};
