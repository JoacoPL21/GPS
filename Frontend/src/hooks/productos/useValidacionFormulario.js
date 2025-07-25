import { useState } from 'react';

export const useValidacionFormulario = () => {
  const [errores, setErrores] = useState({});

  const validarFormulario = (form) => {
    const nuevosErrores = {};
    
    if (!form.nombre.trim()) nuevosErrores.nombre = "El nombre es obligatorio";
    if (form.nombre.trim().length < 3) nuevosErrores.nombre = "Debe tener al menos 3 caracteres";
    if (form.nombre.trim().length > 50) nuevosErrores.nombre = "No puede tener más de 50 caracteres";
    if (!form.precio) nuevosErrores.precio = "El precio es obligatorio";
    if (isNaN(form.precio) || Number(form.precio) < 0) nuevosErrores.precio = "Precio inválido";
    if (!form.stock) nuevosErrores.stock = "El stock es obligatorio";
    if (isNaN(form.stock) || Number(form.stock) < 0) nuevosErrores.stock = "Stock inválido";
    if (!form.id_categoria) nuevosErrores.categoria = "La categoría es obligatoria";
    
    // Validaciones opcionales para dimensiones y peso
    if (form.peso && (isNaN(form.peso) || Number(form.peso) < 0)) {
      nuevosErrores.peso = "El peso debe ser un número positivo";
    }
    if (form.ancho && (isNaN(form.ancho) || Number(form.ancho) < 0)) {
      nuevosErrores.ancho = "El ancho debe ser un número positivo";
    }
    if (form.alto && (isNaN(form.alto) || Number(form.alto) < 0)) {
      nuevosErrores.alto = "El alto debe ser un número positivo";
    }
    if (form.profundidad && (isNaN(form.profundidad) || Number(form.profundidad) < 0)) {
      nuevosErrores.profundidad = "La profundidad debe ser un número positivo";
    }
    
    return nuevosErrores;
  };

  const validarArchivo = (archivo, nombre) => {
    const MAX_SIZE = 5 * 1024 * 1024; // 5MB
    const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp'];
    
    // Validar tipo de archivo
    if (!ALLOWED_TYPES.includes(archivo.type)) {
      setErrores(prev => ({
        ...prev,
        [nombre]: "Tipo de archivo no válido. Solo se permiten JPG, PNG y WEBP."
      }));
      return false;
    }

    // Validar tamaño del archivo
    if (archivo.size > MAX_SIZE) {
      setErrores(prev => ({
        ...prev,
        [nombre]: `El archivo es demasiado grande. Máximo permitido: ${MAX_SIZE / 1024 / 1024}MB.`
      }));
      return false;
    }

    return true;
  };

  const limpiarError = (campo) => {
    if (errores[campo]) {
      setErrores((prev) => ({ ...prev, [campo]: "" }));
    }
  };

  const limpiarErrores = () => {
    setErrores({});
  };

  return {
    errores,
    setErrores,
    validarFormulario,
    validarArchivo,
    limpiarError,
    limpiarErrores,
  };
};
