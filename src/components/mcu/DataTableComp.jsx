import Swal from "sweetalert2"
import { Input } from "../Form/Input"
import { Select } from "../Form/Select"
import { ModalForm } from "../ModalForm"
import AsyncSelect from "react-select/async";
import { CompListModal } from "./CompListModal"
import React, { useCallback, useEffect, useState } from "react"
import { format, addDays } from "date-fns"
import { Phone, MessageSquare, ListPlus, ChevronDown, ChevronRight, Trash, PlusCircle, Stethoscope, FlaskConical, HeartPulse, Activity, Syringe, Microscope, X } from "lucide-react"
import { Typography, IconButton, Tooltip, Button, Radio, Option, Checkbox, Dialog, DialogHeader, DialogBody } from "@material-tailwind/react"
import { getGroupTindakanDetail, getKategoriPaket, getlisttindakancustomcomp, getPaketbyKategori, updateStatusMCUComp, importExcelMCUComp, confirmMCUComp, finishMCUComp, bookingMCUComp, autoFinishMCUComp, CreateNewMCUComp, getlisttindakanpaket } from "../../service/apiMCU"
import { getAkunCompany } from "../../service/api"

const apiUrl = import.meta.env.VITE_IMAGE
const DETAIL_TABLE_HEAD = ["No.", "Jenis MCU", "Paket", "Tarif", "Tgl MCU", "Jumlah Peserta", "File", "Status", "Actions"]
const TABLE_HEAD = ["Detail", "No.", "Nama Pasien", "Kontak", "Biaya MCU", "Tgl Pengajuan", "Status MCU", "Actions"]

const ContactOptions = ({ number }) => {
  const formattedNumber = (() => {
    const digits = number.replace(/\D/g, "")
    if (digits.startsWith("0")) {
      return "62" + digits.slice(1)
    }
    if (!digits.startsWith("62")) {
      return "62" + digits
    }
    return digits
  })()

  const whatsappUrl = `https://api.whatsapp.com/send/?phone=${formattedNumber}&text&type=phone_number&app_absent=0`

  return (
    <div className="flex gap-1">
      <Tooltip content="WhatsApp">
        <IconButton
          variant="text"
          size="sm"
          className="rounded-full bg-green-50 text-green-500 hover:bg-green-100"
          onClick={() => window.open(whatsappUrl, "_blank")}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M3 21l1.65-3.8a9 9 0 1 1 3.4 2.9L3 21" />
            <path d="M9 10a.5.5 0 0 0 1 0V9a.5.5 0 0 0-1 0v1a5 5 0 0 0 5 5h1a.5.5 0 0 0 0-1h-1a.5.5 0 0 0 0 1" />
          </svg>
        </IconButton>
      </Tooltip>
      <Tooltip content="SMS">
        <IconButton
          variant="text"
          size="sm"
          className="rounded-full bg-blue-50 text-blue-500 hover:bg-blue-100"
          onClick={() => window.open(`sms:${formattedNumber}`, "_blank")}
        >
          <MessageSquare className="h-3 w-3" />
        </IconButton>
      </Tooltip>
      <Tooltip content="Telepon">
        <IconButton
          variant="text"
          size="sm"
          className="rounded-full bg-purple-50 text-purple-500 hover:bg-purple-100"
          onClick={() => window.open(`tel:${formattedNumber}`, "_blank")}
        >
          <Phone className="h-3 w-3" />
        </IconButton>
      </Tooltip>
    </div>
  )
}

