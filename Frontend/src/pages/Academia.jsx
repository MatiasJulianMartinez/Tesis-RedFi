import { useEffect } from "react";
import { Link } from "react-router-dom";
import { IconBook2, IconArrowLeft } from "@tabler/icons-react";
import MainH1 from "../components/ui/MainH1";
import MainH2 from "../components/ui/MainH2";
import MainH3 from "../components/ui/MainH3";
import MainLinkButton from "../components/ui/MainLinkButton";
import Glosario from "../pages/academia/Glosario";

const AcademyHome = () => {
  useEffect(() => {
    document.title = "Red-Fi | Academia";
  }, []);
  const cursos = [
    {
      id: 1,
      titulo: "Como solucionar problemas de internet",
      descripcion:
        "Aprende a resolver fallas de conexión y mejorar la señal en tu hogar.",
      imagen: "/imgs/cursos/curso1.jpg",
    },
    {
      id: 2,
      titulo: "Como medir la velocidad de internet",
      descripcion:
        "Conoce cómo interpretar megas, ping y jitter en un test de velocidad.",
      imagen: "/imgs/cursos/curso2.jpg",
    },
    {
      id: 3,
      titulo: "Como elegir un proveedor de internet",
      descripcion:
        "Compara cobertura, atención y estabilidad para elegir bien.",
      imagen: "/imgs/cursos/curso3.jpg",
    },
  ];

  const testimonios = [
    {
      nombre: "Ethan Carter",
      fecha: "2025-03-15",
      mensaje:
        "¡Los cursos de Red-Fi Academy son excelentes! Me ayudaron a entender mi red y aplicar mejoras reales en casa.",
      estrellas: 5,
      likes: 12,
      comentarios: 1,
    },
    {
      nombre: "Sofía Benítez",
      fecha: "2025-03-22",
      mensaje:
        "Pude estudiar a mi ritmo y aplicar todo en mi trabajo como técnica de soporte. Súper claro y útil.",
      estrellas: 4,
      likes: 8,
      comentarios: 2,
    },
    {
      nombre: "Lucas Herrera",
      fecha: "2025-04-10",
      mensaje:
        "El curso de ciberseguridad fue muy completo. Me dio herramientas clave para arrancar en redes.",
      estrellas: 5,
      likes: 15,
      comentarios: 3,
    },
  ];

  return (
    <section className="p-6 max-w-7xl mx-auto">

      <Glosario />
      <div className="text-center">
        <MainH2 icon={IconBook2}>Cursos destacados</MainH2>
      </div>

      <div className="grid md:grid-cols-3 gap-6 mb-12">
        {cursos.map((curso) => (
          <MainLinkButton
            to={`/academy/curso${curso.id}`}
            key={curso.id}
            variant="curso"
            className="p-6"
          >
            <img
              src={curso.imagen}
              alt={curso.titulo}
              className="w-full h-48 object-cover"
            />
            <div className="p-4">
              <MainH3>{curso.titulo}</MainH3>
              <p>{curso.descripcion}</p>
            </div>
          </MainLinkButton>
        ))}
      </div>

      <div className="text-center max-w-2xl mx-auto mb-6">
        <MainH2>¿Por qué elegir Red-Fi Academy?</MainH2>
        <p className="text-gray-300">
          En Red-Fi Academy te brindamos formación práctica y de calidad para
          que puedas mejorar tu experiencia con internet y redes.
        </p>
      </div>

      <div className="grid md:grid-cols-3 gap-4 mb-12 text-sm">
        <div className="bg-white/10 p-4 rounded">
          <h4 className="font-semibold text-texto">👨‍🏫 Instructores expertos</h4>
          <p>Aprende con profesionales con experiencia real en la industria.</p>
        </div>
        <div className="bg-white/10 p-4 rounded">
          <h4 className="font-semibold text-texto">📅 Aprendizaje flexible</h4>
          <p>
            Estudia a tu ritmo desde cualquier dispositivo, en cualquier
            momento.
          </p>
        </div>
        <div className="bg-white/10 p-4 rounded">
          <h4 className="font-semibold text-texto">🛠 Contenido práctico</h4>
          <p>Aplica lo aprendido con ejercicios reales y casos concretos.</p>
        </div>
      </div>

      <div className="text-center mx-auto mb-6">
        <MainH2>Historias de estudiantes</MainH2>
        <div className="space-y-6 mb-12 w-full text-left">
          {testimonios.map((t, i) => (
            <div
              key={i}
              className="bg-white/5 p-4 rounded-lg border border-white/10"
            >
              <div className="flex justify-between mb-2 text-sm">
                <span className="font-semibold text-texto">{t.nombre}</span>
                <span className="text-gray-400">{t.fecha}</span>
              </div>
              <div className="text-yellow-400 mb-2">
                {"★".repeat(t.estrellas)}
                {"☆".repeat(5 - t.estrellas)}
              </div>
              <p className="text-gray-200">{t.mensaje}</p>
              <div className="mt-2 text-sm text-gray-400 flex gap-4">
                <span>👍 {t.likes}</span>
                <span>💬 {t.comentarios}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 🔙 Botón volver al perfil */}
      <div className="text-center">
        <MainLinkButton to="/cuenta" variant="secondary">
          <IconArrowLeft />
          Volver al perfil
        </MainLinkButton>
      </div>
    </section>
  );
};

export default AcademyHome;
