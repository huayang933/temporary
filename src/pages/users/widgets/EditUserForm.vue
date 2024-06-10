<script setup lang="ts">
import { PropType, computed, ref, watch } from 'vue'
import { useForm } from 'vuestic-ui'
import { User, UserRole } from '../types'
import { validators } from '../../../services/utils'

const props = defineProps({
  user: {
    type: Object as PropType<User | null>,
    default: null,
  },
  saveButtonLabel: {
    type: String,
    default: 'Save',
  },
})

const defaultNewUser: User = {
  id: '',
  branchId: 'asdasdwe',
  name: 'mark',
  parentAddress: 'taman jaya',
  parentCredit: 0,
  parentHp: '01646568',
  parentName: 'parent name',
  role: 'admin',
}

const newUser = ref<User>({ ...defaultNewUser })

const isFormHasUnsavedChanges = computed(() => {
  return Object.keys(newUser.value).some((key) => {
    return newUser.value[key as keyof User] !== (props.user ?? defaultNewUser)?.[key as keyof User]
  })
})

defineExpose({
  isFormHasUnsavedChanges,
})

watch(
  () => props.user,
  () => {
    if (!props.user) {
      return
    }

    newUser.value = {
      ...props.user,
    }
  },
  { immediate: true },
)

const form = useForm('add-user-form')

const emit = defineEmits(['close', 'save'])

const onSave = () => {
  if (form.validate()) {
    emit('save', newUser.value)
  }
}

const roleSelectOptions: { text: Capitalize<UserRole>; value: UserRole }[] = [
  { text: 'Admin', value: 'admin' },
  { text: 'BranchAdmin', value: 'branchAdmin' },
  { text: 'Teacher', value: 'teacher' },
  { text: 'Parent', value: 'parent' },
]
</script>

<template>
  <VaForm v-slot="{ isValid }" ref="add-user-form" class="flex-col justify-start items-start gap-4 inline-flex w-full">
    <div class="self-stretch flex-col justify-start items-start gap-4 flex">
      <div class="flex gap-4 flex-col sm:flex-row w-full">
        <VaInput
          v-model="newUser.name"
          label="Name"
          class="w-full sm:w-1/2"
          :rules="[validators.required]"
          name="name"
        />
        <VaInput
          v-model="newUser.branchId"
          label="branch Id"
          class="w-full sm:w-1/2"
          :rules="[validators.required]"
          name="branchId"
        />
      </div>
      <div class="flex gap-4 flex-col sm:flex-row w-full">
        <VaInput
          v-model="newUser.parentAddress"
          label="Parent Address"
          class="w-full sm:w-1/2"
          :rules="[validators.required]"
          name="parentAddress"
        />
        <VaInput v-model="newUser.parentCredit" label="Parent credit" class="w-full sm:w-1/2" name="parentCredit" />
      </div>
      <div class="flex gap-4 flex-col sm:flex-row w-full">
        <VaInput
          v-model="newUser.parentHp"
          label="parent Hp"
          class="w-full sm:w-1/2"
          :rules="[validators.required]"
          name="parentHp"
        />
        <VaInput
          v-model="newUser.parentName"
          label="parent Name"
          class="w-full sm:w-1/2"
          :rules="[validators.required]"
          name="parentName"
        />
      </div>

      <div class="flex gap-4 w-full">
        <div class="w-1/2">
          <VaSelect
            v-model="newUser.role"
            label="Role"
            class="w-full"
            :options="roleSelectOptions"
            :rules="[validators.required]"
            name="role"
            value-by="value"
          />
        </div>
      </div>

      <div class="flex gap-2 flex-col-reverse items-stretch justify-end w-full sm:flex-row sm:items-center">
        <VaButton preset="secondary" color="secondary" @click="$emit('close')">Cancel</VaButton>
        <VaButton :disabled="!isValid" @click="onSave">{{ saveButtonLabel }}</VaButton>
      </div>
    </div>
  </VaForm>
</template>
