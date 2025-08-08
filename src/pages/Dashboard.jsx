// src/pages/Dashboard.jsx
import { useEffect, useState, React } from 'react'
import { collection, getDocs, query, where } from 'firebase/firestore'
import { auth, db } from '../firebase/config'
import { ESTADOS } from '../constants/estados'
import { Link } from 'react-router-dom'

export default function Dashboard() {
  const [vehiculos, setVehiculos] = useState([])
  const usuario = auth.currentUser
  const [cargando, setCargando] = useState(true)

  useEffect(() => {
    if (!usuario?.uid) return
    const cargarDatos = async () => {
      try {
        const q = query(
          collection(db, 'vehiculos'),
          where('creadoPor', '==', usuario.uid) // ✅ Filtro por usuario
        )
        const snapshot = await getDocs(q)

        const datos = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }))

        setVehiculos(datos)
      } catch (error) {
        console.error('Error al cargar vehículos:', error)
      } finally {
        setCargando(false)
      }
    }

    cargarDatos()
  }, [usuario?.uid])

  if (cargando) {
    return <div className="min-h-screen flex items-center justify-center">Cargando...</div>
  }

  // Agrupamos por técnico
  const porTecnico = vehiculos.reduce((acc, v) => {
    const tecnico = v.tecnico || 'Sin técnico'
    acc[tecnico] = acc[tecnico] ? acc[tecnico] + 1 : 1
    return acc
  }, {})

  // Conteo por estado
  const porEstado = vehiculos.reduce((acc, v) => {
    const estado = v.estado || 'Desconocido'
    acc[estado] = acc[estado] ? acc[estado] + 1 : 1
    return acc
  }, {})

  // Entregados hoy
  const hoy = new Date().toISOString().slice(0, 10)
  const entregadosHoy = vehiculos.filter(v => {
    // v.entregadoEn es un timestamp de Firestore (serverTimestamp), así que cuidado
    if (!v.entregadoEn) return false

    // Convertir Firestore Timestamp a JS Date (si existe el método toDate)
    const fechaEntregado = v.entregadoEn.toDate ? v.entregadoEn.toDate() : new Date(v.entregadoEn)
    const fechaEntregadoStr = fechaEntregado.toISOString().slice(0, 10)

    return v.estado === ESTADOS.ENTREGA && fechaEntregadoStr === hoy
  }).length

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-6 text-blue-800">📊 Dashboard del Taller</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-8">
        <div className="bg-white p-4 shadow rounded-xl">
          <h2 className="font-semibold text-lg mb-2">Vehículos por Técnico</h2>
          <ul className="text-sm text-gray-700 space-y-1">
            {Object.entries(porTecnico).map(([tecnico, count]) => (
              <li key={tecnico}>
                👨‍🔧 <span className="font-semibold">{tecnico}:</span> {count} vehículos
              </li>
            ))}
          </ul>
        </div>
        <div className="bg-white p-4 shadow rounded-xl">
          <h2 className="font-semibold text-lg mb-2">Vehículos por Estado</h2>
          <ul className="text-sm text-gray-700 space-y-1">
            {Object.entries(porEstado).map(([estado, count]) => (
              <li key={estado}>
                🚗 <span className="font-semibold">{estado}:</span> {count}
              </li>
            ))}
          </ul>
        </div>
        <div className="bg-white p-4 shadow rounded-xl sm:col-span-2">
          <h2 className="font-semibold text-lg mb-2">Entregados Hoy</h2>
          <p className="text-gray-700">✅ Vehículos entregados hoy: <strong>{entregadosHoy}</strong></p>
        </div>
      </div>
      <div className="flex items-center justify-between mb-4">
        <Link
          to="/"
          className="bg-blue-600 text-white px-4 py-2 rounded-lg shadow hover:bg-blue-700 transition"
        >
          ← Volver al tablero
        </Link>
      </div>
    </div>
  )
}