const formatDate = (dateString) => {
  const date = new Date(dateString)
  return new Intl.DateTimeFormat("id-ID", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(date)
}

const getPageNumbers = (currentPage, totalPages) => {
  const delta = 1
  const pages = []

  for (let i = 1; i <= totalPages; i++) {
    if (i === 1 || i === totalPages || (i >= currentPage - delta && i <= currentPage + delta)) {
      pages.push(i)
    }
  }
  return pages
}

const getStatusText = (status) => {
  switch (status) {
    case "1":
      return "Menunggu persetujuan"
    case "2":
      return "Disetujui"
    case "3":
      return "Proses"
    case "4":
      return "Disetujui dan Sudah import data"
    case "8":
      return "Selesai"
    case "9":
      return "Batal"
    default:
      return "-"
  }
}

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

const DataTableComp = ({ data, pagination, onPageChange, onRefresh }) => {
  const [open, setOpen] = useState(false)
  const [open2, setOpen2] = useState(false)
  const [openCustom2, setOpenCustom2] = useState(false)
  const [openNew, setOpenNew] = useState(false);
  const [loading, setLoading] = useState(true)
  const [editRegis, setEditRegis] = useState(null)
  const [paketList, setPaketList] = useState(null)
  const [groupDetail, setGroupDetail] = useState([])
  const [selectedRow, setSelectedRow] = useState(null)
  const [expandedRows, setExpandedRows] = useState([])
  const [selectedCompRegis, setCompRegis] = useState(null)
  const [customActionError, setCustomActionError] = useState("")
  const [packageCategories, setPackageCategories] = useState([])
  const [showCustomButton, setShowCustomButton] = useState(false)
  const [selectedCustomActions, setSelectedCustomActions] = useState({})
  const [formData, setFormData] = useState({ Id_Kategori_Paket: null, Id_Paket: null, Harga: null, Booking_At: null, Id_MCU_Comp: null, Jml_Peserta: null, File_Peserta: null, Id_Parent: null })
  const [formDataNew, setFormDataNew] = useState({ Id_Comp_From_Admin: null })
  const [formError2, setFormError2] = useState({ Id_Comp_From_Admin: "" })
  const [formError, setFormError] = useState({ Id_Kategori_Paket: "", Id_Paket: "", Harga: "", Booking_At: "", Id_MCU_Comp: "", Jml_Peserta: "", File_Peserta: "", Id_Parent: "" })
  const [openPatientList, setOpenPatientList] = useState(false)
  const [selectedPatients, setSelectedPatients] = useState([])
  const [currentEditIndex, setCurrentEditIndex] = useState(null)
  const [isModalView, setIsModalView] = useState(false);
  const [procedureView, setProcedureView] = useState(null);

  const [paketLists, setPaketLists] = useState({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [packageCategoriesNew, setPackageCategoriesNew] = useState([])

  const [entriesNew, setEntriesNew] = useState([
    {
      Id_Paket: "",
      Id_Kategori_Paket: "",
      Jml_Peserta: "",
      Booking_At: "",
      Id_Tindakan: [],
      Harga: 0,
      selectedCustomActions: {},
    },
  ])

  const [formErrorNew, setFormErrorNew] = useState({
    Booking_At: "",
    Id_Kategori_Paket: "",
    Id_Paket: "",
  });

  const handleAddEntry = () => {
    setEntriesNew([
      ...entriesNew,
      {
        Id_Paket: "",
        Id_Kategori_Paket: "",
        Jml_Peserta: "",
        Booking_At: "",
        Id_Tindakan: [],
        Harga: "",
        selectedCustomActions: {},
      },
    ])
  }

  const handleEntryChange = (index, field, value) => {
    const newEntries = [...entriesNew]
    newEntries[index] = { ...newEntries[index], [field]: value }

    setFormErrorNew((prevErrors) => ({
      ...prevErrors,
      [index]: {
        ...prevErrors[index],
        [field]: "",
      },
    }));

    if (field === "Id_Kategori_Paket") {
      newEntries[index].Id_Paket = ""
      newEntries[index].Id_Tindakan = []
      newEntries[index].selectedCustomActions = {}

      fetchPaketByKategoriNew(value, index)
    }

    if (newEntries[index].Id_Kategori_Paket == "999") {
      newEntries[index].Harga = 0 // Set Harga to empty for custom package
    }

    if (field === "Id_Paket" || field === "Jml_Peserta") {

      const selectedPaket = paketLists[index]?.find((paket) => paket.Id === newEntries[index].Id_Paket)
      if (selectedPaket && newEntries[index].Jml_Peserta) {
        newEntries[index].Harga = selectedPaket.Harga * newEntries[index].Jml_Peserta
      } else {
        newEntries[index].Harga = 0
      }
    }

    setEntriesNew(newEntries)
  }

  const handleRemoveEntry = (index) => {
    setEntriesNew(entriesNew.filter((_, i) => i !== index))
  }

  const handleInputChange = (e) => {
    const { name, value, files } = e.target

    if (name === "Harga") {
      const numericValue = Number.parseInt(value.replace(/\D/g, ""), 10)
      setFormData((prev) => ({
        ...prev,
        [name]: isNaN(numericValue) ? "" : numericValue,
      }))
    } else {
      setFormData((prev) => {
        const newData = { ...prev, [name]: files ? files[0] : value }

        if (name === "Jml_Peserta" && prev.Id_Paket) {
          const selectedPaket = paketList.find((paket) => paket.Id === prev.Id_Paket)
          if (selectedPaket) {
            newData.Harga = value * selectedPaket.Harga
          }
        }

        return newData
      })
    }
    setFormError((prev) => ({ ...prev, [name]: "" }))
  }

  const toggleRow = (rowId) => {
    setExpandedRows((prev) => (prev.includes(rowId) ? prev.filter((id) => id !== rowId) : [...prev, rowId]))
  }

  const handleOpenPeserta = (row) => {
    setSelectedPatients(row.PASIEN_MCU || [])
    setOpenPatientList(true)
  }

  const handleOpen = () => {
    setOpen(!open)
    if (open) {
      setEditRegis(null)
      setFormData({ Id_Kategori_Paket: "", Id_Paket: "", Harga: "", Booking_At: "", Id_MCU_Comp: "", Jml_Peserta: "", File_Peserta: "", Status: null, Id_Parent: "" })
      setFormError({ Id_Kategori_Paket: "", Id_Paket: "", Harga: "", Booking_At: "", Id_MCU_Comp: "", Jml_Peserta: "", File_Peserta: "", Id_Parent: "" })
    }
  }

  const handleOpen2 = () => {
    setOpen2(!open2)
    if (open2) {
      setCustomActionError("")
    }
  }

  const handleOpenNew = () => {
    setOpenNew(!openNew);

    if (openNew) {
      setCompRegis(null)
      setFormDataNew({ Id_Comp_From_Admin: "" })
      setCustomActionError("");
      setFormError2({ Id_Comp_From_Admin: "" })
      setEntriesNew([{
        Id_Paket: "",
        Id_Kategori_Paket: "",
        Jml_Peserta: "",
        Booking_At: "",
        Id_Tindakan: [],
        Harga: 0,
        selectedCustomActions: {},
      }])
      setFormErrorNew({
        Booking_At: "",
        Id_Kategori_Paket: "",
        Id_Paket: "",
      });
    }
  };

  const handleCustomActionChange = (tindakanId, isChecked) => {
    setSelectedCustomActions((prev) => ({
      ...prev,
      [tindakanId]: isChecked,
    }))
    setCustomActionError("")
  }

  const handleCustomActionChangeNew = (index, tindakanId, isChecked) => {
    const newEntries = [...entriesNew]
    newEntries[index].selectedCustomActions = {
      ...newEntries[index].selectedCustomActions,
      [tindakanId]: isChecked,
    }

    const selectedTindakan = Object.entries(newEntries[index].selectedCustomActions)
      .filter(([_, checked]) => checked)
      .map(([id]) => id)

    newEntries[index].Id_Tindakan = selectedTindakan
    setEntriesNew(newEntries)

    setFormErrorNew((prevErrors) => ({
      ...prevErrors,
      [index]: {
        ...prevErrors[index],
        Id_Tindakan: selectedTindakan.length > 0 ? "" : prevErrors[index].Id_Tindakan,
      },
    }));
  }

  const handleAutoFinishComp = async (detail, row) => {
    try {
      const result = await Swal.fire({
        title: 'Konfirmasi',
        text: `Anda akan menyelesaikan MCU ${row.Nama_Comp}`,
        icon: 'question',
        showCancelButton: true,
        confirmButtonText: 'Setuju',
        cancelButtonText: 'Kembali'
      });

      if (result.isConfirmed) {
        const dataSubmit = {
          Id_MCU_Comp: detail.Id,
        };

        let response = await autoFinishMCUComp(dataSubmit);

        if (response.status == 200) {
          if (onRefresh) {
            onRefresh();
          }
          Swal.fire('Success', `Berhasil menyelesaikan proses MCU`, 'success');
        } else {
          Swal.fire('Error', `Gagal memproses MCU, ${response.message}`, 'error');
        }
      }
    } catch (error) {
      console.error('Error:', error);
      Swal.fire('Error', 'Terjadi kesalahan', 'error');
    }
  };

  const handleEdit = async (row) => {
    const hasInProcessOrApproved = row.MCU_COMPANY_DETAIL.some(detail =>
      detail.Status == "3" || detail.Status == "4" || detail.Status == "8"
    );

    if (hasInProcessOrApproved) {
      Swal.fire('Peringatan', `MCU ${row.Nama_Comp} sudah dalam proses, tidak dapat dibatalkan keseluruhan`, 'warning');
      return;
    }

    try {
      const result = await Swal.fire({
        title: 'Konfirmasi',
        text: `Pilih tindakan untuk MCU dari ${row.Nama_Comp}`,
        icon: 'question',
        showCancelButton: true,
        showDenyButton: true,
        confirmButtonText: 'Setuju',
        denyButtonText: 'Batal',
        cancelButtonText: 'Kembali'
      });

      if (result.isConfirmed || result.isDenied) {
        const status = result.isConfirmed ? 2 : 9;
        const dataSubmit = {
          Id: row.Id,
          Status: status
        };

        let response = await confirmMCUComp(dataSubmit);

        if (response.status === 200) {
          if (onRefresh) {
            onRefresh();
          }
          Swal.fire('Success', `Berhasil ${result.isConfirmed ? 'menyetujui' : 'membatalkan'} MCU`, 'success');
        } else {
          Swal.fire('Error', `Gagal memproses MCU, ${response.message}`, 'error');
        }
      }
    } catch (error) {
      console.error('Error:', error);
      Swal.fire('Error', 'Terjadi kesalahan', 'error');
    }
  };

  const handleImportConfirmation = async (row) => {
    try {

      let submitData

      submitData = {
        Id: row.Id,
      }
      const response = await importExcelMCUComp(submitData)

      if (response.status === 200 || response.status === 201) {
        Swal.fire("Success", "Data peserta berhasil diimport", "success")
        if (onRefresh) {
          onRefresh()
        }
      } else {
        Swal.fire("Error", `Gagal import data peserta: ${response.message}`, "error")
      }
    } catch (error) {
      console.error("Error importing data:", error)
      Swal.fire("Error", "Terjadi kesalahan saat mengimport data peserta", "error")
    }
  }

  const handleEditSubData = async (row, parent) => {
    if (row) {
      setEditRegis(row.Id)
      const response = await getlisttindakancustomcomp(row.Id)
      setSelectedRow(response.data)
      setFormData({ Id_Kategori_Paket: row.Id_Kategori_Paket, Id_Paket: row.Id_Paket, Harga: row.Harga, Booking_At: row.Booking_At ? format(new Date(row.Booking_At), "yyyy-MM-dd") : '', Id_MCU_Comp: row.Id, Status: row.Status, StatusParent: parent.Status_MCU, Jml_Peserta: row.Jml_Peserta, File_Peserta: row.File_Peserta, PASIEN_MCU: row.PASIEN_MCU, Id_Parent: row.Id_MCU_Comp })
    }
    setOpen(!open)
  }

  const handleAddSubData = async (row) => {
    setSelectedRow(null)
    if (row) {
      setFormData({ Id_Kategori_Paket: '', Id_Paket: '', Harga: '', Booking_At: '', Id_MCU_Comp: '', Status: '', Jml_Peserta: '', File_Peserta: '', Id_Parent: row.Id })
    }
    setOpen(!open)
  }

  const handleKategoriChange = (value) => {
    setFormData((prev) => ({ ...prev, Id_Kategori_Paket: value, Id_Paket: null }))
    setFormError((prev) => ({ ...prev, Id_Kategori_Paket: "" }))
  }

  const handlePaketChange = (value) => {
    setFormData((prev) => {
      const selectedPaket = paketList.find((paket) => paket.Id === value)
      return {
        ...prev,
        Id_Paket: value,
        Harga: prev.Jml_Peserta * selectedPaket.Harga
      }
    })
    setFormError((prev) => ({ ...prev, Id_Paket: "" }))
  }

  const handleFileChange = (index, file) => {
    const newEntries = [...entriesNew]
    newEntries[index] = { ...newEntries[index], File: file }
    setEntriesNew(newEntries)
  }

  const validateForm = () => {
    let isValid = true
    const newErrors = { Id_Kategori_Paket: "", Id_Paket: "", Harga: "", Booking_At: "", Id_MCU_Comp: "", Jml_Peserta: "", File_Peserta: "", Id_Parent: "" }

    if (!formData.Booking_At) {
      newErrors.Booking_At = "Wajib diisi"
      isValid = false
    }

    if (!formData.Jml_Peserta) {
      newErrors.Jml_Peserta = "Wajib diisi"
      isValid = false
    }

    if (!formData.Id_Kategori_Paket) {
      newErrors.Id_Kategori_Paket = "Pilihan MCU wajib diisi"
      isValid = false
    }

    if (!formData.Id_Paket && formData.Id_Kategori_Paket != "999") {
      newErrors.Id_Paket = "Paket wajib diisi"
      isValid = false
    }

    if (formData.Id_Kategori_Paket == "999") {
      const selectedActions = Object.values(selectedCustomActions).filter(Boolean).length
      const selectedRowActions =
        selectedRow &&
        selectedRow[0]?.MASTER_PAKET_TINDAKANs.reduce((total, paket) => total + paket.Tindakans.length, 0)

      if (selectedActions == 0 && !selectedRowActions) {
        setCustomActionError("Pilih minimal satu tindakan")
        isValid = false
      } else {
        setCustomActionError("")
      }
    } else {
      setCustomActionError("")
    }

    setFormError(newErrors)
    return isValid
  }

  const validateFormNew = () => {
    let isValid = true;
    const newErrors = {};

    const newErrors2 = { Id_Comp_From_Admin: "" }

    if (!formDataNew.Id_Comp_From_Admin) {
      newErrors2.Id_Comp_From_Admin = "Wajib diisi"
      isValid = false
    }

    entriesNew.forEach((entryNew, index) => {
      newErrors[index] = {
        Booking_At: "",
        Id_Kategori_Paket: "",
        Id_Paket: "",
      };

      if (!entryNew.Booking_At) {
        newErrors[index].Booking_At = "Tanggal pemeriksaan wajib diisi";
        isValid = false;
      }

      if (!entryNew.Id_Kategori_Paket) {
        newErrors[index].Id_Kategori_Paket = "Pilih kategori paket";
        isValid = false;
      }

      if (!entryNew.Id_Paket && entryNew.Id_Kategori_Paket !== "999") {
        newErrors[index].Id_Paket = "Pilih paket yang tersedia";
        isValid = false;
      }

      if (entryNew.Id_Kategori_Paket === "999" && entryNew.Id_Tindakan.length === 0) {
        newErrors[index].Id_Tindakan = "Harap pilih minimal satu tindakan";
        isValid = false;
      }
    });

    setFormError2(newErrors2)
    setFormErrorNew(newErrors);
    return isValid;
  };

  const handleFinish = async (row) => {
    try {
      const result = await Swal.fire({
        title: 'Konfirmasi',
        text: `Apakah Anda yakin proses MCU sudah selesai?`,
        icon: 'question',
        showCancelButton: true,
        confirmButtonText: 'Ya',
        cancelButtonText: 'Tidak'
      });

      if (result.isConfirmed) {

        let response;

        const dataSubmit = {
          Id: row.Id,
          Status: 8
        };

        response = await finishMCUComp(dataSubmit);

        if (response.status === 200 || response.status === 201) {
          if (onRefresh) {
            onRefresh()
          }
          Swal.fire("Success", "Berhasil Edit Data", "success")
        } else {
          Swal.fire("Error", `Gagal Edit Data, ${response.message}`, "error")
        }
      }
    } catch (error) {
      Swal.fire("Error", "An error occurred while updating data", "error")
    }
  };

  const handleViewProcedures = async (Id_paket) => {
    try {
      const response = await getlisttindakanpaket(Id_paket)
      setProcedureView(response.data)
      setIsModalView(true)
    } catch (error) {
      console.error("Error fetching procedure details:", error)
    }
  }

  const handleSubmit = async () => {
    if (!validateForm()) return

    try {
      let response

      const submitData = new FormData()

      if (formData.Id_Kategori_Paket == "999") {
        const allSelectedTindakan = new Set()

        // Add previously selected tindakan that haven't been unchecked
        if (selectedRow && selectedRow[0]?.MASTER_PAKET_TINDAKANs) {
          selectedRow[0].MASTER_PAKET_TINDAKANs.forEach((paketTindakan) => {
            paketTindakan.Tindakans.forEach((tindakan) => {
              // Only include if it hasn't been explicitly unchecked
              if (selectedCustomActions[tindakan.Id_Tindakan] != false) {
                allSelectedTindakan.add(tindakan.Id_Tindakan)
              }
            })
          })
        }

        // Add newly selected tindakan
        Object.entries(selectedCustomActions).forEach(([tindakanId, isChecked]) => {
          if (isChecked) {
            allSelectedTindakan.add(tindakanId)
          }
        })

        submitData.append("Id_Tindakan", JSON.stringify(Array.from(allSelectedTindakan)))
        submitData.append("Harga", formData.Harga ?? "")
        submitData.append("Booking_At", formData.Booking_At ?? null)
        submitData.append("Id_MCU_Comp", formData.Id_MCU_Comp ?? null)
        submitData.append("Jml_Peserta", formData.Jml_Peserta ?? null)
        submitData.append("Status", formData.Status ?? null)
        submitData.append("Id_Parent", formData.Id_Parent ?? null)
      } else {
        submitData.append("Id_Kategori_Paket", formData.Id_Kategori_Paket ?? null)
        submitData.append("Id_Paket", formData.Id_Paket ?? null)
        submitData.append("Harga", formData.Harga ?? "")
        submitData.append("Status", formData.Status ?? null)
        submitData.append("Booking_At", formData.Booking_At ?? null)
        submitData.append("Id_MCU_Comp", formData.Id_MCU_Comp ?? null)
        submitData.append("Jml_Peserta", formData.Jml_Peserta ?? null)
        submitData.append("Id_Parent", formData.Id_Parent ?? null)
      }

      if (formData.File) {
        submitData.append("File", formData.File)
      }

      response = editRegis ? await updateStatusMCUComp(submitData) : await CreateNewMCUComp(submitData)

      if (response.status === 200 || response.status === 201) {
        if (onRefresh) {
          onRefresh()
        }
        handleOpen()
        Swal.fire("Success", "Berhasil Edit Data", "success")
      } else {
        handleOpen()
        Swal.fire("Error", `Gagal Edit Data, ${response.message}`, "error")
      }
    } catch (error) {
      handleOpen()
      Swal.fire("Error", "An error occurred while updating data", "error")
    }
  }

  const handleSubmitNew = async (e) => {
    e.preventDefault()
    if (!validateFormNew()) return;

    if (isSubmitting) return
    setIsSubmitting(true)

    try {
      const formData = new FormData()

      entriesNew.forEach((entryNew, index) => {
        if (entryNew.Id_Kategori_Paket === "999") {
          formData.append(`Id_Tindakan[${index}]`, JSON.stringify(entryNew.Id_Tindakan))
          formData.append(`Id_Paket[${index}]`, "")
        } else {
          formData.append(`Id_Paket[${index}]`, entryNew.Id_Paket)
          formData.append(`Id_Tindakan[${index}]`, "")
        }

        formData.append(`Jml_Peserta[${index}]`, entryNew.Jml_Peserta)
        formData.append(`Booking_At[${index}]`, entryNew.Booking_At)
        formData.append(`Harga[${index}]`, entryNew.Harga)

        if (entryNew.File) {
          formData.append(`file[${index}]`, entryNew.File)
        }
      })

      formData.append(`Id_Comp_From_Admin`, formDataNew.Id_Comp_From_Admin)

      const response = await bookingMCUComp(formData)

      if (response.status === 201) {
        if (onRefresh) {
          onRefresh()
        }
        handleOpenNew()
        Swal.fire("Success", "Berhasil Edit Data", "success")
      }
    } catch (error) {
      console.error("Error submitting form:", error)
      Swal.fire({
        icon: "error",
        title: "An error occurred",
        text: "Please try again later.",
        timer: 2000,
        showConfirmButton: false,
        position: "center",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const fetchpackageCategories = async () => {
    try {
      const response = await getKategoriPaket()
      if (response.status == 200) {
        setPackageCategories([...response.data, { Id: "999", Nama_Kategori_Paket: "Non Paket" }])
      } else {
        setError("Failed to fetch data")
      }
    } catch (error) {
      setError("An error occurred while fetching data")
    } finally {
      setLoading(false)
    }
  }

  const fetchpackageCategoriesNew = async () => {
    try {
      const response = await getKategoriPaket()
      if (response.status === 200) {
        setPackageCategoriesNew([...response.data, { Id: "999", Nama_Kategori_Paket: "Non Paket" }])
      }
    } catch (error) {
      console.error("Error fetching package categories:", error)
    }
  }

  const fetchPaketByKategoriNew = async (Id_Kategori_Paket, index) => {
    // Clear the packages first
    setPaketLists((prev) => ({
      ...prev,
      [index]: [],
    }))

    if (Id_Kategori_Paket === "999") {
      return
    }

    try {
      const response = await getPaketbyKategori(Id_Kategori_Paket)
      if (response.status === 200) {
        setPaketLists((prev) => ({
          ...prev,
          [index]: response.data,
        }))
      }
    } catch (error) {
      console.error("Error fetching paket:", error)
    }
  }

  const loadCompRegis = useCallback(async (inputValue, callback) => {
    try {
      const response = await getAkunCompany(1, 20, inputValue);
      if (response.status === 200) {
        const options = response.data.map((pasien) => ({
          label: `${pasien.Nama_Comp}`,
          value: pasien.Id
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

  const fetchKategoriDetail = async () => {
    setLoading(true)
    try {
      const response = await getGroupTindakanDetail()
      if (response.status == 200) {
        setGroupDetail(response.data)
      } else {
        setError("Failed to fetch data")
        Swal.fire("Error", "Failed to fetch data", "error")
      }
    } catch (error) {
      setError("An error occurred while fetching data")
      Swal.fire("Error", "An error occurred while fetching data", "error")
    } finally {
      setLoading(false)
    }
  }

  const fetchPaketByKategori = async (Id_Kategori_Paket) => {
    setPaketList(null)
    try {
      const response = await getPaketbyKategori(Id_Kategori_Paket)
      if (response.status == 200) {
        setPaketList(response.data)
      } else {
        setError("Failed to fetch paket data")
      }
    } catch (error) {
      setError("An error occurred while fetching paket data")
    }
  }

  useEffect(() => {
    const initializeComponent = async () => {
      fetchKategoriDetail()
      fetchpackageCategories()
      fetchpackageCategoriesNew()
    }

    initializeComponent()
  }, [])

  useEffect(() => {
    if (formData.Id_Kategori_Paket) {
      if (formData.Id_Kategori_Paket == "999") {
        setShowCustomButton(true)
        setPaketList(null)
      } else {
        setShowCustomButton(false)
        fetchPaketByKategori(formData.Id_Kategori_Paket)
      }
    }
  }, [formData.Id_Kategori_Paket])

  const handleCompRegis = (selected) => {
    setCompRegis(selected);
    setFormDataNew(prev => ({ ...prev, Id_Comp_From_Admin: selected ? selected.value : null }));
    setFormError2(prev => ({ ...prev, Id_Comp_From_Admin: "" }));
  };

  useEffect(() => {
    if (selectedRow && selectedRow[0]?.MASTER_PAKET_TINDAKANs) {
      const initialSelectedActions = {}
      selectedRow[0].MASTER_PAKET_TINDAKANs.forEach((paketTindakan) => {
        paketTindakan.Tindakans.forEach((tindakan) => {
          initialSelectedActions[tindakan.Id_Tindakan] = true
        })
      })
      setSelectedCustomActions(initialSelectedActions)
    }
  }, [selectedRow])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
      </div>
    )
  }

  const formatPrice = (price) => {
    return new Intl.NumberFormat("id-ID").format(price)
  }

  return (
    <>
      <div className="flex flex-col justify-between md:flex-row md:items-center px-4 pb-4">
        <div>
          <Button onClick={handleOpenNew} variant="gradient">
            Booking MCU
          </Button>
        </div>
      </div>

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
              const isExpanded = expandedRows.includes(row.Id)
              const classes = "p-4 border border-blue-gray-50"

              return (
                <React.Fragment key={row.Id}>
                  <tr key={row.Id} className="hover:bg-blue-gray-50/50 transition-colors duration-200">
                    <td className={classes}>
                      <Button onClick={() => toggleRow(row.Id)} className="p-2">
                        {row.MCU_COMPANY_DETAIL?.length > 0 &&
                          (isExpanded ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />)
                        }
                      </Button>
                    </td>
                    <td className={classes}>
                      <Typography variant="small" color="blue-gray" className="font-normal">
                        {index + 1}
                      </Typography>
                    </td>
                    <td className={classes}>
                      <Typography variant="small" color="blue-gray" className="font-medium">
                        {row.Nama_Comp}
                      </Typography>
                    </td>
                    <td className={classes}>
                      <div className="flex flex-col gap-2">
                        {row.Telp && (
                          <div className="flex items-center justify-between gap-2 p-1.5 rounded-lg bg-gray-50">
                            <span className="select-all text-sm text-gray-600">{row.Telp}</span>
                            <ContactOptions number={row.Telp} />
                          </div>
                        )}
                      </div>
                    </td>
                    <td className={classes}>
                      {row.Harga_Basic == 0 ?
                        <p className="text-sm text-red-400">Cost is being calculated</p> :
                        <p className="text-sm">{row.Harga}</p>
                      }
                    </td>
                    <td className={classes}>
                      <Typography variant="small" color="blue-gray" className="font-normal">
                        {formatDate(row.Created_At)}
                      </Typography>
                    </td>

                    <td className="max-w-[140px] p-4 border border-blue-gray-50">
                      <div>
                        <div
                          className={`${row.Status_MCU_Detail === "Selesai"
                            ? "text-green-500"
                            : row.Status_MCU_Detail === "Batal"
                              ? "text-red-500"
                              : row.Status_MCU_Detail === "Disetujui" ||
                                row.Status_MCU_Detail === "Disetujui dan Sudah import data"
                                ? "text-green-300"
                                : row.Status_MCU_Detail === "Menunggu persetujuan"
                                  ? "text-black"
                                  : row.Status_MCU_Detail === "Proses"
                                    ? "text-blue-500"
                                    : ""
                            }`}
                        >
                          <Typography variant="small" className="font-medium">
                            {row.Status_MCU_Detail}
                          </Typography>
                        </div>
                      </div>
                    </td>

                    <td className={classes}>
                      {row.Status_MCU != 8 && (
                        <div className="flex flex-col gap-1 items-center">
                          {row.ReadyFinish == false ? (
                            <Button onClick={() => handleEdit(row)} variant="outlined" className="rounded-full capitalize w-[75%] items-center px-0">
                              Konfirmasi
                            </Button>
                          ) : (
                            <Button onClick={() => handleFinish(row)} variant="outlined" className="rounded-full capitalize" color="green">
                              Selesaikan
                            </Button>
                          )}
                          <Button onClick={() => handleAddSubData(row)} variant="outlined" className="rounded-full capitalize flex items-center gap-1 p-3">
                            <PlusCircle className="w-4 h-4" />
                            Add Paket
                          </Button>
                        </div>
                      )}
                    </td>
                  </tr>

                  {isExpanded && (
                    <tr>
                      <td colSpan={9} className="p-0">
                        <div className="bg-white p-4">
                          <table className="w-full border border-spacing-0">
                            <thead>
                              <tr>
                                {DETAIL_TABLE_HEAD.map((head) => (
                                  <th
                                    key={head}
                                    className="bg-blue-gray-50/50 text-left p-3 text-sm font-semibold text-gray-600 first:rounded-tl-lg last:rounded-tr-lg"
                                  >
                                    {head}
                                  </th>
                                ))}
                              </tr>
                            </thead>
                            <tbody>
                              {row.MCU_COMPANY_DETAIL?.map((detail, detailIndex) => (
                                <tr key={detail.Id} className="hover:bg-gray-100">
                                  <td className="p-3 border border-gray-200">
                                    <Typography variant="small" color="blue-gray" className="font-medium">
                                      {`${index + 1}.${detailIndex + 1}`}
                                    </Typography>
                                  </td>
                                  <td className="p-3 border border-gray-200">
                                    <Typography variant="small" color="blue-gray" className="font-medium">
                                      {detail.Nama_Kategori_Paket}
                                    </Typography>
                                  </td>
                                  <td className="p-3 border border-gray-200">
                                    <Typography variant="small" color="blue-gray" className="font-medium">
                                      {detail.Nama_Paket}
                                    </Typography>
                                  </td>
                                  <td className="p-3 border border-gray-200">
                                    {detail.Harga == 0 ?
                                      <p className="text-sm text-red-400">Cost is being calculated</p> :
                                      <p className="text-sm">{detail.Harga_Format}</p>
                                    }
                                  </td>
                                  <td className="p-3 border border-gray-200">
                                    <Typography variant="small" color="blue-gray" className="font-medium">
                                      {formatDate(detail.Booking_At)}
                                    </Typography>
                                  </td>
                                  <td className="p-3 border border-gray-200">
                                    <Typography variant="small" color="blue-gray" className="font-medium">
                                      {detail.Jml_Peserta || "-"}
                                    </Typography>
                                  </td>
                                  <td className="p-3 border border-gray-200">
                                    <div className="flex flex-col">
                                      {detail.File_Peserta ? (
                                        <a
                                          href={`${import.meta.env.VITE_IMAGE}/${detail.File_Peserta}`}
                                          className="text-blue-500 hover:underline text-sm"
                                          target="_blank"
                                          rel="noopener noreferrer"
                                        >
                                          Download File
                                        </a>
                                      ) : (
                                        "-"
                                      )}

                                      {detail.Status == 2 && detail?.File_Peserta && !detail.PASIEN_MCU && (
                                        <Button
                                          type="submit"
                                          className="bg-[#7ACC89] px-1 py-1.5 text-sm mt-1 font-normal capitalize"
                                          onClick={() => {
                                            Swal.fire({
                                              title: "Apakah Anda yakin?",
                                              text: "Pastikan data sudah benar, melakukan import tidak bisa diulang dan dibatalkan untuk proses MCU!",
                                              icon: "warning",
                                              showCancelButton: true,
                                              confirmButtonColor: "#3085d6",
                                              cancelButtonColor: "#d33",
                                              confirmButtonText: "Ya",
                                              cancelButtonText: "Tidak",
                                            }).then((result) => {
                                              if (result.isConfirmed) {
                                                handleImportConfirmation(detail)
                                              }
                                            })
                                          }}
                                        >
                                          Import Data
                                        </Button>
                                      )}

                                      {(detail.Status == 2 || detail.Status == 3 || detail.Status == 8) && detail?.File_Peserta && detail.PASIEN_MCU && (
                                        <Button
                                          variant="outlined"
                                          type="submit"
                                          className="px-1 py-1.5 text-sm mt-1 font-normal capitalize"
                                          onClick={() => {
                                            handleOpenPeserta(detail)
                                          }}
                                        >
                                          List Peserta
                                        </Button>
                                      )}
                                    </div>
                                  </td>

                                  <td className="p-3 border border-gray-200">
                                    <div>
                                      <div
                                        className={`${detail.Status === "8"
                                          ? "text-green-500"
                                          : detail.Status === "9"
                                            ? "text-red-500"
                                            : detail.Status === "2"
                                              ? "text-green-300"
                                              : detail.Status === "1"
                                                ? "text-black"
                                                : detail.Status === "3"
                                                  ? "text-blue-500"
                                                  : ""
                                          }`}
                                      >
                                        <Typography variant="small" className="font-medium">
                                          {getStatusText(detail.Status)}
                                        </Typography>
                                      </div>
                                    </div>
                                  </td>

                                  <td className={classes}>
                                    <div className="flex flex-col text-center gap-3">
                                      <div>
                                        <Button onClick={() => handleEditSubData(detail, row)} variant="outlined" className="rounded-full capitalize p-3">
                                          Update
                                        </Button>
                                      </div>
                                      {detail.Status == 3 &&
                                        <div>
                                          <Button onClick={() => handleAutoFinishComp(detail, row)} variant="outlined" className="rounded-full capitalize">
                                            Selesaikan Langsung
                                          </Button>
                                        </div>
                                      }
                                    </div>
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      </td>
                    </tr>
                  )}

                </React.Fragment>
              )
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
                  )
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
                )
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

        <ModalForm open={open} handleOpen={handleOpen} onSubmit={handleSubmit} title={"Booking MCU"}>
          <div>
            <label className="text-sm text-gray-900">
              Pilihan MCU <span className="text-red-500">*</span>
            </label>
            <Select
              name="Id_Kategori_Paket"
              value={formData.Id_Kategori_Paket}
              error={formError.Id_Kategori_Paket}
              onChange={handleKategoriChange}
              disabled={(formData.PASIEN_MCU || formData.Status == 9) ? true : false}
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
              <label className="text-sm text-gray-900">
                Paket MCU <span className="text-red-500">*</span>
              </label>
              <Select
                name="Id_Paket"
                value={formData.Id_Paket}
                onChange={handlePaketChange}
                error={formError.Id_Paket}
                disabled={!formData.Id_Kategori_Paket || formData.PASIEN_MCU != null || formData.Status == 9 ? true : false}
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
              <label className="text-sm text-gray-900">
                Pilih Tindakan <span className="text-red-500">*</span>
              </label>
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

          {customActionError && <p className="text-red-500 text-sm">{customActionError}</p>}

          <div>
            <label className="text-sm text-gray-900">
              Tanggal Pemeriksaan <span className="text-red-500">*</span>
            </label>
            <Input
              type="date"
              name="Booking_At"
              value={formData.Booking_At ?? ""}
              onChange={(e) => {
                const selectedDate = new Date(e.target.value)
                if (selectedDate.getDay() === 0) {
                  setFormError((prev) => ({ ...prev, Booking_At: "Hari Minggu Libur, Silakan pilih hari lain." }))
                  setFormData((prev) => ({ ...prev, Booking_At: "" }))
                } else {
                  handleInputChange(e)
                }
              }}
              min={format(addDays(new Date(), 0), "yyyy-MM-dd")}
              error={formError.Booking_At}
              disabled={formData.PASIEN_MCU || formData.Status == 9}
            />
          </div>

          <div>
            <label className="text-sm text-gray-900">Jumlah Peserta</label>
            <Input
              type="number"
              name="Jml_Peserta"
              value={formData.Jml_Peserta ?? ""}
              onChange={handleInputChange}
              error={formError.Jml_Peserta}
              disabled={formData.PASIEN_MCU || formData.Status == 9}
            />
            <label className="text-xs text-blue-500">Pastikan dengan perusahaan terkait jumlah peserta MCU</label>
          </div>

          <div>
            <label className="text-sm text-gray-900">File Daftar Peserta</label>
            {formData?.File_Peserta ? (
              <a
                href={`${apiUrl}/${formData.File_Peserta}`}
                download
                className="block text-sm font-semibold text-blue-300 hover:text-blue-800 hover:underline cursor-pointer"
              >
                Download
              </a>
            ) : (
              <p className="text-sm text-red-400">Belum diupload</p>
            )}

            <div className="mt-2">
              <Input
                type="file"
                label="Ganti / Upload"
                name="File"
                disabled={formData.PASIEN_MCU || formData.Status == 9}
                onChange={handleInputChange}
                accept="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel"
              />
            </div>
          </div>

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

          {(!formData.PASIEN_MCU && formData.StatusParent != 8) && (
            <div>
              <div>
                <label className="text-sm text-gray-900">Status Kehadiran</label>
              </div>
              <div>
                <Radio
                  name="Status"
                  label="Setujui"
                  value="2"
                  onChange={handleInputChange}
                  checked={formData.Status === "2"}
                />
                <Radio
                  name="Status"
                  label="Batal"
                  value="9"
                  onChange={handleInputChange}
                  checked={formData.Status === "9"}
                />
              </div>
            </div>
          )}
        </ModalForm>

        <ModalForm
          size="lg"
          open={open2}
          handleOpen={handleOpen2}
          title="Pilih Tindakan"
          footer={false}
          footerClose={true}
        >
          <div className="max-h-[60vh] w-full overflow-y-auto">
            {groupDetail.map((bundle) => (
              <div key={bundle.Id} className="mb-4">
                <h3 className="text-md font-bold mb-2">{bundle.Nama_Bundle}</h3>
                <ul className="text-sm pl-5">
                  {bundle.MASTER_TINDAKAN_MCUs.map((tindakan) => {
                    const isChecked =
                      (selectedRow &&
                        selectedRow[0]?.MASTER_PAKET_TINDAKANs.some(
                          (paketTindakan) =>
                            paketTindakan.Group_Tindakan.Id == bundle.Id &&
                            paketTindakan.Tindakans.some((t) => t.Id_Tindakan == tindakan.Id),
                        ) &&
                        selectedCustomActions[tindakan.Id] != false) ||
                      selectedCustomActions[tindakan.Id] == true
                    return (
                      <li key={tindakan.Id} className="flex items-center space-x-2">
                        <Checkbox
                          id={`tindakan-${tindakan.Id}`}
                          checked={isChecked}
                          disabled={formData.PASIEN_MCU != null}
                          onChange={(e) => handleCustomActionChange(tindakan.Id, e.target.checked)}
                        />
                        <label htmlFor={`tindakan-${tindakan.Id}`}>{tindakan.Nama_Tindakan}</label>
                      </li>
                    )
                  })}
                </ul>
              </div>
            ))}
          </div>
        </ModalForm>

        <ModalForm
          open={openNew}
          handleOpen={handleOpenNew}
          onSubmit={handleSubmitNew}
          title={"Booking MCU"}
        >
          <div>
            <label className="text-sm text-gray-900">Perusahaan / Instansi <span className='text-red-500'>*</span></label>
            <AsyncSelect
              className='py-0.5'
              cacheOptions
              loadOptions={loadCompRegis}
              defaultOptions
              onChange={handleCompRegis}
              placeholder="Cari Nama..."
              isClearable
              value={selectedCompRegis}
              styles={{
                control: (provided, state) => ({
                  ...provided,
                  borderColor: formError2.Id_Comp_From_Admin ? 'red' : provided.borderColor,
                  '&:hover': {
                    borderColor: formError2.Id_Comp_From_Admin ? 'red' : provided.borderColor,
                  },
                }),
              }}
              isDisabled={editRegis ? true : false}
            />
            {formError2.Id_Comp_From_Admin && (
              <Typography color="red" className="text-sm mt-2">
                {formError2.Id_Comp_From_Admin}
              </Typography>
            )}
          </div>

          {entriesNew.map((entryNew, index) => (
            <div key={index} className="p-4 border rounded-lg relative">
              {index > 0 && (
                <Button variant="text" color="red" className="p-0 mb-2" onClick={() => handleRemoveEntry(index)}>
                  <Trash className="h-5 w-5" />
                </Button>
              )}

              <div className="space-y-4">

                <div>
                  <Input
                    type="date"
                    label="Tanggal Pemeriksaan"
                    value={entryNew.Booking_At}
                    onChange={(e) => {
                      const selectedDate = new Date(e.target.value)
                      if (selectedDate.getDay() !== 0) {
                        handleEntryChange(index, "Booking_At", e.target.value)
                      } else {
                        Swal.fire({
                          icon: "error",
                          title: "Hari Minggu Libur",
                          text: "Silakan pilih hari lain.",
                          timer: 3000,
                          showConfirmButton: false,
                          position: "center",
                        })
                      }
                    }}
                    min={format(addDays(new Date(), 1), "yyyy-MM-dd")}
                  />

                  {formErrorNew[index]?.Booking_At &&
                    <p className="text-red-500 text-xs mt-1">{formErrorNew[index].Booking_At}</p>
                  }
                </div>

                <div>
                  <Input
                    type="number"
                    label="Jumlah Peserta MCU"
                    value={entryNew.Jml_Peserta ?? ''}
                    onChange={(e) => handleEntryChange(index, "Jml_Peserta", e.target.value)}
                  />
                </div>

                <div>
                  <Select
                    label="Paket Kategori Pemeriksaan"
                    value={entryNew.Id_Kategori_Paket}
                    onChange={(value) => handleEntryChange(index, "Id_Kategori_Paket", value)}
                  >
                    {packageCategoriesNew.map((category) => (
                      <Option key={category.Id} value={category.Id}>
                        {category.Nama_Kategori_Paket}
                      </Option>
                    ))}
                  </Select>

                  {formErrorNew[index]?.Id_Kategori_Paket && <p className="text-red-500 text-xs mt-1">{formErrorNew[index].Id_Kategori_Paket}</p>}
                </div>

                {entryNew.Id_Kategori_Paket === "999" ? (
                  <div>
                    <Button
                      onClick={() => {
                        setCurrentEditIndex(index)
                        setOpenCustom2(true)
                      }}
                      className="relative flex items-center justify-center w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-pink-500 hover:to-purple-500 text-white font-semibold py-2 rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 active:translate-y-0 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-10 rounded-xl transition-opacity duration-300"></div>
                      <div className="flex items-center justify-center gap-2">
                        <ListPlus className="h-5 w-5" />
                        <span>Pilih Tindakan</span>
                      </div>
                    </Button>
                    {formErrorNew[index]?.Id_Tindakan && <p className="text-red-500 text-xs mt-1">{formErrorNew[index].Id_Tindakan}</p>}
                  </div>
                ) : (
                  paketLists[index]?.length > 0 && (
                    <div>
                      <Select
                        label="Pilih Paket"
                        value={entryNew.Id_Paket}
                        onChange={(value) => handleEntryChange(index, "Id_Paket", value)}
                      >
                        {paketLists[index].map((paket) => (
                          <Option key={paket.Id} value={paket.Id}>
                            {paket.Nama_Paket}
                          </Option>
                        ))}
                      </Select>

                      {entryNew.Id_Paket &&
                        <div>
                          <p
                            className="text-xs md:text-sm text-blue-300 underline hover:text-blue-500 cursor-pointer"
                            onClick={() => handleViewProcedures(entryNew.Id_Paket)}
                          >
                            Daftar Tindakan
                          </p>
                        </div>
                      }

                      {formErrorNew[index]?.Id_Paket && <p className="text-red-500 text-xs mt-1">{formErrorNew[index].Id_Paket}</p>}
                    </div>
                  )
                )}

                <Input
                  type="string"
                  label="Harga"
                  value={entryNew.Harga ? formatPrice(entryNew.Harga) : ""}
                  readOnly={true}
                  onChange={(e) => handleEntryChange(index, "Harga", e.target.value)}
                />
                <label className="text-xs text-blue-500">Harga berdasarkan paket dan jumlah peserta</label>

                <Input
                  type="file"
                  label="File Excel Peserta"
                  onChange={(e) => {
                    const file = e.target.files?.[0]
                    if (file) handleFileChange(index, file)
                  }}
                  accept=".xlsx,.xls"
                />
              </div>
            </div>
          ))}

          <Button variant="outlined" onClick={handleAddEntry} className="relative flex items-center justify-center p-3">
            <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-10 rounded-xl transition-opacity duration-300"></div>
            <div className="flex items-center justify-center gap-2">
              <ListPlus className="h-5 w-5" />
              <span>Tambah Paket</span>
            </div>
          </Button>

          <div className="h-8" />
        </ModalForm>

        <ModalForm
          size="lg"
          open={openCustom2}
          handleOpen={() => setOpenCustom2(false)}
          title="Pilih Tindakan"
          footer={false}
          footerClose={true}
        >
          <div className="max-h-[60vh] w-full overflow-y-auto z-999">
            {groupDetail.map((bundle) => (
              <div key={bundle.Id} className="mb-4">
                <h3 className="text-md font-bold mb-2">{bundle.Nama_Bundle}</h3>
                <ul className="text-sm pl-5">
                  {bundle.MASTER_TINDAKAN_MCUs.map((tindakan) => {
                    const isChecked =
                      currentEditIndex !== null && entriesNew[currentEditIndex]?.selectedCustomActions[tindakan.Id]

                    return (
                      <li key={tindakan.Id} className="flex items-center space-x-2">
                        <Checkbox
                          id={`tindakan-${tindakan.Id}`}
                          checked={isChecked ? true : false}
                          onChange={(e) => {
                            if (currentEditIndex !== null) {
                              handleCustomActionChangeNew(currentEditIndex, tindakan.Id, e.target.checked)
                            }
                          }}
                        />
                        <label htmlFor={`tindakan-${tindakan.Id}`}>{tindakan.Nama_Tindakan}</label>
                      </li>
                    )
                  })}
                </ul>
              </div>
            ))}
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
              {procedureView?.[0]?.MASTER_PAKET_TINDAKANs?.map((group) => (
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
                    {group.Tindakans.map((tindakan) => (
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

        <CompListModal
          open={openPatientList}
          handleOpen={() => setOpenPatientList(!openPatientList)}
          patients={selectedPatients}
        />
      </div>
    </>
  )
}

export default DataTableComp

