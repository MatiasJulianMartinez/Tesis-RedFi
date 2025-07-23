import { useState, useRef } from "react";
import MainButton from "../ui/MainButton";
import MainH2 from "../ui/MainH2";
import Input from "../ui/Input";
import FileInput from "../ui/FileInput";
import {
  IconX,
  IconCalendar,
  IconCurrencyDollar,
  IconWifi,
} from "@tabler/icons-react";
import {
  obtenerUsuarioActual,
  subirImagenBoleta,
  guardarBoleta,
} from "../../services/boletasService";
import { useAlerta } from "../../context/AlertaContext";

const BoletaForm = ({
  onBoletaAgregada,
  onActualizarNotificaciones,
  setVista,
}) => {
  const [form, setForm] = useState({
    mes: "",
    anio: "",
    monto: "",
    proveedor: "",
    vencimiento: "",
  });

  const [archivo, setArchivo] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const { mostrarExito, mostrarError } = useAlerta();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const user = await obtenerUsuarioActual();
    if (!user) {
      mostrarError("Debés iniciar sesión.");
      return;
    }

    let url_imagen = null;

    try {
      if (archivo) {
        url_imagen = await subirImagenBoleta(archivo);
      }

      const vencimientoAjustado = new Date(
        form.vencimiento + "T12:00:00"
      ).toISOString();

      await guardarBoleta({
        ...form,
        user_id: user.id,
        vencimiento: vencimientoAjustado,
        url_imagen,
      });

      mostrarExito("Boleta guardada correctamente.");

      setForm({
        mes: "",
        anio: "",
        monto: "",
        proveedor: "",
        vencimiento: "",
      });
      setArchivo(null);
      setPreviewUrl(null);

      if (onBoletaAgregada) onBoletaAgregada();
      if (onActualizarNotificaciones) onActualizarNotificaciones();
      window.dispatchEvent(new Event("nueva-boleta"));

      setVista?.("historial");
    } catch (error) {
      console.error(error);
      mostrarError("Error al guardar la boleta.");
    }
  };

  return (
    <div>
      <MainH2 className="text-center">Carga de boletas</MainH2>
      <form
        onSubmit={handleSubmit}
        className="space-y-6 bg-white/5 border border-white/10 p-6 rounded-lg"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            label="Mes *"
            name="mes"
            value={form.mes}
            onChange={handleChange}
            placeholder="Ej. Abril"
            required
          />

          <Input
            label="Año *"
            name="anio"
            value={form.anio}
            onChange={handleChange}
            placeholder="Ej. 2025"
            required
          />

          <Input
            label="Monto *"
            name="monto"
            type="number"
            value={form.monto}
            onChange={handleChange}
            placeholder="Monto $"
            required
            icon={IconCurrencyDollar}
          />

          <Input
            label="Proveedor *"
            name="proveedor"
            value={form.proveedor}
            onChange={handleChange}
            placeholder="Ej. Fibertel"
            required
            icon={IconWifi}
          />

          <div className="md:col-span-2">
            <Input
              label="Fecha de vencimiento *"
              name="vencimiento"
              type="date"
              value={form.vencimiento}
              onChange={handleChange}
              required
              icon={IconCalendar}
            />
          </div>

          {/* Selector de imagen */}
          <div className="md:col-span-2 text-center">
            <FileInput
              id="archivo"
              label="Imagen de la boleta *"
              value={archivo}
              onChange={setArchivo}
              previewUrl={previewUrl}
              setPreviewUrl={setPreviewUrl}
            />
          </div>
        </div>

        <div className="flex justify-center">
          <MainButton type="submit" variant="primary">
            Guardar boleta
          </MainButton>
        </div>
      </form>
    </div>
  );
};

export default BoletaForm;
