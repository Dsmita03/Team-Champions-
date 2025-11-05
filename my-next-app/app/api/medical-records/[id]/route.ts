 
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
  { params }: { params: { id: string } }
) {
  try {
    const recordId = params.id

    // Check cache first
    const cacheKey = `medical_record:${recordId}`
    try {
      const cachedRecord = await redis.get(cacheKey)
      if (cachedRecord) {
        console.log(`Cache hit for record: ${recordId}`)
        return NextResponse.json({
          success: true,
          record: JSON.parse(cachedRecord as string),
          source: 'cache'
        })
      }
    } catch (cacheError) {
      console.warn('Cache read error:', cacheError)
    }

    // Fetch from Redis
    const records = (await redis.get('medical_records')) as MedicalRecord[] || []
    const record = records.find((r: MedicalRecord) => r.id === recordId)

    if (!record) {
      return NextResponse.json({
        success: false,
        message: 'Medical record not found'
      }, { status: 404 })
    }

    // Cache the record
    try {
      await redis.setex(cacheKey, 600, JSON.stringify(record)) // 10 min cache
    } catch (cacheError) {
      console.warn('Failed to cache record:', cacheError)
    }

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
