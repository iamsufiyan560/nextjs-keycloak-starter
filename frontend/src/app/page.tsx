"use client";

import { getKeycloakLoginUrl } from "@/lib/keycloak";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { LogIn, Shield, Zap, Code2 } from "lucide-react";

export default function LoginPage() {
  const handleLogin = () => {
    window.location.href = getKeycloakLoginUrl();
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <div className="w-full max-w-md space-y-8">
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="flex justify-center mb-4">
            <div className="p-3 rounded-full bg-primary/10">
              <Shield className="w-12 h-12 text-primary" />
            </div>
          </div>
          <h1 className="text-4xl font-bold tracking-tight text-foreground">
            Welcome
          </h1>
          <p className="text-muted-foreground text-lg">
            Next.js + Keycloak Authentication Starter
          </p>
        </div>

        {/* Login Card */}
        <Card>
          <CardHeader className="text-center">
            <CardTitle>Get Started</CardTitle>
            <CardDescription>
              Secure authentication powered by Keycloak
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button
              onClick={handleLogin}
              className="w-full cursor-pointer"
              size="lg"
            >
              <LogIn className="w-5 h-5 mr-2" />
              Login via Keycloak
            </Button>

            {/* Features */}
            <div className="pt-4 space-y-3">
              <div className="flex items-center gap-3 text-sm text-muted-foreground">
                <Code2 className="w-4 h-4" />
                <span>Next.js 14 + TypeScript</span>
              </div>
              <div className="flex items-center gap-3 text-sm text-muted-foreground">
                <Shield className="w-4 h-4" />
                <span>Keycloak Authentication</span>
              </div>
              <div className="flex items-center gap-3 text-sm text-muted-foreground">
                <Zap className="w-4 h-4" />
                <span>Node.js Backend</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Footer */}
        <p className="text-center text-sm text-muted-foreground">
          A production-ready authentication starter template
        </p>
      </div>
    </div>
  );
}
