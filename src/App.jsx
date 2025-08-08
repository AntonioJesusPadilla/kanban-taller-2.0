/**
 * Proyecto: Kanban Taller 2.0
 * Autor: Antonio Jesús Padilla
 * Año: 2025
 */
// Constantes
import { ESTADOS } from './constants/estados'

// Importamos React y los hooks necesarios
import { useEffect, useState } from 'react'
import { Routes, Route, Navigate, Link } from 'react-router-dom'
import { db, auth } from './firebase/config'
import { onAuthStateChanged } from 'firebase/auth'
import { toast } from 'react-hot-toast'

// Importamos componentes necesarios
import Login from './components/Login'
import Register from './components/Register'
import Logout from './components/Logout'
import FormularioRegistro from './components/FormularioRegistro'
import TableroKanban from './components/TableroKanban'
import EntregadosHoy from './pages/EntregadosHoy'
import Dashboard from './pages/Dashboard'

// Hook personalizado
import { useVehiculos } from './hooks/useVehiculos'
import { set } from 'date-fns'

export default function App() {
  const [cargando, setCargando] = useState(true)
  const [usuario, setUsuario] = useState(null)
  const [modoAuth, setModoAuth] = useState('login')
  const { vehiculos, añadirVehiculo, moverVehiculo, eliminarVehiculo } = useVehiculos(usuario)
  const [errores, setErrores] = useState({})

  
  const [form, setForm] = useState({
    cliente: '',
    matricula: '',
    vehiculo: '',
    descripcion: '',
    tecnico: ''
  })

  // 🔁 Verificar autenticación al cargar la app
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (user) => {
      setUsuario(user)
      setCargando(false)
    })
    return () => unsub()
  }, [])

  // 📝 Manejar cambios en el formulario
  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value })

  // 📤 Enviar nuevo vehículo
  const handleSubmit = async (e) => {
    e.preventDefault()

    const nuevosErrores = {}
    const matriculaRegex = /^\d{4}\s?[B-DF-HJ-NP-TV-Z]{3}$/i

    if (!form.vehiculo) {
      nuevosErrores.vehiculo = "Debes introducir el nombre del vehículo"
      toast.error(nuevosErrores.vehiculo)
    }
    if (!form.matricula) {
      nuevosErrores.matricula = "La matrícula es obligatoria"
      toast.error(nuevosErrores.matricula)
    } else if (!matriculaRegex.test(form.matricula)) {
      nuevosErrores.matricula = "Formato de matrícula incorrecta (ej: 1234 BCD)"
      toast.error(nuevosErrores.matricula)
    }
    if (!form.cliente) {
      nuevosErrores.cliente = "Indica el cliente"
      toast.error(nuevosErrores.cliente)
    }
    if (!form.tecnico) {
      nuevosErrores.tecnico = "Asigna un técnico al vehículo"
      toast.error(nuevosErrores.tecnico)
    }

    setErrores(nuevosErrores)

    if (Object.keys(nuevosErrores).length > 0) return

    try {
      await añadirVehiculo({
        ...form,
        estado: ESTADOS.ENTRADA,
        creadoEn: new Date(),
        creadoPor: usuario.uid // Asignamos el UID del técnico
      })

      //Limpiar formulario
      setForm({
        cliente: '',
        matricula: '',
        vehiculo: '',
        descripcion: '',
        tecnico: ''
      })
      setErrores({})
    } catch (error) {
      console.error("Error al añadir vehículo:", error)
      toast.error("Error al añadir vehículo")
    }
  }


  // 🖼️ Renderizado principal
  return (
        <div className="min-h-screen bg-gray-100 p-6">
          <h1 className="text-3xl font-bold mb-6 text-center">Taller - Gestión de Reparaciones</h1>
          
          {cargando ? (
            <div className="text-center text-gray-600">Cargando...</div>
          ) : !usuario ? ( 
            <>
              {modoAuth === 'login' ? (
                <>
                  <Login onLogin={setUsuario} />
                  <p className="text-center mt-4">
                    ¿No tienes cuenta?{' '}
                    <button className="text-blue-600 underline" onClick={() => setModoAuth('register')}>
                      Regístrate aquí
                    </button>
                  </p>
                </>
              ) : (
                <>
                  <Register onRegister={setUsuario} />
                  <p className="text-center mt-4">
                    ¿Ya tienes cuenta?{' '}
                    <button className="text-blue-600 underline" onClick={() => setModoAuth('login')}>
                      Inicia sesión aquí
                    </button>
                  </p>
                </>
              )}
            </>
          ) : (
            <>
              <Logout onLogout={() => setUsuario(null)} />

              <Routes>
                <Route path="/" element={
                  <>
                    <FormularioRegistro
                      form={form}
                      onChange={handleChange}
                      onSubmit={handleSubmit}
                    />
              
                    <div className="text-center my-4">
                      <Link to="/entregados" className="text-blue-600 underline">
                        Ver entregados hoy
                      </Link>
                      {' | '}
                      <Link to="/dashboard" className="text-blue-600 underline">
                        Dashboard
                      </Link>
                    </div>
                    
                    <TableroKanban
                      vehiculos={vehiculos}
                      estados={Object.values(ESTADOS)} // Convertir objeto a array
                      onMover={moverVehiculo}
                      onEliminar={eliminarVehiculo}
                    />
                  </>
                } />
                <Route path="/entregados" element={<EntregadosHoy uid={usuario.uid}/>} />
                <Route path="/dashboard" element={<Dashboard uid={usuario.uid}/>} />
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </>
          )}
        </div>
  )
}