"use server";

import axios from "axios";
import { cookies } from "next/headers";

const apiUrl = process.env.NEXT_PUBLIC_API_URL;

// get session token from cookie
export const getSessionToken = async () => {
  const token = cookies().get("jwtToken");
  return token?.value || null;
};

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
  // const token = await validateToken();

  // if (token.error) {
  //   return { error: token.error };
  // }

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

// get attribute
export const fetchAttribute = async () => {
  try {
    const { data } = await axios.get(`${apiUrl}/api/prod_attr_cats`);

    return data;
  } catch (error) {
    return { error: "Failed to fetch attribute. Please try again!" };
  }
};

// ADD ATTRIBUTE
export const addAttribute = async (attributeData) => {
  try {
    const sessionToken = await getSessionToken();

    const response = await axios.post(
      `${apiUrl}/api/prod_attr_cats`,
      { name: attributeData.name },
      {
        headers: {
          Authorization: `Bearer ${sessionToken}`,
        },
      }
    );

    return response.data;
  } catch (error) {
    const errorMessage = error.response?.data || error.message;
    console.error("Failed to add attribute:", errorMessage);

    return {
      error: errorMessage || "An error occurred while adding the attribute.",
    };
  }
};

// update attribute
export const updateAttribute = async (attributeData) => {
  try {
    const sessionToken = await getSessionToken();

    const response = await axios.put(
      `${apiUrl}/api/prod_attr_cats/${attributeData.id}`,
      { name: attributeData.name },
      {
        headers: {
          Authorization: `Bearer ${sessionToken}`,
        },
      }
    );

    return response.data;
  } catch (error) {
    const errorMessage = error.response?.data || error.message;
    console.error("Failed to update attribute:", errorMessage);

    return {
      error: errorMessage || "An error occurred while updating the attribute.",
    };
  }
};

