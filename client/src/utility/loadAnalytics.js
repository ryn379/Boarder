export default async function loadAnalytics(flightId) {
  console.log("this is loadAnalytics.js");
  try {
    const response = await fetch(
      `http://localhost:8008/api/boarding/${flightId}/analytics`,
    );
    const data = await response.json();

    if (!response.ok || !data.success) {
      return {
        success: false,
        analytics: null,
        message: data.message || "No analytics available for this flight yet.",
      };
    }

    return data;
  } catch (err) {
    console.error(err);
    return {
      success: false,
      analytics: null,
      message: "Unable to load analytics right now.",
    };
  }
}
