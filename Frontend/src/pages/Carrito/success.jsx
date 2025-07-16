import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useCart } from "../../context/CartContext";
import axios from "axios";

const SuccessPage = () => {
  const [transaction, setTransaction] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [countdown, setCountdown] = useState(10);
  const location = useLocation();
  const navigate = useNavigate();
  const { clearCart } = useCart();

  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);

    // Obtener todos los parámetros posibles
    const paymentId = queryParams.get("payment_id");
    const collectionId = queryParams.get("collection_id");
    const externalReference = queryParams.get("external_reference");
    const status = queryParams.get("status");
    const paymentType = queryParams.get("payment_type");
    const merchantOrderId = queryParams.get("merchant_order_id");

    console.log("Parámetros recibidos:", {
      paymentId,
      collectionId,
      externalReference,
      status,
      paymentType,
      merchantOrderId,
      allParams: Object.fromEntries(queryParams.entries()),
    });

    // Usar payment_id o collection_id
    const finalPaymentId = paymentId || collectionId;

    if (finalPaymentId) {
      // Usar la API correcta con la base URL configurada
      const apiUrl =
        import.meta.env.VITE_API_URL || "http://localhost:10000/api";

      axios
        .get(`${apiUrl}/payments/transaction/${finalPaymentId}`)
        .then((response) => {
          console.log("Respuesta de la API:", response.data);
          setTransaction(response.data);
          setLoading(false);

          // Limpiar carrito solo si el pago fue exitoso
          if (response.data.status === "approved") {
            clearCart();
          }
        })
        .catch((err) => {
          console.error("Error obteniendo transacción:", err);

          // Si no se puede obtener de la API, usar los datos de la URL
          const transactionFromUrl = {
            payment_id: finalPaymentId,
            external_reference: externalReference,
            status: status,
            payment_type: paymentType,
            merchant_order_id: merchantOrderId,
            created_at: new Date().toISOString(),
            amount:
              queryParams.get("amount") ||
              queryParams.get("transaction_amount"), // <-- AGREGADO
            collection_status: queryParams.get("collection_status"),
            processing_mode: queryParams.get("processing_mode"),
            site_id: queryParams.get("site_id"),
          };

          console.log("Usando datos de URL:", transactionFromUrl);
          setTransaction(transactionFromUrl);
          setError("Detalles limitados - No se pudo conectar con el servidor");
          setLoading(false);

          // Limpiar carrito si el estado es aprobado
          if (status === "approved") {
            clearCart();
          }
        });
    } else {
      setError("No se encontró ID de pago en la URL");
      setLoading(false);
    }
  }, [location, clearCart]);

  // Countdown para redirección
  useEffect(() => {
    if (!loading && countdown > 0) {
      const timer = setInterval(() => {
        setCountdown((prev) => prev - 1);
      }, 1000);

      return () => clearInterval(timer);
    } else if (countdown === 0) {
      navigate("/");
    }
  }, [loading, countdown, navigate]);

  const handleGoHome = () => {
    navigate("/");
  };

  const formatAmount = (amount) => {
    if (!amount) return "No disponible";
    return new Intl.NumberFormat("es-CL", {
      style: "currency",
      currency: "CLP",
    }).format(amount);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "approved":
        return "text-green-600";
      case "rejected":
        return "text-red-600";
      case "pending":
        return "text-yellow-600";
      default:
        return "text-gray-600";
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case "approved":
        return "Aprobado";
      case "rejected":
        return "Rechazado";
      case "pending":
        return "Pendiente";
      default:
        return status || "Desconocido";
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
          <div className="text-xl">Cargando detalles de pago...</div>
        </div>
      </div>
    );
  }

  return (
    <section className="min-h-screen flex items-center justify-center p-4">
      <div className="max-w-3xl w-full bg-white rounded-2xl shadow-xl overflow-hidden">
        <div className="md:flex">
          <div className="md:w-2/5 bg-green-700 p-8 flex items-center justify-center">
            <div className="text-center">
              <div className="text-6xl font-bold text-white mb-2">✓</div>
              <div className="text-xl font-semibold text-white">
                Pago exitoso
              </div>
              <div className="text-sm text-green-100 mt-2">
                Redirigiendo en {countdown}s...
              </div>
            </div>
          </div>

          <div className="md:w-3/5 p-8 md:p-12 text-center">
            <h1 className="text-4xl md:text-5xl font-extrabold text-gray-800 mb-6">
              ¡Gracias por tu compra!
            </h1>

            {error && (
              <div className="mb-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                <p className="text-sm text-yellow-800">{error}</p>
              </div>
            )}

            {transaction && (
              <div className="mb-6 text-left bg-gray-50 p-4 rounded-lg">
                <h2 className="text-xl font-semibold mb-3">
                  Detalles de la transacción:
                </h2>

                <div className="space-y-2">
                  <p>
                    <strong>ID de pago:</strong>{" "}
                    {transaction.payment_id || "No disponible"}
                  </p>

                  <p>
                    <strong>Referencia:</strong>{" "}
                    {transaction.external_reference || "No disponible"}
                  </p>

                  <p>
                    <strong>Monto:</strong> {formatAmount(transaction.amount)}
                  </p>

                  <p>
                    <strong>Estado:</strong>
                    <span
                      className={`ml-2 font-medium ${getStatusColor(
                        transaction.status
                      )}`}
                    >
                      {getStatusText(transaction.status)}
                    </span>
                  </p>

                  <p>
                    <strong>Tipo de pago:</strong>{" "}
                    {transaction.payment_type || "No disponible"}
                  </p>

                  <p>
                    <strong>Fecha:</strong>{" "}
                    {transaction.created_at
                      ? new Date(transaction.created_at).toLocaleString("es-CL")
                      : "No disponible"}
                  </p>

                  {transaction.merchant_order_id && (
                    <p>
                      <strong>Orden:</strong> {transaction.merchant_order_id}
                    </p>
                  )}

                  {transaction.collection_status && (
                    <p>
                      <strong>Estado de colección:</strong>{" "}
                      {transaction.collection_status}
                    </p>
                  )}
                </div>
              </div>
            )}

            <p className="text-lg text-gray-600 mb-6">
              Tu pago ha sido procesado correctamente. Pronto recibirás una
              confirmación por email.
            </p>

            <div className="flex justify-center">
              <button
                onClick={handleGoHome}
                className="px-6 py-3 bg-green-700 hover:bg-green-800 text-white font-medium rounded-lg transition"
              >
                Volver al inicio ({countdown}s)
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default SuccessPage;
