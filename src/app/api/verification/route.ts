import { NextResponse } from 'next/server'
import { submitVerification, getVerificationRequests, updateVerificationStatus } from '@/lib/verification/store'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { userId, companyName, profileType, documents } = body

    if (!userId || !companyName || !profileType) {
      return NextResponse.json(
        { error: 'userId, companyName, and profileType are required' },
        { status: 400 }
      )
    }

    if (!['supplier', 'contractor', 'professional'].includes(profileType)) {
      return NextResponse.json(
        { error: 'profileType must be supplier, contractor, or professional' },
        { status: 400 }
      )
    }

    const request_ = submitVerification({
      userId,
      companyName,
      profileType,
      status: 'pending',
      documents: documents || {},
    })

    return NextResponse.json({ request: request_ }, { status: 201 })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to submit verification request' }, { status: 500 })
  }
}

export async function PUT(request: Request) {
  try {
    const body = await request.json()
    const { id, status, reviewedBy, notes } = body

    if (!id || !status || !reviewedBy) {
      return NextResponse.json(
        { error: 'id, status, and reviewedBy are required' },
        { status: 400 }
      )
    }

    if (!['pending', 'under-review', 'approved', 'rejected'].includes(status)) {
      return NextResponse.json(
        { error: 'Invalid status value' },
        { status: 400 }
      )
    }

    const updated = updateVerificationStatus(id, status, reviewedBy, notes)
    return NextResponse.json({ request: updated })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update verification status' }, { status: 500 })
  }
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const status = searchParams.get('status') || undefined

  const requests = getVerificationRequests(status)
  return NextResponse.json({ requests })
}
