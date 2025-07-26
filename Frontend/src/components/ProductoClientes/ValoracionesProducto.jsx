
import { FaStar } from "react-icons/fa";
import { useValoraciones } from "../../hooks/valoraciones/useValoraciones";
import ValoracionForm from "../ValoracionForm";

const ValoracionesProducto = ({ id_producto }) => {
  const {
    valoraciones,
    loading,
    error,
    puedeValorar,
    valoracionUsuario,
    submitting,
    promedioValoraciones,
    enviarValoracion
  } = useValoraciones(id_producto);

  // Renderizar estrellas
  const renderStars = (rating) => (
    Array.from({ length: 5 }, (_, i) => (
      <FaStar
        key={i}
        className={`w-4 h-4 ${i < rating ? "fill-[#A57149] text-[#A57149]" : "fill-gray-200 text-gray-200"}`}
      />
    ))
  );

  const handleSubmitValoracion = async (valoracionData) => {
    try {
      await enviarValoracion(valoracionData);
      alert(valoracionUsuario ? 'Valoración actualizada exitosamente' : 'Valoración enviada exitosamente');
    } catch (error) {
      alert(`Error: ${error.message}`);
    }
  };

  if (loading) return <div className="mt-8">Cargando valoraciones...</div>;
  if (error) return <div className="mt-8 text-red-600">Error al cargar valoraciones: {error}</div>;

  return (
    <div className="w-full max-w-6xl mx-auto p-4">
      {/* Header con resumen */}
      <div className="mb-6">
        <h2 className="text-2xl font-bold mb-2">Valoraciones del producto</h2>
        <div className="flex items-center gap-2 mb-1">
          <div className="flex items-center">{renderStars(Math.round(promedioValoraciones))}</div>
          <span className="text-lg font-semibold">{promedioValoraciones.toFixed(1)}</span>
          <span className="text-gray-500">
            ({valoraciones.length} {valoraciones.length === 1 ? "valoración" : "valoraciones"})
          </span>
        </div>
      </div>

      {/* Formulario de valoración */}
      <ValoracionForm
        onSubmit={handleSubmitValoracion}
        valoracionExistente={valoracionUsuario}
        submitting={submitting}
        puedeValorar={puedeValorar}
      />

      {/* Lista de valoraciones */}
      <div className="space-y-4">
        {valoraciones.length === 0 ? (
          <div className="rounded-lg border bg-white p-6 text-center text-gray-500">
            <p>Aún no hay valoraciones para este producto.</p>
            <p className="text-sm mt-1">¡Sé el primero en valorarlo!</p>
          </div>
        ) : (
          valoraciones.map((review, idx) => (
            <div
              key={idx}
              className="rounded-lg border bg-white transition-shadow hover:shadow-lg hover:shadow-[#A57149]/10"
            >
              <div className="p-4">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <div className="flex items-center">{renderStars(review.puntuacion)}</div>
                    <span className="font-medium">{review.puntuacion}/5</span>
                  </div>
                  <span className="text-sm text-gray-400">
                    {review.createdAt ? new Date(review.createdAt).toLocaleDateString() : ""}
                  </span>
                </div>
                <p className="text-gray-700 leading-relaxed">{review.descripcion}</p>
                <div className="mt-3 pt-3 border-t border-[#A57149]/20">
                  <span className="text-xs text-gray-400">Valoración anónima verificada</span>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Estadísticas de valoraciones */}
      {valoraciones.length > 0 && (
        <div className="mt-8 p-4 bg-[#A57149]/5 rounded-lg">
          <h3 className="font-semibold mb-3">Distribución de valoraciones</h3>
          <div className="space-y-2">
            {[5, 4, 3, 2, 1].map((stars) => {
              const count = valoraciones.filter((v) => v.puntuacion === stars).length;
              const percentage = valoraciones.length > 0 ? (count / valoraciones.length) * 100 : 0;
              return (
                <div key={stars} className="flex items-center gap-2 text-sm">
                  <span className="w-8">{stars}</span>
                  <FaStar className="w-3 h-3 fill-[#A57149] text-[#A57149]" />
                  <div className="flex-1 bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-[#A57149] h-2 rounded-full transition-all duration-300"
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                  <span className="w-8 text-right">{count}</span>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export default ValoracionesProducto; 