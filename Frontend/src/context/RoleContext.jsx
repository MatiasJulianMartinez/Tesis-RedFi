import { createContext, useContext, useEffect, useState } from "react";
import { useAuth } from "./AuthContext";
import { getPerfil } from "../services/perfilService";

// Creamos el contexto
const RoleContext = createContext();

// Hook para consumir fácilmente el contexto
export const useRole = () => useContext(RoleContext);

// Proveedor del contexto
export const RoleProvider = ({ children }) => {
  const [rol, setRol] = useState(null); // admin / user
  const [plan, setPlan] = useState(null); // basico / premium
  const [loadingRole, setLoadingRole] = useState(true);
  const { usuario, loading } = useAuth();

  useEffect(() => {
    const cargarDatosPerfil = async () => {
      if (!usuario) {
        setRol(null);
        setPlan(null);
        setLoadingRole(false);
        return;
      }

      try {
        setLoadingRole(true);
        const perfil = await getPerfil();
        setRol(perfil?.rol || null);
        setPlan(perfil?.plan || null);
      } catch (error) {
        console.error("Error al obtener el perfil del usuario:", error.message);
        setRol(null);
        setPlan(null);
      } finally {
        setLoadingRole(false);
      }
    };

    if (!loading) {
      cargarDatosPerfil();
    }
  }, [usuario, loading]);

  // Funciones auxiliares
  const esAdmin = () => rol === "admin";
  const esUser = () => rol === "user";
  const esPremium = () => plan === "premium";
  const esBasico = () => plan === "basico";

  /**
   * Verifica si el usuario tiene acceso según el plan requerido
   * @param {"basico" | "premium"} requierePlan
   * @returns {boolean}
   */
  const tieneAcceso = (requierePlan) => {
    if (!requierePlan) return true;
    if (requierePlan === "basico") return esBasico() || esPremium();
    if (requierePlan === "premium") return esPremium();
    return false;
  };

  return (
    <RoleContext.Provider
      value={{
        rol,
        plan,
        loadingRole,
        esAdmin,
        esUser,
        esPremium,
        esBasico,
        tieneAcceso,
      }}
    >
      {children}
    </RoleContext.Provider>
  );
};
