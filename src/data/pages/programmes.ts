import { sleep } from '../../services/utils'
import { Programme } from './../../pages/programmes/types'
import programmesDb from './programmes-db.json'
import projectsDb from './projects-db.json'
import { Project } from '../../pages/projects/types'

// zeta: get programme data
export const programmes = programmesDb as Programme[]

const getProgrammeProjects = (programmeId: number | string) => {
  return projectsDb
    .filter((project) => project.team.includes(Number(programmeId)))
    .map((project) => ({
      ...project,
      project_owner: programmes.find((programme) => programme.id === project.project_owner)!,
      team: project.team.map((programmeId) => programmes.find((programme) => programme.id === programmeId)!),
      status: project.status as Project['status'],
    }))
}

// Simulate API calls

export type Pagination = {
  page: number
  perPage: number
  total: number
}

export type Sorting = {
  sortBy: keyof Programme | undefined
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

export const getProgrammes = async (filters: Partial<Filters & Pagination & Sorting>) => {
  await sleep(1000)
  const { isActive, search, sortBy, sortingOrder } = filters
  let filteredProgrammes = programmes

  if (search) {
    filteredProgrammes = filteredProgrammes.filter((programme) =>
      programme.name.toLowerCase().includes(search.toLowerCase()),
    )
  }

  filteredProgrammes = filteredProgrammes.map((programme) => ({
    ...programme,
    projects: getProgrammeProjects(programme.id),
  }))

  if (sortBy && sortingOrder) {
    filteredProgrammes = filteredProgrammes.sort((a, b) => {
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
    data: filteredProgrammes.slice((page - 1) * perPage, page * perPage),
    pagination: {
      page,
      perPage,
      total: filteredProgrammes.length,
    },
  }
}

export const addProgramme = async (programme: Programme) => {
  await sleep(1000)
  programmes.unshift(programme)
}

export const updateProgramme = async (programme: Programme) => {
  await sleep(1000)
  const index = programmes.findIndex((u) => u.id === programme.id)
  programmes[index] = programme
}

export const removeProgramme = async (programme: Programme) => {
  await sleep(1000)
  programmes.splice(
    programmes.findIndex((u) => u.id === programme.id),
    1,
  )
}