// delete attribute
export const deleteAttribute = async (attributeId) => {
  try {
    const sessionToken = await getSessionToken();

    const response = await axios.delete(
      `${apiUrl}/api/prod_attr_cats/${attributeId}`,
      {
        headers: {
          Authorization: `Bearer ${sessionToken}`,
        },
      }
    );

    return response.data;
  } catch (error) {
    const errorMessage = error.response?.data || error.message;
    console.error("Failed to delete attribute:", errorMessage);

    return {
      error: errorMessage || "An error occurred while deleting the attribute.",
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
  console.log("gameData", gameData);

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

    console.log(response);

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

// get platforms
export const fetchPlatforms = async () => {
  try {
    const { data } = await axios.get(`${apiUrl}/api/platforms`);

    return data;
  } catch (error) {
    console.log("error platforms ", error);
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
    const errorMessage = error.response?.data || error.message;
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
    const errorMessage = error.response?.data || error.message;
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
    const errorMessage = error.response?.data || error.message;
    console.error("Failed to delete platform:", errorMessage);

    return {
      error: errorMessage || "An error occurred while deleting the platform.",
    };
  }
};

// login user
export const loginUser = async ({ email, password }) => {
  try {
    const { data } = await axios.post(`${apiUrl}/users/sign_in`, {
      user: { email, password },
    });

    const { token } = data;

    if (token) {
      setCookie(token);
    }

    return data;
  } catch (error) {
    const errorMessage = error.response?.data || error.message;
    console.error("Failed to login user:", errorMessage);

    return {
      error: errorMessage || "An error occurred while logging in the user.",
    };
  }
};

// current user get data of the current/login user
export const fetchCurrentUser = async () => {
  try {
    const sessionToken = await getSessionToken();

    if (!sessionToken) {
      return { error: "No token found. Please login again." };
    }

    const { data } = await axios.get(
      `${apiUrl}/users/member-data/signed_in_user`,
      {
        headers: {
          Authorization: `Bearer ${sessionToken}`,
        },
      }
    );

    return data;
  } catch (error) {
    const errorMessage = error.response?.data || error.message;
    console.error("Failed to fetch current user:", errorMessage);

    return {
      error:
        errorMessage || "An error occurred while fetching the current user.",
    };
  }
};

// get all users
export const fetchAllUsers = async () => {
  try {
    const sessionToken = await getSessionToken();
    if (!sessionToken) {
      return { error: "No token found. Please login again." };
    }

    const { data } = await axios.get(`${apiUrl}/users/member-data`, {
      headers: {
        Authorization: `Bearer ${sessionToken}`,
      },
    });

    return data;
  } catch (error) {
    return { error: "Failed to fetch all users. Please try again!" };
  }
};

// update user (Not working)
export const updateUser = async (user) => {
  try {
    const sessionToken = await getSessionToken();
    if (!sessionToken) {
      return { error: "No token found. Please login again." };
    }

    const response = await axios.patch(
      `${apiUrl}/api/users/${user.id}`,
      {
        user: {
          first_name: user.first_name,
          last_name: user.last_name,
          image_url: user.image,
        },
      },
      {
        headers: {
          Authorization: `Bearer ${sessionToken}`,
        },
      }
    );

    console.log("response", response);

    return response.data;
  } catch (error) {
    const errorMessage = error.response?.data || error.message;
    console.error("Failed to update user:", errorMessage);

    return {
      error: errorMessage || "An error occurred while updating the user.",
    };
  }
};

// delete user (Not working)
export const deleteUser = async (userId) => {
  try {
    const sessionToken = await getSessionToken();
    if (!sessionToken) {
      return { error: "No token found. Please login again." };
    }

    const response = await axios.delete(`${apiUrl}/api/users`, {
      headers: {
        Authorization: `Bearer ${sessionToken}`,
      },
    });

    return response.data;
  } catch (error) {
    const errorMessage = error.response?.data || error.message;
    console.error("Failed to delete user:", errorMessage);

    return {
      error: errorMessage || "An error occurred while deleting the user.",
    };
  }
};

// create new user
export const createUser = async ({
  firstName,
  lastName,
  email,
  password,
  confirmPassword,
  image,
}) => {
  try {
    const { data } = await axios.post(`${apiUrl}/users`, {
      user: {
        email: email,
        first_name: firstName,
        last_name: lastName,
        password: password,
        password_confirmation: confirmPassword,
        image_url: image,
      },
    });

    return data;
  } catch (error) {
    const errorMessage = error.response?.data || error.message;
    console.error("Failed to sign in user:", errorMessage);

    return {
      error: errorMessage || "An error occurred while signing in the user.",
    };
  }
};

// get all orders
export const fetchAllOrders = async () => {
  try {
    const { data } = await axios.get(`${apiUrl}/api/orders`);

    return data;
  } catch (error) {
    return { error: "Failed to fetch all orders. Please try again!" };
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

export const logoutSession = async () => {
  try {
    const sessionToken = await getSessionToken();

    if (!sessionToken) {
      return { error: "No token found. Please login again." };
    }

    cookies().set({
      name: "jwtToken",
      value: null,
      maxAge: -1,
      secure: true,
    });

    const { data } = await axios.delete(`${apiUrl}/users/sign_out`, {
      headers: {
        Authorization: `Bearer ${sessionToken}`,
      },
    });

    return data;
  } catch (error) {
    const errorMessage = error.response?.data || error.message;
    console.error("Failed to logout user:", errorMessage);

    return {
      error: errorMessage || "An error occurred while logout the user.",
    };
  }
};

// set cookie
export const setCookie = (value) => {
  cookies().set({
    name: "jwtToken",
    value: value,
    maxAge: 60 * 60 * 24 * 3, // 3 days
    secure: true,
  });
};

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

    console.log("data", data);

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

// stripe checkout session
// export const checkoutSession = async (items) => {
//   try {
//     const sessionToken = await getSessionToken();
//     if (!sessionToken) {
//       return { error: "No token found. Please login again." };
//     }

//     const { data } = await axios.post(
//       `http://localhost:3000/api/checkout_session`,
//       items,
//       {
//         headers: { Authorization: `Bearer ${sessionToken}` },
//       }
//     );

//     console.log("Checkout session data:", data);

//     return data;
//   } catch (error) {
//     const errorMessage = error.response?.data || error.message;
//     console.error("Failed to checkout session:", errorMessage);

//     return {
//       error: errorMessage || "An error occurred while checkout session.",
//     };
//   }
// };

// fetch all graveyard orders
export const fetchAllGraveyardOrders = async () => {
  try {
    const sessionToken = await getSessionToken();
    if (!sessionToken) {
      return { error: "No token found. Please login again." };
    }

    const { data } = await axios.get(`${apiUrl}/orders/info/graveyard_orders`, {
      headers: {
        Authorization: `Bearer ${sessionToken}`,
      },
    });

    console.log("data", data);

    return data;
  } catch (error) {
    const errorMessage = error.response?.data || error.message;
    console.error("Failed to fetch all orders:", errorMessage);

    return {
      error: errorMessage || "An error occurred while fetching the orders.",
    };
  }
};
