export default async function getSessions() {
  console.log("this is in handleSessions");
  try {
    const response = await fetch("http://localhost:8008/api/sessions/flights");
    const data = await response.json();
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
