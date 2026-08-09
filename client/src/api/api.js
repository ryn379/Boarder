import api from "./axios.js";

export async function register(username, email, password, bookingRef) {
  try {
    const response = await api.post("/auth/register", {
      username,
      email,
      password,
      bookingRef,
    });

    return response.data;
  } catch (err) {
    console.log(err.message);
    return err.response?.data;
  }
}

export async function login(email, password) {
  try {
    const response = await api.post("/auth/login", {
      email,
      password,
    });

    return response.data;
  } catch (err) {
    console.log(err.message);
    return err.response?.data;
  }
}

export async function logout() {
  try {
    const response = await api.post("/auth/logout");

    return response.data;
  } catch (err) {
    console.log(err.message);
    return;
  }
}

export async function refreshAccessToken() {
  try {
    const response = await api.get("/auth/refresh");

    return response.data;
  } catch (err) {
    console.log(err.message);
    return;
  }
}
