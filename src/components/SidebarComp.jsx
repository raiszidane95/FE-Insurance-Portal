"use client"

import React from "react"
import Swal from 'sweetalert2'
import image from "../assets/logo-urip.png"
import { useNavigate } from "react-router-dom"
import { handleLogout } from "../Util/handleLogout"
import { UserGroupIcon } from "@heroicons/react/24/solid"
import { ChevronDownIcon, Bars3Icon, XMarkIcon } from "@heroicons/react/24/outline"
import { IconButton, Typography, List, ListItem, ListItemPrefix, Accordion, AccordionHeader, AccordionBody, Drawer, Card } from "@material-tailwind/react"
import { BriefcaseMedical, Hospital, Images, LogOut, MonitorPlay, ShieldPlus, Stethoscope, Package } from 'lucide-react'

export function SidebarComp() {
  const role = localStorage.getItem("role")
  const [open, setOpen] = React.useState(0)
  const [subOpen, setSubOpen] = React.useState(0)
  const [isDrawerOpen, setIsDrawerOpen] = React.useState(false)
  const navigate = useNavigate()

  const handleOpen = (value) => {
    setOpen(open === value ? 0 : value)
  }

  const handleSubOpen = (value) => {
    setSubOpen(subOpen === value ? 0 : value)
  }

  const openDrawer = () => setIsDrawerOpen(true)
  const closeDrawer = () => setIsDrawerOpen(false)

  return (
    <>
      <IconButton variant="text" size="lg" onClick={openDrawer}>
        {isDrawerOpen ? (
          <XMarkIcon className="h-8 w-8 stroke-2" />
        ) : (
          <Bars3Icon className="h-8 w-8 stroke-2" />
        )}
      </IconButton>
      <Drawer open={isDrawerOpen} onClose={closeDrawer}>
        <Card
          color="transparent"
          shadow={false}
          className="h-[calc(100vh-2rem)] w-full p-4 overflow-auto"
        >
          <div className="mb-2 flex items-center gap-4 p-4 cursor-pointer" onClick={() => navigate("/admin")}>
            <img
              src={image}
              alt="brand"
              className="h-8 w-8"
            />
            <Typography variant="h5" color="blue-gray">
              MCU
            </Typography>
          </div>
          <List>
            {(role == 1 || role == 3) &&
              <ListItem
                className="hover:bg-blue-gray-50/80"
                onClick={() => navigate("/mcu/admin/listbooking-mcu")}
              >
                <ListItemPrefix>
                  <UserGroupIcon className="h-5 w-5" />
                </ListItemPrefix>
                Daftar Booking MCU
              </ListItem>
            }
              {(role == 1 || role == 3) &&
              <ListItem
                className="hover:bg-blue-gray-50/80"
                onClick={() => navigate("/mcu/admin/listcompany-mcu")}
              >
                <ListItemPrefix>
                  <UserGroupIcon className="h-5 w-5" />
                </ListItemPrefix>
                MCU Perusahaan
              </ListItem>
            }
            {(role == 1 || role == 2) &&
              <ListItem
                className="hover:bg-blue-gray-50/80"
                onClick={() => navigate("/mcu/admin/pendaftaran-mcu")}
              >
                <ListItemPrefix>
                  <UserGroupIcon className="h-5 w-5" />
                </ListItemPrefix>
                Pendaftaran MCU
              </ListItem>
            }
            <hr className="my-2 border-blue-gray-50" />
            {(role == 1 || role == 3 || role == 4) &&
              <ListItem
                className="hover:bg-blue-gray-50/80"
                onClick={() => navigate("/mcu/admin/pasien-mcu")}
              >
                <ListItemPrefix>
                  <UserGroupIcon className="h-5 w-5" />
                </ListItemPrefix>
                Pasien MCU Hari Ini
              </ListItem>
            }
            {(role == 1 || role == 4) &&
              <ListItem
                className="hover:bg-blue-gray-50/80"
                onClick={() => navigate("/mcu/admin/process-mcu")}
              >
                <ListItemPrefix>
                  <Stethoscope className="h-5 w-5" />
                </ListItemPrefix>
                Antrian MCU
              </ListItem>
            }
            {(role == 1 || role == 3 || role == 4) &&
              <Accordion
                open={open === 1}
                icon={
                  <ChevronDownIcon
                    strokeWidth={2.5}
                    className={`mx-auto h-4 w-4 transition-transform ${open === 1 ? "rotate-180" : ""}`}
                  />
                }
              >
                <ListItem className="p-0" selected={open === 1}>
                  <AccordionHeader
                    onClick={() => handleOpen(1)}
                    className="border-b-0 p-3"
                  >
                    <ListItemPrefix>
                      <Hospital className="h-5 w-5" />
                    </ListItemPrefix>
                    <Typography color="blue-gray" className="mr-auto font-normal">
                      Laporan MCU
                    </Typography>
                  </AccordionHeader>
                </ListItem>
                <AccordionBody className="py-1">
                  <List className="p-0 pl-4 border-l border-blue-gray-100">
                    <ListItem
                      className="hover:bg-blue-gray-50/80"
                      onClick={() => navigate("/mcu/admin/report-list-pasien")}
                    >
                      <ListItemPrefix>
                        <BriefcaseMedical strokeWidth={3} className="h-3 w-5" />
                      </ListItemPrefix>
                      Laporan per-Paket
                    </ListItem>
                    <ListItem
                      className="hover:bg-blue-gray-50/80"
                      onClick={() => navigate("/mcu/admin/report-list-tindakan")}
                    >
                      <ListItemPrefix>
                        <BriefcaseMedical strokeWidth={3} className="h-3 w-5" />
                      </ListItemPrefix>
                      Laporan per-Tindakan
                    </ListItem>
                  </List>
                </AccordionBody>
              </Accordion>
            }
            {(role == 1 || role == 3 || role == 4) &&
              <Accordion
                open={open === 2}
                icon={
                  <ChevronDownIcon
                    strokeWidth={2.5}
                    className={`mx-auto h-4 w-4 transition-transform ${open === 2 ? "rotate-180" : ""}`}
                  />
                }
              >
                <ListItem className="p-0" selected={open === 2}>
                  <AccordionHeader
                    onClick={() => handleOpen(2)}
                    className="border-b-0 p-3"
                  >
                    <ListItemPrefix>
                      <Hospital className="h-5 w-5" />
                    </ListItemPrefix>
                    <Typography color="blue-gray" className="mr-auto font-normal">
                      Master Data
                    </Typography>
                  </AccordionHeader>
                </ListItem>
                <AccordionBody className="py-1">
                  <List className="p-0 pl-4 border-l border-blue-gray-100">
                    <Accordion
                      open={subOpen === 1}
                      icon={
                        <ChevronDownIcon
                          strokeWidth={2.5}
                          className={`mx-auto h-4 w-4 transition-transform ${subOpen === 1 ? "rotate-180" : ""}`}
                        />
                      }
                    >
                      <ListItem className="p-0" selected={subOpen === 1}>
                        <AccordionHeader
                          onClick={() => handleSubOpen(1)}
                          className="border-b-0 p-3"
                        >
                          <ListItemPrefix>
                            <Package strokeWidth={3} className="h-3 w-5" />
                          </ListItemPrefix>
                          <Typography color="blue-gray" className="mr-auto font-normal">
                            Paket MCU
                          </Typography>
                        </AccordionHeader>
                      </ListItem>
                      <AccordionBody className="py-1">
                        <List className="p-0 pl-4 border-l border-blue-gray-100">
                          <ListItem
                            className="hover:bg-blue-gray-50/80"
                            onClick={() => navigate("/mcu/admin/group-tindakan-mcu")}
                          >
                            <ListItemPrefix>
                              <BriefcaseMedical strokeWidth={3} className="h-3 w-5" />
                            </ListItemPrefix>
                            Group Tindakan
                          </ListItem>
                          <ListItem
                            className="hover:bg-blue-gray-50/80"
                            onClick={() => navigate("/mcu/admin/tindakan-mcu")}
                          >
                            <ListItemPrefix>
                              <BriefcaseMedical strokeWidth={3} className="h-3 w-5" />
                            </ListItemPrefix>
                            Tindakan
                          </ListItem>
                          <ListItem
                            className="hover:bg-blue-gray-50/80"
                            onClick={() => navigate("/mcu/admin/kategori-mcu")}
                          >
                            <ListItemPrefix>
                              <BriefcaseMedical strokeWidth={3} className="h-3 w-5" />
                            </ListItemPrefix>
                            Kategori Paket
                          </ListItem>
                          <ListItem
                            className="hover:bg-blue-gray-50/80"
                            onClick={() => navigate("/mcu/admin/paket-mcu")}
                          >
                            <ListItemPrefix>
                              <ShieldPlus strokeWidth={3} className="h-3 w-5" />
                            </ListItemPrefix>
                            Paket MCU
                          </ListItem>
                        </List>
                      </AccordionBody>
                    </Accordion>
                    <ListItem
                      className="hover:bg-blue-gray-50/80"
                      onClick={() => navigate("/mcu/admin/master-mcu")}
                    >
                      <ListItemPrefix>
                        <ShieldPlus strokeWidth={3} className="h-3 w-5" />
                      </ListItemPrefix>
                      Master MCU
                    </ListItem>
                    <ListItem
                      className="hover:bg-blue-gray-50/80"
                      onClick={() => navigate("/mcu/admin/gallery-mcu")}
                    >
                      <ListItemPrefix>
                        <Images strokeWidth={3} className="h-3 w-5" />
                      </ListItemPrefix>
                      Gallery MCU
                    </ListItem>
                    <ListItem
                      className="hover:bg-blue-gray-50/80"
                      onClick={() => navigate("/mcu/admin/fasilitas-mcu")}
                    >
                      <ListItemPrefix>
                        <MonitorPlay strokeWidth={3} className="h-3 w-5" />
                      </ListItemPrefix>
                      Fasilitas MCU
                    </ListItem>
                  </List>
                </AccordionBody>
              </Accordion>
            }
            <hr className="my-2 border-blue-gray-50" />
            <ListItem onClick={() => {
              handleLogout(navigate, "admin");
            }}>
              <ListItemPrefix>
                <LogOut className="h-5 w-5" />
              </ListItemPrefix>
              Log Out
            </ListItem>
          </List>
        </Card>
      </Drawer>
    </>
  )
}

