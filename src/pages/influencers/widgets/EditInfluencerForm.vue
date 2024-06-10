<script setup lang="ts">
import { PropType, computed, ref, watch } from 'vue'
import { useForm } from 'vuestic-ui'
import { Influencer } from '../types'
import { validators } from '../../../services/utils'
import UserAvatar from './UserAvatar.vue'

const props = defineProps({
  influencer: {
    type: Object as PropType<Influencer | null>,
    default: null,
  },
  saveButtonLabel: {
    type: String,
    default: 'Save',
  },
})

const defaultNewInfluencer: Influencer = {
  name: 'mark',
  description: 'description',
  avatar: 'asd',
  contact: '1231',
  email: 'asdas@gmail.com',
  socialmedia_id: 'asdas@gmail.com',
}

const newInfluencer = ref<Influencer>({ ...defaultNewInfluencer })

const isFormHasUnsavedChanges = computed(() => {
  return Object.keys(newInfluencer.value).some((key) => {
    return (
      newInfluencer.value[key as keyof Influencer] !==
      (props.influencer ?? defaultNewInfluencer)?.[key as keyof Influencer]
    )
  })
})

defineExpose({
  isFormHasUnsavedChanges,
})

watch(
  () => props.influencer,
  () => {
    if (!props.influencer) {
      return
    }

    newInfluencer.value = {
      ...props.influencer,
    }
  },
  { immediate: true },
)


const form = useForm('add-influencer-form')

const emit = defineEmits(['close', 'save'])

const onSave = () => {
  if (form.validate()) {
    emit('save', newInfluencer.value)
  }
}
</script>

<template>
  <VaForm v-slot="{ isValid }" ref="add-influencer-form"
    class="flex-col justify-start items-start gap-4 inline-flex w-full">
    <pre>{{ newInfluencer }}</pre>

    <VaFileUpload v-model="newInfluencer.avatar" type="single" hide-file-list
      class="self-stretch justify-start items-center gap-4 inline-flex">
        <pre>{{ newInfluencer }}</pre>
      <!-- <UserAvatar :name="newInfluencer.name" :avatar="newInfluencer.avatar" size="large" /> -->
      <!-- <UserAvatar :user="newInfluencer" size="large" /> -->
      <VaButton preset="primary" size="small">Add image</VaButton>
      <VaButton v-if="newInfluencer.avatar" preset="primary" color="danger" size="small" icon="delete" class="z-10"
        @click.stop="newInfluencer.avatar = ''" />
    </VaFileUpload>


    <div class="self-stretch flex-col justify-start items-start gap-4 flex">
      <div class="flex gap-4 flex-col sm:flex-row w-full">
        <VaInput v-model="newInfluencer.name" label="Name" class="w-full sm:w-1/2" :rules="[validators.required]"
          name="name" />

        <VaInput v-model="newInfluencer.contact" label="Contact" class="w-full sm:w-1/2" :rules="[validators.required]"
          name="contact" />
      </div>

      <div class="flex gap-4 flex-col sm:flex-row w-full">
        <VaInput v-model="newInfluencer.email" label="Email" class="w-full sm:w-1/2" :rules="[validators.required]"
          name="email" />

        <VaInput v-model="newInfluencer.socialmedia_id" label="Socialmedia ID" class="w-full sm:w-1/2"
          :rules="[validators.required]" name="socialmedia_id" />
      </div>

      <VaTextarea v-model="newInfluencer.description" label="Description" class="w-full" name="descriptions" />
      <div class="flex gap-2 flex-col-reverse items-stretch justify-end w-full sm:flex-row sm:items-center">
        <VaButton preset="secondary" color="secondary" @click="$emit('close')">Cancel</VaButton>
        <VaButton :disabled="!isValid" @click="onSave">{{ saveButtonLabel }}</VaButton>
      </div>
    </div>
  </VaForm>
</template>
