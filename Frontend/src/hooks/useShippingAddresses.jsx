// hooks/useShippingAddresses.js
import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { getUserDirecciones } from '../services/user.service';

export const useShippingAddresses = () => {
  const { authUser, isAuthenticated } = useAuth();
  const [addresses, setAddresses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedAddressId, setSelectedAddressId] = useState(null);

  const fetchAddresses = async () => {
    if (!isAuthenticated) return;
    
    setLoading(true);
    try {
      const response = await getUserDirecciones();
      if (response.status === 'Success') {
        setAddresses(response.data || []);
      }
    } catch (error) {
      console.error('Error fetching addresses:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAddresses();
  }, [isAuthenticated]);

  const mapAddressToShippingData = (address) => ({
    nombres: authUser?.nombreCompleto?.split(' ')[0] || '',
    apellidos: authUser?.nombreCompleto?.split(' ').slice(1).join(' ') || '',
    email: authUser?.email || '',
    phone: authUser?.telefono || '',
    address: `${address.calle} ${address.numero}`,
    regionCode: address.region,
    comunaCode: address.comuna,
    postalCode: address.codigo_postal,
    instructions: '',
  });

  // Función para agregar dirección al estado local cuando se crea una nueva
  const addAddress = (newAddress) => {
    setAddresses(prev => [...prev, newAddress]);
  };
  
  return {
    addresses,
    loading,
    selectedAddressId,
    setSelectedAddressId,
    mapAddressToShippingData,
    hasAddresses: addresses.length > 0,
    isAuthenticated,
    addAddress  // ✅ Para actualizar estado local
  };
};