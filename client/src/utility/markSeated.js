export default async function markSeated(flightId, queueNumber) {
  try {
    const response = await fetch(
      `http://localhost:8008/api/boarding/${flightId}/seated`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          queueNumber,
        }),
      },
    );
    const data = await response.json();
    if (!data.success) {
      console.log("Data not found in markSeated.js");
      console.log(data.message);
      return;
    }
    console.log(data);
    console.log(data.seatedPassenger);
    return data;
  } catch (err) {
    console.log(err);
    console.log(err.message);
  }
}
