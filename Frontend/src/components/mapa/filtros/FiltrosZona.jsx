import { IconCarambola, IconCarambolaFilled } from "@tabler/icons-react";
import Select from "../../ui/Select";
import MainH3 from "../../ui/MainH3";
import MainButton from "../../ui/MainButton";

const FiltrosZona = ({
  filtros,
  setFiltros,
  onFiltrar,
  zonas,
  proveedores,
  tecnologiasUnicas,
  cargandoZonas,
  cargandoProveedores,
  cargandoTecnologias,
}) => {
  const aplicarFiltros = () => {
    onFiltrar({
      zona: filtros.zona.id || "",
      proveedor: filtros.proveedor.id || "",
      tecnologia: filtros.tecnologia || "",
      valoracionMin: filtros.valoracionMin || 0,
    });
  };

  const limpiarFiltros = () => {
    const filtrosReseteados = {
      zona: { id: "", nombre: "Todas las zonas" },
      proveedor: { id: "", nombre: "Todos los proveedores" },
      tecnologia: "",
      valoracionMin: 0,
    };
    setFiltros(filtrosReseteados);
    onFiltrar({
      zona: "",
      proveedor: "",
      tecnologia: "",
      valoracionMin: 0,
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4">
        {/* Zona */}
        <Select
          label="Zona"
          value={filtros.zona?.id || ""}
          onChange={(id) => {
            const zona = zonas.find((z) => String(z.id) === String(id)) || {
              id: "",
              nombre: "Todas las zonas",
            };
            setFiltros((prev) => ({ ...prev, zona }));
          }}
          options={zonas}
          getOptionValue={(z) => z.id}
          getOptionLabel={(z) => z.departamento || z.nombre}
          loading={cargandoZonas}
        />

        {/* Proveedor */}
        <Select
          label="Proveedor"
          value={filtros.proveedor?.id || ""}
          onChange={(id) => {
            const proveedor = proveedores.find(
              (p) => String(p.id) === String(id)
            ) || {
              id: "",
              nombre: "Todos los proveedores",
            };
            setFiltros((prev) => ({ ...prev, proveedor }));
          }}
          options={proveedores}
          getOptionValue={(p) => p.id}
          getOptionLabel={(p) => p.nombre}
          loading={cargandoProveedores}
        />

        {/* Tecnología */}
        <Select
          label="Tecnología"
          value={filtros.tecnologia || ""}
          onChange={(t) => setFiltros((prev) => ({ ...prev, tecnologia: t }))}
          options={tecnologiasUnicas}
          getOptionValue={(t) => t}
          getOptionLabel={(t) => t || "Todas las tecnologías"}
          loading={cargandoTecnologias}
        />
      </div>

      {/* Valoración exacta */}
      <div>
        <p className="block text-texto mb-1">Valoración exacta</p>
        <div className="flex items-center gap-3 flex-wrap">
          <button
            type="button"
            onClick={() =>
              setFiltros((prev) => ({ ...prev, valoracionMin: 0 }))
            }
            className={`px-3 py-1 rounded-lg text-sm font-medium border transition
              ${
                filtros.valoracionMin === 0
                  ? "bg-acento text-texto border-acento"
                  : "bg-white/5 text-texto/70 border-white/10 hover:bg-white/10"
              }`}
          >
            Todas
          </button>

          <div className="flex gap-1">
            {[1, 2, 3, 4, 5].map((v) => {
              const isActive = filtros.valoracionMin >= v;
              const StarIcon = isActive ? IconCarambolaFilled : IconCarambola;

              return (
                <button
                  key={v}
                  type="button"
                  onClick={() =>
                    setFiltros((prev) => ({ ...prev, valoracionMin: v }))
                  }
                  className="p-1"
                  title={`${v} estrella${v > 1 ? "s" : ""}`}
                >
                  <StarIcon
                    size={24}
                    className={`transition hover:scale-110 ${
                      isActive ? "text-yellow-400" : "text-texto/30"
                    }`}
                  />
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Botones */}
      <div className="w-full flex flex-col sm:flex-row gap-3">
        <MainButton
          onClick={limpiarFiltros}
          variant="secondary"
          className="w-full sm:w-[35%] h-full"
          title="Limpiar filtros"
        >
          Limpiar filtros
        </MainButton>
        <MainButton
          onClick={aplicarFiltros}
          variant="accent"
          className="w-full sm:w-[65%] h-full"
          title="Aplicar filtros"
        >
          Aplicar filtros
        </MainButton>
      </div>
    </div>
  );
};

export default FiltrosZona;
