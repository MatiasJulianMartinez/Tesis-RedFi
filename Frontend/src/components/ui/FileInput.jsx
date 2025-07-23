import { useRef, useState, useEffect } from "react";
import MainButton from "./MainButton";
import { IconX } from "@tabler/icons-react";

const FileInput = ({
  id = "archivo",
  label = "Seleccionar imagen",
  accept = "image/*",
  onChange,
  value = null,
  previewUrl = null,
  setPreviewUrl = null,
  onClear,
  disabled = false,
  loading = false,
  existingImage = null,
  sinPreview = false,
}) => {
  const inputRef = useRef(null);
  const [internalPreview, setInternalPreview] = useState(null);

  // Mostrar preview inicial si viene externa
  useEffect(() => {
    if (previewUrl) {
      setInternalPreview(previewUrl);
    } else if (existingImage) {
      setInternalPreview(existingImage);
    }
  }, [previewUrl, existingImage]);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Resetear el value para permitir volver a elegir el mismo archivo
    if (inputRef.current) {
      inputRef.current.value = "";
    }

    onChange?.(file);

    if (!sinPreview) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setInternalPreview(reader.result);
        setPreviewUrl?.(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleClear = () => {
    if (inputRef.current) {
      inputRef.current.value = "";
    }
    onChange?.(null);
    setInternalPreview(null);
    if (!sinPreview) setPreviewUrl?.(null);
    onClear?.();
  };

  const hayPreview = internalPreview;
  const mostrarPreview = !sinPreview && hayPreview;
  const mostrarBotonQuitar = value || hayPreview;

  return (
    <div className="space-y-2 text-center text-texto">
      {label && (
        <label htmlFor={id} className="block font-medium">
          {label}
        </label>
      )}

      <label htmlFor={id} className="w-fit">
        <MainButton
          as="span"
          variant="accent"
          loading={loading}
          disabled={disabled}
          className="cursor-pointer"
        >
          {value || hayPreview ? "Cambiar imagen" : "Seleccionar imagen"}
        </MainButton>
      </label>

      <input
        id={id}
        ref={inputRef}
        type="file"
        accept={accept}
        className="hidden"
        onChange={handleFileChange}
        disabled={disabled || loading}
      />

      {/* Preview */}
      {mostrarPreview && (
        <div className="mt-2 flex flex-col items-center gap-2">
          <img
            src={internalPreview}
            alt="Imagen seleccionada"
            className="max-h-48 border rounded object-contain"
          />
        </div>
      )}

      {/* Botón de quitar */}
      {mostrarBotonQuitar && (
        <div className="pt-2">
          <MainButton
            type="button"
            variant="danger"
            onClick={handleClear}
            className="gap-2"
            disabled={disabled || loading}
          >
            <IconX size={18} /> Quitar imagen
          </MainButton>
        </div>
      )}
    </div>
  );
};

export default FileInput;
