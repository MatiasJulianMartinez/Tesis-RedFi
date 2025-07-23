import { useState } from "react";
import { IconX, IconCarambolaFilled, IconCarambola } from "@tabler/icons-react";
import MainH2 from "../../ui/MainH2";
import MainButton from "../../ui/MainButton";
import Avatar from "../../ui/Avatar";
import ModalContenedor from "../../ui/ModalContenedor";

const ModalReseña = ({ reseña, onClose }) => {
  if (!reseña) return null;

  const estrellasLlenas = Math.round(reseña.estrellas);

  let nombreBruto =
    reseña?.user_profiles?.nombre || reseña?.user_profiles?.user?.nombre;

  let nombre;
  try {
    if (nombreBruto?.includes("{")) {
      const match = nombreBruto.match(/Usuario (.*)/);
      const json = match ? JSON.parse(match[1]) : null;
      nombre = json?.nombre || nombreBruto;
    } else {
      nombre = nombreBruto;
    }
  } catch {
    nombre = nombreBruto;
  }

  const proveedor =
    reseña.nombre_proveedor ||
    reseña.proveedores?.nombre ||
    reseña.proveedor?.nombre ||
    `Proveedor ID: ${reseña.proveedor_id}`;

  const fotoUrl =
    reseña?.user_profiles?.foto_url ||
    reseña?.user_profiles?.user?.foto_perfil ||
    null;

  const iniciales = nombre
    ? nombre
        .split(" ")
        .map((n) => n[0])
        .join("")
        .slice(0, 2)
        .toUpperCase()
    : "US";

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

      {/* Avatar */}
      <div className="flex justify-center mb-4">
        <Avatar fotoUrl={fotoUrl} nombre={nombre} size={20} />
      </div>

      {/* Nombre */}
      <MainH2 className="text-2xl lg:text-3xl text-center">{nombre}</MainH2>

      {/* Proveedor */}
      <p className="text-center text-xs text-texto/60 mb-4">
        Proveedor: {proveedor}
      </p>

      {/* Estrellas */}
      <div className="flex justify-center gap-1 text-yellow-400 text-2xl mb-4">
        {Array.from({ length: 5 }).map((_, i) =>
          i < estrellasLlenas ? (
            <IconCarambolaFilled key={i} size={24} />
          ) : (
            <IconCarambola key={i} size={24} />
          )
        )}
      </div>

      {/* Comentario */}
      <p className="text-sm text-texto/90 bg-white/5 rounded-md px-4 py-4 text-center leading-relaxed">
        “{reseña.comentario}”
      </p>
    </ModalContenedor>
  );
};

export default ModalReseña;
