const apiUrl = import.meta.env.VITE_URL;
const token = localStorage.getItem("token")

export const logs = async () => {
  const response = await fetch(`${apiUrl}/logs`, {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    method: "GET",
    cache: "no-store",
  });
  return await response.json();
}

export const LoginApi = async (data) => {
  const response = await fetch(`${apiUrl}/login`, {
    headers: {
      "Content-Type": "application/json",
    },
    method: "POST",
    body: JSON.stringify(data),
    cache: "no-store",
  });

  return await response.json();
};

export const CekEligibilitasApi = async (data) => {
  const response = await fetch(`${apiUrl}/cek-eligibilitas`, {
    headers: {
      "Content-Type": "application/json",
    },
    method: "POST",
    body: JSON.stringify(data),
    cache: "no-store",
  });

  return await response.json();
};

export const ListPoliInhealth = async (data) => {
  const response = await fetch(`${apiUrl}/poli-inhealth`, {
    headers: {
      "Content-Type": "application/json",
    },
    method: "POST",
    body: JSON.stringify(data),
    cache: "no-store",
  });

  return await response.json();
};

export const MockCekEligibilitasApi = async (data) => {
  const response = await fetch(`${apiUrl}/mock/cek-eligibilitas/success`, {
    headers: {
      "Content-Type": "application/json",
    },
    method: "POST",
    body: JSON.stringify(data),
    cache: "no-store",
  });

  return await response.json();

};

export const getMRefPasien = async () => {
  const response = await fetch(`${apiUrl}/m-ref-pasien`, {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    method: "GET",
    cache: "no-store",
  });

  return await response.json();
};

export const patients = async (search = '') => {
  const response = await fetch(`${apiUrl}/patients?search=${search}`, {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    method: "GET",
    cache: "no-store",
  });

  return await response.json();
};

export const cekRegister = async (No_MR) => {
  const response = await fetch(`${apiUrl}/cek-register/${No_MR}`, {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    method: "GET",
    cache: "no-store",
  });

  return await response.json();
};

export const getMSourcePasien = async () => {
  const response = await fetch(`${apiUrl}/m-source-pasien`, {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    method: "GET",
    cache: "no-store",
  });

  return await response.json();
};

export const getReferensi = async (page = 1, limit = 10, search = '', TipeYankes = '', id = '') => {
  const queryParams = new URLSearchParams({
    page: page.toString(),
    limit: limit.toString(),
    ...(search && { search }),
    ...(TipeYankes && { TipeYankes }),
    ...(id && { id })
  });

  const response = await fetch(`${apiUrl}/master_referensi?${queryParams}`, {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    method: "GET",
    cache: "no-store",
  });

  return await response.json();
};

export const listAsuransi = async (search = '',) => {
  const queryParams = new URLSearchParams({
    ...(search && { search }),
  });

  const response = await fetch(`${apiUrl}/insurance-list?${queryParams}`, {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    method: "GET",
    cache: "no-store",
  });

  return await response.json();
};

export const listSJP = async () => {
  const response = await fetch(`${apiUrl}/list-sjp`, {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    method: "GET",
    cache: "no-store",
  });

  return await response.json();
};

export const icdList = async () => {
  const response = await fetch(`${apiUrl}/icd-list`, {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    method: "GET",
    cache: "no-store",
  });

  return await response.json();
};

export const createPendaftaranSJP = async (data) => {
  const response = await fetch(`${apiUrl}/simpan-sjp`, {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(data),
    method: "POST",
    cache: "no-store",
  });

  return await response.json();
};

export const postKartuAsuransi = async (data) => {
  const response = await fetch(`${apiUrl}/kartu-asuransi`, {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(data),
    method: "POST",
    cache: "no-store",
  });

  return await response.json();
};


export const cetakSJP = async (data) => {
  const response = await fetch(`${apiUrl}/cetak-sjp`, {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(data),
    method: "POST",
    cache: "no-store",
  });

  return await response.json();
};