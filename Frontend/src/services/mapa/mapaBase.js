import maplibregl from "maplibre-gl";

export const estaEnCorrientes = (lng, lat, bounds) => {
  return (
    lng >= bounds.west &&
    lng <= bounds.east &&
    lat >= bounds.south &&
    lat <= bounds.north
  );
};

export const crearMapaBase = (mapContainer, bounds) => {
  return new maplibregl.Map({
    container: mapContainer,
    style:
      "https://api.maptiler.com/maps/streets-v2-dark/style.json?key=911tGzxLSAMvhDUnyhXL",
    center: [-58.95, -28.65],
    zoom: 2,
    maxBounds: bounds,
    attributionControl: false,
  });
};

export const getVisible = (prov, filtros) => {
  if (!filtros) return true;

  // Filtro por proveedor
  if (filtros.proveedor && String(prov.id) !== String(filtros.proveedor)) return false;

  // Filtro por zona
  const tieneZona =
    !filtros.zona ||
    prov.ZonaProveedor?.some(
      (rel) => String(rel.zonas?.id) === String(filtros.zona)
    );
  if (!tieneZona) return false;

  // Filtro por tecnología
  const tieneTecnologia =
    !filtros.tecnologia ||
    prov.ProveedorTecnologia?.some(
      (rel) => rel.tecnologias?.tecnologia === filtros.tecnologia
    );
  if (!tieneTecnologia) return false;

  return true;
};
