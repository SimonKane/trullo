import { useState } from "react";
import { useAuth } from "./AuthContext";

export default function LoginPage() {
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [err, setErr] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    try {
      const res = await fetch("http://localhost:3000/trullo/login", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      if (!res.ok) throw new Error(await res.text());

      const data = await res.json();

      login(data);
    } catch (error: any) {
      setErr(error.message || "Login Failed");
    }
  }

  return (
    <div className="mx-auto mt-80  max-w-sm rounded bg-mainBackgroundColor p-6">
      <h1 className="mb-4 text-lg font-bold">Sign in</h1>
      <form onSubmit={onSubmit} className="space-y-3">
        <input
          type="email"
          placeholder="Email"
          className="w-full rounded bg-columnBackgroundColor p-2"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="password"
          placeholder="Password"
          className="w-full rounded bg-columnBackgroundColor p-2"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        {err && <p className="text-red-400 text-sm">{err}</p>}
        <button className="w-full rounded bg-blue-600 py-2 text-white">
          Login
        </button>
      </form>
    </div>
  );
}
