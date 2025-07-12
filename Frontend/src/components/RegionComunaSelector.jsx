import comunasDataRaw from '../data/comunas.json';
import { useState, useEffect, useMemo } from 'react';

// Transformar comunasDataRaw al formato esperado
function transformComunasData(data) {
  return data.map(regionObj => ({
    nombre: regionObj.region,
    codigo: regionObj.region_number, // o puedes poner un número correlativo si prefieres
    comunas: regionObj.provincias.flatMap(prov =>
      prov.comunas.map(c => ({
        comuna: c.name,
        codigo: c.code
      }))
    )
  }));
}

const comunasData = transformComunasData(comunasDataRaw);

export default function RegionComunaSelector({ value, onChange, regionValue, comunaValue }) {
  const [region, setRegion] = useState(regionValue || '');
  const [comuna, setComuna] = useState(comunaValue || '');

  useEffect(() => {
    setComuna('');
    if (onChange) onChange({ region, comuna: '' });
    // eslint-disable-next-line
  }, [region]);

  useEffect(() => {
    if (onChange) onChange({ region, comuna });
    // eslint-disable-next-line
  }, [comuna]);

  const regiones = comunasData.map(r => ({
    nombre: r.nombre,
    codigo: r.codigo
  }));

  const comunasDeRegion = region
    ? comunasData.find(r => r.codigo === region)?.comunas || []
    : [];

  return (
    <div className="flex gap-4 mb-4">
      <div className="flex-1">
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Región
        </label>
        <select
          value={region}
          onChange={e => setRegion(e.target.value)}
          className="w-full border rounded px-3 py-2"
        >
          <option value="">Selecciona región</option>
          {regiones.map(r => (
            <option key={r.codigo} value={r.codigo}>{r.nombre}</option>
          ))}
        </select>
      </div>
      <div className="flex-1">
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Comuna
        </label>
        <select
          value={comuna}
          onChange={e => setComuna(e.target.value)}
          className="w-full border rounded px-3 py-2"
          disabled={!region}
        >
          <option value="">Selecciona comuna</option>
          {comunasDeRegion.map(c => (
            <option key={c.codigo} value={c.codigo}>{c.comuna}</option>
          ))}
        </select>
      </div>
    </div>
  );
}