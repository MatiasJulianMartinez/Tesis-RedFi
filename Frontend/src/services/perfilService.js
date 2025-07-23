// src/services/perfilService.js
import { supabase } from "../supabase/client";

// Obtener perfil extendido del usuario logueado
export const getPerfil = async (mostrarAlerta = () => {}) => {
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();
  if (userError || !user) {
    mostrarAlerta("Error al obtener el usuario.");
    throw userError;
  }

  const { data, error } = await supabase
    .from("user_profiles")
    .select("*")
    .eq("id", user.id)
    .single();

  if (error) {
    mostrarAlerta("Error al obtener el perfil.");
    throw error;
  }
  return data;
};

// Actualizar perfil
export const updatePerfil = async (fields, mostrarAlerta = () => {}) => {
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();
  if (userError || !user) {
    mostrarAlerta("Error al obtener el usuario.");
    throw userError;
  }

  const { data, error } = await supabase
    .from("user_profiles")
    .update(fields)
    .eq("id", user.id);

  if (error) {
    mostrarAlerta("Error al actualizar el perfil.");
    throw error;
  }
  return data;
};

// Crear perfil inicial tras el registro
export const crearPerfil = async ({ nombre, proveedor_preferido }, mostrarAlerta = () => {}) => {
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();
  if (userError || !user) {
    mostrarAlerta("Error al obtener el usuario.");
    throw userError;
  }

  const { error } = await supabase.from("user_profiles").insert({
    id: user.id,
    nombre,
    proveedor_preferido: proveedor_preferido || null,
  });

  if (error) {
    mostrarAlerta("Error al crear el perfil.");
    throw error;
  }
};

