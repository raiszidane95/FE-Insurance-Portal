import axios from "axios";

const apiUrl = import.meta.env.VITE_URL;
const token = localStorage.getItem("token")

//MASTER MCU
export const getMasterMCU = async () => {
  const response = await fetch(
    `${apiUrl}/master_mcu/get`,
    {
      method: "GET",
      cache: "no-store",
    }
  );
  return await response.json();
};

export const putMasterMCU = async (data) => {
  const response = await fetch(`${apiUrl}/master_mcu/update`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
    method: "PUT",
    body: data,
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error('Failed to update data');
  }

  return await response.json();
};

//KATEGORI PAKET
export const getKategoriPaket = async (page = 1, limit = 10, search = '') => {
  const queryParams = new URLSearchParams({
    page: page.toString(),
    limit: limit.toString(),
    ...(search && { search })
  });

  const response = await fetch(
    `${apiUrl}/kat_paket_mcu/get?${queryParams}`,
    {
      method: "GET",
      cache: "no-store",
    }
  );

  return await response.json();
};

export const getKategoriPaketbyId = async (id) => {
  const response = await fetch(`${apiUrl}/kat_paket_mcu/get/${id}`, {
    method: "GET",
    cache: "no-store",
  });
  return await response.json();
};

export const postKategoriPaket = async (data) => {
  const response = await fetch(`${apiUrl}/kat_paket_mcu/create`, {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    method: "POST",
    body: JSON.stringify(data),
    cache: "no-store",
  });

  return await response.json();
};

