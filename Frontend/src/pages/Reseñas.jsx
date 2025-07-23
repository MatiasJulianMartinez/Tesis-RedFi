import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { obtenerReseñasUsuario, actualizarReseña, eliminarReseña } from "../services/reseñaService";
import { IconCarambolaFilled, IconCarambola, IconCalendar, IconLoader2 } from "@tabler/icons-react";
import ModalEditarReseña from "../components/modals/mapa/ModalEditarReseña";
import ModalEliminar from "../components/modals/ModalEliminar";
import ModalReseña from "../components/modals/mapa/ModalReseña";
import MainH1 from "../components/ui/MainH1";
import MainH3 from "../components/ui/MainH3";
import MainButton from "../components/ui/MainButton";
import Table from "../components/ui/Table";

import { useAlerta } from "../context/AlertaContext";

const Reseñas = () => {
  const [reseñaParaVer, setReseñaParaVer] = useState(null);
  const { usuario } = useAuth();
  const [reseñas, setReseñas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [reseñaEditando, setReseñaEditando] = useState(null);
  const [reseñaAEliminar, setReseñaAEliminar] = useState(null);
  const [eliminando, setEliminando] = useState(false);
  const { mostrarError, mostrarExito } = useAlerta();

  useEffect(() => {
    document.title = "Red-Fi | Mis Reseñas";
  }, []);

  useEffect(() => {
    const cargarReseñas = async () => {
      if (usuario) {
        try {
          const data = await obtenerReseñasUsuario();
          setReseñas(data);
        } catch (error) {
          console.error("Error al cargar reseñas:", error);
          mostrarError("Error al cargar las reseñas.");
        } finally {
          setLoading(false);
        }
      }
    };

    cargarReseñas();
  }, [usuario]);

  const handleEditarReseña = (reseña) => {
    setReseñaEditando(reseña);
    setIsModalOpen(true);
  };

  const handleGuardarReseña = async (formData) => {
    try {
      const reseñaActualizada = await actualizarReseña(
        reseñaEditando.id,
        formData
      );
      setReseñas(
        reseñas.map((r) => (r.id === reseñaEditando.id ? reseñaActualizada : r))
      );
      setIsModalOpen(false);
      setReseñaEditando(null);
      mostrarExito("Reseña actualizada correctamente.");
    } catch (error) {
      console.error("Error al actualizar reseña:", error);
      mostrarError("Error al actualizar la reseña.");
    }
  };

  const handleEliminarReseña = (reseña) => {
    setReseñaAEliminar(reseña);
  };

  const confirmarEliminacion = async () => {
    if (!reseñaAEliminar) return;

    try {
      setEliminando(true);
      await eliminarReseña(reseñaAEliminar.id);
      setReseñas(reseñas.filter((r) => r.id !== reseñaAEliminar.id));
      mostrarExito("Reseña eliminada correctamente.");
    } catch (error) {
      console.error("Error al eliminar reseña:", error);
      mostrarError("Error al eliminar la reseña.");
    } finally {
      setEliminando(false);
      setReseñaAEliminar(null);
    }
  };

  const formatearFecha = (fecha) => {
    return new Date(fecha).toLocaleDateString("es-AR", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const renderEstrellas = (estrellas) => {
    const estrellasLlenas = Math.round(estrellas);
    return (
      <div className="flex gap-1 text-yellow-400">
        {Array.from({ length: 5 }).map((_, i) =>
          i < estrellasLlenas ? (
            <IconCarambolaFilled key={i} size={16} />
          ) : (
            <IconCarambola key={i} size={16} />
          )
        )}
      </div>
    );
  };

  const columnas = [
    {
      id: "proveedor",
      label: "Proveedor",
      renderCell: (r) => (
        <div>
          <div className="text-sm font-medium text-texto">
            {r.proveedores?.nombre || "Proveedor no disponible"}
          </div>
          {r.proveedores?.tecnologia && (
            <div className="text-sm text-texto/60">
              {r.proveedores.tecnologia}
            </div>
          )}
        </div>
      ),
    },
    {
      id: "calificacion",
      label: "Calificación",
      renderCell: (r) => renderEstrellas(r.estrellas),
    },
    {
      id: "comentario",
      label: "Comentario",
      renderCell: (r) => (
        <div className="text-sm text-texto max-w-xs truncate">
          {r.comentario}
        </div>
      ),
    },
    {
      id: "fecha",
      label: "Fecha",
      renderCell: (r) => (
        <div className="flex items-center text-sm text-texto/60">
          <IconCalendar size={16} className="mr-2" />
          {formatearFecha(r.created_at)}
        </div>
      ),
    },
    {
      id: "acciones",
      label: "Acciones",
      renderCell: (r) => (
        <div className="flex gap-2">
          <MainButton
            onClick={() => setReseñaParaVer(r)}
            variant="see"
            title="Ver reseña"
          >
            Ver
          </MainButton>
          <MainButton
            onClick={() => handleEditarReseña(r)}
            variant="edit"
            title="Editar reseña"
          >
            Editar
          </MainButton>
          <MainButton
            onClick={() => handleEliminarReseña(r)}
            variant="delete"
            title="Eliminar reseña"
          >
            Eliminar
          </MainButton>
        </div>
      ),
    },
  ];

  if (!usuario) {
    return (
      <div className="w-full bg-fondo px-4 sm:px-6 pb-12">
        <div className="max-w-7xl mx-auto pt-16 text-center">
          <p className="text-texto text-lg">No has iniciado sesión.</p>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="w-full bg-fondo px-4 sm:px-6 pb-12">
        <div className="max-w-7xl mx-auto pt-16 text-center">
          <div className="flex justify-center items-center text-texto/60 gap-2 mt-10">
            <IconLoader2 className="animate-spin" size={24} />
            Cargando reseñas...
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="self-start w-full bg-fondo px-4 sm:px-6 pb-12 relative">
      <div className="max-w-7xl mx-auto pt-16">
        <div className="text-center mb-8">
          <MainH1>Mis reseñas</MainH1>
          <p className="text-texto/70 text-lg">
            Administre todas las reseñas que ha publicado.
          </p>
        </div>

        {reseñas.length === 0 ? (
          <div className="text-center py-16">
            <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-lg p-8">
              <MainH3>No tienes reseñas publicadas</MainH3>
              <p className="text-texto/70 mb-4">
                Comienza compartiendo tu experiencia con diferentes proveedores
                de internet.
              </p>
            </div>
          </div>
        ) : (
          <>
            <div className="hidden lg:block">
              <Table columns={columnas} data={reseñas} />
            </div>

            <div className="lg:hidden space-y-4">
              {reseñas.map((reseña) => (
                <div
                  key={reseña.id}
                  className="bg-white/5 backdrop-blur-md border border-white/10 rounded-lg p-4"
                >
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <MainH3>
                        {reseña.proveedores?.nombre ||
                          "Proveedor no disponible"}
                      </MainH3>
                      {reseña.proveedores?.tecnologia && (
                        <p className="text-sm text-texto/60">
                          {reseña.proveedores.tecnologia}
                        </p>
                      )}
                    </div>
                    <div className="flex gap-2">
                      <MainButton
                        onClick={() => setReseñaParaVer(reseña)}
                        variant="see"
                        title="Ver reseña"
                        iconSize={16}
                      />
                      <MainButton
                        onClick={() => handleEditarReseña(reseña)}
                        variant="edit"
                        title="Editar reseña"
                        iconSize={16}
                      />
                      <MainButton
                        onClick={() => handleEliminarReseña(reseña)}
                        variant="delete"
                        title="Eliminar reseña"
                        iconSize={16}
                      />
                    </div>
                  </div>

                  <div className="mb-3">
                    {renderEstrellas(reseña.estrellas)}
                  </div>

                  <p className="text-sm text-texto mb-3 line-clamp-3">
                    {reseña.comentario}
                  </p>

                  <div className="flex items-center text-xs text-texto/60">
                    <IconCalendar size={14} className="mr-1" />
                    {formatearFecha(reseña.created_at)}
                  </div>
                </div>
              ))}
            </div>

            {/* Estadísticas */}
            <div className="mt-8 text-center">
              <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-lg p-6">
                <MainH3>Estadísticas de tus reseñas</MainH3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                  <div>
                    <div className="text-2xl font-bold text-acento">
                      {reseñas.length}
                    </div>
                    <div className="text-sm text-texto/60">
                      Total de reseñas
                    </div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-acento">
                      {(
                        reseñas.reduce((acc, r) => acc + r.estrellas, 0) /
                        reseñas.length
                      ).toFixed(1)}
                    </div>
                    <div className="text-sm text-texto/60">
                      Calificación promedio
                    </div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-acento">
                      {new Set(reseñas.map((r) => r.proveedor_id)).size}
                    </div>
                    <div className="text-sm text-texto/60">
                      Proveedores evaluados
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </>
        )}
      </div>

      {/* Modal ver reseña */}
      {reseñaParaVer && (
        <ModalReseña
          reseña={reseñaParaVer}
          onClose={() => setReseñaParaVer(null)}
        />
      )}

      {/* Modal editar reseña */}
      <ModalEditarReseña
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setReseñaEditando(null);
        }}
        reseña={reseñaEditando}
        onSave={handleGuardarReseña}
      />

      {/* Modal eliminar reseña */}
      {reseñaAEliminar && (
        <ModalEliminar
          titulo="Eliminar reseña"
          descripcion="¿Estás seguro que querés eliminar esta reseña? Esta acción no se puede deshacer."
          onConfirmar={confirmarEliminacion}
          onCancelar={() => setReseñaAEliminar(null)}
          loading={eliminando}
        />
      )}
    </div>
  );
};

export default Reseñas;
