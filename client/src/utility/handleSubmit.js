import api from "../api/axios.js";

export default async function handleLookUpSubmit({ flight, search }) {
  console.log(flight);
  console.log(search);
  if (!flight) {
    alert("No Current Flight Boarding");
    return;
  }
  if (search.trim() === "") {
    alert("Please enter a passenger name, seat number, or queue number.");
    return;
  }
  try {
    const response = await api.get(`/passenger/${flight}/search`, {
      params: {
        input: search.trim(),
      },
    });

    const data = response.data;
    if (!data.success) {
      console.log("this is in handleSubmit.js");
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
