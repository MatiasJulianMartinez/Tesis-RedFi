// src/components/ui/CheckboxDropdown.jsx
import { useState, useRef, useEffect } from "react";
import { IconChevronDown } from "@tabler/icons-react";
import classNames from "classnames";

const CheckboxDropdown = ({
  label,
  options = [],
  value = [],
  onChange,
  getOptionLabel = (opt) => opt.label,
  getOptionValue = (opt) => opt.value,
  disabled = false,
}) => {
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef(null);

  const toggleOption = (val) => {
    if (value.includes(val)) {
      onChange(value.filter((v) => v !== val));
    } else {
      onChange([...value, val]);
    }
  };

  useEffect(() => {
    const handleOutsideClick = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handleOutsideClick);
    return () => document.removeEventListener("mousedown", handleOutsideClick);
  }, []);

  // Mejorar la lógica de mostrar las opciones seleccionadas
  const getDisplayText = () => {
    const selectedOptions = options.filter((opt) => 
      value.includes(getOptionValue(opt))
    );
    
    if (selectedOptions.length === 0) {
      return "Seleccionar...";
    }
    
    if (selectedOptions.length === 1) {
      return getOptionLabel(selectedOptions[0]);
    }
    
    if (selectedOptions.length <= 2) {
      return selectedOptions.map(getOptionLabel).join(", ");
    }
    
    // Si hay más de 2, mostrar el primero + contador
    return `${getOptionLabel(selectedOptions[0])} y ${selectedOptions.length - 1} más`;
  };

  return (
    <div className="relative w-full" ref={dropdownRef}>
      {label && (
        <label className="block text-sm font-medium text-texto mb-1">
          {label}
        </label>
      )}
      <button
        type="button"
        disabled={disabled}
        onClick={() => setOpen(!open)}
        className={classNames(
          "w-full px-3 py-2 bg-white/5 text-texto rounded-lg border text-left",
          "border-white/20 focus:outline-none focus:ring-1 focus:ring-acento",
          disabled && "opacity-60 cursor-not-allowed",
          "flex items-center justify-between min-w-0" // Agregado min-w-0
        )}
      >
        <span className="truncate text-sm flex-1 min-w-0">
          {getDisplayText()}
        </span>
        <IconChevronDown size={18} className="text-texto/50 flex-shrink-0 ml-2" />
      </button>

      {open && (
        <div className="absolute mt-1 w-full max-h-60 overflow-y-auto bg-secundario border border-white/20 rounded-lg shadow-lg z-60 p-2 space-y-1">
          {options.map((opt) => {
            const val = String(getOptionValue(opt));
            const label = getOptionLabel(opt);
            const checked = value.map(String).includes(val);

            return (
              <label
                key={val}
                className="flex items-center gap-2 p-2 rounded hover:bg-white/10 cursor-pointer transition"
              >
                <input
                  type="checkbox"
                  checked={checked}
                  onChange={() => toggleOption(val)}
                  className="accent-acento flex-shrink-0"
                />
                <span className="text-sm">{label}</span>
              </label>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default CheckboxDropdown;
