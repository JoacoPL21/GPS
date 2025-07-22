import ProductoCard from "../ProductoCard";

const VistaGrilla = ({ 
  productosFiltradosYOrdenados = [], 
  manejarClickProducto, 
  modoSeleccion, 
  mostrarEliminados,
  manejarEditar,
  manejarEliminar,
  manejarRestaurar,
  estaSeleccionado 
}) => {
  return (
    <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {productosFiltradosYOrdenados.map((producto) => (
        <div
          key={producto.id_producto}
          onClick={() => manejarClickProducto(producto.id_producto)}
          className={`${modoSeleccion ? "cursor-pointer" : ""}`}
        >
          <ProductoCard
            producto={producto}
            onEditar={!mostrarEliminados ? manejarEditar : undefined}
            onEliminar={!mostrarEliminados ? manejarEliminar : undefined}
            onRestaurar={mostrarEliminados ? manejarRestaurar : undefined}
            isSelected={estaSeleccionado(producto.id_producto)}
            selectionMode={modoSeleccion && !mostrarEliminados}
            showDeleted={mostrarEliminados}
          />
        </div>
      ))}
    </div>
  );
};

export default VistaGrilla;
