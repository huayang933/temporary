import { collection, addDoc, updateDoc, deleteDoc, doc } from 'firebase/firestore'
import { useCollection } from 'vuefire'
import { User } from '../pages/users/types'
import usersDb from '../data/pages/users-db.json'
import { sleep } from '../services/utils'

export const users = usersDb as User[]

// Simulate API calls

export type Pagination = {
  page: number
  perPage: number
  total: number
}

export type Sorting = {
  sortBy: keyof User | undefined
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

export const getUsers = async (filters: Partial<Filters & Pagination & Sorting>) => {
  await sleep(1000)

  // const collectionName = 'users'

  // export const getUser1s = (): any => {
  //   return useCollection(collection(db, collectionName)) as any
  // }

  const { search, sortBy, sortingOrder } = filters
  let filteredUsers = users

  if (search) {
    filteredUsers = filteredUsers.filter((user) => user.name.toLowerCase().includes(search.toLowerCase()))
  }

  if (sortBy && sortingOrder) {
    filteredUsers = filteredUsers.sort((a, b) => {
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
    data: filteredUsers.slice((page - 1) * perPage, page * perPage),
    pagination: {
      page,
      perPage,
      total: filteredUsers.length,
    },
  }
}

export const addUser = async (user: User) => {
  await sleep(1000)
  users.unshift(user)
}

export const updateUser = async (user: User) => {
  await sleep(1000)
  const index = users.findIndex((u) => u.id === user.id)
  users[index] = user
}

export const removeUser = async (user: User) => {
  await sleep(1000)
  users.splice(
    users.findIndex((u) => u.id === user.id),
    1,
  )
}
