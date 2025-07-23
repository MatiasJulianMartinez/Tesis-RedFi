import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { obtenerProveedorPorId } from "../services/proveedorService";
import {
  IconCarambola,
  IconCarambolaFilled,
  IconExternalLink,
} from "@tabler/icons-react";
import MainH1 from "../components/ui/MainH1";
import MainH2 from "../components/ui/MainH2";

const Proveedores = () => {
  const { id } = useParams();
  const [proveedor, setProveedor] = useState(null);

  useEffect(() => {
    const fetchProveedor = async () => {
      const data = await obtenerProveedorPorId(id);
      setProveedor(data);
    };
    fetchProveedor();
  }, [id]);

  if (!proveedor) {
    return (
      <div className="text-center text-texto mt-20">
        <p className="text-lg animate-pulse">Cargando proveedor...</p>
      </div>
    );
  }

  const tecnologias = proveedor?.ProveedorTecnologia?.map(
    (rel) => rel.tecnologias?.tecnologia
  ) || [];

  return (
    <div className="w-full bg-fondo px-4 sm:px-6 py-16">
      <div className="max-w-4xl mx-auto">
        {/* Info principal del proveedor */}
        <div className="bg-white/5 border border-white/10 rounded-2xl p-6 mb-10 shadow-lg text-center">
          {/* Avatar / ícono */}
          <div className="flex justify-center mb-4">
            <div className="w-20 h-20 rounded-full bg-white/10 text-3xl flex items-center justify-center">
              🏢
            </div>
          </div>

          {/* Nombre */}
          <MainH1>{proveedor.nombre}</MainH1>

          {/* Tecnologías */}
          {tecnologias.length > 0 ? (
            <p className="text-texto/70 mt-2">
              Tecnologías:{" "}
              <span className="font-medium text-texto">
                {tecnologias.join(", ")}
              </span>
            </p>
          ) : (
            <p className="text-texto/60 mt-2">Tecnologías no especificadas</p>
          )}

          {/* Descripción breve */}
          <p className="text-sm text-texto/70 mt-4 max-w-xl mx-auto leading-relaxed">
            {proveedor.descripcion ||
              "Proveedor destacado en Corrientes por su cobertura, estabilidad y servicio al cliente. Red-Fi lo destaca por su presencia activa en múltiples zonas urbanas y rurales."}
          </p>

          {/* Botón sitio web */}
          <a
            href={proveedor.sitio_web || "https://www.google.com"}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center mt-6 px-5 py-2 bg-primario hover:bg-acento transition text-texto rounded-lg font-medium"
          >
            Visitar sitio oficial <IconExternalLink size={18} className="ml-2" />
          </a>
        </div>

        {/* Reseñas */}
        <div>
          <MainH2>Opiniones de usuarios</MainH2>

          {proveedor.reseñas && proveedor.reseñas.length > 0 ? (
            <div className="space-y-6">
              {proveedor.reseñas.map((r) => {
                const nombre = r.user?.nombre || "Usuario";
                const fotoUrl = r.user?.foto_url || null;
                const iniciales = nombre
                  .split(" ")
                  .map((n) => n[0])
                  .join("")
                  .slice(0, 2)
                  .toUpperCase();

                const fecha = r.created_at
                  ? new Date(r.created_at).toLocaleDateString("es-AR", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })
                  : "Fecha desconocida";

                return (
                  <div
                    key={r.id}
                    className="bg-white/5 border border-white/10 p-5 rounded-xl flex flex-col gap-3"
                  >
                    {/* Usuario + estrellas */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        {fotoUrl ? (
                          <img
                            src={fotoUrl}
                            alt={`Avatar de ${nombre}`}
                            className="w-10 h-10 rounded-full object-cover border border-acento"
                          />
                        ) : (
                          <div className="w-10 h-10 rounded-full bg-white/10 text-texto font-bold flex items-center justify-center text-sm border border-acento">
                            {iniciales}
                          </div>
                        )}
                        <div>
                          <p className="font-medium text-texto">{nombre}</p>
                          <p className="text-xs text-texto/60">{fecha}</p>
                        </div>
                      </div>

                      <div className="flex gap-1 text-yellow-400 pl-2">
                        {Array.from({ length: 5 }, (_, i) =>
                          i < r.estrellas ? (
                            <IconCarambolaFilled size={18} key={i} />
                          ) : (
                            <IconCarambola size={18} key={i} />
                          )
                        )}
                      </div>
                    </div>

                    {/* Comentario */}
                    <p className="text-texto/90 leading-relaxed">
                      “{r.comentario}”
                    </p>
                  </div>
                );
              })}
            </div>
          ) : (
            <p className="text-texto/60 text-center">
              Este proveedor aún no tiene reseñas.
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Proveedores;
