import { useAuth } from '../../context/AuthContext.jsx';
import DirectionForm from '../Profile/directionForm.jsx';
import { getDireccionesByUserId,deleteDireccionByUserId} from "../../services/user.service.js";
import swal from 'sweetalert2';
import { useEffect,useState } from 'react';

const Profile = () => {
  const { authUser } = useAuth();
  const id_usuario = authUser?.id_usuario || null;
  const [direcciones, setDirecciones] = useState([]);




// Función para eliminar una dirección
  const handleDeleteDireccion = async (direccionId) => {
    try {
      const response = await deleteDireccionByUserId(direccionId);
      if (response.status === 'Success') {
        setDirecciones(direcciones.filter(direccion => direccion.id !== direccionId));
        swal.fire({
          title: 'Éxito',
          text: 'Dirección eliminada correctamente.',
          icon: 'success',
          confirmButtonText: 'Aceptar'
        });
      } else {
        console.error('Error al eliminar la dirección:', response.message);
      }
    } catch (error) {
      console.error('Error al eliminar la dirección:', error);
    }
  };
  
  useEffect(() => {
    const fetchDirecciones = async () => {
      if (id_usuario) {
        try {
          const response = await getDireccionesByUserId(id_usuario);
          if (response.status === 'Success') {
            setDirecciones(response.data);
          } else {
            console.error('Error al obtener direcciones:', response.message);
          }
        } catch (error) {
          console.error('Error al obtener direcciones:', error);
        }
      }
    }

    fetchDirecciones();
  },  [ id_usuario]);


  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Perfil de Usuario</h1>
      <div className="bg-white shadow-md rounded-lg p-6">
        <h2 className="text-xl font-semibold mb-4">Información del Usuario</h2>
        <p><strong>Nombre:</strong> {authUser?.nombreCompleto || 'No disponible'}</p>
        <p><strong>Email:</strong> {authUser?.email || 'No disponible'}</p>
        <p><strong>Teléfono:</strong> {authUser?.telefono || 'No disponible'}</p>
      </div>
      <div  className="mt-4 bg-white shadow-md rounded-lg p-6">
        <h2 className="text-xl font-semibold mb-4">Direccion de envio</h2>
        <button
          onClick={() => handleDeleteDireccion(authUser?.id_usuario)}
          className="bg-red-500 text-white px-4 py-2 rounded mb-4"
        >
          Eliminar Dirección
        </button>
        {direcciones.length > 0 ? (
          <ul className="pl-4 ">
            {direcciones.map((direccion, index) => (
              <li key={index} className="mb-4 pb-2">
                <p><strong>Calle:</strong> {direccion.calle}</p>
                <p><strong>Número:</strong> {direccion.numero}</p>
                <p><strong>Ciudad:</strong> {direccion.ciudad}</p>
                <p><strong>Región:</strong> {direccion.region}</p>
                <p><strong>Código Postal:</strong> {direccion.codigo_postal}</p>
                <p><strong>Tipo de Dirección:</strong> {direccion.tipo_de_direccion}</p>
              </li>
            ))}
          </ul>
        ) : (
          <p>No hay direcciones registradas.</p>
        )}
      </div>

      <DirectionForm />
    </div>
  );
};

export default Profile;