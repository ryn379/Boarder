export default async function getGroups(flightId) {
  console.log("This is in getGroups in groups.js in utility");

  try {
    const response = await fetch(
      `http://localhost:8008/api/boarding/${flightId}`,
    );
    const data = await response.json();
    if (!response.ok) {
      console.log(response.status);
      console.log(data);
      throw new Error("Failed to fetch groups");
    }
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
