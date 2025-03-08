"use server";

import axios from "axios";
import { getSessionToken } from "./get-session-token";
import { cookies } from "next/headers";
import { apiUrl } from "../api-url";

// set cookie
export const setCookie = (value, rememberMe) => {
  const time = 60 * 60 * 24;

  cookies().set({
    name: "jwtToken",
    value: value,
    maxAge: rememberMe ? time * 15 : time * 2, // 15 days or 2 days
    secure: true,
  });
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

// login user
export const loginUser = async ({
  email,
  password,
  rememberMe,
  passcode = null,
  maintenance = false,
}) => {
  try {
    const { data } = await axios.post(`${apiUrl}/users/sign_in`, {
      user: {
        email: email?.toLowerCase(),
        password,
        remember_me: rememberMe,
        otp_attempt: passcode,
        under_construction: maintenance,
      },
    });

    const { token } = data;

    if (token) {
      setCookie(token, rememberMe);
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
        email: email?.toLowerCase(),
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

    if (errorMessage === "Signature has expired") {
      logoutSession();
      return { error: "Your session has expired. Please login again." };
    }

    return {
      error: "An error occurred while fetching the current user.",
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
          email: user.email?.toLowerCase(),
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
    const errorMessage =
      error.response?.data?.error || error.response?.data || error.message;
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
  sub_platform_id,
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
        sub_platform_id,
      },
      {
        headers: {
          Authorization: `Bearer ${sessionToken}`,
        },
      }
    );

    return data;
  } catch (error) {
    const errorMessage =
      error.response?.data?.errors || error.response?.data || error.message;
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
    const errorMessage =
      error.response?.data?.error || error.response?.data || error.message;
    console.error("Failed to ban user:", errorMessage);

    return {
      error: errorMessage || "An error occurred while banning the user.",
    };
  }
};

// lock user account
export const lockUserAction = async (userId) => {
  try {
    const sessionToken = await getSessionToken();
    if (!sessionToken) {
      return { error: "No token found. Please login again." };
    }

    const response = await axios.post(
      `${apiUrl}/users/member-data/${userId}/lock`,
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
      error.response?.data?.error || error.response?.data || error.message;
    console.error("Failed to lock user:", errorMessage);

    return {
      error: errorMessage || "An error occurred while locking the user.",
    };
  }
};

// unlock user account
export const unlockUserAction = async (userId) => {
  try {
    const sessionToken = await getSessionToken();
    if (!sessionToken) {
      return { error: "No token found. Please login again." };
    }

    const response = await axios.post(
      `${apiUrl}/users/member-data/${userId}/unlock`,
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
      error.response?.data?.error || error.response?.data || error.message;
    console.error("Failed to unlock user:", errorMessage);

    return {
      error: errorMessage || "An error occurred while unlocking the user.",
    };
  }
};

// get qr code
export const getQrCode = async (token) => {
  try {
    const { data } = await axios.get(`${apiUrl}/users/2fa`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return data;
  } catch (error) {
    const errorMessage = error.response?.data || error.message;
    console.error("Failed to get qr code:", errorMessage);
    return {
      error: errorMessage || "An error occurred while getting the qr code.",
    };
  }
};

// get otp on email
export const getOtpOnEmail = async (email) => {
  const sessionToken = await getSessionToken();

  if (!sessionToken) {
    return { error: "No token found. Please login again." };
  }

  try {
    const { data } = await axios.post(
      `${apiUrl}/users/2fa/send_otp_email`,
      { email },
      {
        headers: {
          Authorization: `Bearer ${sessionToken}`,
        },
      }
    );

    return data;
  } catch (error) {
    const errorMessage = error.response?.data || error.message;
    console.error("Failed to get otp on email:", errorMessage);

    return {
      error:
        errorMessage || "An error occurred while getting the otp on email.",
    };
  }
};

// verify qr code
export const verifyQrCode = async (passcode, token) => {
  try {
    const { data } = await axios.post(
      `${apiUrl}/users/2fa/verify`,
      { otp_attempt: passcode },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    return data;
  } catch (error) {
    const errorMessage =
      error.response?.data?.error || error.response?.data || error.message;
    console.error("Failed to verify qr code:", errorMessage);

    return {
      error: errorMessage || "An error occurred while verifying the qr code.",
    };
  }
};

// get banned users
export const fetchBannedUsers = async () => {
  try {
    const sessionToken = await getSessionToken();

    if (!sessionToken) {
      return { error: "No token found. Please login again." };
    }

    const { data } = await axios.get(`${apiUrl}/users/banned_emails`, {
      headers: {
        Authorization: `Bearer ${sessionToken}`,
      },
    });

    return data;
  } catch (error) {
    return { error: "Failed to fetch banned users. Please try again!" };
  }
};

// forgot password
export const forgotPassword = async (data) => {
  try {
    const response = await axios.post(`${apiUrl}/users/password`, {
      user: { email: data.email },
    });

    return response.data;
  } catch (error) {
    const errorMessage =
      error.response?.data?.error || error.response?.data || error.message;
    console.error("Failed to send password reset email:", errorMessage);

    return {
      error: "Some error occurred. Please enter a valid email address.",
    };
  }
};

// reset user password
export const resetUserPassword = async ({ password, token }) => {
  try {
    const { data } = await axios.patch(
      `${apiUrl}/users/member-data/update_password`,
      {
        password,
        reset_password_token: token,
      }
    );

    return data;
  } catch (error) {
    const errorMessage =
      error.response?.data?.error || error.response?.data || error.message;
    console.error("Failed to reset user password:", errorMessage);

    return {
      error:
        errorMessage || "An error occurred while resetting the user password.",
    };
  }
};

// check if user exists
export const doesUserExist = async (email) => {
  try {
    const { data } = await axios.get(
      `${apiUrl}/users/member-data/user_exists`,
      {
        params: {
          email,
        },
      }
    );

    return data;
  } catch (error) {
    const errorMessage = error.response?.data || error.message;
    console.error("Failed to check if user exists:", errorMessage);

    return {
      error: "An error occurred while checking if user exists.",
    };
  }
};
