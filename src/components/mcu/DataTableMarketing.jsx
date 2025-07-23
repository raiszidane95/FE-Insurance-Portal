import Swal from "sweetalert2";
import { Input } from '../Form/Input';
import { Select } from '../Form/Select';
import { ModalForm } from "../ModalForm";
import { Textarea } from "../Form/Textarea";
import AsyncSelect from "react-select/async";
import { format, addDays } from "date-fns";
import { getRegisterPasien } from "../../service/api";
import { Phone, MessageSquare, ListPlus, ChevronDown, Stethoscope, FlaskConical, HeartPulse, Activity, Syringe, Microscope, X } from 'lucide-react';
import React, { useCallback, useEffect, useState } from "react";
import { Typography, IconButton, Tooltip, Button, Radio, Option, Checkbox, Accordion, AccordionHeader, AccordionBody, Dialog, DialogHeader, DialogBody } from "@material-tailwind/react";
import { getGroupTindakanDetail, getKategoriPaket, getlisttindakancustom, getPaketbyKategori, updateStatusMCU, bookingMCUOnline, getlisttindakanpaket } from "../../service/apiMCU";

const ContactOptions = ({ number, row }) => {
  const formattedNumber = (() => {
    const digits = number.replace(/\D/g, '');
    if (digits.startsWith('0')) {
      return '62' + digits.slice(1);
    }
    if (!digits.startsWith('62')) {
      return '62' + digits;
    }
    return digits;
  })();

  const text = encodeURIComponent(
    `Halo ${row?.Nama_Pasien},\n\nKami dari *RS Urip Sumoharjo* ingin konfirmasi bahwa Anda memiliki jadwal *Medical Check-Up (MCU)* pada:\n\n📅 ${new Date(row?.Booking_At).toLocaleDateString('id-ID', { day: '2-digit', month: 'long', year: 'numeric' })}\n📍 RS Urip Sumoharjo\n\nMohon konfirmasi kehadiran Anda dengan membalas pesan ini. Jika ada pertanyaan atau perlu reschedule dan tambahan pemeriksaan, silakan hubungi kami.\n\nTerima kasih, kami tunggu kehadiran Anda! 😊\n\n*RS Urip Sumoharjo* 🏥`
  );

  const whatsappUrl = `https://api.whatsapp.com/send/?phone=${formattedNumber}&text=${text}&type=phone_number&app_absent=0`;

  return (
    <div className="flex gap-1">
      <Tooltip content="WhatsApp">
        <IconButton variant="text" size="sm" className="rounded-full bg-green-50 text-green-500 hover:bg-green-100" onClick={() => window.open(whatsappUrl, '_blank')}>
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 21l1.65-3.8a9 9 0 1 1 3.4 2.9L3 21" /><path d="M9 10a.5.5 0 0 0 1 0V9a.5.5 0 0 0-1 0v1a5 5 0 0 0 5 5h1a.5.5 0 0 0 0-1h-1a.5.5 0 0 0 0 1" /></svg>
        </IconButton>
      </Tooltip>
      <Tooltip content="SMS">
        <IconButton variant="text" size="sm" className="rounded-full bg-blue-50 text-blue-500 hover:bg-blue-100" onClick={() => window.open(`sms:${formattedNumber}`, '_blank')}>
          <MessageSquare className="h-3 w-3" />
        </IconButton>
      </Tooltip>
      <Tooltip content="Telepon">
        <IconButton variant="text" size="sm" className="rounded-full bg-purple-50 text-purple-500 hover:bg-purple-100" onClick={() => window.open(`tel:${formattedNumber}`, '_blank')}>
          <Phone className="h-3 w-3" />
        </IconButton>
      </Tooltip>
    </div>
  );
};

const formatDate = (dateString) => {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('id-ID', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  }).format(date);
};

