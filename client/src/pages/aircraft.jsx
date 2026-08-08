import { useEffect, useState } from "react";
import getSessions from "../utility/handleSessions.js";

function Aircraft() {
  const [sessions, setSessions] = useState({
    boardingFlights: [],
    upcomingFlights: [],
  });

  useEffect(() => {
    const handleSessions = async () => {
      const data = await getSessions();
      if (data) setSessions(data);
    };
    handleSessions();
    const id = setInterval(() => handleSessions(), 5000);
    return () => clearInterval(id);
  }, []);

  const FlightCard = ({ flight }) => (
    <div className="bg-white rounded-xl shadow-md p-5 border border-[#E4E0D6] font-mono">
      <div className="flex justify-between items-center mb-3">
        <h3 className="text-lg font-bold font-['Space_Grotesk',sans-serif]">
          {flight.flightCode}
        </h3>
        <span
          className={`px-3 py-1 rounded-full text-sm font-semibold tracking-wide ${
            flight.status === "BOARDING"
              ? "bg-[#2FA867]/15 text-[#2FA867]"
              : flight.status === "DELAYED"
                ? "bg-[#D9534F]/15 text-[#D9534F]"
                : "bg-[#F2A93B]/15 text-[#B5791F]"
          }`}
        >
          {flight.status}
        </span>
      </div>

      <p className="text-[#0B1D3A] font-medium">{flight.airline}</p>
      <p className="text-sm text-[#7C8698] mb-3">{flight.aircraft}</p>

      <div className="grid grid-cols-2 gap-2 text-sm">
        <div>
          <span className="font-semibold font-mono">From:</span> {flight.from}
        </div>

        <div>
          <span className="font-semibold font-mono">To:</span> {flight.to}
        </div>

        <div>
          <span className="font-semibold">Departure:</span>{" "}
          {new Date(flight.departure).toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          })}
        </div>

        <div className="text-[#0B1D3A] font-mono">
          <span className="font-semibold text-[#0B1D3A]">Arrival:</span>{" "}
          {new Date(flight.arrival).toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          })}
        </div>

        <div>
          <span className="font-semibold text-[#0B1D3A]">Gate:</span>{" "}
          {flight.gate}
        </div>

        <div>
          <span className="font-semibold text-[#0B1D3A]">Terminal:</span>{" "}
          {flight.terminal}
        </div>

        <div>
          <span className="font-semibold text-[#0B1D3A]">Delay:</span>{" "}
          {flight.delay} min
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#F5F3EE] p-8 text-[#0B1D3A] font-sans">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@500;600;700&family=Inter:wght@400;500;600&family=IBM+Plex+Mono:wght@500;600&display=swap');
      `}</style>

      <h1 className="text-3xl font-bold mb-8 text-[#0B1D3A] font-['Space_Grotesk',sans-serif]">
        Aircraft Dashboard
      </h1>

      {/* Boarding */}
      <section className="mb-12">
        <h2 className="text-2xl font-semibold mb-4 font-['Space_Grotesk',sans-serif]">
          Aircrafts Boarding Right Now
        </h2>

        {sessions.boardingFlights.length === 0 ? (
          <p className="text-[#7C8698]">No aircraft currently boarding.</p>
        ) : (
          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {sessions.boardingFlights.map((flight) => (
              <FlightCard key={flight.id} flight={flight} />
            ))}
          </div>
        )}
      </section>

      {/* Upcoming */}
      <section>
        <h2 className="text-2xl font-semibold mb-4 font-['Space_Grotesk',sans-serif]">
          Upcoming Aircrafts
        </h2>

        {sessions.upcomingFlights.length === 0 ? (
          <p className="text-[#7C8698]">No upcoming flights.</p>
        ) : (
          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {sessions.upcomingFlights.map((flight) => (
              <FlightCard key={flight.id} flight={flight} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

export default Aircraft;

// All Aircraft boarding right now
// All Aircrafts scheduled later
// Aircrafts with time of departure, arrival, boarding gates, delay, id
