import { useEffect, useState } from "react";
import { getProductosDisponibles } from "../../services/productos.service";


const useProductosDispo = () => {
  const [productosDisponibles, setProductosDisponibles] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProductos = async () => {
  const { data, error } = await getProductosDisponibles();

    if (data) {
    setProductosDisponibles(data.data);
      } else {
        console.error("Error al obtener productos:", error);
      }
      setLoading(false);
    };
    

    fetchProductos();
  }, []);

  return { productosDisponibles, loading };
};

export default useProductosDispo;