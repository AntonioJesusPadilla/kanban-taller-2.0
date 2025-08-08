// src/pages/EntregadosHoy.jsx
import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { signOut } from "firebase/auth"
import { db, auth } from '../firebase/config'
import { collection, query, where, getDocs } from 'firebase/firestore'
import { isSameDay } from 'date-fns'
import { ESTADOS } from '../constants/estados'

export default function EntregadosHoy() {
  const [vehiculos, setVehiculos] = useState([])
  const usuario = auth.currentUser
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()

  // 🔐 Cerrar sesión
  const handleLogout = async () => {
    await signOut(auth)
    navigate("/login")
  }

  useEffect(() => {
    if(!usuario?.uid){ 
      setLoading(false)
      return
    }

    const fetchEntregados = async () => {  
      try{
        const q = query(
          collection(db, 'vehiculos'),
          where('estado', '==', ESTADOS.ENTREGA),
          where('creadoPor', '==', usuario.uid)
        )
        const snapshot = await getDocs(q)
        const hoy = new Date()

        const datos = snapshot.docs
          .map(doc => ({ id: doc.id, ...doc.data() }))
          .filter(v => v.entregadoEn && isSameDay(v.entregadoEn.toDate(), hoy))

      setVehiculos(datos)
      } catch (error) {
        console.error("Error al obtener los vehículos entregados:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchEntregados()
  }, [usuario?.uid])

  if (loading) return <p>Cargando...</p>

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-6 text-blue-800">📊 Vehículos entregados hoy</h1>

      {vehiculos.length === 0 ? (
        <p className="text-gray-500">No hay entregas hoy.</p>
      ) : (
        vehiculos.map(v => (
          <div key={v.id} className="bg-white rounded-lg shadow p-4 mb-4">
            <h2 className="font-semibold text-lg">{v.vehiculo} - {v.matricula}</h2>
            <p>Cliente: {v.cliente}</p>
            <p>Técnico: {v.tecnico}</p>
            <p className="text-sm text-gray-500">
              Entregado: {v.entregadoEn?.toDate().toLocaleString()}
            </p>
          </div>
        ))
      )}
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