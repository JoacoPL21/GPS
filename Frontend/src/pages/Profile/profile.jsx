import {useAuth} from '../../context/AuthContext.jsx';

const Profile = () => {

    const {authUser} = useAuth();
    console.log(authUser);



    return(
        <div>
            <h1 className="text-2xl font-bold text-center my-8">Perfil de Usuario</h1>
            <div className="max-w-md mx-auto bg-white shadow-md rounded-lg p-6">
                <h2 className="text-xl font-semibold mb-4">Información del Usuario</h2>
                <p><strong>Nombre:</strong> {authUser.name}</p>
                <p><strong>Email:</strong> {authUser.email}</p>
                <p><strong>Teléfono:</strong> {authUser.telefono}</p>
            </div>
        </div>
    )
}
export default Profile;