const apiUrl = import.meta.env.VITE_IMAGE;
import React, { useEffect, useRef, useState } from "react";
import { Typography, IconButton, Tooltip, Button, Checkbox } from "@material-tailwind/react";
import { PencilIcon, TrashIcon } from "@heroicons/react/24/solid";
import { Link } from "react-router-dom";
import { BedSingle, CalendarDays, Check, CircleCheckBig, Eye, FileDown, HeartPulse, InfoIcon, Stethoscope, XCircle, XIcon } from 'lucide-react';

export default function Datatable({
  headers,
  data,
  displayFields,
  pagination,
  onEdit,
  onPaket,
  onKelas,
  onJadwal,
  onDiet,
  onInputDiet,
  onCheckin,
  onShowData,
  onDelete,
  onDeletePuasa,
  onEditDiet,
  onDeleteDiet,
  onPuasa,
  onPageChange,
  eyeTindakan = false,
  datetime = false,
  showEditColumn = false,
  showCheckinColumn = false,
  showDataColumn = false,
  showPaketColumn = false,
  showKelasColumn = false,
  showJadwalColumn = false,
  showCancelColumn = false,
  showDietColumn = false,
  showInputDietColumn = false,
  showDeleteColumn = false,
  showPuasaColumn = false,
  linkField,
  linkPrefix,
  isMulti = false,
  onMultiEdit,
  termMulti = null,
  detailTindakanFunct = false,
  sizeFoto = 300
}) {
  const selectAllRef = useRef(null);
  const [selectedRows, setSelectedRows] = useState([]);
  const [selectedData, setSelectedData] = useState([]);

  const handleRowSelect = (row) => {
    setSelectedRows((prev) => {
      const newSelectedRows = prev.includes(row.Id) ? prev.filter((rowId) => rowId !== row.Id) : [...prev, row.Id]
      return newSelectedRows
    })

    setSelectedData((prev) => {
      const newSelectedData = prev.some((item) => item.Id === row.Id)
        ? prev.filter((item) => item.Id !== row.Id)
        : [...prev, row]
      return newSelectedData
    })
  }

  const handleSelectAll = () => {
    // Dapatkan ID dari baris yang sudah dipilih
    const selectedIdsSet = new Set(selectedRows);

    // Ambil ID dari data yang belum dipilih sebelumnya
    const newSelectedRows = data
      .filter(row => !selectedIdsSet.has(row.Id) && row.Status_MCU === termMulti)
      .map(row => row.Id);

    // Jika semua sudah dipilih, maka batalkan semua
    if (selectedRows.length === data.length) {
      setSelectedRows([]);
      setSelectedData([]);
    } else {
      setSelectedRows([...selectedRows, ...newSelectedRows]);
      setSelectedData([...selectedData, ...data.filter(row => newSelectedRows.includes(row.Id))]);
    }
  };

  useEffect(() => {
    if (selectAllRef.current) {
      selectAllRef.current.indeterminate =
        selectedRows.length > 0 &&
        data.some(row => row.Status_MCU == termMulti && !selectedRows.includes(row.Id));
    }
  }, [selectedRows, data, termMulti]);


  const handleMultiEdit = () => {
    if (onMultiEdit) {
      onMultiEdit(selectedRows, selectedData);
    }
  };

  const formatDate = (date) => {
    const day = date.getUTCDate().toString().padStart(2, '0');
    const month = new Intl.DateTimeFormat('en-US', { month: 'short' }).format(
      new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), 1))
    );
    const hours = date.getUTCHours().toString().padStart(2, '0');
    const minutes = date.getUTCMinutes().toString().padStart(2, '0');
    const year = date.getUTCFullYear().toString(); // ambil 2 digit terakhir
    return `${day} ${month} ${year} ${hours}:${minutes}`;
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

  return (
    <div>
      {isMulti && selectedRows.length > 0 && (
        <Button onClick={handleMultiEdit} className="mb-4 ml-4">
          Edit Selected ({selectedRows.length})
        </Button>
      )}
      {data.length === 0 ? (
        <Typography variant="h6" color="blue-gray" className="font-normal text-center">
          Data tidak ada
        </Typography>
      ) : (
        <>
          <table className="w-full min-w-max table-auto text-left">
            <thead>
              <tr>
                {isMulti && (
                  <th className="border-y border-blue-gray-100 bg-blue-gray-50/50 p-4">
                    <Checkbox
                      ref={selectAllRef}  // Set ref ke element
                      checked={
                        data.length > 0 &&
                        data.filter(row => row.Status_MCU == termMulti).every(row => selectedRows.includes(row.Id))
                      }
                      onChange={handleSelectAll}
                    />
                  </th>
                )}

                {headers.map((head) => (
                  <th
                    key={head}
                    className="border-y border-blue-gray-100 bg-blue-gray-50/50 p-4"
                  >
                    <Typography
                      variant="small"
                      color="blue-gray"
                      className="font-normal leading-none opacity-70"
                    >
                      {head}
                    </Typography>
                  </th>
                ))}
                {(showEditColumn || showDeleteColumn || showCheckinColumn || showPaketColumn || showDataColumn || showKelasColumn || showDietColumn || showJadwalColumn || showCancelColumn || showInputDietColumn || showPuasaColumn) && (
                  <th className="border-y border-blue-gray-100 bg-blue-gray-50/50 p-4">
                    <Typography
                      variant="small"
                      color="blue-gray"
                      className="font-normal leading-none opacity-70"
                    >
                      Actions
                    </Typography>
                  </th>
                )}
              </tr>
            </thead>
            <tbody>
              {data.map((row, index) => {
                const isLast = index === data.length - 1;
                const classes = isLast
                  ? "p-4 max-w-[250px]"
                  : "p-4 border-b border-blue-gray-50 max-w-[250px]";

                return (
                  <tr key={row.Id}>
                    {isMulti && (
                      <td className={classes}>
                        {row.Status_MCU == termMulti ? (
                          <div className="flex items-center gap-2">
                            <Checkbox
                              checked={selectedRows.includes(row.Id)}
                              onChange={() => handleRowSelect(row)}
                            />
                          </div>
                        ) : (
                          <div className="flex items-center gap-2">
                            <Check className="w-5 text-green-400" />
                          </div>
                        )
                        }
                      </td>
                    )}
                    <td className={classes}>

                      <Typography variant="small" color="blue-gray" className="font-normal">
                        {index + 1}
                      </Typography>

                    </td>
                    {displayFields.map((field) => (
                      <td key={field} className={classes}>
                        {(field === 'Gambar' || field === 'Image') && row[field] ? (
                          <img
                            src={apiUrl + '/' + row[field]}
                            className={`w-[${sizeFoto}px] object-cover rounded-lg`}
                            alt="Gambar"
                          />
                        ) : field === 'Excel' ? (
                          <div className="pt-1">
                            <a
                              href={`${apiUrl}/${row[field]}`}
                              download
                              className="inline-flex items-center gap-2 text-sm font-medium text-blue-600 hover:text-blue-700"
                            >
                              <FileDown className="w-4 h-4" />
                              Download
                            </a>
                          </div>
                        ) : field === linkField ? (
                          <Link to={`${linkPrefix}/${row.Id}`}>
                            <Typography variant="small" color="blue-gray" className="font-normal text-blue-500 hover:underline">
                              {row[field]}
                            </Typography>
                          </Link>
                        ) : (field === 'Diet' || field === 'Bentuk_Diet' || field === 'Diet') ? (
                          <Typography
                            variant="small"
                            color="blue-gray"
                            className="font-normal break-words whitespace-normal line-clamp-3 flex flex-col gap-1"
                          >
                            {Array.isArray(row[field]) && row[field].length > 0
                              ? row[field].map((diet, index) => (
                                <span key={index} className="block">
                                  {index + 1}. {diet} {/* Index mulai dari 1 */}
                                </span>
                              ))
                              : "-"}
                          </Typography>
                        ) : (field === 'Informasi_Diet') ? (
                          <div className="text-sm break-words whitespace-normal">
                            {Array.isArray(row[field]) && row[field].length > 0 ? (
                              row[field].map((dietGroup, index) => {

                                const tgldiet = new Date(dietGroup?.Tgl)

                                return (
                                  <div key={index} className="w-full">
                                    <div className="text-[13px] text-black flex items-center">
                                      <div className="w-full">
                                        <div className="font-semibold">{index + 1}. Tgl {formatDate(tgldiet)}</div>
                                        {dietGroup.Diet && (
                                          <div>Diet: {dietGroup.Diet.join(', ')}</div>
                                        )}
                                        {dietGroup.Bentuk_Diet && (
                                          <div>Bentuk Diet: {dietGroup.Bentuk_Diet.join(', ')}</div>
                                        )}
                                        {dietGroup.Catatan && (
                                          <div>Catatan: {dietGroup.Catatan}</div>
                                        )}
                                      </div>
                                      <div>
                                        <Tooltip content="Edit">
                                          <IconButton variant="text" onClick={() => onEditDiet && onEditDiet(row?.Informasi_Diet?.[index], row)}>
                                            <PencilIcon className="h-4 w-4 text-blue-500" />
                                          </IconButton>
                                        </Tooltip>
                                        <Tooltip content="Hapus">
                                          <IconButton variant="text" onClick={() => onDeleteDiet && onDeleteDiet(row?.Informasi_Diet?.[index], row?.No_Reg)}>
                                            <XCircle className="h-5 w-5 text-red-500" />
                                          </IconButton>
                                        </Tooltip>
                                      </div>
                                    </div>
                                    {index < row[field].length - 1 && (
                                      <hr className="my-1 border-gray-300" />
                                    )}
                                  </div>
                                );
                              })
                            ) : (
                              <Typography variant="small" color="blue-gray" className="font-normal">-</Typography>
                            )}
                          </div>
                        ) : (field == 'Nama_RuangM') ? (
                          <>
                            <div className="flex items-center justify-between gap-1">
                              <div>
                                <Typography
                                  variant="small"
                                  color="blue-gray"
                                  className="font-normal break-words whitespace-normal line-clamp-3 flex items-center gap-2"
                                >
                                  {row[field] || "-"}
                                </Typography>
                              </div>
                             
                            </div>
                            {row.Nama_Kelas_Asli && (
                              <p>
                                {row?.Nama_Kelas_Asli}
                                {row?.Kode_Bayar ? ` - ${row.Kode_Bayar}` : ''}
                              </p>
                            )}
                          </>
                        ) : (field === 'total_order') ? (
                          <Typography
                            variant="small"
                            color="blue-gray"
                            className="font-normal break-words whitespace-normal line-clamp-3 flex items-center gap-2"
                          >
                            {row[field] || "0"}
                          </Typography>
                        ) :
                          (field == 'Info_Pasien') ?
                            (
                              <div>
                                <div>
                                  <Typography
                                    variant="small"
                                    color="blue-gray"
                                    className="font-normal break-words whitespace-normal line-clamp-3 flex items-center gap-2"
                                  >
                                    {row[field] || "-"}
                                  </Typography>
                                </div>
                                {row?.isPuasa && (
                                  <div>
                                    <Typography
                                      variant="small"
                                      color="red"
                                      className="font-bold break-words whitespace-normal line-clamp-3 flex items-center gap-2 capitalize"
                                    >
                                      {row?.isPuasa}
                                    </Typography>
                                  </div>
                                )}
                              </div>
                            ) :
                            (field == 'Puasa') ?
                              (
                                <div className="flex flex-col gap-1">
                                  {Array.isArray(row[field]) && row[field].length > 0 ? (
                                    row[field].map((puasa, index) => {
                                      const start = new Date(puasa?.Start_At);
                                      const finish = new Date(puasa?.Finish_At);

                                      return (
                                        <div key={index} className="w-full">
                                          <div className="text-[13px] text-black flex items-center">
                                            <div>
                                              {index + 1}. {formatDate(start)} s.d {formatDate(finish)}<br />
                                              {puasa?.Note && (
                                                <p>
                                                  Note = {puasa?.Note}
                                                </p>)
                                              }
                                            </div>
                                            <div>
                                              <Tooltip content="Hapus">
                                                <IconButton variant="text" onClick={() => onDeletePuasa && onDeletePuasa(row?.Puasa?.[index])}>
                                                  <XCircle className="h-5 w-5 text-red-500" />
                                                </IconButton>
                                              </Tooltip>
                                            </div>
                                          </div>
                                          {index < row[field].length - 1 && (
                                            <hr className="my-1 border-gray-300" />
                                          )}
                                        </div>
                                      );
                                    })
                                  ) : (
                                    <Typography
                                      variant="small"
                                      color="blue-gray"
                                      className="font-normal"
                                    >
                                      -
                                    </Typography>
                                  )}
                                </div>
                              )
                              :
                              (field === 'Nama_Pasien') ?
                                (
                                  <Typography
                                    variant="small"
                                    color="blue-gray"
                                    className="font-normal break-words whitespace-normal line-clamp-3 flex items-center gap-2"
                                  >
                                    {row[field] || "-"}
                                    {eyeTindakan && (
                                      <Eye className="h-4 w-4 text-green-400" onClick={() => detailTindakanFunct && detailTindakanFunct(row)} />
                                    )}
                                  </Typography>
                                ) : (
                                  <Typography
                                    variant="small"
                                    color="blue-gray"
                                    className={`font-normal break-words whitespace-normal line-clamp-3 ${(field == 'Status_MCU_Detail' || field == 'Status_Detail')
                                      ? (row[field] == 'Selesai' || row[field] == 'Aktif')
                                        ? 'text-green-500'
                                        : (row[field] == 'Belum Checkin' || row[field] == 'Batal MCU' || row[field] == 'Tidak Aktif')
                                          ? 'text-red-500'
                                          : (row[field] == 'Di Antrian' || row[field] == 'Dalam Proses MCU')
                                            ? 'text-blue-500'
                                            : ''
                                      : ''
                                      }`}
                                  >
                                    {['Created_At', 'Checkin_At', 'Finished_At', 'Process_At', 'Booking_At'].includes(field)
                                      ? (row[field]
                                        ?
                                        <>
                                          {(() => {
                                            const date = new Date(row[field]);
                                            const day = date.getUTCDate().toString().padStart(2, '0');
                                            const month = new Intl.DateTimeFormat('en-US', { month: 'short' }).format(new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), 1)));
                                            const year = date.getUTCFullYear();
                                            return `${day} ${month} ${year}`;
                                          })()}
                                          <br />
                                          {datetime && (() => {
                                            const date = new Date(row[field]);
                                            const hours = date.getUTCHours().toString().padStart(2, '0');
                                            const minutes = date.getUTCMinutes().toString().padStart(2, '0');
                                            const seconds = date.getUTCSeconds().toString().padStart(2, '0');
                                            return `${hours}:${minutes}:${seconds} WIB`;
                                          })()}
                                        </>
                                        : "-")
                                      : (row[field] || "-")
                                    }
                                  </Typography>
                                )
                        }
                      </td>
                    ))}
                    {(showEditColumn || showDeleteColumn || showCheckinColumn || showPaketColumn || showDataColumn || showKelasColumn || showDietColumn || showJadwalColumn || showCancelColumn || showPuasaColumn || showInputDietColumn) && (
                      <td className={classes}>
                        {showEditColumn &&
                          <Tooltip content="Edit">
                            <IconButton variant="text" onClick={() => onEdit && onEdit(row)}>
                              <PencilIcon className="h-4 w-4" />
                            </IconButton>
                          </Tooltip>
                        }
                        {showDeleteColumn &&
                          <Tooltip content="Delete">
                            <IconButton variant="text" onClick={() => onDelete && onDelete(row)}>
                              <TrashIcon className="h-4 w-4" />
                            </IconButton>
                          </Tooltip>
                        }
                        {showDataColumn &&
                          <Tooltip content="Check in">
                            <IconButton variant="text" onClick={() => onShowData && onShowData(row)}>
                              <InfoIcon className="h-4 w-4" />
                            </IconButton>
                          </Tooltip>
                        }
                        {showCheckinColumn &&
                          <Tooltip content="Check in">
                            <IconButton variant="text" onClick={() => onCheckin && onCheckin(row)}>
                              <CircleCheckBig className="h-4 w-4" />
                            </IconButton>
                          </Tooltip>
                        }
                        {showPaketColumn &&
                          <Tooltip content="Detail Paket">
                            <IconButton variant="text" onClick={() => onPaket && onPaket(row)}>
                              <Stethoscope className="h-4 w-4" />
                            </IconButton>
                          </Tooltip>
                        }
                        {showKelasColumn &&
                          <Tooltip content="Assign Menu - Kelas">
                            <IconButton variant="text" onClick={() => onKelas && onKelas(row)}>
                              <BedSingle className="h-4 w-4" />
                            </IconButton>
                          </Tooltip>
                        }
                        {showDietColumn &&
                          <Tooltip content="Assign Menu - Diet">
                            <IconButton variant="text" onClick={() => onDiet && onDiet(row)}>
                              <HeartPulse className="h-4 w-4" />
                            </IconButton>
                          </Tooltip>
                        }
                        {showJadwalColumn &&
                          <Tooltip content="Assign Menu - Jadwal">
                            <IconButton variant="text" onClick={() => onJadwal && onJadwal(row)}>
                              <CalendarDays className="h-4 w-4" />
                            </IconButton>
                          </Tooltip>
                        }
                        {showCancelColumn &&
                          <Tooltip content="Cancel MCU">
                            <IconButton variant="text" onClick={() => onDelete && onDelete(row)}>
                              <XCircle className="h-5 w-5 text-red-500" />
                            </IconButton>
                          </Tooltip>
                        }
                        {showInputDietColumn &&
                          <Button className="px-3 py-1.5 hover:bg-gray-200" variant="outlined" onClick={() => onInputDiet && onInputDiet(row)}>
                            Diet Baru
                          </Button>
                        }
                        {showPuasaColumn &&
                          <Button className="px-3 py-1.5 ml-1 hover:bg-gray-200" variant="outlined" onClick={() => onPuasa && onPuasa(row)}>
                            Puasa
                          </Button>
                        }
                      </td>
                    )}
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
        </>
      )}
    </div>
  );
}

