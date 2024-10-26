"use server";

import axios from "axios";
import { getSessionToken } from "./get-session-token";
import { cookies } from "next/headers";
import { apiUrl } from "../api-url";

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
    maxAge: 60 * 60 * 24 * 2, // 2 days
    secure: true,
  });
};

// login user
export const loginUser = async ({
  email,
  password,
  rememberMe = false,
  passcode = null,
}) => {
  try {
    const { data } = await axios.post(`${apiUrl}/users/sign_in`, {
      user: {
        email,
        password,
        remember_me: rememberMe,
        otp_attempt: passcode,
      },
    });

    const { token } = data;

    if (token) {
      setCookie(token);
    }

    return data;
  } catch (error) {
    const errorMessage =
      error.response?.data?.error || error.response?.data || error.message;
    console.error("Failed to login user:", errorMessage);

    return {
      error: errorMessage || "An error occurred while logging in the user.",
      res: error.response?.data,
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
}) => {
  try {
    const { data } = await axios.post(`${apiUrl}/users`, {
      user: {
        email: email,
        first_name: firstName,
        last_name: lastName,
        password: password,
        password_confirmation: confirmPassword,
      },
    });

    return data;
  } catch (error) {
    const errorMessage = error.response?.data?.message || error.message;
    console.error("Failed to sign in user:", errorMessage);

    return {
      error: errorMessage || "An error occurred while signing in the user.",
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

    const response = await axios.put(
      `${apiUrl}/users/member-data/${user.id}`,
      {
        user: {
          image_url: user.image_url,
          first_name: user.first_name,
          last_name: user.last_name,
          gamer_tag: user.gamer_tag,
          achievements: user.achievements,
          gameplay_info: user.gameplay_info,
          bio: user.bio,
          role: user.role,
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
    console.error("Failed to update user:", errorMessage);

    return {
      error: errorMessage || "An error occurred while updating the user.",
    };
  }
};

// delete user
export const deleteUser = async (userId) => {
  try {
    const sessionToken = await getSessionToken();
    if (!sessionToken) {
      return { error: "No token found. Please login again." };
    }

    const response = await axios.delete(
      `${apiUrl}/users/member-data/${userId}`,
      {
        headers: {
          Authorization: `Bearer ${sessionToken}`,
        },
      }
    );

    return response.data;
  } catch (error) {
    const errorMessage = error.response?.data || error.message;
    console.error("Failed to delete user:", errorMessage);

    return {
      error: errorMessage || "An error occurred while deleting the user.",
    };
  }
};

// add platform to user
export const addPlatformCredentials = async ({
  platform_id,
  username,
  password,
}) => {
  try {
    const sessionToken = await getSessionToken();
    if (!sessionToken) {
      return { error: "No token found. Please login again." };
    }

    const { data } = await axios.post(
      `${apiUrl}/api/platform_credentials`,
      {
        platform_id,
        username,
        password,
      },
      {
        headers: {
          Authorization: `Bearer ${sessionToken}`,
        },
      }
    );

    return data;
  } catch (error) {
    const errorMessage = error.response?.data || error.message;
    console.error("Failed to add platform to user:", errorMessage);

    return {
      error: errorMessage || "An error occurred while adding platform to user.",
    };
  }
};

// ban user
export const banUser = async (userId) => {
  try {
    const sessionToken = await getSessionToken();
    if (!sessionToken) {
      return { error: "No token found. Please login again." };
    }

    const response = await axios.delete(
      `${apiUrl}/users/member-data/${userId}/ban`,
      {
        headers: {
          Authorization: `Bearer ${sessionToken}`,
        },
      }
    );

    return response.data;
  } catch (error) {
    const errorMessage = error.response?.data || error.message;
    console.error("Failed to ban user:", errorMessage);

    return {
      error: errorMessage || "An error occurred while banning the user.",
    };
  }
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

export const lockUserAction = async (userId) => {
  try {
    const sessionToken = await getSessionToken();
    if (!sessionToken) {
      return { error: "No token found. Please login again." };
    }

    const response = await axios.post(
      `${process.env.NEXT_PUBLIC_API_URL}/users/member-data/${userId}/lock`,
      null,
      {
        headers: {
          Authorization: `Bearer ${sessionToken}`,
        },
      }
    );

    return response.data;
  } catch (error) {
    const errorMessage =
      error.response?.data || error.response?.data?.error || error.message;
    console.error("Failed to lock user:", errorMessage);

    return {
      error: errorMessage || "An error occurred while locking the user.",
    };
  }
};

export const unlockUserAction = async (userId) => {
  try {
    const sessionToken = await getSessionToken();
    if (!sessionToken) {
      return { error: "No token found. Please login again." };
    }

    const response = await axios.post(
      `${process.env.NEXT_PUBLIC_API_URL}/users/member-data/${userId}/unlock`,
      null,
      {
        headers: {
          Authorization: `Bearer ${sessionToken}`,
        },
      }
    );

    return response.data;
  } catch (error) {
    const errorMessage = error.response?.data || error.message;
    console.error("Failed to unlock user:", errorMessage);

    return {
      error: errorMessage || "An error occurred while unlocking the user.",
    };
  }
};

// // verify qr code
// export const verifyQrCodeAction = async () => {
//   try {
//     const sessionToken = await getSessionToken();
//     if (!sessionToken) {
//       return { error: "No token found. Please login again." };
//     }

//     const { data } = await axios.post(
//       `${apiUrl}/users/member-data/verify_qr_code`,
//       null,
//       {
//         headers: {
//           Authorization: `Bearer ${sessionToken}`,
//         },
//       }
//     );

//     return data;
//   } catch (error) {
//     const errorMessage = error.response?.data || error.message;
//     console.error("Failed to verify qr code:", errorMessage);

//     return {
//       error: errorMessage || "An error occurred while verifying the qr code.",
//     };
//   }
// };
