import * as React from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"

import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { SearchDokter } from "@/components/SearchableInputDokter"
import { cekRegister, createPendaftaranSJP, getMRefPasien, getMSourcePasien, patients, postKartuAsuransi } from "@/service/api"
import { SearchMRef } from "@/components/SearchableInputMRef"
import { inputDataPendaftaran } from "@/constants/inputDataPendaftaran"
import { Separator } from "@/components/ui/separator"
import { DatePicker } from "@/components/ui/date-picker"
import Swal from "sweetalert2"
import { FullPageLoader } from "@/components/Loader"
import { useLocation, useNavigate } from "react-router-dom"
import { SearchPasien } from "@/components/SearchableInputPasien"
import { FloatingAlert } from "@/components/CustomAlert"
import { SearchProviderRujukan } from "@/components/SearchableInputProviderRujukan"
import { SearchICD10 } from "@/components/SearchableInputICD"

// Helper component for form fields to reduce repetition
const FormField = ({ label, required, children, }) => {
  return (
    <div className="grid gap-2">
      <Label>
        {label}
        {required && <span className="pl-0.5 text-red-500">*</span>}
      </Label>
      {children}
    </div>
  );
}

export default function PendaftaranPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const dataEligibilitas = location.state;
  const [data, setData] = React.useState(inputDataPendaftaran);
  const [responseSJP, setResponseSJP] = React.useState({});
  const [nik, setNik] = React.useState("");
  const [refPasien, setRefPasien] = React.useState([]);
  const [sourcePasien, setSourcePasien] = React.useState([]);
  const [nomorAsuransi, setNomorAsuransi] = React.useState("");
  const [pasien, setPasien] = React.useState({});
  const [providerRujukan, setProviderRujukan] = React.useState({});
  const [kartuAsuransi, setKartuAsuransi] = React.useState({});
  const [dokter, setDokter] = React.useState({});
  const [rekanan, setRekanan] = React.useState({});
  const [icd, setIcd] = React.useState({});
  const [kunjungan, setKunjungan] = React.useState({});
  const [kodeSource, setKodeSource] = React.useState({});
  const [kodeReferensi, setKodeReferensi] = React.useState({});
  const [isLoading, setIsLoading] = React.useState(false);
  const [kodeMasuk, setKodeMasuk] = React.useState("");
  const [caraMasukIGD, setCaraMasukIGD] = React.useState("");
  const [validaiton, setValidation] = React.useState({});


  const simpanSjp = async () => {
    try {
      setIsLoading(true);
      const response = await createPendaftaranSJP(data);
      if (response.status === 409) {
        Swal.fire("Error", `Gagal Simpan SJP. ${response?.data?.ERRORDESC}`, "error");
        return;
      } else if (response.status !== 201) {
        Swal.fire("Error", `Gagal Simpan SJP. ${response?.message}`, "error");
        return;
      }
      setResponseSJP(response);
      Swal.fire("Success", response?.message, "success").then((result) => {
        if (result.isConfirmed) {
          navigate("/", { state: response });
        }
      });
    } catch (error) {
      Swal.fire("Error", error, "error");
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const createKartuAsuransi = async () => {
    try {
      setIsLoading(true);
      const response = await postKartuAsuransi({
        Kode_Asuransi: dataEligibilitas?.Rekanan.Kode_Asuransi,
        No_MR: pasien?.No_MR,
        No_Kartu: nomorAsuransi,
      });
      if (response.status !== 200) {
        return;
      }
      setKartuAsuransi(response);
      Swal.fire("Success", response?.message, "success");
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  React.useEffect(() => {
    const fetchInitialData = async () => {
      try {
        setIsLoading(true);
        const [refPasienRes, sourcePasienRes, pasienRes] = await Promise.all([
          getMRefPasien(),
          getMSourcePasien(),
          patients(dataEligibilitas?.nokainhealth),
        ]);
        const kunjungan = await cekRegister(pasienRes?.data[0]?.No_MR);


        setKunjungan(kunjungan);
        setRefPasien(refPasienRes.data);
        setSourcePasien(sourcePasienRes.data);

        const pasienData = pasienRes.data[0] || {};
        setPasien(pasienData);
        setKartuAsuransi(pasienData?.IP_KARTU_ASURANSI || {});
        setNik(pasienData?.No_Identitas || "");
        setNomorAsuransi(dataEligibilitas?.nokainhealth);

        // Gabungkan semua pembaruan state "data" dalam satu kali set
        const updatedData = {
          ...inputDataPendaftaran,
          NIK: pasienData?.No_Identitas || "",
          No_Kartu: pasienData?.KartuBPJS || "",
          No_MR: pasienData?.No_MR || "",
          Kode_Masuk: dataEligibilitas?.poli === "UGD" ? "1" : "2",
          Medis: dataEligibilitas?.jenispelayanan || "",
          KodeRekanan: dataEligibilitas?.Rekanan?.Kode_Asuransi || "",
          CaraMasuk_IGD: dataEligibilitas?.poli === "UGD" ? "IGD MURNI" : "",
          Kode_Datang: pasienData ? "2" : "1",
        };

        setData(updatedData);
        if (dataEligibilitas?.poli === "UGD") {
          setCaraMasukIGD("IGD MURNI");
          setKodeMasuk("1");
        }

      } catch (error) {
        console.error("Gagal fetch data awal:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchInitialData();
  }, [dataEligibilitas]);

  const handleSubmit = (e) => {
    e.preventDefault();
    simpanSjp();

    if (!kartuAsuransi.No_Kartu) {
      createKartuAsuransi();
    }

  };

  React.useEffect(() => {
    setNik(pasien?.No_Identitas || "");
    setNomorAsuransi(dataEligibilitas?.nokainhealth || "");
    setData({
      ...data,
      NIK: pasien?.No_Identitas || "",
      No_Kartu: dataEligibilitas?.nokainhealth || "",
      No_MR: pasien?.No_MR || "",
    });

  }, [pasien]);

  React.useEffect(() => {
    setData({ ...data, Kode_Dokter: `${dokter.Kode_Dokter}` || "" });
  }, [dokter]);

  React.useEffect(() => {
    setData({ ...data, kodeproviderasalrujukan: `${providerRujukan.KDPROVIDER}` || "" });
  }, [providerRujukan]);

  React.useEffect(() => {
    setData({ ...data, Kode_Source: `${kodeSource}` || "" });
  }, [kodeSource]);

  React.useEffect(() => {
    setData({ ...data, Kode_Referensi: `${kodeReferensi}` || "" });
  }, [kodeReferensi]);

  React.useEffect(() => {
    setData({ ...data, KodeRekanan: rekanan.KodeRekanan || "" });
  }, [rekanan]);

  React.useEffect(() => {
    setData({ ...data, kodediagnosautama: icd.ICD10 || "" });
  }, [icd]);

  return (
    <div className="flex justify-center items-start py-8 bg-muted/40">
      {isLoading && <FullPageLoader />}
      {!isLoading && !pasien?.No_MR && (
        <FloatingAlert
          className={`${isLoading ? "hidden" : ""}`}
          type="warning"
          title="Perhatian!"
          position="top-center"
          description="Ada beberapa data yang belum dilengkapi (Pasien, Nomor Asuransi, NIK). Silahkan lengkapi data tersebut sebelum melakukan simpan SJP."
        />
      )}

      <Card className="w-full max-w-5xl shadow-lg">
        <form onSubmit={handleSubmit} >
          <CardHeader className="flex flex-row items-center justify-between border-b">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full">
              <div className="">
                <CardTitle className="text-2xl">Registrasi Pasien & Simpan SJP</CardTitle>
                <CardDescription>Silakan isi detail pasien di bawah ini.</CardDescription>
              </div>
              <div className="">
                <div className="text-sm font-semibold">Nama Perusahaan Asuransi:</div>
                <div className="text font-semibold "> {dataEligibilitas?.Rekanan?.Nama_Asuransi}</div>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-x-8 gap-y-6 max-w-full overflow-hidden p-1">
              {/* Left Column */}
              <div className="flex flex-col gap-5">
                {/* Asal Pasien */}
                <FormField label="Asal Pasien" required>
                  <Select required defaultValue={data.Kode_Asal} onValueChange={(value) => { setData({ ...data, Kode_Asal: value }) }}>
                    <SelectTrigger>
                      <SelectValue placeholder="Pilih asal pasien" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1">Datang Sendiri</SelectItem>
                      <SelectItem value="2">Rekom Karyawan</SelectItem>
                      <SelectItem value="3">Dokter Internal</SelectItem>
                      <SelectItem value="4">Kiriman Ambulance</SelectItem>
                    </SelectContent>
                  </Select>
                </FormField>

                {/* Cara Pasien Masuk */}
                <FormField label="Cara Pasien Masuk" required>
                  <Select required value={data.Kode_Masuk} onValueChange={(value) => {
                    setKodeMasuk(value);
                    setData({ ...data, Kode_Masuk: value });
                  }}>
                    <SelectTrigger>
                      <SelectValue placeholder="Pilih cara pasien masuk" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="0">Lain-lain</SelectItem>
                      <SelectItem value="1">IGD</SelectItem>
                      <SelectItem value="2">Poliklinik</SelectItem>
                      <SelectItem value="3">Kemotherapi</SelectItem>
                      <SelectItem value="4">Hemodialisa</SelectItem>
                      <SelectItem value="5">Rehab Medik</SelectItem>
                      <SelectItem value="6">Rapid Antigen</SelectItem>
                      <SelectItem value="7">PCR</SelectItem>
                      <SelectItem value="8">PCR Sampel</SelectItem>
                      <SelectItem value="9">PCR Sampel+vtm</SelectItem>
                      <SelectItem value="A">MCU</SelectItem>
                      <SelectItem value="B">Penunjang</SelectItem>
                      <SelectItem value="C">Radioterapi</SelectItem>
                      <SelectItem value="A">Kedokteran Nuklir</SelectItem>
                      <SelectItem value="E">Homecare</SelectItem>
                    </SelectContent>
                  </Select>
                </FormField>

                {/* Cara Masuk IGD */}
                {
                  kodeMasuk === "1" && (
                    <FormField label="Cara Masuk IGD" required>
                      <Select required defaultValue="IGD MURNI" onValueChange={(value) => setData({ ...data, CaraMasuk_IGD: value })}>
                        <SelectTrigger>
                          <SelectValue placeholder="Pilih cara pasien masuk" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="IGD MURNI">IGD Murni</SelectItem>
                          <SelectItem value="REKOM POLI">Rekom Poli</SelectItem>
                        </SelectContent>
                      </Select>
                    </FormField>
                  )
                }

                {/* Cara Pasien Datang */}
                <FormField label="Cara Pasien Datang" required>
                  <Select required defaultValue={data.Kode_Datang} onValueChange={(value) => setData({ ...data, Kode_Datang: value })}>
                    <SelectTrigger>
                      <SelectValue placeholder="Pilih cara pasien datang" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1">Kunjungan Baru</SelectItem>
                      <SelectItem value="2">Kunjungan Lama</SelectItem>
                    </SelectContent>
                  </Select>
                </FormField>

                {/* Kondisi Pasien Datang */}
                <FormField label="Kondisi Pasien Datang" required>
                  <Select required defaultValue={data.Kode_Kondisi} onValueChange={(value) => setData({ ...data, Kode_Kondisi: value })}>
                    <SelectTrigger>
                      <SelectValue placeholder="Pilih cara pasien datang" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="0">Belum Tahu, Baru Datang</SelectItem>
                      <SelectItem value="1">Sedang Dirawat</SelectItem>
                      <SelectItem value="2">Hidup</SelectItem>
                      <SelectItem value="3">{`Meninggal Dunia <48 Jam`}</SelectItem>
                      <SelectItem value="4">{`Meninggal Dunia >48 Jam`}</SelectItem>
                      <SelectItem value="5">D.O.A</SelectItem>
                    </SelectContent>
                  </Select>
                </FormField>

                {/* Cara Bayar */}
                <FormField label="Cara Bayar" required>
                  <Select disabled defaultValue={data.Kode_Bayar}>
                    <SelectTrigger>
                      <SelectValue placeholder="Pilih cara bayar" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1">BPJS</SelectItem>
                      <SelectItem value="2">Asuransi</SelectItem>
                      <SelectItem value="3">Pribadi/Mandiri</SelectItem>
                      <SelectItem value="8">Tanggungan Instansi/Perusahaan</SelectItem>
                      <SelectItem value="9">Covid</SelectItem>
                    </SelectContent>
                  </Select>
                </FormField>
              </div>

              {/* Center Column */}
              <div className="flex flex-col gap-5">

                <FormField label="Rekanan" required>
                  <Input
                    placeholder="Rekanan"
                    value={dataEligibilitas?.Rekanan.Kode_Asuransi + " | " + dataEligibilitas?.Rekanan?.Nama_Asuransi}
                    readOnly
                    onChange={(e) => (e.target.value)}
                  />
                </FormField>

                <FormField label="Nama Pasien" className="" required>
                  <SearchPasien
                    initValue={pasien}
                    selectedValue={(data) => { setPasien(data) }}
                    moduleApiUrl={"patient-list"}
                    placeholder="Cari Pasien..."
                    searchPlaceholder="Cari Nama/No.MR/NIK..."
                    notFoundMessage="Data Pasien tidak ditemukan."
                  />
                </FormField>

                <FormField label="NIK">
                  <Input
                    placeholder="Nomor Induk Kependudukan"
                    value={nik}
                    readOnly
                    onChange={(e) => setNik(e.target.value)}
                  />
                </FormField>

                <FormField label="Nomor Kartu Asuransi" required>
                  <Input
                    placeholder="Nomor Kartu Asuransi"
                    value={nomorAsuransi}
                    onChange={(e) => {
                      setNomorAsuransi(e.target.value)
                      setData({ ...data, No_Kartu: e.target.value })
                    }} // jika mau bisa diedit user
                  />
                </FormField>

                <FormField label="Pelayanan Medis" required>
                  <Select required value={data.Medis} onValueChange={(value) => setData({ ...data, Medis: value })}>
                    <SelectTrigger>
                      <SelectValue placeholder="Pilih pelayanan" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="RAWAT JALAN">RAWAT JALAN</SelectItem>
                      <SelectItem value="RAWAT INAP">RAWAT INAP</SelectItem>
                    </SelectContent>
                  </Select>
                </FormField>

                <FormField label="Perminatan DPJP" required>
                  <Select required defaultValue="RUJUKAN DIRI SENDIRI" onValueChange={(value) => setData({ ...data, PermintaanDPJP: value })}>
                    <SelectTrigger>
                      <SelectValue placeholder="Pilih perminatan" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="RUJUKAN DIRI SENDIRI">Rujukan Diri Sendiri</SelectItem>
                      <SelectItem value="PERMINTAAN PASIEN">Permintaan Pasien</SelectItem>
                      <SelectItem value="SESUAI JADWAL PIKET IGD">Sesuai Jadwal Piket IGD</SelectItem>
                      <SelectItem value="SESUAI JADWAL PIKET RUANGAN">Sesuai Jadwal Piket Ruangan</SelectItem>
                    </SelectContent>
                  </Select>
                </FormField>
              </div>

              {/* Right Column */}
              <div className="flex flex-col gap-5">

                <FormField label="Referensi dari" required>
                  <Select required defaultValue={data.Referensi} onValueChange={(value) => setData({ ...data, Referensi: value })}>
                    <SelectTrigger>
                      <SelectValue placeholder="Pilih referensi" />
                    </SelectTrigger>
                    <SelectContent>
                      {refPasien?.map((item, index) => (
                        <SelectItem key={index} value={item.Referensi}>{item.Referensi}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </FormField>


                <FormField label="Data Referensi">
                  <SearchMRef
                    selectedValue={(data) => setKodeReferensi(data.Id_Referensi)}
                    filter={data.Referensi}
                    moduleApiUrl={"m-referensi"}
                    placeholder="Pilih Data Referensi"
                    searchPlaceholder="Cari Nama/kode..."
                    notFoundMessage="Data Referensi tidak ditemukan."
                  />
                </FormField>


                <FormField label="Dokter DPJP" required>
                  <SearchDokter
                    selectedValue={(data) => setDokter(data)}
                    moduleApiUrl={"doctors"}
                    placeholder="Pilih Dokter"
                    searchPlaceholder="Cari Nama/Kode Dokter..."
                    notFoundMessage="Dokter tidak ditemukan."
                  />
                </FormField>

                <FormField label="Source Pasien" required>
                  <Select required defaultValue="13" onValueChange={(value) => {
                    setData({ ...data, SourcePasien: value })
                  }}>
                    <SelectTrigger>
                      <SelectValue placeholder="Pilih Source" />
                    </SelectTrigger>
                    <SelectContent>
                      {sourcePasien?.map((item, index) => (
                        <SelectItem key={index} value={item.Source}>{item.Source}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </FormField>

                <FormField label="Data Source Pasien">
                  <SearchMRef
                    selectedValue={(data) => setKodeSource(data.Id_Referensi)}
                    filter={data.SourcePasien}
                    moduleApiUrl={"m-referensi"}
                    placeholder="Pilih Data Source Pasien"
                    searchPlaceholder="Cari Nama/kode..."
                    notFoundMessage="Data Source Pasien tidak ditemukan."
                  />
                </FormField>
              </div>
            </div>
            <div className="py-5">
              <div className="text-2xl font-semibold">
                Data Rujukan Inhealth
              </div>
              <div className="text-muted-foreground text-sm">
                Silakan isi detail rujukan inhealth di bawah ini.
              </div>
              <Separator className="my-4" />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5 max-w-screen-md">
                <div className="flex flex-col gap-5">
                  <FormField label="Nomor Rujukan">
                    <Input
                      onChange={(e) => setData({ ...data, nomorasalrujukan: e.target.value })}
                      type="text"
                      placeholder="Nomor Rujukan"
                    />
                  </FormField>
                  <FormField label="Tanggal Rujukan" required>
                    <DatePicker onDateChange={(e) => setData({ ...data, tanggalasalrujukan: e })} />
                  </FormField>
                </div>
                <div className="flex flex-col gap-5">
                  <FormField label="Asal Rujukan" required>
                    <SearchProviderRujukan
                      selectedValue={(data) => { setProviderRujukan(data) }}
                      moduleApiUrl={"provider-rujukan"}
                      placeholder="Cari Provider Rujukan"
                      searchPlaceholder="Cari Nama Provider..."
                      notFoundMessage="Data Provider tidak ditemukan."
                    />
                  </FormField>
                  <FormField label="Kode Diagnosa" className="" required>
                    <SearchICD10
                      selectedValue={(data) => { setIcd(data) }}
                      moduleApiUrl={"icd-list"}
                      placeholder="Cari Kode ICD..."
                      searchPlaceholder="Cari Kode/Keterangan..."
                      notFoundMessage="Data ICD tidak ditemukan."
                    />
                  </FormField>
                </div>
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex justify-end gap-2 border-t pt-6">
            <Button variant="outline">Batal</Button>
            <Button type="submit" >Simpan</Button>
          </CardFooter>
        </form >
      </Card>
    </div >
  )
}