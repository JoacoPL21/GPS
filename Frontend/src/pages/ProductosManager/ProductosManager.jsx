import { useState } from "react";
import Swal from "sweetalert2";

// Simulación de productos iniciales (reemplaza por fetch a tu backend si tienes)
const initialProducts = [
  { id: 1, nombre: "Producto 1", descripcion: "Descripción 1", precio: 10000, stock: 10 },
  { id: 2, nombre: "Producto 2", descripcion: "Descripción 2", precio: 15000, stock: 5 },
];

const emptyForm = {
  nombre: "",
  descripcion: "",
  precio: "",
  stock: "",
};

function ProductosManager() {
  const [products, setProducts] = useState(initialProducts);
  const [form, setForm] = useState(emptyForm);
  const [errors, setErrors] = useState({});
  const [editingId, setEditingId] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  // Validación de formulario
  const validate = () => {
    const newErrors = {};
    if (!form.nombre.trim()) newErrors.nombre = "El nombre es obligatorio";
    if (form.nombre.trim().length < 3) newErrors.nombre = "El nombre debe tener al menos 3 caracteres";
    if (form.nombre.trim().length > 50) newErrors.nombre = "El nombre no puede tener más de 50 caracteres";
    if (!form.precio) newErrors.precio = "El precio es obligatorio";
    if (form.precio && (isNaN(form.precio) || Number(form.precio) < 0)) newErrors.precio = "Precio inválido";
    if (!form.stock) newErrors.stock = "El stock es obligatorio";
    if (form.stock && (isNaN(form.stock) || Number(form.stock) < 0)) newErrors.stock = "Stock inválido";
    return newErrors;
  };

  // Maneja cambios en los inputs
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
    if (errors[name]) setErrors({ ...errors, [name]: "" });
  };

  // Agregar o editar producto
  const handleSubmit = (e) => {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    setSubmitting(true);

    if (editingId) {
      // Editar producto
      setProducts((prev) =>
        prev.map((p) =>
          p.id === editingId
            ? { ...p, ...form, precio: Number(form.precio), stock: Number(form.stock) }
            : p
        )
      );
      Swal.fire("¡Actualizado!", "El producto ha sido actualizado.", "success");
    } else {
      // Agregar producto
      setProducts((prev) => [
        { ...form, id: Date.now(), precio: Number(form.precio), stock: Number(form.stock) },
        ...prev,
      ]);
      Swal.fire("¡Agregado!", "El producto ha sido agregado.", "success");
    }
    setForm(emptyForm);
    setEditingId(null);
    setSubmitting(false);
  };

  // Eliminar producto
  const handleDelete = (id) => {
    Swal.fire({
      title: "¿Estás seguro?",
      text: "No podrás revertir esto",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Sí, eliminar",
      cancelButtonText: "Cancelar",
    }).then((result) => {
      if (result.isConfirmed) {
        setProducts((prev) => prev.filter((p) => p.id !== id));
        Swal.fire("¡Eliminado!", "El producto ha sido eliminado.", "success");
      }
    });
  };

  // Editar producto (cargar datos en el form)
  const handleEdit = (product) => {
    setForm({
      nombre: product.nombre,
      descripcion: product.descripcion,
      precio: product.precio,
      stock: product.stock,
    });
    setEditingId(product.id);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Cancelar edición
  const handleCancel = () => {
    setForm(emptyForm);
    setEditingId(null);
    setErrors({});
  };

  return (
    <div className="max-w-2xl mx-auto mt-10">
      <h2 className="text-3xl font-bold mb-6 text-center">Gestión de Productos</h2>
      <form onSubmit={handleSubmit} className="mb-8">
        {/* Nombre */}
        <div className="relative mb-6">
          <input
            type="text"
            id="nombre"
            name="nombre"
            value={form.nombre}
            onChange={handleInputChange}
            placeholder=""
            required
            className={`peer w-full border-2 rounded-md px-3 pt-2 pb-3 text-sm bg-white text-gray-900 focus:outline-none focus:border-orange-500 transition-all
              ${errors.nombre ? "border-red-500" : "border-gray-400"}`}
          />
          <label
            htmlFor="nombre"
            className="absolute left-2 -top-2 px-1 text-xs bg-white text-gray-600 peer-placeholder-shown:top-2 peer-placeholder-shown:text-base 
              peer-placeholder-shown:text-gray-400 peer-focus:-top-2.5 peer-focus:text-xs peer-focus:text-orange-500 transition-all duration-200 z-10"
          >
            Nombre del producto
          </label>
          {errors.nombre && <p className="text-red-500 text-xs mt-1">{errors.nombre}</p>}
        </div>

        {/* Descripción */}
        <div className="relative mb-6">
          <input
            type="text"
            id="descripcion"
            name="descripcion"
            value={form.descripcion}
            onChange={handleInputChange}
            placeholder=""
            className="peer w-full border-2 rounded-md px-3 pt-2 pb-3 text-sm bg-white text-gray-900 focus:outline-none focus:border-orange-500 transition-all border-gray-400"
          />
          <label
            htmlFor="descripcion"
            className="absolute left-2 -top-2 px-1 text-xs bg-white text-gray-600 peer-placeholder-shown:top-2 peer-placeholder-shown:text-base 
              peer-placeholder-shown:text-gray-400 peer-focus:-top-2.5 peer-focus:text-xs peer-focus:text-orange-500 transition-all duration-200 z-10"
          >
            Descripción
          </label>
        </div>

        {/* Precio */}
        <div className="relative mb-6">
          <input
            type="number"
            id="precio"
            name="precio"
            value={form.precio}
            onChange={handleInputChange}
            placeholder=""
            required
            min={0}
            className={`peer w-full border-2 rounded-md px-3 pt-2 pb-3 text-sm bg-white text-gray-900 focus:outline-none focus:border-orange-500 transition-all
              ${errors.precio ? "border-red-500" : "border-gray-400"}`}
          />
          <label
            htmlFor="precio"
            className="absolute left-2 -top-2 px-1 text-xs bg-white text-gray-600 peer-placeholder-shown:top-2 peer-placeholder-shown:text-base 
              peer-placeholder-shown:text-gray-400 peer-focus:-top-2.5 peer-focus:text-xs peer-focus:text-orange-500 transition-all duration-200 z-10"
          >
            Precio
          </label>
          {errors.precio && <p className="text-red-500 text-xs mt-1">{errors.precio}</p>}
        </div>

        {/* Stock */}
        <div className="relative mb-6">
          <input
            type="number"
            id="stock"
            name="stock"
            value={form.stock}
            onChange={handleInputChange}
            placeholder=""
            required
            min={0}
            className={`peer w-full border-2 rounded-md px-3 pt-2 pb-3 text-sm bg-white text-gray-900 focus:outline-none focus:border-orange-500 transition-all
              ${errors.stock ? "border-red-500" : "border-gray-400"}`}
          />
          <label
            htmlFor="stock"
            className="absolute left-2 -top-2 px-1 text-xs bg-white text-gray-600 peer-placeholder-shown:top-2 peer-placeholder-shown:text-base 
              peer-placeholder-shown:text-gray-400 peer-focus:-top-2.5 peer-focus:text-xs peer-focus:text-orange-500 transition-all duration-200 z-10"
          >
            Stock
          </label>
          {errors.stock && <p className="text-red-500 text-xs mt-1">{errors.stock}</p>}
        </div>

        {/* Botones */}
        <div className="flex gap-2">
          <button
            type="submit"
            className="w-full bg-black text-white py-2 rounded hover:bg-orange-400 transition-colors"
            disabled={submitting}
          >
            {editingId ? "Actualizar" : "Agregar"}
          </button>
          {editingId && (
            <button
              type="button"
              className="w-full bg-gray-400 text-white py-2 rounded hover:bg-gray-500 transition-colors"
              onClick={handleCancel}
            >
              Cancelar
            </button>
          )}
        </div>
      </form>

      {/* Tabla de productos */}
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border border-gray-200 rounded-lg shadow">
          <thead>
            <tr className="bg-gray-100">
              <th className="py-2 px-4 border-b">Nombre</th>
              <th className="py-2 px-4 border-b">Descripción</th>
              <th className="py-2 px-4 border-b">Precio</th>
              <th className="py-2 px-4 border-b">Stock</th>
              <th className="py-2 px-4 border-b">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {products.map((p) => (
              <tr key={p.id}>
                <td className="py-2 px-4 border-b">{p.nombre}</td>
                <td className="py-2 px-4 border-b">{p.descripcion}</td>
                <td className="py-2 px-4 border-b">${p.precio}</td>
                <td className="py-2 px-4 border-b">{p.stock}</td>
                <td className="py-2 px-4 border-b flex gap-2">
                  <button
                    className="bg-yellow-400 text-white px-2 py-1 rounded hover:bg-yellow-500 transition"
                    onClick={() => handleEdit(p)}
                  >
                    Editar
                  </button>
                  <button
                    className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600 transition"
                    onClick={() => handleDelete(p.id)}
                  >
                    Eliminar
                  </button>
                </td>
              </tr>
            ))}
            {products.length === 0 && (
              <tr>
                <td colSpan={5} className="text-center py-4 text-gray-500">
                  No hay productos.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default ProductosManager;