import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { login } from "../api/api.js";
import useAuth from "../context/useAuth.js";
import { setAccessToken } from "../api/token.js";

export default function Login() {
  const navigate = useNavigate();

  const { setAuthUser, setIsLoggedIn } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();

    setError("");

    if (!email || !password) {
      setError("Email and password are required");
      return;
    }

    setLoading(true);

    try {
      const data = await login(email, password);

      if (!data?.success) {
        setError(data?.message || "Login failed");
        return;
      }

      setAccessToken(data.accessToken);

      // Store the user in AuthContext
      setAuthUser(data.user);

      // Tell the application that the user is logged in
      setIsLoggedIn(true);

      navigate("/home");
    } catch (err) {
      console.error(err);
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-[#F5F3EE] flex items-center justify-center px-6">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <p className="font-mono text-xs tracking-[0.2em] text-[#7C8698] mb-3">
            AIRPORT BOARDING SYSTEM
          </p>

          <h1 className="text-4xl font-bold text-[#0B1D3A]">Welcome Back</h1>

          <p className="text-[#7C8698] mt-2">
            Sign in to access your boarding information.
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="bg-white border border-[#E4E0D6] rounded-xl p-8 shadow-sm"
        >
          {error && (
            <div className="mb-5 rounded-lg bg-[#D9534F]/10 border border-[#D9534F]/20 px-4 py-3 text-sm text-[#D9534F]">
              {error}
            </div>
          )}

          <div className="mb-5">
            <label className="block text-sm font-semibold text-[#0B1D3A] mb-2">
              Email
            </label>

            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              className="w-full px-4 py-3 rounded-lg border border-[#D8D4CA] outline-none focus:border-[#0B1D3A]"
            />
          </div>

          <div className="mb-6">
            <label className="block text-sm font-semibold text-[#0B1D3A] mb-2">
              Password
            </label>

            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full px-4 py-3 rounded-lg border border-[#D8D4CA] outline-none focus:border-[#0B1D3A]"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#0B1D3A] text-[#F5F3EE] py-3 rounded-lg font-semibold transition hover:brightness-110 disabled:opacity-60"
          >
            {loading ? "Signing In..." : "Sign In"}
          </button>

          <div className="text-center mt-6 text-sm text-[#7C8698]">
            Don't have an account?{" "}
            <Link
              to="/register"
              className="font-semibold text-[#0B1D3A] hover:underline"
            >
              Register
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}
