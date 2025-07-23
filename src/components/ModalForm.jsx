import React from "react";
import {
    Dialog,
    DialogHeader,
    DialogBody,
    DialogFooter,
    Button,
    IconButton,
    Typography,
} from "@material-tailwind/react";
import { XMarkIcon } from "@heroicons/react/24/outline";

export function ModalForm({ open, handleOpen, onSubmit, title, description, children, size = "sm", footer = true, footerClose = false, loading = false }) {
    return (
        <Dialog
            size={size}
            open={open}
            handler={handleOpen}
            className="p-4 overflow-y-auto max-h-[90vh]"
            dismiss={{
                escapeKey: false,
                outsidePress: false,
            }}
        >
            <DialogHeader className="relative m-0 block">
                <Typography variant="h4" color="blue-gray">
                    {title}
                </Typography>
                {description &&
                    <Typography className="mt-1 font-normal text-gray-600">
                        {description}
                    </Typography>
                }
                <IconButton
                    size="sm"
                    variant="text"
                    className="!absolute right-3.5 top-3.5"
                    onClick={handleOpen}
                >
                    <XMarkIcon className="h-4 w-4 stroke-2" />
                </IconButton>
            </DialogHeader>
            <DialogBody className={`space-y-4 pb-6 overflow-visible`}>
                {children}
            </DialogBody>
            {footer &&
                <DialogFooter>
                    <Button className="ml-auto flex items-center gap-2" onClick={onSubmit} disabled={loading}>
                        {loading && (
                            <svg className="w-4 h-4 animate-spin" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"></path>
                            </svg>
                        )}
                        Submit
                    </Button>
                </DialogFooter>
            }
            {footerClose &&
                <DialogFooter>
                    <Button className="ml-auto" onClick={handleOpen}>
                        Submit
                    </Button>
                </DialogFooter>
            }
        </Dialog>
    );
}

