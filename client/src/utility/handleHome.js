import api from "../api/axios.js";

export default async function handleHome() {
  try {
    const response = await api.get(`/passenger/details`);

    const data = response.data;
    if (!data.success) {
      console.log("data not reached, this is in handleHome.js");
      console.log(data);
      return;
    }

    return data;
  } catch (err) {
    console.log(err);
    console.log(err.message);
  }
}