export const putKategoriPaket = async (id, data) => {
  const response = await fetch(`${apiUrl}/kat_paket_mcu/update/${id}`, {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    method: "PUT",
    body: JSON.stringify(data),
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error('Failed to update data');
  }

  return await response.json();
};

export const deleteKategoriPaket = async (id) => {
  const response = await fetch(`${apiUrl}/kat_paket_mcu/delete/${id}`, {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    method: "DELETE",
    cache: "no-store",
  });

  return await response.json();
};

//PAKET
export const getPaketbyKategori = async (id, page = 1, limit = 10, search = '') => {
  const queryParams = new URLSearchParams({
    page: page.toString(),
    limit: limit.toString(),
    ...(search && { search })
  });

  const response = await fetch(
    `${apiUrl}/paket_mcu/getbykategori/${id}?${queryParams}`,
    {
      method: "GET",
      cache: "no-store",
    }
  );

  return await response.json();
};

export const getPaketbyId = async (id) => {
  const response = await fetch(`${apiUrl}/paket_mcu/get/${id}`, {
    method: "GET",
    cache: "no-store",
  });
  return await response.json();
};

export const postPaket = async (data) => {
  const response = await fetch(`${apiUrl}/paket_mcu/create`, {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    method: "POST",
    body: JSON.stringify(data),
    cache: "no-store",
  });

  return await response.json();
};

export const putPaket = async (id, data) => {
  const response = await fetch(`${apiUrl}/paket_mcu/update/${id}`, {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    method: "PUT",
    body: JSON.stringify(data),
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error('Failed to update data');
  }

  return await response.json();
};

export const deletePaket = async (id) => {
  const response = await fetch(`${apiUrl}/paket_mcu/delete/${id}`, {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    method: "DELETE",
    cache: "no-store",
  });

  return await response.json();
};

export const postPaketTindakan = async (data) => {
  const response = await fetch(`${apiUrl}/paket_tindakan/create-multi`, {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    method: "POST",
    body: JSON.stringify(data),
    cache: "no-store",
  });

  return await response.json();
};

export const getlisttindakanpaket = async (id, id_pasien_mcu = null) => {
  let url = `${apiUrl}/paket_tindakan/detailtindakan/${id}`;
  
  if (id_pasien_mcu !== null) {
    url += `?idmcu=${id_pasien_mcu}`;
  }

  const response = await fetch(url, {
    method: "GET",
    cache: "no-store",
  });

  return await response.json();
};

export const getlisttindakancustom = async (id) => {
  const response = await fetch(
    `${apiUrl}/paket_tindakan/detailtindakancustom/${id}`,
    {
      method: "GET",
      cache: "no-store",
    }
  );

  return await response.json();
};

export const getlisttindakanforadmin = async (id) => {
  const response = await fetch(
    `${apiUrl}/paket_tindakan/detailprosesforadmin/${id}`,
    {
      method: "GET",
      cache: "no-store",
    }
  );

  return await response.json();
};

export const getlisttindakancustomcomp = async (id) => {
  const response = await fetch(
    `${apiUrl}/paket_tindakan/detailtindakancustom-comp/${id}`,
    {
      method: "GET",
      cache: "no-store",
    }
  );

  return await response.json();
};

//GROUP TINDAKAN
export const getGroupTindakan = async (page = 1, limit = 10, search = '') => {
  const queryParams = new URLSearchParams({
    page: page.toString(),
    limit: limit.toString(),
    ...(search && { search })
  });

  const response = await fetch(
    `${apiUrl}/group_tindakan_mcu/get?${queryParams}`,
    {
      method: "GET",
      cache: "no-store",
    }
  );

  return await response.json();
};

export const getGroupTindakanWithAntrian = async (page = 1, limit = 10, search = '') => {
  const queryParams = new URLSearchParams({
    page: page.toString(),
    limit: limit.toString(),
    ...(search && { search })
  });

  const response = await fetch(
    `${apiUrl}/group_tindakan_mcu/with_antrian/get?${queryParams}`,
    {
      method: "GET",
      cache: "no-store",
    }
  );

  return await response.json();
};

export const getGroupTindakanDetail = async () => {
  const response = await fetch(
    `${apiUrl}/group_tindakan_mcu/viewtindakan`,
    {
      method: "GET",
      cache: "no-store",
    }
  );

  return await response.json();
};

export const getGroupTindakanbyId = async (id) => {
  const response = await fetch(`${apiUrl}/group_tindakan_mcu/get/${id}`, {
    method: "GET",
    cache: "no-store",
  });
  return await response.json();
};

export const postGroupTindakan = async (data) => {
  const response = await fetch(`${apiUrl}/group_tindakan_mcu/create`, {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    method: "POST",
    body: JSON.stringify(data),
    cache: "no-store",
  });

  return await response.json();
};

export const putGroupTindakan = async (id, data) => {
  const response = await fetch(`${apiUrl}/group_tindakan_mcu/update/${id}`, {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    method: "PUT",
    body: JSON.stringify(data),
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error('Failed to update data');
  }

  return await response.json();
};

export const deleteGroupTindakan = async (id) => {
  const response = await fetch(`${apiUrl}/group_tindakan_mcu/delete/${id}`, {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    method: "DELETE",
    cache: "no-store",
  });

  return await response.json();
};

//TINDAKAN
export const getTindakanbyGroup = async (id, page = 1, limit = 10, search = '', tipe = null) => {
  const queryParams = new URLSearchParams({
    page: page.toString(),
    limit: limit.toString(),
    ...(search && { search }),
    ...(tipe && { tipe })
  });

  const response = await fetch(
    `${apiUrl}/tindakan_mcu/getbygroup/${id}?${queryParams}`,
    {
      method: "GET",
      cache: "no-store",
    }
  );

  return await response.json();
};

export const getTindakanbyGroupWithAntrian = async (id, page = 1, limit = 10, search = '', tipe = null) => {
  const queryParams = new URLSearchParams({
    page: page.toString(),
    limit: limit.toString(),
    ...(search && { search }),
    ...(tipe && { tipe })
  });

  const response = await fetch(
    `${apiUrl}/tindakan_mcu/bygroup/withantrian/${id}?${queryParams}`,
    {
      method: "GET",
      cache: "no-store",
    }
  );

  return await response.json();
};

export const postTindakan = async (data) => {
  const response = await fetch(`${apiUrl}/tindakan_mcu/create`, {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    method: "POST",
    body: JSON.stringify(data),
    cache: "no-store",
  });

  return await response.json();
};

export const putTindakan = async (id, data) => {
  const response = await fetch(`${apiUrl}/tindakan_mcu/update/${id}`, {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    method: "PUT",
    body: JSON.stringify(data),
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error('Failed to update data');
  }

  return await response.json();
};

export const deleteTindakan = async (id) => {
  const response = await fetch(`${apiUrl}/tindakan_mcu/delete/${id}`, {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    method: "DELETE",
    cache: "no-store",
  });

  return await response.json();
};

//Gallery MCU
export const getGallery = async (page = 1, limit = 10, search = '') => {
  const queryParams = new URLSearchParams({
    page: page.toString(),
    limit: limit.toString(),
    ...(search && { search }),
    tipe: 1
  });

  const response = await fetch(
    `${apiUrl}/gallery_mcu/get?${queryParams}`,
    {
      method: "GET",
      cache: "no-store",
    }
  );

  return await response.json();
};

export const postGallery = async (data) => {
  const response = await fetch(`${apiUrl}/gallery_mcu/create`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
    method: "POST",
    body: data,
    cache: "no-store",
  });

  return await response.json();
};

export const putGallery = async (id, data) => {
  const response = await fetch(`${apiUrl}/gallery_mcu/update/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
    method: "PUT",
    body: data,
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error('Failed to update data');
  }

  return await response.json();
};

export const deleteGallery = async (id) => {
  const response = await fetch(`${apiUrl}/gallery_mcu/delete/${id}`, {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    method: "DELETE",
    cache: "no-store",
  });

  return await response.json();
};

//Fasilitas MCU
export const getFasilitas = async (page = 1, limit = 10, search = '') => {
  const queryParams = new URLSearchParams({
    page: page.toString(),
    limit: limit.toString(),
    ...(search && { search }),
    tipe: 2
  });

  const response = await fetch(
    `${apiUrl}/gallery_mcu/get?${queryParams}`,
    {
      method: "GET",
      cache: "no-store",
    }
  );

  return await response.json();
};

export const postFasilitas = async (data) => {
  const response = await fetch(`${apiUrl}/gallery_mcu/create`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
    method: "POST",
    body: data,
    cache: "no-store",
  });

  return await response.json();
};

export const putFasilitas = async (id, data) => {
  const response = await fetch(`${apiUrl}/gallery_mcu/update/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
    method: "PUT",
    body: data,
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error('Failed to update data');
  }

  return await response.json();
};

export const deleteFasilitas = async (id) => {
  const response = await fetch(`${apiUrl}/gallery_mcu/delete/${id}`, {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    method: "DELETE",
    cache: "no-store",
  });

  return await response.json();
};

//History MCU
export const getHistory = async () => {
  const response = await fetch(
    `${apiUrl}/mcu/history-pasien`,
    {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      method: "GET",
      cache: "no-store",
    }
  );

  return await response.json();
};

export const getHistoryCancel = async () => {
  const response = await fetch(
    `${apiUrl}/mcu/history-pasien-cancel`,
    {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      method: "GET",
      cache: "no-store",
    }
  );

  return await response.json();
};

export const getHistoryComp = async () => {
  const response = await fetch(
    `${apiUrl}/mcu/history-comp`,
    {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      method: "GET",
      cache: "no-store",
    }
  );

  return await response.json();
};

export const getHistoryCompDetail = async (noReg) => {
  const response = await fetch(`${apiUrl}/mcu/history-comp/${noReg}`, {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    method: "GET",
    cache: "no-store",
  });
  return await response.json();
};

export const getHistoryDetail = async (noReg) => {
  const response = await fetch(`${apiUrl}/mcu/history-pasien/${noReg}`, {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    method: "GET",
    cache: "no-store",
  });
  return await response.json();
};

//Report
export const getReportListPaket = async (page = 1, limit = 10, kategori, start_date, end_date, search = '', filterMCU, compMCU) => {

  const queryParams = new URLSearchParams({
    page: page.toString(),
    limit: limit.toString(),
    ...(search && { search }),
    ...((kategori && kategori != 'semua') && { kategori }),
    ...(start_date && { start_date }),
    ...(end_date && { end_date }),
    ...(filterMCU && { filterMCU }),
    ...(compMCU && { compMCU }),
  });
  const response = await fetch(
    `${apiUrl}/mcu/report-mcu?${queryParams}`,
    {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      method: "GET",
      cache: "no-store",
    }
  );

  return await response.json();
};

export const getReportListTindakan = async (page = 1, limit = 10, grouptindakan, start_date, end_date, tindakan = null, tipe = null, search = '', filterMCU, compMCU) => {
  const queryParams = new URLSearchParams({
    page: page.toString(),
    limit: limit.toString(),
    ...(start_date && { start_date }),
    ...(end_date && { end_date }),
    ...(tindakan && { tindakan }),
    ...(tipe && { tipe }),
    ...(search && { search }),
    ...(filterMCU && { filterMCU }),
    ...(compMCU && { compMCU }),
  });
  const response = await fetch(
    `${apiUrl}/mcu/history-pertindakan/${grouptindakan}?${queryParams}`,
    {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      method: "GET",
      cache: "no-store",
    }
  );

  return await response.json();
};

//HOMAPAGE
export const homepage = async () => {
  const response = await fetch(
    `${apiUrl}/mcu/homepage`,
    {
      method: "GET",
      cache: "no-store",
    }
  );

  return await response.json();
};

export const homepageAdmin = async () => {
  const response = await fetch(
    `${apiUrl}/mcu/homepage-admin`,
    {
      method: "GET",
      cache: "no-store",
    }
  );

  return await response.json();
};

//MAIN MCU
export const bookingMCU = async (data) => {
  const response = await fetch(`${apiUrl}/mcu/register`, {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    method: "POST",
    body: JSON.stringify(data),
    cache: "no-store",
  });

  return await response.json();
};

export const bookingMCUOnline = async (data) => {
  const response = await fetch(`${apiUrl}/mcu/register-online`, {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    method: "POST",
    body: JSON.stringify(data),
    cache: "no-store",
  });

  return await response.json();
};

export const bookingMCUComp = async (data) => {
  const response = await fetch(`${apiUrl}/mcu/register-comp`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
    method: "POST",
    body: data,
    cache: "no-store",
  });

  return await response.json();
};

export const editbookingMCU = async (id, data) => {
  const response = await fetch(`${apiUrl}/mcu/edit/${id}`, {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    method: "PUT",
    body: JSON.stringify(data),
    cache: "no-store",
  });

  return await response.json();
};

export const confirmOnlineMCU = async (id, data) => {
  const response = await fetch(`${apiUrl}/mcu/confirm-online/${id}`, {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    method: "PUT",
    body: JSON.stringify(data),
    cache: "no-store",
  });

  return await response.json();
};

export const confirmCompMulti = async (data) => {
  const response = await fetch(`${apiUrl}/mcu/confirm-online-multi`, {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    method: "POST",
    body: JSON.stringify(data),
    cache: "no-store",
  });

  return await response.json();
};

export const getCheckRegis = async () => {
  const response = await fetch(`${apiUrl}/mcu/check-regist`, {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    method: "GET",
    cache: "no-store",
  });
  return await response.json();
};

export const getMCUprocess = async (id) => {
  const response = await fetch(`${apiUrl}/mcu/mcuonprocess/${id}`, {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    method: "GET",
    cache: "no-store",
  });
  return await response.json();
};

export const getPasienToday = async (page = 1, limit = 10, search = '', filterdata) => {
  const queryParams = new URLSearchParams({
    page: page.toString(),
    limit: limit.toString(),
    ...(search && { search }),
    ...(filterdata && { filterdata }),
  });

  const response = await fetch(`${apiUrl}/mcu/listpasienmcu/?${queryParams}`, {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    method: "GET",
    cache: "no-store",
  });
  return await response.json();
};

export const getExcelPasienToday = async (search = '', filterdata) => {
  const queryParams = new URLSearchParams({
    ...(search && { search }),
    ...(filterdata && { filterdata }),
  });

  try {
    const response = await axios({
      url: `${apiUrl}/mcu/listpasienmcu/excel/?${queryParams}`,
      method: 'GET',
      responseType: 'arraybuffer',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
        Accept: 'application/xlsx',
      },
    });

    return response;
  } catch (error) {
    console.error('Error fetching PDF:', error);
    throw error;
  }
};

export const getExcelPasienMarketing = async (start_date, end_date, search = '', status = '', compMCU) => {
  const queryParams = new URLSearchParams({
    ...(start_date && { start_date }),
    ...(end_date && { end_date }),
    ...(search && { search }),
    ...(status && { status }),
    ...(compMCU && { compMCU }),
  });

  try {
    const response = await axios({
      url: `${apiUrl}/mcu/listpasien-marketing/excel/?${queryParams}`,
      method: 'GET',
      responseType: 'arraybuffer',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
        Accept: 'application/xlsx',
      },
    });

    return response;
  } catch (error) {
    console.error('Error fetching PDF:', error);
    throw error;
  }
};

