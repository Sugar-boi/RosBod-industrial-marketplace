"use client";

import API_BASE_URL from "@/lib/api-config";
import { logout } from "@/lib/auth";

export const apiFetch = async (
  endpoint: string,
  options: RequestInit = {}
) => {
  const token = localStorage.getItem("token");

  const headers = new Headers(
    options.headers
  );

  if (token) {
    headers.set(
      "Authorization",
      `Bearer ${token}`
    );
  }

  const response = await fetch(
    `${API_BASE_URL}${endpoint}`,
    {
      ...options,
      headers,
    }
  );

  // Token expired / invalid
  if (response.status === 401) {
    console.log(
      "🔴 401 DETECTED — SESSION EXPIRED"
    );

    logout("session-expired");

    throw new Error(
      "Your session has expired."
    );
  }

  return response;
};