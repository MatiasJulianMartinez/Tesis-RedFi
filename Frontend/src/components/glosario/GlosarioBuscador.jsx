import { useState, useEffect } from "react";
import { conceptosRed } from "../../data/conceptosValidos";

const GlosarioBuscador = () => {
  const [busqueda, setBusqueda] = useState("");
  const [resultado, setResultado] = useState(null);
  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState(null);
  const [leyendo, setLeyendo] = useState(false);

  // Cancelar lectura al terminar
  useEffect(() => {
    const handleEnd = () => setLeyendo(false);
    window.speechSynthesis.addEventListener("end", handleEnd);
    return () => {
      window.speechSynthesis.removeEventListener("end", handleEnd);
    };
  }, []);

  const manejarBusqueda = async (termino) => {
    const tituloWiki = conceptosRed[termino] || termino;
    setBusqueda(termino);
    setCargando(true);
    setResultado(null);
    setError(null);

    try {
      const response = await fetch(
        `https://es.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(tituloWiki)}`
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
    <>
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

      {/* Instrucción debajo del input */}
      <div className="text-sm text-gray-400 mt-2">
        ℹ️ <strong className="text-texto">¿Cómo utilizar el buscador?</strong>{" "}
        Escribí palabras como <strong className="text-texto">"DNS"</strong>,{" "}
        <strong className="text-texto">"ping"</strong> o{" "}
        <strong className="text-texto">"ancho de banda"</strong> para conocer su
        significado.
      </div>

      {/* Botones de conceptos básicos */}
      <div className="mt-4 flex flex-wrap gap-2 justify-center">
        {[
          "IP",
          "Router",
          "Ping",
          "DNS",
          "Firewall",
          "Latencia",
          "WiFi",
          "Dirección MAC",
          "Ancho de banda",
          "Servidor",
        ].map((concepto, i) => (
          <button
            key={i}
            onClick={() => manejarBusqueda(concepto)}
            className="bg-blue-700 hover:bg-blue-800 text-texto px-3 py-1 rounded-full text-sm transition"
          >
            {concepto}
          </button>
        ))}
      </div>

      {/* Sugerencias en dropdown */}
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

      {busqueda && sugerencias.length === 0 && (
        <p className="mt-2 text-gray-400">No hay sugerencias.</p>
      )}

      {cargando && (
        <p className="mt-4 text-blue-400">Buscando en Wikipedia...</p>
      )}
      {error && <p className="mt-4 text-red-500">{error}</p>}

      {/* Resultado de la búsqueda */}
      {resultado && (
        <div className="mt-6 bg-gray-800 p-5 rounded shadow text-left">
          <h3 className="text-xl font-semibold text-texto">
            {resultado.title}
          </h3>
          <p className="mt-3 text-gray-300">{resultado.extract}</p>

          {/* Acciones: voz + Wikipedia */}
          {resultado.extract && (
            <div className="mt-4 flex flex-col sm:flex-row items-start sm:items-center gap-3">
              <button
                onClick={() => {
                  if (leyendo) {
                    speechSynthesis.cancel();
                    setLeyendo(false);
                  } else {
                    const texto = `${resultado.title}. ${resultado.extract}`;
                    const utterance = new SpeechSynthesisUtterance(texto);
                    utterance.lang = "es-ES";
                    utterance.onend = () => setLeyendo(false);
                    speechSynthesis.speak(utterance);
                    setLeyendo(true);
                  }
                }}
                className={`${
                  leyendo ? "bg-red-600 hover:bg-red-700" : "bg-green-600 hover:bg-green-700"
                } text-texto px-4 py-2 rounded flex items-center gap-2 transition`}
              >
                {leyendo ? "⏹️ Detener lectura" : "🔊 Escuchar definición"}
              </button>

              <a
                href={`https://es.wikipedia.org/wiki/${encodeURIComponent(resultado.title)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-blue-600 hover:bg-blue-700 text-texto px-4 py-2 rounded transition"
              >
                🌐 Leer más en Wikipedia
              </a>
            </div>
          )}

          {resultado.thumbnail && (
            <img
              src={resultado.thumbnail.source}
              alt={resultado.title}
              className="mt-4 rounded mx-auto"
            />
          )}
        </div>
      )}

      {/* Conceptos destacados */}
      <div className="mt-12">
        <h2 className="text-xl text-texto font-semibold mb-4 text-center">📌 Conceptos destacados</h2>
        <div className="grid md:grid-cols-3 gap-4">
          {[
            {
              termino: "Router",
              descripcion: "Es el dispositivo que conecta tu casa a Internet y reparte la señal por Wi-Fi o cable."
            },
            {
              termino: "Wi-Fi",
              descripcion: "Es la forma inalámbrica en la que tu celular o compu se conecta al router."
            },
            {
              termino: "IP pública",
              descripcion: "Es la dirección única con la que salís a Internet desde tu casa."
            }
          ].map((item, i) => (
            <div key={i} className="bg-gray-800 p-4 rounded shadow text-left">
              <h3 className="text-texto font-bold text-lg">{item.termino}</h3>
              <p className="text-gray-300 mt-2">{item.descripcion}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Concepto al azar */}
      <div className="mt-12 text-center">
        <button
          onClick={() => {
            const keys = Object.keys(conceptosRed);
            const randomKey = keys[Math.floor(Math.random() * keys.length)];
            manejarBusqueda(randomKey);
          }}
          className="bg-indigo-600 hover:bg-indigo-700 text-texto px-4 py-2 rounded mt-4 transition"
        >
          📚 Ver un concepto al azar
        </button>
      </div>
    </>
  );
};

export default GlosarioBuscador;
