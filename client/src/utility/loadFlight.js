export default async function loadFlights({ flight, setFlight, setFlights }) {
  try {
    const response = await fetch("http://localhost:8008/api/sessions");
    const data = await response.json();
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
