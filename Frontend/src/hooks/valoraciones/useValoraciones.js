import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../../context/AuthContext';
import { 
  getValoracionesPorProducto, 
  createOrUpdateValoracion,
  verificarCompraProducto 
} from '../../services/valoraciones.service';

export const useValoraciones = (id_producto) => {
  const { authUser } = useAuth();
  const [valoraciones, setValoraciones] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [puedeValorar, setPuedeValorar] = useState(false);
  const [valoracionUsuario, setValoracionUsuario] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [valoracionUsuarioLoading, setValoracionUsuarioLoading] = useState(true);

  // Cargar valoraciones del producto
  const cargarValoraciones = useCallback(async () => {
    if (!id_producto) return;
    
    setLoading(true);
    setValoracionUsuarioLoading(true);
    setError(null);
    
    try {
      const { data, error } = await getValoracionesPorProducto(id_producto);
      if (error) {
        setError(error);
      } else {
        setValoraciones(data.data || []);
        
        // Buscar si el usuario actual ya valoró este producto
        if (authUser) {
          const valoracionExistente = data.data?.find(
            v => v.id_usuario === authUser.id
          );
          setValoracionUsuario(valoracionExistente || null);
        }
      }
    } catch (error) {
      setError('Error al cargar valoraciones');
      console.error('Error al cargar valoraciones:', error);
    } finally {
      setLoading(false);
      setValoracionUsuarioLoading(false);
    }
  }, [id_producto, authUser]);

  // Verificar si el usuario puede valorar (ha comprado el producto)
  const verificarPuedeValorar = useCallback(async () => {
    if (!authUser || !id_producto) {
      setPuedeValorar(false);
      return;
    }

    try {
      const { data, error } = await verificarCompraProducto(id_producto);
      
      if (error) {
        console.error('Error al verificar compra:', error);
        setPuedeValorar(false);
      } else {
        // El backend devuelve { data: { success: boolean } }
        const puedeValorar = data.data?.success || false;
        setPuedeValorar(puedeValorar);
      }
    } catch (error) {
      console.error('Error al verificar si puede valorar:', error);
      setPuedeValorar(false);
    }
  }, [authUser, id_producto]);

  // Crear o actualizar valoración
  const enviarValoracion = useCallback(async (valoracionData) => {
    if (!authUser || !id_producto) {
      throw new Error('Usuario no autenticado o producto no válido');
    }

    setSubmitting(true);
    
    try {
      const datosCompletos = {
        ...valoracionData,
        id_producto: parseInt(id_producto)
      };

      const { data, error } = await createOrUpdateValoracion(datosCompletos);
      
      if (error) {
        throw new Error(error.message || 'Error al procesar valoración');
      }

      // Actualizar la lista de valoraciones
      await cargarValoraciones();
      
      return data;
    } finally {
      setSubmitting(false);
    }
  }, [authUser, id_producto, cargarValoraciones]);

  // Calcular promedio de valoraciones
  const promedioValoraciones = valoraciones.length > 0 
    ? valoraciones.reduce((sum, v) => sum + (v.puntuacion || 0), 0) / valoraciones.length 
    : 0;

  // Efectos
  useEffect(() => {
    cargarValoraciones();
  }, [cargarValoraciones]);

  useEffect(() => {
    verificarPuedeValorar();
  }, [verificarPuedeValorar]);

  return {
    valoraciones,
    loading,
    error,
    puedeValorar,
    valoracionUsuario,
    valoracionUsuarioLoading,
    submitting,
    promedioValoraciones,
    enviarValoracion,
    recargarValoraciones: cargarValoraciones
  };
}; 