// Entity type definitions for the Unified Directory Architecture (V3)

export interface EntityTypeDefinition {
  type: string
  label: string
  labelPlural: string
  slug: string
  icon: string
  profileModel: string | null
  description: string
}

export const ENTITY_TYPES: EntityTypeDefinition[] = [
  { type: "supplier", label: "Supplier", labelPlural: "Suppliers", slug: "suppliers", icon: "Store", profileModel: "SupplierProfile", description: "Building material suppliers and product vendors" },
  { type: "contractor", label: "Contractor", labelPlural: "Contractors", slug: "contractors", icon: "HardHat", profileModel: "ContractorProfile", description: "Construction and building contractors" },
  { type: "professional", label: "Professional", labelPlural: "Professionals", slug: "professionals", icon: "PencilRuler", profileModel: "ProfessionalProfile", description: "Architects, engineers, surveyors and design professionals" },
  { type: "architect", label: "Architect", labelPlural: "Architects", slug: "professionals", icon: "PencilRuler", profileModel: null, description: "Architectural design professionals" },
  { type: "engineer", label: "Engineer", labelPlural: "Engineers", slug: "professionals", icon: "HardHat", profileModel: null, description: "Civil, structural and MEP engineers" },
  { type: "surveyor", label: "Surveyor", labelPlural: "Surveyors", slug: "professionals", icon: "Compass", profileModel: null, description: "Quantity surveyors and land surveyors" },
  { type: "service", label: "Service", labelPlural: "Services", slug: "services", icon: "Wrench", profileModel: null, description: "Construction support and maintenance services" },
  { type: "partner", label: "Partner", labelPlural: "Partners", slug: "partners", icon: "Handshake", profileModel: null, description: "Industry partners and collaborators" },
  { type: "hardware-store", label: "Hardware Store", labelPlural: "Hardware Stores", slug: "suppliers", icon: "Store", profileModel: null, description: "Local hardware and building supply stores" },
  { type: "hospitality-service", label: "Hospitality Service", labelPlural: "Hospitality Services", slug: "hospitality", icon: "Building2", profileModel: null, description: "Hospitality industry suppliers and services" },
  { type: "interior-designer", label: "Interior Designer", labelPlural: "Interior Designers", slug: "professionals", icon: "PencilRuler", profileModel: null, description: "Interior design and fit-out professionals" },
  { type: "landscaping", label: "Landscaping", labelPlural: "Landscaping", slug: "services", icon: "Trees", profileModel: null, description: "Landscape design and maintenance services" },
  { type: "hotel", label: "Hotel", labelPlural: "Hotels", slug: "hospitality", icon: "Building2", profileModel: null, description: "Hotels and accommodation providers" },
  { type: "tour-operator", label: "Tour Operator", labelPlural: "Tour Operators", slug: "travel", icon: "Compass", profileModel: null, description: "Tour and travel operators" },
  { type: "developer", label: "Developer", labelPlural: "Developers", slug: "developers", icon: "Building2", profileModel: null, description: "Property developers and real estate developers" },
]

export const ENTITY_TYPE_MAP = new Map(ENTITY_TYPES.map((et) => [et.type, et]))

export function getEntityTypeDef(type: string): EntityTypeDefinition | undefined {
  return ENTITY_TYPE_MAP.get(type)
}

export function getEntityTypeLabel(type: string): string {
  return getEntityTypeDef(type)?.label ?? type
}

export function getEntityTypeLabelPlural(type: string): string {
  return getEntityTypeDef(type)?.labelPlural ?? `${type}s`
}

export function getEntityTypeSlug(type: string): string {
  return getEntityTypeDef(type)?.slug ?? type
}
