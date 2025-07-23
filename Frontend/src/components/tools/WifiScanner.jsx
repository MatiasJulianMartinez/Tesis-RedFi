import { useEffect, useRef, useState } from "react";
import MainH2 from "../ui/MainH2";
import MainH3 from "../ui/MainH3";
import MainButton from "../ui/MainButton";
import Input from "../ui/Input";
import { useAlerta } from "../../context/AlertaContext";

const WifiScanner = () => {
  const [nombreZona, setNombreZona] = useState("");
  const [resultados, setResultados] = useState({});
  const [recomendacion, setRecomendacion] = useState("");
  const [enProgreso, setEnProgreso] = useState(false);
  const [pasoActual, setPasoActual] = useState(0);
  const [completado, setCompletado] = useState(false);
  const medidorRef = useRef(null);
  const testActivo = useRef(null);
  const { mostrarError, mostrarInfo } = useAlerta();

  useEffect(() => {
    const script = document.createElement("script");
    script.src = "/speedtest/speedtest.js";
    script.async = true;
    script.onload = () => {
      if (window.Speedtest) {
        medidorRef.current = new window.Speedtest();
        console.log("✅ Speedtest inicializado");
      } else {
        console.error("❌ Speedtest.js no se cargó correctamente.");
      }
    };
    document.body.appendChild(script);
    return () => document.body.removeChild(script);
  }, []);

  const medirZona = () => {
    if (!nombreZona.trim()) {
      mostrarError("Por favor, ingresa un nombre para la zona.");
      return;
    }

    if (!medidorRef.current) return;

    if (testActivo.current && testActivo.current._state !== 4) {
      testActivo.current.abort();
    }

    const t = new window.Speedtest();
    testActivo.current = t;
    let datosSeteados = false;
    setEnProgreso(true);
    setPasoActual(0);
    setCompletado(false);

    t.onupdate = (data) => {
      console.log("Datos obtenidos:", data);

      if (data.testState >= 1 && data.testState <= 4) {
        setPasoActual(data.testState);
      }

 if (data.testState === 4 && !datosSeteados) {
  setResultados((prev) => ({
    ...prev,
    [nombreZona]: {
      ping: parseFloat(data.pingStatus) || 0,
      jitter: parseFloat(data.jitterStatus) || 0,
    },
  }));
  datosSeteados = true;
  t.abort();
  setEnProgreso(false);
  setCompletado(true);
  setNombreZona("");
  
  setTimeout(() => {
    setCompletado(false);
    setPasoActual(0);
  }, 4000);
}
    };

    t.onerror = (err) => {
      console.error("❌ Error al medir:", err);
      mostrarError("Ocurrió un error durante la medición.");
      setEnProgreso(false);
      setPasoActual(0);
      setCompletado(false);
    };

    t.onend = () => {
      console.log("✅ Test finalizado");
      setEnProgreso(false);
    };

    t.start();
  };

  const recomendarUbicacion = () => {
    if (Object.keys(resultados).length < 2) {
      mostrarInfo("Medí al menos dos zonas para obtener una recomendación.");
      return;
    }

    const mejor = Object.entries(resultados).sort(([, a], [, b]) => {
      return a.ping + a.jitter - (b.ping + b.jitter);
    })[0];

    mostrarInfo(
      `Mejor ubicación: ${mejor[0]} (Ping: ${mejor[1].ping} ms, Jitter: ${mejor[1].jitter} ms)`
    );
  };

  const reiniciarAnalisis = () => {
    setResultados({});
    setNombreZona("");
    setCompletado(false);
    setPasoActual(0);
  };

  const eliminarZona = (zona) => {
    const nuevosResultados = { ...resultados };
    delete nuevosResultados[zona];
    setResultados(nuevosResultados);
  };

  return (
    <div className="p-6 rounded-lg mx-auto text-texto max-w-2xl relative">
      <div className="flex flex-col md:flex-row justify-center items-center gap-4 text-center">
        <div className="w-full md:w-1/2">
          <Input
            name="zona"
            value={nombreZona}
            onChange={(e) => {
              setNombreZona(e.target.value);
            }}
            placeholder="Escribí el nombre de la zona (ej: Comedor)"
            required
          />
        </div>

        <MainButton
          onClick={medirZona}
          disabled={enProgreso}
          loading={enProgreso}
        >
          {enProgreso ? "Analizando..." : "Medir conexión"}
        </MainButton>
      </div>

      {/* ✅ Barra de progreso */}
      {(enProgreso || completado) && (
        <div className="mt-4 w-full">
          <p
            className={`text-center text-sm mb-2 ${
              completado ? "text-green-400" : "text-yellow-300"
            }`}
          >
            {completado
              ? "✅ Análisis completado"
              : `Paso ${pasoActual} de 4: ${
                  {
                    1: "Conectando al servidor...",
                    2: "Midiendo descarga...",
                    3: "Midiendo subida...",
                    4: "Procesando resultados...",
                  }[pasoActual] || "Iniciando..."
                }`}
          </p>
          <div className="w-full bg-gray-700 h-3 rounded-full">
            <div
              className={`h-3 rounded-full transition-all duration-500 ${
                completado ? "bg-green-500" : "bg-yellow-400"
              }`}
              style={{
                width: `${completado ? 100 : (pasoActual / 4) * 100}%`,
              }}
            ></div>
          </div>
        </div>
      )}

      {Object.keys(resultados).length > 0 && (
        <div className="mt-6 text-left">
          <MainH3>Resultados:</MainH3>
          <ul className="space-y-2">
            {Object.entries(resultados).map(([zona, datos]) => (
              <li
                key={zona}
                className="bg-gray-800 p-3 rounded-lg flex justify-between items-center"
              >
                <span>
                  <strong>{zona}:</strong> Ping: {datos.ping} ms | Jitter:{" "}
                  {datos.jitter} ms
                </span>
                <MainButton
                  onClick={() => eliminarZona(zona)}
                  variant="delete"
                  iconSize={18}
                  className="p-1"
                  title={`Eliminar resultados de ${zona}`}
                />
              </li>
            ))}
          </ul>
        </div>
      )}

      <div className="w-full mt-6 flex flex-row items-center justify-center gap-4">
        <MainButton onClick={reiniciarAnalisis} variant="danger">
          Reiniciar análisis
        </MainButton>
        <MainButton onClick={recomendarUbicacion} variant="accent">
          Recomendar ubicación
        </MainButton>
      </div>
    </div>
  );
};

export default WifiScanner;