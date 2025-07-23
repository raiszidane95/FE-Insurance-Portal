import React, { useState, useEffect, useRef } from "react";
import { Typography } from "@material-tailwind/react";

export default function LazyDataTableAuto({
    headers,
    data,
    displayFields,
    customStyles = {},
    showAntrianColumn = false,
    moveToNextSubTab,
    moveToNextMainTab,
    isLastSubTab,
    isLastMainTab,
    resetToFirstTab
}) {
    const [scrolling, setScrolling] = useState(false);
    const containerRef = useRef(null);

    useEffect(() => {
        const container = containerRef.current;
        if (!container) return;

        let scrollAmount = 0;
        const scrollStep = 2; 
        const delay = 50; 
        const pauseDuration = data.length == 0 ? 2000 : data.length > 1 ? 4000 : 4000;

        setScrolling(true);
        
        const scrollInterval = setInterval(() => {
            if (container.scrollTop + container.clientHeight < container.scrollHeight) {
             
                container.scrollTop += scrollStep;
                scrollAmount += scrollStep;
            } else {
                clearInterval(scrollInterval);
                
                setTimeout(() => {
                    if (!isLastSubTab) {
                        moveToNextSubTab();
                    } else if (!isLastMainTab) {
                        moveToNextMainTab();
                    } else {
                        resetToFirstTab();
                    }
                }, pauseDuration);
            }
        }, delay);

        return () => clearInterval(scrollInterval);
    }, [data, isLastSubTab, isLastMainTab]);

    return (
        <div ref={containerRef} className='overflow-auto max-h-[380px] scrollbar-hide'>
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
                    </tr>
                </thead>
                <tbody>
                    {data.length > 0 ? (
                        data.map((row, index) => (
                            <tr key={row.Id}>
                                <td className="p-4 border-b border-blue-gray-50">
                                    <Typography variant="small" color="blue-gray" className="font-normal">
                                        {index + 1}
                                    </Typography>
                                </td>
                                {displayFields.map((field) => (
                                    <td key={field} className="p-4 border-b border-blue-gray-50">
                                        <Typography
                                            variant="small"
                                            color="blue-gray"
                                            className={`font-normal break-words whitespace-normal flex items-center gap-3 line-clamp-3 ${customStyles[field] ? customStyles[field](row[field]) : ''}`}
                                        >
                                            {field === "Created_At" ? (
                                                (() => {
                                                    const date = new Date(row[field]);
                                                    const hours = date.getUTCHours().toString().padStart(2, "0");
                                                    const minutes = date.getUTCMinutes().toString().padStart(2, "0");
                                                    return `${hours}:${minutes} WIB`;
                                                })()
                                            ) : (
                                                row[field] ?? ""
                                            )}
                                        </Typography>
                                    </td>
                                ))}
                            </tr>
                        ))
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
        </div>
    );
}
