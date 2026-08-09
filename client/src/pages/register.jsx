import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { register } from "../api/api.js";
import useAuth from "../context/useAuth.js";
import { setAccessToken } from "../api/token.js";

export default function Register() {
  const navigate = useNavigate();

  const { setAuthUser, setIsLoggedIn } = useAuth();

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [bookingRef, setBookingRef] = useState("");

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();

    setError("");

    if (!username || !email || !password || !bookingRef) {
      setError("Username, email, password and booking reference are required");
      return;
    }

    setLoading(true);

    try {
      const data = await register(username, email, password, bookingRef);

      if (!data?.success) {
        setError(data?.message || "Registration failed");
        return;
      }

      setAccessToken(data.accessToken);

      // Store authentication information
      setAuthUser(data.user);
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
    <div className="min-h-screen bg-[#F5F3EE] flex items-center justify-center px-6 py-10">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <p className="font-mono text-xs tracking-[0.2em] text-[#7C8698] mb-3">
            AIRPORT BOARDING SYSTEM
          </p>

          <h1 className="text-4xl font-bold text-[#0B1D3A]">Create Account</h1>

          <p className="text-[#7C8698] mt-2">
            Link your account to your flight booking.
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
              Username
            </label>

            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Your username"
              className="w-full px-4 py-3 rounded-lg border border-[#D8D4CA] outline-none focus:border-[#0B1D3A]"
            />
          </div>

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

          <div className="mb-5">
            <label className="block text-sm font-semibold text-[#0B1D3A] mb-2">
              Password
            </label>

            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Create a password"
              className="w-full px-4 py-3 rounded-lg border border-[#D8D4CA] outline-none focus:border-[#0B1D3A]"
            />
          </div>

          <div className="mb-6">
            <label className="block text-sm font-semibold text-[#0B1D3A] mb-2">
              Booking Reference
            </label>

            <input
              type="text"
              value={bookingRef}
              onChange={(e) => setBookingRef(e.target.value)}
              placeholder="Enter your booking reference"
              className="w-full px-4 py-3 rounded-lg border border-[#D8D4CA] outline-none focus:border-[#0B1D3A]"
            />

            <p className="text-xs text-[#7C8698] mt-2">
              Use the booking reference associated with your passenger record.
            </p>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#0B1D3A] text-[#F5F3EE] py-3 rounded-lg font-semibold transition hover:brightness-110 disabled:opacity-60"
          >
            {loading ? "Creating Account..." : "Create Account"}
          </button>

          <div className="text-center mt-6 text-sm text-[#7C8698]">
            Already have an account?{" "}
            <Link
              to="/login"
              className="font-semibold text-[#0B1D3A] hover:underline"
            >
              Sign In
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}
