"use server";

import axios from "axios";
import { revalidatePath } from "next/cache";

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

// add category
export const addCategory = async (categoryData) => {
  console.log("categoryData from actions", categoryData);

  await validateToken()
    .then(async (res) => {
      console.log("res from token", res);
      console.log("csrf token", res.csrf_token);

      if (res.error) {
        return { error: res.error };
      }

      try {
        const response = await axios.post(
          `${process.env.NEXT_PUBLIC_API_URL}/api/categories`,
          {
            name: categoryData.name,
            description: categoryData.description,
            is_active: categoryData.is_active,
          },
          {
            headers: {
              "content-type": "application/json",
              "X-CSRF-Token":
                "Zz1eLsVad/v0Nw9BCVA9d/vjS7MhTJOf/sngl2mzpv4MIn+EYVd9EAn3XUJNCM0YoXJPdLcvHE9u1h+8FIGQSw==",
            },
            withCredentials: true,
          }
        );

        console.log("response from server", response);

        if (response.data) {
          revalidatePath("/dashboard/admin/game_categories");
          return response.data;
        }
      } catch (error) {
        console.error(
          "Failed to add category:",
          error.response ? error.response.data : error.message
        );
        return {
          error:
            error.response?.data?.message ||
            "An error occurred while adding the category.",
        };
      }
    })
    .catch((err) => {
      console.error("Failed to validate token:", err);
      return {
        error: "Something went wrong. Please try again!",
      };
    });
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
  console.log("attributeData from actions", attributeData);

  await validateToken()
    .then(async (res) => {
      console.log("res from token", res);
      console.log("csrf token", res.csrf_token);

      if (res.error) {
        return { error: res.error };
      }

      try {
        const response = await axios.post(
          `${process.env.NEXT_PUBLIC_API_URL}/api/product_attribute_categories`,
          {
            name: attributeData.name,
          },
          {
            headers: {
              "content-type": "application/json",
              "X-CSRF-Token":
                "Zz1eLsVad/v0Nw9BCVA9d/vjS7MhTJOf/sngl2mzpv4MIn+EYVd9EAn3XUJNCM0YoXJPdLcvHE9u1h+8FIGQSw==",
            },
            withCredentials: true,
          }
        );

        console.log("response from server", response);

        if (response.data) {
          revalidatePath("/dashboard/admin/product_attribute_categories");
          return response.data;
        }
      } catch (error) {
        console.error(
          "Failed to add attribute:",
          error.response ? error.response.data : error.message
        );
        return {
          error:
            error.response?.data?.message ||
            "An error occurred while adding the attribute.",
        };
      }
    })
    .catch((err) => {
      console.error("Failed to validate token:", err);
      return {
        error: "Something went wrong. Please try again!",
      };
    });
};
