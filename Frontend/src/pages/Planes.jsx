import { useAuth } from "../context/AuthContext";
import { useRole } from "../context/RoleContext";
import { useEffect } from "react";
import { IconCheck } from "@tabler/icons-react";
import MainH1 from "../components/ui/MainH1";
import MainH2 from "../components/ui/MainH2";
import MainButton from "../components/ui/MainButton";
import MainLinkButton from "../components/ui/MainLinkButton";

const beneficiosBasico = [
  { texto: "Acceso al mapa interactivo", disponible: true },
  { texto: "Ver y agregar reseñas", disponible: true },
  { texto: "Acceso a las herramientas", disponible: true },
  { texto: "Acceso completo a la gestión de boletas", disponible: false },
  { texto: "Acceso completo a Red-Fi Academy", disponible: false },
  { texto: "Sin anuncios ni banners promocionales", disponible: false },
  { texto: "Notificaciones básicas", disponible: false },
];

const beneficiosPremium = [
  { texto: "Acceso al mapa interactivo", disponible: true },
  { texto: "Ver y agregar reseñas", disponible: true },
  { texto: "Acceso a las herramientas", disponible: true },
  { texto: "Acceso completo a la gestión de boletas", disponible: true },
  { texto: "Acceso completo a Red-Fi Academy", disponible: true },
  { texto: "Sin anuncios ni banners promocionales", disponible: true },
  { texto: "Notificaciones básicas", disponible: true },
];

const Planes = () => {
  const { usuario } = useAuth();
  const { plan } = useRole();
  const planActual = plan || "basico";

  useEffect(() => {
    document.title = "Red-Fi | Planes";
  }, []);

  const renderBeneficios = (lista) => (
    <ul className="text-sm text-texto/80 space-y-2 mb-6 text-left">
      {lista.map((b, i) => (
        <li
          key={i}
          className={`flex items-center ${!b.disponible ? "opacity-50" : ""}`}
        >
          <IconCheck
            size={18}
            className={`${b.disponible ? "text-acento" : "text-gray-400"} mr-2`}
          />
          {b.texto}
        </li>
      ))}
    </ul>
  );

  return (
    <div className="w-full">
      <section className="py-16 px-4 sm:px-6 space-y-12 text-texto mx-auto">
        <div className="w-full text-center">
          <MainH1>Elija su plan Red-Fi</MainH1>
          <p className="mx-auto">
            Compare los planes y seleccione el que mejor se adapte a sus
            necesidades.
          </p>
        </div>

        <div className="mx-auto max-w-5xl grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Plan Básico */}
          <div className="bg-white/5 border border-white/10 rounded-xl p-6 shadow-lg flex flex-col justify-between">
            <div>
              <MainH2>Plan Básico</MainH2>
              <p className="text-texto/70 mb-4">
                Ideal para usuarios que quieren explorar Red-Fi sin funciones
                avanzadas.
              </p>
              {renderBeneficios(beneficiosBasico)}
            </div>
            {usuario && planActual === "basico" ? (
              <MainButton variant="disabled" className="px-6 py-3">
                Este es tu plan actual
              </MainButton>
            ) : (
              <MainLinkButton to="/cuenta" variant="primary">
                Adquirir Plan
              </MainLinkButton>
            )}
          </div>

          {/* Plan Premium */}
          <div className="bg-white/5 border border-acento/50 rounded-xl p-6 shadow-lg flex flex-col justify-between">
            <div>
              <MainH2 className="text-acento">Plan Premium</MainH2>
              <p className="text-texto/70 mb-4">
                Acceda a todos los beneficios de Red-Fi sin límites de uso y sin
                anuncios.
              </p>
              {renderBeneficios(beneficiosPremium)}
            </div>
            {usuario && planActual === "premium" ? (
              <MainButton variant="disabled" className="px-6 py-3">
                Este es tu plan actual
              </MainButton>
            ) : (
              <MainLinkButton to="/cuenta" variant="primary">
                Adquirir Plan
              </MainLinkButton>
            )}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Planes;
