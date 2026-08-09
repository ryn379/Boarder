import api from "../api/axios.js";

export default async function getSessions() {
  console.log("this is in handleSessions");
  try {
    const response = await api.get("./sessions/flights");
    const data = response.data;
    if (!data.success) {
      alert(data.message);
      return;
    }
    console.log(data);
    return data;
  } catch (err) {
    console.log(err);
    console.log(err.message);
  }
}
