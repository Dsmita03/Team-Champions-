/* eslint-disable @typescript-eslint/no-explicit-any */
import { Redis } from '@upstash/redis'
import { NextRequest, NextResponse } from 'next/server'

const redis = Redis.fromEnv()

interface MedicalRecord {
  id: string
  title: string
  type: 'prescription' | 'lab_report' | 'scan' | 'discharge_summary' | 'other'
  date: string
  doctorName: string
  doctorSpeciality: string
  doctorId: string
  patientName: string
  patientPhone: string
  patientEmail: string
  hospitalName?: string
  fileUrl?: string
  fileSize?: string
  notes?: string
  downloadUrl?: string
  appointmentId?: string
  createdAt: string
  updatedAt?: string
}

// Helper function to apply filters
function applyFilters(
  records: MedicalRecord[],
  filters: {
    id?: string | null
    patientEmail?: string | null
    doctorId?: string | null
    type?: string | null
    appointmentId?: string | null
  }
): MedicalRecord[] {
  let filtered = [...records]

  if (filters.id) {
    filtered = filtered.filter((r: MedicalRecord) => r.id === filters.id)
  }
  if (filters.patientEmail) {
    filtered = filtered.filter((r: MedicalRecord) => r.patientEmail === filters.patientEmail)
  }
  if (filters.doctorId) {
    filtered = filtered.filter((r: MedicalRecord) => r.doctorId === filters.doctorId)
  }
  if (filters.type && filters.type !== 'all') {
    filtered = filtered.filter((r: MedicalRecord) => r.type === filters.type)
  }
  if (filters.appointmentId) {
    filtered = filtered.filter((r: MedicalRecord) => r.appointmentId === filters.appointmentId)
  }

  return filtered
}

// GET: Fetch all medical records or filter by query params
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const patientEmail = searchParams.get('patientEmail')
    const doctorId = searchParams.get('doctorId')
    const type = searchParams.get('type')
    const appointmentId = searchParams.get('appointmentId')
    const id = searchParams.get('id')

    console.log('GET /api/medical-records', { patientEmail, doctorId, type })

    // Fetch from Redis (primary storage)
    let records: MedicalRecord[] = []
    try {
      const data = await redis.get('medical_records')
      if (data && typeof data === 'string') {
        records = JSON.parse(data)
      } else if (Array.isArray(data)) {
        records = data
      }
    } catch (err) {
      console.warn('Error reading from Redis:', err)
      records = []
    }

    console.log(`Found ${records.length} total records`)

    // Apply filters
    records = applyFilters(records, { patientEmail, doctorId, type, appointmentId, id })

    // Sort by date (newest first)
    records.sort((a: any, b: any) => {
      return new Date(b.date).getTime() - new Date(a.date).getTime()
    })

    console.log(`Returning ${records.length} filtered records`)

    return NextResponse.json({
      success: true,
      records,
      count: records.length
    })
  } catch (error) {
    console.error('Error reading medical records:', error)
    return NextResponse.json({
      success: false,
      message: 'Failed to read medical records',
      records: []
    }, { status: 500 })
  }
}

