import { prisma } from "@/lib/prisma"
import type { DirectoryEntity } from "@prisma/client"

const PROFILE_MODEL_MAP: Record<string, string> = {
  supplier: "SupplierProfile",
  contractor: "ContractorProfile",
  professional: "ProfessionalProfile",
}

export function getProfileModelForType(entityType: string): string | null {
  return PROFILE_MODEL_MAP[entityType] ?? null
}

export async function resolveEntityProfile(directory: DirectoryEntity) {
  const modelName = directory.profileModel || getProfileModelForType(directory.entityType)
  if (!modelName || !directory.entityId) {
    return { profile: null, profileModel: null }
  }
  const profile = await (prisma as any)[modelName as keyof typeof prisma]?.findUnique({
    where: { id: directory.entityId },
  })
  return { profile: profile ?? null, profileModel: profile ? modelName : null }
}

export async function resolveEntities(directories: DirectoryEntity[]) {
  return Promise.all(
    directories.map(async (directory) => {
      const { profile, profileModel } = await resolveEntityProfile(directory)
      return { directory, profile, profileModel }
    })
  )
}
