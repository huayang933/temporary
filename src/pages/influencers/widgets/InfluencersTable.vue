<script setup lang="ts">
import { defineVaDataTableColumns, useModal } from 'vuestic-ui'
import { Influencer } from '../types'
import UserAvatar from './UserAvatar.vue'
import { PropType, computed, toRef } from 'vue'
import { Pagination } from '../../../data/pages/users'

const columns = defineVaDataTableColumns([
  { label: 'Name', key: 'name', sortable: true },
  { label: 'Contact', key: 'contact', sortable: true },
  { label: 'Email', key: 'email', sortable: true },
  { label: 'Description', key: 'description', sortable: true },
  { label: ' ', key: 'actions', align: 'right' },
])

const props = defineProps({
  influencers: {
    type: Array as PropType<Influencer[]>,
    required: true,
  },
  loading: { type: Boolean, default: false },
  pagination: { type: Object as PropType<Pagination>, required: true },
})

const emit = defineEmits<{
  (event: 'edit-influencer', influencer: Influencer): void
  (event: 'delete-influencer', influencer: Influencer): void
}>()

const influencers = toRef(props, 'influencers')

const totalPages = computed(() => Math.ceil(props.pagination.total / props.pagination.perPage))

const { confirm } = useModal()

const onInfluencerDelete = async (influencer: Influencer) => {
  const agreed = await confirm({
    title: 'Delete influencer',
    message: `Are you sure you want to delete ${influencer.name}?`,
    okText: 'Delete',
    cancelText: 'Cancel',
    size: 'small',
    maxWidth: '380px',
  })

  if (agreed) {
    emit('delete-influencer', influencer)
  }
}
</script>

<template>
  <VaDataTable :columns="columns" :items="influencers" :loading="$props.loading">
    <template #cell(name)="{ rowData }">
      <div class="flex items-center gap-2 max-w-[230px] ellipsis">
        <!-- <UserAvatar :name="rowData.name" :v="rowData.avatar" size="small" /> -->
        <!-- <UserAvatar :user="rowData as Influencer" size="small" /> -->
        {{ rowData.name }}
      </div>
    </template>

    <template #cell(actions)="{ rowData: influencer }">
      <div class="flex gap-2 justify-end">
        <VaButton
          preset="primary"
          size="small"
          color="primary"
          icon="mso-edit"
          aria-label="Edit project"
          @click="$emit('edit-influencer', influencer as Influencer)"
        />
        <VaButton
          preset="primary"
          size="small"
          icon="mso-delete"
          color="danger"
          aria-label="Delete project"
          @click="onInfluencerDelete(influencer as Influencer)"
        />
      </div>
    </template>
  </VaDataTable>

  <div class="flex flex-col-reverse md:flex-row gap-2 justify-between items-center py-2">
    <div>
      <b>{{ $props.pagination.total }} results.</b>
      Results per page
      <VaSelect v-model="$props.pagination.perPage" class="!w-20" :options="[10, 50, 100]" />
    </div>

    <div v-if="totalPages > 1" class="flex">
      <VaButton
        preset="secondary"
        icon="va-arrow-left"
        aria-label="Previous page"
        :disabled="$props.pagination.page === 1"
        @click="$props.pagination.page--"
      />
      <VaButton
        class="mr-2"
        preset="secondary"
        icon="va-arrow-right"
        aria-label="Next page"
        :disabled="$props.pagination.page === totalPages"
        @click="$props.pagination.page++"
      />
      <VaPagination
        v-model="$props.pagination.page"
        buttons-preset="secondary"
        :pages="totalPages"
        :visible-pages="5"
        :boundary-links="false"
        :direction-links="false"
      />
    </div>
  </div>
</template>

<style lang="scss" scoped>
.va-data-table {
  ::v-deep(.va-data-table__table-tr) {
    border-bottom: 1px solid var(--va-background-border);
  }
}
</style>
