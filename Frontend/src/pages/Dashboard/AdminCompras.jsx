import React, { useEffect, useState } from "react";
import { FaTruck, FaCheckCircle, FaClock, FaSearch, FaEdit, FaCopy } from "react-icons/fa";
import { getAllComprasAdmin } from "../../services/compras.service";

const estadoLabels = {
  enviada: { label: "Enviada", color: "bg-blue-100 text-blue-800", icon: <FaTruck /> },
  entregada: { label: "Entregada", color: "bg-green-100 text-green-800", icon: <FaCheckCircle /> },
  pendiente: { label: "Pendiente", color: "bg-orange-100 text-orange-800", icon: <FaClock /> },
};

export default function AdminCompras() {
  const [orders, setOrders] = useState([]);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("todas");
  const [modal, setModal] = useState({ open: false, order: null, tracking: "" });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchCompras() {
      setLoading(true);
      const res = await getAllComprasAdmin();
      if (res.status === "Success") {
        setOrders(res.data || []);
        setError(null);
      } else {
        setError(res.message);
      }
      setLoading(false);
    }
    fetchCompras();
  }, []);

  // Filtrado
  const filteredOrders = orders.filter((order) => {
    const matchSearch =
      order.cliente.toLowerCase().includes(search.toLowerCase()) ||
      order.email.toLowerCase().includes(search.toLowerCase()) ||
      String(order.id_compra).toLowerCase().includes(search.toLowerCase());
    const matchEstado = filter === "todas" || order.estado === filter;
    return matchSearch && matchEstado;
  });

  // Guardar tracking
  const handleGuardarTracking = () => {
    setOrders((prev) =>
      prev.map((o) =>
        o.id_compra === modal.order.id_compra
          ? { ...o, tracking: modal.tracking, estado: "enviada" }
          : o
      )
    );
    setModal({ open: false, order: null, tracking: "" });
  };

  // Copiar tracking
  const handleCopy = (code) => {
    navigator.clipboard.writeText(code);
    alert("Código copiado al portapapeles");
  };

  return (
    <div className="container mx-auto py-8 max-w-5xl">
      <h1 className="text-3xl font-bold mb-6">Gestión de Compras</h1>
      {error && <div className="bg-red-100 text-red-700 p-4 rounded mb-4">{error}</div>}
      {/* Filtros */}
      <div className="flex bg-white flex-col md:flex-row md:items-center gap-4 mb-6">
        <div className="relative flex-1">
          <FaSearch className="absolute left-3 top-3 text-gray-400" />
          <input
            type="text"
            placeholder="Buscar por cliente, email o ID..."
            className="pl-10 pr-4 py-2 border rounded w-full"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <select
          className="border rounded px-3 py-2"
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
        >
          <option value="todas">Todas</option>
          <option value="pendiente">Pendientes</option>
          <option value="enviada">Enviadas</option>
          <option value="entregada">Entregadas</option>
        </select>
      </div>

      {/* Tabla */}
      <div className="overflow-x-auto bg-white rounded shadow">
        {loading ? (
          <div className="text-center py-8 text-gray-400">Cargando compras...</div>
        ) : (
          <table className="min-w-full text-sm">
            <thead>
              <tr className="bg-gray-100">
                <th className="p-3 text-left">Pedido</th>
                <th className="p-3 text-left">Cliente</th>
                <th className="p-3 text-left">Email</th>
                <th className="p-3 text-left">Fecha</th>
                <th className="p-3 text-left">Total</th>
                <th className="p-3 text-left">Estado</th>
                <th className="p-3 text-left">Seguimiento</th>
                <th className="p-3 text-right">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {filteredOrders.length === 0 ? (
                <tr>
                  <td colSpan={8} className="text-center py-8 text-gray-400">
                    No hay compras que coincidan con los filtros.
                  </td>
                </tr>
              ) : (
                filteredOrders.map((order) => (
                  <tr key={order.id_compra} className="border-b">
                    <td className="p-3">{order.id_compra}</td>
                    <td className="p-3">{order.cliente}</td>
                    <td className="p-3">{order.email}</td>
                    <td className="p-3">{new Date(order.fecha).toLocaleDateString("es-CL")}</td>
                    <td className="p-3">${order.total.toLocaleString("es-CL")}</td>
                    <td className="p-3">
                      <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-semibold ${estadoLabels[order.estado]?.color || 'bg-gray-100 text-gray-800'}`}>
                        {estadoLabels[order.estado]?.icon}
                        {estadoLabels[order.estado]?.label || order.estado}
                      </span>
                    </td>
                    <td className="p-3">
                      {order.tracking ? (
                        <span className="inline-flex items-center gap-2">
                          <span className="bg-gray-100 px-2 py-1 rounded text-xs">{order.tracking}</span>
                          <button
                            className="text-gray-400 hover:text-gray-700"
                            onClick={() => handleCopy(order.tracking)}
                            title="Copiar código"
                          >
                            <FaCopy />
                          </button>
                        </span>
                      ) : (
                        <span className="text-gray-400 text-xs">Sin código</span>
                      )}
                    </td>
                    <td className="py-3 text-right">
                      <div className="flex justify-center">
                        {order.estado === "pendiente" && (
                          <button
                            className="flex items-center gap-2 px-4 py-2 text-sm font-semibold shadow-md transition-colors duration-200 mx-auto"
                            style={{ backgroundColor: '#a47148', color: 'white', borderRadius: '0.375rem', boxShadow: '0 2px 6px rgba(0,0,0,0.08)' }}
                            onMouseOver={e => e.currentTarget.style.backgroundColor = '#825a32'}
                            onMouseOut={e => e.currentTarget.style.backgroundColor = '#a47148'}
                            onClick={() => setModal({ open: true, order, tracking: "" })}
                          >
                            <FaEdit style={{ marginRight: '0.5rem', fontSize: '1.1em' }} /> Agregar seguimiento
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        )}
      </div>

      {/* Modal para agregar/editar tracking */}
      {modal.open && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md">
            <h2 className="text-xl font-bold mb-4">
              {modal.order.tracking ? "Editar código de seguimiento" : "Agregar código de seguimiento"}
            </h2>
            <input
              type="text"
              className="w-full border rounded px-3 py-2 mb-4"
              placeholder="Ej: TRK123456789"
              value={modal.tracking}
              onChange={(e) => setModal((m) => ({ ...m, tracking: e.target.value }))}
            />
            <div className="flex justify-end gap-2">
              <button
                className="px-4 py-2 border rounded text-gray-700 hover:bg-gray-50"
                onClick={() => setModal({ open: false, order: null, tracking: "" })}
              >
                Cancelar
              </button>
              <button
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                onClick={handleGuardarTracking}
                disabled={!modal.tracking.trim()}
              >
                Guardar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 