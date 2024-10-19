"use server";

import axios from "axios";
import { getSessionToken } from "./get-session-token";
import { apiUrl } from "../api-url";

// get all orders
export const fetchAllOrders = async (limit) => {
  try {
    const sessionToken = await getSessionToken();
    if (!sessionToken) {
      return { error: "No token found. Please login again." };
    }

    const { data } = await axios.get(
      !!limit
        ? `${apiUrl}/orders/info?limit=${limit}`
        : `${apiUrl}/orders/info`,
      {
        headers: {
          Authorization: `Bearer ${sessionToken}`,
        },
      }
    );

    return data;
  } catch (error) {
    return { error: "Failed to fetch all orders. Please try again!" };
  }
};

// fetch order by id
export const fetchOrderById = async (orderId) => {
  try {
    const sessionToken = await getSessionToken();
    if (!sessionToken) {
      return { error: "No token found. Please login again." };
    }

    const { data } = await axios.get(`${apiUrl}/orders/info/${orderId}`, {
      headers: {
        Authorization: `Bearer ${sessionToken}`,
      },
    });

    console.log("order data", data);

    return data;
  } catch (error) {
    return { error: "Failed to fetch order details. Please try again!" };
  }
};

// create order
export const createOrder = async (orderData) => {
  console.log(orderData);
  try {
    const sessionToken = await getSessionToken();
    if (!sessionToken) {
      return { error: "No token found. Please login again." };
    }

    const { data } = await axios.post(
      `${apiUrl}/orders/info`,
      { ...orderData },
      {
        headers: {
          Authorization: `Bearer ${sessionToken}`,
        },
      }
    );

    return data;
  } catch (error) {
    const errorMessage = error.response?.data?.errors || error.message;

    return {
      error: errorMessage || "An error occurred while creating the order.",
    };
  }
};

// fetch all graveyard orders
export const fetchAllGraveyardOrders = async (limit) => {
  try {
    const sessionToken = await getSessionToken();
    if (!sessionToken) {
      return { error: "No token found. Please login again." };
    }

    const { data } = await axios.get(
      !!limit
        ? `${apiUrl}/orders/info/graveyard_orders?limit=${limit}`
        : `${apiUrl}/orders/info/graveyard_orders`,
      {
        headers: {
          Authorization: `Bearer ${sessionToken}`,
        },
      }
    );

    return data;
  } catch (error) {
    const errorMessage = error.response?.data || error.message;
    console.error("Failed to fetch all orders:", errorMessage);

    return {
      error: errorMessage || "An error occurred while fetching the orders.",
    };
  }
};

// accept order from graveyard
export const acceptGraveyardOrder = async (orderId) => {
  try {
    const sessionToken = await getSessionToken();
    if (!sessionToken) {
      return { error: "No token found. Please login again." };
    }

    const { data } = await axios.post(
      `${apiUrl}/orders/info/${orderId}/pick_up_order`,
      {},
      {
        headers: {
          Authorization: `Bearer ${sessionToken}`,
        },
      }
    );

    return data;
  } catch (error) {
    const errorMessage = error.response?.data?.message || error.message;
    console.error("Failed to accept order:", errorMessage);
    return {
      error: errorMessage || "An error occurred while accepting the order.",
    };
  }
};

// assign order to skill master
export const assignOrderToSkillMaster = async (orderId, skillMasterId) => {
  try {
    const sessionToken = await getSessionToken();
    if (!sessionToken) {
      return { error: "No token found. Please login again." };
    }

    const { data } = await axios.post(
      `${apiUrl}/orders/info/${orderId}/pick_up_order`,
      { assigned_skill_master_id: skillMasterId },
      {
        headers: {
          Authorization: `Bearer ${sessionToken}`,
        },
      }
    );

    return data;
  } catch (error) {
    const errorMessage = error.response?.data?.message || error.message;
    console.error("Failed to assign order to skill master:", errorMessage);
    return {
      error: errorMessage || "An error occurred while assigning the order.",
    };
  }
};

// update order status
export const updateOrderStatus = async (orderId, orderState) => {
  try {
    const sessionToken = await getSessionToken();
    if (!sessionToken) {
      return { error: "No token found. Please login again." };
    }

    const { data } = await axios.put(
      `${apiUrl}/orders/info/${orderId}`,
      {
        state: orderState,
      },
      {
        headers: {
          Authorization: `Bearer ${sessionToken}`,
        },
      }
    );

    return data;
  } catch (error) {
    const errorMessage = error.response?.data?.message || error.message;
    console.error("Failed to update order status:", errorMessage);
    return {
      error:
        errorMessage || "An error occurred while updating the order status.",
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

//     return data;
//   } catch (error) {
//     const errorMessage = error.response?.data || error.message;
//     console.error("Failed to checkout session:", errorMessage);

//     return {
//       error: errorMessage || "An error occurred while checkout session.",
//     };
//   }
// };
