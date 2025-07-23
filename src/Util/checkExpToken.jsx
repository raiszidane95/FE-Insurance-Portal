import { jwtDecode } from 'jwt-decode';
import { redirect } from "react-router-dom";

export const checkExpToken = () => {
  const token = localStorage.getItem("token");
  if (token) {
    try {
      const decodedToken = jwtDecode(token);
      const currentTime = Date.now() / 1000;
      if (decodedToken.exp && decodedToken.exp > currentTime) {
        return redirect("/");
      }
    } catch (error) {
      console.error("Error decoding token:", error);
    }
  }
  return null;
};