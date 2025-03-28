"use server";

import axios from "axios";
import { getSessionToken } from "./get-session-token";
import { apiUrl } from "../api-url";

// get all games
export const fetchAllGames = async ({ page, get_all = false }) => {
  try {
    const { data } = await axios.get(
      `${apiUrl}/api/products?page=${page}&per_page=48&get_all=${get_all}`
    );

    return data;
  } catch (error) {
    return { error: "Failed to fetch all games. Please try again!" };
  }
};

// most popular games
export const fetchMostPopularGames = async () => {
  try {
    const { data } = await axios.get(`${apiUrl}/api/products/most_popular`);

    return data;
  } catch (error) {
    return { error: "Failed to fetch most popular games. Please try again!" };
  }
};

// fetch search products
export const fetchSearchProducts = async ({
  searchTerm,
  page,
  category_id,
  platform_id,
  attribute_id,
}) => {
  try {
    const { data } = await axios.get(
      `${apiUrl}/api/products?page=${page || ""}&per_page=48&search=${
        searchTerm || ""
      }&category_id=${category_id || ""}&platform_id=${
        platform_id || ""
      }&attribute_id=${attribute_id || ""}`
    );

    return data;
  } catch (error) {
    return { error: "Failed to fetch search products. Please try again!" };
  }
};

// get game by id
export const fetchGameById = async (gameId) => {
  try {
    const { data } = await axios.get(`${apiUrl}/api/products/${gameId}`);

    return data;
  } catch (error) {
    const errorMessage =
      error.response?.data?.error || error.response?.data || error.message;

    return {
      error: errorMessage || "Failed to fetch game details. Please try again!",
    };
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
        is_dropdown: gameData.is_dropdown,
        dropdown_options: gameData.dropdown_options,
        is_slider: gameData.is_slider,
        slider_range: gameData.slider_range,
        parent_id: gameData.parent_id,
      },
      {
        headers: {
          Authorization: `Bearer ${sessionToken}`,
        },
      }
    );

    return response.data;
  } catch (error) {
    const errorMessage =
      error.response?.data?.error || error.response?.data || error.message;
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
          is_slider: gameData.is_slider,
          slider_range: gameData.slider_range,
          is_dropdown: gameData.is_dropdown,
          dropdown_options: gameData.dropdown_options,
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
    const errorMessage =
      error.response?.data?.error || error.response?.data || error.message;
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
    const errorMessage =
      error.response?.data?.error || error.response?.data || error.message;
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
export const fetchProductByCategories = async ({ categoryId, page }) => {
  try {
    const { data } = await axios.get(
      `${apiUrl}/api/products/by_category/${categoryId}?page=${page}&per_page=48`
    );

    return data;
  } catch (error) {
    return {
      error: "Failed to fetch product by categories. Please try again!",
    };
  }
};
