import { createContext, useContext, useState, useEffect } from "react";

type AuthState = {
  token: string;
  user: { id: string; role: "user" | "admin"; email: string; name: string };
} | null;

type AuthContext = {
  auth: AuthState;
  login: (state: AuthState) => void;
  logout: () => void;
};

const Ctx = createContext<AuthContext | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [auth, setAuth] = useState<AuthState>(null);

  useEffect(() => {
    const raw = localStorage.getItem("auth");
    if (raw) {
      try {
        setAuth(JSON.parse(raw));
      } catch {}
    }
  }, []);

  function login(state: AuthState) {
    setAuth(state);
    localStorage.setItem("auth", JSON.stringify(state));
  }

  function logout() {
    setAuth(null);
    localStorage.removeItem("auth");
  }

  return (
    <Ctx.Provider value={{ auth, login, logout }}>{children}</Ctx.Provider>
  );
}

export function useAuth() {
  const v = useContext(Ctx);
  if (!v) throw new Error("useAuth must be used inside <AuthProvider>");
  return v;
}
