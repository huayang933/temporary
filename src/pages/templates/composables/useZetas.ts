import { Ref, ref, unref, watch } from 'vue'
import { getZetas, updateZeta, addZeta, removeZeta, type Filters, Pagination, Sorting } from '../../../api/apiZeta'
import { Zeta } from '../types'
import { watchIgnorable } from '@vueuse/core'

const makePaginationRef = () => ref<Pagination>({ page: 1, perPage: 10, total: 0 })
const makeFiltersRef = () => ref<Partial<Filters>>({ isActive: true, search: '' })
const makeSortingRef = () => ref<Sorting>({ sortBy: 'name', sortingOrder: null })

export const useZetas = (options?: {
  pagination?: Ref<Pagination>
  sorting?: Ref<Sorting>
  filters?: Ref<Partial<Filters>>
}) => {
  const isLoading = ref(false)
  const zetas = ref<Zeta[]>([])

  const { filters = makeFiltersRef(), sorting = makeSortingRef(), pagination = makePaginationRef() } = options || {}

  const fetch = async () => {
    isLoading.value = true
    const { data, pagination: newPagination } = await getZetas({
      ...unref(filters),
      ...unref(sorting),
      ...unref(pagination),
    })
    zetas.value = data

    ignoreUpdates(() => {
      pagination.value = newPagination
    })
    isLoading.value = false
  }

  const { ignoreUpdates } = watchIgnorable([pagination, sorting], fetch, { deep: true })

  watch(
    filters,
    () => {
      // Reset pagination to first page when filters changed
      pagination.value.page = 1
      fetch()
    },
    { deep: true },
  )

  fetch()

  return {
    isLoading,

    filters,
    pagination,

    zetas,

    fetch,

    async add(zeta: Zeta) {
      isLoading.value = true
      await addZeta(zeta)
      await fetch()
      isLoading.value = false
    },

    async update(zeta: Zeta) {
      isLoading.value = true
      await updateZeta(zeta.id, zeta)
      await fetch()
      isLoading.value = false
    },

    async remove(zeta: Zeta) {
      isLoading.value = true
      await removeZeta(zeta.id)
      await fetch()
      isLoading.value = false
    },
  }
}
