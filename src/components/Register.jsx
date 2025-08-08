// src/components/Register.jsx
import { useState } from 'react'
import { createUserWithEmailAndPassword } from 'firebase/auth'
import { auth } from '../firebase/config'

export default function Register({ onRegister }) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState(null)

  const handleRegister = async (e) => {
    e.preventDefault()
    setError(null)

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password)
      onRegister(userCredential.user)
    } catch (err) {
      console.error('Error al registrar usuario:', err)
      setError('No se pudo registrar. Verifica los datos o usa otro email.')
    }
  }

  return (
    <form onSubmit={handleRegister} className="p-6 bg-white rounded shadow max-w-md mx-auto mt-6">
      <h2 className="text-xl font-bold mb-4 text-center">Registro de usuario</h2>
      <input
        type="email"
        placeholder="Correo electrónico"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
        className="p-2 border w-full rounded mb-3"
      />
      <input
        type="password"
        placeholder="Contraseña"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
        className="p-2 border w-full rounded mb-4"
      />
      {error && <p className="text-red-600 mb-3 text-sm">{error}</p>}
      <button type="submit" className="bg-green-600 text-white w-full px-4 py-2 rounded hover:bg-green-700">
        Crear cuenta
      </button>
    </form>
  )
}
