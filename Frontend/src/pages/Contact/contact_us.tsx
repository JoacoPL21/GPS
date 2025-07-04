import React, { useState, useEffect } from 'react';
import { useForm, ValidationError } from '@formspree/react';
import { Mail, Phone, MessageCircle, Send, MapPin, Clock } from 'lucide-react';

const ContactSection = () => {
  const [state, handleSubmit] = useForm("xjkrbkvy");

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleWhatsAppClick = () => {
    const message = encodeURIComponent('Hola! Me interesa conocer más sobre sus artesanías en madera.');
    window.open(`https://wa.me/56945451849?text=${message}`, '_blank');
  };

  useEffect(() => {
    if (state.succeeded) {
      setFormData({ name: '', email: '', subject: '', message: '' });
    }
  }, [state.succeeded]);

  return (
    <section id="contacto" className="py-16 bg-#fff8f0">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-amber-900 mb-4">
            Contáctanos
          </h2>
          <p className="text-lg text-amber-700 max-w-2xl mx-auto">
            ¿No encontraste lo que buscabas? Si necesitas un pedido
            personalizado, estamos aquí para ayudarte. También puedes
            contactarnos por cualquier otra consulta o para obtener más
            información sobre nuestros productos.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Información de contacto */}
          <div className="h-full">
            <div className="bg-white rounded-2xl shadow-lg p-8 border border-amber-100 h-full flex flex-col">
              <h3 className="text-2xl font-bold text-amber-900 mb-6">
                Información de Contacto
              </h3>

              <div className="space-y-6 flex-grow">
                <div className="flex items-center space-x-4">
                  <div className="bg-amber-100 p-3 rounded-full flex-shrink-0">
                    <Phone className="w-6 h-6 text-amber-700" />
                  </div>
                  <div>
                    <p className="font-semibold text-amber-900">Teléfono</p>
                    <p className="text-amber-700">+56 9 1234 5678</p>
                  </div>
                </div>

                <div className="flex items-center space-x-4">
                  <div className="bg-amber-100 p-3 rounded-full flex-shrink-0">
                    <Mail className="w-6 h-6 text-amber-700" />
                  </div>
                  <div>
                    <p className="font-semibold text-amber-900">Email</p>
                    <p className="text-amber-700">
                      contacto@artesaniamadera.cl
                    </p>
                  </div>
                </div>

                <div className="flex items-center space-x-4">
                  <div className="bg-amber-100 p-3 rounded-full flex-shrink-0">
                    <MapPin className="w-6 h-6 text-amber-700" />
                  </div>
                  <div>
                    <p className="font-semibold text-amber-900">Ubicación</p>
                    <p className="text-amber-700">
                      Villarrica, Región de la Araucanía
                    </p>
                  </div>
                </div>

                <div className="flex items-center space-x-4">
                  <div className="bg-amber-100 p-3 rounded-full flex-shrink-0">
                    <Clock className="w-6 h-6 text-amber-700" />
                  </div>
                  <div>
                    <p className="font-semibold text-amber-900">
                      Horario de Atención
                    </p>
                    <p className="text-amber-700">
                      Lunes a Viernes: 9:00 - 18:00
                    </p>
                    <p className="text-amber-700">Sábados: 9:00 - 14:00</p>
                  </div>
                </div>
              </div>

              <div className="mt-8 pt-6 border-t border-amber-200">
                <button
                  onClick={handleWhatsAppClick}
                  className="w-full bg-green-500 hover:bg-green-600 text-white font-semibold py-4 px-6 rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg flex items-center justify-center space-x-3"
                >
                  <MessageCircle className="w-6 h-6" />
                  <span>Chatea con nosotros en WhatsApp</span>
                </button>
              </div>
            </div>
          </div>

          {/* Formulario */}
          <div className="h-full">
            <div className="bg-white rounded-2xl shadow-lg p-8 border border-amber-100 h-full flex flex-col">
              <h3 className="text-2xl font-bold text-amber-900 mb-6">
                Envíanos un Mensaje
              </h3>

              <div className="flex-grow flex flex-col">
                <form
                  onSubmit={handleSubmit}
                  className="space-y-6 flex-grow flex flex-col"
                >
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label
                        htmlFor="name"
                        className="block text-sm font-medium text-amber-900 mb-2"
                      >
                        Nombre Completo *
                      </label>
                      <input
                        type="text"
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        required
                        className="w-full px-4 py-3 border border-amber-200 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                        placeholder="Tu nombre"
                      />
                      <ValidationError
                        prefix="Nombre"
                        field="name"
                        errors={state.errors}
                        className="text-red-600 text-sm mt-1"
                      />
                    </div>

                    <div>
                      <label
                        htmlFor="email"
                        className="block text-sm font-medium text-amber-900 mb-2"
                      >
                        Correo Electrónico *
                      </label>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        required
                        className="w-full px-4 py-3 border border-amber-200 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                        placeholder="tu@email.com"
                      />
                      <ValidationError
                        prefix="Email"
                        field="email"
                        errors={state.errors}
                        className="text-red-600 text-sm mt-1"
                      />
                    </div>
                  </div>

                  <div>
                    <label
                      htmlFor="subject"
                      className="block text-sm font-medium text-amber-900 mb-2"
                    >
                      Asunto *
                    </label>
                    <input
                      type="text"
                      id="subject"
                      name="subject"
                      value={formData.subject}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 border border-amber-200 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                      placeholder="¿En qué podemos ayudarte?"
                    />
                    <ValidationError
                      prefix="Asunto"
                      field="subject"
                      errors={state.errors}
                      className="text-red-600 text-sm mt-1"
                    />
                  </div>

                  <div className="flex-grow">
                    <label
                      htmlFor="message"
                      className="block text-sm font-medium text-amber-900 mb-2"
                    >
                      Mensaje *
                    </label>
                    <textarea
                      id="message"
                      name="message"
                      value={formData.message}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 border border-amber-200 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent resize-none h-32"
                      placeholder="Escribe tu mensaje aquí..."
                    />
                    <ValidationError
                      prefix="Mensaje"
                      field="message"
                      errors={state.errors}
                      className="text-red-600 text-sm mt-1"
                    />
                  </div>

                  {state.succeeded && (
                    <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                      <p className="text-green-700 font-medium">
                        ¡Mensaje enviado exitosamente!
                      </p>
                      <p className="text-green-600 text-sm">
                        Te responderemos pronto.
                      </p>
                    </div>
                  )}

                  <div className="mt-6 pt-6 border-t border-amber-200">
                    <button
                      type="submit"
                      disabled={
                        state.submitting ||
                        !formData.name ||
                        !formData.email ||
                        !formData.subject ||
                        !formData.message
                      }
                      className="w-full bg-amber-600 hover:bg-amber-700 disabled:bg-amber-400 text-white font-semibold py-4 px-6 rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg flex items-center justify-center space-x-2 disabled:cursor-not-allowed disabled:transform-none"
                    >
                      {state.submitting ? (
                        <>
                          <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                          <span>Enviando...</span>
                        </>
                      ) : (
                        <>
                          <Send className="w-5 h-5" />
                          <span>Enviar Mensaje</span>
                        </>
                      )}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContactSection;