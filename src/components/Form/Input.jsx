import React from "react";
import { Input as MaterialInput, Typography } from "@material-tailwind/react";

export function Input({ type, label, name, color="gray", value, variant="outlined", onChange, error, disabled = false, readOnly, ...props }) {
    return (
        <div>
            <MaterialInput
                type={type}
                color={color}
                size="lg"
                label={label}
                name={name}
                variant={variant}
                value={value}
                onChange={onChange}
                error={!!error}
                disabled={disabled}
                readOnly={readOnly}
                {...props}
            />
            {error && (
                <Typography color="red" className="text-sm">
                    {error}
                </Typography>
            )}
        </div>
    );
}
