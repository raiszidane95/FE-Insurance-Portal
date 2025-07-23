
import { ArrowLeft, Edit2, Phone, MapPin, Cake, User, UserRound, LogOut } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import useFetchData from '../Util/useFetch';
import Skeleton from 'react-loading-skeleton';
import { getCompanyProfile } from '../service/api';
import { formatedDate } from '../Util/date';
import { handleLogout } from '../Util/handleLogout';

const ProfileComp = () => {
  const { data: data, loading, error } = useFetchData(getCompanyProfile);

  const navigate = useNavigate();

  if (loading) return (
    <div className="p-8">
      <Skeleton className="h-[158px] w-full rounded-xl" />
      <Skeleton count={3} className="h-10 w-full rounded-xl" />
    </div>
  );
  if (error) return <p className='text-red-500 items-center text-center h-full'>Error fetching data</p>;

  return (
    <div className="flex flex-col gap-4 bg-gradient-to-b from-primary to-white min-h-screen p-4">
      <header className="flex items-center justify-between">
        <div className="flex">
          <button onClick={() => navigate(-1)} className="mr-4 p-2 bg-white rounded-full shadow-md">
            <ArrowLeft size={24} className="text-gray-600" />
          </button>
          <h1 className="text-2xl font-bold text-secondary">Profil</h1>
        </div>
        <div className="flex gap-2 cursor-pointer" onClick={() => handleLogout(navigate, "pasien")}>
          <LogOut className='text-gray-700' />
          <div className="">Logout</div>
        </div>
      </header>

      <div className="bg-white rounded-2xl shadow-lg p-6">
        <div className="flex flex-col items-center mb-6">
          <div className="relative mb-4">
            <div className="w-32 h-32 flex justify-center items-center bg-softGreen/50 rounded-full p-2">
              <UserRound width={128} height={128} color="#6FA047" />
            </div>
            <button className="absolute bottom-0 right-0 bg-secondary text-white p-2 rounded-full shadow-md">
              <Edit2 size={16} />
            </button>
          </div>
          <h2 className="text-xl font-semibold text-center px-4 text-gray-800">{data?.data?.Nama_Comp}</h2>
        </div>

        <div className="space-y-4">
          <div className="flex gap-1 items-center">
            <User className="text-light-green-800 w-5 h-5 mr-3" size={28} />
            <div className="flex flex-col">
              <span className="text-gray-500">Nama User</span>
              <p>{data?.data?.Nama_User}</p>
            </div>
          </div>

          <div className="flex gap-1 items-center">
            <User className="text-light-green-800 w-5 h-5 mr-3" size={28} />
            <div className="flex flex-col">
              <span className="text-gray-500">Username</span>
              <p>{data?.data?.Username}</p>
            </div>
          </div>

          <div className="flex gap-1 items-center">
            <Phone className="text-light-green-800 w-5 h-5 mr-3" />
            <div className="flex flex-col">
              <span className="text-gray-500">No. Telepon</span>
              <p>{data?.data?.Telp}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-1 bg-softGreen/50 rounded-2xl shadow-lg p-6">
        <h2 className="text-xl font-semibold text-secondary">Saran dan Masukan</h2>
        <div className="flex flex-wrap text-sm text-secondary ">
          Bantu kami menjadi lebih baik! Isi formulir ini untuk menyampaikan keluhan, saran, atau masukan Anda.
        </div>
        <div className="flex justify-center">
          <Link
            className="bg-secondary text-sm text-white text-center  font-medium rounded-2xl mt-3 p-1 w-[75%]"
            target="_blank" rel="noopener noreferrer"
            to={`https://docs.google.com/forms/d/e/1FAIpQLSf7i_dGynNZG1PNlrv5U60OhZvHg__6z4hqzU_Vqc2dIXE-xg/viewform`} >
            Isi Form Saran & Masukan
          </Link>
        </div>
      </div>

    </div>
  );
};

export default ProfileComp;