import { obtenerProveedores } from "../proveedorService";
import { getVisible } from "./mapaBase";
import maplibregl from "maplibre-gl";

export const cargarProveedoresEnMapa = async (
  map,
  filtros,
  setProveedorActivo
) => {
  const proveedores = await obtenerProveedores();
  const proveedoresConEstado = proveedores.map((p) => ({
    ...p,
    visible: getVisible(p, filtros),
  }));

  proveedoresConEstado.forEach((prov) => {
    if (!prov.ZonaProveedor || prov.ZonaProveedor.length === 0) return;

    prov.ZonaProveedor.forEach((relacionZona) => {
      const zona = relacionZona.zonas;
      if (!zona || !zona.geom) return;

      const sourceId = `zona-${prov.id}-${zona.id}`;
      const fillLayerId = `fill-${prov.id}-${zona.id}`;
      const lineLayerId = `line-${prov.id}-${zona.id}`;

      if (map.getSource(sourceId)) {
        map.removeLayer(fillLayerId);
        map.removeLayer(lineLayerId);
        map.removeSource(sourceId);
      }

      map.addSource(sourceId, {
        type: "geojson",
        data: { type: "Feature", geometry: zona.geom, properties: {} },
      });

      map.addLayer({
        id: fillLayerId,
        type: "fill",
        source: sourceId,
        paint: {
          "fill-color": prov.color || "#888888",
          "fill-opacity": 0.4,
        },
        layout: {
          visibility: prov.visible ? "visible" : "none",
        },
      });

      map.addLayer({
        id: lineLayerId,
        type: "line",
        source: sourceId,
        paint: {
          "line-color": prov.color || "#000000",
          "line-width": 2,
          "line-opacity": 1,
        },
        layout: {
          visibility: prov.visible ? "visible" : "none",
        },
      });

      let popup = new maplibregl.Popup({
        closeButton: false,
        closeOnClick: false,
        offset: 10,
      });

      let popupTimeout = null;
      let lastMouseMove = null;

      map.on("mouseenter", fillLayerId, (e) => {
        if (window.modoSeleccionActivo || !prov.visible) return;
        map.getCanvas().style.cursor = "pointer";
        map.setPaintProperty(fillLayerId, "fill-opacity", 0.6);
      });

      map.on("mousemove", fillLayerId, (e) => {
        if (window.modoSeleccionActivo || !prov.visible) return;
        lastMouseMove = Date.now();
        if (popup.isOpen()) {
          popup.setLngLat(e.lngLat);
          return;
        }
        clearTimeout(popupTimeout);
        popupTimeout = setTimeout(() => {
          const now = Date.now();
          const quiet = now - lastMouseMove >= 350;
          if (quiet && !window.modoSeleccionActivo) {
            popup
              .setLngLat(e.lngLat)
              .setHTML(`<div class="text-sm font-semibold">${prov.nombre}</div>`)
              .addTo(map);
          }
        }, 350);
      });

      map.on("mouseleave", fillLayerId, () => {
        if (window.modoSeleccionActivo || !prov.visible) return;
        map.getCanvas().style.cursor = "";
        map.setPaintProperty(fillLayerId, "fill-opacity", 0.4);
        clearTimeout(popupTimeout);
        popup.remove();
      });
    });
  });

  return proveedoresConEstado;
};

export const actualizarVisibilidadEnMapa = (map, proveedoresRef, filtros) => {
  proveedoresRef.current.forEach((prov) => {
    const visible = getVisible(prov, filtros);
    prov.visible = visible;

    if (!prov.ZonaProveedor || prov.ZonaProveedor.length === 0) return;

    prov.ZonaProveedor.forEach((relacionZona) => {
      const zona = relacionZona.zonas;
      if (!zona) return;

      const fillLayerId = `fill-${prov.id}-${zona.id}`;
      const lineLayerId = `line-${prov.id}-${zona.id}`;

      if (map.getLayer(fillLayerId)) {
        map.setLayoutProperty(
          fillLayerId,
          "visibility",
          visible ? "visible" : "none"
        );
      }
      if (map.getLayer(lineLayerId)) {
        map.setLayoutProperty(
          lineLayerId,
          "visibility",
          visible ? "visible" : "none"
        );
      }
    });
  });
};
