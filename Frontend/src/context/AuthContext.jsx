import { createContext, useContext, useEffect, useState } from "react";
import {
  obtenerSesionActual,
  escucharCambiosDeSesion,
} from "../services/authService";

// Creamos el contexto
const AuthContext = createContext();

// Hook para consumir fácilmente el contexto
export const useAuth = () => useContext(AuthContext);

// Proveedor del contexto
export const AuthProvider = ({ children }) => {
  const [usuario, setUsuario] = useState(null);
  const [loading, setLoading] = useState(true);

  // Cargar la sesión inicial y escuchar cambios de sesión
  useEffect(() => {
    const cargarSesion = async () => {
      try {
        const session = await obtenerSesionActual();
        setUsuario(session?.user || null);
      } catch (error) {
        console.error("Error al obtener la sesión:", error.message);
      } finally {
        setLoading(false);
      }
    };

    cargarSesion();
    const suscripcion = escucharCambiosDeSesion(setUsuario);

    return () => suscripcion.unsubscribe();
  }, []);

  // Exponemos únicamente el estado de sesión
  return (
    <AuthContext.Provider value={{ usuario, loading }}>
      {children}
    </AuthContext.Provider>
  );
};