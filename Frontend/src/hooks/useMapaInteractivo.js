import { useEffect, useRef, useState, useCallback, useMemo } from "react";
import { useLocation } from "react-router-dom";
import maplibregl from "maplibre-gl";
import {
  crearMapaBase,
  cargarProveedoresEnMapa,
  actualizarVisibilidadEnMapa,
  cargarReseñasEnMapa,
  actualizarVisibilidadReseñas,
} from "../services/mapa";
import { obtenerReseñas } from "../services/reseñaService";

// ✅ Helper para esperar que una capa esté completamente cargada
const esperarCapaCargada = (map, layerId, timeout = 5000) => {
  return new Promise((resolve, reject) => {
    const start = Date.now();

    const verificar = () => {
      const capas = map.getStyle()?.layers;
      const capa = capas?.find((l) => l.id === layerId);
      const fuente = capa?.source;
      const fuenteObj = map.getSource(fuente);

      const cargada =
        map.isStyleLoaded() &&
        capa &&
        fuenteObj &&
        typeof fuenteObj.loaded === "function" &&
        fuenteObj.loaded();

      if (cargada) {
        resolve();
      } else if (Date.now() - start > timeout) {
        reject(`⏱ Timeout esperando capa ${layerId}`);
      } else {
        setTimeout(verificar, 100);
      }
    };

    map.once("idle", verificar);
  });
};

