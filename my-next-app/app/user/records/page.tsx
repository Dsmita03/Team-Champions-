/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { ChevronLeft, Download, Eye, FileText, Image as ImageIcon, File, Search, Filter, Calendar, User, X, Pill, AlertCircle, Clock, MapPin } from 'lucide-react'
import BottomNavigation from '../../components/BottomNavigation'

interface MedicalRecord {
  id: string
  title: string
  type: 'prescription' | 'lab_report' | 'scan' | 'discharge_summary' | 'other'
  date: string
  doctorName: string
  doctorSpeciality: string
  hospitalName?: string
  fileUrl?: string
  fileSize?: string
  notes?: string
  downloadUrl?: string
}

interface Prescription {
  id: string
  medications: Array<{
    id: string
    name: string
    dosage: string
    frequency: string
    duration: string
    instructions?: string
  }>
  diagnosis?: string
  symptoms?: string
  labTests?: string
  followUpDate?: string
  additionalNotes?: string
}

const RECORD_TYPES = [
  { value: 'all', label: 'All Records', icon: FileText },
  { value: 'prescription', label: 'Prescriptions', icon: Pill },
  { value: 'lab_report', label: 'Lab Reports', icon: FileText },
  { value: 'scan', label: 'Scans', icon: ImageIcon },
  { value: 'discharge_summary', label: 'Summaries', icon: FileText },
]

