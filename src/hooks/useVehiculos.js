// src/hooks/useVehiculos.js
import { ESTADOS } from '../constants/estados'
import { useEffect, useState } from 'react'
import { db, auth } from '../firebase/config'
import { 
  collection,
  addDoc,
  deleteDoc,
  updateDoc,
  doc,
  onSnapshot,
  serverTimestamp,
  orderBy,
  query,
  where,
  Timestamp
 } from 'firebase/firestore'
import { toast } from 'react-hot-toast'

export function useVehiculos(usuario) {
  const [vehiculos, setVehiculos] = useState([])
  const [cargando, setCargando] = useState(true)
     
  // 🔁 Obtener vehículos del técnico autenticado al cargar la app
  useEffect(() => {
    if (!usuario) {
      setVehiculos([])
      setCargando(false)
      return
    }

    const vehiculosRef = collection(db, 'vehiculos')
    const q = query(
      vehiculosRef,
      where('creadoPor', '==', usuario.uid), // Filtramos por el UID del técnico
      orderBy('creado', 'desc')        // Ordenamos por fecha
    )
    
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const datos = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }))
      setVehiculos(datos)
      setCargando(false)
    })

    return () => unsubscribe()
  }, [usuario])

  // 📤 Añadir nuevo vehículo con UID del técnico asociado
  const añadirVehiculo = async (nuevoVehiculo) => {
    const usuario = auth.currentUser

    if (!usuario) {
      toast.error('No hay usuario autenticado')
      return
    }

    
    if (!nuevoVehiculo.vehiculo || !nuevoVehiculo.matricula || !nuevoVehiculo.cliente || !nuevoVehiculo.tecnico || !nuevoVehiculo.descripcion) {
      toast.error('Todos los campos son obligatorios')
      return
    }

     // Regex para matrícula
    const matriculaRegex = /^\d{4}\s?[B-DF-HJ-NP-TV-Z]{3}$/i
    if (!matriculaRegex.test(nuevoVehiculo.matricula)) {
      toast.error('Formato de matrícula incorrecto (ej: 1234 BCD)')
      return
    }
    const vehiculoConUID= {
      ...nuevoVehiculo,
      creadoPor: usuario.uid,
      creado: serverTimestamp(),
      estado: ESTADOS.ENTRADA // Asignamos estado inicial
    }

    try {
      await addDoc(collection(db, 'vehiculos'), vehiculoConUID)
      toast.success('Vehículo añadido correctamente')
    } catch (error) {
      toast.error('Error al añadir el vehículo')
      console.error(error)
    }
  }

  // 🔁 Cambiar estado (columna) 
  const moverVehiculo = async (id, nuevoEstado) => {
    const ref = doc(db, 'vehiculos', id)

    const updateData = {
      estado: nuevoEstado
    }

    if (nuevoEstado === ESTADOS.ENTREGA) {
      updateData.entregadoEn = serverTimestamp() // Añadimos fecha de entrega
    }
    else{
      updateData.entregadoEn = null // Limpiamos fecha de entrega si no es 'entregado'
    }
    
    try {
      await updateDoc(ref, updateData)
      toast.success(`Vehículo movido a ${nuevoEstado}`)
    } catch (error) {
      toast.error('Error al mover el vehículo')
      console.error(error)
    }
  }
  
  // 🗑️ Eliminar vehículo
  const eliminarVehiculo = async (id) => {
    const ref = doc(db, 'vehiculos', id)
    const confirmar = confirm('¿Seguro que deseas eliminar este vehículo?')
    if (!confirmar) return

    try {
      await deleteDoc(ref)
      toast.success('Vehículo eliminado correctamente')
    } catch (error) {
      toast.error('Error al eliminar el vehículo')
      console.error(error)
    }
  }
    
  // 📦 Retornar funciones y estado
  return {vehiculos, añadirVehiculo, moverVehiculo, eliminarVehiculo}
}