import { useEffect, useState } from "react";
import { IconLoader2 } from "@tabler/icons-react";

const CargandoMapa = ({ cargandoMapa }) => {
  const [visible, setVisible] = useState(cargandoMapa);

  useEffect(() => {
    if (cargandoMapa) {
      setVisible(true);
    } else {
      const timeout = setTimeout(() => {
        setVisible(false);
      }, 200); // más corto para evitar fade notorio
      return () => clearTimeout(timeout);
    }
  }, [cargandoMapa]);

  if (!visible) return null;

  return (
    <div
      className={`fixed inset-0 z-45 flex items-center justify-center transition-opacity duration-300 ${
        cargandoMapa ? "opacity-75 pointer-events-auto" : "opacity-0 pointer-events-none"
      }`}
      style={{
        backgroundColor: "rgba(0, 0, 0, 0.6)",
        backdropFilter: "blur(4px)",
      }}
    >
      <div className="flex flex-col items-center gap-3 text-texto">
        <IconLoader2 size={42} className="animate-spin text-texto" />
        <p className="text-lg sm:text-xl font-semibold tracking-wide">
          Cargando mapa...
        </p>
      </div>
    </div>
  );
};

export default CargandoMapa;
