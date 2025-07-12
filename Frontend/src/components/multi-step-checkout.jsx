"use client";

import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { initMercadoPago, Wallet } from "@mercadopago/sdk-react";
import { useCart } from "../context/CartContext";
import RegionComunaSelector from "../components/RegionComunaSelector";
import { useChilexpressCoverage } from "../hooks/useChilexpressCoverage";
import ChilexpressRegionComunaSelector from "../components/ChilexpressRegionComunaSelector";

import {
  Heart,
  Trash2,
  ArrowLeft,
  Check,
  MapPin,
  Package,
  ShoppingCart,
  Minus,
  Plus,
  X,
} from "lucide-react";

const API_URL = import.meta.env.VITE_BASE_URL || "http://localhost:3000/api";
const mpPublicKey = import.meta.env.VITE_MP_PUBLIC_KEY;
initMercadoPago(mpPublicKey, { locale: "es-CL" });

// Mapeo de códigos de región romanos a números
const regionRomanToNumber = {
  'I': '1', 'II': '2', 'III': '3', 'IV': '4', 'V': '5', 'VI': '6', 'VII': '7',
  'VIII': '8', 'IX': '9', 'X': '10', 'XI': '11', 'XII': '12', 'XIII': '13',
  'XIV': '14', 'XV': '15', 'XVI': '16'
};

// Función para formatear precios
const formatPrice = (price) => {
  return new Intl.NumberFormat("es-CL").format(price);
};

const StepIndicator = ({ currentStep, steps }) => {
  return (
    <div className="flex items-center justify-center mb-8">
      {steps.map((step, index) => (
        <div key={index} className="flex items-center">
          <div
            className={`flex items-center justify-center w-10 h-10 rounded-full border-2 ${
              index < currentStep
                ? "bg-amber-500 border-amber-500 text-white"
                : index === currentStep
                ? "bg-amber-500 border-amber-500 text-white"
                : "bg-gray-200 border-gray-300 text-gray-500"
            }`}
          >
            {index < currentStep ? <Check className="w-5 h-5" /> : step.icon}
          </div>
          <span
            className={`ml-2 text-sm font-medium ${
              index <= currentStep ? "text-amber-600" : "text-gray-500"
            }`}
          >
            {step.label}
          </span>
          {index < steps.length - 1 && (
            <div
              className={`w-12 h-0.5 mx-4 ${
                index < currentStep ? "bg-amber-500" : "bg-gray-300"
              }`}
            />
          )}
        </div>
      ))}
    </div>
  );
};

