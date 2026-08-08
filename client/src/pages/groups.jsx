import { useState } from "react";

import getGroups from "../utility/groups.js";

export default function Groups() {
  const [flightId, setFlightId] = useState("");
  const [currentGroup] = useState("A");
  const [groups, setGroups] = useState({
    A: [],
    B: [],
    C: [],
  });

  async function loadGroups() {
    const data = await getGroups(flightId);

    if (data) {
      setGroups(data.groups);
    }
  }

  return (
    <div className="min-h-screen bg-[#F5F3EE] font-sans text-[#0B1D3A] p-8">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@500;600;700&family=Inter:wght@400;500;600&family=IBM+Plex+Mono:wght@500;600&display=swap');
      `}</style>

      <div className="flex justify-center items-center flex-col">
        <input
          type="text"
          value={flightId}
          placeholder="Enter Flight ID"
          className="border border-[#DCD7C9] rounded-lg px-4 py-2 bg-white text-[#0B1D3A] font-mono tracking-wide focus:outline-none focus:border-[#F2A93B] focus:ring-4 focus:ring-[#F2A93B]/25"
          onChange={(e) => setFlightId(e.target.value.toUpperCase())}
        />
        <button
          className="bg-[#0B1D3A] text-center text-[#F5F3EE] font-semibold px-4 py-2 m-4 rounded-lg transition-colors hover:bg-[#142a52]"
          onClick={() => loadGroups()}
        >
          Search
        </button>
      </div>
      <div className="max-w-6xl mx-auto">
        <h1 className="font-['Space_Grotesk',sans-serif] text-4xl font-bold text-center">
          Boarding Groups
        </h1>

        <p className="text-center text-[#5B6472] mt-2">
          Passengers organized by boarding group.
        </p>

        <div className="grid md:grid-cols-3 gap-6 mt-10">
          {["A", "B", "C"].map((g) => (
            <div
              key={g}
              className={`rounded-2xl shadow-lg p-6 border-2 transition text-[#0B1D3A] ${
                currentGroup === g
                  ? "border-[#F2A93B] bg-[#F2A93B]/10"
                  : "border-[#E4E0D6] bg-white"
              }`}
            >
              <div className="flex items-center justify-between mb-5">
                <h2 className="font-['Space_Grotesk',sans-serif] text-2xl font-bold">
                  Group {g}
                </h2>

                {currentGroup === g && (
                  <span className="bg-[#F2A93B] text-[#0B1D3A] px-3 py-1 rounded-full text-sm font-semibold">
                    Boarding
                  </span>
                )}
              </div>

              <div className="space-y-3">
                {groups[g].map((p) => (
                  <div
                    key={p.queueNumber}
                    className="rounded-lg border border-[#E4E0D6] bg-[#F5F3EE] p-3"
                  >
                    <p className="font-semibold">{p.name}</p>

                    <p className="text-[#7C8698] text-sm font-mono">
                      Seat {p.seat}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
