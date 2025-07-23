import { Link } from "react-router-dom";
import { IconLoader2 } from "@tabler/icons-react";
import classNames from "classnames";
import { useRole } from "../../context/RoleContext";

const LinkButton = ({
  to,
  children,
  icon: Icon = null,
  loading = false,
  variant = "primary",
  className = "",
  disabled = false,
  iconSize = 24,
  isPremium = false,
  ...props
}) => {
  const { plan } = useRole();
  const esCard = variant === "card" || variant === "cardAdmin";
  const hasCustomPadding = /\bp[trblxy]?-\d+\b/.test(className);

  const bloquearAcceso = isPremium && plan === "basico";

  const baseStyles = classNames(
    esCard
      ? "block text-center rounded-lg transition relative overflow-hidden"
      : "inline-flex items-center justify-center gap-2 rounded-lg font-bold transition focus:outline-none duration-300",
    !hasCustomPadding && (esCard ? "p-4" : "px-6 py-3")
  );

  const getCardVariant = () => {
    if (variant !== "card") return null;
    return isPremium
      ? "bg-white/5 backdrop-blur-md border border-white/10 hover:bg-acento/30 text-texto min-h-[130px] flex flex-col justify-center"
      : "bg-white/5 backdrop-blur-md border border-white/10 hover:bg-acento/30 text-texto min-h-[130px] flex flex-col justify-center";
  };

  const variants = {
    primary: "bg-primario text-texto hover:bg-acento",
    accent: "bg-acento text-texto hover:bg-primario",
    secondary: "bg-white/10 text-texto hover:bg-white/20",
    danger: "bg-red-600 text-texto hover:bg-red-700",
    disabled: "bg-gray-400 text-gray-700 cursor-not-allowed",
    card: getCardVariant(),
    cardAdmin:
      "bg-purple-800/20 backdrop-blur-md border border-purple-500/30 hover:bg-purple-800/40 text-texto min-h-[130px] flex flex-col justify-center",
    curso:
      "flex flex-col bg-white/10 rounded-lg overflow-hidden transition duration-300 hover:scale-105 hover:shadow-lg text-texto block",
  };

  const loadingStyles = "bg-gray-400 text-gray-700 cursor-not-allowed";

  const finalClass = classNames(
    baseStyles,
    loading ? loadingStyles : variants[variant],
    {
      "opacity-50 pointer-events-none": disabled || loading || bloquearAcceso,
    },
    className
  );

  return (
    <div className="relative">
      <Link to={to} className={finalClass} {...props}>
        {loading ? (
          <IconLoader2 size={iconSize} className="animate-spin" />
        ) : (
          Icon && <Icon size={iconSize} />
        )}
        {children}
      </Link>

      {/* Overlay para premium bloqueado */}
      {bloquearAcceso && esCard && (
        <div className="absolute inset-0 backdrop-blur-sm bg-black/20 text-texto border border-white/10 flex items-center justify-center px-4 text-center font-medium rounded-lg pointer-events-auto z-10">
          Esta función es exclusiva para el plan <span className="text-acento ml-1">Premium</span>
        </div>
      )}
    </div>
  );
};

export default LinkButton;
