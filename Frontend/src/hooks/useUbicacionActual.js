import { manejarUbicacionActual } from "../services/mapa";
import { useAlerta } from "../context/AlertaContext";
import { useState } from "react";

export const useUbicacionActual = (boundsCorrientes, mapRef) => {
  const [cargandoUbicacion, setCargandoUbicacion] = useState(false);
  const { mostrarInfo, mostrarError } = useAlerta();

  const handleUbicacionActual = async () => {
    if (!mapRef.current) {
      mostrarError("El mapa aún no está disponible.");
      return;
    }

    setCargandoUbicacion(true);
    try {
      await manejarUbicacionActual(boundsCorrientes, mostrarInfo, mapRef.current);
    } catch (e) {
      mostrarError("Ocurrió un error al obtener tu ubicación.");
    } finally {
      setTimeout(() => setCargandoUbicacion(false), 1000);
    }
  };

  return {
    cargandoUbicacion,
    handleUbicacionActual,
  };
};

