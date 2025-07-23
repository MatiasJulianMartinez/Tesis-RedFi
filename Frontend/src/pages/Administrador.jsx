import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getPerfil, obtenerPerfilesAdmin, eliminarPerfilPorId } from "../services/perfilService";
import { obtenerProveedoresAdmin, eliminarProveedor } from "../services/proveedorService";
import {
  obtenerReseñasAdmin,
  actualizarReseñaAdmin,
  eliminarReseñaAdmin,
} from "../services/reseñaService";
import {
  obtenerTecnologias,
  eliminarTecnologia,
} from "../services/tecnologiaService";

import ModalEliminar from "../components/modals/ModalEliminar";

import ModalVerPerfil from "../components/modals/admin/perfiles/ModalVerPerfil";
import ModalEditarPerfil from "../components/modals/admin/perfiles/ModalEditarPerfil";

import ModalVerReseña from "../components/modals/mapa/ModalReseña";
import ModalEditarReseña from "../components/modals/mapa/ModalEditarReseña";

import ModalVerTecnologia from "../components/modals/admin/tecnologias/ModalVerTecnologia";
import ModalEditarTecnologia from "../components/modals/admin/tecnologias/ModalEditarTecnologia";

import ModalVerProveedor from "../components/modals/mapa/ModalProveedor";
import ModalEditarProveedor from "../components/modals/admin/proveedores/ModalEditarProveedor";

import Table from "../components/ui/Table";
import MainH1 from "../components/ui/MainH1";

import TablaSelector from "../components/admin/TablaSelector";
import LoaderAdmin from "../components/admin/LoaderAdmin";
import { generarColumnas } from "../components/admin/generarColumnas";

import { useAlerta } from "../context/AlertaContext";

const tablasDisponibles = [
  { id: "user_profiles", label: "Perfiles" },
  { id: "proveedores", label: "Proveedores" },
  { id: "reseñas", label: "Reseñas" },
  { id: "tecnologias", label: "Tecnologías" },
];

