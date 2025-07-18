import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getProductosCompradosConValoracion } from '../../services/user.service';
import { createOrUpdateValoracion } from '../../services/valoraciones.service';
import ValoracionForm from '../../components/ValoracionForm';
import Swal from 'sweetalert2';

const ValoracionFormPage = () => {
  const { id_producto } = useParams();
  const navigate = useNavigate();
  const [producto, setProducto] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    async function fetchProducto() {
      setLoading(true);
      setError(null);
      try {
        const res = await getProductosCompradosConValoracion();
        if (res.status === 'Success') {
          const productos = res.data || [];
          const prod = productos.find(p => String(p.id_producto) === String(id_producto));
          if (!prod) {
            setError('Producto no encontrado o no comprado');
          } else {
            setProducto(prod);
          }
        } else {
          setError(res.message);
        }
      } catch {
        setError('Error al cargar el producto');
      } finally {
        setLoading(false);
      }
    }
    fetchProducto();
  }, [id_producto]);

  const handleSubmit = async (data) => {
    setSubmitting(true);
    try {
      const res = await createOrUpdateValoracion({
        ...data,
        id_producto: Number(id_producto)
      });
      if (res.data && !res.error) {
        Swal.fire({
          icon: 'success',
          title: '¡Valoración guardada!',
          showConfirmButton: false,
          timer: 1200
        });
        navigate('/profile/valoraciones');
      } else {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: res.error || 'No se pudo guardar la valoración'
        });
      }
    } catch {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'No se pudo guardar la valoración'
      });
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <div className="text-center py-8 text-gray-500">Cargando...</div>;
  if (error) return <div className="text-center py-8 text-red-500">{error}</div>;
  if (!producto) return null;

  return (
    <div className="min-h-screen w-full max-w-2xl mx-auto py-8">
      <div className="bg-white rounded-lg shadow-md border p-6 flex flex-col gap-6">
        <div className="flex items-center gap-4">
          <img src={producto.imagen_producto || '/images/imagenotfound.png'} alt={producto.nombre_producto} className="w-20 h-20 object-cover rounded" />
          <div>
            <div className="font-semibold text-gray-900 text-lg">{producto.nombre_producto}</div>
            <div className="text-gray-500 text-sm">Comprado el {new Date(producto.fecha_compra).toLocaleDateString('es-CL', { year: 'numeric', month: 'short', day: 'numeric' })}</div>
          </div>
        </div>
        <ValoracionForm
          productoId={producto.id_producto}
          valoracionExistente={producto.valoracion}
          puedeValorar={true}
          submitting={submitting}
          onSubmit={handleSubmit}
        />
      </div>
    </div>
  );
};

export default ValoracionFormPage; 