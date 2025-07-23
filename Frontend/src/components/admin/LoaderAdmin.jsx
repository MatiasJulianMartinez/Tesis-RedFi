import { IconLoader2 } from "@tabler/icons-react";
import MainH1 from "../ui/MainH1";

const LoaderAdmin = () => (
  <div className="w-full bg-fondo px-4 sm:px-6 pb-12 self-start">
    <div className="max-w-7xl mx-auto pt-16">
      <div className="text-center mb-8">
        <MainH1>Panel de Administración</MainH1>
        <p className="text-texto/70 text-lg">
          Visualizá los datos de todas las tablas del sistema.
        </p>
      </div>
      <div className="flex justify-center items-center text-texto/60 gap-2 mt-10">
        <IconLoader2 className="animate-spin" size={24} />
        Cargando datos del sistema...
      </div>
    </div>
  </div>
);

export default LoaderAdmin;