export const getExcelReportListPaket = async (kategori, start_date, end_date, search = '', filterMCU, compMCU) => {
  const queryParams = new URLSearchParams({
    ...((kategori && kategori != 'semua') && { kategori }),
    ...(start_date && { start_date }),
    ...(end_date && { end_date }),
    ...(search && { search }),
    ...(filterMCU && { filterMCU }),
    ...(compMCU && { compMCU }),
  });

  try {
    const response = await axios({
      url: `${apiUrl}/mcu/report-mcu/excel/?${queryParams}`,
      method: 'GET',
      responseType: 'arraybuffer',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
        Accept: 'application/xlsx',
      },
    });

    return response;
  } catch (error) {
    console.error('Error fetching PDF:', error);
    throw error;
  }
};

export const getExcelReportListTindakan = async (grouptindakan, start_date, end_date, tindakan = null, tipe = null, search = '', filterMCU, compMCU) => {
  const queryParams = new URLSearchParams({
    ...(start_date && { start_date }),
    ...(end_date && { end_date }),
    ...(tindakan && { tindakan }),
    ...(tipe && { tipe }),
    ...(search && { search }),
    ...(filterMCU && { filterMCU }),
    ...(compMCU && { compMCU }),
  });

  try {
    const response = await axios({
      url: `${apiUrl}/mcu/history-pertindakan/${grouptindakan}/excel?${queryParams}`,
      method: 'GET',
      responseType: 'arraybuffer',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
        Accept: 'application/xlsx',
      },
    });

    return response;
  } catch (error) {
    console.error('Error fetching PDF:', error);
    throw error;
  }
};

