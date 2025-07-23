"use client"

import React from "react"
import image from "../assets/logo-urip.png"
import { useNavigate } from "react-router-dom"
import { handleLogout } from "../Util/handleLogout"
import { UserGroupIcon } from "@heroicons/react/24/solid"
import { ChevronDownIcon, Bars3Icon, XMarkIcon } from "@heroicons/react/24/outline"
import { IconButton, Typography, List, ListItem, ListItemPrefix, Accordion, AccordionHeader, AccordionBody, Drawer, Card } from "@material-tailwind/react"
import { Hospital, LogOut, ShieldPlus } from 'lucide-react'

export function SidebarGizi() {
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
              Gizi
            </Typography>
          </div>
          <List>
            {(role == 1 || role == 5 || role == 6 || role == 7 || role == 9) &&
              <>
                <ListItem
                  className="hover:bg-blue-gray-50/80"
                  onClick={() => navigate("/gizi/admin/daftar-pasien")}
                >
                  <ListItemPrefix>
                    <UserGroupIcon className="h-5 w-5" />
                  </ListItemPrefix>
                  Diet Pasien
                </ListItem>
              </>
            }
            {(role == 1 || role == 7 || role == 9 || role == 8) &&
              <>
                <ListItem
                  className="hover:bg-blue-gray-50/80"
                  onClick={() => navigate("/gizi/admin/order-pasien")}
                >
                  <ListItemPrefix>
                    <UserGroupIcon className="h-5 w-5" />
                  </ListItemPrefix>
                  Order Menu Pasien
                </ListItem>
              </>
            }
            {(role == 8) &&
              <>
                <ListItem
                  className="hover:bg-blue-gray-50/80"
                  onClick={() => navigate("/gizi/admin/daftar-pasien")}
                >
                  <ListItemPrefix>
                    <UserGroupIcon className="h-5 w-5" />
                  </ListItemPrefix>
                  Diet Pasien
                </ListItem>
              </>
            }
            {(role == 1 || role == 7 || role == 8) &&
              <>
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
                      {(role == 1 || role == 7) &&
                        <ListItem
                          className="hover:bg-blue-gray-50/80"
                          onClick={() => navigate("/gizi/admin/master-diet")}
                        >
                          <ListItemPrefix>
                            <ShieldPlus strokeWidth={3} className="h-3 w-5" />
                          </ListItemPrefix>
                          Master Diet Pasien
                        </ListItem>
                      }

                      {(role == 1 || role == 7) &&
                        <ListItem
                          className="hover:bg-blue-gray-50/80"
                          onClick={() => navigate("/gizi/admin/master-bentuk-diet")}
                        >
                          <ListItemPrefix>
                            <ShieldPlus strokeWidth={3} className="h-3 w-5" />
                          </ListItemPrefix>
                          Master Bentuk Diet
                        </ListItem>
                      }

                      {(role == 1 || role == 7 || role == 8) &&
                        <ListItem
                          className="hover:bg-blue-gray-50/80"
                          onClick={() => navigate("/gizi/admin/master-menu")}
                        >
                          <ListItemPrefix>
                            <ShieldPlus strokeWidth={3} className="h-3 w-5" />
                          </ListItemPrefix>
                          Master Menu
                        </ListItem>
                      }
                    </List>
                  </AccordionBody>
                </Accordion>
              </>
            }

            {(role == 1 || role == 7) &&
              <>
                <Accordion
                  open={open === 3}
                  icon={
                    <ChevronDownIcon
                      strokeWidth={2.5}
                      className={`mx-auto h-4 w-4 transition-transform ${open === 3 ? "rotate-180" : ""}`}
                    />
                  }
                >
                  <ListItem className="p-0" selected={open === 3}>
                    <AccordionHeader
                      onClick={() => handleOpen(3)}
                      className="border-b-0 p-3"
                    >
                      <ListItemPrefix>
                        <Hospital className="h-5 w-5" />
                      </ListItemPrefix>
                      <Typography color="blue-gray" className="mr-auto font-normal">
                        Laporan Order
                      </Typography>
                    </AccordionHeader>
                  </ListItem>
                  <AccordionBody className="py-1">
                    <List className="p-0 pl-4 border-l border-blue-gray-100">
                      <ListItem
                        className="hover:bg-blue-gray-50/80"
                        onClick={() => navigate("/gizi/admin/report-order")}
                      >
                        <ListItemPrefix>
                          <ShieldPlus strokeWidth={3} className="h-3 w-5" />
                        </ListItemPrefix>
                        History Order Pasien
                      </ListItem>


                      <ListItem
                        className="hover:bg-blue-gray-50/80"
                        onClick={() => navigate("/gizi/admin/tren-order")}
                      >
                        <ListItemPrefix>
                          <ShieldPlus strokeWidth={3} className="h-3 w-5" />
                        </ListItemPrefix>
                        Statistik Order Pasien
                      </ListItem>
                    </List>
                  </AccordionBody>
                </Accordion>
              </>
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

