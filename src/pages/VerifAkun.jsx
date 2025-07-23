import { useEffect, useState } from "react";
import Swal from "sweetalert2";
import { getVerificationCode, verifyOtp } from "../service/api";
import { Dialog, DialogBody, DialogFooter, DialogHeader } from "@material-tailwind/react";
import { Info } from "lucide-react";

const VerifAkun = () => {
  const [otp, setOtp] = useState("");
  const [error, setError] = useState("");
  const [showDialog, setShowDialog] = useState(true);
  const [loading, setLoading] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const [cooldown, setCooldown] = useState(() => {
    const savedCooldown = sessionStorage.getItem('otpCooldown');
    return savedCooldown ? parseInt(savedCooldown, 10) : 0;
  });


  const handleGetOtp = async () => {
    try {
      setLoading(true);
      const response = await getVerificationCode();
      if (response.status === 200) {
        Swal.fire('Success', 'Kode OTP telah dikirim ke WhatsApp Anda', 'success');
        setOtpSent(true);
        setCooldown(60);
      } else {
        Swal.fire('Error', 'Gagal mengirimkan kode OTP', 'error');
      }
    } catch (error) {
      Swal.fire('Error', 'An error occurred', 'error');
    } finally {
      setLoading(false);
    }
  };
  const showError = (message) => {
    setError(message);
    setTimeout(() => setError(''), 3000); // Hapus pesan error setelah 3 detik
  };
  const handleVerifyOtp = async () => {
    if (!otp) {
      showError('Kode OTP harus diisi.');
      return;
    } else if (otp.length !== 6) {
      showError('Kode OTP harus terdiri dari 6 angka.');
      return;
    }
    try {
      setLoading(true);
      const response = await verifyOtp({ otp: otp });
      if (response.status !== 200) {
        Swal.fire('Error', `Gagal verifikasi OTP. ${response.message}`, 'error');
        return;
      }
      Swal.fire('Success', 'Kode OTP berhasil diverifikasi.', 'success').then(() => {
        // localStorage.setItem("token", response.token);
        localStorage.removeItem("agreement");
        window.location.href = '/';
      });
    } catch (error) {
      showError('Terjadi kesalahan saat verifikasi OTP.');
    } finally {
      setCooldown(0);
      setLoading(false);
    }
  };


  useEffect(() => {
    const storedCooldown = parseInt(sessionStorage.getItem('otpCooldown')) || 0;
    const otpSent = sessionStorage.getItem('otpSent') === 'true';
  
    if (storedCooldown === 0 && !otpSent) {
      handleGetOtp(); // Hanya dijalankan saat pertama kali load dan belum cooldown
    }
  }, []);
  
  useEffect(() => {
    // Simpan nilai cooldown ke sessionStorage setiap kali berubah
    sessionStorage.setItem('otpCooldown', cooldown.toString());
    sessionStorage.setItem('otpSent', otpSent.toString());
  
    let timer;
    if (cooldown > 0) {
      timer = setInterval(() => {
        setCooldown((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [cooldown, otpSent]);
  

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-100 px-4">
      <div className="fixed top-10 right-5 text-blue-700 text-medium cursor-pointer"
        onClick={() => {
          localStorage.removeItem("token");
          localStorage.removeItem("role");
          window.location.href = "/";
        }}
      >Kembali ke Login</div>
      <div className="bg-white shadow-md rounded-lg p-6 max-w-sm w-full">
        <h1 className="text-xl font-semibold text-gray-800 mb-4">Verifikasi Akun</h1>
        <div className="mb-4">
          <div className="mb-2">
            <label htmlFor="otp" className="block text-sm font-medium text-gray-700 py-2">
              Masukkan Kode OTP
            </label>
            <input
              type="number"
              id="otp"
              value={otp}
              maxLength={6}
              onChange={(e) => setOtp(e.target.value)}
              placeholder="******"
              className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-secindary focus:border-secindary sm:text-sm"
            />
            {error && (
              <p className="text-red-500 text-xs mt-1">{error}</p>
            )}
            <div className="flex items-center justify-end">
              <button
                onClick={handleGetOtp}
                disabled={cooldown > 0}
                className={`p-2 text-sm  ${cooldown > 0 ? 'text-gray-400' : 'text-blue-500 cursor-pointer'
                  }`}
              >
                {cooldown > 0 ? `Tunggu ${cooldown} detik` : 'Minta kode OTP'}
              </button>
            </div>
          </div>
          <button
            onClick={handleVerifyOtp}
            disabled={loading}
            className={`w-full bg-secondary text-white font-medium py-2 px-4 rounded-md focus:outline-none`} >
            Verifikasi Kode OTP
          </button>
          <p className="text-xs text-gray-500 mt-4">
            Pastikan nomor HP Anda valid dan dapat menerima pesan melalui WhatsApp.
          </p>
        </div>
      </div>
      <Dialog
        open={showDialog && localStorage.getItem("agreement") === null}
        className="h-[500px]"
        size="sm"
      >
        <DialogHeader>
          <div className="flex justify-between items-center w-full">
            <p className='font-semibold'>Kebijakan Privasi</p>
            <Info className='w-10 h-10 text-secondary' />
          </div>
        </DialogHeader>
        <DialogBody className=' max-h-[80vh] h-[400px] overflow-y-auto'>
          <div className="text-left text-gray-600 overflow-auto flex flex-col gap-3">
            <div className="">
              <h2 className="text-md font-bold text-gray-800">Kebijakan Privasi Urip Health Care</h2>
              <p className="text-sm px-3 text-justify">
                Urip Health Care sangat menghargai privasi Anda. Kebijakan Privasi ini menjelaskan bagaimana kami mengumpulkan,
                menggunakan, dan melindungi informasi pribadi Anda saat Anda menggunakan layanan kami.
              </p>
            </div>

            <div className="flex flex-col">
              <h3 className="text-md font-semibold text-gray-800">Informasi yang Kami Kumpulkan</h3>
              <div className="flex flex-col gap-2">
                <div className="">
                  <p className="font-medium text-sm">Informasi Pribadi</p>
                  <ul className="list-disc pl-5 space-y-1 text-sm mx-3 text-justify">
                    <li>Nama lengkap</li>
                    <li>Nomor Rekam Medis (No MR)</li>
                    <li>Alamat email</li>
                    <li>Nomor telepon</li>
                    <li>Informasi kesehatan (seperti riwayat konsultasi dan rekam medis)</li>
                  </ul>
                </div>

                <div className="">
                  <p className="font-medium text-sm">Informasi Teknis</p>
                  <ul className="list-disc pl-5 space-y-1 text-sm mx-3 text-justify">
                    <li>Cookies dan Teknologi Pelacakan</li>
                  </ul>
                  <p className="text-sm mx-3 text-justify">
                    Kami menggunakan cookies untuk meningkatkan pengalaman Anda, seperti menyimpan preferensi Anda
                    atau memahami bagaimana Anda menggunakan layanan kami.
                  </p>
                </div>
              </div>
            </div>

            <div className="">
              <h2 className="text-md font-bold text-gray-800">Penggunaan Informasi</h2>
              <p className="text-sm">Kami menggunakan informasi yang dikumpulkan untuk:</p>
              <ul className="list-disc pl-5 space-y-1 text-sm">
                <li>Memproses pendaftaran dan pengelolaan akun Anda.</li>
                <li>Memberikan layanan kesehatan seperti konsultasi online, janji temu, dan pengingat kesehatan.</li>
                <li>Meningkatkan kualitas layanan dan pengalaman pengguna.</li>
                <li>Mengirimkan informasi terkait layanan kami, termasuk pembaruan dan promosi.</li>
              </ul>
            </div>

            <div className="">
              <h2 className="text-md font-bold text-gray-800">Perlindungan Informasi</h2>
              <p className="text-sm">Kami berkomitmen untuk melindungi informasi pribadi Anda dengan:</p>
              <ul className="list-disc pl-5 space-y-1 text-sm">
                <li>Menggunakan enkripsi untuk data sensitif.</li>
                <li>Membatasi akses ke informasi hanya pada staf yang berwenang.</li>
                <li>Mematuhi peraturan privasi yang berlaku, seperti GDPR atau UU ITE di Indonesia.</li>
              </ul>
            </div>

            <div className="">
              <h2 className="text-md font-bold text-gray-800">Berbagi Informasi</h2>
              <p className="text-sm">Kami tidak menjual atau menyewakan informasi pribadi Anda kepada pihak ketiga. Namun, kami dapat
                membagikan data Anda kepada:</p>
              <ul className="list-disc pl-5 space-y-1 text-sm">
                <li>
                  Penyedia layanan pihak ketiga yang membantu operasional kami, dengan kewajiban melindungi data Anda.
                </li>
                <li>Otoritas hukum jika diwajibkan oleh undang-undang.</li>
              </ul>
            </div>

            <div className="">
              <h2 className="text-md font-bold text-gray-800">Hak Pengguna</h2>
              <p className="text-sm">Pengguna memiliki hak untuk:</p>
              <ul className="list-disc pl-5 space-y-1 text-sm">
                <li>Meminta salinan data pribadi Anda.</li>
                <li>Memperbaiki informasi yang tidak akurat.</li>
                <li>Menghapus data pribadi Anda, kecuali data tersebut diperlukan untuk kepatuhan hukum.</li>
              </ul>
            </div>

            <div className="">
              <h2 className="text-md font-bold text-gray-800">Perubahan Kebijakan</h2>
              <p className="text-sm">
                Kami dapat mengubah Kebijakan Privasi ini sewaktu-waktu. Perubahan akan diberitahukan melalui email
                atau aplikasi kami.
              </p>
            </div>

            <div className="">
              <h2 className="text-md font-bold text-gray-800">Hubungi Kami</h2>
              <p className="text-sm">
                Jika Anda memiliki pertanyaan atau keluhan terkait Kebijakan Privasi ini, silakan hubungi kami di:
              </p>
              <ul className="list-disc pl-5 space-y-1 text-sm">
                <li>Email: <a href="mailto:info@rsuripsumoharjo.com" className="text-blue-500 underline">info@rsuripsumoharjo.com</a></li>
                <li>Telepon: (0721) 771322 / 771323</li>
              </ul>
            </div>
          </div>
        </DialogBody >
        <DialogFooter className="bg-white rounded-b-lg flex items-center justify-center">
          <div className="p-2 bg-secondary text-white text-sm text-center rounded-full" onClick={() => {
            localStorage.setItem("agreement", 1);
            setShowDialog(false)
          }}>Saya Menyetujui kebijakan dan privasi</div>

        </DialogFooter>
      </Dialog>
    </div >

  );
};

export default VerifAkun;