export const getPasienOnline = async (page = 1, limit = 10, search = '') => {
  const queryParams = new URLSearchParams({
    page: page.toString(),
    limit: limit.toString(),
    ...(search && { search }),
  });

  const response = await fetch(`${apiUrl}/mcu/listpasienonline/?${queryParams}`, {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    method: "GET",
    cache: "no-store",
  });
  return await response.json();
};

export const getPasienFromComp = async (page = 1, limit = 10, search = '', start_date, end_date, compMCU) => {
  const queryParams = new URLSearchParams({
    page: page.toString(),
    limit: limit.toString(),
    ...(start_date && { start_date }),
    ...(end_date && { end_date }),
    ...(search && { search }),
    ...(compMCU && { compMCU })
  });

  const response = await fetch(`${apiUrl}/mcu/listcomp-admission/?${queryParams}`, {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    method: "GET",
    cache: "no-store",
  });
  return await response.json();
};

export const getPasienMarketing = async (page = 1, limit = 10, start_date, end_date, search = '', status = '', compMCU) => {
  const queryParams = new URLSearchParams({
    page: page.toString(),
    limit: limit.toString(),
    ...(start_date && { start_date }),
    ...(end_date && { end_date }),
    ...(search && { search }),
    ...(status && { status }),
    ...(compMCU && { compMCU }),
  });

  const response = await fetch(`${apiUrl}/mcu/listpasien-marketing/?${queryParams}`, {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    method: "GET",
    cache: "no-store",
  });
  return await response.json();
};

