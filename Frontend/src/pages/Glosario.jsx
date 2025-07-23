import MainH1 from "../components/ui/MainH1";
import { IconSearch } from "@tabler/icons-react";
import GlosarioBuscador from "../components/glosario/GlosarioBuscador";

const Glosario = () => {
  return (
    <div className="p-6 rounded-lg max-w-4xl mx-auto my-8 text-center">
      <MainH1 icon={IconSearch}>Glosario de Redes</MainH1>
      <GlosarioBuscador />
    </div>
  );
};

export default Glosario;