const getPageNumbers = (currentPage, totalPages) => {
  const delta = 1;
  const pages = [];

  for (let i = 1; i <= totalPages; i++) {
    if (
      i === 1 ||
      i === totalPages ||
      (i >= currentPage - delta && i <= currentPage + delta)
    ) {
      pages.push(i);
    }
  }
  return pages;
};

const getIconForBundle = (bundleName) => {
  switch (bundleName.toLowerCase()) {
    case "konsultasi":
      return <Stethoscope className="w-5 h-5" />
    case "laboratorium":
      return <FlaskConical className="w-5 h-5" />
    case "radiologi":
      return <HeartPulse className="w-5 h-5" />
    case "pemeriksaan":
      return <Activity className="w-5 h-5" />
    case "tindakan":
      return <Syringe className="w-5 h-5" />
    default:
      return <Microscope className="w-5 h-5" />
  }
}

const DataTableMarketing = ({ data, pagination, onPageChange, onRefresh, activeTab }) => {
  const TABLE_HEAD = activeTab == 'comp' ?
    ["No.", "Nama Pasien", 'Comp.', 'Kontak', "Paket MCU", "Tanggal Booking", "Status MCU", "Actions"]
    : ["No.", "Nama Pasien", 'Kontak', "Paket MCU", "Tanggal Booking", "Status MCU", "Actions"];

  const [open, setOpen] = useState(false);
  const [open2, setOpen2] = useState(false);
  const [loading, setLoading] = useState(true);
  const [editRegis, setEditRegis] = useState(null);
  const [paketList, setPaketList] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [groupDetail, setGroupDetail] = useState([]);
  const [selectedRow, setSelectedRow] = useState(null);
  const [isModalView, setIsModalView] = useState(false);
  const [procedureView, setProcedureView] = useState(null);
  const [selectedPasienRegis, setPasienRegis] = useState(null);
  const [customActionError, setCustomActionError] = useState("");
  const [packageCategories, setPackageCategories] = useState([]);
  const [showCustomButton, setShowCustomButton] = useState(false);
  const [selectedCustomActions, setSelectedCustomActions] = useState({});
  const [formData, setFormData] = useState({ Id_Kategori_Paket: null, Id_Paket: null, Harga: null, Booking_At: null, Id_Pasien_MCU: null, Checkin_At: null, No_MR: null });
  const [formError, setFormError] = useState({ Id_Kategori_Paket: "", Id_Paket: "", Harga: "", Booking_At: "", Id_Pasien_MCU: "", No_MR: "" });
  const [openAccordion, setOpenAccordion] = useState(0);
  const handleAccordionOpen = (value) => setOpenAccordion(openAccordion === value ? 0 : value);

  const handleInputChange = (e) => {

    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (name === "Harga") {
      const numericValue = Number.parseInt(value.replace(/\D/g, ""), 10)
      setFormData((prev) => ({
        ...prev,
        [name]: isNaN(numericValue) ? "" : numericValue,
      }))
    } else {
      setFormData((prev) => {
        const newData = { ...prev }
        return newData
      })
    }
    setFormError(prev => ({ ...prev, [name]: "" }));
  };

  const handleOpen = () => {
    setOpen(!open);
    if (open) {
      setEditRegis(null);
      setFormData({ Id_Kategori_Paket: "", Id_Paket: "", Harga: "", Booking_At: "", Id_Pasien_MCU: "", Checkin_At: null, Status: null, Pendaftaran: null, No_MR: "" });
      setFormError({ Id_Kategori_Paket: "", Id_Paket: "", Harga: "", Booking_At: "", Id_Pasien_MCU: "", No_MR: "" });
    }
  };

  const handleOpen2 = () => {
    setOpen2(!open2);
    if (open2) {
      setCustomActionError("");
    }
  };

  const handleCustomActionChange = (tindakanId, isChecked) => {
    setSelectedCustomActions(prev => ({
      ...prev,
      [tindakanId]: isChecked
    }));
    setCustomActionError("");
  };

  const handleEdit = async (row) => {
    if (row) {
      setEditRegis(row.Id);
      const response = await getlisttindakancustom(row.Id);
      setSelectedRow(response.data);
      setFormData({ Id_Kategori_Paket: row.Id_Kategori_Paket, Id_Paket: row.Id_Paket, Harga: row.Harga_Basic, Booking_At: format(new Date(row.Booking_At), "yyyy-MM-dd",), Pendaftaran: row.PENDAFTARAN, Id_Pasien_MCU: row.Id, Status: row.Status_MCU, Checkin_At: row?.Checkin_At || null, No_MR: "" });

    }
    setOpen(!open);
  };

  const handleKategoriChange = (value) => {
    setFormData((prev) => ({ ...prev, Id_Kategori_Paket: value, Id_Paket: null, Harga: "" }));
    setFormError(prev => ({ ...prev, Id_Kategori_Paket: "" }));
  };

  const handlePaketChange = (value) => {
    setFormData((prev) => {
      const selectedPaket = paketList.find(paket => paket.Id === value);
      return {
        ...prev,
        Id_Paket: value,
        Harga: selectedPaket ? selectedPaket.Harga : null
      };
    });
    setFormError(prev => ({ ...prev, Id_Paket: "" }));
  };

  const loadPasienRegis = useCallback(async (inputValue, callback) => {
    try {
      const response = await getRegisterPasien(1, 20, inputValue);
      if (response.status === 200) {
        const options = response.data.map((pasien) => ({
          label: `${pasien.No_MR} | ${pasien.Nama_Pasien}`,
          value: pasien.No_MR,
          Tgl_Lahir: pasien?.Tgl_Lahir,
          Alamat: pasien?.Alamat
        }));
        callback(options);
      } else {
        callback([]);
      }
    } catch (error) {
      console.error("Error fetching patient registration data", error);
      callback([]);
    }
  }, []);

  const handlePasienRegis = (selected) => {
    setPasienRegis(selected);
    setFormData(prev => ({ ...prev, No_MR: selected ? selected.value : null }));
    setFormError(prev => ({ ...prev, No_MR: "" }));
  };

  const validateForm = () => {
    let isValid = true;
    const newErrors = { Id_Kategori_Paket: "", Id_Paket: "", Harga: "", Booking_At: "", Id_Pasien_MCU: "" };

    if (!formData.Booking_At) {
      newErrors.Booking_At = "Wajib diisi";
      isValid = false;
    }

    if (!formData.Id_Kategori_Paket) {
      newErrors.Id_Kategori_Paket = "Pilihan MCU wajib diisi";
      isValid = false;
    }

    if (!formData.Id_Paket && formData.Id_Kategori_Paket != "999") {
      newErrors.Id_Paket = "Paket wajib diisi";
      isValid = false;
    }

    if (formData.Id_Kategori_Paket == "999") {
      const selectedActions = Object.values(selectedCustomActions).filter(Boolean).length;
      const selectedRowActions = selectedRow && selectedRow[0]?.MASTER_PAKET_TINDAKANs.reduce((total, paket) => total + paket.Tindakans.length, 0);

      if (selectedActions == 0 && !selectedRowActions) {
        setCustomActionError("Pilih minimal satu tindakan");
        isValid = false;
      } else {
        setCustomActionError("");
      }
    } else {
      setCustomActionError("");
    }

    setFormError(newErrors);
    return isValid;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    if (formData.Id_Kategori_Paket == "999") {
      formData.Id_Paket = null;
      const allSelectedTindakan = new Set();

      if (selectedRow && selectedRow[0]?.MASTER_PAKET_TINDAKANs) {
        selectedRow[0].MASTER_PAKET_TINDAKANs.forEach(paketTindakan => {
          paketTindakan.Tindakans.forEach(tindakan => {
            if (selectedCustomActions[tindakan.Id_Tindakan] != false) {
              allSelectedTindakan.add(tindakan.Id_Tindakan);
            }
          });
        });
      }

      Object.entries(selectedCustomActions).forEach(([tindakanId, isChecked]) => {
        if (isChecked) {
          allSelectedTindakan.add(tindakanId);
        }
      });

      formData.Id_Tindakan = Array.from(allSelectedTindakan)
    }

    try {
      let response;

      response = editRegis ? await updateStatusMCU(formData) : await bookingMCUOnline(formData);

      if (response.status === 200 || response.status === 201) {
        if (onRefresh) {
          onRefresh();
        }
        handleOpen();
        Swal.fire('Success', 'Berhasil Edit Data', 'success');
      } else {
        handleOpen();
        Swal.fire('Error', `Gagal Edit Data, ${response.message}`, 'error');
      }
    } catch (error) {
      handleOpen();
      Swal.fire('Error', 'An error occurred while updating data', 'error');
    }
  };

  const fetchpackageCategories = async () => {
    try {
      const response = await getKategoriPaket();
      if (response.status == 200) {
        setPackageCategories([...response.data, { Id: "999", Nama_Kategori_Paket: "Non Paket" }]);
      } else {
        setError("Failed to fetch data");
      }
    } catch (error) {
      setError("An error occurred while fetching data");
    } finally {
      setLoading(false);
    }
  };

  const fetchKategoriDetail = async () => {
    setLoading(true);
    try {
      const response = await getGroupTindakanDetail();
      if (response.status == 200) {
        setGroupDetail(response.data);
      } else {
        setError("Failed to fetch data");
        Swal.fire('Error', 'Failed to fetch data', 'error');
      }
    } catch (error) {
      setError("An error occurred while fetching data");
      Swal.fire('Error', 'An error occurred while fetching data', 'error');
    } finally {
      setLoading(false);
    }
  };

  const fetchPaketByKategori = async (Id_Kategori_Paket) => {
    setPaketList(null);
    try {
      const response = await getPaketbyKategori(Id_Kategori_Paket);
      if (response.status == 200) {
        setPaketList(response.data);
      } else {
        setError("Failed to fetch paket data");
      }
    } catch (error) {
      setError("An error occurred while fetching paket data");
    }
  };

  useEffect(() => {
    const initializeComponent = async () => {
      fetchKategoriDetail();
      fetchpackageCategories();
    };

    initializeComponent();
  }, []);

  const handleViewProcedures = async (Id_paket) => {
    try {
      const response = await getlisttindakanpaket(Id_paket, editRegis)
      setProcedureView(response.data)
      setIsModalView(true)
    } catch (error) {
      console.error("Error fetching procedure details:", error)
    }
  }

  const formatPrice = (price) => {
    return new Intl.NumberFormat("id-ID").format(price)
  }

  useEffect(() => {
    if (formData.Id_Kategori_Paket) {
      if (formData.Id_Kategori_Paket == "999") {
        setShowCustomButton(true);
        setPaketList(null);
      } else {
        setShowCustomButton(false);
        fetchPaketByKategori(formData.Id_Kategori_Paket);
      }
    }
  }, [formData.Id_Kategori_Paket]);

  useEffect(() => {
    if (selectedRow && selectedRow[0]?.MASTER_PAKET_TINDAKANs) {
      const initialSelectedActions = {};
      selectedRow[0].MASTER_PAKET_TINDAKANs.forEach(paketTindakan => {
        paketTindakan.Tindakans.forEach(tindakan => {
          initialSelectedActions[tindakan.Id_Tindakan] = true;
        });
      });
      setSelectedCustomActions(initialSelectedActions);
    }
  }, [selectedRow]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
      </div>
    );
  }

  return (
    <>
      {activeTab == 'online' &&
        <div className="flex flex-col justify-between md:flex-row md:items-center px-4 pb-4">
          <div>
            <Button
              onClick={handleOpen}
              variant="gradient">
              Booking MCU
            </Button>
          </div>
        </div>
      }

      <div className="overflow-x-auto">
        <table className="w-full min-w-max table-auto text-left">
          <thead>
            <tr>
              {TABLE_HEAD.map((head) => (
                <th key={head} className="border-b border-blue-gray-100 bg-blue-gray-50/50 p-4">
                  <Typography variant="small" color="blue-gray" className="font-semibold leading-none opacity-70">
                    {head}
                  </Typography>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.map((row, index) => {
              const isLast = index === data.length - 1;
              const classes = isLast ? "p-4" : "p-4 border-b border-blue-gray-50";

              return (
                <tr key={row.Id} className="hover:bg-blue-gray-50/50 transition-colors duration-200">
                  <td className={classes}>
                    <Typography variant="small" color="blue-gray" className="font-normal">
                      {index + 1}
                    </Typography>
                  </td>
                  <td className={classes}>
                    <Typography variant="small" color="blue-gray" className="font-medium">
                      {row.Nama_Pasien}
                    </Typography>
                    <Typography variant="small" color="blue-gray" className="text-xs">
                      MR = {row.No_MR}
                    </Typography>
                  </td>
                  {activeTab == 'comp' &&
                    <td className={classes}>
                      <p className="text-sm">
                        {row.Nama_Comp}
                      </p>
                    </td>
                  }
                  <td className={classes}>
                    <div className="flex flex-col gap-2">
                      {row.HP1 && (
                        <div className="flex items-center justify-between gap-2 p-1.5 rounded-lg bg-gray-50">
                          <span className="select-all text-sm text-gray-600">{row.HP1}</span>
                          <ContactOptions number={row.HP1} row={row} />
                        </div>
                      )}
                      {row.HP2 && (
                        <div className="flex items-center justify-between gap-2 p-1.5 rounded-lg bg-gray-50">
                          <span className="select-all text-sm text-gray-600">{row.HP2}</span>
                          <ContactOptions number={row.HP2} row={row} />
                        </div>
                      )}
                      {row.Telp && (
                        <div className="flex items-center justify-between gap-2 p-1.5 rounded-lg bg-gray-50">
                          <span className="select-all text-sm text-gray-600">{row.Telp}</span>
                          <ContactOptions number={row.Telp} row={row} />
                        </div>
                      )}
                    </div>
                  </td>
                  <td className={classes}>
                    <Typography variant="small" color="blue-gray">
                      {row.Nama_Kategori_Paket}
                    </Typography>
                    <Typography variant="small" color="blue-gray" className="text-sm">
                      ({row.Nama_Paket})
                    </Typography>
                    <Typography variant="small" color={(row.Harga == '0' || row.Harga == null) ? 'red' : 'blue-gray'} className="text-xs">
                      {(row.Harga == '0' || row.Harga == null) ? 'Harga belum ditentukan' : row.Harga}
                    </Typography>
                  </td>
                  <td className={classes}>
                    <Typography variant="small" color="blue-gray" className="font-normal">
                      {formatDate(row.Booking_At)}
                    </Typography>
                  </td>
                  <td className={classes}>
                    <div className="flex items-center gap-2">
                      <div className={`${row.Status_MCU_Detail === 'Selesai'
                        ? 'text-green-500'
                        : row.Status_MCU_Detail === 'Belum Checkin'
                          ? 'text-orange-500'
                          : row.Status_MCU_Detail === 'Batal MCU'
                            ? 'text-red-500'
                            : row.Status_MCU_Detail === 'Konfirmasi hadir'
                              ? 'text-green-300'
                              : row.Status_MCU_Detail === 'Belum dikonfirmasi'
                                ? 'text-black'
                                : row.Status_MCU_Detail === 'Di Antrian'
                                  ? 'text-blue-500'
                                  : ''
                        }`}>
                        <Typography variant="small" className="font-medium">
                          {row.Status_MCU_Detail}
                        </Typography>
                      </div>
                    </div>
                  </td>
                  <td className={classes}>
                    <>

                      <Button
                        onClick={() => handleEdit(row)} variant="outlined" className="rounded-full"
                      >
                        Update
                      </Button>
                    </>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
        {pagination && (
          <div className="flex items-center justify-between border-t border-blue-gray-50 p-4 mt-4">
            <Button
              variant="outlined"
              size="sm"
              onClick={() => onPageChange(pagination.page - 1)}
              disabled={!pagination.links.prev}
            >
              Previous
            </Button>
            <div className="flex items-center gap-2">
              {getPageNumbers(pagination.page, pagination.totalPages).map((page, index, array) => {
                if (index > 0 && page - array[index - 1] > 1) {
                  return (
                    <React.Fragment key={`ellipsis-${page}`}>
                      <span className="px-2">...</span>
                      <IconButton
                        variant={pagination.page === page ? "filled" : "outlined"}
                        size="sm"
                        onClick={() => onPageChange(page)}
                      >
                        {page}
                      </IconButton>
                    </React.Fragment>
                  );
                }
                return (
                  <IconButton
                    key={page}
                    variant={pagination.page === page ? "filled" : "outlined"}
                    size="sm"
                    onClick={() => onPageChange(page)}
                  >
                    {page}
                  </IconButton>
                );
              })}
            </div>
            <Button
              variant="outlined"
              size="sm"
              onClick={() => onPageChange(pagination.page + 1)}
              disabled={!pagination.links.next}
            >
              Next
            </Button>
          </div>
        )}

        <ModalForm
          open={open}
          handleOpen={handleOpen}
          onSubmit={handleSubmit}
          title={"Booking MCU"}
          description={"Konfirmasi Kehadiran MCU"}
        >

          {!editRegis &&
            <div>
              <label className="text-sm text-gray-900">Nama Pasien <span className='text-red-500'>*</span></label>
              <AsyncSelect
                className='py-0.5'
                cacheOptions
                loadOptions={loadPasienRegis}
                defaultOptions
                onChange={handlePasienRegis}
                placeholder="Cari Nama/MR/NIK..."
                isClearable
                value={selectedPasienRegis}
                styles={{
                  control: (provided, state) => ({
                    ...provided,
                    borderColor: formError.No_MR ? 'red' : provided.borderColor,
                    '&:hover': {
                      borderColor: formError.No_MR ? 'red' : provided.borderColor,
                    },
                  }),
                }}
                isDisabled={editRegis ? true : false}
              />
              {formError.No_MR && (
                <Typography color="red" className="text-sm mt-2">
                  {formError.No_MR}
                </Typography>
              )}
            </div>
          }

          {selectedPasienRegis?.Tgl_Lahir && (
            <div>
              <label className="text-sm text-gray-900">Tanggal Lahir</label>
              <Input
                value={selectedPasienRegis ? format(new Date(selectedPasienRegis.Tgl_Lahir), 'dd MMMM yyyy') : ''}
                disabled={true}
              />
            </div>
          )}

          {selectedPasienRegis?.Alamat && (
            <div className="mb-2">
              <div>
                <label className="text-sm text-gray-900">Alamat</label>
                <Textarea
                  value={selectedPasienRegis?.Alamat ?? ""}
                  disabled={true}
                />
              </div>
            </div>
          )}

          <div>
            <label className="text-sm text-gray-900">Pilihan MCU <span className='text-red-500'>*</span></label>
            <Select
              name="Id_Kategori_Paket"
              value={formData.Id_Kategori_Paket}
              error={formError.Id_Kategori_Paket}
              onChange={handleKategoriChange}
              disabled={formData.Checkin_At ? true : false}
            >
              {packageCategories.map((category) => (
                <Option key={category.Id} value={category.Id}>
                  {category.Nama_Kategori_Paket}
                </Option>
              ))}
            </Select>
          </div>

          {paketList && formData.Id_Kategori_Paket != "999" && (
            <div>
              <label className="text-sm text-gray-900">Paket MCU <span className='text-red-500'>*</span></label>
              <Select
                name="Id_Paket"
                value={formData.Id_Paket}
                onChange={handlePaketChange}
                error={formError.Id_Paket}
                disabled={(!formData.Id_Kategori_Paket || formData.Checkin_At != null) ? true : false}
              >
                {paketList.map((paket) => (
                  <Option key={paket.Id} value={paket.Id}>
                    {paket.Nama_Paket}
                  </Option>
                ))}
              </Select>
              {formData.Id_Paket &&
                <div>
                  <p
                    className="text-xs md:text-sm text-blue-300 underline hover:text-blue-500 cursor-pointer"
                    onClick={() => handleViewProcedures(formData.Id_Paket)}
                  >
                    Daftar Tindakan
                  </p>
                </div>
              }
            </div>
          )}

          {showCustomButton && (
            <div>
              <label className="text-sm text-gray-900">Pilih Tindakan <span className='text-red-500'>*</span></label>
              <button
                type="button"
                onClick={handleOpen2}
                className="relative flex items-center justify-center w-full bg-white hover:bg-gray-100 text-black py-2 rounded-xl transition-all duration-300 transform active:translate-y-0 disabled:opacity-50 disabled:cursor-not-allowed border border-gray-400"
              >
                <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-10 rounded-xl transition-opacity duration-300"></div>
                <div className="flex items-center justify-center gap-2">
                  <ListPlus className="h-5 w-5" />
                  <span>Pilih Tindakan</span>
                </div>
              </button>
            </div>
          )}

          {customActionError && (
            <p className="text-red-500 text-sm">{customActionError}</p>
          )}

          <div>
            <label className="text-sm text-gray-900">Tanggal Pemeriksaan <span className='text-red-500'>*</span></label>
            <Input
              type="date"
              name="Booking_At"
              value={formData.Booking_At ?? ""}
              onChange={(e) => {
                const selectedDate = new Date(e.target.value);
                if (selectedDate.getDay() === 0) {
                  setFormError(prev => ({ ...prev, Booking_At: "Hari Minggu Libur, Silakan pilih hari lain." }));
                  setFormData((prev) => ({ ...prev, Booking_At: "" }));
                } else {
                  handleInputChange(e);
                }
              }}
              min={format(addDays(new Date(), 0), "yyyy-MM-dd")}
              error={formError.Booking_At}
              disabled={formData.Pendaftaran}
            />
          </div>

          {activeTab != 'comp' &&
            <div>
              <label className="text-sm text-gray-900">Tarif</label>
              <Input
                type="string"
                name="Harga"
                value={formData.Harga ? formatPrice(formData.Harga) : ""}
                onChange={handleInputChange}
                error={formError.Harga}
              />
              {showCustomButton && (
                <label className="text-xs text-blue-500">Jangan lupa update harga untuk non-paket</label>
              )}
            </div>
          }

          {!formData.Pendaftaran && (
            <div>
              <div>
                <label className="text-sm text-gray-900">Status Kehadiran {activeTab}</label>
              </div>
              <div>
                <Radio name="Status" label="Hadir" value={activeTab === 'comp' ? 'P' : '7'} onChange={handleInputChange} checked={formData.Status === (activeTab === 'comp' ? 'P' : '7')} />
                <Radio name="Status" label="Batal" value="9" onChange={handleInputChange} checked={formData.Status === "9"} />
              </div>
            </div>
          )}

          <div className="h-8" />
        </ModalForm>

        <ModalForm
          size='lg'
          open={open2}
          handleOpen={handleOpen2}
          title="Pilih Tindakan"
          footer={false}
          footerClose={true}
        >
          <div className="max-h-[60vh] w-full overflow-y-auto">
            <div className="mb-4 px-8">
              <p>Cari Tindakan</p>
              <Input
                type="text"
                placeholder="Cari Nama Tindakan..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="border rounded-md p-2"
              />
            </div>

            {groupDetail.map((bundle) => {
              const filteredTindakan = bundle.MASTER_TINDAKAN_MCUs.filter((tindakan) =>
                tindakan.Nama_Tindakan.toLowerCase().includes(searchQuery.toLowerCase())
              );

              if (filteredTindakan.length === 0) return null;

              return (
                <Accordion
                  key={bundle.Id}
                  open={openAccordion === bundle.Id}
                  className="mb-2 rounded-lg border border-blue-gray-100 px-4"
                >
                  <AccordionHeader
                    onClick={() => handleAccordionOpen(bundle.Id)}
                    className="text-sm font-semibold border-b-0 transition-colors"
                  >
                    <div className="flex items-center justify-between w-full">
                      {bundle.Nama_Bundle}
                      <ChevronDown
                        className={`h-4 w-4 transition-transform ${openAccordion === bundle.Id ? "rotate-180" : ""}`}
                      />
                    </div>
                  </AccordionHeader>
                  <AccordionBody className="p-0">
                    <ul className="text-sm border-t-2">
                      {filteredTindakan.map((tindakan) => {
                        const isChecked = selectedCustomActions[tindakan.Id] || false;
                        return (
                          <li key={tindakan.Id} className="flex items-center space-x-2">
                            <Checkbox
                              id={`tindakan-${tindakan.Id}`}
                              checked={isChecked}
                              onChange={(e) => handleCustomActionChange(tindakan.Id, e.target.checked)}
                            />
                            <label htmlFor={`tindakan-${tindakan.Id}`} className="cursor-pointer">
                              {tindakan.Nama_Tindakan}
                            </label>
                          </li>
                        );
                      })}
                    </ul>
                  </AccordionBody>
                </Accordion>
              );
            })}
          </div>
        </ModalForm>

        <Dialog
          open={isModalView}
          handler={() => setIsModalView(false)}
          className="bg-white rounded-2xl shadow-xl mx-auto"
          animate={{
            mount: { scale: 1, y: 0 },
            unmount: { scale: 0.9, y: -100 },
          }}
          size="lg"
        >
          <DialogHeader className="relative border-b p-5 bg-gradient-to-r from-blue-50 to-blue-200 flex">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-500 rounded-xl text-white">
                <Activity className="w-6 h-6" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-900">Detail Tindakan</h2>
              </div>
            </div>
            <button
              onClick={() => setIsModalView(false)}
              className="p-2 rounded-lg hover:bg-blue-100 transition-colors duration-200 ml-auto"
            >
              <X className="w-6 h-6 text-red-500 hover:text-red-300" />
            </button>
          </DialogHeader>

          <DialogBody className="p-4 max-h-[70vh] overflow-y-auto">
            <div className="space-y-3">
              {procedureView?.[0]?.MASTER_PAKET_TINDAKANs
                ?.filter(group => group.Tindakans.some(tindakan => tindakan.status != 'cancel'))
                .map((group) => (
                  <div
                    key={group.Group_Tindakan.Id}
                    className="bg-white border rounded-xl p-4 shadow-sm hover:shadow-md transition-shadow duration-200"
                  >
                    <div className="flex items-center gap-3 mb-2">
                      <div className="p-2 bg-blue-50 text-blue-600 rounded-lg">
                        {getIconForBundle(group.Group_Tindakan.Nama_Bundle)}
                      </div>
                      <h3 className="text-lg font-semibold text-gray-900">{group.Group_Tindakan.Nama_Bundle}</h3>
                    </div>

                    <div>
                      {group.Tindakans
                        .filter(tindakan => tindakan.status != 'cancel')
                        .map((tindakan) => (
                          <div
                            key={tindakan.Id_Tindakan}
                            className="flex items-center gap-3 text-gray-600 hover:bg-gray-50 px-2 py-1 rounded-lg transition-colors duration-200"
                          >
                            <div className="h-2 w-2 rounded-full bg-blue-400" />
                            <span className="text-[14px]">{tindakan.Nama_Tindakan}</span>
                          </div>
                        ))}
                    </div>

                  </div>
                ))}
            </div>
          </DialogBody>
        </Dialog>
      </div>
    </>
  );
};

export default DataTableMarketing;