export const getPasienComp = async (page = 1, limit = 10, start_date, end_date, search = '') => {
  const queryParams = new URLSearchParams({
    page: page.toString(),
    limit: limit.toString(),
    ...(start_date && { start_date }),
    ...(end_date && { end_date }),
    ...(search && { search }),
  });

  const response = await fetch(`${apiUrl}/mcu/listpasien-comp/?${queryParams}`, {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    method: "GET",
    cache: "no-store",
  });
  return await response.json();
};

export const putCheckin = async (data) => {
  const response = await fetch(`${apiUrl}/mcu/checkinpasien`, {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    method: "PUT",
    body: JSON.stringify(data),
    cache: "no-store",
  });

  return await response.json();
};

export const putCheckinMulti = async (data) => {
  const response = await fetch(`${apiUrl}/mcu/checkinmulti`, {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    method: "PUT",
    body: JSON.stringify(data),
    cache: "no-store",
  });

  return await response.json();
};

export const updateStatusMCU = async (data) => {
  const response = await fetch(`${apiUrl}/mcu/updatestatus`, {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    method: "PUT",
    body: JSON.stringify(data),
    cache: "no-store",
  });

  return await response.json();
};

export const confirmMCUComp = async (data) => {
  const response = await fetch(`${apiUrl}/mcu/confirmmcu-comp`, {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    method: "PUT",
    body: JSON.stringify(data),
    cache: "no-store",
  });

  return await response.json();
};

