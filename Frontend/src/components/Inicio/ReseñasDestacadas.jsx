import { IconCarambolaFilled, IconCarambola } from "@tabler/icons-react";
import MainH2 from "../ui/MainH2";

const reseñas = [
  {
    nombre: "Juan P.",
    comentario:
      "Red-Fi me ayudó muchísimo a elegir el proveedor ideal para mi zona. La plataforma es clara y fácil de usar.",
    estrellas: 5,
  },
  {
    nombre: "Ana G.",
    comentario:
      "Muy útil para comparar proveedores. Sería genial si más personas dejaran reseñas, pero la idea es excelente.",
    estrellas: 4,
  },
  {
    nombre: "Martin M.",
    comentario:
      "No encontraba buen internet en mi zona hasta que conocí Red-Fi. Me sirvió mucho el mapa y los comentarios de otros.",
    estrellas: 5,
  },
  {
    nombre: "Agustina M.",
    comentario:
      "Me gusta el diseño y lo intuitiva que es la página. A veces algunas zonas tardan en cargar, pero en general funciona bien.",
    estrellas: 4,
  },
  {
    nombre: "Sofía T.",
    comentario:
      "Excelente iniciativa. Es justo lo que necesitábamos en Corrientes para elegir mejor a quién contratar.",
    estrellas: 5,
  },
  {
    nombre: "Lucas R.",
    comentario:
      "Buena plataforma. Las reseñas de otros me dieron más seguridad para contratar. Recomendado.",
    estrellas: 5,
  },
];

const ReseñasDestacadas = () => {
  return (
    <section className="py-16 px-4 sm:px-6">
      <div className="max-w-7xl mx-auto text-center">
        <MainH2>Reseñas destacadas</MainH2>

        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-8">
          {reseñas.map((r, i) => (
            <div
              key={i}
              className="flex flex-col items-center bg-white/5 border border-white/10 backdrop-blur-md p-6 rounded-lg text-center transition-transform transform hover:scale-110 duration-300"
            >
              <img
                src={`https://randomuser.me/api/portraits/${
                  i % 2 === 0 ? "men" : "women"
                }/${i}.jpg`}
                alt={r.nombre}
                className="w-24 h-24 rounded-full object-cover border border-white/10 mb-3"
              />
              <p className="text-acento font-bold mb-2">{r.nombre}</p>

              <p className="text-texto italic mb-4">“{r.comentario}”</p>

              <div className="flex gap-1 text-yellow-400 justify-center">
                {Array.from({ length: 5 }, (_, idx) =>
                  idx < r.estrellas ? (
                    <IconCarambolaFilled size={14} key={idx} />
                  ) : (
                    <IconCarambola size={14} key={idx} />
                  )
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ReseñasDestacadas;
