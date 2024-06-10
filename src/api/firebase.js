import { initializeApp } from 'firebase/app'
import { getFirestore } from 'firebase/firestore'

const firebaseConfig = {
  apiKey: 'AIzaSyCtPgT4bBMUzs4Sv4TbNibCR-KHYB8gPEk',
  authDomain: 'zeta-kol.firebaseapp.com',
  projectId: 'zeta-kol',
  storageBucket: 'zeta-kol.appspot.com',
  messagingSenderId: '790007488204',
  appId: '1:790007488204:web:3793b42c35114457aa2c69',
  measurementId: 'G-NVLEVZTGDY',
}

// Initialize Firebase
const app = initializeApp(firebaseConfig)

// Initialize Cloud Firestore and get a reference to the service
const db = getFirestore(app)

export { db, app };
