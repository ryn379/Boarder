import api from "../api/axios.js";

export default async function loadTable(flightId) {
  try {
    console.log(flightId);
    const response = await api.get(`/boarding/${flightId}/status`);

    const data = response.data;
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
