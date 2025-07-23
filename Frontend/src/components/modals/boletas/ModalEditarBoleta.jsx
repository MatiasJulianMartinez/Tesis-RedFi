import { useState, useEffect } from "react";
import MainButton from "../../ui/MainButton";
import MainH2 from "../../ui/MainH2";
import Input from "../../ui/Input";
import FileInput from "../../ui/FileInput";
import ModalContenedor from "../../ui/ModalContenedor";
import {
  IconX,
  IconCalendar,
  IconCurrencyDollar,
  IconWifi,
} from "@tabler/icons-react";
import { actualizarBoletaConImagen } from "../../../services/boletasService";
import { useAlerta } from "../../../context/AlertaContext";

const ModalEditarBoleta = ({ boleta, onClose, onActualizar }) => {
  const [form, setForm] = useState({ ...boleta });
  const [archivoNuevo, setArchivoNuevo] = useState(null);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [imagenEliminada, setImagenEliminada] = useState(false);

  const { mostrarExito, mostrarError } = useAlerta();

  useEffect(() => {
    if (boleta.url_imagen) {
      setPreview(boleta.url_imagen);
    }
  }, [boleta.url_imagen]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleClearImagen = () => {
    setArchivoNuevo(null);
    setPreview(null);
    setImagenEliminada(true);
  };

  const handleGuardarCambios = async () => {
    setLoading(true);
    try {
      await actualizarBoletaConImagen(
        boleta,
        form,
        archivoNuevo,
        imagenEliminada
      );
      mostrarExito("Boleta actualizada correctamente.");
      window.dispatchEvent(new Event("nueva-boleta"));
      onActualizar?.();
      onClose();
    } catch (error) {
      console.error(error);
      mostrarError("Error al actualizar la boleta.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <ModalContenedor onClose={onClose}>
      {/* Encabezado */}
      <div className="flex justify-between mb-4">
        <MainH2 className="mb-0">Modificar boleta</MainH2>
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

      {/* Formulario */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Input
          name="mes"
          value={form.mes}
          onChange={handleChange}
          placeholder="Mes"
          label="Mes"
        />
        <Input
          name="anio"
          value={form.anio}
          onChange={handleChange}
          placeholder="Año"
          label="Año"
        />
        <Input
          name="monto"
          type="number"
          value={form.monto}
          onChange={handleChange}
          placeholder="Monto"
          label="Monto"
          icon={IconCurrencyDollar}
        />
        <Input
          name="proveedor"
          value={form.proveedor}
          onChange={handleChange}
          placeholder="Proveedor"
          label="Proveedor"
          icon={IconWifi}
        />
        <Input
          name="vencimiento"
          type="date"
          value={form.vencimiento}
          onChange={handleChange}
          label="Fecha de vencimiento"
          className="md:col-span-2"
          icon={IconCalendar}
        />

        {/* Imagen */}
        <div className="md:col-span-2 text-center">
          <FileInput
            id="archivoNuevo"
            label="Nueva imagen (opcional)"
            value={archivoNuevo}
            onChange={(file) => {
              setArchivoNuevo(file);
              setImagenEliminada(false); // si elige una nueva, ya no es una eliminación
            }}
            previewUrl={preview}
            setPreviewUrl={setPreview}
            existingImage={
              boleta.url_imagen && !imagenEliminada ? boleta.url_imagen : null
            }
            onClear={handleClearImagen}
          />
        </div>
      </div>

      {/* Acciones */}
      <div className="flex justify-center gap-4 pt-4">
        <MainButton
          type="button"
          variant="secondary"
          onClick={onClose}
          disabled={loading}
        >
          Cancelar
        </MainButton>

        <MainButton
          type="button"
          variant="primary"
          onClick={handleGuardarCambios}
          loading={loading}
          disabled={loading}
        >
          Guardar Cambios
        </MainButton>
      </div>
    </ModalContenedor>
  );
};

export default ModalEditarBoleta;
