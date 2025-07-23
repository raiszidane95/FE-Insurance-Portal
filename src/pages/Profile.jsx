
import { Edit2, Phone, UserRound, Info, ChevronRight } from 'lucide-react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import useFetchData from '../Util/useFetch';
import Skeleton from 'react-loading-skeleton';
import { changePassword, getProfile } from '../service/api';
import { handleLogout } from '../Util/handleLogout';
import { useEffect, useState } from 'react';
import { Accordion, AccordionBody, AccordionHeader, Button, Dialog, DialogBody, DialogFooter, DialogHeader, Input, Typography } from '@material-tailwind/react';
import Swal from 'sweetalert2';
import MedicalPlus from '../components/icons/MedicalPlus';
import HomeIcon from '../components/icons/Home';
import Bill from '../components/icons/Bill';
import Alergy from '../components/icons/Alergy';
import LockGuard from '../components/icons/LockGuard';
import OpenDoor from '../components/icons/OpenDoor';
import ServerError from '../components/error/ServerError';

const UserProfile = () => {
  const [open, setOpen] = useState(1);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [openInfo, setOpenInfo] = useState(false);
  const [password, setPassword] = useState({
    oldPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [errorMessage, setErrorMessage] = useState('');
  const [saving, setSaving] = useState(false);
  const location = useLocation();
  const { message, code } = location.state || {};
  const { data: data, loading, error } = useFetchData(getProfile);
  const handleOpen = (value) => setOpen(open === value ? 0 : value);
  useEffect(() => {
    if (code === 403) {
      setOpenInfo(true);
    }
  }, [code]);
  const navigate = useNavigate();

  if (loading) return (
    <div className="p-8">
      <Skeleton className="h-[158px] w-full rounded-xl" />
      <Skeleton count={3} className="h-10 w-full rounded-xl" />
    </div>
  );

  if (error)
    return (
      <div className="pt-36">
        <ServerError />
      </div>
    );

  const showError = (message) => {
    setErrorMessage(message);

    setTimeout(() => {
      setErrorMessage("");
    }, 3000);
  };

  const handleSavePassword = async () => {

    if (!password?.oldPassword || !password?.newPassword || !password?.confirmPassword) {
      showError('Semua field harus diisi.');
      return;
    } else if (password?.newPassword.length < 6 || password?.confirmPassword.length < 6 || password?.oldPassword.length < 6) {
      showError('Password harus memiliki minimal 6 karakter.');
      return;
    } else if (password?.newPassword !== password?.confirmPassword) {
      showError('Password baru dan konfirmasi password tidak cocok.');
      return;
    }
    setSaving(true);

    try {
      const response = await changePassword(password);
      if (response?.status == 200) {
        Swal.fire('Success', 'Berhasil mengganti password!', 'success');
        setDialogOpen(false);
        setPassword(null);
      } else {
        Swal.fire('Error', `Gagal Mengganti Password. ${response?.data ? response?.data[0] : response?.message}`, 'error');
      }
    } catch (error) {
      console.error('Error:', error);
      Swal.fire('Error', 'Gagal Mengganti Password', 'error');
      setDialogOpen(false);
    } finally {
      setDialogOpen(false);
      setSaving(false);
    }
  }

  return (
    <div className="text-charcoal bg-white">
      <div className="p-6 flex flex-col gap-3">
        <div className="flex flex-col items-center mb-2">
          <div className="relative mb-4">
            <div className="w-32 h-32 flex justify-center items-center bg-softGreen/50 rounded-full p-2">
              <UserRound width={128} height={128} className="text-secondaryGreen " />
            </div>
            <button className="absolute bottom-0 right-0 bg-secondary text-white p-2 rounded-full shadow-md">
              <Edit2 size={16} />
            </button>
          </div>
          <h2 className="text-xl font-semibold text-center px-4">{data.data.Nama_Pasien}</h2>
        </div>

        <div className="flex flex-col items-start p-3 gap-4 bg-white shadow-[0_0_4px_0_rgba(0,0,0,0.2)] rounded-2xl">
          <div className="font-semibold text-sm">Profil Pasien</div>
          <div className="flex flex-col gap-2">
            <div className="flex gap-4 items-center">
              <MedicalPlus className="text-primaryGreen w-6 h-6" />
              <div className="flex flex-col itemxcenter">
                <div className="font-light text-xs">No Rekam Medis</div>
                <div className="font-semibold text-sm">{data?.data?.No_MR}</div>
              </div>
            </div>
            <div className="flex gap-4 items-center">
              <Phone className="text-primaryGreen w-6 h-6" />
              <div className="flex flex-col itemxcenter">
                <div className="font-light text-xs">No Telepon</div>
                <div className="font-semibold text-sm">{data?.data?.HP1}</div>
              </div>
            </div>
            <div className="flex gap-4 items-center">
              <HomeIcon className="text-primaryGreen w-6 h-6" />
              <div className="flex flex-col itemxcenter">
                <div className="font-light text-xs">Alamat</div>
                <div className="font-semibold text-sm">{data?.data?.Alamat}</div>
              </div>
            </div>
          </div>
          <div className="flex items-center justify-center w-full">
            <div onClick={() => setDialogOpen(true)} className="rounded-xl p-2 w-full bg-secondary text-white font-medium text-center mb-2">
              Ubah Password
            </div>
          </div>
        </div>
        <Accordion open={open === 1}>
          <div className="flex flex-col px-4 py-1  bg-white shadow-[0_0_4px_0_rgba(0,0,0,0.2)] rounded-2xl">
            {/* Header Accordion */}
            <AccordionHeader className="w-full border-none" onClick={() => handleOpen(1)} >
              <div className="flex gap-3 items-center justify-between w-full">
                <div className="flex gap-3 items-center">
                  <Alergy className="text-primaryGreen w-6 h-6" />
                  <div className="text-sm">Informasi Alergi</div>
                </div>
                <ChevronRight className={`w-6 h-6 transition-transform duration-300 ${open === 1 ? 'rotate-90' : ''}`} />
              </div>
            </AccordionHeader>
            <AccordionBody>
              <div className="flex text-secondaryCyan text-sm">
                <p className=' bg-softCyan rounded-2xl p-2 font-semibold'>{data?.data?.ALERGI?.Alergi === '-' || data?.data?.ALERGI?.Alergi === null ? data?.data?.ALERGI?.Alergi : 'Tidak ada Riwayat Alergi'}</p>
              </div>
            </AccordionBody>
          </div>
        </Accordion>
        <div className="flex px-4 py-5 gap-3 items-center bg-white shadow-[0_0_4px_0_rgba(0,0,0,0.2)] rounded-2xl">
          <Info className="text-primaryGreen w-6 h-6" />
          <div className="text-sm">Tentang UHC</div>
        </div>
        <div className="flex px-4 py-5 gap-3 items-center bg-white shadow-[0_0_4px_0_rgba(0,0,0,0.2)] rounded-2xl">
          <Bill className="fill-primaryGreen w-6 h-6" />
          <div className="text-sm">Syarat dan Ketentuan</div>
        </div>
        <div className="flex px-4 py-5 gap-3 items-center bg-white shadow-[0_0_4px_0_rgba(0,0,0,0.2)] rounded-2xl">
          <LockGuard className="text-primaryGreen w-6 h-6" />
          <div className="text-sm">Kebijakan Privasi</div>
        </div>
        <div
          onClick={() => handleLogout(navigate, "0")}
          className="flex px-4 py-5 gap-3 items-center bg-white shadow-[0_0_4px_0_rgba(0,0,0,0.2)] rounded-2xl">
          <OpenDoor className="text-danger w-6 h-6" />
          <div className="text-sm text-danger">Keluar</div>
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

      {/* Dialog Change Password */}
      <Dialog
        open={dialogOpen}
        handler={() => setDialogOpen(false)}
        size="sm"
      >
        <DialogHeader>
          Ubah Password
        </DialogHeader>
        <DialogBody>
          <div className="space-y-4">
            <Input
              label="Password"
              type="password"
              onChange={(e) =>
                setPassword({ ...password, oldPassword: e.target.value })
              }
            />
            <Input
              label="Password Baru"
              type="password"
              onChange={(e) => {
                setPassword({ ...password, newPassword: e.target.value })
              }
              }
            />
            <Input
              label="Konfirmasi Password Baru"
              type="Password"
              onChange={(e) => {
                setPassword({ ...password, confirmPassword: e.target.value })
              }}
            />
            {errorMessage && (
              <Typography color="red" className="mt-2 text-xs">
                {errorMessage}
              </Typography>
            )}
          </div>
        </DialogBody>
        <DialogFooter className="flex gap-2">
          <Button
            variant="text"
            className="text-danger hover:bg-red-100"
            onClick={() => setDialogOpen(false)}
          >
            Batal
          </Button>
          <Button
            onClick={handleSavePassword}
            className="text-white bg-secondaryGreen"
            disabled={saving}
          >
            {saving ? "Menyimpan..." : "Simpan"}
          </Button>
        </DialogFooter>
      </Dialog>

      <Dialog
        open={openInfo}
        handler={() => setOpenInfo(false)}
        size="sm"
      >
        <DialogHeader>
          <div className="flex justify-between w-full">
            <p className='font-semibold'>Informasi</p>
            <Info className='w-10 h-10 text-blueAccentSecondary' />
          </div>
        </DialogHeader>
        <DialogBody className='space-y-4'>
          <p className='text-center'>{message}</p>
          <div className="p-2 bg-secondaryGreen text-white font-medium text-center rounded-full" onClick={() => {
            setOpenInfo(false)
            setDialogOpen(true)
          }}>Ubah Password</div>
        </DialogBody>
      </Dialog>


    </div>
  );
};

export default UserProfile;