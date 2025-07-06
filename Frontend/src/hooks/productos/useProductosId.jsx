import { useEffect, useState} from "react";
import { getProductoById } from "../../services/productos.service";

const useProductoById = (id) => {
  const [producto, setProducto] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
      if (!id) {
    setLoading(false);  

  }
    const fetchProducto = async () => {
      const { data, error } = await getProductoById(id);

      if (data) {
        const prod = data.data;
        setProducto({
          ...prod,
          id_producto: prod.id_producto || prod.id
        });
      } else {
        console.error("Error al obtener el producto:", error);
      }
      setLoading(false);
    };

    fetchProducto();
  }, [id]);

  return { producto, loading };
}
export default useProductoById;