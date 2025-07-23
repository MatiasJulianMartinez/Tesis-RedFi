import { useEffect, useState } from "react";
import {
  IconX,
  IconAlertCircle,
  IconCircleCheck,
  IconInfoCircle,
  IconAlertTriangle,
} from "@tabler/icons-react";
import MainButton from "./MainButton";
import { DURACION_ALERTA } from "../../constants/constantes";

const estilos = {
  error: "text-red-400 border-red-500/30",
  exito: "text-green-400 border-green-500/30",
  info: "text-blue-400 border-blue-500/30",
  advertencia: "text-yellow-400 border-yellow-500/30",
};

const iconos = {
  error: IconAlertCircle,
  exito: IconCircleCheck,
  info: IconInfoCircle,
  advertencia: IconAlertTriangle,
};

const Alerta = ({
  mensaje,
  tipo = "error",
  onCerrar,
  autoOcultar = true,
  duracion = DURACION_ALERTA,
  flotante = false,
}) => {
  const [visible, setVisible] = useState(false);
  const [renderizar, setRenderizar] = useState(false);

  useEffect(() => {
    if (mensaje) {
      setRenderizar(true);
      setTimeout(() => setVisible(true), 100);
      if (autoOcultar) {
        const timer = setTimeout(() => {
          setVisible(false);
          setTimeout(() => {
            setRenderizar(false);
            onCerrar?.();
          }, 300);
        }, duracion);
        return () => clearTimeout(timer);
      }
    }
  }, [mensaje, autoOcultar, duracion, onCerrar]);

  const cerrarAlerta = () => {
    setVisible(false);
    setTimeout(() => {
      setRenderizar(false);
      onCerrar?.();
    }, 300);
  };

  if (!renderizar) return null;

  const Icono = iconos[tipo] || iconos.error;

  return (
    <div
      className={`
      ${
        flotante
          ? "fixed bottom-6 right-6 z-50 w-[calc(100%-3rem)] max-w-md"
          : "relative"
      }
      bg-[#222222] px-4 py-3 pr-12 rounded-lg border transition-all duration-300 transform
      ${visible ? "opacity-100 scale-100" : "opacity-0 scale-95"}
      ${estilos[tipo] || estilos.error}
    `}
    >
      <div className="flex items-center gap-3">
        <Icono size={20} />
        <span className="flex-1">{mensaje}</span>
      </div>
      
      {/* Botón de cerrar - siempre visible */}
      <MainButton
        onClick={cerrarAlerta}
        type="button"
        variant="cross"
        className="absolute right-2 top-1/2 -translate-y-1/2 p-1 z-10"
      >
        <IconX size={18} />
      </MainButton>
    </div>
  );
};

export default Alerta;
