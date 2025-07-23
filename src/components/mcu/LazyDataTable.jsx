import { Eye } from 'lucide-react';
import React, { useState, useEffect, useRef } from "react";
import { Typography, Button } from "@material-tailwind/react";

const ITEMS_PER_PAGE = 20;

export default function LazyDataTable({
    headers,
    data,
    displayFields,
    datetime = false,
    customStyles = {},
    showAntrianColumn = false,
    showDetailTindakan = false,
    status = false,
    detailTindakanFunct = false,
    selesaikanAntrianManual = false,
    panggilAntrianManual = false
}) {
    const [visibleData, setVisibleData] = useState([]);
    const [page, setPage] = useState(1);
    const loaderRef = useRef(null);

    useEffect(() => {
        setVisibleData(data.slice(0, ITEMS_PER_PAGE));
    }, [data]);

    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                if (entries[0].isIntersecting && visibleData.length < data.length) {
                    setPage((prevPage) => prevPage + 1);
                }
            },
            { threshold: 1.0 }
        );

        if (loaderRef.current) {
            observer.observe(loaderRef.current);
        }

        return () => {
            if (loaderRef.current) {
                observer.unobserve(loaderRef.current);
            }
        };
    }, [visibleData, data]);

    useEffect(() => {
        setVisibleData(data.slice(0, page * ITEMS_PER_PAGE));
    }, [page, data]);

    return (
        <div>
            <table className="w-full min-w-max table-auto text-left">
                <thead>
                    <tr>
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
                        {(showAntrianColumn) && (
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
                    {visibleData.length > 0 ? (
                        visibleData.map((row, index) => {
                            const isLast = index === visibleData.length - 1;
                            const classes = isLast
                                ? "p-4"
                                : "p-4 border-b border-blue-gray-50";

                            return (
                                <tr key={row.Id}>
                                    <td className={classes}>
                                        <Typography variant="small" color="blue-gray" className="font-normal">
                                            {index + 1}
                                        </Typography>
                                    </td>
                                    {displayFields.map((field) => (
                                        <td key={field} className={classes}>
                                            <Typography
                                                variant="small"
                                                color="blue-gray"
                                                className={`font-normal break-words whitespace-normal flex items-center gap-3 line-clamp-3 ${customStyles[field] ? customStyles[field](row[field]) : ''
                                                    } ${field === 'Status_MCU_Detail'
                                                        ? row[field] === 'Selesai'
                                                            ? 'text-green-500'
                                                            : row[field] === 'Belum Checkin'
                                                                ? 'text-red-500'
                                                                : row[field] === 'Di Antrian'
                                                                    ? 'text-blue-500'
                                                                    : ''
                                                        : ''
                                                    }`}
                                            >
                                                {field === "Created_At" ? (
                                                    <>
                                                        {(() => {
                                                            const date = new Date(row[field])
                                                            const day = date.getUTCDate().toString().padStart(2, "0")
                                                            const month = new Intl.DateTimeFormat("en-US", { month: "short" }).format(
                                                                new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), 1)),
                                                            )
                                                            const year = date.getUTCFullYear()
                                                            return `${day} ${month} ${year}`
                                                        })()}
                                                        <br />
                                                        {datetime &&
                                                            (() => {
                                                                const date = new Date(row[field])
                                                                const hours = date.getUTCHours().toString().padStart(2, "0")
                                                                const minutes = date.getUTCMinutes().toString().padStart(2, "0")
                                                                const seconds = date.getUTCSeconds().toString().padStart(2, "0")
                                                                return `${hours}:${minutes}:${seconds} WIB`
                                                            })()}
                                                    </>
                                                ) : field === "Nama_Pasien" ? (
                                                    <>
                                                        {row[field] ?? ""}
                                                        <Eye className="h-4 w-4 text-green-400" onClick={() => detailTindakanFunct && detailTindakanFunct(row)}/>
                                                    </>
                                                ) : (
                                                    (row[field] ?? "")
                                                )}
                                            </Typography>
                                        </td>
                                    ))}
                                    {(showAntrianColumn) && (
                                        <td className={classes}>
                                            {(row.Status_Tindakan == 2 && row.Status_MCU == 3) ? (
                                                <div>
                                                    <Button size="sm" disabled className='mr-2'>
                                                        Panggil
                                                    </Button>
                                                    <Button size="sm" color='green' onClick={() => selesaikanAntrianManual && selesaikanAntrianManual(row)} className='mr-2'>
                                                        Selesaikan
                                                    </Button>
                                                </div>
                                            ) : (row.Status_Tindakan == 1 && row.Status_MCU == 2) ? (
                                                <div>
                                                    <Button size="sm" color='green' className='mr-2' onClick={() => panggilAntrianManual && panggilAntrianManual(row)}>
                                                        Panggil
                                                    </Button>
                                                    <Button size="sm" disabled className='mr-2'>
                                                        Selesaikan
                                                    </Button>
                                                </div>
                                            ) : (row.Status_MCU == 3 || row.Status_Tindakan == 99) ? (
                                                <div>
                                                    <Button size="sm" disabled className='mr-2'>
                                                        Panggil
                                                    </Button>
                                                    <Button size="sm" disabled className='mr-2'>
                                                        Selesaikan
                                                    </Button>
                                                </div>
                                            ) : (
                                                <></>
                                            )}
                                        </td>
                                    )}
                                </tr>
                            );
                        })
                    ) : (
                        <tr>
                            <td colSpan={headers.length + (showAntrianColumn ? 1 : 0)} className="p-4 text-center">
                                <Typography variant="small" color="blue-gray" className="font-normal">
                                    Tidak ada pasien
                                </Typography>
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>
            {visibleData.length < data.length && (
                <div ref={loaderRef} className="flex justify-center p-4">
                    <Typography>Loading more...</Typography>
                </div>
            )}
        </div>
    );
}

