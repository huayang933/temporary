import { collection, addDoc, updateDoc, deleteDoc, doc } from 'firebase/firestore'
import { db } from './firebase'
import { ref } from 'vue'
import { User } from '../pages/users/types'
import { useCollection } from 'vuefire'

const collectionName = 'users'

export const getUser1s = (): any => {
  return useCollection(collection(db, collectionName)) as any
}

export const addUser = async (user: any) => {
  try {
    const docRef = await addDoc(collection(db, collectionName), user)
    return { id: docRef.id, ...user }
  } catch (error) {
    console.error('Error adding user:', error)
    throw error
  }
}

export const updateUser = async (id: any, user: any) => {
  try {
    const docRef = doc(db, collectionName, id)
    await updateDoc(docRef, user)
    return { id, ...user }
  } catch (error) {
    console.error('Error updating user:', error)
    throw error
  }
}

export const deleteUser = async (id: any) => {
  try {
    const docRef = doc(db, collectionName, id)
    await deleteDoc(docRef)
  } catch (error) {
    console.error('Error deleting user:', error)
    throw error
  }
}
