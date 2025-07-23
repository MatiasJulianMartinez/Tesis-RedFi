// components/ui/Table.jsx
import classNames from "classnames";

const Table = ({ columns = [], data = [], className = "" }) => {
  return (
    <div
      className={classNames(
        "bg-white/5 backdrop-blur-md border border-white/10 rounded-lg overflow-hidden",
        className
      )}
    >
      <table className="w-full">
        <thead className="bg-white/10">
          <tr>
            {columns.map((col) => (
              <th
                key={col.id}
                className="px-6 py-4 text-left text-sm font-medium text-texto uppercase tracking-wider"
              >
                {col.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-white/10">
          {data.length === 0 ? (
            <tr>
              <td
                colSpan={columns.length}
                className="px-6 py-4 text-center text-texto/60"
              >
                No hay datos para mostrar.
              </td>
            </tr>
          ) : (
            data.map((row, rowIndex) => (
              <tr key={row.id || rowIndex}>
                {columns.map((col) => (
                  <td
                    key={col.id}
                    className={classNames(
                      "px-6 py-4 text-texto text-sm",
                      col.id === "acciones" &&
                        "min-w-[375px] max-w-[375px] w-[375px]"
                    )}
                  >
                    {typeof col.renderCell === "function"
                      ? col.renderCell(row, rowIndex)
                      : row[col.id]}
                  </td>
                ))}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

export default Table;
