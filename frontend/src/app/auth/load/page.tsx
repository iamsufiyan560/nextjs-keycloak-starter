"use client";

import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { api } from "@/lib/api";

export default function AuthLoadPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const handleCallback = async () => {
      const code = searchParams.get("code");
      const errorParam = searchParams.get("error");

      if (errorParam) {
        setError(`Authentication error: ${errorParam}`);
        return;
      }

      if (!code) {
        setError("No authorization code received");
        return;
      }

      try {
        const redirectUri = `${process.env.NEXT_PUBLIC_APP_URL}/auth/load`;
        // await api.exchangeCode(code, redirectUri);
        const data = await api.exchangeCode(code, redirectUri);

        const { access_token, id_token, refresh_token } = data.tokenData;

        document.cookie = `access_token=${access_token}; path=/; SameSite=Lax`;
        document.cookie = `id_token=${id_token}; path=/; SameSite=Lax`;
        document.cookie = `refresh_token=${refresh_token}; path=/; SameSite=Lax`;

        console.log("dataaaaa", data.tokenData);
        router.push("/dashboard");
      } catch (err: unknown) {
        if (err instanceof Error) {
          setError(err.message || "Failed to authenticate");
        } else {
          setError("Failed to authenticate");
        }
      }
    };

    handleCallback();
  }, [searchParams, router]);

  if (error) {
    return (
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          minHeight: "100vh",
          padding: "2rem",
        }}
      >
        <div
          style={{
            background: "#fee",
            color: "#c33",
            padding: "2rem",
            borderRadius: "0.5rem",
            maxWidth: "500px",
          }}
        >
          <h2>Authentication Error</h2>
          <p>{error}</p>
          <button
            onClick={() => router.push("/")}
            style={{
              marginTop: "1rem",
              padding: "0.5rem 1rem",
              background: "#c33",
              color: "white",
              border: "none",
              borderRadius: "0.25rem",
              cursor: "pointer",
            }}
          >
            Back to Login
          </button>
        </div>
      </div>
    );
  }

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
