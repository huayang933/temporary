<script setup lang="ts">
import { ref } from 'vue'
import ZetasTable from './widgets/ZetasTable.vue'
import EditZetaForm from './widgets/EditZetaForm.vue'
import { Zeta } from './types'
import { useZetas } from './composables/useZetas'
import { useModal, useToast } from 'vuestic-ui'

const doShowEditZetaModal = ref(false)

const { zetas, isLoading, filters, pagination, ...zetasApi } = useZetas()

const zetaToEdit = ref<Zeta | null>(null)

const showEditZetaModal = (zeta: Zeta) => {
  zetaToEdit.value = zeta
  doShowEditZetaModal.value = true
}

const showAddZetaModal = () => {
  zetaToEdit.value = null
  doShowEditZetaModal.value = true
}

const { init: notify } = useToast()

const onZetaSaved = async (zeta: Zeta) => {
  if (zetaToEdit.value) {
    await zetasApi.update(zeta)
    notify({
      message: `${zeta.name} has been updated`,
      color: 'success',
    })
  } else {
    await zetasApi.add(zeta)
    notify({
      message: `${zeta.name} has been created`,
      color: 'success',
    })
  }
}

const onZetaDelete = async (zeta: Zeta) => {
  await zetasApi.remove(zeta)
  notify({
    message: `${zeta.name} has been deleted`,
    color: 'success',
  })
}

const editFormRef = ref()

const { confirm } = useModal()

const beforeEditFormModalClose = async (hide: () => unknown) => {
  if (editFormRef.value.isFormHasUnsavedChanges) {
    const agreed = await confirm({
      maxWidth: '380px',
      message: 'Form has unsaved changes. Are you sure you want to close it?',
      size: 'small',
    })
    if (agreed) {
      hide()
    }
  } else {
    hide()
  }
}
</script>

<template>
  <h1 class="page-title">Zetas</h1>

  <VaCard>
    <VaCardContent>
      <div class="flex flex-col md:flex-row gap-2 mb-2 justify-between">
        <div class="flex flex-col md:flex-row gap-2 justify-start">
          <VaButtonToggle
            v-model="filters.isActive"
            color="background-element"
            border-color="background-element"
            :options="[
              { label: 'Active', value: true },
              { label: 'Inactive', value: false },
            ]"
          />
          <VaInput v-model="filters.search" placeholder="Search">
            <template #prependInner>
              <VaIcon name="search" color="secondary" size="small" />
            </template>
          </VaInput>
        </div>
        <VaButton @click="showAddZetaModal">Add Zeta</VaButton>
      </div>

      <ZetasTable
        :zetas="zetas"
        :loading="isLoading"
        :pagination="pagination"
        @editZeta="showEditZetaModal"
        @deleteZeta="onZetaDelete"
      />
    </VaCardContent>
  </VaCard>

  <VaModal
    v-slot="{ cancel, ok }"
    v-model="doShowEditZetaModal"
    size="small"
    mobile-fullscreen
    close-button
    hide-default-actions
    :before-cancel="beforeEditFormModalClose"
  >
    <h1 class="va-h5">{{ zetaToEdit ? 'Edit zeta' : 'Add zeta' }}</h1>
    <EditZetaForm
      ref="editFormRef"
      :zeta="zetaToEdit"
      :save-button-label="zetaToEdit ? 'Save' : 'Add'"
      @close="cancel"
      @save="
        (zeta: Zeta) => {
          onZetaSaved(zeta)
          ok()
        }
      "
    />
  </VaModal>
</template>
