'use client'

import React, { useState, useEffect } from "react";
import { NavLink, useNavigate, useLocation } from "react-router-dom";
import { getCheckRegis } from "../../../service/apiMCU";
import Swal from "sweetalert2";
import { FileClock, Home, Stethoscope } from 'lucide-react';
import { CgProfile } from "react-icons/cg";

export default function NavMcu() {
  const navigate = useNavigate();
  const location = useLocation();
  const [role, setRole] = useState(null);
  const token = localStorage.getItem("token");

  useEffect(() => {
    const storedRole = localStorage.getItem("role");
    setRole(storedRole ? parseInt(storedRole) : null);
  }, []);

  const handleDaftarSekarang = async () => {
    try {
      if (!token) {
        Swal.fire({
          title: 'Belum Login',
          text: 'Silahkan login terlebih dahulu.',
          icon: 'warning',
          confirmButtonText: 'OK'
        });
        navigate('/login');
        return;
      }
      if (role == 99) {
        navigate('/mcu/registrasi-comp');
        return;
      }
      const response = await getCheckRegis();
      if (response.status === 222) {
        await Swal.fire({
          title: 'Informasi',
          text: 'Anda sudah mendaftar MCU!',
          icon: 'info',
          confirmButtonText: 'OK'
        });
        navigate('/mcu/history');
      } else if (response.status === 200) {
        navigate('/mcu/registrasi');
      } else {
        console.error('Unexpected status code:', response.status);
        Swal.fire({
          title: 'Error',
          text: 'Terjadi kesalahan. Silakan coba lagi nanti.',
          icon: 'error',
          confirmButtonText: 'OK'
        });
      }
    } catch (error) {
      console.error('Error checking registration:', error);
    }
  };

  return (
    < nav className="fixed z-10  bottom-4 left-1/2 transform -translate-x-1/2  w-full max-w-screen-sm px-3" >
      <div className="flex justify-around items-center px-5 py-2 rounded-full bg-softGreen/50">
        {/* Home */}
        <div className="flex flex-col justify-center items-center ">
          <NavLink
            to="/mcu/home-comp"
            className={({ isActive }) =>
              isActive ? "nav-link bg-secondary flex items-center justify-center rounded-full w-12 h-12"
                : "nav-link bg-[#B8E892]  flex items-center justify-center rounded-full w-12 h-12"
            }
          >
            {({ isActive }) => (
              <Home size={24} color={isActive ? "white" : "#6FA047"} />
            )}
          </NavLink>
          <div className="text-[11px] font-medium text-secondary">Home</div>
        </div>

        {/* Regist */}
        <div className="flex flex-col justify-center items-center ">
          <NavLink
            to="/mcu/registrasi"
            className={({ isActive }) =>
              (isActive || location.pathname === '/mcu/registrasi' || location.pathname === '/mcu/registrasi-comp')
                ? "nav-link bg-secondary flex items-center justify-center rounded-full w-12 h-12"
                : "nav-link bg-[#B8E892]  flex items-center justify-center rounded-full w-12 h-12"
            }
            onClick={(e) => {
              e.preventDefault();
              handleDaftarSekarang();
            }}
          >
            {({ isActive }) => (
              <svg width="24" height="24" viewBox="0 0 24 24" fill={isActive || location.pathname === ('/mcu/registrasi') || location.pathname === ('/mcu/registrasi-comp') ? "white" : "#6FA047"} xmlns="http://www.w3.org/2000/svg">
                <path d="M21 2H3C2.73478 2 2.48043 2.10536 2.29289 2.29289C2.10536 2.48043 2 2.73478 2 3V21C2 21.2652 2.10536 21.5196 2.29289 21.7071C2.48043 21.8946 2.73478 22 3 22H21C21.2652 22 21.5196 21.8946 21.7071 21.7071C21.8946 21.5196 22 21.2652 22 21V3C22 2.73478 21.8946 2.48043 21.7071 2.29289C21.5196 2.10536 21.2652 2 21 2ZM20 20H4V4H20V20ZM7 14.79H9V16.79C9 17.0552 9.10536 17.3096 9.29289 17.4971C9.48043 17.6846 9.73478 17.79 10 17.79H14C14.2652 17.79 14.5196 17.6846 14.7071 17.4971C14.8946 17.3096 15 17.0552 15 16.79V14.79H17C17.2652 14.79 17.5196 14.6846 17.7071 14.4971C17.8946 14.3096 18 14.0552 18 13.79V9.79C18 9.52478 17.8946 9.27043 17.7071 9.08289C17.5196 8.89536 17.2652 8.79 17 8.79H15V6.79C15 6.52478 14.8946 6.27043 14.7071 6.08289C14.5196 5.89536 14.2652 5.79 14 5.79H10C9.73478 5.79 9.48043 5.89536 9.29289 6.08289C9.10536 6.27043 9 6.52478 9 6.79V8.79H7C6.73478 8.79 6.48043 8.89536 6.29289 9.08289C6.10536 9.27043 6 9.52478 6 9.79V13.79C6 14.0552 6.10536 14.3096 6.29289 14.4971C6.48043 14.6846 6.73478 14.79 7 14.79ZM8 10.79H10C10.2652 10.79 10.5196 10.6846 10.7071 10.4971C10.8946 10.3096 11 10.0552 11 9.79V7.79H13V9.79C13 10.0552 13.1054 10.3096 13.2929 10.4971C13.4804 10.6846 13.7348 10.79 14 10.79H16V12.79H14C13.7348 12.79 13.4804 12.8954 13.2929 13.0829C13.1054 13.2704 13 13.5248 13 13.79V15.79H11V13.79C11 13.5248 10.8946 13.2704 10.7071 13.0829C10.5196 12.8954 10.2652 12.79 10 12.79H8V10.79Z" />
              </svg>
            )}
          </NavLink>
          <div className="text-[11px] font-medium text-secondary">Daftar</div>
        </div>

        {/* Riwayat */}
        <div className="flex flex-col justify-center items-center ">
          <NavLink
            to={role == 0 ? "/mcu/history" : "/mcu/history-comp"}
            className={({ isActive }) =>
              isActive ? "nav-link bg-secondary flex items-center justify-center rounded-full w-12 h-12"
                : "nav-link bg-[#B8E892]  flex items-center justify-center rounded-full w-12 h-12"
            }
          >
            {({ isActive }) => (
              <FileClock size={24} color={isActive ? "white" : "#6FA047"} />
            )}
          </NavLink>
          <div className="text-[11px] font-medium text-secondary">Riwayat</div>
        </div>

        {/* Profile */}
        {(role === 0 || !role) && (
          <div className="flex flex-col justify-center items-center ">
            <NavLink
              to="/profile"
              className={({ isActive }) =>
                isActive ? "nav-link bg-secondary flex items-center justify-center rounded-full w-12 h-12"
                  : "nav-link bg-[#B8E892]  flex items-center justify-center rounded-full w-12 h-12"
              }
            >
              {({ isActive }) => (
                <CgProfile size={24} color={isActive ? "white" : "#6FA047"} />
              )}
            </NavLink>
            <div className="text-[11px] font-medium text-secondary">Profile</div>
          </div>
        )}

        {(role === 99) && (
          <div className="flex flex-col justify-center items-center ">
            <NavLink
              to="/profile-comp"
              className={({ isActive }) =>
                isActive ? "nav-link bg-secondary flex items-center justify-center rounded-full w-12 h-12"
                  : "nav-link bg-[#B8E892]  flex items-center justify-center rounded-full w-12 h-12"
              }
            >
              {({ isActive }) => (
                <CgProfile size={24} color={isActive ? "white" : "#6FA047"} />
              )}
            </NavLink>
            <div className="text-[11px] font-medium text-secondary">Profile</div>
          </div>
        )}

      </div>
    </nav >
  )
}



