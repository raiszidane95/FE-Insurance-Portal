import { jwtDecode } from 'jwt-decode';
import { createBrowserRouter, redirect } from "react-router-dom";
import NotFound from '../components/NotFound';
import DefaultLayout from "@/pages/Layout/DefaultLayout";
import LoginPage from '@/pages/Login';
import CekEligibilitasPage from '@/pages/CekEligibilitas';
import DashboardPage from '@/pages/Dashboard';
import SimpanSJPPage from '@/pages/SimpanSJP';
import LogsPage from '@/pages/Logs';

// Auth loader
const authLoader = (requiredRoles = null) => () => {
  const token = localStorage.getItem("token");
  if (!token) return redirect("/login");

  try {
    const decodedToken = jwtDecode(token);
    const currentTime = Date.now() / 1000; // Convert to seconds

    // Check if token is expired
    if (decodedToken.exp && decodedToken.exp < currentTime) {
      // Token is expired, remove it and redirect to login
      localStorage.removeItem("token");
      localStorage.removeItem("role");
      return redirect("/login");
    }

    if (requiredRoles != null) {
      const userRole = decodedToken?.Role;

      // Periksa apakah userRole cocok dengan salah satu role yang diizinkan
      if (!requiredRoles.some(role => String(role) == String(userRole))) {
        if (userRole == "0") {
          return redirect("/d");
        } else if (userRole == "99") {
          return redirect("/mcu/home-comp");
        } else {
          return redirect("/");
        }
      }
    }

  } catch (error) {
    console.error("Error decoding token:", error);
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    return redirect("/login");
  }

  return null;
};

// Route configurations

const routes =
  [
    {
      element: <DefaultLayout />,
      loader: authLoader([1, 2, 3, 4, 5]),
      children: [
        { path: "/", element: <DashboardPage /> },
        { path: "pendaftaran", element: <CekEligibilitasPage /> },
        { path: "simpan-sjp", element: <SimpanSJPPage /> },
        { path: "/logs", element: <LogsPage /> },
      ]
    },
    {
      path: "/login",
      element: <LoginPage />,
    },
    {
      path: "*",
      element: <NotFound />,
    },
  ];

const router = createBrowserRouter(routes);

export default router;