export const useMapaInteractivo = (filtros, boundsCorrientes) => {
  const mapContainer = useRef(null);
  const mapRef = useRef(null);
  const navControlRef = useRef(null);
  const isMapLoaded = useRef(false);
  const proveedoresRef = useRef([]);
  const reseñasCompletasRef = useRef([]);
  const location = useLocation();

  const filtrosNormalizados = useMemo(
    () => ({
      zona: filtros?.zona || "",
      proveedor: filtros?.proveedor || "",
      tecnologia: filtros?.tecnologia || "",
      valoracionMin: filtros?.valoracionMin || 0,
    }),
    [filtros]
  );

  const filtrosActualesRef = useRef(filtrosNormalizados);

  const [cargandoMapa, setCargandoMapa] = useState(true);
  const [mapaListoVisualmente, setMapaListoVisualmente] = useState(false);
  const [proveedorActivo, setProveedorActivo] = useState(null);
  const [reseñaActiva, setReseñaActiva] = useState(null);

  const manejarClickGlobal = useCallback((e) => {
    if (!mapRef.current || window.modoSeleccionActivo) return;

    const features = mapRef.current.queryRenderedFeatures(e.point);
    const reseñaFeature = features.find((f) => f.layer.id === "reseñas-layer");

    if (reseñaFeature) {
      const reseñaId = reseñaFeature.properties.id;
      const reseñaCompleta = reseñasCompletasRef.current.find(
        (r) => r.id === reseñaId
      );

      if (reseñaCompleta) {
        setReseñaActiva(reseñaCompleta);
      } else {
        const p = reseñaFeature.properties;
        const proveedorReal = proveedoresRef.current.find(
          (pr) => pr.id === p.proveedor_id
        );
        const fallback = {
          id: p.id,
          proveedor_id: p.proveedor_id,
          usuario_id: p.usuario_id,
          estrellas: parseInt(p.estrellas) || 0,
          comentario: p.comentario || "Sin comentario",
          proveedores: proveedorReal
            ? { nombre: proveedorReal.nombre }
            : { nombre: `Proveedor ${p.proveedor_id}` },
          user_profiles: {
            nombre: `Usuario ${p.usuario_id.substring(0, 8)}...`,
          },
        };
        setReseñaActiva(fallback);
      }
      return;
    }

    const proveedorFeature = features.find((f) =>
      f.layer.id.startsWith("fill-")
    );
    if (proveedorFeature) {
      const proveedorIdCompuesto = proveedorFeature.layer.id.replace(
        "fill-",
        ""
      );
      const proveedorId = proveedorIdCompuesto.split("-")[0]; // Extrae solo el prov.id
      const proveedor = proveedoresRef.current.find(
        (p) => p.id.toString() === proveedorId
      );

      if (proveedor?.visible) {
        setProveedorActivo(proveedor);
      }
    }
  }, []);

  const cargarReseñasIniciales = useCallback(async (filtrosParaUsar = null) => {
    if (mapRef.current && isMapLoaded.current) {
      const filtrosAUsar = filtrosParaUsar || filtrosActualesRef.current;
      try {
        const reseñasCompletas = await obtenerReseñas();
        reseñasCompletasRef.current = reseñasCompletas;
        await cargarReseñasEnMapa(mapRef.current, null, filtrosAUsar);
        filtrosActualesRef.current = filtrosAUsar;
      } catch (error) {
        console.error("❌ Error cargando reseñas iniciales:", error);
      }
    }
  }, []);

  const actualizarFiltrosReseñas = useCallback(() => {
    if (!mapRef.current || !isMapLoaded.current) return;

    const anterior = filtrosActualesRef.current;
    const nuevo = filtrosNormalizados;
    const cambio =
      anterior.zona !== nuevo.zona ||
      anterior.proveedor !== nuevo.proveedor ||
      anterior.tecnologia !== nuevo.tecnologia ||
      anterior.valoracionMin !== nuevo.valoracionMin;

    if (!cambio) return;

    try {
      actualizarVisibilidadReseñas(mapRef.current, filtrosNormalizados);
      filtrosActualesRef.current = filtrosNormalizados;
    } catch (error) {
      console.error("❌ Error actualizando filtros:", error);
    }
  }, [filtrosNormalizados]);

  useEffect(() => {
    if (!mapContainer.current || mapRef.current) return;

    const map = crearMapaBase(mapContainer.current, [
      [boundsCorrientes.west, boundsCorrientes.south],
      [boundsCorrientes.east, boundsCorrientes.north],
    ]);

    mapRef.current = map;
    const navControl = new maplibregl.NavigationControl();
    navControlRef.current = navControl;

    const setNavPosition = () => {
      const isMobile = window.innerWidth < 1024;
      try {
        map.removeControl(navControl);
      } catch {}
      map.addControl(navControl, isMobile ? "bottom-left" : "bottom-right");
    };

    setNavPosition();
    window.addEventListener("resize", setNavPosition);

    map.on("load", async () => {
      isMapLoaded.current = true;

      try {
        proveedoresRef.current = await cargarProveedoresEnMapa(
          map,
          filtrosNormalizados,
          null
        );
        await cargarReseñasIniciales(filtrosNormalizados);

        await esperarCapaCargada(map, "reseñas-layer", 5000);

        setMapaListoVisualmente(true);
        setCargandoMapa(false);

        map.on("click", manejarClickGlobal);
      } catch (error) {
        console.error("❌ Error en carga inicial del mapa:", error);
        setCargandoMapa(false);
      }
    });

    return () => {
      if (map) {
        map.off("click", manejarClickGlobal);
        map.remove();
      }
      window.removeEventListener("resize", setNavPosition);
      proveedoresRef.current = [];
      reseñasCompletasRef.current = [];
      mapRef.current = null;
      isMapLoaded.current = false;
    };
  }, [boundsCorrientes, manejarClickGlobal]);

  useEffect(() => {
    if (location.pathname === "/mapa" && isMapLoaded.current) {
      cargarReseñasIniciales(filtrosNormalizados);
    }
  }, [location.pathname, cargarReseñasIniciales, filtrosNormalizados]);

  useEffect(() => {
    if (!mapRef.current || !isMapLoaded.current) return;
    try {
      actualizarVisibilidadEnMapa(
        mapRef.current,
        proveedoresRef,
        filtrosNormalizados
      );
      actualizarFiltrosReseñas();
    } catch (error) {
      console.error("❌ Error actualizando filtros:", error);
    }
  }, [filtrosNormalizados, actualizarFiltrosReseñas]);

  return {
    mapContainer,
    mapRef,
    cargandoMapa,
    mapaListoVisualmente,
    proveedorActivo,
    setProveedorActivo,
    reseñaActiva,
    setReseñaActiva,
    cargarReseñasIniciales,
    reseñasCompletasRef,
  };
};