export const finishMCUComp = async (data) => {
  const response = await fetch(`${apiUrl}/mcu/finishmcu-comp`, {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    method: "PUT",
    body: JSON.stringify(data),
    cache: "no-store",
  });

  return await response.json();
};

export const updateStatusMCUComp = async (data) => {
  const response = await fetch(`${apiUrl}/mcu/updatestatus-comp`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
    method: "PUT",
    body: data,
    cache: "no-store",
  });

  return await response.json();
};

export const autoFinishMCUComp = async (data) => {
  const response = await fetch(`${apiUrl}/mcu/autofinish-comp`, {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    method: "PUT",
    body: JSON.stringify(data),
    cache: "no-store",
  });

  return await response.json();
};

export const CreateNewMCUComp = async (data) => {
  const response = await fetch(`${apiUrl}/mcu/create-new-comp`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
    method: "POST",
    body: data,
    cache: "no-store",
  });

  return await response.json();
};

export const importExcelMCUComp = async (data) => {
  const response = await fetch(`${apiUrl}/mcu/verif-excel-comp`, {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    method: "POST",
    body: JSON.stringify(data),
    cache: "no-store",
  });

  return await response.json();
};

export const updateStatusPasien = async (data) => {
  const response = await fetch(`${apiUrl}/mcu/updatestatus-pasien`, {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    method: "PUT",
    body: JSON.stringify(data),
    cache: "no-store",
  });

  return await response.json();
};

export const getListAntrianForPasien = async (grouptindakan, tindakan = null, tipe = null) => {

  const queryParams = new URLSearchParams({
    ...(tindakan && { tindakan }),
    ...(tipe && { tipe }),
  });

  const response = await fetch(`${apiUrl}/mcu/listantrian-pasien/${grouptindakan}?${queryParams}`, {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    method: "GET",
    cache: "no-store",
  });
  return await response.json();
};

export const getListAntrianKonsulForPasien = async () => {

  const response = await fetch(`${apiUrl}/mcu/listkonsultasi-pasien`, {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    method: "GET",
    cache: "no-store",
  });
  return await response.json();
};

export const getListAntrianPerTindakan = async (grouptindakan, tindakan = null, tipe = null) => {

  const queryParams = new URLSearchParams({
    ...(tindakan && { tindakan }),
    ...(tipe && { tipe }),
  });

  const response = await fetch(`${apiUrl}/mcu/listantrian-admin/${grouptindakan}?${queryParams}`, {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    method: "GET",
    cache: "no-store",
  });
  return await response.json();
};

export const getListAntrianKonsultasi = async (tindakan = null, tipe = null) => {

  const queryParams = new URLSearchParams({
    ...(tindakan && { tindakan }),
    ...(tipe && { tipe }),
  });

  const response = await fetch(`${apiUrl}/mcu/listkonsultasi-admin?${queryParams}`, {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    method: "GET",
    cache: "no-store",
  });
  return await response.json();
};

export const postListAntrianPerTindakan = async (tindakan) => {
  const response = await fetch(`${apiUrl}/mcu/autocallantrian/${tindakan}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
    method: "POST",
    cache: "no-store",
  });

  return await response.json();
};

export const finishAntrianPerTindakan = async (tindakan) => {
  const response = await fetch(`${apiUrl}/mcu/finishantrian/${tindakan}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
    method: "POST",
    cache: "no-store",
  });

  return await response.json();
};

export const postPanggilAntrianManual = async (Id) => {
  const response = await fetch(`${apiUrl}/mcu/call-manual/${Id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
    method: "POST",
    cache: "no-store",
  });

  return await response.json();
};

export const postFinishAntrianManual = async (Id, tindakan) => {
  const response = await fetch(`${apiUrl}/mcu/finish-manual/${Id}/${tindakan}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
    method: "POST",
    cache: "no-store",
  });

  return await response.json();
};

export const cancelMCU = async (noreg, idmcu) => {
  const response = await fetch(`${apiUrl}/mcu/cancelmcu/${noreg}/${idmcu}`, {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    method: "DELETE",
    cache: "no-store",
  });

  return await response.json();
};