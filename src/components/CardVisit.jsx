import { Link } from "react-router-dom";
import { formatedDate } from "../Util/date";
import DoctorPhoto from "./icons/DoctorPhoto";

function CardVisit({ data }) {

  return (
    <Link to={`/detail-kunjungan/${data?.No_Reg}`}>
      <div className="h-[110px] w-full p-3 bg-white shadow-[0_0_4px_0_rgba(0,0,0,0.4)] rounded-2xl flex items-center gap-4">
        <DoctorPhoto className="rounded-full w-16 h-16" doctorCode={data.DOKTER?.Kode_Dokter} />
        <div className="flex flex-col gap-2">
          <div className="flex flex-col">
            <div className="font-bold text-charcoal">{data?.DOKTER?.Nama_Dokter.trim() || '-'}</div>
            <div className="text-xs font-light">Spesialis {data?.DOKTER?.Spesialis ? data?.DOKTER?.Spesialis.trim() : data?.DOKTER?.Jenis_Profesi}</div>
          </div>
          <div className="flex gap-1 items-center">
            <div className={`flex justify-center items-center gap-2 p-1.5 text-[8px] ${data?.Medis === 'RAWAT INAP' ? 'text-secondaryCyan bg-softCyan' : 'text-primaryGreen bg-softGreen/50'} h-2 w-2 rounded-full font-medium`}>
              i
            </div>
            <div className="text-[10px]"><span className={`font-bold ${data?.Medis === 'RAWAT INAP' ? 'text-secondaryCyan' : 'text-primaryGreen'}`}>{data?.Medis === 'RAWAT INAP' ? 'Rawat Inap' : 'Rawat Jalan'}</span> | {formatedDate(data?.Tanggal)}</div>
          </div>
        </div>
      </div>
    </Link>
  )
}

export {
  CardVisit
}