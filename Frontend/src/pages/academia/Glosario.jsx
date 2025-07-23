import { useState } from "react";
import { conceptosRed } from "../../data/conceptosValidos";
import MainH1 from "../../components/ui/MainH1";
import { IconSearch } from "@tabler/icons-react";

const Glosario = () => {
  const [busqueda, setBusqueda] = useState("");
  const [resultado, setResultado] = useState(null);
  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState(null);

  const manejarBusqueda = async (termino) => {
    const tituloWiki = conceptosRed[termino] || termino;
    setBusqueda(termino);
    setCargando(true);
    setResultado(null);
    setError(null);
    try {
      const response = await fetch(
        `https://es.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(
          tituloWiki
        )}`
      );
      const data = await response.json();
      if (data.extract) {
        setResultado(data);
      } else {
        setResultado({
          title: termino,
          extract: "No se encontró información.",
        });
      }
    } catch (err) {
      setError("Error al consultar Wikipedia.");
    } finally {
      setCargando(false);
    }
  };

  const sugerencias = Object.keys(conceptosRed).filter((concepto) =>
    concepto.toLowerCase().includes(busqueda.toLowerCase())
  );

  return (
    <div className="p-6 rounded-lg max-w-4xl mx-auto my-8 text-center">
      <MainH1 icon={IconSearch}>Glosario de Redes</MainH1>

      {/* Input con botón de limpieza */}
      <div className="relative w-full">
        <input
          type="text"
          value={busqueda}
          onChange={(e) => setBusqueda(e.target.value)}
          placeholder="Buscar un concepto (ej: IP pública)"
          className="w-full p-3 rounded border border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 text-texto bg-gray-900 placeholder-gray-400 pr-10"
        />
        {busqueda && (
          <button
            className="absolute top-1/2 right-3 transform -translate-y-1/2 text-gray-400 hover:text-red-500 text-xl"
            onClick={() => {
              setBusqueda("");
              setResultado(null);
              setError(null);
            }}
            title="Borrar búsqueda"
          >
            ×
          </button>
        )}
      </div>

      {/* Lista de sugerencias con scroll */}
      {busqueda && sugerencias.length > 0 && (
        <ul className="mt-2 bg-gray-800 rounded shadow-sm text-left max-h-64 overflow-y-auto">
          {sugerencias.map((sugerencia, idx) => (
            <li
              key={idx}
              className="p-3 hover:bg-gray-700 cursor-pointer border-b border-gray-600 last:border-0"
              onClick={() => manejarBusqueda(sugerencia)}
            >
              {sugerencia}
            </li>
          ))}
        </ul>
      )}

      {/* Mensaje si no hay coincidencias */}
      {busqueda && sugerencias.length === 0 && (
        <p className="mt-2 text-gray-400">No hay sugerencias.</p>
      )}

      {/* Indicadores de carga o error */}
      {cargando && (
        <p className="mt-4 text-blue-400">Buscando en Wikipedia...</p>
      )}

      {error && <p className="mt-4 text-red-500">{error}</p>}

      {/* Resultado mostrado */}
      {resultado && (
        <div className="mt-6 bg-gray-800 p-5 rounded shadow text-left">
          <h3 className="text-xl font-semibold text-texto">
            {resultado.title}
          </h3>
          <p className="mt-3 text-gray-300">{resultado.extract}</p>
          {resultado.thumbnail && (
            <img
              src={resultado.thumbnail.source}
              alt={resultado.title}
              className="mt-4 rounded mx-auto"
            />
          )}
          <a
            href={`https://es.wikipedia.org/wiki/${encodeURIComponent(
              resultado.title
            )}`}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-4 inline-block text-blue-400 hover:underline"
          >
            Leer más en Wikipedia
          </a>
        </div>
      )}
    </div>
  );
};

export default Glosario;
