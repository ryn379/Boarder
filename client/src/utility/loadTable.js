export default async function loadTable(flightId) {
  try {
    console.log(flightId);
    const response = await fetch(
      `http://localhost:8008/api/boarding/${flightId}/status`,
    );

    const data = await response.json();
    if (!data.success) {
      console.log(data.message);
      console.log("This is in loadTable.js");
      return null;
    }
    return data;
  } catch (err) {
    console.log(err.message);
  }
}

// data sent:
// success, passengers, seatedCount, totalPassengers,progress, boardedMatrix, boardingComplete
