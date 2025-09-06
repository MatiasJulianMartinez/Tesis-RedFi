import { useEffect } from "react";
import HeroSection from "../components/Inicio/HeroSection";
import Caracteristicas from "../components/Inicio/Caracteristicas";
import CTASection from "../components/Inicio/CTASection";
import PreguntasFrecuentes from "../components/Inicio/PreguntasFrecuentes";
import ReseñasDestacadas from "../components/Inicio/ReseñasDestacadas";

const Inicio = () => {
  useEffect(() => {
    document.title = "Red-Fi | Inicio";
  }, []);
  return (
    <article className="w-full">
      <HeroSection />
      <Caracteristicas />
      <PreguntasFrecuentes />
      <ReseñasDestacadas />
      <CTASection />
    </article>
  );
};

export default Inicio;
