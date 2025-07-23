// src/components/ui/Input.jsx
import classNames from "classnames";
import { IconLoader2 } from "@tabler/icons-react";

const Input = ({
  label,
  name,
  type = "text",
  value,
  onChange,
  placeholder = "",
  required = false,
  disabled = false,
  loading = false,
  icon: Icon,
  endIconAction = null,
  className = "",
  isInvalid = false,
  onKeyDown,
}) => {
  return (
    <div className="space-y-1 relative">
      {label && (
        <label htmlFor={name} className="block text-texto mb-1">
          {label}
        </label>
      )}

      <div className="relative">
        {Icon && (
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Icon size={20} className="text-texto/40" />
          </div>
        )}

        {type === "color" ? (
          <input
            id={name}
            name={name}
            type="color"
            value={loading ? "#000000" : value ?? "#000000"}
            onChange={onChange}
            disabled={disabled || loading}
            required={required}
            className={classNames(
              "w-14 h-14 rounded-lg border transition p-0 cursor-pointer",
              (disabled || loading) && "cursor-not-allowed opacity-70",
              isInvalid ? "border-red-500" : "border-white/10",
              className
            )}
          />
        ) : (
          <input
            id={name}
            name={name}
            type={type}
            value={loading ? "" : value ?? ""}
            onChange={onChange}
            onKeyDown={onKeyDown}
            placeholder={loading ? "Cargando..." : placeholder}
            required={required}
            disabled={disabled || loading}
            className={classNames(
              "w-full bg-white/5 text-texto rounded-lg border transition",
              "focus:outline-none focus:ring-1",
              Icon ? "pl-10" : "pl-3",
              loading || isInvalid || endIconAction ? "pr-10" : "pr-3",
              "py-2",
              (disabled || loading) && "cursor-not-allowed opacity-70",
              isInvalid
                ? "border-red-500 focus:border-red-500 focus:ring-red-500"
                : "border-white/10 focus:border-acento focus:ring-acento",
              className
            )}
          />
        )}

        {/* Ícono derecho */}
        <div className="absolute inset-y-0 right-3 flex items-center">
          {loading ? (
            <IconLoader2 size={20} className="animate-spin text-texto/60" />
          ) : isInvalid ? null : endIconAction ? (
            <button
              type="button"
              onClick={endIconAction.onClick}
              title={endIconAction.label || "Acción"}
              aria-label={endIconAction.label || "Acción del ícono"}
              tabIndex={0}
              className="text-texto/60 hover:text-texto transition focus:outline-none"
            >
              {endIconAction.icon}
            </button>
          ) : null}
        </div>
      </div>
    </div>
  );
};

export default Input;
