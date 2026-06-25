import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import { useNavigate, useSearchParams } from "react-router";
import { useEffect } from "react";

function getOAuthUrl(redirectTarget: string) {
  const auth0Domain = import.meta.env.VITE_AUTH0_DOMAIN;
  const clientId = import.meta.env.VITE_AUTH0_CLIENT_ID;
  const redirectUri = `${window.location.origin}/api/auth/callback`;

  const url = new URL(`https://${auth0Domain}/authorize`);
  url.searchParams.set("client_id", clientId);
  url.searchParams.set("redirect_uri", redirectUri);
  url.searchParams.set("response_type", "code");
  url.searchParams.set("scope", "openid profile email");
  url.searchParams.set("connection", "google-oauth2");
  url.searchParams.set("state", redirectTarget);

  return url.toString();
}

export default function Login() {
  const { isAuthenticated, isLoading } = useAuth();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const redirectTarget = searchParams.get("redirect") || "/dashboard";

  useEffect(() => {
    if (isAuthenticated && !isLoading) {
      navigate(redirectTarget, { replace: true });
    }
  }, [isAuthenticated, isLoading, navigate, redirectTarget]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white text-black">
        <p className="text-sm tracking-widest uppercase animate-pulse">Checking session...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center">
      <Card className="w-full max-w-sm">
        <CardHeader className="text-center">
          <CardTitle>Welcome</CardTitle>
        </CardHeader>
        <CardContent>
          <Button
            className="w-full"
            size="lg"
            onClick={() => {
              window.location.href = getOAuthUrl(redirectTarget);
            }}
          >
            Sign in with Google
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
