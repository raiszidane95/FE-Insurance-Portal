import { CardVisit } from "../components/CardVisit";
import Radiologi from "../components/icons/Radiologi";
import { Link, useNavigate } from "react-router-dom";
import { getArticles, getDashboard } from "../service/api";
import { formatedDate, formatedDateShort, formatTanggalLongID } from "../Util/date";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import useFetchData from "../Util/useFetch";
import MCU from "../components/icons/MCU";
import HeroSlider from "../components/HeroSlider";
import image from "../assets/hero-logo.png";
import HeroIcon from "../components/icons/HeroIcon";
import Doctor from "../components/icons/Doctor";
import StetoscopeIcon from "../components/icons/StetoscopeIcon";
import Medicine from "../components/icons/Medicine";
import ErlenmeyerFlask from "../components/icons/ErlenmeyerFlask";
import Neddle from "../components/icons/Needle";
import DefaultArticle from "../components/icons/DefaultArticle";
import DoctorMenu from "../components/icons/DoctorMenu";
import FlaskMenu from "../components/icons/FlaskMenu";
import MenuLogo from "../components/icons/MenuLogo";
import FaQ from "../components/icons/Faq";
import { CalendarClock } from "lucide-react";
import DoctorPhoto from "../components/icons/DoctorPhoto";
import { useEffect, useState } from "react";
import screenfull from "screenfull";
import ServerError from "../components/error/ServerError";
import OtherMenu from "../components/icons/OtherMenu";

