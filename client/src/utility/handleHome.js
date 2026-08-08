export default async function handleHome() {
  try {
    const id = "cmsg0lc5n000qw6gpl5tuelyk";
    const response = await fetch(
      `http://localhost:8008/api/passenger/${id}/details`,
    );

    const data = await response.json();
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
