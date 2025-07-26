import { Package, Truck, MapPin, Clock, Phone, Mail } from "lucide-react"
import { Link } from "react-router-dom";


const Envios = () => {
  return (
    <div >
      <main className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">Políticas de Envío</h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Conoce nuestras opciones de entrega para que recibas tus productos de madera de forma segura y conveniente
            </p>
          </div>

          {/* Opciones de Envío */}
          <div className="grid md:grid-cols-2 gap-8 mb-12">
            {/* Chile Express  */}
            <div className="bg-white rounded-lg border-2 border-amber-200 hover:border-amber-300 transition-colors shadow-sm">
              <div className="p-6 pb-4">
                <div className="flex items-center space-x-3">
                  <Truck className="h-8 w-8 text-[#a47148]" />
                  <div>
                    <h2 className="text-2xl font-semibold text-gray-900">Envío a Domicilio</h2>
                    <p className="text-lg text-gray-600">A través de Chile Express</p>
                  </div>
                </div>
              </div>
              <div className="p-6 pt-0 space-y-4">
                <div className="bg-amber-50 p-4 rounded-lg">
                  <h3 className="font-semibold text-[#a47148] mb-2">¿Cómo funciona?</h3>
                  <p className="text-gray-700">
                    Trabajamos en alianza con Chile Express para garantizar entregas seguras y confiables en todo el
                    país.
                  </p>
                </div>

                <div className="space-y-3">
                  <div className="flex items-start space-x-3">
                    <Clock className="h-5 w-5 text-[#a47148] mt-0.5" />
                    <div>
                      <p className="font-medium text-gray-900">Tiempo de entrega</p>
                      <p className="text-gray-600">2-5 días hábiles según destino</p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-3">
                    <Package className="h-5 w-5 text-[#a47148] mt-0.5" />
                    <div>
                      <p className="font-medium text-gray-900">Embalaje especializado</p>
                      <p className="text-gray-600">Protección especial para productos de madera</p>
                    </div>
                  </div>
                </div>

                <hr className="border-gray-200 my-4" />

                <div className="bg-blue-50 p-4 rounded-lg">
                  <h4 className="font-semibold text-blue-800 mb-2">Tarifas de Envío</h4>
                  <p className="text-gray-700 mb-3">
                    Las tarifas de envío son calculadas directamente por Chile Express según:
                  </p>
                  <ul className="list-disc list-inside space-y-1 text-gray-600">
                    <li>Peso y dimensiones del producto</li>
                    <li>Destino de entrega</li>
                  </ul>
                  <p className="text-sm text-blue-700 mt-3 font-medium">
                    El costo exacto se calculará al momento de finalizar tu compra
                  </p>
                </div>
              </div>
            </div>

            {/* Retiro en tienda */}
            <div className="bg-white rounded-lg border-2 border-green-200 hover:border-green-300 transition-colors shadow-sm">
              <div className="p-6 pb-4">
                <div className="flex items-center space-x-3">
                  <MapPin className="h-8 w-8 text-green-600" />
                  <div>
                    <h2 className="text-2xl font-semibold text-gray-900">Retiro en Casa Matriz</h2>
                    <p className="text-lg text-gray-600">Opción gratuita disponible</p>
                  </div>
                </div>
              </div>
              <div className="p-6 pt-0 space-y-4">
                <div className="bg-green-50 p-4 rounded-lg">
                  <h3 className="font-semibold text-green-800 mb-2">¡Sin costo de envío!</h3>
                  <p className="text-gray-700">
                    Puedes retirar tu pedido directamente en nuestras instalaciones sin costo adicional.
                  </p>
                </div>

                <div className="space-y-3">
                  <div className="flex items-start space-x-3">
                    <Clock className="h-5 w-5 text-green-600 mt-0.5" />
                    <div>
                      <p className="font-medium text-gray-900">Horarios de atención</p>
                      <p className="text-gray-600">Lunes a Viernes: 9:00 - 18:00</p>
                      <p className="text-gray-600">Sábados: 9:00 - 14:00</p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-3">
                    <MapPin className="h-5 w-5 text-green-600 mt-0.5" />
                    <div>
                      <p className="font-medium text-gray-900">Ubicación</p>
                      <p className="text-gray-600"> Los Acacios 589 Villa San Pedro</p>
                      <p className="text-gray-600">Los Alamos, Región del Biobío</p>
                    </div>
                  </div>
                </div>

                <hr className="border-gray-200 my-4" />

                <div className="bg-yellow-50 p-4 rounded-lg">
                  <h4 className="font-semibold text-yellow-800 mb-2">Proceso de Retiro</h4>
                  <ol className="list-decimal list-inside space-y-1 text-gray-700">
                    <li>Realiza tu pedido online</li>
                    <li>Selecciona "Retiro en casa matriz"</li>
                    <li>Te notificaremos cuando sera entregado a Chile Express</li>
                    <li>Presenta tu orden de compra al retirar</li>
                  </ol>
                </div>
              </div>
            </div>
          </div>

          {/* Additional Information */}
          <div className="bg-white rounded-lg border shadow-sm mb-8">
            <div className="p-6 pb-4">
              <h2 className="text-2xl font-semibold text-gray-900">Información Importante</h2>
            </div>
            <div className="p-6 pt-0 space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-semibold text-gray-900 mb-3">Preparación de Pedidos</h3>
                  <ul className="space-y-2 text-gray-600">
                    <li>• Tiempo de preparación: 1-3 días hábiles</li>
                    <li>• Productos personalizados: 5-10 días hábiles</li>
                    <li>• Te notificaremos cuando tu pedido esté listo</li>
                  </ul>
                </div>

                <div>
                  <h3 className="font-semibold text-gray-900 mb-3">Cuidado Especial</h3>
                  <ul className="space-y-2 text-gray-600">
                    <li>• Embalaje protector para productos delicados</li>
                    <li>• Seguimiento en tiempo real</li>
                    <li>• Seguro incluido en todos los envíos</li>
                  </ul>
                </div>
              </div>

              <hr className="border-gray-200 my-4" />
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
export default Envios;