import { useState } from "react"

const RadioButtonMedis = ({ setFilter }) => {
  const [selectedValue, setSelectedValue] = useState("Semua");
  
  const handleChange = (e) => {
    setSelectedValue(e.target.value);
    setFilter({ medis: e.target.value });
  };


  return (
    <div className="flex gap-2">
      {["Semua", "Rawat Jalan", "Rawat Inap"].map((value) => (
        <label
          key={value}
          className={`flex items-center justify-center px-3 py-1 rounded-full text-xs cursor-pointer transition duration-400 ease-in-out ${selectedValue === value
            ? "bg-primaryGreen text-white font-semibold"
            : "bg-primaryGray/20 text-charcoal"
            }`}
        >
          <input
            type="radio"
            value={value}
            checked={selectedValue === value}
            onChange={handleChange}
            className="sr-only"
          />
          <span className="font-medium">{value}</span>
        </label>
      ))}
    </div>
  )
}

export default RadioButtonMedis