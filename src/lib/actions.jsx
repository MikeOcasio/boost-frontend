"use server";

import axios from "axios";

// validate csrf token
const validateToken = async () => {
  try {
    const { data } = await axios.get(
      `${process.env.NEXT_PUBLIC_API_URL}/csrf_token`
    );

    return data;
  } catch (error) {
    return { error: "Failed to validate token. Please try again!" };
  }
};

// get categories
export const fetchCategories = async () => {
  try {
    const { data } = await axios.get(
      `${process.env.NEXT_PUBLIC_API_URL}/api/categories`
    );

    return data;
  } catch (error) {
    return { error: "Failed to fetch categories. Please try again!" };
  }
};

// add category
export const addCategory = async (categoryData) => {
  // const token = await validateToken();

  // if (token.error) {
  //   return { error: token.error };
  // }

  try {
    const response = await axios.post(
      `${process.env.NEXT_PUBLIC_API_URL}/api/categories`,
      {
        name: categoryData.name,
        description: categoryData.description,
        is_active: categoryData.is_active,
      },
      { headers: { "X-CSRF-Token": process.env.NEXT_PUBLIC_API_TOKEN } }
    );

    return response.data;
  } catch (error) {
    console.log(
      "Failed to add category:",
      error.response ? error.response.data : error.message
    );

    return {
      error:
        JSON.stringify(error.response.data) ||
        "An error occurred while adding the category.",
    };
  }
};

// update category
export const updateCategory = async (categoryData) => {
  try {
    const response = await axios.put(
      `${process.env.NEXT_PUBLIC_API_URL}/api/categories/${categoryData.id}`,
      {
        name: categoryData.name,
        description: categoryData.description,
        is_active: categoryData.is_active,
      },
      { headers: { "X-CSRF-Token": process.env.NEXT_PUBLIC_API_TOKEN } }
    );

    return response.data;
  } catch (error) {
    console.log(
      "Failed to update category:",
      error.response ? error.response.data : error.message
    );

    return {
      error:
        JSON.stringify(error.response.data) ||
        "An error occurred while updating the category.",
    };
  }
};

// delete category
export const deleteCategory = async (categoryId) => {
  try {
    const response = await axios.delete(
      `${process.env.NEXT_PUBLIC_API_URL}/api/categories/${categoryId}`,
      { headers: { "X-CSRF-Token": process.env.NEXT_PUBLIC_API_TOKEN } }
    );

    return response.data;
  } catch (error) {
    console.log(
      "Failed to delete category:",
      error.response ? error.response.data : error.message
    );

    return {
      error:
        JSON.stringify(error.response.data) ||
        "An error occurred while deleting the category.",
    };
  }
};

// get attribute
export const fetchAttribute = async () => {
  try {
    const { data } = await axios.get(
      `${process.env.NEXT_PUBLIC_API_URL}/api/product_attribute_categories`
    );

    return data;
  } catch (error) {
    return { error: "Failed to fetch attribute. Please try again!" };
  }
};

// ADD ATTRIBUTE
export const addAttribute = async (attributeData) => {
  try {
    const response = await axios.post(
      `${process.env.NEXT_PUBLIC_API_URL}/api/product_attribute_categories`,
      { name: attributeData.name },
      { headers: { "X-CSRF-Token": process.env.NEXT_PUBLIC_API_TOKEN } }
    );

    return response.data;
  } catch (error) {
    console.log(
      "Failed to add attribute:",
      error.response ? error.response.data : error.message
    );

    return {
      error:
        JSON.stringify(error.response.data) ||
        "An error occurred while adding the attribute.",
    };
  }
};

// update attribute
export const updateAttribute = async (attributeData) => {
  try {
    const response = await axios.put(
      `${process.env.NEXT_PUBLIC_API_URL}/api/product_attribute_categories/${attributeData.id}`,
      { name: attributeData.name },
      { headers: { "X-CSRF-Token": process.env.NEXT_PUBLIC_API_TOKEN } }
    );

    return response.data;
  } catch (error) {
    console.log(
      "Failed to update attribute:",
      error.response ? error.response.data : error.message
    );

    return {
      error:
        JSON.stringify(error.response.data) ||
        "An error occurred while updating the attribute.",
    };
  }
};

