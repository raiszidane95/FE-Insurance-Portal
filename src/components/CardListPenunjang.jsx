import { ChevronRight } from "lucide-react";
import { Link } from "react-router-dom";

export default function CardListPenunjang({key, item}) {
  return (
    <div key={key}>
      <Link to={`/laboratorium/${item.Id_Lab}`}
        className="flex h-[72px] rounded-2xl shadow-[0_0_4px_0_rgba(0,0,0,0.4)]"
      >
        <div className="flex px-4 items-center justify-center">
          <div className="flex flex-col">
            <div className={`font-semibold text-xs w-fit ${item.Medis == 'RAWAT INAP' ? 'text-secondaryCyan bg-softCyan' : 'text-primaryGreen bg-softGreen/50'} px-2 rounded-full`}>{item.Medis == 'RAWAT INAP' ? 'Rawat Inap' : 'Rawat Jalan'}</div>

            <div className="flex w-full items-center justify-between">
              <div className="">
                <div className="font-semibold text-charcoal">{item.Jenis}</div>
                <div className="font-light text-xs text-charcoal/70">{new Date(item.Tanggal).toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}</div>
              </div>
              <ChevronRight />
            </div>
          </div>
        </div>
      </Link>
    </div>
  )
}