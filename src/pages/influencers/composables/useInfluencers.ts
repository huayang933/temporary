import { Ref, ref, unref, watch } from 'vue'
import {
  getInfluencers,
  updateInfluencer,
  addInfluencer,
  removeInfluencer,
  type Filters,
  Pagination,
  Sorting,
} from '../../../api/apiInfluencer'
import { Influencer } from '../types'
import { watchIgnorable } from '@vueuse/core'

const makePaginationRef = () => ref<Pagination>({ page: 1, perPage: 10, total: 0 })
const makeFiltersRef = () => ref<Partial<Filters>>({ isActive: true, search: '' })
const makeSortingRef = () => ref<Sorting>({ sortBy: 'name', sortingOrder: null })

export const useInfluencers = (options?: {
  pagination?: Ref<Pagination>
  sorting?: Ref<Sorting>
  filters?: Ref<Partial<Filters>>
}) => {
  const isLoading = ref(false)
  const influencers = ref<Influencer[]>([])

  const { filters = makeFiltersRef(), sorting = makeSortingRef(), pagination = makePaginationRef() } = options || {}

  const fetch = async () => {
    isLoading.value = true
    const { data, pagination: newPagination } = await getInfluencers({
      ...unref(filters),
      ...unref(sorting),
      ...unref(pagination),
    })
    influencers.value = data

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

    influencers,

    fetch,

    async add(influencer: Influencer) {
      isLoading.value = true
      await addInfluencer(influencer)
      await fetch()
      isLoading.value = false
    },

    async update(influencer: Influencer & { id: string }) {
      isLoading.value = true
      await updateInfluencer(influencer.id, influencer)
      await fetch()
      isLoading.value = false
    },

    async remove(influencer: Influencer & { id: string }) {
      isLoading.value = true
      await removeInfluencer(influencer.id)
      await fetch()
      isLoading.value = false
    },
  }
}
