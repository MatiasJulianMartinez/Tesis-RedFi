import { obtenerReseñas } from "../reseñaService";

export const cargarReseñasEnMapa = async (
  map,
  setReseñaActiva,
  filtros = {},
  reseñasSourceId = "reseñas-source",
  reseñasLayerId = "reseñas-layer"
) => {
  try {
    const reseñas = await obtenerReseñas();

    const features = reseñas
      .map((r) => {
        const coords = r.ubicacion ? [r.ubicacion.lng, r.ubicacion.lat] : null;
        if (!coords || isNaN(coords[0]) || isNaN(coords[1])) return null;

        return {
          type: "Feature",
          geometry: { type: "Point", coordinates: coords },
          properties: {
            // 🔧 Datos básicos
            id: r.id,
            proveedor_id: r.proveedor_id,
            usuario_id: r.usuario_id,
            estrellas: r.estrellas,
            comentario: r.comentario,
            zona_id: r.proveedores?.zona_id || "",
            tecnologia: r.proveedores?.tecnologia || "",

            // 🔧 AGREGAR datos de relaciones completos
            user_profiles: r.user_profiles || null,
            proveedores: r.proveedores || null,

            // 🔧 También agregar nombres directamente para fácil acceso
            nombre_usuario:
              r.user_profiles?.nombre || `Usuario ${r.usuario_id}`,
            nombre_proveedor:
              r.proveedores?.nombre || `Proveedor ID: ${r.proveedor_id}`,
          },
        };
      })
      .filter(Boolean);

    const geojson = { type: "FeatureCollection", features };

    if (map.getSource(reseñasSourceId)) {
      map.getSource(reseñasSourceId).setData(geojson);
    } else {
      map.addSource(reseñasSourceId, { type: "geojson", data: geojson });
      map.addLayer({
        id: reseñasLayerId,
        type: "circle",
        source: reseñasSourceId,
        paint: {
          "circle-radius": 6,
          "circle-color": "#FB8531",
          "circle-stroke-width": 1,
          "circle-stroke-color": "#fff",
        },
      });

      // 🔄 Solo eventos de hover, NO de click (se maneja globalmente)
      map.on("mouseenter", reseñasLayerId, () => {
        if (window.modoSeleccionActivo) return;
        map.getCanvas().style.cursor = "pointer";
      });
      map.on("mouseleave", reseñasLayerId, () => {
        if (window.modoSeleccionActivo) return;
        map.getCanvas().style.cursor = "";
      });
    }

    actualizarVisibilidadReseñas(map, filtros, reseñasLayerId);

  } catch (error) {
    console.error("❌ Error en cargarReseñasEnMapa:", error);
    throw error;
  }
};

export const actualizarVisibilidadReseñas = (
  map,
  filtros,
  layerId = "reseñas-layer"
) => {
  if (!map.getLayer(layerId)) return;

  const filter = ["all"];
  if (filtros.proveedor)
    filter.push(["==", ["get", "proveedor_id"], filtros.proveedor]);
  if (filtros.zona) filter.push(["==", ["get", "zona_id"], filtros.zona]);
  if (filtros.tecnologia)
    filter.push(["==", ["get", "tecnologia"], filtros.tecnologia]);
  if (filtros.valoracionMin && !isNaN(filtros.valoracionMin))
    filter.push(["==", ["get", "estrellas"], filtros.valoracionMin]);

  map.setFilter(layerId, filter);
};
