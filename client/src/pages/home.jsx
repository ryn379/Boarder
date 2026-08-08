import { useState, useEffect } from "react";
import handleHome from "../utility/handleHome.js";
import markSeated from "../utility/markSeated.js";
import loadTable from "../utility/loadTable.js";

const STATUS_COLORS = {
  Boarding: { fg: "#F2A93B", bg: "rgba(242,169,59,0.14)" },
  "On Time": { fg: "#2FA867", bg: "rgba(47,168,103,0.14)" },
  Delayed: { fg: "#D9534F", bg: "rgba(217,83,79,0.14)" },
  Departed: { fg: "#7C8698", bg: "rgba(124,134,152,0.14)" },
};

export default function Home() {
  const [data, setData] = useState(null);
  useEffect(() => {
    let cancelled = false;
    async function load() {
      const result = await handleHome();
      if (!cancelled) setData(result);
    }
    load();
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <div className="min-h-screen bg-[#F5F3EE] font-sans text-[#0B1D3A]">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@500;600;700&family=Inter:wght@400;500;600&family=IBM+Plex+Mono:wght@500;600&display=swap');
        .board-char {
          display: inline-block;
          animation: flip 0.5s ease-out;
        }
        @keyframes flip {
          0% { opacity: 0; transform: rotateX(90deg); }
          100% { opacity: 1; transform: rotateX(0deg); }
        }
        @media (prefers-reduced-motion: reduce) {
          .board-char { animation: none; }
        }
      `}</style>

      {!data ? <LoadingBoard /> : <Loaded data={data} />}
    </div>
  );
}

function LoadingBoard() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0B1D3A]">
      <div className="font-mono text-[#F2A93B] text-xl tracking-[0.15em]">
        RETRIEVING FLIGHT DATA<span className="opacity-60">...</span>
      </div>
    </div>
  );
}

function Loaded({ data }) {
  const { passenger, flight } = data;
  const flightCode = flight?.flightCode || passenger?.flight?.flightCode;
  const [status, setStatus] = useState("On Time");

  const [seated, setSeated] = useState(false);
  const [seating, setSeating] = useState(false);
  const [seatError, setSeatError] = useState("");

  const statusColor = STATUS_COLORS[status] || STATUS_COLORS["On Time"];
  useEffect(() => {
    async function loadBoardingStatus() {
      if (!flightCode) {
        setStatus("On Time");
        return;
      }

      const result = await loadTable(flightCode);

      if (!result) {
        setStatus("On Time");
        return;
      }

      setStatus(result.boardingComplete ? "Departed" : "Boarding");

      const targetPassenger = result.passengers?.find(
        (entry) => entry.queueNumber === passenger.queue,
      );

      if (targetPassenger) {
        setSeated(
          result.boardedMatrix[targetPassenger.row][targetPassenger.col],
        );
      } else {
        setSeated(false);
      }
    }

    loadBoardingStatus();

    const interval = setInterval(loadBoardingStatus, 2000);

    return () => clearInterval(interval);
  }, [flightCode, passenger.queue]);

  async function handleSeat() {
    if (seated || seating) return;

    setSeating(true);
    setSeatError("");

    try {
      const data = await markSeated(flightCode, passenger.queue);

      if (!data?.success) {
        setSeatError(data?.message || "Seat could not be marked");
        return;
      }
      setSeated(true);
    } finally {
      setSeating(false);
    }
  }

  const departure = new Date(flight.departure);
  const arrival = new Date(flight.arrival);
  const fmtTime = (d) =>
    d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  const fmtDate = (d) =>
    d.toLocaleDateString([], {
      weekday: "short",
      month: "short",
      day: "numeric",
    });

  return (
    <div className="max-w-220 mx-auto pb-16">
      {/* Departure board hero */}
      <div className="bg-[#0B1D3A] px-8 py-7 text-[#F5F3EE]">
        <div className="flex justify-between items-start flex-wrap gap-4">
          <div>
            <div className="font-mono text-[13px] tracking-[0.2em] text-[#7C8698] mb-1.5">
              WELCOME
            </div>
            <h1 className="font-['Space_Grotesk',sans-serif] text-[32px] font-bold m-0">
              {passenger.name}
            </h1>
          </div>

          <div
            className="font-mono text-[13px] tracking-[0.15em] px-3.5 py-1.5 rounded self-center whitespace-nowrap"
            style={{
              color: statusColor.fg,
              background: statusColor.bg,
              border: `1px solid ${statusColor.fg}55`,
            }}
          >
            {status.toUpperCase()}
          </div>
        </div>

        {/* Route strip, split-flap style */}
        <div className="mt-6 flex items-center gap-5 font-mono">
          <BoardBlock label="FROM" value={flight.origin} />
          <div className="text-[#F2A93B] text-[22px] mt-3.5">&#9992;</div>
          <BoardBlock label="TO" value={flight.destination} />
          <div className="w-px h-11 bg-[#2A3B5C] mt-3.5 mx-2" />
          <BoardBlock label="FLIGHT" value={flight.flightCode} small />
          <BoardBlock label="GATE" value={flight.gate} small />
          <BoardBlock label="TERM" value={flight.terminal} small />
        </div>
      </div>

      <div className="px-8">
        {/* Info cards */}
        <div className="grid grid-cols-2 gap-5 mt-6">
          <Card title="Passenger">
            <div className="flex justify-between items-baseline py-2.5 border-b border-[#E4E0D6]">
              <span className="text-[#7C8698]">Passenger ID</span>
              <span className="font-mono">{passenger.id}</span>
            </div>
            <div className="flex justify-between items-baseline py-2.5 border-b border-[#E4E0D6]">
              <span className="text-[#7C8698]">Seat</span>
              <span className="font-semibold">{passenger.seat}</span>
            </div>
            <div className="flex justify-between items-baseline py-2.5 border-b border-[#E4E0D6]">
              <span className="text-[#7C8698]">Boarding queue</span>
              <span className="font-semibold">#{passenger.queue}</span>
            </div>
            <div className="flex justify-between items-baseline py-2.5">
              <span className="text-[#7C8698]">Boarding status</span>
              <span
                className={`font-semibold ${
                  seated ? "text-[#2FA867]" : "text-[#F2A93B]"
                }`}
              >
                {seated ? "Boarded" : "Waiting"}
              </span>
            </div>
          </Card>

          <Card title="Flight">
            <div className="flex justify-between items-baseline py-2.5 border-b border-[#E4E0D6]">
              <span className="text-[#7C8698]">Airline</span>
              <span className="font-semibold">{flight.airline}</span>
            </div>
            <div className="flex justify-between items-baseline py-2.5 border-b border-[#E4E0D6]">
              <span className="text-[#7C8698]">Aircraft</span>
              <span className="font-semibold">{flight.aircraft}</span>
            </div>
            <div className="flex justify-between items-baseline py-2.5 border-b border-[#E4E0D6]">
              <span className="text-[#7C8698]">Departure</span>
              <span className="font-mono">
                {fmtTime(departure)} &middot; {fmtDate(departure)}
              </span>
            </div>
            <div className="flex justify-between items-baseline py-2.5">
              <span className="text-[#7C8698]">Arrival</span>
              <span className="font-mono">
                {fmtTime(arrival)} &middot; {fmtDate(arrival)}
              </span>
            </div>
          </Card>
        </div>

        {/* Boarding pass stub — signature element */}
        <div className="mt-6 relative flex bg-[#0B1D3A] rounded-xl shadow-[0_8px_24px_rgba(11,29,58,0.18)]">
          <div className="flex-1 px-7 py-6">
            <div className="font-mono text-xs tracking-[0.2em] text-[#7C8698] mb-4.5">
              BOARDING PASS
            </div>
            <div className="flex gap-10 flex-wrap items-center">
              <Stat label="Queue" value={passenger.queue} color="#F2A93B" />
              <Stat label="Seat" value={passenger.seat} color="#F5F3EE" />
              <Stat label="Gate" value={flight.gate} color="#F5F3EE" />

              <div className="flex flex-col items-center gap-1.5">
                <button
                  type="button"
                  onClick={handleSeat}
                  disabled={seated || seating}
                  aria-pressed={seated}
                  className={`w-14 h-14 rounded-full font-['Space_Grotesk',sans-serif] text-xs font-bold tracking-wide transition ${
                    seated
                      ? "bg-[#2FA867] text-white cursor-default"
                      : seating
                        ? "bg-[#F2A93B]/60 text-[#0B1D3A] cursor-wait"
                        : "bg-[#F2A93B] text-[#0B1D3A] hover:brightness-95"
                  }`}
                >
                  {seated ? "✓" : seating ? "…" : "Not Seated"}
                </button>
                {seatError && (
                  <span className="text-[10px] text-[#D9534F] max-w-20 text-center leading-tight">
                    {seatError}
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* perforation */}
          <div className="absolute w-5 h-5 rounded-full bg-[#F5F3EE] top-1/2 -translate-y-1/2 -left-2.5" />
          <div className="absolute w-5 h-5 rounded-full bg-[#F5F3EE] top-1/2 -translate-y-1/2 right-32.5" />
          <div className="absolute right-35 top-3 bottom-3 border-l-2 border-dashed border-[#2A3B5C]" />

          <div className="w-35 flex flex-col items-center justify-center p-4">
            <div
              className="font-['Space_Grotesk',sans-serif] text-[22px] font-bold text-[#F5F3EE] tracking-widest"
              style={{ writingMode: "vertical-rl" }}
            >
              {flight.id}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function BoardBlock({ label, value, small }) {
  return (
    <div>
      <div className="text-[11px] tracking-[0.15em] text-[#7C8698]">
        {label}
      </div>
      <div
        className={`font-semibold text-[#F5F3EE] ${
          small ? "text-xl" : "text-[30px]"
        }`}
      >
        {String(value)
          .split("")
          .map((ch, i) => (
            <span
              className="board-char"
              key={i}
              style={{ animationDelay: `${i * 40}ms` }}
            >
              {ch}
            </span>
          ))}
      </div>
    </div>
  );
}

function Stat({ label, value, color }) {
  return (
    <div>
      <div className="font-mono text-[11px] tracking-[0.15em] text-[#7C8698] mb-1">
        {label.toUpperCase()}
      </div>
      <div
        className="font-['Space_Grotesk',sans-serif] text-[36px] font-bold"
        style={{ color }}
      >
        {value}
      </div>
    </div>
  );
}

function Card({ title, children }) {
  return (
    <div className="bg-white rounded-xl px-6 py-5 border border-[#E4E0D6]">
      <h2 className="font-['Space_Grotesk',sans-serif] text-base font-semibold mb-2 text-[#0B1D3A]">
        {title}
      </h2>
      {children}
    </div>
  );
}
