import { useEffect, useState } from "react";
import MainButton from "../../../ui/MainButton";
import MainH2 from "../../../ui/MainH2";
import Input from "../../../ui/Input";
import Textarea from "../../../ui/Textarea";
import Select from "../../../ui/Select";
import CheckboxDropdown from "../../../ui/CheckboxDropdown";
import { IconX } from "@tabler/icons-react";
import {
  actualizarProveedor,
  obtenerTecnologiasDisponibles,
  obtenerZonasDisponibles,
} from "../../../../services/proveedorService";
import { useAlerta } from "../../../../context/AlertaContext";
import ModalContenedor from "../../../ui/ModalContenedor";

const ModalEditarProveedor = ({ proveedor, onClose, onActualizar }) => {
  const [form, setForm] = useState({ ...proveedor });
  const [loading, setLoading] = useState(false);
  const [tecnologias, setTecnologias] = useState([]);
  const [zonas, setZonas] = useState([]);

  const { mostrarError, mostrarExito } = useAlerta();

  useEffect(() => {
    const cargarOpciones = async () => {
      try {
        const [tec, zon] = await Promise.all([
          obtenerTecnologiasDisponibles(),
          obtenerZonasDisponibles(),
        ]);
        setTecnologias(tec);
        setZonas(zon);
      } catch (error) {
        mostrarError("Error al cargar tecnologías o zonas disponibles");
      }
    };
    cargarOpciones();
  }, [mostrarError]);

  useEffect(() => {
    if (proveedor) {
      setForm({
        ...proveedor,
        tecnologias:
          proveedor.ProveedorTecnologia?.map((t) =>
            String(t.tecnologias?.id)
          ) || [],
        zonas: proveedor.ZonaProveedor?.map((z) => String(z.zonas?.id)) || [],
      });
    }
  }, [proveedor]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (campo, valores) => {
    setForm((prev) => ({ ...prev, [campo]: valores }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await actualizarProveedor(proveedor.id, {
        ...form,
        tecnologias: form.tecnologias.filter((id) => !!id),
        zonas: form.zonas.filter((id) => !!id),
      });

      mostrarExito("Proveedor actualizado correctamente");
      onActualizar?.();
      onClose();
    } catch (error) {
      mostrarError("Error al actualizar proveedor: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ModalContenedor onClose={onClose}>
      <div className="flex justify-between mb-4">
        <MainH2 className="mb-0">Editar proveedor</MainH2>
        <MainButton
          onClick={onClose}
          type="button"
          variant="cross"
          title="Cerrar modal"
          disabled={loading}
        >
          <IconX size={24} />
        </MainButton>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="flex flex-row gap-4">
          <div className="flex-1">
            <Input
              label="Nombre *"
              name="nombre"
              value={form.nombre || ""}
              onChange={handleChange}
              required
              disabled={loading}
              placeholder="Nombre del proveedor"
            />
          </div>

          <div className="flex-1">
            <Input
              label="Sitio web (url)"
              name="sitio_web"
              value={form.sitio_web || ""}
              onChange={handleChange}
              disabled={loading}
              placeholder="https://www.ejemplo.com"
            />
          </div>
        </div>

        <Textarea
          label="Descripción"
          name="descripcion"
          value={form.descripcion || ""}
          onChange={handleChange}
          rows={8}
          disabled={loading}
          placeholder="Descripción del proveedor"
        />

        <div>
          <label className="block text-texto mb-1">Color *</label>
          <div className="flex items-center gap-4">
            {/* Color picker visual */}
            <Input
              type="color"
              name="color"
              value={form.color || "#000000"}
              onChange={handleChange}
              disabled={loading}
              required
              title="Selecciona un color"
            />

            <div className="flex-1">
              <Input
                type="text"
                name="color"
                value={form.color || ""}
                onChange={(e) => {
                  const hex = e.target.value;
                  const isValid = /^#[0-9A-Fa-f]{0,6}$/.test(hex) || hex === "";

                  if (isValid) {
                    setForm((prev) => ({ ...prev, color: hex }));
                  }
                }}
                disabled={loading}
                placeholder="#000000"
                maxLength={7}
                required
              />
            </div>

            <div
              className="w-10 h-10 rounded border border-white/10"
              style={{
                backgroundColor: /^#[0-9A-Fa-f]{6}$/.test(form.color || "")
                  ? form.color
                  : "#000000",
              }}
              title={`Color: ${form.color}`}
            />
          </div>
        </div>

        <div className="flex flex-col gap-4 sm:flex-row">
          <div className="flex-1">
            <CheckboxDropdown
              label="Tecnologías"
              options={tecnologias}
              value={form.tecnologias || []}
              onChange={(val) => handleSelectChange("tecnologias", val)}
              getOptionLabel={(opt) => opt.tecnologia}
              getOptionValue={(opt) => String(opt.id)}
              disabled={loading}
            />
          </div>
          <div className="flex-1">
            <CheckboxDropdown
              label="Zonas"
              options={zonas}
              value={form.zonas || []}
              onChange={(val) => handleSelectChange("zonas", val)}
              getOptionLabel={(opt) => opt.departamento}
              getOptionValue={(opt) => String(opt.id)}
              disabled={loading}
            />
          </div>
        </div>

        <div className="flex gap-3 pt-4">
          <MainButton
            type="button"
            variant="secondary"
            onClick={onClose}
            disabled={loading}
            className="flex-1"
          >
            Cancelar
          </MainButton>
          <MainButton
            type="submit"
            variant="primary"
            loading={loading}
            disabled={loading}
            className="flex-1"
          >
            Guardar cambios
          </MainButton>
        </div>
      </form>
    </ModalContenedor>
  );
};

export default ModalEditarProveedor;
