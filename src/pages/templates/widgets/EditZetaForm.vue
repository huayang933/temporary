<script setup lang="ts">
import { PropType, computed, ref, watch } from 'vue'
import { useForm } from 'vuestic-ui'
import { Zeta, ZetaRole } from '../types'
import { validators } from '../../../services/utils'

const props = defineProps({
  zeta: {
    type: Object as PropType<Zeta | null>,
    default: null,
  },
  saveButtonLabel: {
    type: String,
    default: 'Save',
  },
})

const defaultNewZeta: Zeta = {
  name: '',
  description: '',
  role: 'admin',
}

const newZeta = ref<Zeta>({ ...defaultNewZeta })

const isFormHasUnsavedChanges = computed(() => {
  return Object.keys(newZeta.value).some((key) => {
    return newZeta.value[key as keyof Zeta] !== (props.zeta ?? defaultNewZeta)?.[key as keyof Zeta]
  })
})

defineExpose({
  isFormHasUnsavedChanges,
})

watch(
  () => props.zeta,
  () => {
    if (!props.zeta) {
      return
    }

    newZeta.value = {
      ...props.zeta,
    }
  },
  { immediate: true },
)

const form = useForm('add-zeta-form')

const emit = defineEmits(['close', 'save'])

const onSave = () => {
  if (form.validate()) {
    emit('save', newZeta.value)
  }
}

const roleSelectOptions: { text: Capitalize<ZetaRole>; value: ZetaRole }[] = [
  { text: 'Admin', value: 'admin' },
  { text: 'BranchAdmin', value: 'branchAdmin' },
  { text: 'Teacher', value: 'teacher' },
  { text: 'Parent', value: 'parent' },
]
</script>

<template>
  <VaForm v-slot="{ isValid }" ref="add-zeta-form" class="flex-col justify-start items-start gap-4 inline-flex w-full">
    <div class="self-stretch flex-col justify-start items-start gap-4 flex">
      <div class="flex gap-4 flex-col sm:flex-row w-full">
        <VaInput
          v-model="newZeta.name"
          label="Name"
          class="w-full sm:w-1/2"
          :rules="[validators.required]"
          name="name"
        />

        <div class="w-1/2">
          <VaSelect
            v-model="newZeta.role"
            label="Role"
            class="w-full"
            :options="roleSelectOptions"
            :rules="[validators.required]"
            name="role"
            value-by="value"
          />
        </div>
      </div>

      <VaTextarea v-model="newZeta.description" label="Description" class="w-full" name="descriptions" />
      <div class="flex gap-2 flex-col-reverse items-stretch justify-end w-full sm:flex-row sm:items-center">
        <VaButton preset="secondary" color="secondary" @click="$emit('close')">Cancel</VaButton>
        <VaButton :disabled="!isValid" @click="onSave">{{ saveButtonLabel }}</VaButton>
      </div>
    </div>
  </VaForm>
</template>
