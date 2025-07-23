import React, { memo } from "react";
import { Carousel } from "@material-tailwind/react";
import { FaInstagram, FaFacebookF, FaGlobe, FaWhatsapp } from "react-icons/fa";

import bpjs from "../../assets/company/BPJS-KESEHATAN.png";
import bpjs2 from "../../assets/company/BPJS-KETENAGAKERJAAN.png";
import kai from "../../assets/company/KAI.png";
import pln from "../../assets/company/PLN.png";
import sampoerna from "../../assets/company/SAMPOERNA.png";
import JasaRaharja from "../../assets/company/JasaRaharja.png";
import phapros from "../../assets/company/PHAPROS.png";
import kosasih from "../../assets/company/kosasih.png";
import ntt from "../../assets/company/NTT.png";
import telkom from "../../assets/company/telkom.png";
import sos from "../../assets/company/sos.png";
import cng from "../../assets/company/cng.png";
import INHEALTH from "../../assets/company/INHEALTH.png";
import HEXINDO from "../../assets/company/HEXINDO.png";
import adhi from "../../assets/company/adhi.png";
import SMILYNKS from "../../assets/company/SMILYNKS.png";
import PHILIP from "../../assets/company/PHILIP.png";
import EQUITY from "../../assets/company/EQUITY.png";
import ace from "../../assets/company/ace.png";
import bmi from "../../assets/company/bmi.png";
import MEGA from "../../assets/company/MEGA.png";
import BNILIFE from "../../assets/company/BNILIFE.png";
import banklampung from "../../assets/company/banklampung.png";
import muamalat from "../../assets/company/muamalat.png";
import apik from "../../assets/company/apik.png";
import avrist from "../../assets/company/avrist.png";
import relife from "../../assets/company/relife.png";
import aca from "../../assets/company/aca.png";
import sinarmas from "../../assets/company/sinarmas.png";
import lippo from "../../assets/company/lippo.png";
import mnclife from "../../assets/company/mnclife.png";
import BP2MI from "../../assets/company/BP2MI.png";
import bumiputera from "../../assets/company/bumiputera.png";
import adira from "../../assets/company/adira.png";
import allianz from "../../assets/company/allianz.png";
import TASPEN from "../../assets/company/TASPEN.png";
import PTPN7 from "../../assets/company/PTPN7.png";
import PERTAMEDIKA from "../../assets/company/PERTAMEDIKA.png";
import WSKT from "../../assets/company/WSKT.png";
import ABIPRAYA from "../../assets/company/ABIPRAYA.png";
import PAN from "../../assets/company/PAN.png";
import NAYAKA from "../../assets/company/NAYAKA.png";
import MAG from "../../assets/company/MAG.png";
import CYNERGY from "../../assets/company/CYNERGY.png";
import MANULIFE from "../../assets/company/MANULIFE.png";
import BINTANG from "../../assets/company/BINTANG.png";
import CAR from "../../assets/company/CAR.png";
import WAMA from "../../assets/company/WAMA.png";
import ADMEDIKA from "../../assets/company/ADMEDIKA.png";
import KALGEN from "../../assets/company/KALGEN.png";
import ACROOSS from "../../assets/company/ACROOSS.png";
import OJK from "../../assets/company/OJK.png";
import JP from "../../assets/company/JP.png";
import HALODOC from "../../assets/company/HALODOC.png";
import PACIFIC from "../../assets/company/PACIFIC.png";
import PUSRI from "../../assets/company/PUSRI.png";
import TIRTA from "../../assets/company/TIRTA.png";
import PRIMA from "../../assets/company/PRIMA.png";
import AXA from "../../assets/company/AXA.png";
import TAKAFUL from "../../assets/company/TAKAFUL.png";
import KRESNA from "../../assets/company/KRESNA.png";
import LAMBANG from "../../assets/company/LAMBANG.png";
import LDC from "../../assets/company/LDC.png";
import chubb from "../../assets/company/chubb.png";
import gardamedika from "../../assets/company/gardamedika.png";
import reliance from "../../assets/company/reliance.png";
import lotte from "../../assets/company/lotte.png";
import sunday from "../../assets/company/sunday.png";
import banksinarmas from "../../assets/company/banksinarmas.png";
import brilife from "../../assets/company/brilife.png";

import generali from "../../assets/company/generali.png";
import great from "../../assets/company/great.png";
import ipc from "../../assets/company/ipc.png";
import fullerton from "../../assets/company/fullerton.png";
import aviva from "../../assets/company/aviva.png";
import ramayana from "../../assets/company/ramayana.png";
import sunlife from "../../assets/company/sunlife.png";
import tokiomarine from "../../assets/company/tokiomarine.png";
import sompo from "../../assets/company/sompo.png";
import medicilin from "../../assets/company/medicilin.png";

