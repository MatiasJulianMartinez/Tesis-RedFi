import PanelControlMapa from "../PanelControlMapa";
import { useAlerta } from "../../../context/AlertaContext";

const FiltrosMobile = ({
  filtrosTemporales,
  setFiltrosTemporales,
  setFiltrosAplicados,
  setMostrarFiltros,
  zonas,
  proveedores,
  tecnologiasUnicas,
  cargandoZonas,
  cargandoProveedores,
  cargandoTecnologias,
  boundsCorrientes,
  mapRef,
}) => {
  const { mostrarError } = useAlerta();

  const handleAplicarFiltros = (filtrosFinales) => {
    setFiltrosAplicados(filtrosFinales);
    setMostrarFiltros(false);
  };

  return (
    <div className="absolute bottom-0 left-0 w-full bg-[#222222] rounded-t-lg z-40 overflow-y-auto max-h-[90vh] p-4">
      <PanelControlMapa
        boundsCorrientes={boundsCorrientes}
        mapRef={mapRef}
        alerta={null}
        setAlerta={mostrarError}
        cargandoUbicacion={false}
        onUbicacionActual={() => {}}
        onAbrirModalReseña={() => {
          window.dispatchEvent(new CustomEvent("abrirModalAgregarReseña"));
          setMostrarFiltros(false);
        }}
        filtros={filtrosTemporales}
        setFiltros={setFiltrosTemporales}
        zonas={zonas}
        proveedores={proveedores}
        tecnologiasUnicas={tecnologiasUnicas}
        cargandoZonas={cargandoZonas}
        cargandoProveedores={cargandoProveedores}
        cargandoTecnologias={cargandoTecnologias}
        onFiltrar={handleAplicarFiltros}
        onCerrarPanel={() => setMostrarFiltros(false)}
      />
    </div>
  );
};

export default FiltrosMobile;
