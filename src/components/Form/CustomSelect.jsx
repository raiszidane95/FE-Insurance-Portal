import { useState, useRef, useEffect } from "react"
import { ChevronDown } from "lucide-react"

export default function CustomSelect({ error, options, placeholder = "Pilih", onChange }) {
  const [isOpen, setIsOpen] = useState(false)
  const [selectedOption, setSelectedOption] = useState(null)
  const dropdownRef = useRef(null)

  const toggleDropdown = () => setIsOpen(!isOpen)

  const handleOptionClick = (option) => {
    setSelectedOption(option)
    setIsOpen(false)
    onChange?.(option)
  }

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [])

  return (
    <div className="relative w-full max-w-xs" ref={dropdownRef}>
      <button
        type="button"
        className={`flex items-center justify-between w-full px-4 py-2 text-left bg-white border ${error.error === 'jaminan' || error.error === 'all' ? "border-red-500" : "border-gray-200"} border-gray-300 rounded-lg shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primaryGreen focus:border-transparent transition-all duration-200`}
        onClick={toggleDropdown}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
      >
        <span className={`block truncate ${selectedOption ? "text-gray-700" : "text-gray-500"}`}>
          {selectedOption || placeholder}
        </span>
        <ChevronDown
          className={`w-5 h-5 text-gray-400 transition-transform duration-200 ${isOpen ? "transform rotate-180" : ""}`}
        />
      </button>

      {isOpen && (
        <div className="absolute z-10 w-full mt-1 bg-[#fefffd] border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-auto">
          <ul className="py-1" role="listbox" aria-labelledby="dropdown-button">
            {options.map((option, index) => (
              <li
                key={index}
                className={`px-4 py-2.5 text-sm cursor-pointer hover:bg-[#fefffd] transition-colors duration-150 ${selectedOption === option ? "bg-[#fefffd] text-leafGreen font-medium" : "text-gray-900"
                  }`}
                role="option"
                aria-selected={selectedOption === option}
                onClick={() => handleOptionClick(option)}
              >
                {option}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}
