// components/AddressSelector.jsx
import { useState } from 'react';
import { MapPin, Plus, Check } from 'lucide-react';

const AddressSelector = ({ 
  addresses, 
  selectedAddressId, 
  onSelectAddress, 
  onShowForm,
  loading 
}) => {
  if (loading) {
    return (
      <div className="space-y-6">
        <h3 className="text-lg font-semibold text-gray-900">Selecciona una dirección</h3>
        <div className="text-center py-4">
          <p className="text-amber-700">Cargando direcciones...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900">
          Selecciona una dirección de envío
        </h3>
        <button
          onClick={onShowForm}
          className="flex items-center gap-2 text-amber-600 hover:text-amber-700 text-sm font-medium"
        >
          <Plus className="w-4 h-4" />
          Nueva dirección
        </button>
      </div>

      <div className="grid gap-3">
        {addresses.map((address) => (
          <div
            key={address.id_direccion}
            onClick={() => onSelectAddress(address)}
            className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${
              selectedAddressId === address.id_direccion
                ? 'border-amber-500 bg-amber-50'
                : 'border-gray-200 hover:border-amber-300'
            }`}
          >
            <div className="flex items-start justify-between">
              <div className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-gray-400 mt-0.5" />
                <div>
                  <p className="font-medium text-gray-900">
                    {address.calle} {address.numero}
                  </p>
                  <p className="text-sm text-gray-600">
                    {address.comuna}, {address.region}
                  </p>
                  <p className="text-sm text-gray-500">
                    Código postal: {address.codigo_postal}
                  </p>
                </div>
              </div>
              {selectedAddressId === address.id_direccion && (
                <Check className="w-5 h-5 text-amber-600" />
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AddressSelector;