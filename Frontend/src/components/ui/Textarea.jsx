import classNames from "classnames";

const Textarea = ({
  label,
  name,
  value,
  onChange,
  placeholder = "",
  required = false,
  disabled = false,
  rows = 3,
  className = "",
  isInvalid = false,
  onKeyDown,
}) => {
  return (
    <div className="space-y-1">
      {label && (
        <label htmlFor={name} className="block text-texto mb-1">
          {label}
        </label>
      )}

      <textarea
        id={name}
        name={name}
        value={value}
        onChange={onChange}
        onKeyDown={onKeyDown}
        placeholder={placeholder}
        required={required}
        disabled={disabled}
        rows={rows}
        className={classNames(
          "w-full bg-white/5 text-texto rounded-lg border transition px-3 py-2 resize-none",
          "focus:outline-none focus:ring-1",
          disabled && "cursor-not-allowed opacity-70",
          isInvalid
            ? "border-red-500 focus:border-red-500 focus:ring-red-500"
            : "border-white/10 focus:border-acento focus:ring-acento",
          className
        )}
      />
    </div>
  );
};

export default Textarea;