// POST: Create a new medical record
export async function POST(req: Request) {
  try {
    const recordData = await req.json()

    console.log('POST /api/medical-records', recordData.title)

    let records: MedicalRecord[] = []
    try {
      const data = await redis.get('medical_records')
      if (data && typeof data === 'string') {
        records = JSON.parse(data)
      } else if (Array.isArray(data)) {
        records = data
      }
    } catch (err) {
      console.warn('Error reading from Redis:', err)
      records = []
    }

    // Validation
    if (!recordData.title || !recordData.type || !recordData.doctorName || !recordData.patientEmail) {
      return NextResponse.json({
        success: false,
        message: 'Missing required fields: title, type, doctorName, patientEmail'
      }, { status: 400 })
    }

    // Create new record with ID
    const record: MedicalRecord = {
      id: recordData.id || `rec_${Date.now()}`,
      title: recordData.title,
      type: recordData.type,
      date: recordData.date || new Date().toISOString(),
      doctorName: recordData.doctorName,
      doctorSpeciality: recordData.doctorSpeciality,
      doctorId: recordData.doctorId,
      patientName: recordData.patientName,
      patientPhone: recordData.patientPhone,
      patientEmail: recordData.patientEmail,
      hospitalName: recordData.hospitalName,
      fileUrl: recordData.fileUrl,
      fileSize: recordData.fileSize,
      notes: recordData.notes,
      downloadUrl: recordData.downloadUrl,
      appointmentId: recordData.appointmentId,
      createdAt: new Date().toISOString()
    }

    records.push(record)
    await redis.set('medical_records', JSON.stringify(records))

    console.log(` Record saved. Total records: ${records.length}`)

    // Invalidate cache for this patient
    try {
      await redis.del(`medical_records:${record.patientEmail}`)
      if (record.doctorId) {
        await redis.del(`medical_records:${record.doctorId}`)
      }
      console.log('Cache invalidated')
    } catch (cacheError) {
      console.warn('Failed to invalidate cache:', cacheError)
    }

    return NextResponse.json({
      success: true,
      message: 'Medical record created successfully',
      record
    }, { status: 201 })
  } catch (error) {
    console.error('Error creating medical record:', error)
    return NextResponse.json({
      success: false,
      message: 'Failed to create medical record',
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}

// PATCH: Update an existing medical record
export async function PATCH(req: Request) {
  try {
    const updates = await req.json()
    const { id, patientEmail, doctorId } = updates

    console.log('PATCH /api/medical-records', id)

    if (!id) {
      return NextResponse.json({
        success: false,
        message: 'Medical record ID is required'
      }, { status: 400 })
    }

    let records: MedicalRecord[] = []
    try {
      const data = await redis.get('medical_records')
      if (data && typeof data === 'string') {
        records = JSON.parse(data)
      } else if (Array.isArray(data)) {
        records = data
      }
    } catch (err) {
      console.warn('Error reading from Redis:', err)
    }

    let recordFound = false
    let updatedRecord: MedicalRecord | null = null

    const updatedRecords = records.map((record: any) => {
      if (record.id === id) {
        recordFound = true
        const updated: MedicalRecord = {
          ...record,
          ...updates,
          updatedAt: new Date().toISOString()
        }
        updatedRecord = updated
        return updated
      }
      return record
    })

    if (!recordFound) {
      return NextResponse.json({
        success: false,
        message: 'Medical record not found'
      }, { status: 404 })
    }

    await redis.set('medical_records', JSON.stringify(updatedRecords))

    console.log('Record updated successfully')

    // Invalidate cache
    try {
      if (patientEmail) {
        await redis.del(`medical_records:${patientEmail}`)
      }
      if (doctorId) {
        await redis.del(`medical_records:${doctorId}`)
      }
    } catch (cacheError) {
      console.warn('Failed to invalidate cache:', cacheError)
    }

    return NextResponse.json({
      success: true,
      message: 'Medical record updated successfully',
      record: updatedRecord
    }, { status: 200 })
  } catch (error) {
    console.error('Error updating medical record:', error)
    return NextResponse.json({
      success: false,
      message: 'Failed to update medical record'
    }, { status: 500 })
  }
}

// DELETE: Delete a medical record
export async function DELETE(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const id = searchParams.get('id')
    const patientEmail = searchParams.get('patientEmail')
    const doctorId = searchParams.get('doctorId')

    console.log('DELETE /api/medical-records', id)

    if (!id) {
      return NextResponse.json({
        success: false,
        message: 'Medical record ID is required'
      }, { status: 400 })
    }

    let records: MedicalRecord[] = []
    try {
      const data = await redis.get('medical_records')
      if (data && typeof data === 'string') {
        records = JSON.parse(data)
      } else if (Array.isArray(data)) {
        records = data
      }
    } catch (err) {
      console.warn('Error reading from Redis:', err)
    }

    const initialLength = records.length
    records = records.filter((record: any) => record.id !== id)

    if (records.length === initialLength) {
      return NextResponse.json({
        success: false,
        message: 'Medical record not found'
      }, { status: 404 })
    }

    await redis.set('medical_records', JSON.stringify(records))

    console.log(` Record deleted. Remaining records: ${records.length}`)

    // Invalidate cache
    try {
      if (patientEmail) {
        await redis.del(`medical_records:${patientEmail}`)
      }
      if (doctorId) {
        await redis.del(`medical_records:${doctorId}`)
      }
    } catch (cacheError) {
      console.warn('Failed to invalidate cache:', cacheError)
    }

    return NextResponse.json({
      success: true,
      message: 'Medical record deleted successfully'
    }, { status: 200 })
  } catch (error) {
    console.error('Error deleting medical record:', error)
    return NextResponse.json({
      success: false,
      message: 'Failed to delete medical record'
    }, { status: 500 })
  }
}
