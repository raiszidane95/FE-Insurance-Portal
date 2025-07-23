export const formatedDate = (dateString) => {
  if (!dateString) return null;
  const date = new Date(dateString);
  return date.toLocaleDateString('id-ID', { day: '2-digit', month: 'long', year: 'numeric' });
};

export const formatedDateShort = (dateString) => {
  if (!dateString) return null;
  const date = new Date(dateString);
  const day = date.getDate().toString().padStart(2, '0');
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const year = date.getFullYear();

  return `${day}/${month}/${year}`;
};

export const formatedTime = (dateTimeString) => {
  if (!dateTimeString) return null;

  try {
    // Konversi string ke objek tanggal
    const date = new Date(dateTimeString);

    // Mendapatkan jam dan menit UTC
    const hours = date.getUTCHours().toString().padStart(2, '0');
    const minutes = date.getUTCMinutes().toString().padStart(2, '0');

    // Mengembalikan waktu dalam format yang diminta
    return `${hours}:${minutes}`;
  } catch (error) {
    console.error("Invalid dateTimeString: ", error);
    return null;
  }
};

/** 
 * Input: "dd/mm/yyyy"
 * Output: "Senin, 12 Maret 2023"
 */
export const formatTanggalLongID = (tanggalStr) => {
  // Pisahkan string berdasarkan '/'
  const [day, month, year] = tanggalStr.split('/');

  // Buat objek Date dari string
  const dateObj = new Date(`${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`);

  // Format tanggal menggunakan toLocaleDateString
  const formattedDate = dateObj.toLocaleDateString('id-ID', {
    weekday: 'long', // Nama hari
    day: '2-digit', // Tanggal
    month: 'long', // Nama bulan
    year: 'numeric' // Tahun
  });

  return formattedDate;
};

