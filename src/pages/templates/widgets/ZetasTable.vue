<script setup lang="ts">
import { defineVaDataTableColumns, useModal } from 'vuestic-ui'
import { Zeta } from '../types'
import { PropType, computed, toRef } from 'vue'
import { Pagination } from '../../../data/pages/users'

const columns = defineVaDataTableColumns([
  { label: 'Name', key: 'name', sortable: true },
  { label: 'Description', key: 'description', sortable: true },
  { label: 'Role', key: 'role', sortable: true },
  { label: ' ', key: 'actions', align: 'right' },
])

const props = defineProps({
  zetas: {
    type: Array as PropType<Zeta[]>,
    required: true,
  },
  loading: { type: Boolean, default: false },
  pagination: { type: Object as PropType<Pagination>, required: true },
})

const emit = defineEmits<{
  (event: 'edit-zeta', zeta: Zeta): void
  (event: 'delete-zeta', zeta: Zeta): void
}>()

const zetas = toRef(props, 'zetas')

const totalPages = computed(() => Math.ceil(props.pagination.total / props.pagination.perPage))

const { confirm } = useModal()

const onZetaDelete = async (zeta: Zeta) => {
  const agreed = await confirm({
    title: 'Delete zeta',
    message: `Are you sure you want to delete ${zeta.name}?`,
    okText: 'Delete',
    cancelText: 'Cancel',
    size: 'small',
    maxWidth: '380px',
  })

  if (agreed) {
    emit('delete-zeta', zeta)
  }
}
</script>

<template>
  <VaDataTable :columns="columns" :items="zetas" :loading="$props.loading">
    <template #cell(actions)="{ rowData: zeta }">
      <div class="flex gap-2 justify-end">
        <VaButton
          preset="primary"
          size="small"
          color="primary"
          icon="mso-edit"
          aria-label="Edit project"
          @click="$emit('edit-zeta', zeta as Zeta)"
        />
        <VaButton
          preset="primary"
          size="small"
          icon="mso-delete"
          color="danger"
          aria-label="Delete project"
          @click="onZetaDelete(zeta as Zeta)"
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
