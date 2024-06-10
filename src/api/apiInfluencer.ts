import { collection, addDoc, setDoc, getDocs, updateDoc, deleteDoc, doc } from 'firebase/firestore'
import { db, app } from './firebase'
import { Influencer } from '../pages/influencers/types'
import { sleep } from '../services/utils'
import { StorageReference, getStorage, ref as storageRef, uploadBytes } from 'firebase/storage';
import { v4 as uuidv4 } from 'uuid';

export const influencers = [] as Influencer[]

// Simulate API calls

const collectionName = 'influencers'

export type Pagination = {
  page: number
  perPage: number
  total: number
}

export type Sorting = {
  sortBy: keyof Influencer | undefined
  sortingOrder: 'asc' | 'desc' | null
}

export type Filters = {
  isActive: boolean
  search: string
}

const getSortItem = (obj: any, sortBy: string) => {
  // if (sortBy === 'projects') {
  //   return obj.projects.map((project: any) => project.project_name).join(', ')
  // }

  return obj[sortBy]
}

export const getInfluencers = async (filters: Partial<Filters & Pagination & Sorting>) => {
  // await sleep(1000)

  // const collectionName = 'influencers'

  // export const getInfluencer1s = (): any => {
  //   return useCollection(collection(db, collectionName)) as any
  // }

  const { search, sortBy, sortingOrder } = filters
  const querySnapshot = await getDocs(collection(db, 'influencers'))
  // let filteredInfluencers = querySnapshot.docs.map((doc) => doc.data() as Influencer)
  const documents = [] as any
  querySnapshot.forEach((doc) => {
    documents.push({ id: doc.id, ...doc.data() })
  })
  let filteredInfluencers = documents

  if (search) {
    filteredInfluencers = filteredInfluencers.filter((influencer: Influencer) =>
      influencer.name.toLowerCase().includes(search.toLowerCase()),
    )
  }

  if (sortBy && sortingOrder) {
    filteredInfluencers = filteredInfluencers.sort((a: Influencer, b: Influencer) => {
      const first = getSortItem(a, sortBy)
      const second = getSortItem(b, sortBy)
      if (first > second) {
        return sortingOrder === 'asc' ? 1 : -1
      }
      if (first < second) {
        return sortingOrder === 'asc' ? -1 : 1
      }
      return 0
    })
  }

  const { page = 1, perPage = 10 } = filters || {}
  return {
    data: filteredInfluencers.slice((page - 1) * perPage, page * perPage),
    pagination: {
      page,
      perPage,
      total: filteredInfluencers.length,
    },
  }
}

export const addInfluencer = async (influencer: Influencer & { id?: string }) => {
  try {
    const storage = getStorage(app);
    let storRef: StorageReference;
    const imageNameUUid = "images/influencer_" + uuidv4();
    const imageFile = influencer.avatar as File;
    storRef = storageRef(storage, imageNameUUid);
    const metadata = {
      contentType: "image/jpeg", // Use the file's actual content type
    };

    influencer.avatar = imageNameUUid;

    // Upload image and add document
    try {
      const snapshot = await uploadBytes(storRef, imageFile, metadata);
      console.log("File uploaded successfully", snapshot);

      const docId = influencer.name;
      const docRef = doc(collection(db, collectionName), docId);
      await setDoc(docRef, influencer);
      
      return influencer;
    } catch (error) {
      console.error("File uploaded or added failed:", error);
      throw error;
    }
  } catch (error) {
    console.error('Error adding influencer:', error);
    throw error;
  }
}


export const updateInfluencer = async (id: any, influencer: Influencer) => {
  await sleep(1000)
  try {
    const docRef = doc(db, collectionName, id)
    await updateDoc(docRef, influencer)
    return { id, ...influencer }
  } catch (error) {
    console.error('Error updating influencer:', error)
    throw error
  }
}

export const removeInfluencer = async (id: any) => {
  await sleep(1000)
  try {
    const docRef = doc(db, collectionName, id)
    await deleteDoc(docRef)
  } catch (error) {
    console.error('Error deleting user:', error)
    throw error
  }
}
