import { useState } from "react";
import Swal from "sweetalert2";
import ProductoCard from "../../components/ProductoCard";
import ProductoModal from "../../components/ProductoModal";

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
  const [modalOpen, setModalOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const validate = () => {
    const newErrors = {};
    if (!form.nombre.trim()) newErrors.nombre = "El nombre es obligatorio";
    if (form.nombre.trim().length < 3) newErrors.nombre = "Debe tener al menos 3 caracteres";
    if (form.nombre.trim().length > 50) newErrors.nombre = "No puede tener más de 50 caracteres";
    if (!form.precio) newErrors.precio = "El precio es obligatorio";
    if (isNaN(form.precio) || Number(form.precio) < 0) newErrors.precio = "Precio inválido";
    if (!form.stock) newErrors.stock = "El stock es obligatorio";
    if (isNaN(form.stock) || Number(form.stock) < 0) newErrors.stock = "Stock inválido";
    return newErrors;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const handleAddClick = () => {
    setEditingId(null);
    setForm(emptyForm);
    setModalOpen(true);
  };

  const handleEdit = (producto) => {
    setForm({
      nombre: producto.nombre,
      descripcion: producto.descripcion,
      precio: producto.precio,
      stock: producto.stock,
    });
    setEditingId(producto.id);
    setModalOpen(true);
  };

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

  const handleSubmit = (e) => {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setSubmitting(true);
    if (editingId) {
      setProducts((prev) =>
        prev.map((p) =>
          p.id === editingId
            ? { ...p, ...form, precio: Number(form.precio), stock: Number(form.stock) }
            : p
        )
      );
      Swal.fire("¡Actualizado!", "El producto ha sido actualizado.", "success");
    } else {
      setProducts((prev) => [
        { ...form, id: Date.now(), precio: Number(form.precio), stock: Number(form.stock) },
        ...prev,
      ]);
      Swal.fire("¡Agregado!", "El producto ha sido agregado.", "success");
    }

    setForm(emptyForm);
    setEditingId(null);
    setModalOpen(false);
    setSubmitting(false);
  };

  return (
    <div className="max-w-4xl mx-auto mt-10">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-3xl font-bold">Gestión de Productos</h2>
        <button
          onClick={handleAddClick}
          className="bg-orange-500 text-white px-4 py-2 rounded hover:bg-orange-600"
        >
          Agregar Producto
        </button>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {products.map((producto) => (
          <ProductoCard
            key={producto.id}
            producto={producto}
            onEditar={handleEdit}
            onEliminar={handleDelete}
          />
        ))}
      </div>

      <ProductoModal
        isOpen={modalOpen}
        onClose={() => {
          setModalOpen(false);
          setForm(emptyForm);
          setEditingId(null);
          setErrors({});
        }}
        onSubmit={handleSubmit}
        form={form}
        onChange={handleInputChange}
        errors={errors}
        isEditing={!!editingId}
        submitting={submitting}
      />
    </div>
  );
}

export default ProductosManager;
