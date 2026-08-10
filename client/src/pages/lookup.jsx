import { useState, useEffect } from "react";
import handleLookUpSubmit from "../utility/handleSubmit.js";
import loadFlights from "../utility/loadFlight.js";

import socket from "../socket.js";

export default function LookUp() {
  const [flights, setFlights] = useState([]); // all flights
  const [flight, setFlight] = useState(""); //first flight
  const [search, setSearch] = useState(""); //search input
  const [result, setResult] = useState(null); //result display

  async function handleSearch() {
    const data = await handleLookUpSubmit({ flight, search });
    if (data) {
      setResult(data);
    }
  }

  useEffect(() => {
    loadFlights({ flight, setFlight, setFlights });

    const handleSessionStarted = () => {
      loadFlights({ flight, setFlight, setFlights });
    };

    socket.on("sessionStarted", handleSessionStarted);

    return () => {
      socket.off("sessionStarted", handleSessionStarted);
    };
  }, []);

  return (
    <div className="min-h-screen bg-[#F5F3EE] font-sans text-[#0B1D3A]">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@500;600;700&family=Inter:wght@400;500;600&family=IBM+Plex+Mono:wght@500;600&display=swap');
      `}</style>

      <div className="max-w-3xl mx-auto px-6 pt-14 pb-16">
        <div className="text-center mb-8">
          <div className="font-mono text-xs tracking-[0.2em] text-[#7C8698] mb-2">
            PASSENGER LOOKUP
          </div>
          <h1 className="font-['Space_Grotesk',sans-serif] text-4xl font-bold m-0">
            Passenger Lookup
          </h1>
          <p className="text-[#5B6472] mt-2">
            Search passengers by name, seat, or queue number.
          </p>
        </div>

        <div className="bg-white rounded-xl border border-[#E4E0D6] p-7 transition-shadow hover:shadow-[0_4px_16px_rgba(11,29,58,0.08)]">
          <div className="grid gap-5">
            <div>
              <label className="block mb-1.5 text-xs font-semibold tracking-wide uppercase text-[#5B6472]">
                Flight
              </label>

              <select
                value={flight}
                onChange={(e) => setFlight(e.target.value)}
                className="w-full border border-[#DCD7C9] rounded-lg px-3.5 py-2.5 text-[15px] bg-white text-[#0B1D3A] transition-colors focus:outline-none focus:border-[#F2A93B] focus:ring-4 focus:ring-[#F2A93B]/25"
              >
                {flights.map((f) => (
                  <option key={f.flightCode} value={f.flightCode}>
                    {f.flightCode}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block mb-1.5 text-xs font-semibold tracking-wide uppercase text-[#5B6472]">
                Passenger
              </label>

              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Name, Seat (12A), Queue Number"
                className="w-full border border-[#DCD7C9] rounded-lg px-3.5 py-2.5 text-[15px] bg-white text-[#0B1D3A] transition-colors focus:outline-none focus:border-[#F2A93B] focus:ring-4 focus:ring-[#F2A93B]/25"
              />
            </div>

            <button
              onClick={handleSearch}
              className="w-full bg-[#0B1D3A] text-[#F5F3EE] rounded-lg py-3 font-semibold text-[15px] transition-colors hover:bg-[#142a52]"
            >
              Search
            </button>
          </div>
        </div>

        {result && (
          <div className="bg-white rounded-xl border border-[#E4E0D6] p-6 mt-7">
            <h2 className="font-['Space_Grotesk',sans-serif] text-lg font-semibold mb-4">
              Search Results
            </h2>

            {(Array.isArray(result.passengers)
              ? result.passengers
              : [result.passengers]
            ).map((p) => (
              <div
                key={p.id}
                className="bg-[#F5F3EE] rounded-lg p-4.5 mb-3.5 last:mb-0 border border-[#E4E0D6]"
              >
                <div className="grid grid-cols-2 gap-y-2.5 gap-x-6">
                  <p className="m-0">
                    <span className="font-semibold text-[#5B6472]">Name:</span>{" "}
                    {p.name}
                  </p>

                  <p className="m-0">
                    <span className="font-semibold text-[#5B6472]">Seat:</span>{" "}
                    <span className="font-mono">{p.seat}</span>
                  </p>

                  <p className="m-0">
                    <span className="font-semibold text-[#5B6472]">Queue:</span>{" "}
                    <span className="font-mono">{p.queueNumber}</span>
                  </p>

                  <p className="m-0">
                    <span className="font-semibold text-[#5B6472]">Group:</span>{" "}
                    {p.group}
                  </p>

                  <p className="m-0 col-span-2">
                    <span className="font-semibold text-[#5B6472]">
                      Boarded:
                    </span>{" "}
                    <span
                      className={`font-semibold ${
                        p.seated ? "text-[#2FA867]" : "text-[#D9534F]"
                      }`}
                    >
                      {p.seated ? "✓ Yes" : "✗ No"}
                    </span>
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
