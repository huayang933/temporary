import { collection, addDoc, getDocs, updateDoc, deleteDoc, doc } from 'firebase/firestore'
import { db } from './firebase'
import { useCollection } from 'vuefire'
import { Zeta } from '../pages/templates/types'
import { sleep } from '../services/utils'

export const zetas = [] as Zeta[]

// Simulate API calls

const collectionName = 'zetas'

export type Pagination = {
  page: number
  perPage: number
  total: number
}

export type Sorting = {
  sortBy: keyof Zeta | undefined
  sortingOrder: 'asc' | 'desc' | null
}

export type Filters = {
  isActive: boolean
  search: string
}

const getSortItem = (obj: any, sortBy: string) => {
  // if (sortBy === 'projects') {
  //   return obj.projects.map((project: any) => project.project_name).join(', ')
  // }

  return obj[sortBy]
}

export const getZetas = async (filters: Partial<Filters & Pagination & Sorting>) => {
  await sleep(1000)

  // const collectionName = 'zetas'

  // export const getZeta1s = (): any => {
  //   return useCollection(collection(db, collectionName)) as any
  // }

  const { search, sortBy, sortingOrder } = filters
  const querySnapshot = await getDocs(collection(db, 'zetas'))
  // let filteredZetas = querySnapshot.docs.map((doc) => doc.data() as Zeta)
  const documents = [] as any
  querySnapshot.forEach((doc) => {
    documents.push({ id: doc.id, ...doc.data() })
  })
  let filteredZetas = documents

  if (search) {
    filteredZetas = filteredZetas.filter((zeta: Zeta) => zeta.name.toLowerCase().includes(search.toLowerCase()))
  }

  if (sortBy && sortingOrder) {
    filteredZetas = filteredZetas.sort((a, b) => {
      const first = getSortItem(a, sortBy)
      const second = getSortItem(b, sortBy)
      if (first > second) {
        return sortingOrder === 'asc' ? 1 : -1
      }
      if (first < second) {
        return sortingOrder === 'asc' ? -1 : 1
      }
      return 0
    })
  }

  const { page = 1, perPage = 10 } = filters || {}
  return {
    data: filteredZetas.slice((page - 1) * perPage, page * perPage),
    pagination: {
      page,
      perPage,
      total: filteredZetas.length,
    },
  }
}

export const addZeta = async (zeta: Zeta) => {
  await sleep(1000)
  try {
    const docRef = await addDoc(collection(db, collectionName), zeta)
    const { id, ...zetaWithoutId } = zeta // Extract 'id' from zeta if it exists
    return { id: docRef.id, ...zetaWithoutId }
  } catch (error) {
    console.error('Error adding zeta:', error)
    throw error
  }
}

export const updateZeta = async (id: any, zeta: Zeta) => {
  await sleep(1000)
  try {
    const docRef = doc(db, collectionName, id)
    await updateDoc(docRef, zeta)
    return { id, ...zeta }
  } catch (error) {
    console.error('Error updating zeta:', error)
    throw error
  }
}

export const removeZeta = async (id: any) => {
  await sleep(1000)
  try {
    const docRef = doc(db, collectionName, id)
    await deleteDoc(docRef)
  } catch (error) {
    console.error('Error deleting user:', error)
    throw error
  }
}
