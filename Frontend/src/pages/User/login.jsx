import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {login}  from "../../services/auth.service";
import useLogin from "../../hooks/auth/useLogin";
import Swal from "sweetalert2";


const Login = () => {
    
    const navigate = useNavigate();

    const { errorEmail, errorPassword, errorData, handleInputChange, inputData } =
        useLogin();
    // Estado para manejar el éxito del inicio de sesión
    const [success, setSuccess] = useState(false);
    // Manejo de la alerta de SweetAlert2
    useEffect(() => {
        if (success) {
            Swal.fire({
                position: "center",
                icon: "success",
                title: "Inicio de sesión exitoso",
                text: "Bienvenido de nuevo",
                showConfirmButton: true,
                confirmButtonText: "Aceptar",
                confirmButtonColor: "#f59e0b", // Color del botón de confirmación
            });
        }
    }, [success]);
    // Verificar si el usuario ya está autenticado
    useEffect(() => {
        const token = localStorage.getItem("token");
        if (token) {
            navigate("/dashboard");
        }
        
    }, [navigate]);

    // Función para manejar el envío del formulario de inicio de sesión
    const loginSubmit = async (data) => {
        // Validar los campos antes de enviar
        try {
            const response = await login(data);
            if (response.status === 'Success') {
                setSuccess(true);
                // Guardamos el token en el localStorage
                localStorage.setItem("token", response.data.token);
               // Redirigir al usuario a la página principal o dashboard
                navigate("/dashboard");
            } else {
                // Si tu backend responde con { dataInfo: 'email'/'password', message: '...' }
                if (response.data && response.data.dataInfo && response.data.message) {
                    errorData(response.data);
                } else {
                    // Error genérico
                    errorData({ dataInfo: "email", message: "ocurrio un problema al iniciar sesion" });
                }
            }
        } catch (error) {
            // Si el error viene en error.response.data
            if (error.response && error.response.data && error.response.data.dataInfo && error.response.data.message) {
                errorData(error.response.data);
            } else {
                errorData({ dataInfo: "email", message: "Error de red o servidor" });
            }
        }
    }
    
    return (
        <div className="">
            <div className="flex items-center justify-center h-screen ">
                <div className="bg-white p-8 rounded-lg shadow-md w-96">
                    <h2 className="text-2xl font-bold mb-6 text-center">Iniciar Sesión</h2>
                    <form onSubmit={(e) => {
                        e.preventDefault();
                        loginSubmit(inputData);
                    }}>
                        <div className="mb-4">
                            <label className="block text-sm font-medium mb-2" htmlFor="email">
                                Correo Electrónico
                            </label>
                            <input
                                type="email"
                                id="email"
                                name="email"
                                onChange={(e) => handleInputChange("email", e.target.value)}
                                className={`w-full p-2 border rounded ${
                                    errorEmail ? "border-red-500" : "border-gray-300"
                                }`}
                                required
                            />
                            {errorEmail && (
                                <p className="text-red-500 text-xs mt-1">{errorEmail}</p>
                            )}
                        </div>
                        <div className="mb-4">
                            <label className="block text-sm font-medium mb-2" htmlFor="password">
                                Contraseña
                            </label>
                            <input
                                type="password"
                                id="password"
                                name="password"
                                onChange={e => handleInputChange("password", e.target.value)}
                                className={`w-full p-2 border rounded ${
                                    errorPassword ? "border-red-500" : "border-gray-300"
                                }`}
                                required
                            />
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
