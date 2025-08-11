import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Crown, BarChart3, User, Lock, CheckCircle2 } from "lucide-react";

interface RoleIndicatorProps {
  roles: string[];
  requiredRole: "admin" | "manager" | "user";
}

export default function RoleIndicator({
  roles,
  requiredRole,
}: RoleIndicatorProps) {
  const hasRole = roles.includes(requiredRole);

  const roleConfig = {
    admin: {
      label: "Admin Panel",
      icon: Crown,
      variant: "destructive" as const,
      bgClass: "bg-destructive/10",
      iconColor: "text-destructive",
    },
    manager: {
      label: "Manager Tools",
      icon: BarChart3,
      variant: "default" as const,
      bgClass: "bg-primary/10",
      iconColor: "text-primary",
    },
    user: {
      label: "User Dashboard",
      icon: User,
      variant: "secondary" as const,
      bgClass: "bg-secondary",
      iconColor: "text-secondary-foreground",
    },
  };

  const config = roleConfig[requiredRole];
  const Icon = config.icon;

  return (
    <Card
      className={`transition-all duration-300 ${
        hasRole ? "ring-2 ring-primary shadow-lg" : "opacity-60"
      }`}
    >
      <CardContent className="p-6">
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-start gap-3 flex-1">
            <div className={`p-3 rounded-lg ${config.bgClass}`}>
              <Icon className={`w-6 h-6 ${config.iconColor}`} />
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-lg text-foreground mb-1">
                {config.label}
              </h3>
              <div className="flex items-center gap-2 mt-2">
                {hasRole ? (
                  <>
                    <CheckCircle2 className="w-4 h-4 text-green-600" />
                    <Badge
                      variant="outline"
                      className="border-green-600 text-green-600"
                    >
                      Access Granted
                    </Badge>
                  </>
                ) : (
                  <>
                    <Lock className="w-4 h-4 text-muted-foreground" />
                    <Badge
                      variant="outline"
                      className="border-muted-foreground/50 text-muted-foreground"
                    >
                      No Access
                    </Badge>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
