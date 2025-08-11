const API_URL = process.env.NEXT_PUBLIC_API_URL;

export const api = {
  async exchangeCode(code: string, redirectUri: string) {
    const response = await fetch(`${API_URL}/api/auth/callback`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ code, redirect_uri: redirectUri }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || "Failed to exchange code");
    }

    return response.json();
  },

  async refreshTokens() {
    const response = await fetch(`${API_URL}/api/auth/refresh`, {
      method: "POST",
      credentials: "include", // important to send cookies
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || "Failed to refresh tokens");
    }

    return response.json(); // returns { tokenData: { access_token, id_token, refresh_token } }
  },
  async checkAuth() {
    const response = await fetch(`${API_URL}/api/auth/check`, {
      credentials: "include",
    });

    if (!response.ok) {
      return null;
    }

    return response.json();
  },

  async logout() {
    const response = await fetch(`${API_URL}/api/auth/logout`, {
      method: "POST",
      credentials: "include",
    });

    return response.json();
  },

  async getProfile() {
    const response = await fetch(`${API_URL}/api/user/profile`, {
      credentials: "include",
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || "Failed to get profile");
    }

    return response.json();
  },
};
