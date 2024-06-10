export type ZetaRole = 'admin' | 'branchAdmin' | 'teacher' | 'parent'

export type Zeta = {
  name: string
  description: string
  role: ZetaRole
}
