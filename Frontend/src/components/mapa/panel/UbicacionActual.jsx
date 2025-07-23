import { IconCurrentLocation } from "@tabler/icons-react";
import MainButton from "../../ui/MainButton";
import { useUbicacionActual } from "../../../hooks/useUbicacionActual";

const UbicacionActual = ({ mapRef, boundsCorrientes }) => {
  const { cargandoUbicacion, handleUbicacionActual } = useUbicacionActual(
    boundsCorrientes,
    mapRef
  );

  return (
    <div className="relative">
      <MainButton
        onClick={handleUbicacionActual}
        title="Ubicación actual"
        icon={IconCurrentLocation}
        type="button"
        variant="accent"
        className="w-full"
        loading={cargandoUbicacion}
      >
        Mi Ubicación
      </MainButton>
    </div>
  );
};

export default UbicacionActual;
