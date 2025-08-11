"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { jwtDecode } from "jwt-decode";
import { getCookie } from "cookies-next";
import { performFullLogout } from "@/lib/keycloak";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkJWT = () => {
      const token = getCookie("session") as string | undefined;
      console.log("session token", token);
      if (!token) {
        performFullLogout();
        return;
      }

      try {
        const decoded = jwtDecode<{ exp: number }>(token);
        console.log("decoded", decoded);
        const now = Date.now() / 1000;
        if (decoded.exp < now) {
          performFullLogout();
        }
      } catch {
        performFullLogout();
      }
    };

    checkJWT();
    setLoading(false);
  }, [router]);

  if (loading) {
    return (
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          minHeight: "100vh",
        }}
      >
        <div
          style={{
            width: "50px",
            height: "50px",
            border: "5px solid #f3f3f3",
            borderTop: "5px solid #667eea",
            borderRadius: "50%",
            animation: "spin 1s linear infinite",
          }}
        />
        <p style={{ marginTop: "1rem", color: "#666" }}>Authenticating...</p>
        <style jsx>{`
          @keyframes spin {
            0% {
              transform: rotate(0deg);
            }
            100% {
              transform: rotate(360deg);
            }
          }
        `}</style>
      </div>
    );
  }
  return <>{children}</>;
}
