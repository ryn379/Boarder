import api from "../api/axios.js";

export default async function loadFlights({ flight, setFlight, setFlights }) {
  try {
    const response = await api.get("/sessions");
    const data = response.data;
    setFlights(data.flightNames);

    const hasCurrentFlight = typeof flight === "string" && flight.length > 0;
    if (data.flightNames.length > 0 && !hasCurrentFlight) {
      setFlight(data.flightNames[0].flightCode);
    }

    console.log(data);
  } catch (err) {
    console.log(err);
  }
}
