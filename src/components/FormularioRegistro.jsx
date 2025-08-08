import React from 'react'

export default function FormularioRegistro({ form, onChange, onSubmit, errores={} }) {
  const inputBase = "p-2 border rounded"
  const errorClass = "border-red-500"

  return (
     <form onSubmit={onSubmit} className="bg-white max-w-4xl mx-auto mb-8 p-6 rounded shadow">
      <h2 className="text-xl font-semibold mb-4">Registrar vehículo</h2>
      <div className="grid md:grid-cols-2 gap-4">
        <div>
          <input name="cliente" value={form.cliente} onChange={onChange} placeholder="Cliente" className={`${inputBase} ${errores.cliente ? errorClass : ''}`} />
          {errores.cliente && <p className="text-red-500 text-sm mt-1">{errores.cliente}</p>}
        </div>

        <div>
          <input name="matricula" value={form.matricula} onChange={onChange} placeholder="Matrícula" className={`${inputBase} ${errores.matricula ? errorClass : ''}`} />
          {errores.matricula && <p className="text-red-500 text-sm mt-1">{errores.matricula}</p>}
        </div>

        <div>
          <input name="vehiculo" value={form.vehiculo} onChange={onChange} placeholder="Marca / Modelo" className={`${inputBase} ${errores.vehiculo ? errorClass : ''}`} />
          {errores.vehiculo && <p className="text-red-500 text-sm mt-1">{errores.vehiculo}</p>}
        </div>

        <div>
          <input name="tecnico" value={form.tecnico} onChange={onChange} placeholder="Técnico asignado" className={`${inputBase} ${errores.tecnico ? errorClass : ''}`} />
          {errores.tecnico && <p className="text-red-500 text-sm mt-1">{errores.tecnico}</p>}
        </div>

        <div className="col-span-2">
          <textarea name="descripcion" value={form.descripcion} onChange={onChange} placeholder="Descripción del fallo" className="p-2 border rounded w-full" />
        </div>
      </div>
      <button type="submit" className="mt-4 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
        Añadir a entrada
      </button>
    </form>
  )
}