export default function MedicalRecordsPage() {
  const [records, setRecords] = useState<MedicalRecord[]>([])
  const [filteredRecords, setFilteredRecords] = useState<MedicalRecord[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedType, setSelectedType] = useState('all')
  const [showFilterModal, setShowFilterModal] = useState(false)
  const [dateFilter, setDateFilter] = useState<'all' | '30days' | '6months' | '1year'>('all')
  const [selectedRecord, setSelectedRecord] = useState<MedicalRecord | null>(null)
  const [prescription, setPrescription] = useState<Prescription | null>(null)

  useEffect(() => {
    fetchMedicalRecords()
  }, [])

  useEffect(() => {
    filterRecords()
  }, [searchQuery, selectedType, dateFilter, records])

  const fetchMedicalRecords = async () => {
    try {
      const userEmail = localStorage.getItem('userEmail')

      if (!userEmail) {
        console.error('User email not found')
        setLoading(false)
        return
      }

      const response = await fetch(`/api/medical-records?patientEmail=${encodeURIComponent(userEmail)}`)

      if (!response.ok) {
        throw new Error(`Failed to fetch: ${response.status}`)
      }

      const data = await response.json()

      if (data.success && Array.isArray(data.records)) {
        setRecords(data.records)
        setFilteredRecords(data.records)
      } else {
        setRecords([])
        setFilteredRecords([])
      }
    } catch (error) {
      console.error('Error fetching medical records:', error)
      setRecords([])
      setFilteredRecords([])
    } finally {
      setLoading(false)
    }
  }

  const filterRecords = () => {
    let filtered = [...records]

    if (selectedType !== 'all') {
      filtered = filtered.filter(record => record.type === selectedType)
    }

    if (searchQuery) {
      filtered = filtered.filter(record =>
        record.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        record.doctorName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        record.doctorSpeciality.toLowerCase().includes(searchQuery.toLowerCase())
      )
    }

    if (dateFilter !== 'all') {
      const now = new Date()
      const filterDate = new Date()

      if (dateFilter === '30days') {
        filterDate.setDate(now.getDate() - 30)
      } else if (dateFilter === '6months') {
        filterDate.setMonth(now.getMonth() - 6)
      } else if (dateFilter === '1year') {
        filterDate.setFullYear(now.getFullYear() - 1)
      }

      filtered = filtered.filter(record => {
        const recordDate = new Date(record.date)
        return recordDate >= filterDate
      })
    }

    setFilteredRecords(filtered)
  }

  const getRecordIcon = (type: string) => {
    switch (type) {
      case 'prescription':
        return <Pill className="w-6 h-6" />
      case 'lab_report':
        return <FileText className="w-6 h-6" />
      case 'scan':
        return <ImageIcon className="w-6 h-6" />
      case 'discharge_summary':
        return <FileText className="w-6 h-6" />
      default:
        return <File className="w-6 h-6" />
    }
  }

  const getRecordColor = (type: string) => {
    switch (type) {
      case 'prescription':
        return 'bg-blue-50 text-blue-600 border-blue-200'
      case 'lab_report':
        return 'bg-green-50 text-green-600 border-green-200'
      case 'scan':
        return 'bg-purple-50 text-purple-600 border-purple-200'
      case 'discharge_summary':
        return 'bg-orange-50 text-orange-600 border-orange-200'
      default:
        return 'bg-gray-50 text-gray-600 border-gray-200'
    }
  }

  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString)
      const options: Intl.DateTimeFormatOptions = {
        month: 'short',
        day: 'numeric',
        year: 'numeric'
      }
      return date.toLocaleDateString('en-US', options)
    } catch {
      return dateString
    }
  }

  const handleViewDetails = async (record: MedicalRecord) => {
    setSelectedRecord(record)
    
    // Fetch prescription data if available
    if (record.type === 'prescription') {
      try {
        const response = await fetch(`/api/prescriptions?id=${record.id}`)
        const data = await response.json()
        if (data.success && data.prescription) {
          setPrescription(data.prescription)
        }
      } catch (error) {
        console.error('Error fetching prescription:', error)
      }
    }
  }

  const handleDownload = async (record: MedicalRecord) => {
    if (record.downloadUrl) {
      window.open(record.downloadUrl, '_blank')
    }
  }

  const handleClearFilters = () => {
    setSearchQuery('')
    setSelectedType('all')
    setDateFilter('all')
  }

  const closeModal = () => {
    setSelectedRecord(null)
    setPrescription(null)
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header */}
      <header className="bg-gradient-to-r from-[#91C8E4] to-[#4682A9] backdrop-blur-md shadow-lg sticky top-0 z-40">
        <div className="px-4 sm:px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <Link href="/user/dashboard">
                <button className="p-2 hover:bg-white/10 rounded-full transition-all duration-200">
                  <ChevronLeft className="w-6 h-6 text-white" />
                </button>
              </Link>
              <h1 className="ml-3 text-lg sm:text-xl font-bold text-white">Medical Records</h1>
            </div>
            <button
              onClick={() => setShowFilterModal(true)}
              className="p-2 hover:bg-white/10 rounded-full transition-all duration-200"
            >
              <Filter className="w-5 h-5 text-white" />
            </button>
          </div>

          {/* Search Bar */}
          <div className="mt-4 relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-[#4682A9]" />
            <input
              type="text"
              placeholder="Search records, doctors, or speciality..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-white rounded-xl border-2 border-white/20 focus:border-white focus:outline-none text-[#4682A9] placeholder-[#4682A9]/50 shadow-sm"
            />
          </div>
        </div>

        {/* Type Filter Tabs */}
        <div className="px-4 pb-4 overflow-x-auto">
          <div className="flex gap-2 min-w-max">
            {RECORD_TYPES.map(type => {
              const Icon = type.icon
              return (
                <button
                  key={type.value}
                  onClick={() => setSelectedType(type.value)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg font-semibold text-sm whitespace-nowrap transition-all duration-300 ${
                    selectedType === type.value
                      ? 'bg-white text-[#4682A9] shadow-md'
                      : 'bg-white/10 text-white hover:bg-white/20'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {type.label}
                </button>
              )
            })}
          </div>
        </div>
      </header>

      {/* Records Summary */}
      <div className="px-4 py-4 bg-white border-b border-gray-200">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-500">Total Records</p>
            <p className="text-2xl font-bold text-[#4682A9]">{filteredRecords.length}</p>
          </div>
          <div className="flex gap-4">
            <div className="text-center">
              <p className="text-xs text-gray-500">This Month</p>
              <p className="text-lg font-bold text-[#749BC2]">
                {filteredRecords.filter(r => {
                  const recordDate = new Date(r.date)
                  const now = new Date()
                  return recordDate.getMonth() === now.getMonth() &&
                    recordDate.getFullYear() === now.getFullYear()
                }).length}
              </p>
            </div>
            <div className="text-center">
              <p className="text-xs text-gray-500">This Year</p>
              <p className="text-lg font-bold text-[#91C8E4]">
                {filteredRecords.filter(r => {
                  const recordDate = new Date(r.date)
                  const now = new Date()
                  return recordDate.getFullYear() === now.getFullYear()
                }).length}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Records List */}
      <div className="flex-1 px-4 py-5 pb-24">
        {loading ? (
          <div className="flex flex-col items-center justify-center h-[60vh]">
            <div className="w-12 h-12 border-4 border-[#91C8E4] border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : filteredRecords.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-[60vh]">
            <div className="w-24 h-24 bg-[#91C8E4]/10 rounded-full flex items-center justify-center mb-6">
              <FileText className="w-12 h-12 text-[#91C8E4]" />
            </div>
            <h2 className="text-xl font-bold text-gray-700 mb-2">No Records Found</h2>
            <p className="text-gray-500 text-center mb-8 max-w-sm">
              {searchQuery || selectedType !== 'all' || dateFilter !== 'all'
                ? 'Try adjusting your filters or search query'
                : 'Your medical records will appear here after your appointments'}
            </p>
            {(searchQuery || selectedType !== 'all' || dateFilter !== 'all') && (
              <button
                onClick={handleClearFilters}
                className="px-6 py-3 bg-[#91C8E4] hover:bg-[#749BC2] text-white font-semibold rounded-xl transition-all"
              >
                Clear Filters
              </button>
            )}
          </div>
        ) : (
          <div className="space-y-4">
            {filteredRecords.map(record => (
              <div
                key={record.id}
                className="bg-white rounded-2xl border border-gray-200 shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden hover:border-[#91C8E4]/50"
              >
                <div className="p-5">
                  {/* Record Header */}
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-start flex-1">
                      {/* Icon */}
                      <div className={`w-12 h-12 rounded-xl flex items-center justify-center mr-4 shrink-0 border ${getRecordColor(record.type)}`}>
                        {getRecordIcon(record.type)}
                      </div>

                      {/* Record Details */}
                      <div className="flex-1">
                        <h3 className="text-lg font-bold text-[#2C5F7C] mb-1">{record.title}</h3>
                        <div className="flex flex-wrap items-center gap-2 text-sm text-gray-600 mb-2">
                          <span className="flex items-center gap-1">
                            <User className="w-4 h-4" />
                            {record.doctorName}
                          </span>
                          <span className="text-gray-400">•</span>
                          <span>{record.doctorSpeciality}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm">
                          <Calendar className="w-4 h-4 text-[#4682A9]" />
                          <span className="text-[#4682A9] font-medium">{formatDate(record.date)}</span>
                          {record.fileSize && (
                            <>
                              <span className="text-gray-400">•</span>
                              <span className="text-gray-500">{record.fileSize}</span>
                            </>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Record Type Badge */}
                    <div className={`px-3 py-1 rounded-lg text-xs font-bold whitespace-nowrap border ${getRecordColor(record.type)}`}>
                      {record.type.replace(/_/g, ' ').toUpperCase()}
                    </div>
                  </div>

                  {/* Notes */}
                  {record.notes && (
                    <div className="bg-[#FFFBDE] rounded-lg p-3 mb-4 border border-[#91C8E4]/20">
                      <p className="text-sm text-[#4682A9] line-clamp-2">{record.notes}</p>
                    </div>
                  )}

                  {/* Action Buttons */}
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => handleViewDetails(record)}
                      className="flex-1 px-4 py-3 bg-gradient-to-r from-[#91C8E4] to-[#4682A9] hover:from-[#749BC2] hover:to-[#4682A9] text-white rounded-xl font-semibold text-sm transition-all duration-300 shadow-md hover:shadow-lg flex items-center justify-center gap-2 transform hover:scale-[1.02]"
                    >
                      <Eye className="w-4 h-4" />
                      View Details
                    </button>
                    {record.downloadUrl && (
                      <button
                        onClick={() => handleDownload(record)}
                        className="px-4 py-3 bg-[#91C8E4]/10 hover:bg-[#91C8E4]/20 text-[#4682A9] rounded-xl font-semibold text-sm border-2 border-[#91C8E4]/30 hover:border-[#91C8E4]/50 transition-all duration-300 flex items-center justify-center gap-2 shadow-sm hover:shadow-md"
                      >
                        <Download className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Details Modal */}
      {selectedRecord && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-end sm:items-center justify-center p-4">
          <div className="bg-white rounded-t-3xl sm:rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto transform transition-all">
            {/* Modal Header */}
            <div className="sticky top-0 bg-gradient-to-r from-[#91C8E4] to-[#4682A9] px-6 py-4 flex items-center justify-between">
              <h2 className="text-xl font-bold text-white">{selectedRecord.title}</h2>
              <button
                onClick={closeModal}
                className="p-2 hover:bg-white/10 rounded-full transition-all"
              >
                {/* <X className="w-6 h-6 text-white" /> */}
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-6 space-y-6">
              {/* Doctor Information */}
              <div className="bg-gray-50 rounded-xl p-4 border border-gray-200">
                <h3 className="text-sm font-semibold text-gray-700 mb-3">Doctor Information</h3>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <User className="w-4 h-4 text-[#4682A9]" />
                    <span className="text-sm text-gray-700">{selectedRecord.doctorName}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Pill className="w-4 h-4 text-[#4682A9]" />
                    <span className="text-sm text-gray-700">{selectedRecord.doctorSpeciality}</span>
                  </div>
                  {selectedRecord.hospitalName && (
                    <div className="flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-[#4682A9]" />
                      <span className="text-sm text-gray-700">{selectedRecord.hospitalName}</span>
                    </div>
                  )}
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-[#4682A9]" />
                    <span className="text-sm text-gray-700">{formatDate(selectedRecord.date)}</span>
                  </div>
                </div>
              </div>

              {/* Record Type Badge */}
              <div>
                <p className="text-xs text-gray-500 mb-2">Record Type</p>
                <div className={`inline-block px-4 py-2 rounded-lg font-semibold border ${getRecordColor(selectedRecord.type)}`}>
                  {selectedRecord.type.replace(/_/g, ' ').toUpperCase()}
                </div>
              </div>

              {/* Notes / Details */}
              {selectedRecord.notes && (
                <div className="bg-[#FFFBDE] rounded-xl p-4 border border-[#91C8E4]/30">
                  <h3 className="text-sm font-semibold text-[#4682A9] mb-2 flex items-center gap-2">
                    <AlertCircle className="w-4 h-4" />
                    Details
                  </h3>
                  <p className="text-sm text-[#4682A9] whitespace-pre-line">{selectedRecord.notes}</p>
                </div>
              )}

              {/* Prescription Section */}
              {selectedRecord.type === 'prescription' && prescription && (
                <div className="bg-blue-50 rounded-xl p-4 border border-blue-200">
                  <h3 className="text-sm font-semibold text-blue-900 mb-4 flex items-center gap-2">
                    <Pill className="w-4 h-4" />
                    Prescription Details
                  </h3>

                  {/* Diagnosis */}
                  {prescription.diagnosis && (
                    <div className="mb-4 pb-4 border-b border-blue-200">
                      <p className="text-xs text-blue-700 font-semibold mb-1">Diagnosis</p>
                      <p className="text-sm text-blue-900">{prescription.diagnosis}</p>
                    </div>
                  )}

                  {/* Symptoms */}
                  {prescription.symptoms && (
                    <div className="mb-4 pb-4 border-b border-blue-200">
                      <p className="text-xs text-blue-700 font-semibold mb-1">Symptoms</p>
                      <p className="text-sm text-blue-900">{prescription.symptoms}</p>
                    </div>
                  )}

                  {/* Medications */}
                  {prescription.medications && prescription.medications.length > 0 && (
                    <div className="mb-4 pb-4 border-b border-blue-200">
                      <p className="text-xs text-blue-700 font-semibold mb-3">Medications</p>
                      <div className="space-y-3">
                        {prescription.medications.map((med, idx) => (
                          <div key={med.id} className="bg-white rounded-lg p-3 border border-blue-100">
                            <div className="flex items-start justify-between mb-2">
                              <div>
                                <p className="font-semibold text-sm text-gray-800">{med.name}</p>
                                <p className="text-xs text-gray-600">{med.dosage}mg</p>
                              </div>
                              <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded">
                                {med.frequency}x/day
                              </span>
                            </div>
                            <div className="flex items-center gap-2 text-xs text-gray-600 mb-1">
                              <Clock className="w-3 h-3" />
                              Duration: {med.duration} days
                            </div>
                            {med.instructions && (
                              <p className="text-xs text-gray-700 bg-gray-50 p-2 rounded">
                                📝 {med.instructions}
                              </p>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Follow-up Date */}
                  {prescription.followUpDate && (
                    <div className="mb-4">
                      <p className="text-xs text-blue-700 font-semibold mb-1">Follow-up Date</p>
                      <p className="text-sm text-blue-900">{formatDate(prescription.followUpDate)}</p>
                    </div>
                  )}

                  {/* Additional Notes */}
                  {prescription.additionalNotes && (
                    <div>
                      <p className="text-xs text-blue-700 font-semibold mb-1">Additional Notes</p>
                      <p className="text-sm text-blue-900">{prescription.additionalNotes}</p>
                    </div>
                  )}
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex gap-3 pt-4 border-t border-gray-200">
                {selectedRecord.downloadUrl && (
                  <button
                    onClick={() => {
                      handleDownload(selectedRecord)
                    }}
                    className="flex-1 px-4 py-3 bg-[#91C8E4]/10 hover:bg-[#91C8E4]/20 text-[#4682A9] rounded-xl font-semibold text-sm border-2 border-[#91C8E4]/30 hover:border-[#91C8E4]/50 transition-all flex items-center justify-center gap-2"
                  >
                    <Download className="w-4 h-4" />
                    Download
                  </button>
                )}
                <button
                  onClick={closeModal}
                  className="flex-1 px-4 py-3 bg-gray-300 hover:bg-gray-200 text-gray-700 rounded-xl font-semibold text-sm transition-all"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Filter Modal */}
      {showFilterModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 flex items-end sm:items-center justify-center p-4">
          <div className="bg-white rounded-t-3xl sm:rounded-2xl shadow-2xl max-w-md w-full p-6 transform transition-all animate-in slide-in-from-bottom sm:slide-in-from-bottom-0">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-[#2C5F7C]">Filter Records</h3>
              <button
                onClick={() => setShowFilterModal(false)}
                className="p-2 hover:bg-gray-100 rounded-full transition-all duration-200"
              >
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>

            {/* Date Filter */}
            <div className="mb-6">
              <p className="text-sm font-semibold text-[#4682A9] mb-3">Time Period</p>
              <div className="space-y-2">
                {[
                  { value: 'all', label: 'All Time' },
                  { value: '30days', label: 'Last 30 Days' },
                  { value: '6months', label: 'Last 6 Months' },
                  { value: '1year', label: 'Last Year' },
                ].map(option => (
                  <button
                    key={option.value}
                    onClick={() => {
                      setDateFilter(option.value as any)
                      setShowFilterModal(false)
                    }}
                    className={`w-full px-4 py-3 rounded-xl font-semibold text-sm text-left transition-all duration-300 ${
                      dateFilter === option.value
                        ? 'bg-gradient-to-r from-[#91C8E4] to-[#4682A9] text-white shadow-md'
                        : 'bg-gray-50 text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Apply Button */}
            <button
              onClick={() => setShowFilterModal(false)}
              className="w-full px-4 py-3 bg-gradient-to-r from-[#91C8E4] to-[#4682A9] hover:from-[#749BC2] hover:to-[#4682A9] text-white rounded-xl font-semibold shadow-md hover:shadow-lg transition-all duration-300"
            >
              Apply Filters
            </button>
          </div>
        </div>
      )}

      <BottomNavigation activeTab="records" />
    </div>
  )
}
