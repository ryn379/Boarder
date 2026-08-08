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
    const response = await fetch(
      `http://localhost:8008/api/passenger/${flight}/${search}/search`,
    );
    const data = await response.json();
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