const Administrador = () => {
  const [perfil, setPerfil] = useState(null);
  const [tablaActual, setTablaActual] = useState("user_profiles");
  const [loading, setLoading] = useState(true);
  const { mostrarError, mostrarExito } = useAlerta();
  const navigate = useNavigate();

  const [perfilSeleccionado, setPerfilSeleccionado] = useState(null);
  const [perfilAVer, setPerfilAVer] = useState(null);
  const [perfilAEliminar, setPerfilAEliminar] = useState(null);

  const [proveedorSeleccionado, setProveedorSeleccionado] = useState(null);
  const [proveedorAVer, setProveedorAVer] = useState(null);
  const [proveedorAEliminar, setProveedorAEliminar] = useState(null);

  const [reseñaSeleccionada, setReseñaSeleccionada] = useState(null);
  const [reseñaAVer, setReseñaAVer] = useState(null);
  const [reseñaAEliminar, setReseñaAEliminar] = useState(null);

  const [tecnologiaSeleccionada, setTecnologiaSeleccionada] = useState(null);
  const [tecnologiaAVer, setTecnologiaAVer] = useState(null);
  const [tecnologiaAEliminar, setTecnologiaAEliminar] = useState(null);
  const [eliminando, setEliminando] = useState(false);

  const [todosLosDatos, setTodosLosDatos] = useState({
    user_profiles: [],
    proveedores: [],
    reseñas: [],
    tecnologias: [],
  });

  const acciones = {
    onVer: (row) => {
      if (tablaActual === "user_profiles") {
        setPerfilAVer(row);
      }
      if (tablaActual === "proveedores") {
        setProveedorAVer(row);
      }
      if (tablaActual === "reseñas") {
        setReseñaAVer(row);
      }
      if (tablaActual === "tecnologias") {
        setTecnologiaAVer(row);
      }
      // ...otros casos
    },
    onEditar: (row) => {
      if (tablaActual === "user_profiles") {
        setPerfilSeleccionado(row);
      }
      if (tablaActual === "proveedores") {
        setProveedorSeleccionado(row);
      }
      if (tablaActual === "reseñas") {
        setReseñaSeleccionada(row);
      }
      if (tablaActual === "tecnologias") {
        setTecnologiaSeleccionada(row);
      }
    },
    onEliminar: (row) => {
      if (tablaActual === "user_profiles") {
        setPerfilAEliminar(row);
      }
      if (tablaActual === "proveedores") {
        setProveedorAEliminar(row);
      }
      if (tablaActual === "reseñas") {
        setReseñaAEliminar(row);
      }
      if (tablaActual === "tecnologias") {
        setTecnologiaAEliminar(row);
      }
    },
  };

  const precargarDatos = async () => {
    setLoading(true);
    try {
      const [perfiles, proveedores, reseñas, tecnologias] = await Promise.all([
        obtenerPerfilesAdmin(),
        obtenerProveedoresAdmin(),
        obtenerReseñasAdmin(),
        obtenerTecnologias(),
      ]);
      setTodosLosDatos({
        user_profiles: perfiles,
        proveedores,
        reseñas,
        tecnologias,
      });
    } catch (error) {
      mostrarError("Error al cargar datos.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const verificarPermisos = async () => {
      try {
        const p = await getPerfil();
        setPerfil(p);
        if (p.rol !== "admin") {
          navigate("/cuenta", {
            state: {
              alerta: {
                tipo: "error",
                mensaje: "No tienes permisos para acceder a esta vista.",
              },
            },
          });
        } else {
          await precargarDatos();
        }
      } catch (error) {
        mostrarError("Error al cargar perfil de usuario.");
        setLoading(false);
      }
    };

    verificarPermisos();
  }, [navigate]);

  if (!perfil || perfil.rol !== "admin") return;
  if (loading) return <LoaderAdmin />;

  const datosActuales = todosLosDatos[tablaActual] || [];
  const columnas = generarColumnas(tablaActual, datosActuales, acciones);

  return (
    <div className="w-full bg-fondo px-4 sm:px-6 pb-12 self-start">
      <div className="max-w-7xl mx-auto pt-16">
        <div className="text-center mb-8">
          <MainH1>Panel de Administración</MainH1>
          <p className="text-texto/70 text-lg">
            Visualizá los datos de todas las tablas del sistema.
          </p>
        </div>

        <TablaSelector
          tablas={tablasDisponibles}
          tablaActual={tablaActual}
          setTablaActual={setTablaActual}
        />
        <Table columns={columnas} data={datosActuales} />

        {/* Perfiles */}
          { /* Ver */}
        {tablaActual === "user_profiles" && perfilAVer && (
          <ModalVerPerfil
            perfil={perfilAVer}
            onClose={() => setPerfilAVer(null)}
          />
        )}
          {/* Editar */}
        {tablaActual === "user_profiles" && perfilSeleccionado && (
          <ModalEditarPerfil
            perfil={perfilSeleccionado}
            onClose={() => setPerfilSeleccionado(null)}
            onActualizar={precargarDatos}
          />
        )}
          {/* Eliminar */}
        {tablaActual === "user_profiles" && perfilAEliminar && (
          <ModalEliminar
            titulo="¿Eliminar perfil?"
            descripcion={`¿Estás seguro de que querés eliminar el perfil "${perfilAEliminar.nombre}"?`}
            loading={eliminando}
            onCancelar={() => setPerfilAEliminar(null)}
            onConfirmar={async () => {
              setEliminando(true);
              try {
                await eliminarPerfilPorId(perfilAEliminar.id, mostrarError);
                mostrarExito("Perfil eliminado con éxito.");
                setPerfilAEliminar(null);
                precargarDatos();
              } catch (error) {
                mostrarError("Error al eliminar perfil: " + error.message);
              } finally {
                setEliminando(false);
              }
            }}
          />
          )}
        {/* Proveedores */}
          { /* Ver */}
        {tablaActual === "proveedores" && proveedorAVer && (
          <ModalVerProveedor
            proveedor={proveedorAVer}
            onClose={() => setProveedorAVer(null)}
          />
        )}
          {/* Editar */}
        {tablaActual === "proveedores" && proveedorSeleccionado && (
          <ModalEditarProveedor
            proveedor={proveedorSeleccionado}
            onClose={() => setProveedorSeleccionado(null)}
            onActualizar={precargarDatos}
          />
        )}
          {/* Eliminar */}
        {tablaActual === "proveedores" && proveedorAEliminar && (
          <ModalEliminar
            titulo="¿Eliminar proveedor?"
            descripcion={`¿Estás seguro de que querés eliminar el proveedor "${proveedorAEliminar.nombre}"?`}
            loading={eliminando}
            onCancelar={() => setProveedorAEliminar(null)}
            onConfirmar={async () => {
              setEliminando(true);
              try {
                await eliminarProveedor(proveedorAEliminar.id, mostrarError);
                mostrarExito("Proveedor eliminado correctamente");
                setProveedorAEliminar(null);
                await precargarDatos();
              } catch (e) {
                mostrarError("Error al eliminar proveedor: " + e.message);
              } finally {
                setEliminando(false);
              }
            }}
          />
        )}

        {/* Reseñas */}
          {/* Ver */}
        {tablaActual === "reseñas" && reseñaAVer && (
          <ModalVerReseña
            reseña={reseñaAVer}
            onClose={() => setReseñaAVer(null)}
          />
        )}
          {/* Editar */}
        {tablaActual === "reseñas" && reseñaSeleccionada && (
          <ModalEditarReseña
            isOpen={!!reseñaSeleccionada}
            reseña={reseñaSeleccionada}
            onClose={() => setReseñaSeleccionada(null)}
            onSave={async (datosActualizados) => {
              try {
                await actualizarReseñaAdmin(reseñaSeleccionada.id, datosActualizados, mostrarError);
                mostrarExito("Reseña actualizada correctamente");
                await precargarDatos();
                setReseñaSeleccionada(null);
              } catch (e) {
                mostrarError("Error al actualizar reseña: " + e.message);
              }
            }}
          />
        )}
          {/* Eliminar */}
        {tablaActual === "reseñas" && reseñaAEliminar && (
          <ModalEliminar
            titulo="¿Eliminar reseña?"
            descripcion="¿Estás seguro de que querés eliminar esta reseña?"
            loading={eliminando}
            onCancelar={() => setReseñaAEliminar(null)}
            onConfirmar={async () => {
              setEliminando(true);
              try {
                await eliminarReseñaAdmin(reseñaAEliminar.id, mostrarError);
                mostrarExito("Reseña eliminada correctamente");
                setReseñaAEliminar(null);
                await precargarDatos();
              } catch (e) {
                mostrarError("Error al eliminar reseña: " + e.message);
              } finally {
                setEliminando(false);
              }
            }}
          />
        )}

        {/* Tecnologías */}
          {/* Ver */}
        {tablaActual === "tecnologias" && tecnologiaAVer && (
          <ModalVerTecnologia
            tecnologia={tecnologiaAVer}
            onClose={() => setTecnologiaAVer(null)}
          />
        )}
          {/* Editar */}
        {tablaActual === "tecnologias" && tecnologiaSeleccionada && (
          <ModalEditarTecnologia
            tecnologia={tecnologiaSeleccionada}
            onClose={() => setTecnologiaSeleccionada(null)}
            onActualizar={precargarDatos}
          />
        )}
          {/* Eliminar */}
        {tablaActual === "tecnologias" && tecnologiaAEliminar && (
          <ModalEliminar
            titulo="¿Eliminar tecnología?"
            descripcion={`¿Estás seguro de que querés eliminar la tecnología "${tecnologiaAEliminar.tecnologia}"?`}
            loading={eliminando}
            onCancelar={() => setTecnologiaAEliminar(null)}
            onConfirmar={async () => {
              setEliminando(true);
              try {
                await eliminarTecnologia(tecnologiaAEliminar.id, mostrarError);
                setTecnologiaAEliminar(null);
                mostrarExito("Tecnología eliminada con éxito.");
                await precargarDatos();
              } catch (e) {
                console.error("Error al eliminar tecnología: " + e.message);
              } finally {
                setEliminando(false);
              }
            }}
          />
        )}
      </div>
    </div>
  );
};

export default Administrador;
