// Importa solo lo que uses
import { initializeApp } from 'firebase/app'
import { getFirestore } from 'firebase/firestore'
// Importa las funciones que necesites de Firebase Auth si las usas
import { getAuth } from 'firebase/auth'

// Configuración de Firebase
const firebaseConfig = {
  apiKey: "AIzaSyA63ggbRtxuPN1xlt6AltorRjJ-RmcDPbM",
  authDomain: "mitablerokanbanpersonal.firebaseapp.com",
  projectId: "mitablerokanbanpersonal",
  storageBucket: "mitablerokanbanpersonal.firebasestorage.app",
  messagingSenderId: "9672363478",
  appId: "1:9672363478:web:fa57580e830c40878ce877",
  measurementId: "G-BPK1XFHXSN"
};

// Inicializa Firebase
const app = initializeApp(firebaseConfig)

// Exporta los servicios que vayas a usar
const db = getFirestore(app)
// Si usas autenticación, también exporta auth
const auth = getAuth(app)

export { db, auth }