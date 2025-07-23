import { IconCarambola, IconCarambolaFilled } from "@tabler/icons-react";
import MainButton from "../ui/MainButton";
import Avatar from "../ui/Avatar";

export const generarColumnas = (tabla, datos, acciones = {}) => {
  if (!datos.length) return [];

  const ejemplo = datos[0];
  const columnasBase = [];

  // 1. Perfiles
  if (tabla === "user_profiles") {
    columnasBase.push(
      {
        id: "avatar",
        label: "AVATAR",
        renderCell: (row) => (
          <Avatar fotoUrl={row.foto_url} nombre={row.nombre} size={8} />
        ),
      },
      {
        id: "nombre",
        label: "NOMBRE",
        renderCell: (row) => row.nombre,
      },
      {
        id: "proveedor_preferido",
        label: "PROVEEDOR PREFERIDO",
        renderCell: (row) => row.proveedor_preferido || "—",
      },
      {
        id: "rol",
        label: "ROL",
        renderCell: (row) => row.rol,
      },
      {
        id: "plan",
        label: "PLAN",
        renderCell: (row) => row.plan,
      }
    );
  }

  // 2. Proveedores
  else if (tabla === "proveedores") {
    columnasBase.push(
      { id: "nombre", label: "NOMBRE", renderCell: (row) => row.nombre },
      {
        id: "descripcion",
        label: "DESCRIPCIÓN",
        renderCell: (row) => (
          <div
            className="max-w-[100px] truncate text-ellipsis overflow-hidden"
            title={row.descripcion}
          >
            {row.descripcion || "—"}
          </div>
        ),
      },
      {
        id: "sitio_web",
        label: "SITIO WEB",
        renderCell: (row) => (
          <div
            className="max-w-[100px] truncate text-ellipsis overflow-hidden"
            title={row.sitio_web}
          >
            {row.sitio_web || "—"}
          </div>
        ),
      },
      {
        id: "tecnologias",
        label: "TECNOLOGÍAS",
        renderCell: (row) => {
          const tecnologias = row.tecnologias || [];
          const maxToShow = 1;
          const visibles = tecnologias.slice(0, maxToShow);
          const restantes = tecnologias.length - visibles.length;

          return tecnologias.length > 0 ? (
            <div
              className="flex flex-wrap gap-1 max-w-[225px] overflow-hidden"
              title={tecnologias.join(", ")}
            >
              {visibles.map((tec, i) => (
                <span
                  key={i}
                  className="bg-white/10 text-texto text-sm px-2 py-0.5 rounded-lg"
                >
                  {tec}
                </span>
              ))}
              {restantes > 0 && (
                <span className="text-texto/60 text-sm px-2 py-0.5 rounded-lg border border-white/10">
                  +{restantes} más
                </span>
              )}
            </div>
          ) : (
            "—"
          );
        },
      },

      {
        id: "color",
        label: "COLOR",
        renderCell: (row) => (
          <div
            className="w-5 h-5 rounded max-w-[50px]"
            style={{ backgroundColor: row.color }}
          />
        ),
      }
    );
  }

  // 3. Reseñas
  else if (tabla === "reseñas") {
    columnasBase.push(
      {
        id: "user_profiles",
        label: "USUARIOS",
        renderCell: (row) => row.user_profiles?.nombre || "—",
      },
      {
        id: "proveedores",
        label: "PROVEEDORES",
        renderCell: (row) => row.proveedores?.nombre || "—",
      },
      {
        id: "estrellas",
        label: "ESTRELLAS",
        renderCell: (row) => (
          <div className="flex gap-1">
            {Array.from({ length: 5 }, (_, i) =>
              i < row.estrellas ? (
                <IconCarambolaFilled
                  key={i}
                  size={18}
                  className="text-yellow-400"
                />
              ) : (
                <IconCarambola key={i} size={18} className="text-yellow-400" />
              )
            )}
          </div>
        ),
      },
      {
        id: "comentario",
        label: "COMENTARIO",
        renderCell: (row) => (
          <div
            className="max-w-[250px] truncate text-ellipsis overflow-hidden"
            title={row.comentario}
          >
            {row.comentario || "—"}
          </div>
        ),
      }
    );
  }

  // 4. Tecnologías
  else if (tabla === "tecnologias") {
    columnasBase.push(
      {
        id: "tecnologia",
        label: "TECNOLOGÍA",
        renderCell: (row) => row.tecnologia,
      },
      {
        id: "descripcion",
        label: "DESCRIPCIÓN",
        renderCell: (row) => row.descripcion || "—",
      }
    );
  }

  // 5. Fallback para tablas desconocidas
  else {
    const keys = Object.keys(ejemplo);
    keys.forEach((key) => {
      columnasBase.push({
        id: key,
        label: key.toUpperCase(),
        renderCell: (row) => row[key]?.toString?.() || "—",
      });
    });
  }

  // Acciones (común para todas)
  if (acciones.onVer || acciones.onEditar || acciones.onEliminar) {
    columnasBase.push({
      id: "acciones",
      label: "ACCIONES",
      renderCell: (row) => (
        <div className="flex flex-wrap gap-2">
          {acciones.onVer && (
            <MainButton
              onClick={() => acciones.onVer(row)}
              title="Ver"
              variant="see"
            >
              Ver
            </MainButton>
          )}
          {acciones.onEditar && (
            <MainButton
              onClick={() => acciones.onEditar(row)}
              title="Editar"
              variant="edit"
            >
              Editar
            </MainButton>
          )}
          {acciones.onEliminar && (
            <MainButton
              onClick={() => acciones.onEliminar(row)}
              title="Eliminar"
              variant="delete"
            >
              Eliminar
            </MainButton>
          )}
        </div>
      ),
    });
  }

  return columnasBase;
};
