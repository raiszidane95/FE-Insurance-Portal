import { useState } from "react";
import { FaUserDoctor } from "react-icons/fa6";

const DoctorPhoto = ({ doctorCode, className = "w-16 h-16" }) => {
  const [imageError, setImageError] = useState(false);
  const apiUrl = import.meta.env.VITE_URL;
  return (
    <>
      {!imageError ? (
        <img
          loading="lazy"
          src={`${apiUrl}/doctorImage/${doctorCode}`}
          alt="Doctor"
          className={`${className} object-contain object-top shadow-[0_0_2px_0_rgba(0,0,0,0.2)]`}
          onError={() => setImageError(true)} // Jika gagal, set error
        />
      ) : (
        <FaUserDoctor
          className={`${className} bg-gray-300 fill-white p-2`}
        />
      )}
    </>
  );
};

export default DoctorPhoto;
