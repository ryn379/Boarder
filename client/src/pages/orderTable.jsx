import { Fragment, useEffect, useState } from "react";
import loadTable from "../utility/loadTable.js";
import loadFlights from "../utility/loadFlight.js";

function OrderTable() {
  const [flight, setFlight] = useState("");
  const [flights, setFlights] = useState([]);

  const [boardedMatrix, setBoardedMatrix] = useState([]);
  const [progress, setProgress] = useState(0);
  const [seatedCount, setSeatedCount] = useState(0);
  const [totalPassengers, setTotalPassengers] = useState(0);
  const [boardingComplete, setBoardingComplete] = useState(false);

  useEffect(() => {
    if (!flight) return;

    const load = async () => {
      const data = await loadTable(flight);

      if (!data?.success) return;

      setBoardedMatrix(data.boardedMatrix);
      setProgress(data.progress);
      setSeatedCount(data.seatedCount);
      setTotalPassengers(data.totalPassengers);
      setBoardingComplete(data.boardingComplete);
    };

    load();

    const id = setInterval(load, 2000);

    return () => clearInterval(id);
  }, [flight]);

  useEffect(() => {
    loadFlights({ flight, setFlight, setFlights });

    const id = setInterval(() => {
      loadFlights({ setFlight, setFlights });
    }, 5000);

    return () => clearInterval(id);
  }, []);

  return (
    <div className="flex flex-col items-center p-8 font-mono text-[#0B1D3A] bg-[#F5F3EE] min-h-screen">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@500;600;700&family=Inter:wght@400;500;600&family=IBM+Plex+Mono:wght@500;600&display=swap');
      `}</style>

      <h1 className="mb-6 text-4xl font-bold font-['Space_Grotesk',sans-serif]">
        ✈ Live Boarding Status
      </h1>

      <select
        value={flight}
        onChange={(e) => setFlight(e.target.value)}
        className="mb-6 rounded-lg border border-[#DCD7C9] bg-white px-4 py-2 focus:outline-none focus:border-[#F2A93B] focus:ring-4 focus:ring-[#F2A93B]/25"
      >
        {flights.map((f) => (
          <option key={f.flightCode} value={f.flightCode}>
            {f.flightCode}
          </option>
        ))}
      </select>

      <h3 className="mb-3 text-xl font-semibold">
        {seatedCount} / {totalPassengers} Passengers Boarded
      </h3>

      <div className="mb-2 h-5 w-105 overflow-hidden rounded-full bg-[#E4E0D6]">
        <div
          className="h-full rounded-full bg-[#2FA867] transition-all duration-500"
          style={{ width: `${progress}%` }}
        />
      </div>

      <p className="mb-6 text-lg text-[#5B6472]">{progress}% Complete</p>

      {boardingComplete && (
        <h2 className="mb-6 text-2xl font-bold text-[#2FA867] font-['Space_Grotesk',sans-serif]">
          Boarding Complete ✅
        </h2>
      )}

      {/* Cockpit */}
      <div className="flex h-20 w-56 items-center justify-center rounded-t-[120px] border-4 border-b-0 border-[#0B1D3A] bg-[#0B1D3A] text-4xl text-[#F2A93B]">
        ✈
      </div>

      {/* Plane */}
      <div className="rounded-b-[90px] border-4 border-t-0 border-[#0B1D3A] bg-white p-8 shadow-xl">
        {/* Seat Labels */}
        <div
          className="mb-4 grid gap-2 text-center font-bold text-[#5B6472]"
          style={{
            gridTemplateColumns: "repeat(3,40px) 40px repeat(3,40px)",
          }}
        >
          <div>A</div>
          <div>B</div>
          <div>C</div>
          <div></div>
          <div>D</div>
          <div>E</div>
          <div>F</div>
        </div>

        {/* Seat Rows */}
        {boardedMatrix.map((row, rowIndex) => (
          <div
            key={`row-${rowIndex}`}
            className="mb-2 grid items-center gap-2"
            style={{
              gridTemplateColumns: "repeat(3,40px) 40px repeat(3,40px)",
            }}
          >
            {Array.isArray(row) &&
              row.map((seat, seatIndex) => (
                <Fragment key={`seat-${rowIndex}-${seatIndex}`}>
                  {seatIndex === 3 && (
                    <div className="flex justify-center text-[#7C8698]">│</div>
                  )}

                  <div
                    className={`flex h-10 w-10 items-center justify-center rounded-md border text-xs font-bold transition-colors duration-300 ${
                      seat
                        ? "border-[#218a54] bg-[#2FA867] text-white"
                        : "border-[#DCD7C9] bg-[#F5F3EE] text-[#0B1D3A]"
                    }`}
                  >
                    {rowIndex + 1}
                    {String.fromCharCode(65 + seatIndex)}
                  </div>
                </Fragment>
              ))}
          </div>
        ))}
      </div>

      {/* Legend */}
      <div className="mt-8 flex gap-8">
        <div className="flex items-center gap-2">
          <div className="h-5 w-5 rounded border border-[#0B1D3A] bg-[#2FA867]"></div>
          <span>Boarded</span>
        </div>

        <div className="flex items-center gap-2">
          <div className="h-5 w-5 rounded border border-[#0B1D3A] bg-[#F5F3EE]"></div>
          <span>Waiting</span>
        </div>
      </div>
    </div>
  );
}

export default OrderTable;
