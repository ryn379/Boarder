import api from "../api/axios.js";

export default async function markSeated(flightId) {
  try {
    const response = await api.post(`/boarding/${flightId}/seated`);
    const data = response.data;
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
