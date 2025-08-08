import React, { useState } from 'react'

export default function TarjetaVehiculo({ vehiculo, estadoActual, estados, onMover, onEliminar }) {
  const [mostrarModal, setMostrarModal] = useState(false)

  return (
    <div className="bg-blue-100 p-3 rounded mb-3 shadow-sm">
      <div className="font-bold">{vehiculo.vehiculo} — {vehiculo.matricula}</div>
      <div className="text-sm text-gray-700">{vehiculo.descripcion}</div>
      <div className="text-xs text-gray-600 mt-1">
        Cliente: {vehiculo.cliente} <br />
        Técnico: {vehiculo.tecnico}
      </div>
      <div className="flex flex-wrap gap-1 mt-2">
        {estados.filter(e => e !== estadoActual).map(dest => (
          <button
            key={dest}
            onClick={() => onMover(vehiculo.id, dest)}
            className="text-xs bg-blue-500 hover:bg-blue-600 text-white px-2 py-1 rounded"
          >
            ➤ {dest}
          </button>
        ))}
         <button
          onClick={() => setMostrarModal(true)}
          className="text-xs bg-red-500 hover:bg-red-600 text-white px-2 py-1 rounded"
        >
          🗑 Eliminar
        </button>
      </div>
       
      {/* MODAL DE CONFIRMACIÓN */}
      {mostrarModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
          <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-sm">
            <h2 className="text-lg font-semibold mb-2">¿Eliminar vehículo?</h2>
            <p className="text-sm text-gray-700 mb-4">
              ¿Estás seguro de que quieres eliminar <strong>{vehiculo.vehiculo}</strong> con matrícula <strong>{vehiculo.matricula}</strong>?
            </p>

            <div className="flex justify-end gap-3">
              <button
                onClick={() => setMostrarModal(false)}
                className="bg-gray-200 hover:bg-gray-300 text-gray-800 px-4 py-2 rounded"
              >
                Cancelar
              </button>
              <button
                onClick={() => {
                  onEliminar(vehiculo.id)
                  setMostrarModal(false)
                }}
                className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded"
              >
                Eliminar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}