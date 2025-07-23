import { NavLink } from "react-router-dom";
import NavHome from "../NavHome";
import Schadule from "../Schadule";
import Article from "../Article";
import { User2 } from "lucide-react";


export default function Nav() {
  return (
    < nav className="fixed z-10  bottom-4 left-1/2 transform -translate-x-1/2  w-full max-w-screen-sm px-3" >
      <div className="flex justify-around items-center px-5 py-2 rounded-full bg-white shadow-md">
        {/* Home */}
        <div className="flex flex-col justify-center items-center ">
          <NavLink
            to="/"
            className={({ isActive }) =>
              isActive ? "nav-link bg-secondaryGreen fill-white flex items-center justify-center rounded-full w-11 h-11"
                : "nav-link bg-softGreen/50 fill-secondary flex items-center justify-center rounded-full w-11 h-11"
            }
          >
            <NavHome className="w-6" />
          </NavLink>
          <div className="text-[11px] font-medium text-secondaryGreen">Home</div>
        </div>

        {/* Medicine */}

        <div className="flex flex-col justify-center items-center">
          <NavLink
            to="/jadwal-dokter"
            className={({ isActive }) =>
              isActive ? "nav-link bg-secondaryGreen flex items-center justify-center stroke-white rounded-full w-11 h-11"
                : "nav-link bg-softGreen/50 flex items-center justify-center stroke-secondaryGreen rounded-full w-11 h-11"
            }
          >
            <Schadule />
          </NavLink>
          <div className="text-[11px] font-medium text-secondaryGreen">Jadwal Dokter</div>
        </div>


        {/* Mask */}
        <div className="flex flex-col justify-center items-center ">
          <NavLink
            to="/artikel"
            className={({ isActive }) =>
              isActive ? "nav-link bg-secondaryGreen flex items-center justify-center stroke-white rounded-full w-11 h-11"
                : "nav-link bg-softGreen/50 flex items-center justify-center stroke-secondaryGreen rounded-full w-11 h-11"
            }
          >
            <Article />
          </NavLink>
          <div className="text-[11px] font-medium text-secondaryGreen">Artikel</div>
        </div>

        {/* 6 */}
        <div className="flex flex-col justify-center items-center ">
          <NavLink
            to="/profile"
            className={({ isActive }) =>
              isActive ? "nav-link bg-secondary text-white flex items-center justify-center rounded-full w-11 h-11"
                : "nav-link bg-softGreen/50 text-secondaryGreen flex items-center justify-center rounded-full w-11 h-11"
            }
          >
            <User2 />
          </NavLink>
          <div className="text-[11px] font-medium text-secondaryGreen">Profil</div>
        </div>

      </div>
    </nav >
  )
}