export default function Home() {
  const navigate = useNavigate();
  const { data: visitData, loading, error } = useFetchData(getDashboard);
  const [articleData, setArticleData] = useState([]);
  const [articleLoading, setArticleLoading] = useState(true);
  const [articleError, setArticleError] = useState(null);

  const fetchArticles = async () => {
    try {
      const result = await getArticles();
      if (result.status === 500) {
        setArticleError(result.message);
        throw new Error(result.message);
      };
      setArticleData(result);
    } catch (err) {
      setArticleError(err);
    } finally {
      setArticleLoading(false);
    }
  };

  useEffect(() => {
    fetchArticles();
  }, []);

  useEffect(() => {
    if (screenfull.isEnabled) {
      document.addEventListener("click", () => screenfull.request(), { once: true });
    }
  }, []);

  if (loading == false &&
    (visitData?.data?.pasien?.AKUN_PASIEN?.Created_At === visitData?.data?.pasien?.AKUN_PASIEN?.Verified_At)
  ) {
    navigate("/profile", {
      state: {
        code: 403,
        message:
          "Username dan Password masih default. Silahkan ubah Username dan Password terlebih dahulu untuk keamanan akun Anda.",
      },
    });
  }

  if (loading || articleLoading)
    return (
      <div className="p-8">
        <Skeleton className="h-[158px] w-full rounded-xl" />
        <Skeleton count={3} className="h-10 w-full rounded-xl" />
      </div>
    );

  if (error || articleError)
    return (
      <ServerError />
    );

  const rencanaKunjungan = visitData?.data?.rencanaKunjungan;

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const kunjunganTanggal = new Date(rencanaKunjungan[0]?.Tanggal);
  kunjunganTanggal.setHours(0, 0, 0, 0);
  return (
    <div className="flex flex-col w-full gap-9">
      <div className="flex flex-col gap-3 h-[315px] bg-gradient-to-br from-secondary to-[#225503] rounded-b-2xl px-5 py-10">
        <Link to={`/profile`}>
          <div className="text-sm font-bold text-white">
            Halo, {loading ? <Skeleton width={150} height={20} baseColor="#e0e0e0" highlightColor="#f5f5f5" /> : visitData?.data?.pasien?.Nama_Pasien ?? 'Pasien'}
          </div>
        </Link>
        <HomeSlider />
      </div >

      {/* Informasi Rencana Kunjungan */}
      {
        kunjunganTanggal >= today && (
          <div className="px-5 flex flex-col gap-y-5">
            <div className="flex justify-between items-center">
              <div className="flex gap-2 justify-center">
                <div className="w-7 h-7 rounded-full outline outline-[0.5px] bg-softCyan text-secondaryCyan outline-none flex items-center justify-center">i</div>
                <div className="text-xl font-semibold">Rencana Kunjungan</div>
              </div>
              <Link to={`/riwayat-antrian`} className="font-light text-xs">Lihat Semua</Link>
            </div>
            <Link to={`/riwayat-antrian/${rencanaKunjungan[0]?.id}`} className="flex flex-col gap-1 w-full px-5 py-3 shadow-[0_0_4px_0_rgba(0,0,0,0.4)] shadow-secondaryCyan outline outline-[0.5px] outline-secondaryCyan rounded-2xl">
              <div className="flex flex-col gap-2.5">
                <div className="flex items-center gap-2">
                  <DoctorPhoto className="rounded-2xl w-12 h-12" doctorCode={rencanaKunjungan[0]?.DOKTER?.Kode_Dokter} />
                  <div>
                    <div className="font-bold text-lg">{rencanaKunjungan[0]?.DOKTER?.Nama_Dokter}</div>
                    <div className="text-xs font-light">Spesialis {rencanaKunjungan[0]?.DOKTER?.Spesialis || rencanaKunjungan[0]?.DOKTER?.Jenis_Profesi}</div>
                  </div>
                </div>
                <div className="flex gap-2 ps-5 items-center">
                  <CalendarClock className="w-7 h-7 text-secondaryCyan" />
                  <div>
                    <div className="text-xs font-semibold text-secondaryCyan">{formatTanggalLongID(formatedDateShort(rencanaKunjungan[0]?.Tanggal))}.</div>
                    <div className="text-xs font-semibold text-secondaryCyan">{rencanaKunjungan[0]?.Jam} WIB</div>
                  </div>
                </div>
              </div>
            </Link>
          </div>
        )}

      {/* Layanan */}
      <div className="flex flex-col px-5 gap-9">
        <div className="flex flex-col gap-5">
          <div className="text-xl font-semibold">Layanan</div>
          <div className="grid grid-cols-4 gap-4">
            <Link to="/mcu/home" className="flex flex-col items-center gap-1">
              <MCU />
              <p className="text-xs font-semibold text-center text-leafGreen">Medical Check Up</p>
            </Link>
            <Link to="/jadwal-dokter" className="flex flex-col items-center gap-1">
              <Doctor />
              <p className="text-xs font-semibold text-center text-leafGreen">Daftar Poliklinik</p>
            </Link>
            <Link to="/riwayat-kunjungan" className="flex flex-col items-center gap-1">
              <StetoscopeIcon />
              <p className="text-xs font-semibold text-center text-leafGreen">Riwayat Kunjungan</p>
            </Link>
            <Link to="/resep-obat" className="flex flex-col items-center gap-1">
              <Medicine />
              <p className="text-xs font-semibold text-center text-leafGreen">Riwayat Resep Obat</p>
            </Link>
            <Link to="/riwayat-tindakan" className="flex flex-col items-center gap-1">
              <DoctorMenu />
              <p className="text-xs font-semibold text-center text-leafGreen">Riwayat Operasi</p>
            </Link>
            <Link to="/penunjang-medis" className="flex flex-col items-center gap-1">
              <FlaskMenu />
              <p className="text-xs font-semibold text-center text-leafGreen">Penunjang Medis</p>
            </Link>
            <Link to="/riwayat-antrian" className="flex flex-col items-center gap-1">
              <MenuLogo />
              <p className="text-xs font-semibold text-center text-leafGreen">Antrian</p>
            </Link>
            <Link to="/layanan" target="" className="flex flex-col items-center gap-1">
              <OtherMenu />
              <p className="text-xs font-semibold text-center text-leafGreen">Lainnya</p>
            </Link>
          </div>
        </div>

        {/* Kunjungan Terakhir */}
        <div className="flex flex-col gap-5">
          <div className="flex items-center justify-between">
            <div className="text-xl font-semibold">Kunjungan Terakhir</div>
            <Link to={"/riwayat-kunjungan"} className="text-xs font-light text-leafGreen">Lihat semua</Link>
          </div>
          {loading ? (
            <Skeleton className="h-[158px] w-full rounded-xl" />
          ) : (
            <CardVisit data={visitData?.data?.pendaftaran[0]} />
          )}
        </div>

        {/* Penunjang Medis */}
        <div className="flex flex-col gap-5">
          <div className="flex items-center justify-between">
            <div className="text-lg font-semibold">Penunjang Medis</div>
            <Link to={"/penunjang-medis"} className="text-xs font-light text-leafGreen">Lihat semua</Link>
          </div>

          <div className="grid grid-cols-3 gap-2">
            <Link to={`/laboratorium`}>
              <div className="h-[128px] rounded-3xl flex justify-between items-center  bg-white outline outline-[1px] outline-gray-300">
                <div className="flex flex-col px-2 gap-1 w-full">
                  <div className="flex justify-center items-center py-2 bg-softGreen/40 rounded-xl">
                    <ErlenmeyerFlask />
                  </div>
                  <div className="flex flex-col">
                    <div className="text-xs font-semibold">Laboratorium</div>
                    <div className="text-[8px] font-light">
                      Hasil Terakhir: {loading ? <Skeleton width={100} height={10} baseColor="#FFFFFF" highlightColor="#D9D9D9" /> : (formatedDate(visitData?.data?.lab?.Tanggal) ?? 'Belum ada kunjungan')}
                    </div>
                  </div>
                </div>
              </div>
            </Link>
            <Link to={`/radiologi`}>
              <div className="h-[128px]  rounded-3xl flex justify-between items-center  bg-white outline outline-[1px] outline-gray-300">
                <div className="flex flex-col px-2 gap-1 w-full">
                  <div className="flex justify-center items-center py-2 bg-softGreen/40 rounded-xl">
                    <Radiologi />
                  </div>
                  <div className="flex flex-col">
                    <div className="text-sm font-semibold">Radiologi</div>
                    <div className="text-[9px] font-light">
                      Hasil Terakhir: {loading ? <Skeleton width={100} height={10} baseColor="#FFFFFF" highlightColor="#D9D9D9" /> : (formatedDate(visitData?.data?.radiologi?.Tanggal) ?? 'Belum ada kunjungan')}
                    </div>
                  </div>
                </div>
              </div>
            </Link>
            <Link to={`/patologi`}>
              <div className="h-[128px]  rounded-3xl flex justify-between items-center  bg-white outline outline-[1px] outline-gray-300">
                <div className="flex flex-col px-2 gap-1 w-full">
                  <div className="flex justify-center items-center py-2 bg-softGreen/40 rounded-xl">
                    <Neddle />
                  </div>
                  <div className="flex flex-col">
                    <div className="text-sm font-semibold">Patologi</div>
                    <div className="text-[9px] font-light">
                      Hasil Terakhir: {loading ? <Skeleton width={100} height={10} baseColor="#FFFFFF" highlightColor="#D9D9D9" /> : (formatedDate(visitData?.data?.patologi?.Tanggal) ?? 'Belum ada kunjungan')}
                    </div>
                  </div>
                </div>
              </div>
            </Link>
          </div>
        </div>

        {/* Artikel */}
        <div className="flex flex-col gap-5">
          <div className="flex items-center justify-between">
            <div className="text-lg font-semibold">Artikel</div>
            <Link to={`/artikel`} className="text-xs font-light text-leafGreen">Lihat semua</Link>
          </div>

          <div className="grid grid-rows-3 gap-y-6">
            {
              Array.from({ length: 3 }, (_, i) => (
                <Link key={i} target="_blank" to={`https://www.rsuripsumoharjo.com/page/tentang-rs-urip-sumoharjo`}>
                  <div className="flex gap-4">
                    <div className="">
                      {
                        articleData?.data.data[i].image ? (
                          <img loading="lazy" className="w-[108px] h-[81px] object-cover rounded-xl" src={`https://www.rsuripsumoharjo.com/source/` + articleData?.data.data[i].image} alt="" />
                        ) : (
                          <DefaultArticle />
                        )
                      }
                    </div>
                    <div className="flex flex-col justify-around">
                      <div className="">
                        <div className="text-xs font-semibold text-primaryCyan">{articleData?.data.data[i].category[0]?.title ?? 'default'}</div>
                        <div className="text-sm font-semibold">{articleData?.data?.data[i]?.title ?? 'default'}</div>
                      </div>
                      <div className="text-xs font-light text-primaryGray">{formatedDate(articleData?.data.data[i].created_at ?? 'default')}</div>
                    </div>
                  </div>
                </Link>
              ))
            }
          </div>
        </div>
      </div>
    </div >
  )
}

function HomeSlider() {
  return (
    <HeroSlider className={"flex py-3 justify-center items-center "}>
      <div className="overflow-clip h-[175px] rounded-2xl p-3 bg-[#1D5000]">
        <div className="relative z-10 flex flex-col justify-between h-full">
          <div className="absolute -top-10 -right-32 w-[254px] h-[254px] rounded-full bg-[#D3EE98]">
            <div className=" absolute left-3 top-1/2 transform -translate-y-1/2">
              <HeroIcon />
            </div>
          </div>
          <div className="space-y-4 w-7/12">
            <div className="flex items-center gap-1">
              <img src={image} loading="lazy" alt="" className="w-4 h-4" />
              <h2 className="text-white text-xs font-medium">Urip Health Care</h2>
            </div>
            <p className="text-white sm:text-md font-semibold sm:w-3/4 md:w-full tracking-tight">Semua Layanan
              RS Urip Sumoharjo
              Dalam Satu Genggaman</p>
            <button className="mt-4 px-4 bg-[#D3EE98] text-[#1D5000] text-sm font-semibold rounded-3xl">Selengkapnya</button>
          </div>
        </div>
      </div>
      <div className=""></div>
    </HeroSlider>
  )
}