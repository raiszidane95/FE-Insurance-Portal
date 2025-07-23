const getStatusColor = (data) => {
  if (data?.ketbatal !== null) {
    return 'bg-danger/50 text-red-800';
  }
  if (!data?.StatusCheckin) {
    return 'bg-primaryOrange text-brown-800';
  }
  if (data?.Status === 'FINIS') {
    return 'bg-leafGreen text-white';
  }
  if (data?.Status === 'ANTRI') {
    return 'bg-white text-secondaryCyan outline outline-[1px] outline-secondaryCyan';
  }
  if (data?.Status === 'CALL') {
    return 'text-secondaryCyan bg-softCyan '
  }
  if (data?.Status === 'LEWAT') {
    return 'bg-primaryGray/20 text-charcoal';
  }
 
}

const getStatusAntrian = (data) => {
  if (data?.ketbatal !== null) {
    return 'Batal';
  }
  if (!data?.StatusCheckin) {
    return 'Belum Checkin';
  }
  if (data?.Status === 'FINIS') {
    return 'Selesai';
  }
  if (data?.Status === 'ANTRI') {
    return 'Dalam Antrian';
  }
  if (data?.Status === 'CALL') {
    return 'Sedang Berlangsung';
  }
  if (data?.Status === 'LEWAT') {
    return 'Terlewat';
  }
}

export { getStatusColor, getStatusAntrian };