import React from "react";
import { Dialog } from "@headlessui/react";

const ProductoModal = ({
  isOpen,
  onClose,
  onSubmit,
  form,
  onChange,
  errors,
  isEditing,
  submitting,
}) => {
  return (
    <Dialog open={isOpen} onClose={onClose} className="relative z-50">
      <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
      <div className="fixed inset-0 flex items-center justify-center p-4">
        <Dialog.Panel className="w-full max-w-md bg-white p-6 rounded-xl shadow-lg">
          <Dialog.Title className="text-xl font-bold mb-4">
            {isEditing ? "Editar producto" : "Agregar producto"}
          </Dialog.Title>

          <form onSubmit={onSubmit} className="space-y-4">
            {["nombre", "descripcion", "precio", "stock"].map((field) => (
              <div key={field} className="relative">
                <input
                  type={["precio", "stock"].includes(field) ? "number" : "text"}
                  name={field}
                  id={field}
                  value={form[field]}
                  onChange={onChange}
                  placeholder=""
                  className={`peer w-full border-2 rounded-md px-3 pt-2 pb-3 text-sm bg-white text-gray-900 focus:outline-none 
                    focus:border-orange-500 transition-all ${
                      errors[field] ? "border-red-500" : "border-gray-400"
                    }`}
                />
                <label
                  htmlFor={field}
                  className="absolute left-2 -top-2 px-1 text-xs bg-white text-gray-600 
                  peer-placeholder-shown:top-2 peer-placeholder-shown:text-base 
                  peer-placeholder-shown:text-gray-400 peer-focus:-top-2.5 
                  peer-focus:text-xs peer-focus:text-orange-500 transition-all duration-200 z-10"
                >
                  {field === "nombre"
                    ? "Nombre del producto"
                    : field === "descripcion"
                    ? "Descripción"
                    : field === "precio"
                    ? "Precio"
                    : "Stock"}
                </label>
                {errors[field] && (
                  <p className="text-red-500 text-xs mt-1">{errors[field]}</p>
                )}
              </div>
            ))}

            <div className="flex gap-2 mt-4">
              <button
                type="submit"
                className="w-full bg-black text-white py-2 rounded hover:bg-orange-400 transition"
                disabled={submitting}
              >
                {isEditing ? "Actualizar" : "Agregar"}
              </button>
              <button
                type="button"
                className="w-full bg-gray-400 text-white py-2 rounded hover:bg-gray-500 transition"
                onClick={onClose}
              >
                Cancelar
              </button>
            </div>
          </form>
        </Dialog.Panel>
      </div>
    </Dialog>
  );
};

export default ProductoModal;
    