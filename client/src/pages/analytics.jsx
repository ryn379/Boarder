import { useEffect, useState } from "react";
import loadFlights from "../utility/loadFlight.js";
import loadAnalytics from "../utility/loadAnalytics.js";

function Analytics() {
  const [flight, setFlight] = useState("");
  const [flights, setFlights] = useState([]);
  const [analytics, setAnalytics] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    loadFlights({ flight, setFlight, setFlights });
  }, [flight]);

  useEffect(() => {
    if (!flight) return;

    const load = async () => {
      const data = await loadAnalytics(flight);
      console.log(data);

      if (data.success) {
        setAnalytics(data.analytics);
        setError("");
      } else {
        setAnalytics(null);
        setError(data.message || "No analytics available for this flight yet.");
      }
    };

    load();

    const id = setInterval(load, 2000);

    return () => clearInterval(id);
  }, [flight]);

  const fontImport = (
    <style>{`
      @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@500;600;700&family=Inter:wght@400;500;600&family=IBM+Plex+Mono:wght@500;600&display=swap');
    `}</style>
  );

  if (!analytics) {
    if (error) {
      return (
        <div className="min-h-screen bg-[#F5F3EE] font-sans text-[#0B1D3A] p-8">
          {fontImport}
          <div className="mx-auto max-w-7xl rounded-xl bg-white p-8 border border-[#E4E0D6] shadow-sm">
            <h1 className="text-2xl font-semibold font-['Space_Grotesk',sans-serif]">
              📊 Boarding Analytics
            </h1>
            <p className="mt-3 text-[#7C8698]">{error}</p>
          </div>
        </div>
      );
    }

    if (flights.length === 0) {
      return (
        <div className="min-h-screen bg-[#F5F3EE] font-sans text-[#0B1D3A] p-8">
          {fontImport}
          <div className="mx-auto max-w-7xl rounded-xl bg-white p-8 border border-[#E4E0D6] shadow-sm">
            <h1 className="text-2xl font-semibold font-['Space_Grotesk',sans-serif]">
              📊 Boarding Analytics
            </h1>
            <p className="mt-3 text-[#7C8698]">
              No active boarding session is available yet.
            </p>
          </div>
        </div>
      );
    }

    return (
      <div className="min-h-screen bg-[#0B1D3A] flex items-center justify-center">
        {fontImport}
        <h1 className="font-mono text-[#F2A93B] text-xl tracking-[0.15em]">
          LOADING ANALYTICS...
        </h1>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F5F3EE] font-sans text-[#0B1D3A] p-8">
      {fontImport}
      <div className="mx-auto max-w-7xl">
        <div className="mb-8 flex items-center justify-between">
          <h1 className="text-4xl font-bold font-['Space_Grotesk',sans-serif]">
            📊 Boarding Analytics
          </h1>

          <select
            value={flight}
            onChange={(e) => setFlight(e.target.value)}
            className="rounded-lg border border-[#DCD7C9] bg-white px-4 py-2 font-mono focus:outline-none focus:border-[#F2A93B] focus:ring-4 focus:ring-[#F2A93B]/25"
          >
            {flights.map((f) => (
              <option key={f.flightCode} value={f.flightCode}>
                {f.flightCode}
              </option>
            ))}
          </select>
        </div>

        {/* KPI Cards */}

        <div className="grid gap-6 md:grid-cols-3 xl:grid-cols-6">
          <Card
            title="Passengers"
            value={`${analytics.boardedPassengers}/${analytics.totalPassengers}`}
          />

          <Card title="Progress" value={`${analytics.progress}%`} />

          <Card title="Avg Time" value={`${analytics.averageBoardingTime}s`} />

          <Card title="Rate" value={`${analytics.boardingRate}/sec`} />

          <Card title="ETA" value={analytics.estimatedCompletion} />

          <Card title="No Shows" value={analytics.noShows} />
        </div>

        {/* Charts */}

        <div className="mt-8 grid gap-6 lg:grid-cols-2">
          <div className="rounded-xl bg-white p-6 border border-[#E4E0D6] shadow-sm">
            <h2 className="mb-4 text-xl font-semibold font-['Space_Grotesk',sans-serif]">
              Boarding Progress
            </h2>

            {/* Recharts LineChart */}
          </div>

          <div className="rounded-xl bg-white p-6 border border-[#E4E0D6] shadow-sm">
            <h2 className="mb-4 text-xl font-semibold font-['Space_Grotesk',sans-serif]">
              Boarding Groups
            </h2>

            {/* PieChart */}
          </div>
        </div>

        {/* Timeline */}

        <div className="mt-8 rounded-xl bg-white p-6 border border-[#E4E0D6] shadow-sm">
          <h2 className="mb-4 text-xl font-semibold font-['Space_Grotesk',sans-serif]">
            Boarding Timeline
          </h2>

          <table className="w-full font-mono text-sm">
            <thead>
              <tr className="border-b border-[#E4E0D6]">
                <th className="py-2 text-left text-[#7C8698] font-semibold">
                  Queue
                </th>
                <th className="text-left text-[#7C8698] font-semibold">
                  Passenger
                </th>
                <th className="text-left text-[#7C8698] font-semibold">
                  Group
                </th>
                <th className="text-left text-[#7C8698] font-semibold">
                  Boarded At
                </th>
              </tr>
            </thead>

            <tbody>
              {analytics.boardingEvents.map((event) => (
                <tr key={event.id} className="border-b border-[#EFEBE0]">
                  <td className="py-2">{event.queueNumber}</td>

                  <td>{event.name}</td>

                  <td>{event.group}</td>

                  <td>{event.elapsed}s</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function Card({ title, value }) {
  return (
    <div className="rounded-xl bg-white p-5 border border-[#E4E0D6] shadow-sm">
      <p className="text-sm text-[#7C8698]">{title}</p>

      <h2 className="mt-2 text-3xl font-bold font-['Space_Grotesk',sans-serif]">
        {value}
      </h2>
    </div>
  );
}

export default Analytics;

// boarding progress
// average boarding time
// Estimated completion time
// Queue congestion
// No-shows
// Efficiency
// Boarding over time graph
// Boarding group distribution
// Boarding timeline
