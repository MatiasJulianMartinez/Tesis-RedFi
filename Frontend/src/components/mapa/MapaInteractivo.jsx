import "maplibre-gl/dist/maplibre-gl.css";
import { useEffect, useState, memo } from "react";
import { useNavigate } from "react-router-dom";
import { IconX } from "@tabler/icons-react";
import { crearReseña } from "../../services/reseñaService";
import { BOUNDS_CORRIENTES } from "../../constants/constantes";
import { useMapaInteractivo } from "../../hooks/useMapaInteractivo";
import { useUbicacionActual } from "../../hooks/useUbicacionActual";
import { useSeleccionUbicacion } from "../../hooks/useSeleccionUbicacion";

import ModalProveedor from "../modals/mapa/ModalProveedor";
import ModalReseña from "../modals/mapa/ModalReseña";
import ModalAgregarReseña from "../modals/mapa/ModalAgregarReseña";

import MainButton from "../ui/MainButton";

import { useAlerta } from "../../context/AlertaContext";

const MapaInteractivo = ({ filtros, onMapRefReady, setCargandoMapa }) => {
  const { mostrarError, mostrarExito } = useAlerta();
  const [modalReseñaAbierto, setModalReseñaAbierto] = useState(false);
  const [modalReseñaCerradaManual, setModalReseñaCerradaManual] =
    useState(false);

  const boundsCorrientes = BOUNDS_CORRIENTES;
  const navigate = useNavigate();

  const {
    mapContainer,
    mapRef,
    cargandoMapa,
    proveedorActivo,
    setProveedorActivo,
    reseñaActiva,
    setReseñaActiva,
    cargarReseñasIniciales,
  } = useMapaInteractivo(filtros, boundsCorrientes);

  useEffect(() => {
    if (!cargandoMapa && mapRef?.current && onMapRefReady) {
      onMapRefReady(mapRef);
      setCargandoMapa?.(false);
    }
  }, [cargandoMapa, mapRef, onMapRefReady, setCargandoMapa]);

  const {
    modoSeleccion,
    coordenadasSeleccionadas,
    activarSeleccion,
    desactivarSeleccion,
    limpiarSeleccion,
  } = useSeleccionUbicacion(mapRef, boundsCorrientes, setModalReseñaAbierto);

  useEffect(() => {
    window.modoSeleccionActivo = modoSeleccion;
    return () => {
      window.modoSeleccionActivo = false;
    };
  }, [modoSeleccion]);

  const { cargandoUbicacion, handleUbicacionActual } = useUbicacionActual(
    boundsCorrientes,
    mapRef
  );

  const handleAbrirModalReseña = () => {
    limpiarSeleccion();
    setModalReseñaCerradaManual(false);
    setModalReseñaAbierto(true);
  };

  const handleSeleccionarUbicacion = () => {
    limpiarSeleccion();
    setModalReseñaAbierto(false);
    setModalReseñaCerradaManual(false);
    activarSeleccion();
  };

  useEffect(() => {
    if (
      coordenadasSeleccionadas &&
      !modalReseñaAbierto &&
      !modalReseñaCerradaManual
    ) {
      setModalReseñaAbierto(true);
    }
  }, [coordenadasSeleccionadas, modalReseñaAbierto, modalReseñaCerradaManual]);

  useEffect(() => {
    const handleAbrirModal = () => {
      handleAbrirModalReseña();
    };

    window.addEventListener("abrirModalAgregarReseña", handleAbrirModal);
    return () => {
      window.removeEventListener("abrirModalAgregarReseña", handleAbrirModal);
    };
  }, []);

  const handleAgregarReseña = async (reseñaData) => {
    try {
      await crearReseña(reseñaData);
      setModalReseñaAbierto(false);
      limpiarSeleccion();
      await cargarReseñasIniciales(filtros);
      mostrarExito("Reseña publicada con éxito.");
    } catch (error) {
      console.error("❌ Error al enviar reseña:", error);
      mostrarError("Ocurrió un error al publicar la reseña.");
    }
  };

  const handleCerrarModal = () => {
    setModalReseñaAbierto(false);
    setModalReseñaCerradaManual(true);
    limpiarSeleccion();
    if (modoSeleccion) {
      desactivarSeleccion();
    }
  };

  return (
    <div className="h-full w-full relative">
      {modoSeleccion && (
        <div className="absolute top-4 left-1/2 transform -translate-x-1/2 z-30 bg-primario text-texto px-4 py-2 rounded-lg shadow-lg">
          <div className="flex items-center gap-2">
            <span className="font-medium">
              Haz clic en el mapa para seleccionar ubicación
            </span>
            <MainButton
              type="button"
              onClick={desactivarSeleccion}
              variant="cross"
              className="px-0"
            >
              <IconX size={24} />
            </MainButton>
          </div>
        </div>
      )}

      {/* Mapa en sí */}
      <div
        ref={mapContainer}
        className={`w-full h-full ${modoSeleccion ? "cursor-crosshair" : ""}`}
        style={{
          overflow: "hidden",
          position: "relative",
          touchAction: "none",
        }}
      />

      <ModalProveedor
        proveedor={proveedorActivo}
        onClose={() => setProveedorActivo(null)}
        navigate={navigate}
      />
      <ModalReseña
        reseña={reseñaActiva}
        onClose={() => setReseñaActiva(null)}
      />
      <ModalAgregarReseña
        isOpen={modalReseñaAbierto}
        onClose={handleCerrarModal}
        onEnviar={handleAgregarReseña}
        mapRef={mapRef}
        boundsCorrientes={boundsCorrientes}
        coordenadasSeleccionadas={coordenadasSeleccionadas}
        onSeleccionarUbicacion={handleSeleccionarUbicacion}
      />
    </div>
  );
};

export default memo(MapaInteractivo);
