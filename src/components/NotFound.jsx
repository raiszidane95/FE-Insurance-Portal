import { Link } from 'react-router-dom';

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="text-center">
        <h1 className="text-6xl font-bold text-gray-800 mb-4">404</h1>
        <p className="text-xl mb-8">Oops! Halaman yang Anda cari tidak ditemukan.</p>
        <Link 
          to="/" 
          className="bg-blue-600 hover:bg-primaryBlue/80 text-white font-bold py-2 px-4 rounded transition duration-300"
        >
          Kembali ke Beranda
        </Link>
      </div>
    </div>
  );
}
