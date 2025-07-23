import { useEffect, useState } from "react";
import { IconX } from "@tabler/icons-react";
import ModalContenedor from "../../../ui/ModalContenedor";
import MainButton from "../../../ui/MainButton";
import MainH2 from "../../../ui/MainH2";
import Input from "../../../ui/Input";
import Select from "../../../ui/Select";
import FileInput from "../../../ui/FileInput";
import { actualizarPerfilPorId } from "../../../../services/perfilService";
import { useAlerta } from "../../../../context/AlertaContext";

const opcionesRol = [
  { value: "user", label: "Usuario" },
  { value: "admin", label: "Administrador" },
];

const opcionesPlan = [
  { value: "basico", label: "Básico" },
  { value: "premium", label: "Premium" },
];

const ModalEditarPerfil = ({ perfil, onClose, onActualizar }) => {
  const [formData, setFormData] = useState({
    nombre: "",
    proveedor_preferido: "",
    rol: "user",
    plan: "basico",
    foto: null,
    preview: null,
    eliminarFoto: false,
  });

  const [loading, setLoading] = useState(false);
  const { mostrarExito, mostrarError } = useAlerta();

  useEffect(() => {
    if (perfil) {
      setFormData((prev) => ({
        ...prev,
        nombre: perfil.nombre || "",
        proveedor_preferido: perfil.proveedor_preferido || "",
        rol: perfil.rol || "user",
        plan: perfil.plan || "basico",
        preview: perfil.foto_url || null,
        foto: null,
        eliminarFoto: false,
      }));
    }
  }, [perfil]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name, value) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (file) => {
    if (file) {
      setFormData((prev) => ({
        ...prev,
        foto: file,
        preview: URL.createObjectURL(file),
        eliminarFoto: false,
      }));
    }
  };

  const handleEliminarFoto = () => {
    setFormData((prev) => ({
      ...prev,
      foto: null,
      preview: null,
      eliminarFoto: true,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await actualizarPerfilPorId(perfil.id, formData, mostrarError);
      mostrarExito("Perfil actualizado correctamente");
      onActualizar?.();
      onClose();
    } catch (error) {
      console.error("Error al actualizar el perfil:", error.message);
    } finally {
      setLoading(false);
    }
  };

  if (!perfil) return null;

  return (
    <ModalContenedor onClose={onClose}>
      {/* Encabezado */}
      <div className="flex justify-between items-center mb-4">
        <MainH2 className="mb-0">Editar Perfil</MainH2>
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
        {/* <FileInput
          label="Foto de perfil"
          onFileChange={handleFileChange}
          previewUrl={formData.preview}
          onRemove={handleEliminarFoto}
          disabled={loading}
        /> */}
        <div className="flex flex-row gap-4">
          <div className="flex-1">
            <Input
              name="nombre"
              label="Nombre *"
              value={formData.nombre}
              onChange={handleChange}
              required
              disabled={loading}
            />
          </div>
          <div className="flex-1">
            <Input
              name="proveedor_preferido"
              label="Proveedor preferido"
              value={formData.proveedor_preferido}
              onChange={handleChange}
              disabled={loading}
            />
          </div>
        </div>
        <div className="flex flex-row gap-4">
          <div className="flex-1">
            <Select
              name="rol"
              label="Rol *"
              value={formData.rol}
              onChange={(value) => handleSelectChange("rol", value)}
              options={opcionesRol}
              getOptionValue={(opt) => opt.value}
              getOptionLabel={(opt) => opt.label}
              disabled={loading}
            />
          </div>
          <div className="flex-1">
            <Select
              name="plan"
              label="Plan *"
              value={formData.plan}
              onChange={(value) => handleSelectChange("plan", value)}
              options={opcionesPlan}
              getOptionValue={(opt) => opt.value}
              getOptionLabel={(opt) => opt.label}
              disabled={loading}
            />
          </div>
        </div>

        {/* Botones */}
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
            disabled={loading}
            className="flex-1"
          >
            {loading ? "Guardando..." : "Guardar"}
          </MainButton>
        </div>
      </form>
    </ModalContenedor>
  );
};

export default ModalEditarPerfil;
