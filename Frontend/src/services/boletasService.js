// src/services/boletasService.js
import { supabase } from "../supabase/client";

/**
 * Obtiene las notificaciones relevantes a partir de las boletas del usuario.
 * - Boletas próximas a vencer (0-2 días).
 * - Comparación de monto entre las dos boletas más recientes.
 * @param {string} userId - ID del usuario autenticado
 * @returns {Promise<string[]>} Lista de mensajes de notificación
 */
export const obtenerNotificacionesBoletas = async (userId) => {
  const { data, error } = await supabase
    .from("boletas")
    .select("*")
    .eq("user_id", userId);

  if (error || !data) return [];

  const ahora = new Date();
  const alertas = [];

  data.forEach((b) => {
    const vencimiento = new Date(b.vencimiento + "T00:00:00");

    const diferenciaMs = vencimiento - ahora;
    const dias = Math.floor(diferenciaMs / (1000 * 60 * 60 * 24));
    const horas = Math.floor(
      (diferenciaMs % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
    );
    const minutos = Math.floor((diferenciaMs % (1000 * 60 * 60)) / (1000 * 60));

    if (dias >= 0 && dias <= 2) {
      let partes = [];

      if (dias > 0) {
        partes.push(`${dias} día${dias !== 1 ? "s" : ""}`);
      }
      if (horas > 0) {
        partes.push(`${horas} hora${horas !== 1 ? "s" : ""}`);
      }
      if (minutos > 0) {
        partes.push(`${minutos} minuto${minutos !== 1 ? "s" : ""}`);
      }

      const tiempo = partes.join(" y ");

      alertas.push(`📅 ${b.proveedor} vence en ${tiempo}`);
    }
  });

  const ordenadas = [...data].sort(
    (a, b) => new Date(b.vencimiento) - new Date(a.vencimiento)
  );
  if (ordenadas.length >= 2) {
    const actual = parseFloat(ordenadas[0].monto);
    const anterior = parseFloat(ordenadas[1].monto);
    const diferencia = actual - anterior;
    if (diferencia > 0) {
      alertas.push(`⚠️ Subió $${diferencia.toFixed(2)} este mes`);
    }
  }

  return alertas;
};

/**
 * Sube una imagen al bucket de Supabase y devuelve su URL pública.
 * @param {File} archivo - Archivo de imagen
 * @returns {Promise<string|null>} URL pública o null si falla
 */
export const subirImagenBoleta = async (archivo) => {
  const fileName = `boleta-${Date.now()}-${archivo.name}`;
  const { error: uploadError } = await supabase.storage
    .from("boletas")
    .upload(fileName, archivo);

  if (uploadError) {
    throw new Error("Error al subir la imagen.");
  }

  const { data: publicUrlData } = supabase.storage
    .from("boletas")
    .getPublicUrl(fileName);

  return publicUrlData.publicUrl;
};

/**
 * Inserta una nueva boleta en la base de datos.
 * @param {Object} boleta - Objeto con los campos de la boleta
 * @returns {Promise<void>}
 */
export const guardarBoleta = async (boleta) => {
  const { error } = await supabase.from("boletas").insert(boleta);
  if (error) throw error;
};

/**
 * Devuelve el usuario autenticado actual.
 * @returns {Promise<Object|null>} Usuario o null
 */
export const obtenerUsuarioActual = async () => {
  const { data } = await supabase.auth.getUser();
  return data?.user || null;
};

/**
 * Elimina una boleta y su imagen (si existe) de la base de datos y el storage.
 * @param {Object} boleta - Objeto de boleta con `id` y `url_imagen`
 * @returns {Promise<void>}
 */
export const eliminarBoletaConImagen = async (boleta) => {
  const { error } = await supabase.from("boletas").delete().eq("id", boleta.id);

  if (error) {
    throw new Error("Error al eliminar la boleta de la base de datos.");
  }

  if (boleta.url_imagen) {
    const fileName = boleta.url_imagen.split("/").pop();
    const { error: storageError } = await supabase.storage
      .from("boletas")
      .remove([fileName]);

    if (storageError) {
      console.warn(
        "La boleta fue eliminada, pero hubo un error al borrar la imagen:",
        storageError.message
      );
    }
  }
};

/**
 * Actualiza una boleta y reemplaza su imagen si se indica.
 * @param {Object} boleta - La boleta original
 * @param {Object} nuevosDatos - Nuevos campos del formulario
 * @param {File|null} nuevaImagen - Imagen nueva (si se eligió)
 */
export const actualizarBoletaConImagen = async (
  boleta,
  nuevosDatos,
  nuevaImagen,
  eliminarImagen = false
) => {
  let url_imagen = boleta.url_imagen;

  // Si el usuario quiere eliminar la imagen (sin subir una nueva)
  if (eliminarImagen && boleta.url_imagen) {
    const fileName = boleta.url_imagen.split("/").pop();
    await supabase.storage.from("boletas").remove([fileName]);
    url_imagen = null;
  }

  // Si se sube una nueva imagen
  if (nuevaImagen) {
    // Eliminar imagen anterior si existe
    if (boleta.url_imagen) {
      const oldPath = boleta.url_imagen.split("/").pop();
      await supabase.storage.from("boletas").remove([oldPath]);
    }

    const nuevoNombre = `boleta-${Date.now()}-${nuevaImagen.name}`;
    const { error: errorSubida } = await supabase.storage
      .from("boletas")
      .upload(nuevoNombre, nuevaImagen);

    if (errorSubida) {
      throw new Error("Error al subir la nueva imagen.");
    }

    const { data: publicUrlData } = supabase.storage
      .from("boletas")
      .getPublicUrl(nuevoNombre);

    url_imagen = publicUrlData.publicUrl;
  }

  // Actualizar la boleta con o sin imagen
  const { error } = await supabase
    .from("boletas")
    .update({ ...nuevosDatos, url_imagen })
    .eq("id", boleta.id);

  if (error) throw new Error("Error al guardar cambios.");
};

/**
 * Devuelve todas las boletas del usuario autenticado.
 * @returns {Promise<Array>} Lista de boletas
 */
export const obtenerBoletasDelUsuario = async () => {
  const { data: auth } = await supabase.auth.getUser();
  const user = auth?.user;
  if (!user) return [];

  const { data, error } = await supabase
    .from("boletas")
    .select("*")
    .eq("user_id", user.id)
    .order("fecha_carga", { ascending: false });

  if (error) {
    console.error("Error al cargar boletas:", error);
    return [];
  }

  return data;
};
