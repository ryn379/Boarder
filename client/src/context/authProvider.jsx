import { useState } from "react";
import AuthContext from "./authContext.js";
import { logout as logoutApi } from "../api/api.js";
import { clearAccessToken } from "../api/token.js";

export default function AuthProvider({ children }) {
  const [authUser, setAuthUser] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  async function logout() {
    try {
      await logoutApi();
    } catch (err) {
      console.log(err);
    } finally {
      clearAccessToken();
      setAuthUser(null);
      setIsLoggedIn(false);
    }
  }

  const value = {
    authUser,
    setAuthUser,
    isLoggedIn,
    setIsLoggedIn,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
