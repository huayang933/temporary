<script setup lang="ts">
import { ref } from 'vue'
import InfluencersTable from './widgets/InfluencersTable.vue'
import EditInfluencerForm from './widgets/EditInfluencerForm.vue'
import { Influencer } from './types'
import { useInfluencers } from './composables/useInfluencers'
import { useModal, useToast } from 'vuestic-ui'

const doShowEditInfluencerModal = ref(false)

const { influencers, isLoading, filters, pagination, ...influencersApi } = useInfluencers()

const influencerToEdit = ref<Influencer | null>(null)

const showEditInfluencerModal = (influencer: Influencer) => {
  influencerToEdit.value = influencer
  doShowEditInfluencerModal.value = true
}

const showAddInfluencerModal = () => {
  influencerToEdit.value = null
  doShowEditInfluencerModal.value = true
}

const { init: notify } = useToast()

const onInfluencerSaved = async (influencer: Influencer) => {
  if (influencerToEdit.value) {
    await influencersApi.update(influencer)
    notify({
      message: `${influencer.name} has been updated`,
      color: 'success',
    })
  } else {
    await influencersApi.add(influencer)
    notify({
      message: `${influencer.name} has been created`,
      color: 'success',
    })
  }
}

const onInfluencerDelete = async (influencer: Influencer) => {
  await influencersApi.remove(influencer)
  notify({
    message: `${influencer.name} has been deleted`,
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
  <h1 class="page-title">Influencers</h1>

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
        <VaButton @click="showAddInfluencerModal">Add Influencer</VaButton>
      </div>

      <InfluencersTable
        :influencers="influencers"
        :loading="isLoading"
        :pagination="pagination"
        @editInfluencer="showEditInfluencerModal"
        @deleteInfluencer="onInfluencerDelete"
      />
    </VaCardContent>
  </VaCard>

  <VaModal
    v-slot="{ cancel, ok }"
    v-model="doShowEditInfluencerModal"
    size="small"
    mobile-fullscreen
    close-button
    hide-default-actions
    :before-cancel="beforeEditFormModalClose"
  >
    <h1 class="va-h5">{{ influencerToEdit ? 'Edit influencer' : 'Add influencer' }}</h1>
    <EditInfluencerForm
      ref="editFormRef"
      :influencer="influencerToEdit"
      :save-button-label="influencerToEdit ? 'Save' : 'Add'"
      @close="cancel"
      @save="
        (influencer: Influencer) => {
          onInfluencerSaved(influencer)
          ok()
        }
      "
    />
  </VaModal>
</template>
