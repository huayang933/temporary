<script setup lang="ts">
import { defineVaDataTableColumns, useModal } from 'vuestic-ui'
import { User } from '../types'
import { PropType, computed, toRef } from 'vue'
import { Pagination } from '../../../data/pages/users'

const columns = defineVaDataTableColumns([
  { label: 'Name', key: 'name', sortable: true },
  { label: 'Role', key: 'role', sortable: true },
  { label: ' ', key: 'actions', align: 'right' },
])

const props = defineProps({
  users: {
    type: Array as PropType<User[]>,
    required: true,
  },
  loading: { type: Boolean, default: false },
  pagination: { type: Object as PropType<Pagination>, required: true },
})

const emit = defineEmits<{
  (event: 'edit-user', user: User): void
  (event: 'delete-user', user: User): void
}>()

const users = toRef(props, 'users')

const totalPages = computed(() => Math.ceil(props.pagination.total / props.pagination.perPage))

const { confirm } = useModal()

const onUserDelete = async (user: User) => {
  const agreed = await confirm({
    title: 'Delete user',
    message: `Are you sure you want to delete ${user.name}?`,
    okText: 'Delete',
    cancelText: 'Cancel',
    size: 'small',
    maxWidth: '380px',
  })

  if (agreed) {
    emit('delete-user', user)
  }
}
</script>

<template>
  <VaDataTable :columns="columns" :items="users" :loading="$props.loading">
    <template #cell(actions)="{ rowData: user }">
      <div class="flex gap-2 justify-end">
        <VaButton
          preset="primary"
          size="small"
          color="primary"
          icon="mso-edit"
          aria-label="Edit project"
          @click="$emit('edit', user as User)"
        />
        <VaButton
          preset="primary"
          size="small"
          icon="mso-delete"
          color="danger"
          aria-label="Delete project"
          @click="$emit('delete', user as User)"
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
