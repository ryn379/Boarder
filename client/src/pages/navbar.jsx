import { Link, useNavigate } from "react-router-dom";
import useAuth from "../context/useAuth.js";

const links = [
  { to: "/home", label: "Home" },
  { to: "/lookup", label: "Look Up" },
  { to: "/groups", label: "Groups" },
  { to: "/aircraft", label: "Aircraft" },
  { to: "/analytics", label: "Analytics" },
  { to: "/ordertable", label: "Boarding" },
];

export default function Navbar() {
  const { logout } = useAuth();
  const navigate = useNavigate();

  async function handleLogout() {
    await logout();
    navigate("/login", { replace: true });
  }

  return (
    <div>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@500;600;700&family=Inter:wght@400;500;600&family=IBM+Plex+Mono:wght@500;600&display=swap');
      `}</style>

      <div className="m-5 w-full flex items-center justify-center">
        <ul className="flex items-center justify-center gap-2 text-[#0B1D3A] bg-white border border-[#E4E0D6] w-auto px-3 py-2.5 rounded-xl shadow-sm">
          {links.map((link) => (
            <li key={link.to}>
              <Link
                to={link.to}
                className="block font-mono text-sm tracking-wide px-4 py-2 rounded-lg text-[#5B6472] transition-colors duration-200 hover:bg-[#0B1D3A] hover:text-[#F5F3EE]"
              >
                {link.label}
              </Link>
            </li>
          ))}

          <li>
            <button
              onClick={handleLogout}
              className="block font-mono text-sm tracking-wide px-4 py-2 rounded-lg text-[#D9534F] transition-colors duration-200 hover:bg-[#D9534F] hover:text-white"
            >
              Logout
            </button>
          </li>
        </ul>
      </div>
    </div>
  );
}
