import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { login } from "../../services/auth.service";
import useLogin from "../../hooks/auth/useLogin";
import Swal from "sweetalert2";
import { useAuth } from "../../context/AuthContext";

const Login = () => {
  const navigate = useNavigate();
  const {
    errorEmail,
    errorPassword,
    errorData,
    handleInputChange,
    inputData
  } = useLogin();

  const {  setIsAuthenticated,isAuthenticated } = useAuth();
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (success) {
      Swal.fire({
        position: "center",
        icon: "success",
        title: "Inicio de sesión exitoso",
        text: "Bienvenido de nuevo",
        showConfirmButton: true,
        confirmButtonText: "Aceptar",
        confirmButtonColor: "#f59e0b",
      });
    }
  }, [success]);

  //redirigir al usuario si ya está autenticado
  useEffect(() => {
    console.log("isAuthenticated:", isAuthenticated);
    if (isAuthenticated) {
      navigate("/");
    }
  }, [isAuthenticated, navigate]);
  const loginSubmit = async (data) => {
    try {
      const response = await login(data);
      if (response.status === "Success") {
        setSuccess(true);
        // Actualizar el estado de autenticación
        setIsAuthenticated(true);
        navigate("/");
      } else {
        if (response.data?.dataInfo && response.data?.message) {
          errorData(response.data);
        } else {
          errorData({
            dataInfo: "email",
            message: "Ocurrió un problema al iniciar sesión",
          });
        }
      }
    } catch (error) {
      if (
        error.response?.data?.dataInfo &&
        error.response?.data?.message
      ) {
        errorData(error.response.data);
      } else {
        errorData({
          dataInfo: "email",
          message: "Error de red o servidor",
        });
      }
    }
  };

  return (
    <div className="">
      <div className="flex items-center justify-center h-[75vh]">
        <div className="bg-white p-8 rounded-2xl shadow-md w-96">
          <h2 className="text-4xl pb-4 font-bold mb-6 text-center">Iniciar Sesión</h2>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              loginSubmit(inputData);
            }}
          >
            {/* Email */}
            <div className="relative mb-6">
              <input
                type="email"
                id="email"
                name="email"
                onChange={(e) => handleInputChange("email", e.target.value)}
                value={inputData.email}
                placeholder=""
                required
                className={`peer w-full border-2 rounded-md px-3 pt-2 pb-3 text-sm bg-white text-gray-900 focus:outline-none focus:border-orange-500 transition-all
                  ${errorEmail ? "border-red-500" : "border-gray-400"}`}
              />
              <label
                htmlFor="email"
                className="absolute left-2 -top-2 px-1 text-xs bg-white text-gray-600 peer-placeholder-shown:top-2 peer-placeholder-shown:text-base 
                  peer-placeholder-shown:text-gray-400 peer-focus:-top-2.5 peer-focus:text-xs peer-focus:text-orange-500 transition-all duration-200 z-10"
              >
                Correo Electrónico
              </label>
              {errorEmail && (
                <p className="text-red-500 text-xs mt-1">{errorEmail}</p>
              )}
            </div>

            {/* Contraseña */}
            <div className="relative mb-6">
              <input
                type="password"
                id="password"
                name="password"
                onChange={(e) =>
                  handleInputChange("password", e.target.value)
                }
                value={inputData.password}
                placeholder=""
                required
                className={`peer w-full border-2 rounded-md px-3 pt-2 pb-3 text-sm bg-white text-gray-900 focus:outline-none focus:border-orange-500 transition-all
                  ${errorPassword ? "border-red-500" : "border-gray-400"}`}
              />
              <label
                htmlFor="password"
                className="absolute left-2 -top-2.5 px-1 text-xs bg-white text-gray-600 peer-placeholder-shown:top-2 peer-placeholder-shown:text-base 
                  peer-placeholder-shown:text-gray-400 peer-focus:-top-2.5 peer-focus:text-xs peer-focus:text-orange-500 transition-all duration-200 z-10"
              >
                Contraseña
              </label>
              {errorPassword && (
                <p className="text-red-500 text-xs mt-1">{errorPassword}</p>
              )}
            </div>

            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition-colors"
            >
              Iniciar Sesión
            </button>
          </form>
          <p className="text-center text-sm mt-4">
            ¿No tienes una cuenta?{" "}
            <a href="/register" className="text-blue-600 hover:underline">
              Regístrate aquí
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
