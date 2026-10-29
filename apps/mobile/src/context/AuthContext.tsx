import {
  clearAuthTokens,
  getAccessToken,
  saveAuthTokens,
} from "@/features/auth/services/authStorage";
import {
  createContext,
  PropsWithChildren,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

type AuthStatus = "loading" | "authenticated" | "unauthenticated";

type AuthContextValue = {
  status: AuthStatus;
  signIn: (accessToken: string, refreshToken: string) => Promise<void>;
  signOut: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: PropsWithChildren) {
  const [status, setStatus] = useState<AuthStatus>("loading");

  useEffect(() => {
    let active = true;

    async function restoreSession() {
      try {
        const accessToken = await getAccessToken();

        if (active) {
          setStatus(accessToken ? "authenticated" : "unauthenticated");
        }
      } catch (error) {
        console.warn("Unable to restore the authentication session.", error);

        if (active) {
          setStatus("unauthenticated");
        }
      }
    }

    restoreSession();

    return () => {
      active = false;
    };
  }, []);

  const value = useMemo<AuthContextValue>(
    () => ({
      status,
      signIn: async (accessToken, refreshToken) => {
        await saveAuthTokens(accessToken, refreshToken);
        setStatus("authenticated");
      },
      signOut: async () => {
        await clearAuthTokens();
        setStatus("unauthenticated");
      },
    }),
    [status],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used inside AuthProvider.");
  }

  return context;
}
