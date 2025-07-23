import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { crearPerfil } from "../../services/perfilService";
import { registerUser } from "../../services/authService";
import { IconUserPlus, IconLogin, IconMail, IconLock, IconUser, IconWifi } from "@tabler/icons-react";
import MainH1 from "../../components/ui/MainH1";
import MainButton from "../../components/ui/MainButton";
import MainLinkButton from "../../components/ui/MainLinkButton";
import Input from "../../components/ui/Input";

import { useAlerta } from "../../context/AlertaContext";

const Register = () => {
  useEffect(() => {
    document.title = "Red-Fi | Registro";
  }, []);

  const [form, setForm] = useState({
    email: "",
    password: "",
    nombre: "",
    proveedor_preferido: "",
  });

  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { mostrarError, mostrarExito } = useAlerta();

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const { email, password, nombre, proveedor_preferido } = form;

    try {
      await registerUser({ email, password });
    } catch (err) {
      mostrarError(err.message);
      setLoading(false);
      return;
    }

    try {
      await crearPerfil({ nombre, proveedor_preferido });
      mostrarExito("Cuenta creada con éxito. Redirigiendo...");
      setTimeout(() => navigate("/cuenta"), 1500);
    } catch (err) {
      mostrarError("El usuario fue registrado, pero falló la creación del perfil.");
      setLoading(false);
    }
  };

  return (
    <div className="w-full bg-fondo flex items-center justify-center px-4 py-16 relative">
      <div className="w-full max-w-md">
        <div className="w-full text-center mb-8">
          <MainH1 icon={IconLogin}>Crear cuenta</MainH1>
          <p className="mx-auto">Únete a la comunidad de Red-Fi.</p>
        </div>

        <div className="bg-white/5 border border-white/10 rounded-lg p-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              label="Correo electrónico *"
              name="email"
              type="email"
              placeholder="tu@email.com"
              icon={IconMail}
              value={form.email}
              onChange={handleChange}
              required
            />
            <Input
              label="Contraseña *"
              name="password"
              type="password"
              placeholder="••••••••"
              icon={IconLock}
              value={form.password}
              onChange={handleChange}
              required
            />
            <Input
              label="Nombre completo *"
              name="nombre"
              placeholder="Tu nombre completo"
              icon={IconUser}
              value={form.nombre}
              onChange={handleChange}
              required
            />
            <Input
              label={
                <>
                  Proveedor preferido
                  <span className="text-texto/50 text-xs ml-1">(opcional)</span>
                </>
              }
              name="proveedor_preferido"
              placeholder="Ej: Fibertel, Movistar, Claro..."
              icon={IconWifi}
              value={form.proveedor_preferido}
              onChange={handleChange}
            />
            <MainButton
              type="submit"
              variant="primary"
              className="w-full"
              loading={loading}
            >
              {loading ? "Creando cuenta..." : "Crear Cuenta"}
            </MainButton>
          </form>
        </div>

        {/* Divider */}
        <div className="relative my-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-white/10"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-2 bg-fondo text-texto/60">
              ¿Ya tienes cuenta?
            </span>
          </div>
        </div>

        <MainLinkButton to="/login" variant="secondary" className="w-full">
          <IconLogin size={24} />
          Iniciar sesión
        </MainLinkButton>

        <div className="text-center mt-6">
          <p className="text-xs text-texto/50">
            Al registrarte, aceptas nuestros términos y condiciones
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;
