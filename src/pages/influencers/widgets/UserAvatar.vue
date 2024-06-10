<script setup lang="ts">
import { PropType, onMounted, ref, watch } from 'vue'
import { getStorage, ref as fireStorageRef, getDownloadURL } from 'firebase/storage';
import { app } from '../../../api/firebase';
import { Influencer } from '../types';


const { user } = defineProps({
    user: {
        type: Object as PropType<Influencer>,
        required: true,
    },
    // name: {
    //     type: String,
    //     required: true,
    // },
    // avatar: {
    //     type: Object as PropType<File | String | undefined>,
    //     required: true,
    // },
    size: {
        type: String,
        default: 'medium',
    },
})


const imageUrl = ref<string>('');

const makeAvatarBlobUrl = (avatar: File) => {
    return URL.createObjectURL(avatar)
}

const isFile = (avatar: File | string | undefined): avatar is File => {
    return avatar instanceof File
}

const avatarColor = (userName: string) => {
    const colors = ['primary', '#FFD43A', '#ADFF00', '#262824', 'danger']
    const index = userName.charCodeAt(0) % colors.length
    return colors[index]
}

const loadAvatar = async (avatar: File | string | undefined) => {
    // if (typeof avatar === 'string' && avatar !== '') {
    //     const storage = getStorage(app);
    //     const storageRef = fireStorageRef(storage, avatar);
    //     imageUrl.value = await getDownloadURL(storageRef);
    // }
    // else if (avatar instanceof File) {
    //     imageUrl.value = makeAvatarBlobUrl(avatar as File)
    // } else {
    //     console.log(123);
        
    //     imageUrl.value = ''
    // }
}

onMounted(() => {
    loadAvatar(user.avatar)
});

watch(() => user, (newVal, oldVal) => {
    loadAvatar(user.avatar)
    // Check if the new value is different from the old value
    console.log('456')
});

</script>

<template>
    <VaAvatar :size="size" :src="imageUrl" :fallback-text="user.name[0]" :color="avatarColor(user.name)" />
</template>
