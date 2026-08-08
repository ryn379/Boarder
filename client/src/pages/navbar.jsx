import { Link } from "react-router-dom";

const links = [
  { to: "/", label: "Home" },
  { to: "/lookup", label: "Look Up" },
  { to: "/groups", label: "Groups" },
  { to: "/aircraft", label: "Aircraft" },
  { to: "/analytics", label: "Analytics" },
  { to: "/ordertable", label: "Boarding" },
];

export default function Navbar() {
  return (
    <div className="bg-[#F5F3EE] font-sans">
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
        </ul>
      </div>
    </div>
  );
}
