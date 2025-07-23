import React from "react";
import { Textarea as MaterialTextarea, Typography } from "@material-tailwind/react";

export function Textarea({ type, label, name, value, onChange, error, ...props }) {
    return (
        <div>
            <MaterialTextarea
                type={type}
                color="gray"
                size="lg"
                label={label}
                name={name}
                value={value}
                onChange={onChange}
                error={!!error}
                {...props}
                className="mb-0"
            />
            {error && (
                <Typography color="red" className="text-sm">
                    {error}
                </Typography>
            )}
        </div>
    );
}
