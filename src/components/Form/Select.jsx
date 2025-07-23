import React from "react";
import { Select as MaterialSelect, Typography } from "@material-tailwind/react";

export function Select({ label, name, value, onChange, placeholder, error, children, disabled, ...props }) {
    return (
        <div>
            <MaterialSelect
                color="gray"
                size="lg"
                label={label}
                name={name}
                disabled={disabled}
                value={value}
                onChange={onChange}
                error={!!error}
                placeholder={placeholder}
                placement="bottom"
                offset={5}
                containerProps={{
                    className: "min-w-[100px]",
                }}
                menuProps={{
                    className: "max-h-[300px] overflow-auto",
                }}
                {...props}
            >
                {children}
            </MaterialSelect>
            {error && (
                <Typography color="red" className="mt-2 text-sm">
                    {error}
                </Typography>
            )}
        </div>
    );
}
