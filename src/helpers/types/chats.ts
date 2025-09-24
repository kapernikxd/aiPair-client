import { AuthRouteKey } from "@/helpers/hooks/useAuthRoutes";

export type ChatThread = {
  id: number;
  name: string;
  preview: string;
  timestamp: string;
  routeKey: AuthRouteKey;
  avatar?: {
    src: string;
    alt?: string;
  };
};