'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { Search, MapPin, Calendar, Star, Loader2 } from 'lucide-react'
import Link from 'next/link'

// 1. TypeScript Types to ensure safety
type Hospital = {
  name: string
  city: string
}

type Doctor = {
  id: string
  name: string
  specialty: string
  price_per_slot: number
  image_url: string | null
  hospital_id: string
  hospitals: Hospital | null // The joined data
}

export default function SearchPage() {
  const [doctors, setDoctors] = useState<Doctor[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')

  // 2. Fetch Data on Load
  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        // This query fetches Doctors AND their connected Hospital data in one go
        const { data, error } = await supabase
          .from('doctors')
          .select(`
            *,
            hospitals (
              name,
              city
            )
          `)
        
        if (error) throw error
        
        setDoctors(data || [])
      } catch (error) {
        console.error('Error fetching doctors:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchDoctors()
  }, [])

  // 3. Client-side Filtering
  const filteredDoctors = doctors.filter((doc) =>
    doc.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    doc.specialty.toLowerCase().includes(searchTerm.toLowerCase()) ||
    doc.hospitals?.name.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div className="min-h-screen bg-brand-green-50 p-4 md:p-8">
      {/* --- Header & Search Section --- */}
      <div className="max-w-6xl mx-auto mb-8">
        <h1 className="text-3xl font-bold text-brand-purple-900 mb-2">
          Find your Specialist
        </h1>
        <p className="text-gray-600 mb-6">
          Book appointments with top doctors in your city.
        </p>

        <div className="relative max-w-lg">
          <Search className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search by doctor, specialty, or hospital..."
            className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-brand-green-500 shadow-sm"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* --- Results Grid --- */}
      <div className="max-w-6xl mx-auto">
        {loading ? (
          <div className="flex justify-center py-20">
            <Loader2 className="h-10 w-10 text-brand-green-500 animate-spin" />
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredDoctors.map((doc) => (
              <div 
                key={doc.id} 
                className="bg-white rounded-2xl p-5 shadow-sm hover:shadow-md transition-shadow border border-gray-100 flex flex-col"
              >
                {/* Header: Avatar & Rating */}
                <div className="flex justify-between items-start mb-4">
                  <div className="h-16 w-16 rounded-full bg-brand-purple-50 flex items-center justify-center text-brand-purple-500 font-bold text-xl">
                     {/* Fallback initials if no image */}
                    {doc.image_url ? (
                      <img src={doc.image_url} alt={doc.name} className="h-full w-full rounded-full object-cover" />
                    ) : doc.name.charAt(0)}
                  </div>
                  <div className="flex items-center text-yellow-500 text-sm font-medium bg-yellow-50 px-2 py-1 rounded-lg">
                    <Star className="h-3 w-3 mr-1 fill-current" />
                    4.8
                  </div>
                </div>

                {/* Info */}
                <div className="mb-4 flex-grow">
                  <h3 className="font-bold text-lg text-gray-900">{doc.name}</h3>
                  <p className="text-brand-green-700 font-medium text-sm mb-1">{doc.specialty}</p>
                  
                  <div className="flex items-center text-gray-500 text-sm mt-2">
                    <MapPin className="h-3 w-3 mr-1" />
                    {doc.hospitals?.name}, {doc.hospitals?.city}
                  </div>
                </div>

                {/* Footer: Price & Action */}
                <div className="pt-4 border-t border-gray-100 flex items-center justify-between">
                  <div>
                    <span className="text-gray-400 text-xs uppercase font-semibold">Consultation</span>
                    <div className="font-bold text-brand-purple-900">
                      ${(doc.price_per_slot / 100).toFixed(2)}
                    </div>
                  </div>
                  
                  <Link 
                    href={`/booking/${doc.id}`}
                    className="bg-brand-green-500 hover:bg-brand-green-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center"
                  >
                    Book Now
                    <Calendar className="ml-2 h-4 w-4" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}

        {!loading && filteredDoctors.length === 0 && (
          <div className="text-center py-12 text-gray-500">
            No doctors found matching "{searchTerm}"
          </div>
        )}
      </div>
    </div>
  )
}