export type UserRole = 'admin' | 'branchAdmin' | 'teacher' | 'parent'

export type User = {
  id: string
  branchId: string
  name: string
  parentAddress: string
  parentCredit: number
  parentHp: string
  parentName: string
  role: UserRole
}
