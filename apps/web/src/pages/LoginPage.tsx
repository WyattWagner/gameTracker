import { FormEvent, useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { useAuth } from "../api/AuthContext";

export function LoginPage() {
  const { api, setToken, token } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("hunter@example.com");
  const [password, setPassword] = useState("password123");
  const [error, setError] = useState<string | null>(null);

  if (token) return <Navigate to="/" replace />;

  async function onSubmit(event: FormEvent) {
    event.preventDefault();
    setError(null);
    try {
      const result = await api.login({ email, password }).catch(async () => {
        await api.register({ email, password });
        return api.login({ email, password });
      });
      setToken(result.accessToken);
      navigate("/");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Login failed");
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center p-6">
      <form onSubmit={onSubmit} className="w-full max-w-md space-y-4 rounded-xl border border-slate-700 bg-slate-900 p-6">
        <h2 className="text-xl font-semibold">Monster Hunter Tracker</h2>
        <input
          className="w-full rounded-md border border-slate-700 bg-slate-950 px-3 py-2"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email"
        />
        <input
          type="password"
          className="w-full rounded-md border border-slate-700 bg-slate-950 px-3 py-2"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
        />
        {error && <p className="text-sm text-red-300">{error}</p>}
        <button className="w-full rounded-md bg-emerald-600 px-3 py-2 font-medium hover:bg-emerald-500" type="submit">
          Continue
        </button>
      </form>
    </div>
  );
}
