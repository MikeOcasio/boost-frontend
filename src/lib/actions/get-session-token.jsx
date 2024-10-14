"use server";

import { cookies } from "next/headers";

// get session token from cookie
export const getSessionToken = async () => {
  const token = cookies().get("jwtToken");
  return token?.value || null;
};
