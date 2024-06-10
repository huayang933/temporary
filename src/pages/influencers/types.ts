export type ZetaRole = 'admin' | 'branchAdmin' | 'teacher' | 'parent'

export type Influencer = {
  name: string
  contact: string
  email: string
  description: string
  socialmedia_id: string
  avatar: File | string | undefined
}
