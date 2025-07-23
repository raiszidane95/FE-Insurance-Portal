import React from "react";
import { Button, Dialog, DialogHeader, DialogBody, DialogFooter } from "@material-tailwind/react";

const statusMCUMapping = {
    '1': { label: 'Belum Checkin', color: 'text-black' },
    '2': { label: 'Proses', color: 'text-blue-500' },
    '3': { label: 'Proses', color: 'text-blue-500' },
    '4': { label: 'Selesai', color: 'text-green-500' },
    '9': { label: 'Batal', color: 'text-red-500' },
    'P': { label: 'Belum dibuat no reg', color: 'text-black' }
};

export function CompListModal({ open, handleOpen, patients }) {
    return (
        <Dialog open={open} handler={handleOpen} size="xl">
            <DialogHeader>Daftar Peserta</DialogHeader>
            <DialogBody divider className="h-[calc(100vh-30rem)] overflow-y-auto">
                <table className="w-full min-w-max table-auto text-left">
                    <thead>
                        <tr>
                            <th className="border-b border-blue-gray-100 bg-blue-gray-50 p-4">No.</th>
                            <th className="border-b border-blue-gray-100 bg-blue-gray-50 p-4">Nama Pasien</th>
                            <th className="border-b border-blue-gray-100 bg-blue-gray-50 p-4">No. MR</th>
                            <th className="border-b border-blue-gray-100 bg-blue-gray-50 p-4">No. Identitas</th>
                            <th className="border-b border-blue-gray-100 bg-blue-gray-50 p-4">Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        {patients.map((patient, index) => {
                            const statusInfo = statusMCUMapping[patient.Status] || { label: "Status Tidak Diketahui", color: "text-gray-500" };
                            return (
                                <tr key={patient.Id} className="even:bg-blue-gray-50/50">
                                    <td className="p-4">{index + 1}</td>
                                    <td className="p-4">{patient.REGISTER_PASIEN.Nama_Pasien}</td>
                                    <td className="p-4">{patient.REGISTER_PASIEN.No_MR}</td>
                                    <td className="p-4">{patient.REGISTER_PASIEN.No_Identitas}</td>
                                    <td className={`p-4 font-medium ${statusInfo.color}`}>
                                        {statusInfo.label}
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </DialogBody>
            <DialogFooter>
                <Button variant="text" color="red" onClick={handleOpen} className="mr-1">
                    <span>Tutup</span>
                </Button>
            </DialogFooter>
        </Dialog>
    );
}
