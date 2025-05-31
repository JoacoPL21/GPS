import { useNavigate } from "react-router-dom";
import {login}  from "../../services/auth.service";
import useLogin from "../../hooks/auth/useLogin";


const Login = () => {
    const navigate = useNavigate();
    const { errorEmail, errorPassword, errorData, handleInputChange } = useLogin();

    // Función para manejar el envío del formulario de inicio de sesión
    const loginSubmit = async (data) => {
       try {
            const response = await login(data);
            if (response.status === 200) {
                navigate("/");
            } else {
                console.error("Error en el inicio de sesión:", response.message);
            }
        } catch (error) {
            console.error("Error al iniciar sesión:", error);
        }
    }
    
    return (
        <div className="">
            <div className="flex items-center justify-center h-screen ">
                <div className="bg-white p-8 rounded-lg shadow-md w-96">
                    <h2 className="text-2xl font-bold mb-6 text-center">Iniciar Sesión</h2>
                    <form
                        onSubmit={(e) => {
                            e.preventDefault();
                            navigate("/");
                        }}
                    >
                        <div className="mb-4">
                            <label className="block text-sm font-medium mb-2" htmlFor="email">
                                Correo Electrónico
                            </label>
                            <input
                                type="email"
                                id="email"
                                name="email"
                                onChange={handleInputChange}
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
                                onChange={handleInputChange}
                                className={`w-full p-2 border rounded ${
                                    errorPassword ? "border-red-500" : "border-gray-300"
                                }`}
                                required
                            />
                            {errorPassword && (
                                <p className="text-red-500 text-xs mt-1">{errorPassword}</p>
                            )}
                        </div>
                        {errorData && (
                            <p className="text-red-500 text-xs mb-4">{errorData}</p>
                        )}
                        <button
                            type="submit"
                            className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition-colors"
                            onClick={() => loginSubmit({ email: document.getElementById("email").value, password: document.getElementById("password").value })}
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
