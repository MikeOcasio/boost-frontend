import axios from "axios";
import { getSessionToken } from "./get-session-token";
import { apiUrl } from "../api-url";

// get all orders
export const fetchAllOrders = async () => {
  try {
    const { data } = await axios.get(`${apiUrl}/api/orders`);

    return data;
  } catch (error) {
    return { error: "Failed to fetch all orders. Please try again!" };
  }
};
// stripe checkout session
export const checkoutSession = async (items) => {
  try {
    const sessionToken = await getSessionToken();
    if (!sessionToken) {
      return { error: "No token found. Please login again." };
    }

    const { data } = await axios.post(
      `http://localhost:3000/api/checkout_session`,
      items,
      {
        headers: { Authorization: `Bearer ${sessionToken}` },
      }
    );

    console.log("Checkout session data:", data);

    return data;
  } catch (error) {
    const errorMessage = error.response?.data || error.message;
    console.error("Failed to checkout session:", errorMessage);

    return {
      error: errorMessage || "An error occurred while checkout session.",
    };
  }
};

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

// create order
export const createOrder = async (data) => {
  console.log("data", data);

  // try {
  //   const sessionToken = await getSessionToken();
  //   if (!sessionToken) {
  //     return { error: "No token found. Please login again." };
  //   }

  //   const { data } = await axios.post(`${apiUrl}/orders/info`, {
  //     headers: {
  //       Authorization: `Bearer ${sessionToken}`,
  //     },
  //   });

  //   console.log("data", data);

  //   return data;
  // } catch (error) {
  //   const errorMessage = error.response?.data || error.message;
  //   console.error("Failed to create order:", errorMessage);

  //   return {
  //     error: errorMessage || "An error occurred while creating the order.",
  //   };
  // }
};
