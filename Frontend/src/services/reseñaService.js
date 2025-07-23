import { supabase } from "../supabase/client";

// Obtener todas las reseñas
export const obtenerReseñas = async (mostrarAlerta = () => {}) => {
  const { data, error } = await supabase.from("reseñas").select(`
      *,
      user_profiles:usuario_id (
        nombre,
        foto_url
      ),
      proveedores (
        *,
        ProveedorTecnologia (
          tecnologias (*)
        ),
        ZonaProveedor (
          zonas (*)
        )
      )
    `);

  if (error) {
    mostrarAlerta("Error al obtener reseñas.");
    throw error;
  }
  return data;
};

// Obtener reseñas del usuario autenticado
export const obtenerReseñasUsuario = async (mostrarAlerta = () => {}) => {
  try {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) throw new Error("Usuario no autenticado");

    const { data, error } = await supabase
      .from("reseñas")
      .select(
        `
        *,
        proveedores (
          *,
          ProveedorTecnologia (
            tecnologias (*)
          ),
          ZonaProveedor (
            zonas (*)
          )
        ),
        user_profiles (
          nombre,
          foto_url
        )
      `
      )
      .eq("usuario_id", user.id)
      .order("created_at", { ascending: false });

    if (error) {
      mostrarAlerta("Error al obtener reseñas del usuario.");
      throw error;
    }
    return data;
  } catch (error) {
    mostrarAlerta(`Error al obtener reseñas del usuario: ${error.message}`);
    throw error;
  }
};  

// Actualizar reseña
export const actualizarReseña = async (id, reseñaData, mostrarAlerta = () => {}) => {
  try {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) throw new Error("Usuario no autenticado");

    const { data, error } = await supabase
      .from("reseñas")
      .update({
        comentario: reseñaData.comentario,
        estrellas: reseñaData.estrellas,
        proveedor_id: reseñaData.proveedor_id,
      })
      .eq("id", id)
      .eq("usuario_id", user.id)
      .select(
        `
        *,
        proveedores (
          *,
          ProveedorTecnologia (
            tecnologias (*)
          ),
          ZonaProveedor (
            zonas (*)
          )
        )
      `
      )
      .single();

    if (error) {
      mostrarAlerta("Error al actualizar la reseña.");
      throw error;
    }
    return data;
  } catch (error) {
    mostrarAlerta(`Error al actualizar reseña: ${error.message}`);
    throw error;
  }
};

// Eliminar reseña
export const eliminarReseña = async (id, mostrarAlerta = () => {}) => {
  try {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) throw new Error("Usuario no autenticado");

    const { error } = await supabase
      .from("reseñas")
      .delete()
      .eq("id", id)
      .eq("usuario_id", user.id);

    if (error) {
      mostrarAlerta("Error al eliminar la reseña.");
      throw error;
    }
    return true;
  } catch (error) {
    mostrarAlerta(`Error al eliminar reseña: ${error.message}`);
    throw error;
  }
};

// Crear reseña
export const crearReseña = async (reseñaData, mostrarAlerta = () => {}) => {
  try {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) throw new Error("Usuario no autenticado");

    const datosReseña = {
      comentario: reseñaData.comentario,
      estrellas: reseñaData.estrellas,
      proveedor_id: reseñaData.proveedor_id,
      usuario_id: user.id,
      ubicacion: {
        lat: reseñaData.ubicacion.lat,
        lng: reseñaData.ubicacion.lng,
      },
    };

    const { data: reseñaCompleta, error: insertError } = await supabase
      .from("reseñas")
      .insert([datosReseña])
      .select(
        `
        *,
        user_profiles:usuario_id (
          nombre,
          foto_url
        ),
        proveedores (
          *,
          ProveedorTecnologia (
            tecnologias (*)
          ),
          ZonaProveedor (
            zonas (*)
          )
        )
      `
      )
      .single();

    if (insertError) {
      mostrarAlerta("Error al crear reseña.");
      throw insertError;
    }
    return reseñaCompleta;
  } catch (error) {
    mostrarAlerta(`Error en crear reseña: ${error.message}`);
    throw error;
  }
};

export const obtenerReseñasAdmin = async (mostrarAlerta = () => {}) => {
  const { data, error } = await supabase
    .from("reseñas")
    .select("id, estrellas, comentario, user_profiles(nombre), proveedor_id, proveedores(nombre)")
    .order("user_profiles(nombre)", { ascending: true });

  if (error) {
    mostrarAlerta("Error al obtener reseñas para admin.");
    throw error;
  }
  return data;
};

// reseñaService.js
export const actualizarReseñaAdmin = async (id, datos, mostrarAlerta = () => {}) => {
  const { error } = await supabase
    .from("reseñas")
    .update({
      comentario: datos.comentario,
      estrellas: datos.estrellas,
      proveedor_id: datos.proveedor_id,
    })
    .eq("id", id);

  if (error) {
    console.error("❌ Error en actualizarReseñaAdmin:", error);
    mostrarAlerta("Error al actualizar reseña como admin");
    throw error;
  }
};

export const eliminarReseñaAdmin = async (id, mostrarAlerta = () => {}) => {
  const { error } = await supabase
    .from("reseñas")
    .delete()
    .eq("id", id);

  if (error) {
    console.error("❌ Error en eliminarReseñaAdmin:", error);
    mostrarAlerta("Error al eliminar reseña como admin");
    throw error;
  }
};
