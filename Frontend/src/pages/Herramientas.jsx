import { useEffect } from "react";
import DetectorProveedor from "../components/tools/DetectorProveedor";
import SpeedTest from "../components/tools/SpeedTest";
import WifiScanner from "../components/tools/WifiScanner";
import { IconTool } from "@tabler/icons-react";
import MainH1 from "../components/ui/MainH1";
import MainH2 from "../components/ui/MainH2";

const Herramientas = () => {
  useEffect(() => {
    document.title = "Red-Fi | Herramientas";
  }, []);

  return (
    <div className="w-full">
      <section className="py-16 px-4 sm:px-6 space-y-12 text-texto mx-auto">
        {/* Encabezado */}
        <div className="w-full text-center">
          <MainH1 icon={IconTool}>Herramientas Red-Fi</MainH1>
          <p className="mx-auto">
            Ejecute pruebas clave y obtenga información útil sobre su red
            actual.
          </p>
        </div>

        {/* Contenedor flex o grid */}
        <div className="mx-auto max-w-7xl grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Detector de proveedor */}
          <div className="w-full bg-white/5 border border-white/10 p-8 rounded-lg self-start">
            <MainH2>Información de tu red</MainH2>
            <DetectorProveedor />
          </div>
          {/* Test de velocidad */}
          <div className="w-full bg-white/5 border border-white/10 p-8 rounded-lg">
            <MainH2>Test de velocidad</MainH2>
            <SpeedTest />
          </div>
        </div>

        {/* WifiScanner – análisis por zona */}
        <div className="bg-white/5 mx-auto max-w-7xl border border-white/10 p-8 rounded-lg">
          <div className="w-full text-center">
            <MainH2>Análisis de conexión por zonas de tu casa</MainH2>
            <div className=" text-gray-300 p-4 rounded leading-relaxed">
              <p>
                Medí la calidad de tu Wi-Fi en distintas zonas de tu casa
                ingresando un nombre (ej: <strong>Living</strong>,{" "}
                <strong>Pieza</strong>, <strong>Balcón</strong>) y ejecutando el
                test.
              </p>
              <p className="mt-2">
                Ideal para encontrar el mejor lugar para ubicar el módem o
                comparar el rendimiento por sector.
              </p>
            </div>
          </div>
          <WifiScanner />
        </div>
      </section>
    </div>
  );
};

export default Herramientas;
