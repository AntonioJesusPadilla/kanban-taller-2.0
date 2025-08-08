import { auth } from '../firebase/config'
import { signOut } from 'firebase/auth'

export default function Logout({ onLogout }) {
  return (
    <button
      onClick={() => {
        signOut(auth)
        onLogout()
      }}
      className="absolute top-4 right-4 bg-red-600 text-white px-4 py-2 rounded"
    >
      Cerrar sesión
    </button>
  )
}