// Actualizar perfil y foto
export const updatePerfilYFoto = async ({
  nombre,
  proveedor_preferido,
  foto,
  preview,
  eliminarFoto = false,
}, mostrarAlerta = () => {}) => {
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();
  if (userError || !user) {
    mostrarAlerta("Error al obtener el usuario.");
    throw userError;
  }

  // Validación de nombre
  if (!nombre || nombre.trim().length < 2) {
    mostrarAlerta("El nombre debe tener al menos 2 caracteres.");
    throw new Error("El nombre debe tener al menos 2 caracteres.");
  }

  const emojiRegex = /[\p{Emoji_Presentation}\p{Extended_Pictographic}]/gu;
  const caracteresInvalidos = /[^a-zA-ZáéíóúÁÉÍÓÚñÑüÜ\s\-']/;
  if (emojiRegex.test(nombre) || caracteresInvalidos.test(nombre)) {
    mostrarAlerta("El nombre contiene caracteres no permitidos.");
    throw new Error("El nombre contiene caracteres no permitidos.");
  }

  let nuevaUrl = preview;

  const perfilActual = await getPerfil();
  const urlAntigua = perfilActual.foto_url;
  const bucketUrl = supabase.storage.from("perfiles").getPublicUrl("")
    .data.publicUrl;

  if (eliminarFoto && urlAntigua && urlAntigua.startsWith(bucketUrl)) {
    const rutaAntigua = urlAntigua.replace(bucketUrl, "").replace(/^\/+/, "");
    await supabase.storage.from("perfiles").remove([rutaAntigua]);
    nuevaUrl = null;
  }

  if (foto) {
    // Validar tipo
    const tiposPermitidos = ["image/jpeg", "image/png", "image/webp"];
    if (!tiposPermitidos.includes(foto.type)) {
      mostrarAlerta("Formato de imagen no soportado. Solo JPG, PNG o WEBP.");
      throw new Error("Formato de imagen no soportado. Solo JPG, PNG o WEBP.");
    }

    // Validar tamaño
    const MAX_TAMANO_BYTES = 300 * 1024;
    if (foto.size > MAX_TAMANO_BYTES) {
      mostrarAlerta("La imagen supera los 300 KB permitidos.");
      throw new Error("La imagen supera los 300 KB permitidos.");
    }

    // Validar resolución
    const imagenValida = await new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => {
        if (img.width > 500 || img.height > 500) {
          reject(
            mostrarAlerta("La resolución máxima permitida es 500x500 píxeles."),
            new Error("La resolución máxima permitida es 500x500 píxeles.")
          );
        } else {
          resolve(true);
        }
      };
      img.onerror = () => reject(
        mostrarAlerta("No se pudo procesar la imagen."),
        new Error("No se pudo procesar la imagen.")
      );
      img.src = URL.createObjectURL(foto);
    });

    if (!imagenValida) {
      mostrarAlerta("La imagen no es válida.");
      throw new Error("La imagen no es válida.");
    }

    const urlAntigua = perfilActual.foto_url;
    const bucketUrl = supabase.storage.from("perfiles").getPublicUrl("")
      .data.publicUrl;

    if (urlAntigua && urlAntigua.startsWith(bucketUrl)) {
      const rutaAntigua = urlAntigua.replace(bucketUrl, "").replace(/^\/+/, "");
      await supabase.storage.from("perfiles").remove([rutaAntigua]);
    }

    // Subir nueva imagen
    const carpetaUsuario = `${user.id}`;
    const nombreArchivo = `perfil-${Date.now()}`;
    const rutaCompleta = `${carpetaUsuario}/${nombreArchivo}`;

    const { error: uploadError } = await supabase.storage
      .from("perfiles")
      .upload(rutaCompleta, foto, {
        cacheControl: "3600",
        upsert: true,
      });

    if (uploadError) {
      mostrarAlerta("Error al subir la imagen al servidor.");
      throw uploadError;
    }

    const { data } = supabase.storage
      .from("perfiles")
      .getPublicUrl(rutaCompleta);
    nuevaUrl = data.publicUrl;
  }

  // Actualizar metadata en auth
  const { error: authError } = await supabase.auth.updateUser({
    data: {
      name: nombre,
      foto_perfil: nuevaUrl,
    },
  });
  if (authError) {
    mostrarAlerta("Error al actualizar los datos de autenticación.");
    throw authError;
  }

  // Actualizar en tabla personalizada
  const { error: perfilError } = await supabase
    .from("user_profiles")
    .update({
      nombre,
      proveedor_preferido,
      foto_url: nuevaUrl,
    })
    .eq("id", user.id);

  if (perfilError)
    mostrarAlerta("Error al actualizar los datos en la base de datos.");
    throw perfilError;
};

// Obtener todos los perfiles (admin)
export const obtenerPerfilesAdmin = async (mostrarAlerta = () => {}) => {
  const { data, error } = await supabase
    .from("user_profiles")
    .select("id, nombre, proveedor_preferido, rol, plan, foto_url")
    .order("nombre", { ascending: true });

  if (error) {
    mostrarAlerta("Error al obtener los perfiles.");
    throw error;
  }
  return data;
};

