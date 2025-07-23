import React from "react";
import classNames from "classnames";
import { IconLoader2, IconEye, IconEdit, IconTrash } from "@tabler/icons-react";

const Button = ({
  children,
  onClick,
  type = "button",
  variant = "primary",
  disabled = false,
  loading = false,
  active = false,
  icon: Icon = null,
  iconSize = 24,
  className = "",
  as = "button",
  ...props
}) => {
  const Tag = as;
  // Detectar si se pasó padding personalizado
  const hasPx = /\bpx-\d+\b/.test(className);
  const hasPy = /\bpy-\d+\b/.test(className);
  const hasP = /\bp-\d+\b/.test(className);

  const defaultPx = !hasPx && !hasP ? "px-4" : "";
  const defaultPy = !hasPy && !hasP ? "py-2" : "";

  const baseStyles = classNames(
    "inline-flex items-center justify-center gap-2 rounded-lg font-bold transition focus:outline-none duration-300",
    defaultPx,
    defaultPy
  );

  const variants = {
    primary: "bg-primario text-texto hover:bg-acento",
    accent: "bg-acento text-texto hover:bg-primario",
    secondary: "bg-white/10 text-texto hover:bg-white/20",
    danger: "bg-red-600 text-texto hover:bg-red-400",
    disabled: "bg-gray-400 text-gray-700 cursor-not-allowed",
    cross: "text-texto/60 hover:text-red-400",
    add: "bg-green-900 text-texto hover:bg-green-700",
    see: "bg-blue-400/10 text-blue-400 hover:text-blue-300 hover:bg-blue-400/20",
    edit: "bg-yellow-400/10 text-yellow-400 hover:text-yellow-300 hover:bg-yellow-400/20",
    delete: "bg-red-400/10 text-red-400 hover:text-red-300 hover:bg-red-400/20",
    toggle: active
      ? "bg-primario text-texto hover:bg-acento"
      : "bg-white/10 text-texto hover:bg-white/20",
  };

  const loadingStyles = "bg-gray-400 text-gray-700 cursor-not-allowed";

  // Icono automático si no se pasó uno
  const autoIcon =
    !Icon &&
    {
      see: IconEye,
      edit: IconEdit,
      delete: IconTrash,
    }[variant];

  const finalClass = classNames(
    baseStyles,
    loading ? loadingStyles : variants[variant],
    {
      "opacity-50 pointer-events-none": disabled || loading,
    },
    className
  );

  return (
    <Tag
      type={Tag === "button" ? type : undefined}
      onClick={onClick}
      className={finalClass}
      disabled={Tag === "button" ? disabled || loading : undefined}
      {...props}
    >
      {loading ? (
        <IconLoader2 size={iconSize} className="animate-spin" />
      ) : (
        (Icon || autoIcon) &&
        React.createElement(Icon || autoIcon, { size: iconSize })
      )}
      {children}
    </Tag>
  );
};

export default Button;
