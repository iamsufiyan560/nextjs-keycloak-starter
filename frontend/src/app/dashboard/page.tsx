"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { api } from "@/lib/api";
import { performFullLogout } from "@/lib/keycloak";
import RoleIndicator from "@/components/RoleIndicator";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { LogOut, User, Calendar, Clock } from "lucide-react";
import DashboardProfileSkeleton from "@/components/DashboardProfileSkeleton";

interface User {
  id: string;
  email: string;
  name: string;
  roles: string[];
  lastLogin: string;
  createdAt: string;
}

export default function DashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await api.getProfile();
        setUser(response.user);
      } catch (error) {
        console.error("Failed to fetch profile:", error);
        router.push("/");
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [router]);

  const handleLogout = async () => {
    await api.logout();
    performFullLogout();
  };

  if (loading) {
    return <DashboardProfileSkeleton />;
  }

  if (!user) return null;

  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <Card>
          <CardContent className="p-6">
            <div className="flex justify-between items-start flex-wrap gap-4">
              <div className="space-y-3">
                <div>
                  <h1 className="text-3xl font-bold text-foreground">
                    Welcome, {user.name}!
                  </h1>
                  <p className="text-muted-foreground mt-1">{user.email}</p>
                </div>
                <div className="flex gap-2 flex-wrap">
                  {user.roles.map((role) => (
                    <Badge key={role} variant="default">
                      {role}
                    </Badge>
                  ))}
                </div>
              </div>
              <Button
                onClick={handleLogout}
                variant="destructive"
                className="gap-2"
              >
                <LogOut className="w-4 h-4" />
                Logout
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Role-based Components */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <RoleIndicator roles={user.roles} requiredRole="admin" />
          <RoleIndicator roles={user.roles} requiredRole="manager" />
          <RoleIndicator roles={user.roles} requiredRole="user" />
        </div>

        {/* User Details */}
        <Card>
          <CardHeader>
            <CardTitle>Account Information</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <User className="w-4 h-4" />
                  <span>User ID</span>
                </div>
                <p className="font-semibold font-mono text-foreground">
                  {user.id}
                </p>
              </div>
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Clock className="w-4 h-4" />
                  <span>Last Login</span>
                </div>
                <p className="font-semibold text-foreground">
                  {new Date(user.lastLogin).toLocaleString()}
                </p>
              </div>
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Calendar className="w-4 h-4" />
                  <span>Account Created</span>
                </div>
                <p className="font-semibold text-foreground">
                  {new Date(user.createdAt).toLocaleDateString()}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