const CartItem = ({
  title,
  price,
  quantity,
  image,
  onRemove,
  onAddToFavorites,
  onIncrease,
  onDecrease,
  readonly = false,
}) => {
  const isMinusDisabled = quantity <= 1 || readonly;
  const isPlusDisabled = quantity >= 10 || readonly;

  if (readonly) {
    // Mantener el diseño actual para el modo readonly
    return (
      <div className="rounded-lg border border-orange-200 bg-white p-4 shadow-sm">
        <div className="flex items-center gap-4">
          <div className="shrink-0">
            <img
              className="h-16 w-16 rounded-lg object-cover"
              src={`${API_URL}/uploads/${image}`}
              alt={title}
            />
          </div>
          <div className="flex-1">
            <h3 className="text-base font-medium text-gray-900">{title}</h3>
            <p className="text-lg font-bold text-orange-600">
              ${formatPrice(price)}
            </p>
          </div>
          <div className="text-right">
            <span className="text-sm text-gray-600">Cantidad: {quantity}</span>
            <p className="font-bold text-gray-900">
              ${formatPrice(price * quantity)}
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white border border-amber-100 rounded-lg">
      <div className="p-4">
        <div className="flex items-center space-x-4">
          <img
            src={`${API_URL}/uploads/${image}`}
            alt={title}
            className="w-24 h-24 rounded-lg object-cover"
          />
          <div className="flex-1">
            <h4 className="font-semibold text-amber-900 mb-1">{title}</h4>
            <p className="text-lg font-bold text-amber-600">
              ${formatPrice(price)}
            </p>
          </div>
          <div className="flex items-center space-x-3">
            <div className="flex items-center space-x-2 bg-amber-50 rounded-lg p-1">
              <button
                onClick={() => !isMinusDisabled && onDecrease()}
                disabled={isMinusDisabled}
                className={`h-8 w-8 flex items-center justify-center text-amber-600 hover:bg-amber-100 rounded ${
                  isMinusDisabled ? "opacity-50 cursor-not-allowed" : ""
                }`}
                style={{
                  padding: "0px",
                  backgroundColor: "var(--color-amber-300)",
                }}
              >
                <Minus className="w-4 h-4" />
              </button>
              <span className="w-8 text-center font-medium">{quantity}</span>
              <button
                onClick={() => !isPlusDisabled && onIncrease()}
                disabled={isPlusDisabled}
                className={`h-8 w-8 flex items-center justify-center text-amber-600 hover:bg-amber-100 rounded ${
                  isPlusDisabled ? "opacity-50 cursor-not-allowed" : ""
                }`}
                style={{
                  padding: "0px",
                  backgroundColor: "var(--color-amber-300)",
                }}
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>
            <button
              onClick={onRemove}
              className="h-8 w-8 flex items-center justify-center text-red-500 hover:bg-red-50 rounded"
              style={{
                padding: "0px",
                backgroundColor: "var(--color-amber-300)",
              }}
            >
              <X className="w-4 h-4" />
            </button>
          </div>
          <div className="text-right">
            <p className="font-semibold text-amber-900">
              ${formatPrice(price * quantity)}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

const ShippingForm = ({
  shippingData,
  setShippingData,
  cobertura,
  loadingCobertura,
  errorCobertura,
}) => {
  const handleInputChange = (field, value) => {
    setShippingData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  return (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold text-gray-900">
        Información de Envío
      </h3>

      
      {/* Selector región y comuna con datos de Chilexpress */}
      <ChilexpressRegionComunaSelector
        regionValue={shippingData.regionCode}
        comunaValue={shippingData.comunaCode}
        onChange={({ region, comuna }) => {
          setShippingData((prev) => ({
            ...prev,
            regionCode: region,
            comunaCode: comuna,
          }));
        }}
      />

      {/* Mensaje de cobertura */}
      {loadingCobertura && (
        <p className="text-amber-700 text-sm">Consultando cobertura...</p>
      )}
      {errorCobertura && (
        <p className="text-red-500 text-sm">{errorCobertura}</p>
      )}
      {cobertura === true && (
        <p className="text-green-600 text-sm">¡Cobertura disponible para la comuna seleccionada!</p>
      )}
      {cobertura === false && (
        <p className="text-red-600 text-sm">No hay cobertura en la comuna seleccionada.</p>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Nombre completo *
          </label>
          <input
            type="text"
            value={shippingData.fullName}
            onChange={(e) => handleInputChange("fullName", e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
            placeholder="Juan Pérez"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Teléfono *
          </label>
          <input
            type="tel"
            value={shippingData.phone}
            onChange={(e) => handleInputChange("phone", e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
            placeholder="+56 9 1234 5678"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Dirección *
        </label>
        <input
          type="text"
          value={shippingData.address}
          onChange={(e) => handleInputChange("address", e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
          placeholder="Av. Providencia 1234"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Código Postal
          </label>
          <input
            type="text"
            value={shippingData.postalCode}
            onChange={(e) => handleInputChange("postalCode", e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
            placeholder="7500000"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Instrucciones especiales (opcional)
        </label>
        <textarea
          value={shippingData.instructions}
          onChange={(e) => handleInputChange("instructions", e.target.value)}
          rows={3}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
          placeholder="Ej: Dejar en portería, tocar timbre, etc."
        />
      </div>
    </div>
  );
};

const OrderSummary = ({ cart, shippingData, subtotal, shipping, total }) => {
  return (
    <div className="bg-gray-50 rounded-lg p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">
        Resumen del Pedido
      </h3>

      <div className="space-y-3 mb-4">
        {cart.map((item) => (
          <div key={item.id_producto} className="flex justify-between items-center">
            <div className="flex items-center gap-2">
              <span className="w-6 h-6 bg-amber-500 text-white text-xs rounded-full flex items-center justify-center">
                {item.cantidad}
              </span>
              <span className="text-sm text-gray-700">{item.nombre}</span>
            </div>
            <span className="font-medium">
              $
              {formatPrice(
                Number(item.precio.toString().replace(/\./g, "")) *
                  item.cantidad
              )}
            </span>
          </div>
        ))}
      </div>

      <div className="border-t pt-4 space-y-2">
        <div className="flex justify-between">
          <span className="text-gray-600">Subtotal:</span>
          <span>${formatPrice(subtotal)}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-600">Envío:</span>
          <span>${formatPrice(shipping)}</span>
        </div>
        <div className="flex justify-between font-bold text-lg border-t pt-2">
          <span>Total:</span>
          <span className="text-amber-600">${formatPrice(total)}</span>
        </div>
      </div>

      {shippingData.address && (
        <div className="mt-4 pt-4 border-t">
          <p className="text-sm font-medium text-gray-700 mb-2">
            Envío estimado: 3-5 días hábiles
          </p>
          <div className="text-sm text-gray-600">
            <p>{shippingData.fullName}</p>
            <p>{shippingData.address}</p>
            <p>
              {shippingData.comunaCode}, {shippingData.regionCode}
            </p>
            <p>{shippingData.phone}</p>
          </div>
        </div>
      )}
    </div>
  );
};

function MultiStepCheckout() {
  const {
    cart: carrito,
    addItemToCart,
    removeItemFromCart,
    clearCart,
    total: totalCarrito
  } = useCart();

  const navigate = useNavigate();

  const [currentStep, setCurrentStep] = useState(0);
  const [shippingData, setShippingData] = useState({
    fullName: "",
    phone: "",
    address: "",
    regionCode: "",
    comunaCode: "",
    postalCode: "",
    instructions: "",
  });
  const [preferenceId, setPreferenceId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Chilexpress coverage hook
  const {
    loading: loadingCobertura,
    error: errorCobertura,
    cobertura,
    checkCobertura,
  } = useChilexpressCoverage();

  // Consultar cobertura cada vez que cambian región o comuna (y ambos existen)
  useEffect(() => {
  if (shippingData.regionCode && shippingData.comunaCode) {
    // Convertir regionId de Chilexpress a número
    const regionNumber = shippingData.regionCode.replace('R', '').replace('M', '13');
    checkCobertura(regionNumber, shippingData.comunaCode);
  }
}, [shippingData.regionCode, shippingData.comunaCode]);

  const steps = [
    { label: "Carrito", icon: <Package className="w-5 h-5" /> },
    { label: "Información de Envío", icon: <MapPin className="w-5 h-5" /> },
    { label: "Confirmación", icon: <Check className="w-5 h-5" /> },
  ];

  // Calcular totales
  const subtotal = carrito.reduce(
    (total, item) =>
      total +
      Number(item.precio.toString().replace(/\./g, "")) * (item.cantidad || 1),
    0
  );

  const shipping = 3000;
  const total = subtotal + shipping;

  const handleAddToFavorites = (itemId) => {
    console.log("Adding to favorites:", itemId);
  };

  const validateShippingData = () => {
    const required = ["fullName", "phone", "address", "regionCode", "comunaCode"];
    return required.every((field) => shippingData[field] && shippingData[field].trim() !== "");
  };

  const handleNextStep = () => {
    if (currentStep === 0 && carrito.length === 0) {
      setError("El carrito está vacío");
      return;
    }

    if (currentStep === 1 && !validateShippingData()) {
      setError("Por favor completa todos los campos obligatorios");
      return;
    }

    // Solo permite avanzar si hay cobertura
    if (currentStep === 1 && cobertura === false) {
      setError("No hay cobertura de Chilexpress para la comuna seleccionada");
      return;
    }

    setError(null);
    setCurrentStep((prev) => Math.min(prev + 1, steps.length - 1));
  };

  const handlePrevStep = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 0));
    setError(null);
  };

  const handleCheckout = async () => {
    setLoading(true);
    setError(null);

    try {
      const items = carrito.map((item) => ({
        title: item.nombre,
        unit_price: Number(item.precio.toString().replace(/\./g, "")),
        quantity: item.cantidad || 1,
      }));

      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/payments/create_preference`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            items,
            external_reference: `ORD-${Date.now()}`,
            shipping_info: shippingData,
          }),
        }
      );

      if (!response.ok)
        throw new Error("Error al crear la preferencia de pago");

      const data = await response.json();
      setPreferenceId(data.preferenceId || data.id);
    } catch (err) {
      console.error("Checkout error:", err);
      setError("Error al procesar el pago. Intenta nuevamente.");
    } finally {
      setLoading(false);
    }
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 0:
        return (
          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-amber-900 mb-4">
              Tu Carrito de Compras
            </h3>

            {carrito.length === 0 ? (
              <div className="text-center py-12">
                <ShoppingCart className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  Tu carrito está vacío
                </h3>
                <p className="text-gray-600 mb-4">
                  Agrega algunos productos para continuar
                </p>
                <Link
                  to="/"
                  className="inline-flex px-6 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-lg transition-colors"
                >
                  Continuar Comprando
                </Link>
              </div>
            ) : (
              <div className="space-y-4">
                {carrito.map((item) => (
                  <CartItem
                    key={item.id}
                    title={item.nombre}
                    price={Number(item.precio.toString().replace(/\./g, ""))}
                    quantity={item.cantidad || 1}
                    image={item.imagen}
                    onRemove={() => removeItemFromCart(item.id)}
                    onAddToFavorites={() => handleAddToFavorites(item.id)}
                    onIncrease={() => addItemToCart(item)}
                    onDecrease={() => removeItemFromCart(item.id)}
                  />
                ))}

                {/* Resumen del carrito */}
                <div className="bg-amber-50 border-amber-200 border rounded-lg">
                  <div className="p-4">
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>
                          Subtotal (
                          {carrito.reduce(
                            (sum, item) => sum + (item.cantidad || 1),
                            0
                          )}{" "}
                          productos):
                        </span>
                        <span>${formatPrice(subtotal)}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>Envío estimado:</span>
                        <span>${formatPrice(shipping)}</span>
                      </div>
                      <div className="border-t border-amber-200 pt-2">
                        <div className="flex justify-between font-semibold text-lg">
                          <span>Total estimado:</span>
                          <span className="text-amber-600">
                            ${formatPrice(total)}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        );

      case 1:
        return (
          <ShippingForm
            shippingData={shippingData}
            setShippingData={setShippingData}
            cobertura={cobertura}
            loadingCobertura={loadingCobertura}
            errorCobertura={errorCobertura}
          />
        );

      case 2:
        return (
          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-gray-900">
              Confirma tu Pedido
            </h3>

            <div className="space-y-4">
              <h4 className="font-medium text-gray-700">Productos:</h4>
              {carrito.map((item) => (
                <CartItem
                  key={item.id}
                  title={item.nombre}
                  price={Number(item.precio.toString().replace(/\./g, ""))}
                  quantity={item.cantidad || 1}
                  image={item.imagen}
                  readonly={true}
                />
              ))}
            </div>

            <div className="bg-gray-50 rounded-lg p-4">
              <h4 className="font-medium text-gray-700 mb-2">
                Información de Envío:
              </h4>
              <div className="text-sm text-gray-600 space-y-1">
                <p>
                  <strong>Nombre:</strong> {shippingData.fullName}
                </p>
                <p>
                  <strong>Teléfono:</strong> {shippingData.phone}
                </p>
                <p>
                  <strong>Dirección:</strong> {shippingData.address}
                </p>
                <p>
                  <strong>Región:</strong> {shippingData.regionCode}
                </p>
                <p>
                  <strong>Comuna:</strong> {shippingData.comunaCode}
                </p>
                {shippingData.postalCode && (
                  <p>
                    <strong>Código Postal:</strong> {shippingData.postalCode}
                  </p>
                )}
                {shippingData.instructions && (
                  <p>
                    <strong>Instrucciones:</strong> {shippingData.instructions}
                  </p>
                )}
              </div>
            </div>

            {preferenceId && (
              <div className="mt-6">
                <Wallet
                  initialization={{ preferenceId }}
                  customization={{
                    texts: { valueProp: "smart_option" },
                    theme: "default",
                  }}
                  onReady={() => console.log("🟢 Wallet Brick listo")}
                  onError={(error) => {
                    console.error("🔴 Error en el Brick:", error);
                    setError("Error al cargar el botón de pago.");
                  }}
                />
              </div>
            )}
          </div>
        );

      default:
        return null;
    }
  };

  // Botón "Volver" con lógica de pasos
  const handleHeaderBack = () => {
    if (currentStep === 0) {
      navigate("/");
    } else {
      setCurrentStep((prev) => Math.max(prev - 1, 0));
    }
  };

  return (
    <section className="min-h-screen min-w-screen bg-white py-8 md:py-16">
      <div className="mx-auto max-w-7xl px-4">
        {/* Header */}
        <div className="relative mb-8">
          <button
            type="button"
            onClick={handleHeaderBack}
            className="absolute left-0 top-1/2 -translate-y-1/2 flex items-center gap-2 text-amber-600 hover:text-amber-700"
            style={{ backgroundColor: "white" }}
          >
            <ArrowLeft className="h-4 w-4" />
            Volver
          </button>
          <h1 className="text-center text-2xl font-bold text-amber-800">
            Finalizar Compra
          </h1>
          <p className="text-center text-sm text-amber-600 mt-1">
            Complete la información para procesar su pedido
          </p>
        </div>

        {/* Step Indicator */}
        <StepIndicator currentStep={currentStep} steps={steps} />

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-sm p-6">
              {renderStepContent()}

              {error && (
                <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                  <p className="text-red-600 text-sm">{error}</p>
                </div>
              )}

              {/* Navigation Buttons */}
              {carrito.length > 0 && (
                <div className="flex justify-between pt-4 mt-8 border-t">
                  <Link
                    to="/"
                    className="px-6 py-2 rounded-lg border border-amber-600 text-amber-600 hover:bg-amber-50 bg-transparent transition-colors"
                  >
                    Continuar Comprando
                  </Link>

                  {currentStep < 2 ? (
                    <button
                      onClick={handleNextStep}
                      disabled={
                        (currentStep === 0 && carrito.length === 0) ||
                        (currentStep === 1 && cobertura === false)
                      }
                      className={`px-8 py-2 rounded-lg text-white transition-colors ${
                        currentStep === 0 && carrito.length === 0
                          ? "bg-gray-400 cursor-not-allowed"
                          : currentStep === 1 && cobertura === false
                          ? "bg-gray-400 cursor-not-allowed"
                          : "bg-amber-600 hover:bg-amber-700"
                      }`}
                      style={{ backgroundColor: "var(--color-amber-500)" }}
                    >
                      {currentStep === 0
                        ? "Continuar al Envío"
                        : "Continuar a Confirmación"}
                    </button>
                  ) : (
                    !preferenceId && (
                      <button
                        onClick={handleCheckout}
                        disabled={loading}
                        className={`px-8 py-2 rounded-lg text-white transition-colors ${
                          loading
                            ? "bg-gray-400 cursor-not-allowed"
                            : "bg-amber-600 hover:bg-amber-700"
                        }`}
                      >
                        {loading ? "Procesando..." : "Proceder al Pago"}
                      </button>
                    )
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <OrderSummary
              cart={carrito}
              shippingData={shippingData}
              subtotal={subtotal}
              shipping={shipping}
              total={total}
            />
          </div>
        </div>
      </div>
    </section>
  );
}

export default MultiStepCheckout;