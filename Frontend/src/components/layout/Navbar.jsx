import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import Logo from "../../icons/logotipo/imagotipo";
import {
  IconX,
  IconMenu2,
  IconBell,
  IconBellFilled,
} from "@tabler/icons-react";
import { obtenerNotificacionesBoletas } from "../../services/boletasService";
import MainButton from "../ui/MainButton";
import { logoutUser } from "../../services/authService";

export const useNotificaciones = () => {
  const { usuario } = useAuth();
  const [notificaciones, setNotificaciones] = useState([]);

  const cargarNotificaciones = async () => {
    if (!usuario) return;
    const alertas = await obtenerNotificacionesBoletas(usuario.id);
    setNotificaciones(alertas);
  };

  useEffect(() => {
    cargarNotificaciones();
    const handler = () => cargarNotificaciones();

    window.addEventListener("nueva-boleta", handler);
    return () => window.removeEventListener("nueva-boleta", handler);
  }, [usuario]);

  return { notificaciones, setNotificaciones, cargarNotificaciones };
};

const Navbar = () => {
  const [menuAbierto, setMenuAbierto] = useState(false);
  const [mostrarNotis, setMostrarNotis] = useState(false);
  const { usuario, logout } = useAuth();
  const { notificaciones, setNotificaciones } = useNotificaciones();

  const toggleMenu = () => setMenuAbierto(!menuAbierto);
  const linkClase = "hover:text-acento transition px-4 py-2 font-bold";

  return (
    <nav className="bg-fondo px-4 py-4">
      <div className="max-w-7xl mx-auto flex justify-between items-center relative">
        <Link to="/" className="flex items-center gap-2">
          <Logo
            className="h-10"
            colorPrincipal="#FFFFFF"
            colorAcento="#FB8531"
          />
        </Link>

        <div className="flex items-center gap-4">
          <button
            onClick={toggleMenu}
            className="lg:hidden text-texto text-2xl transition-all"
          >
            {menuAbierto ? (
              <IconX size={28} className="text-acento" />
            ) : (
              <IconMenu2 size={28} />
            )}
          </button>
        </div>

        <div className="hidden lg:flex lg:items-center lg:space-x-4">
          <Link to="/" className={linkClase}>
            Inicio
          </Link>
          <Link to="/mapa" className={linkClase}>
            Mapa
          </Link>
          <Link to="/herramientas" className={linkClase}>
            Herramientas
          </Link>
          <Link to="/soporte" className={linkClase}>
            Soporte
          </Link>
          {/* <Link to="/planes" className={linkClase}>Planes</Link> */}

          {!usuario ? (
            <>
              <Link
                to="/login"
                className="bg-acento px-3 py-1 rounded hover:bg-acento/80 hover:scale-110 transition font-bold cursor-pointer"
              >
                Login
              </Link>
              {/* <Link to="/register" className="bg-acento px-3 py-1 rounded hover:bg-acento/80 hover:scale-110 transition font-bold cursor-pointer">Registro</Link> */}
            </>
          ) : (
            <>
              <Link to="/cuenta" className={linkClase}>
                Perfil
              </Link>
              <div>
                <MainButton
                  onClick={() => setMostrarNotis(!mostrarNotis)}
                  variant="secondary"
                  className={`relative !bg-transparent hover:text-acento ${
                    notificaciones.length > 0 ? "animate-bounce" : ""
                  }`}
                  icon={
                    notificaciones.length > 0
                      ? () => (
                          <IconBellFilled size={26} className="text-acento" />
                        )
                      : IconBell
                  }
                  iconSize={26}
                  title="Notificaciones"
                >
                  {notificaciones.length > 0 && (
                    <span className="absolute -top-1 -right-1 bg-red-500 text-texto text-xs px-2 py-0.5 rounded-full shadow-md">
                      {notificaciones.length}
                    </span>
                  )}
                </MainButton>

                {mostrarNotis && (
                  <div className="absolute right-0 mt-2 w-72 bg-[#393939] text-texto rounded-lg shadow-lg z-50 p-4 space-y-2">
                    {notificaciones.length === 0 ? (
                      <p className="text-gray-300 italic text-center">
                        Sin notificaciones
                      </p>
                    ) : (
                      notificaciones.map((msg, i) => (
                        <div
                          key={i}
                          className="border-b border-gray-300 pb-2 last:border-b-0 flex justify-between items-start gap-2"
                        >
                          <span className="break-words">{msg}</span>
                          <MainButton
                            onClick={() =>
                              setNotificaciones((prev) =>
                                prev.filter((_, idx) => idx !== i)
                              )
                            }
                            variant="cross"
                            title="Cerrar"
                            icon={IconX}
                            iconSize={20}
                            className="leading-none p-0"
                          />
                        </div>
                      ))
                    )}
                  </div>
                )}
              </div>
              <button
                onClick={async () => {
                  await logoutUser();
                  setMenuAbierto(false);
                }}
                className="bg-red-400 px-3 py-1 rounded hover:bg-red-600 hover:scale-110 transition font-bold"
              >
                Cerrar sesión
              </button>
            </>
          )}
        </div>
      </div>

      {menuAbierto && (
        <div
          className={`lg:hidden px-4 transition-all duration-300 ease-in-out overflow-hidden ${
            menuAbierto
              ? "max-h-[500px] opacity-100 scale-100 mt-4"
              : "max-h-0 opacity-0 scale-95"
          }`}
        >
          <div className="flex flex-col items-start space-y-2">
            <Link
              to="/"
              onClick={() => setMenuAbierto(false)}
              className={linkClase}
            >
              Inicio
            </Link>
            <Link
              to="/mapa"
              onClick={() => setMenuAbierto(false)}
              className={linkClase}
            >
              Mapa
            </Link>
            <Link
              to="/herramientas"
              onClick={() => setMenuAbierto(false)}
              className={linkClase}
            >
              Herramientas
            </Link>
            <Link
              to="/soporte"
              onClick={() => setMenuAbierto(false)}
              className={linkClase}
            >
              Soporte
            </Link>

            {!usuario ? (
              <div className="flex flex-row items-start gap-4">
                <Link
                  to="/login"
                  onClick={() => setMenuAbierto(false)}
                  className="bg-acento px-3 py-1 rounded hover:bg-acento/80 transition font-bold cursor-pointer"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  onClick={() => setMenuAbierto(false)}
                  className="bg-acento px-3 py-1 rounded hover:bg-acento/80 transition font-bold cursor-pointer"
                >
                  Registro
                </Link>
              </div>
            ) : (
              <>
                <Link
                  to="/cuenta"
                  onClick={() => setMenuAbierto(false)}
                  className={linkClase}
                >
                  Perfil
                </Link>
                <button
                  onClick={async () => {
                    await logoutUser();
                    setMenuAbierto(false);
                  }}
                  className="bg-red-400 px-3 py-1 rounded hover:bg-red-600 hover:scale-110 transition font-bold"
                >
                  Cerrar sesión
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
