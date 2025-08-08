import { useState } from 'react'
import { auth } from '../firebase/config'
import { signInWithEmailAndPassword } from 'firebase/auth'
import toast from 'react-hot-toast'

export default function Login({ onLogin }) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const handleLogin = async (e) => {
    e.preventDefault()
    try {
      const result = await signInWithEmailAndPassword(auth, email, password)
      onLogin(result.user)
      toast.success('¡Bienvenido!')
    } catch (error) {
      toast.error("Error al iniciar sesión")
    }
  }

  return (
    <form onSubmit={handleLogin} className="max-w-sm mx-auto bg-white p-6 rounded shadow mt-10">
      <h2 className="text-xl font-bold mb-4">Iniciar sesión</h2>
      <input type="email" placeholder="Correo" value={email} onChange={e => setEmail(e.target.value)} className="p-2 border rounded w-full mb-3" />
      <input type="password" placeholder="Contraseña" value={password} onChange={e => setPassword(e.target.value)} className="p-2 border rounded w-full mb-3" />
      <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded w-full">Entrar</button>
    </form>
  )
}