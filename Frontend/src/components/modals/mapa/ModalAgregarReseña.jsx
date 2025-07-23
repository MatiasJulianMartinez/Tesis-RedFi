import { useState, useEffect } from "react";
import { obtenerProveedores } from "../../../services/proveedorService";
import { IconX, IconMapPin, IconLoader2 } from "@tabler/icons-react";
import MainH2 from "../../ui/MainH2";
import MainButton from "../../ui/MainButton";
import Select from "../../ui/Select";
import Textarea from "../../ui/Textarea";
import ModalContenedor from "../../ui/ModalContenedor";

import { useAlerta } from "../../../context/AlertaContext";

const ModalAgregarReseña = ({
  isOpen,
  onClose,
  onEnviar,
  mapRef,
  boundsCorrientes,
  coordenadasSeleccionadas,
  onSeleccionarUbicacion,
}) => {
  const [proveedores, setProveedores] = useState([]);
  const [proveedorSeleccionado, setProveedorSeleccionado] =
    useState("__disabled__");
  const [comentario, setComentario] = useState("");
  const [ubicacionTexto, setUbicacionTexto] = useState("");
  const [estrellas, setEstrellas] = useState(5);
  const { mostrarError } = useAlerta();
  const [errorProveedor, setErrorProveedor] = useState(false);
  const [errorUbicacion, setErrorUbicacion] = useState(false);
  const [errorComentario, setErrorComentario] = useState(false);

  const estrellasOptions = [1, 2, 3, 4, 5];

  useEffect(() => {
    const cargarProveedores = async () => {
      const data = await obtenerProveedores();
      setProveedores(data);
    };
    if (isOpen && proveedores.length === 0) {
      cargarProveedores();
    }
  }, [isOpen, proveedores.length]);

  useEffect(() => {
    if (isOpen && !coordenadasSeleccionadas) {
      // Solo reinicia si no hay coordenadas seleccionadas (primera apertura)
      setProveedorSeleccionado("__disabled__");
      setComentario("");
      setUbicacionTexto("");
      setEstrellas(5);
    }

    if (isOpen) {
      setErrorProveedor(false);
      setErrorUbicacion(false);
      setErrorComentario(false);
    }
  }, [isOpen]);

  useEffect(() => {
    if (coordenadasSeleccionadas) {
      convertirCoordenadasATexto(coordenadasSeleccionadas);
      setErrorUbicacion(false);
    }
  }, [coordenadasSeleccionadas]);

  const convertirCoordenadasATexto = async (coords) => {
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?lat=${coords.lat}&lon=${coords.lng}&format=json`
      );
      const data = await response.json();

      if (data && data.display_name) {
        setUbicacionTexto(data.display_name);
      } else {
        setUbicacionTexto(`${coords.lat.toFixed(6)}, ${coords.lng.toFixed(6)}`);
      }
    } catch (error) {
      setUbicacionTexto(`${coords.lat.toFixed(6)}, ${coords.lng.toFixed(6)}`);
      console.error("Error al convertir coordenadas:", error);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    let mensajeError = "";
    let hayError = false;

    const proveedorInvalido = proveedorSeleccionado === "__disabled__";
    setErrorProveedor(proveedorInvalido);
    if (proveedorInvalido && !mensajeError) {
      mensajeError = "Debes seleccionar un proveedor.";
      hayError = true;
    }

    const ubicacionInvalida = !coordenadasSeleccionadas;
    setErrorUbicacion(ubicacionInvalida);
    if (ubicacionInvalida && !mensajeError) {
      mensajeError = "Debes seleccionar una ubicación en el mapa.";
      hayError = true;
    }

    const comentarioInvalido = !comentario.trim();
    setErrorComentario(comentarioInvalido);
    if (comentarioInvalido && !mensajeError) {
      mensajeError = "Debes escribir un comentario.";
      hayError = true;
    }

    if (hayError) {
      mostrarError(mensajeError);
      return;
    }

    onEnviar({
      comentario,
      estrellas,
      proveedor_id: proveedorSeleccionado,
      ubicacion: coordenadasSeleccionadas,
      ubicacionTexto,
    });

    onClose();
  };

  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === "Escape" && isOpen) onClose();
    };
    if (isOpen) {
      document.addEventListener("keydown", handleEscape);
      document.body.style.overflow = "hidden";
    }
    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <ModalContenedor onClose={onClose}>
      <div className="flex justify-between mb-4">
        <MainH2 className="mb-0">Agregar reseña</MainH2>
        <MainButton
          onClick={onClose}
          type="button"
          variant="cross"
          title="Cerrar modal"
          className="px-0"
        >
          <IconX size={24} />
        </MainButton>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <Select
          label="Proveedor *"
          value={proveedorSeleccionado}
          onChange={(id) => {
            setProveedorSeleccionado(id);
            setErrorProveedor(false);
          }}
          options={[
            { id: "__disabled__", nombre: "Todos los Proveedores" },
            ...proveedores,
          ]}
          getOptionValue={(p) => p.id}
          getOptionLabel={(p) => p.nombre}
          loading={proveedores.length === 0}
          required
          isInvalid={errorProveedor}
          renderOption={(p) => (
            <option
              key={p.id}
              value={p.id}
              disabled={p.id === "__disabled__"}
              className="bg-fondo"
            >
              {p.nombre}
            </option>
          )}
        />

        {/* Ubicación */}
        <div className="space-y-2">
          <label className="block font-medium text-texto">Ubicación *</label>
          {coordenadasSeleccionadas ? (
            <div className="bg-green-500/20 border border-green-500/50 rounded-lg p-3">
              <div className="flex items-center gap-2 text-green-400 font-medium mb-1">
                <IconMapPin size={16} />
                Ubicación seleccionada
              </div>
              <p className="text-texto break-words">
                {ubicacionTexto ? (
                  ubicacionTexto
                ) : (
                  <span className="flex items-center gap-2 text-texto/60">
                    <IconLoader2 className="animate-spin" size={16} />
                    Cargando dirección...
                  </span>
                )}
              </p>
              <p className="text-texto/60 text-xs mt-1">
                {"Coordenadas: "}
                {coordenadasSeleccionadas.lat.toFixed(6)},{" "}
                {coordenadasSeleccionadas.lng.toFixed(6)}
              </p>
            </div>
          ) : (
            <div
              className={`rounded-lg p-3 transition border ${
                errorUbicacion
                  ? "bg-red-500/10 border-red-500/50"
                  : "bg-texto/5 border-texto/20"
              }`}
            >
              <p
                className={`mb-2 ${
                  errorUbicacion ? "text-red-400" : "text-texto/60"
                }`}
              >
                No has seleccionado una ubicación
              </p>
            </div>
          )}

          <MainButton
            type="button"
            onClick={onSeleccionarUbicacion}
            variant="primary"
            className={`w-full ${
              errorUbicacion
                ? "ring-2 ring-red-500 ring-offset-2 ring-offset-gray-900"
                : ""
            }`}
            title="Seleccionar ubicación en el mapa"
            icon={IconMapPin}
          >
            {coordenadasSeleccionadas
              ? "Cambiar ubicación"
              : "Seleccionar en mapa"}
          </MainButton>
        </div>

        <Select
          label="Estrellas *"
          value={estrellas}
          required
          onChange={setEstrellas}
          options={estrellasOptions}
          getOptionValue={(e) => e}
          getOptionLabel={(e) => `${e}★`}
        />

        <Textarea
          label="Comentario *"
          name="comentario"
          value={comentario}
          onChange={(e) => {
            setComentario(e.target.value);
            setErrorComentario(false);
          }}
          placeholder="Escribe tu opinión..."
          required
          isInvalid={errorComentario}
        />

        <MainButton type="submit" variant="primary" className="w-full">
          Enviar Reseña
        </MainButton>
      </form>
    </ModalContenedor>
  );
};

export default ModalAgregarReseña;
