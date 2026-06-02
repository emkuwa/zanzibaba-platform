interface VerificationDocument {
  type: keyof VerificationRequest['documents']
  filename: string
  uploadedAt: Date
}

interface VerificationRequest {
  id: string
  userId: string
  companyName: string
  profileType: 'supplier' | 'contractor' | 'professional'
  status: 'pending' | 'under-review' | 'approved' | 'rejected'
  documents: {
    businessLicense?: string
    tin?: string
    companyProfile?: string
    contactInfo?: string
  }
  notes?: string
  reviewedBy?: string
  reviewedAt?: Date
  createdAt: Date
  updatedAt: Date
}

type VerificationStatus = VerificationRequest['status']

const requests: VerificationRequest[] = [
  {
    id: 'VR-001',
    userId: 'USR-001',
    companyName: 'Tanzania Builders Ltd',
    profileType: 'supplier',
    status: 'pending',
    documents: {
      businessLicense: 'license_tz_builders.pdf',
      tin: 'tin_tz_builders.pdf',
    },
    createdAt: new Date('2025-05-28'),
    updatedAt: new Date('2025-05-28'),
  },
  {
    id: 'VR-002',
    userId: 'USR-002',
    companyName: 'Zanzibar Contractors Co',
    profileType: 'contractor',
    status: 'under-review',
    documents: {
      businessLicense: 'license_zanzibar_contractors.pdf',
      tin: 'tin_zanzibar_contractors.pdf',
      companyProfile: 'profile_zanzibar_contractors.pdf',
      contactInfo: 'contact_zanzibar_contractors.pdf',
    },
    reviewedBy: 'Admin Jane',
    reviewedAt: new Date('2025-05-30'),
    createdAt: new Date('2025-05-25'),
    updatedAt: new Date('2025-05-30'),
  },
  {
    id: 'VR-003',
    userId: 'USR-003',
    companyName: 'Dar Es Salaam Supplies Ltd',
    profileType: 'supplier',
    status: 'approved',
    documents: {
      businessLicense: 'license_dar_supplies.pdf',
      tin: 'tin_dar_supplies.pdf',
      companyProfile: 'profile_dar_supplies.pdf',
    },
    reviewedBy: 'Admin John',
    reviewedAt: new Date('2025-05-26'),
    createdAt: new Date('2025-05-20'),
    updatedAt: new Date('2025-05-26'),
  },
  {
    id: 'VR-004',
    userId: 'USR-004',
    companyName: 'Arusha Engineering Works',
    profileType: 'professional',
    status: 'rejected',
    documents: {
      businessLicense: 'license_arusha_eng.pdf',
    },
    notes: 'Business license is expired. Please upload a current valid license.',
    reviewedBy: 'Admin Jane',
    reviewedAt: new Date('2025-05-29'),
    createdAt: new Date('2025-05-22'),
    updatedAt: new Date('2025-05-29'),
  },
  {
    id: 'VR-005',
    userId: 'USR-005',
    companyName: 'Mwanza Construction Group',
    profileType: 'contractor',
    status: 'pending',
    documents: {
      businessLicense: 'license_mwanza.pdf',
      tin: 'tin_mwanza.pdf',
      companyProfile: 'profile_mwanza.pdf',
    },
    createdAt: new Date('2025-06-01'),
    updatedAt: new Date('2025-06-01'),
  },
]

let nextId = 6

export function generateId(): string {
  const num = String(nextId).padStart(3, '0')
  nextId++
  return `VR-${num}`
}

export function submitVerification(
  req: Omit<VerificationRequest, 'id' | 'createdAt' | 'updatedAt'>
): VerificationRequest {
  const newRequest: VerificationRequest = {
    ...req,
    id: generateId(),
    createdAt: new Date(),
    updatedAt: new Date(),
  }
  requests.push(newRequest)
  return newRequest
}

export function getVerificationRequests(status?: string): VerificationRequest[] {
  if (status && status !== 'all') {
    return requests.filter((r) => r.status === status)
  }
  return [...requests]
}

export function getVerificationRequest(id: string): VerificationRequest | undefined {
  return requests.find((r) => r.id === id)
}

export function updateVerificationStatus(
  id: string,
  status: VerificationStatus,
  reviewedBy: string,
  notes?: string
): VerificationRequest {
  const req = requests.find((r) => r.id === id)
  if (!req) throw new Error(`Verification request ${id} not found`)

  req.status = status
  req.reviewedBy = reviewedBy
  req.reviewedAt = new Date()
  req.updatedAt = new Date()
  if (notes !== undefined) req.notes = notes

  return req
}

export function getVerificationStats() {
  return {
    pending: requests.filter((r) => r.status === 'pending').length,
    underReview: requests.filter((r) => r.status === 'under-review').length,
    approved: requests.filter((r) => r.status === 'approved').length,
    rejected: requests.filter((r) => r.status === 'rejected').length,
    total: requests.length,
  }
}

export type { VerificationRequest, VerificationStatus, VerificationDocument }