// delete attribute
export const deleteAttribute = async (attributeId) => {
  try {
    const response = await axios.delete(
      `${process.env.NEXT_PUBLIC_API_URL}/api/product_attribute_categories/${attributeId}`,
      { headers: { "X-CSRF-Token": process.env.NEXT_PUBLIC_API_TOKEN } }
    );

    return response.data;
  } catch (error) {
    console.log(
      "Failed to delete attribute:",
      error.response ? error.response.data : error.message
    );

    return {
      error:
        JSON.stringify(error.response.data) ||
        "An error occurred while deleting the attribute.",
    };
  }
};

// get all games
export const fetchAllGames = async () => {
  try {
    const { data } = await axios.get(
      `${process.env.NEXT_PUBLIC_API_URL}/api/products`
    );

    return data;
  } catch (error) {
    return { error: "Failed to fetch all games. Please try again!" };
  }
};

// get game by id
export const fetchGameById = async (gameId) => {
  try {
    const { data } = await axios.get(
      `${process.env.NEXT_PUBLIC_API_URL}/api/products/${gameId}`
    );

    return data;
  } catch (error) {
    return { error: "Failed to fetch game. Please try again!" };
  }
};

// add game
export const addGame = async (gameData) => {
  console.log("gameData", gameData);
  try {
    const response = await axios.post(
      `${process.env.NEXT_PUBLIC_API_URL}/api/products`,
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
        product_attribute_category_id: gameData.product_attribute_category_id,
        product_attribute_category: gameData.product_attribute_category,
        category: gameData.category,
        platform_ids: gameData.platform_ids,
      },
      { headers: { "X-CSRF-Token": process.env.NEXT_PUBLIC_API_TOKEN } }
    );

    return response.data;
  } catch (error) {
    console.log(
      "Failed to add game:",
      error.response ? error.response.data : error.message
    );

    return {
      error:
        JSON.stringify(error.response.data) ||
        "An error occurred while adding the game.",
    };
  }
};

// update game
export const updateGame = async (gameData) => {
  try {
    const response = await axios.put(
      `${process.env.NEXT_PUBLIC_API_URL}/api/products/${gameData.id}`,
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
        product_attribute_category_id: gameData.product_attribute_category_id,
        product_attribute_category: gameData.product_attribute_category,
        category: gameData.category,
        platform_ids: gameData.platform_ids,
      },
      { headers: { "X-CSRF-Token": process.env.NEXT_PUBLIC_API_TOKEN } }
    );

    return response.data;
  } catch (error) {
    console.log(
      "Failed to update game:",
      error.response ? error.response.data : error.message
    );

    return {
      error:
        JSON.stringify(error.response.data) ||
        "An error occurred while updating the game.",
    };
  }
};

// delete game
export const deleteGame = async (gameId) => {
  try {
    const response = await axios.delete(
      `${process.env.NEXT_PUBLIC_API_URL}/api/products/${gameId}`,
      { headers: { "X-CSRF-Token": process.env.NEXT_PUBLIC_API_TOKEN } }
    );

    return response.data;
  } catch (error) {
    console.log(
      "Failed to delete game:",
      error.response ? error.response.data : error.message
    );

    return {
      error:
        JSON.stringify(error.response.data) ||
        "An error occurred while deleting the game.",
    };
  }
};

// get platforms
export const fetchPlatforms = async () => {
  try {
    const { data } = await axios.get(
      `${process.env.NEXT_PUBLIC_API_URL}/api/platforms`
    );

    return data;
  } catch (error) {
    console.log("error platforms ", error);
    return { error: "Failed to fetch platforms. Please try again!" };
  }
};
