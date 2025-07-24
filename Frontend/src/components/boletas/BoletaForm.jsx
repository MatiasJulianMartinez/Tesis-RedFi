import { useState } from "react";
import MainButton from "../ui/MainButton";
import MainH2 from "../ui/MainH2";
import Input from "../ui/Input";
import Select from "../ui/Select";
import FileInput from "../ui/FileInput";
import {
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

const BoletaForm = ({ onBoletaAgregada, onActualizarNotificaciones, setVista }) => {
  const [form, setForm] = useState({
    mes: "",
    anio: "",
    monto: "",
    proveedor: "",
    vencimiento: "",
    promoHasta: "",
    proveedorOtro: "",
  });

  const [archivo, setArchivo] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const { mostrarExito, mostrarError } = useAlerta();

  const meses = [
    "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
    "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre",
  ];

  const proveedores = ["Fibertel", "Telecentro", "Claro", "Movistar", "Otro"];

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

      const promoHastaAjustado = form.promoHasta
        ? new Date(form.promoHasta + "T12:00:00").toISOString()
        : null;

      const proveedorFinal =
        form.proveedor === "Otro" ? form.proveedorOtro : form.proveedor;

      await guardarBoleta({
        mes: form.mes,
        anio: form.anio,
        monto: form.monto,
        proveedor: proveedorFinal,
        user_id: user.id,
        vencimiento: vencimientoAjustado,
        promo_hasta: promoHastaAjustado,
        url_imagen,
      });

      mostrarExito("Boleta guardada correctamente.");

      setForm({
        mes: "",
        anio: "",
        monto: "",
        proveedor: "",
        vencimiento: "",
        promoHasta: "",
        proveedorOtro: "",
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
          {/* Select de mes */}
          <Select
            label="Mes *"
            name="mes"
            value={form.mes}
            onChange={handleChange}
            options={meses}
            required
          />

          <Input
            label="Año *"
            name="anio"
            type="number"
            value={form.anio}
            onChange={handleChange}
            placeholder="Ej. 2025"
            min="2020"
            max="2035"
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
            min="0"
            step="0.01"
            icon={IconCurrencyDollar}
          />

          {/* Select de proveedor */}
          <Select
            label="Proveedor *"
            name="proveedor"
            value={form.proveedor}
            onChange={handleChange}
            options={proveedores}
            required
            icon={IconWifi}
          />

          {/* Solo se muestra si elige "Otro" */}
          {form.proveedor === "Otro" && (
            <Input
              label="Nombre del proveedor"
              name="proveedorOtro"
              value={form.proveedorOtro}
              onChange={handleChange}
              placeholder="Ej. Red Fibra Z"
              required
            />
          )}

          <Input
            label="Fecha de vencimiento *"
            name="vencimiento"
            type="date"
            value={form.vencimiento}
            onChange={handleChange}
            required
            icon={IconCalendar}
          />

          <Input
            label="Fin de promoción (opcional)"
            name="promoHasta"
            type="date"
            value={form.promoHasta}
            onChange={handleChange}
            icon={IconCalendar}
          />

          <div className="md:col-span-2 text-center">
            <FileInput
              id="archivo"
              label="Imagen de la boleta (opcional)"
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
