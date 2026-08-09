import api from "../api/axios.js";

export default async function loadAnalytics(flightId) {
  console.log("this is loadAnalytics.js");
  try {
    const response = await api.get(`/boarding/${flightId}/analytics`);
    const data = response.data;

    if (!data.success) {
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
