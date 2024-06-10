import { sleep } from '../../services/utils'
import { Student } from './../../pages/students/types'

export const students = [] as Student[]
// here is testing

// Simulate API calls

export type Pagination = {
  page: number
  perPage: number
  total: number
}

export type Sorting = {
  sortBy: keyof Student | undefined
  sortingOrder: 'asc' | 'desc' | null
}

export type Filters = {
  isActive: boolean
  search: string
}

const getSortItem = (obj: any, sortBy: string) => {
  if (sortBy === 'projects') {
    return obj.projects.map((project: any) => project.project_name).join(', ')
  }

  return obj[sortBy]
}

export const getStudents = async (filters: Partial<Filters & Pagination & Sorting>) => {
  await sleep(1000)
  const { isActive, search, sortBy, sortingOrder } = filters
  let filteredStudents = students

  if (search) {
    filteredStudents = filteredStudents.filter((student) => student.name.toLowerCase().includes(search.toLowerCase()))
  }

  if (sortBy && sortingOrder) {
    filteredStudents = filteredStudents.sort((a, b) => {
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
    data: filteredStudents.slice((page - 1) * perPage, page * perPage),
    pagination: {
      page,
      perPage,
      total: filteredStudents.length,
    },
  }
}

export const addStudent = async (student: Student) => {
  await sleep(1000)
  students.unshift(student)
}

export const updateStudent = async (student: Student) => {
  await sleep(1000)
  const index = students.findIndex((u) => u.id === student.id)
  students[index] = student
}

export const removeStudent = async (student: Student) => {
  await sleep(1000)
  students.splice(
    students.findIndex((u) => u.id === student.id),
    1,
  )
}
