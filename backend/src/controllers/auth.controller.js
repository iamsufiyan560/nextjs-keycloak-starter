import fetch from "node-fetch";
import { getKeycloakConfig } from "../config/keycloak.js";
import User from "../models/User.js";
import { generateToken } from "../utils/jwt.js";

export const handleCallback = async (req, res) => {
  try {
    const { code, redirect_uri } = req.body;
    const keycloakConfig = getKeycloakConfig();

    console.log("Keycloak config check:");
    console.log("Token endpoint:", keycloakConfig.tokenEndpoint);

    if (!code) {
      return res.status(400).json({ error: "Authorization code required" });
    }

    const tokenResponse = await fetch(keycloakConfig.tokenEndpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({
        grant_type: "authorization_code",
        client_id: keycloakConfig.clientId,
        client_secret: keycloakConfig.clientSecret,
        code,
        redirect_uri: redirect_uri || `${process.env.FRONTEND_URL}/auth/load`,
      }),
    });

    const tokenData = await tokenResponse.json();

    if (!tokenResponse.ok) {
      return res
        .status(400)
        .json({ error: "Failed to exchange code", details: tokenData });
    }

    const userinfoResponse = await fetch(keycloakConfig.userinfoEndpoint, {
      headers: {
        Authorization: `Bearer ${tokenData.access_token}`,
      },
    });

    const userinfo = await userinfoResponse.json();

    if (!userinfoResponse.ok) {
      return res
        .status(400)
        .json({ error: "Failed to get user info", details: userinfo });
    }

    let user = await User.findOne({ sub: userinfo.sub });

    if (user) {
      user.lastLogin = new Date();
      user.email = userinfo.email;
      user.name =
        userinfo.name || userinfo.preferred_username || userinfo.email;
      await user.save();
    } else {
      user = await User.create({
        sub: userinfo.sub,
        email: userinfo.email,
        name: userinfo.name || userinfo.preferred_username || userinfo.email,
        roles: ["user"],
        lastLogin: new Date(),
      });
    }

    const appToken = generateToken({
      id: user._id,
      sub: user.sub,
      email: user.email,
      roles: user.roles,
    });

    res.cookie("session", appToken, {
      httpOnly: false,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.json({
      success: true,
      user: {
        id: user._id,
        email: user.email,
        name: user.name,
        roles: user.roles,
      },
      tokenData: tokenData,
    });
  } catch (error) {
    console.error("Callback error:", error);
    res
      .status(500)
      .json({ error: "Internal server error", details: error.message });
  }
};

export const checkAuth = (req, res) => {
  res.json({
    authenticated: true,
    user: {
      id: req.user.id,
      email: req.user.email,
      roles: req.user.roles,
    },
  });
};

export const logout = (req, res) => {
  res.clearCookie("session", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
  });

  res.json({ success: true, message: "Logged out successfully" });
};

export const refreshTokens = async (req, res) => {
  try {
    const { refresh_token } = req.cookies;

    if (!refresh_token) {
      return res.status(401).json({ error: "No refresh token found" });
    }

    const keycloakConfig = getKeycloakConfig();

    const tokenResponse = await fetch(keycloakConfig.tokenEndpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({
        grant_type: "refresh_token",
        client_id: keycloakConfig.clientId,
        client_secret: keycloakConfig.clientSecret,
        refresh_token,
      }),
    });

    const tokenData = await tokenResponse.json();

    if (!tokenResponse.ok) {
      return res
        .status(400)
        .json({ error: "Failed to refresh tokens", details: tokenData });
    }

    // Return fresh tokens to frontend
    res.json({ tokenData });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
};
