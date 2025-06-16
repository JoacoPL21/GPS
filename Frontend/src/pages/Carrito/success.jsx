import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';

const SuccessPage = () => {
  const [transaction, setTransaction] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const paymentId = queryParams.get('payment_id');
    
    if (paymentId) {
      axios.get(`/api/payments/transaction/${paymentId}`)
        .then(response => {
          setTransaction(response.data);
          setLoading(false);
        })
        .catch(err => {
          console.error('Error obteniendo transacción:', err);
          setError('Error al obtener detalles de la transacción');
          setLoading(false);
        });
    } else {
      setError('No se encontró ID de pago en la URL');
      setLoading(false);
    }
  }, [location]);

  const handleGoHome = () => {
    navigate('/');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl">Cargando detalles de pago...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl text-red-600">{error}</div>
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
              <div className="text-xl font-semibold text-white">Pago exitoso</div>
            </div>
          </div>

          <div className="md:w-3/5 p-8 md:p-12 text-center">
            <h1 className="text-4xl md:text-5xl font-extrabold text-gray-800 mb-6">
              ¡Gracias por tu compra!
            </h1>
            
            {transaction && (
              <div className="mb-6 text-left bg-gray-50 p-4 rounded-lg">
                <h2 className="text-xl font-semibold mb-3">Detalles de la transacción:</h2>
                <p><strong>ID de pago:</strong> {transaction.payment_id}</p>
                <p><strong>Referencia:</strong> {transaction.external_reference}</p>
                <p><strong>Monto:</strong> ${transaction.amount}</p>
                <p><strong>Estado:</strong> <span className="capitalize">{transaction.status}</span></p>
                <p><strong>Tipo:</strong> {transaction.payment_type}</p>
                <p><strong>Fecha:</strong> {new Date(transaction.created_at).toLocaleString()}</p>
              </div>
            )}

            <p className="text-lg text-gray-600 mb-6">
              Tu pago ha sido procesado correctamente. Pronto recibirás una confirmación.
            </p>

            <div className="flex justify-center">
              <button
                onClick={handleGoHome}
                className="px-6 py-3 bg-green-700 hover:bg-green-800 text-white font-medium rounded-lg transition"
              >
                Volver al inicio
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default SuccessPage;