const partnersList = [
  [
    {},
    { src: bpjs, w: 24, h: 24 },
    { src: bpjs2, w: 32, h: 36 },
    {},
    { src: kai, w: 24, h: 24 },
    { src: pln, w: 24, h: 24 },
    { src: sampoerna, w: 24, h: 24 },
    { src: JasaRaharja, w: 24, h: 24 },
    { src: phapros, w: 24, h: 28 },
    { src: ntt, w: 24, h: 24 },
    { src: kosasih, w: 20, h: 20 },
    { src: telkom, w: 24, h: 24 },
  ],
  [
    { src: sos, w: 20, h: 20 },
    { src: cng, w: 24, h: 24 },
    { src: INHEALTH, w: 24, h: 24 },
    { src: HEXINDO, w: 24, h: 24 },
    { src: adhi, w: 24, h: 24 },
    { src: SMILYNKS, w: 24, h: 24 },
    { src: PHILIP, w: 20, h: 20 },
    { src: EQUITY, w: 20, h: 20 },
    { src: ace, w: 20, h: 20 },
    { src: bmi, w: 20, h: 20 },
    { src: MEGA, w: 20, h: 20 },
    { src: BNILIFE, w: 20, h: 20 },
  ],
  [
    { src: banklampung, w: 20, h: 24 },
    { src: muamalat, w: 20, h: 24 },
    { src: apik, w: 24, h: 24 },
    { src: avrist, w: 24, h: 24 },
    { src: relife, w: 20, h: 24 },
    { src: aca, w: 20, h: 20 },
    { src: sinarmas, w: 20, h: 24 },
    { src: lippo, w: 20, h: 24 },
    { src: mnclife, w: 20, h: 20 },
    { src: BP2MI, w: 20, h: 20 },
    { src: bumiputera, w: 20, h: 20 },
    { src: adira, w: 20, h: 20 },
  ],
  [
    { src: allianz, w: 20, h: 20 },
    { src: TASPEN, w: 20, h: 20 },
    { src: PTPN7, w: 20, h: 20 },
    { src: PERTAMEDIKA, w: 20, h: 20 },
    { src: WSKT, w: 20, h: 24 },
    { src: ABIPRAYA, w: 20, h: 20 },
    { src: PAN, w: 24, h: 28 },
    { src: NAYAKA, w: 20, h: 20 },
    { src: MAG, w: 20, h: 20 },
    { src: CYNERGY, w: 20, h: 24 },
    { src: MANULIFE, w: 20, h: 24 },
    { src: BINTANG, w: 20, h: 24 },
  ],
  [
    { src: CAR, w: 20, h: 20 },
    { src: WAMA, w: 20, h: 20 },
    { src: ADMEDIKA, w: 20, h: 20 },
    { src: KALGEN, w: 20, h: 20 },
    { src: ACROOSS, w: 20, h: 20 },
    { src: OJK, w: 20, h: 20 },
    { src: JP, w: 20, h: 20 },
    { src: HALODOC, w: 20, h: 24 },
    { src: PACIFIC, w: 20, h: 20 },
    { src: PUSRI, w: 24, h: 24 },
    { src: TIRTA, w: 20, h: 20 },
    { src: PRIMA, w: 20, h: 20 },
  ],
  [
    { src: AXA, w: 20, h: 20 },
    { src: TAKAFUL, w: 20, h: 20 },
    { src: KRESNA, w: 20, h: 24 },
    { src: LAMBANG, w: 20, h: 24 },
    { src: LDC, w: 20, h: 20 },
    { src: chubb, w: 20, h: 24 },
    { src: gardamedika, w: 24, h: 24 },
    { src: reliance, w: 24, h: 24 },
    { src: lotte, w: 24, h: 24 },
    { src: sunday, w: 24, h: 24 },
    { src: banksinarmas, w: 24, h: 24 },
    { src: brilife, w: 24, h: 24 },
  ],
  [
    { src: generali, w: 24, h: 24 },
    { src: great, w: 24, h: 24 },
    { src: ipc, w: 20, h: 24 },
    { src: fullerton, w: 24, h: 24 },
    { src: aviva, w: 24, h: 24 },
    { src: ramayana, w: 20, h: 24 },
    { src: sunlife, w: 24, h: 24 },
    { src: tokiomarine, w: 24, h: 24 },
    { src: sompo, w: 20, h: 20 },
    { src: medicilin, w: 24, h: 24 },
  ],
];

export const PartnerSlideshow = memo(function PartnerSlideshow() {
  return (
    <div className="h-[40vh] bg-[#f5f5f5] px-12 py-4 flex flex-col items-center">
      <h2 className="text-[#1B5E20] text-2xl md:text-3xl lg:text-4xl font-bold text-center">
        MITRA KERJASAMA
      </h2>
      <h3 className="text-[#1B5E20] text-xl md:text-2xl lg:text-4xl font-bold text-center">
        RS. URIP SUMOHARJO
      </h3>
      <Carousel autoplay={true} autoplayDelay={5000} loop={true} className="w-full max-w-4xl no-scrollbar">
        {partnersList.map((group, index) => (
          <div key={index} className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-4 gap-y-0 justify-items-center">
            {group.map(({ src, w, h }, idx) =>
              src ? (
                <img
                  key={idx}
                  src={src || "/placeholder.svg"}
                  alt="Partner Logo"
                  className={`w-${w} h-${h} object-contain m-auto`}
                />
              ) : (
                <div key={idx} />
              ),
            )}
          </div>
        ))}
      </Carousel>

      <div className="grid grid-cols-2 justify-center items-center gap-x-6 gap-y-0 mb-auto text-[#1B5E20] text-lg font-semibold">
        <div className="flex items-center justify-center space-x-2">
          <FaInstagram />
          <span>rs.uripsumoharjo.lampung</span>
        </div>
        <div className="flex items-center justify-center space-x-2">
          <FaFacebookF />
          <span>Rumah Sakit Urip Sumoharjo</span>
        </div>
        <div className="flex items-center justify-center space-x-2">
          <FaGlobe />
          <span>www.rsuripsumoharjo.com</span>
        </div>
        <div className="flex items-center justify-center space-x-2">
          <FaWhatsapp />
          <span>0821 7796 3700</span>
        </div>
      </div>
    </div>
  );
});
