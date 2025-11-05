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

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id: recordId } = await context.params
    const cacheKey = `medical_record:${recordId}`

    // Check cache first
    try {
      const cached = await redis.get(cacheKey)
      if (cached) {
        const record = typeof cached === 'string' ? JSON.parse(cached) : cached
        return NextResponse.json({
          success: true,
          record,
          source: 'cache'
        })
      }
    } catch (err) {
      console.warn("Cache read error:", err)
    }

    // Fetch full list from Redis
    const data = await redis.get('medical_records')
    const records: MedicalRecord[] = typeof data === 'string' ? JSON.parse(data) : (data || [])
    const record = records.find(r => r.id === recordId)

    if (!record) {
      return NextResponse.json({
        success: false,
        message: 'Medical record not found'
      }, { status: 404 })
    }

    // Store record in cache for 10 min
    await redis.set(cacheKey, JSON.stringify(record), { ex: 600 })

    return NextResponse.json({
      success: true,
      record,
      source: 'database'
    })
  } catch (error) {
    console.error('Error fetching medical record:', error)
    return NextResponse.json({
      success: false,
      message: 'Failed to fetch medical record'
    }, { status: 500 })
  }
}
