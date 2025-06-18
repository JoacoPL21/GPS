import { useEffect } from 'react';
import { useAuth } from '../../context/AuthContext.jsx';
import DirectionForm from '../Profile/DirectionForm.jsx';

const Profile = () => {
  const { authUser,direcciones } = useAuth();
  useEffect(()=> {
    console.log("Direcciones:", direcciones);
  })



  
  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Perfil de Usuario</h1>
      <div className="bg-white shadow-md rounded-lg p-6">
        <h2 className="text-xl font-semibold mb-4">Información del Usuario</h2>
        <p><strong>Nombre Completo:</strong> {authUser?.nombreCompleto}</p>
        <p><strong>Email:</strong> {authUser?.email}</p>
        <p><strong>Teléfono:</strong> {authUser?.telefono}</p>
        <p><strong>Rol:</strong> {authUser?.rol}</p>
      </div>

      {/* Si ya hay dirección, mostrarla. Si no, mostrar el form */}
      {direcciones && direcciones.lenght > 0 ? (
        <div className="bg-white shadow-md rounded-lg p-6 mt-6">
          <h2 className="text-xl font-semibold mb-4">Dirección de Envío</h2>
          <p><strong>Calle:</strong> {direcciones.calle}</p>
          <p><strong>Número:</strong> {direcciones.numero}</p>
          <p><strong>Ciudad:</strong> {direcciones.ciudad}</p>
          <p><strong>Región:</strong> {direcciones.region}</p>
          <p><strong>Código Postal:</strong> {direcciones.codigo_postal}</p>
          <p><strong>Tipo de Dirección:</strong> {direcciones.tipo_direccion}</p>
        </div>
      ) : (
        <DirectionForm/>
      )}
    </div>
  );
};

export default Profile;