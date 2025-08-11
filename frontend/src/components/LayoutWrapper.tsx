"use client";
import { ReactNode, useEffect } from "react";
import { api } from "@/lib/api";

interface LayoutWrapperProps {
  children: ReactNode;
}

export default function LayoutWrapper({ children }: LayoutWrapperProps) {
  useEffect(() => {
    const refreshTokens = async () => {
      try {
        if (
          !document.cookie.includes("refresh_token") ||
          !document.cookie.includes("session")
        )
          return;

        const data = await api.refreshTokens();

        console.log("LayoutWrapper", data);
        if (!data?.tokenData) return;

        const { access_token, id_token, refresh_token } = data.tokenData;

        document.cookie = `access_token=${access_token}; path=/; SameSite=Lax`;
        document.cookie = `id_token=${id_token}; path=/; SameSite=Lax`;
        document.cookie = `refresh_token=${refresh_token}; path=/; SameSite=Lax`;
      } catch (err) {
        console.error("Failed to refresh tokens:", err);
      }
    };

    refreshTokens();
  }, []);

  return <>{children}</>;
}
