import { IconX, IconCarambolaFilled, IconCarambola } from "@tabler/icons-react";
import { useNavigate } from "react-router-dom";
import MainButton from "../../ui/MainButton";
import MainLinkButton from "../../ui/MainLinkButton";
import MainH2 from "../../ui/MainH2";
import ModalContenedor from "../../ui/ModalContenedor";

const ModalProveedor = ({ proveedor, onClose }) => {
  const navigate = useNavigate();

  if (!proveedor) return null;

  // Datos simulados por ahora
  const cantidadResenas = 20;
  const promedioEstrellas = 4.3;
  const descripcionPlaceholder =
    "Proveedor destacado en la región, reconocido por su estabilidad y atención al cliente.";

  // ✅ Obtener tecnologías desde la relación muchos a muchos
  const tecnologias =
    proveedor.ProveedorTecnologia?.map((rel) => rel.tecnologias?.tecnologia) ||
    [];

  return (
    <ModalContenedor onClose={onClose}>
      {/* Botón cerrar */}
      <MainButton
        onClick={onClose}
        variant="cross"
        title="Cerrar"
        className="absolute top-3 right-3"
      >
        <IconX size={24} />
      </MainButton>

      {/* Imagen/ícono del proveedor */}
      <div className="flex justify-center mb-4">
        <div className="w-20 h-20 rounded-full bg-white/10 flex items-center justify-center text-3xl">
          🏢
        </div>
      </div>

      {/* Nombre del proveedor */}
      <MainH2 className="text-center">{proveedor.nombre}</MainH2>

      {/* Estrellas */}
      <div className="flex flex-col items-center mb-4">
        <div className="flex gap-1 text-yellow-400 text-2xl">
          {Array.from({ length: 5 }).map((_, i) =>
            i < Math.round(promedioEstrellas) ? (
              <IconCarambolaFilled key={i} size={22} />
            ) : (
              <IconCarambola key={i} size={22} />
            )
          )}
        </div>
        <span className="mt-1 text-sm text-texto/80">
          {promedioEstrellas.toFixed(1)} – {cantidadResenas} reseñas
        </span>
      </div>

      {/* Tecnologías */}
      <div className="flex flex-wrap justify-center gap-2 mb-4">
        {tecnologias.length > 0 ? (
          tecnologias.map((tec, index) => (
            <span
              key={index}
              className="bg-white/10 border border-white/10 text-xs px-3 py-1 rounded-full"
            >
              {tec}
            </span>
          ))
        ) : (
          <span className="text-sm text-texto/60">
            Sin tecnologías asociadas
          </span>
        )}
      </div>

      {/* Descripción */}
      <p className="text-sm text-texto/80 text-center mb-6 px-2">
        {descripcionPlaceholder}
      </p>

      {/* Botón "Más información" */}
      <MainLinkButton
        onClick={() => {
          onClose();
          navigate(`/proveedores/${proveedor.id}`);
        }}
        className="w-full px-4 py-2"
      >
        Más información
      </MainLinkButton>
    </ModalContenedor>
  );
};

export default ModalProveedor;
