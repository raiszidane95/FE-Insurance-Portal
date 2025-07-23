import React from "react";
import { jwtDecode } from 'jwt-decode';
import { CircleCheckBig, Eye, Info, ListOrdered, LucideListOrdered, Printer, QrCode, XIcon } from 'lucide-react';
import { Typography, IconButton, Button } from "@material-tailwind/react";

export default function DatatableOrderGizi({
  headers,
  data,
  displayFields,
  pagination,
  onEdit,
  onStatusMalam,
  onStatusSiang,
  onStatusPagi,
  onCancelMalam,
  onCancelSiang,
  onCancelPagi,
  onCheck,
  onQR,
  onPageChange,
  datetime = false,
  showEditColumn = false,
  showQR = false,
  showRekap = false,
  showButtonUpdateStatus = false,
  showJamMasuk = false,
  showKelasAsli = false,
  onRekapPagi,
  onRekapSiang,
  onRekapMalam,
  handlePrint
}) {

  const token = jwtDecode(localStorage.getItem("token"));

  const getPageNumbers = (currentPage, totalPages) => {
    const delta = 1;
    const pages = [];

    for (let i = 1; i <= totalPages; i++) {
      if (
        i == 1 ||
        i == totalPages ||
        (i >= currentPage - delta && i <= currentPage + delta)
      ) {
        pages.push(i);
      }
    }
    return pages;
  };

  const getStatusStyle = (status) => {
    switch (status) {
      case '1':
        return 'bg-red-50 text-red-500';
      case '2':
        return 'bg-yellow-100 text-amber-700';
      case '3':
        return 'bg-blue-50 text-blue-400';
      case '4':
        return 'bg-purple-50 text-purple-400';
      case '5':
        return 'bg-yellow-100 text-gray-700';
      case '6':
        return 'bg-[#D1F08E] text-[#4B9240]';
    }
  };

  return (
    <div>
      {data.length == 0 ? (
        <Typography variant="h6" color="blue-gray" className="font-normal text-center">
          Data tidak ada
        </Typography>
      ) : (
        <>
          <table className="w-full min-w-max table-auto text-left">
            <thead>
              <tr>
                {headers.map((head) => (
                  <th
                    key={head}
                    className="border-y border-blue-gray-100 bg-blue-gray-50/50 p-4"
                  >
                    <div className="flex items-center gap-2">
                      <Typography
                        variant="small"
                        color="blue-gray"
                        className="font-normal leading-none opacity-70"
                      >
                        {head}
                      </Typography>

                      {showRekap && ['Pagi', 'Siang', 'Malam'].includes(head) && (
                        <>
                          <Printer
                            className={`text-blue-500 border-2 h-7 w-7 cursor-pointer`}
                            onClick={() => {
                              if (head === 'Pagi' && handlePrint) handlePrint(1);
                              else if (head === 'Siang' && handlePrint) handlePrint(2);
                              else if (head === 'Malam' && handlePrint) handlePrint(3);
                            }}
                          />
                          <LucideListOrdered
                            className="w-7 h-7 border-2 text-green-500 cursor-pointer hover:text-green-700"
                            onClick={() => {
                              if (head === 'Pagi' && onRekapPagi) onRekapPagi();
                              else if (head === 'Siang' && onRekapSiang) onRekapSiang();
                              else if (head === 'Malam' && onRekapMalam) onRekapMalam();
                            }}
                          />
                        </>
                      )}
                    </div>
                  </th>
                ))}

                {(showEditColumn) && (
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
                return (
                  <tr key={row.Id} data-row-id={row.Id}>
                    <td className="p-4 border border-blue-gray-50 max-w-[50px]">
                      <Typography variant="small" color="blue-gray" className="font-normal">
                        {index + 1}
                      </Typography>
                    </td>
                    {displayFields.map((field) => (
                      <td
                        key={field}
                        className={`p-4 border border-blue-gray-50 ${['Makan_Pagi', 'Makan_Siang', 'Makan_Malam'].includes(field)
                          ? 'align-top max-w-[205px]'
                          : ['Info_Pasien', 'Nama_RuangM'].includes(field)
                            ? 'max-w-[195px]'
                            : field == 'Note_Pasien'
                              ? 'max-w-[180px]'
                              : 'align-middle w-auto'
                          }`}
                      >
                        {
                          (field == 'Diet' || field == 'Bentuk_Diet') ? (
                            <Typography
                              variant="small"
                              color="blue-gray"
                              className="font-normal break-words whitespace-normal line-clamp-3 flex flex-col gap-1"
                            >
                              {Array.isArray(row[field]) && row[field].length > 0
                                ? row[field].map((diet, index) => (
                                  <span key={index} className="block">
                                    {index + 1}. {diet}
                                  </span>
                                ))
                                : "-"}
                            </Typography>
                          ) :
                            (field == 'Note_Pasien') ? (
                              <Typography
                                variant="small"
                                color="blue-gray"
                                className="font-normal break-words whitespace-normal line-clamp-3 flex flex-col gap-1"
                              >
                                {row[field] || ''}
                              </Typography>
                            ) :
                              (field == 'Makan_Pagi' || field == 'Makan_Siang' || field == 'Makan_Malam') ? (
                                <>
                                  <div>
                                    {field == 'Makan_Pagi' && row.Status_Makan_Pagi && (
                                      <span className={`text-sm px-2 py-0.5 rounded-full ${getStatusStyle(row.Status_Makan_Pagi)}`}>
                                        {row.Detail_Status_Makan_Pagi}
                                      </span>
                                    )}
                                    {field == 'Makan_Siang' && row.Status_Makan_Siang && (
                                      <span className={`text-sm px-2 py-0.5 rounded-full ${getStatusStyle(row.Status_Makan_Siang)}`}>
                                        {row.Detail_Status_Makan_Siang}
                                      </span>
                                    )}
                                    {field == 'Makan_Malam' && row.Status_Makan_Malam && (
                                      <span className={`text-sm px-2 py-0.5 rounded-full ${getStatusStyle(row.Status_Makan_Malam)}`}>
                                        {row.Detail_Status_Makan_Malam}
                                      </span>
                                    )}
                                  </div>
                                  <div className="flex items-center justify-between gap-1">
                                    <div>
                                      <Typography
                                        variant="small"
                                        color="blue-gray"
                                        className="font-normal break-words whitespace-normal line-clamp-3 flex flex-col gap-1 mt-2"
                                      >
                                        {Array.isArray(row[field]) && row[field].length > 0
                                          ? row[field].map((menu, index) => (
                                            <span key={index} className="block">
                                              {index + 1}. {menu}
                                            </span>
                                          ))
                                          : "-"}
                                      </Typography>
                                    </div>
                                    {showButtonUpdateStatus &&
                                      <div>
                                        {field == 'Makan_Pagi' && row.Status_Makan_Pagi && (
                                          <span className={`text-sm px-2 py-0.5 rounded-full`}>
                                            {row[field] && (
                                              (token.Role == "7" && row.Status_Makan_Pagi == "1") ||
                                              (token.Role == "8" && (row.Status_Makan_Pagi == "2" || row.Status_Makan_Pagi == "3")) ||
                                              (token.Role == "9" && (row.Status_Makan_Pagi == "4" || row.Status_Makan_Pagi == "5"))
                                            ) ? (
                                              <CircleCheckBig className="h-10 w-10 cursor-pointer bg-blue-100 p-2 hover:bg-blue-300 rounded-xl" onClick={() => onStatusPagi && onStatusPagi(row)} />
                                            ) : null}
                                          </span>
                                        )}

                                        {field == 'Makan_Pagi' && row.Status_Makan_Pagi && (
                                          <span className={`text-sm px-2 py-0.5 rounded-full`}>
                                            {row[field] && (
                                              (token.Role == "7" && row.Status_Makan_Pagi == "2")
                                            ) ? (
                                              <XIcon className="h-10 w-10 cursor-pointer bg-red-100 p-2 hover:bg-red-300 rounded-xl" onClick={() => onCancelPagi && onCancelPagi(row)} />
                                            ) : null}
                                          </span>
                                        )}

                                        {field == 'Makan_Siang' && row.Status_Makan_Siang && (
                                          <span className={`text-sm px-2 py-0.5 rounded-full`}>
                                            {row[field] && (
                                              (token.Role == "7" && row.Status_Makan_Siang == "1") ||
                                              (token.Role == "8" && (row.Status_Makan_Siang == "2" || row.Status_Makan_Siang == "3")) ||
                                              (token.Role == "9" && (row.Status_Makan_Siang == "4" || row.Status_Makan_Siang == "5"))
                                            ) ? (
                                              <CircleCheckBig className="h-10 w-10 cursor-pointer bg-blue-100 p-2 hover:bg-blue-300 rounded-xl" onClick={() => onStatusSiang && onStatusSiang(row)} />
                                            ) : null}
                                          </span>
                                        )}

                                        {field == 'Makan_Siang' && row.Status_Makan_Siang && (
                                          <span className={`text-sm px-2 py-0.5 rounded-full`}>
                                            {row[field] && (
                                              (token.Role == "7" && row.Status_Makan_Siang == "2")
                                            ) ? (
                                              <XIcon className="h-10 w-10 cursor-pointer bg-red-100 p-2 hover:bg-red-300 rounded-xl" onClick={() => onCancelSiang && onCancelSiang(row)} />
                                            ) : null}
                                          </span>
                                        )}

                                        {field == 'Makan_Malam' && row.Status_Makan_Malam && (
                                          <span className={`text-sm px-2 py-0.5 rounded-full`}>
                                            {row[field] && (
                                              (token.Role == "7" && row.Status_Makan_Malam == "1") ||
                                              (token.Role == "8" && (row.Status_Makan_Malam == "2" || row.Status_Makan_Malam == "3")) ||
                                              (token.Role == "9" && (row.Status_Makan_Malam == "4" || row.Status_Makan_Malam == "5"))
                                            ) ? (
                                              <CircleCheckBig className="h-10 w-10 cursor-pointer bg-blue-100 p-2 hover:bg-blue-300 rounded-xl" onClick={() => onStatusMalam && onStatusMalam(row)} />
                                            ) : null}
                                          </span>
                                        )}

                                        {field == 'Makan_Malam' && row.Status_Makan_Malam && (
                                          <span className={`text-sm px-2 py-0.5 rounded-full`}>
                                            {row[field] && (
                                              (token.Role == "7" && row.Status_Makan_Malam == "2")
                                            ) ? (
                                              <XIcon className="h-10 w-10 cursor-pointer bg-red-100 p-2 hover:bg-red-300 rounded-xl" onClick={() => onCancelMalam && onCancelMalam(row)} />
                                            ) : null}
                                          </span>
                                        )}
                                      </div>
                                    }
                                  </div>
                                </>
                              ) :
                                (field == 'Info_Pasien') ? (
                                  <div className="flex items-center justify-between gap-1">
                                    <div>
                                      <Typography
                                        variant="small"
                                        color="blue-gray"
                                        className="font-normal break-words whitespace-normal line-clamp-3 flex items-center gap-2"
                                      >
                                        {row[field] || "-"}
                                      </Typography>

                                      {row?.DietFix && (
                                        <Typography
                                          variant="small"
                                          color="blue"
                                          className="font-normal break-words whitespace-normal line-clamp-3"
                                        >
                                          Diet = {Array.isArray(row?.DietFix) && row?.DietFix.length > 0
                                            ? `(${row.DietFix.join(', ')})`
                                            : "-"}
                                        </Typography>
                                      )}

                                      {Array.isArray(row?.isPuasa) && row.isPuasa.length > 0 && (
                                        <div className="space-y-1">
                                          <p className="text-sm font-semibold text-red-600">Jadwal Puasa:</p>
                                          {row.isPuasa.map((jadwal, idx) => (
                                            <p key={idx} className="text-xs text-red-500 font-medium leading-tight">
                                              {jadwal}
                                            </p>
                                          ))}
                                        </div>
                                      )}

                                      {(showJamMasuk) && (
                                        <Typography
                                          variant="small"
                                          className="font-normal break-words whitespace-normal line-clamp-3"
                                        >
                                          Jam Masuk: {row?.Jam} WIB
                                        </Typography>
                                      )}

                                    </div>
                                    <div>
                                      <span className={`text-sm px-2 py-0.5 rounded-full`}>
                                        {<Info className="h-5 w-5 text-green-400" onClick={() => onCheck && onCheck(row)} />}
                                      </span>
                                    </div>
                                  </div>
                                ) :
                                  (field == 'Nama_RuangM') ? (
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
                                        {(showQR) && (
                                          <div>
                                            <span className={`text-sm px-2 py-0.5 rounded-full`}>
                                              {<QrCode className="h-5 w-5 text-green-400" onClick={() => onQR && onQR(row)} />}
                                            </span>
                                          </div>
                                        )}
                                      </div>
                                      {showKelasAsli && (
                                        <p>
                                          {row?.Nama_Kelas_Asli}
                                          {row?.Kode_Bayar ? ` - ${row.Kode_Bayar}` : ''}
                                        </p>
                                      )}
                                    </>
                                  ) :
                                    (
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
                                        {['Created_At'].includes(field)
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
                    {(showEditColumn) && (
                      <td className="p-2 w-auto border border-blue-gray-50">
                        {showEditColumn &&
                          <Button className="p-2.5 bg-white border border-black text-black" onClick={() => onEdit && onEdit(row)}>Ubah Order</Button>
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
                          variant={pagination.page == page ? "filled" : "outlined"}
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
                      variant={pagination.page == page ? "filled" : "outlined"}
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

