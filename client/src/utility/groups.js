import api from "../api/axios.js";

export default async function getGroups(flightId) {
  console.log("This is in getGroups in groups.js in utility");

  try {
    const response = await api.get(`/boarding/${flightId}`);
    const data = response.data;

    if (!data.boarding) {
      console.log("Flight Not Boarding");
      return;
    }

    return data;
  } catch (err) {
    console.error(err);
    return null;
  }
}