// Actualizar perfil por ID (admin)
export const actualizarPerfilPorId = async (
  id,
  {
    nombre,
    proveedor_preferido,
    rol,
    plan,
    foto,
    preview,
    eliminarFoto = false,
  },
  mostrarAlerta = () => {}
) => {
  // Validaciones básicas
  if (!nombre || nombre.trim().length < 2) {
    mostrarAlerta("El nombre debe tener al menos 2 caracteres.");
    throw new Error("El nombre debe tener al menos 2 caracteres.");
  }

  const emojiRegex = /[\p{Emoji_Presentation}\p{Extended_Pictographic}]/gu;
  const caracteresInvalidos = /[^a-zA-ZáéíóúÁÉÍÓÚñÑüÜ\s\-']/;
  if (emojiRegex.test(nombre) || caracteresInvalidos.test(nombre)) {
    mostrarAlerta("El nombre contiene caracteres no permitidos.");
    throw new Error("El nombre contiene caracteres no permitidos.");
  }

  let nuevaUrl = preview;

  // Obtener perfil actual del usuario a editar
  const { data: perfilActual, error: errorPerfil } = await supabase
    .from("user_profiles")
    .select("foto_url")
    .eq("id", id)
    .single();

  if (errorPerfil) {
    mostrarAlerta("Error al obtener el perfil actual.");
    throw errorPerfil;
  }

  const urlAntigua = perfilActual?.foto_url;
  const bucketUrl = supabase.storage.from("perfiles").getPublicUrl("").data.publicUrl;

  // Eliminar imagen anterior si se solicitó
  if (eliminarFoto && urlAntigua && urlAntigua.startsWith(bucketUrl)) {
    const rutaAntigua = urlAntigua.replace(bucketUrl, "").replace(/^\/+/, "");
    await supabase.storage.from("perfiles").remove([rutaAntigua]);
    nuevaUrl = null;
  }

  // Subir nueva imagen si se proporcionó
  if (foto) {
    const tiposPermitidos = ["image/jpeg", "image/png", "image/webp"];
    if (!tiposPermitidos.includes(foto.type)) {
      mostrarAlerta("Formato de imagen no soportado. Solo JPG, PNG o WEBP.");
      throw new Error("Formato de imagen no soportado. Solo JPG, PNG o WEBP.");
    }

    const MAX_TAMANO_BYTES = 300 * 1024;
    if (foto.size > MAX_TAMANO_BYTES) {
      mostrarAlerta("La imagen supera los 300 KB permitidos.");
      throw new Error("La imagen supera los 300 KB permitidos.");
    }

    const imagenValida = await new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => {
        if (img.width > 500 || img.height > 500) {
          reject(
            mostrarAlerta("La resolución máxima permitida es 500x500 píxeles."),
            new Error("La resolución máxima permitida es 500x500 píxeles.")
          );
        } else {
          resolve(true);
        }
      };
      img.onerror = () => reject(
        mostrarAlerta("No se pudo procesar la imagen."),
        new Error("No se pudo procesar la imagen.")
      );
      img.src = URL.createObjectURL(foto);
    });

    if (!imagenValida) {
      throw new Error("La imagen no es válida.");
    }

    // Eliminar anterior si existía
    if (urlAntigua && urlAntigua.startsWith(bucketUrl)) {
      const rutaAntigua = urlAntigua.replace(bucketUrl, "").replace(/^\/+/, "");
      await supabase.storage.from("perfiles").remove([rutaAntigua]);
    }

    // Subir nueva imagen
    const carpetaUsuario = `${id}`;
    const nombreArchivo = `perfil-${Date.now()}`;
    const rutaCompleta = `${carpetaUsuario}/${nombreArchivo}`;

    const { error: uploadError } = await supabase.storage
      .from("perfiles")
      .upload(rutaCompleta, foto, {
        cacheControl: "3600",
        upsert: true,
      });

    if (uploadError) {
      mostrarAlerta("Error al subir la imagen al servidor.");
      throw uploadError;
    }

    const { data } = supabase.storage.from("perfiles").getPublicUrl(rutaCompleta);
    nuevaUrl = data.publicUrl;
  }

  // Actualizar tabla user_profiles
  const { error: updateError } = await supabase
    .from("user_profiles")
    .update({
      nombre,
      proveedor_preferido,
      rol,
      plan,
      foto_url: nuevaUrl,
    })
    .eq("id", id);

  if (updateError) {
    mostrarAlerta("Error al actualizar el perfil.");
    throw updateError;
  }
};


// Eliminar perfil por ID (admin)
export const eliminarPerfilPorId = async (id, mostrarAlerta = () => {}) => {
  const { error } = await supabase
    .from("user_profiles")
    .delete()
    .eq("id", id);

  if (error) {
    mostrarAlerta("Error al eliminar el perfil.");
    throw error;
  }
};