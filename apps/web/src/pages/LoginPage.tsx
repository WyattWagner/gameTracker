import { FormEvent, useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { NotebookButton, NotebookInput, ErrorState } from "@game-tracker/ui";
import { useAuth } from "../api/AuthContext";
import { BookCover, ParchmentPage } from "../components/book/BookCover";
import { useParchmentTexture } from "../hooks/useParchmentTexture";

export function LoginPage() {
  const { api, setToken, token } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("hunter@example.com");
  const [password, setPassword] = useState("password123");
  const [error, setError] = useState<string | null>(null);
  useParchmentTexture();

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
    <div className="flex min-h-dvh items-center justify-center p-4">
      <BookCover className="max-h-[90dvh]">
        <ParchmentPage className="flex items-center justify-center">
          <div className="notebook-stat-panel w-full max-w-md space-y-4">
            <div className="text-center">
              <p className="notebook-stat-label font-hand text-lg">Hunter&apos;s Field Journal</p>
              <h2 className="notebook-stat-value font-serif text-2xl font-bold">Sign in to continue</h2>
            </div>
            <form onSubmit={onSubmit} className="space-y-4">
              <NotebookInput value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" type="email" />
              <NotebookInput
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password"
              />
              {error && <ErrorState message={error} />}
              <NotebookButton type="submit" className="w-full">
                Continue
              </NotebookButton>
            </form>
          </div>
        </ParchmentPage>
      </BookCover>
    </div>
  );
}
