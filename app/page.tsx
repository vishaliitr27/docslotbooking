'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import { 
  Search, MapPin, HeartPulse, Stethoscope, 
  History, ShieldCheck, Menu, X, Loader2, Star, 
  ChevronDown, Phone, Mail, Globe 
} from 'lucide-react'

// Types
type Doctor = {
  id: string
  name: string
  specialty: string
  price: number
  image_url: string | null
  hospitals: {
    name: string
    city: string
  }
}

export default function HomePage() {
  const router = useRouter()
  
  // --- STATE ---
  const [user, setUser] = useState<any>(null)
  const [profile, setProfile] = useState<any>(null)
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false)

  // Search & Data State
  const [searchTerm, setSearchTerm] = useState('')
  const [location, setLocation] = useState('')
  const [doctors, setDoctors] = useState<Doctor[]>([])
  const [loading, setLoading] = useState(false)
  const [bookingDoc, setBookingDoc] = useState<Doctor | null>(null) // For Modal

  // --- INITIAL LOAD ---
  useEffect(() => {
    const init = async () => {
      // 1. Check User
      const { data: { user } } = await supabase.auth.getUser()
      setUser(user)
      if(user) {
        const { data } = await supabase.from('profiles').select('*').eq('id', user.id).single()
        setProfile(data)
      }

      // 2. Load Doctors (Initial Fetch)
      handleSearch()
    }
    init()
  }, [])

  // --- SEARCH LOGIC ---
  const handleSearch = async () => {
    setLoading(true)
    try {
      let query = supabase
        .from('doctors')
        .select(`*, hospitals!inner(name, city)`)

      if (searchTerm) {
        query = query.or(`name.ilike.%${searchTerm}%,specialty.ilike.%${searchTerm}%`)
      }

      const { data, error } = await query
      if (error) throw error

      // Client-side Location Filter
      const filtered = (data as any[]).filter(doc => {
        if (!location) return true
        return doc.hospitals.city.toLowerCase().includes(location.toLowerCase()) || 
               doc.hospitals.name.toLowerCase().includes(location.toLowerCase())
      })

      setDoctors(filtered)
    } catch (error) {
      console.error('Error fetching doctors:', error)
    } finally {
      setLoading(false)
    }
  }

  // --- BOOKING LOGIC ---
  const handleBookClick = (doc: Doctor) => {
    if (!user) {
      router.push('/auth') // Redirect if not logged in
    } else {
      setBookingDoc(doc) // Open Modal
    }
  }

  const confirmBooking = async (dateStr: string) => {
    if (!user || !bookingDoc) return

    const { error } = await supabase.from('appointments').insert({
      doctor_id: bookingDoc.id,
      patient_id: user.id,
      patient_name: profile?.full_name,
      patient_mobile: profile?.mobile,
      appointment_date: new Date(dateStr).toISOString()
    })

    if (error) alert('Booking Failed')
    else {
      alert('Booking Request Sent! Redirecting to your profile...')
      setBookingDoc(null)
      router.push('/profile') // Redirect to Profile to see history
    }
  }

  return (
    <div className="min-h-screen flex flex-col bg-white font-sans text-gray-900">
      
      {/* --- 1. HEADER --- */}
      <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 font-bold text-2xl text-purple-900">
            <div className="bg-green-500 text-white p-1.5 rounded-lg">
              <HeartPulse size={24} />
            </div>
            DocSlotBooking
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-6">
            <Link href="/join" className="text-sm font-medium text-gray-600 hover:text-purple-900">
              Partner with Us
            </Link>
            
            <div className="h-4 w-px bg-gray-300"></div>

            {user ? (
              // LOGGED IN STATE
              <div className="relative">
                <button 
                  onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                  className="flex items-center gap-2 hover:bg-gray-50 px-3 py-2 rounded-lg transition-all"
                >
                  <div className="w-8 h-8 bg-purple-100 text-purple-700 rounded-full flex items-center justify-center font-bold text-sm">
                    {profile?.full_name?.[0] || 'U'}
                  </div>
                  <span className="text-sm font-medium">{profile?.full_name || 'User'}</span>
                  <ChevronDown size={16} className="text-gray-400"/>
                </button>

                {isUserMenuOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white border rounded-xl shadow-xl py-1 animate-in fade-in zoom-in-95">
                    <Link href="/profile" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 font-bold">
                      My Profile
                    </Link>
                    <button 
                      onClick={async () => { await supabase.auth.signOut(); window.location.reload() }}
                      className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                    >
                      Logout
                    </button>
                  </div>
                )}
              </div>
            ) : (
              // GUEST STATE
              <>
                <Link href="/auth" className="text-sm font-medium text-gray-600 hover:text-purple-900">
                  Log In
                </Link>
                <Link href="/auth" className="bg-purple-900 text-white px-5 py-2.5 rounded-lg text-sm font-bold hover:bg-purple-800 transition-colors shadow-lg shadow-purple-100">
                  Sign Up
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Toggle */}
          <button className="md:hidden p-2 text-gray-600" onClick={() => setIsMenuOpen(!isMenuOpen)}>
            {isMenuOpen ? <X /> : <Menu />}
          </button>
        </div>
      </header>

      {/* --- 2. HERO SECTION --- */}
      <section className="bg-green-50 pt-16 pb-24 px-4">
        <div className="max-w-4xl mx-auto text-center space-y-6">
          <h1 className="text-4xl md:text-6xl font-extrabold text-gray-900 leading-tight">
            Book your appointment <br/>
            <span className="text-green-500">Fast & Easy.</span>
          </h1>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            Find the best doctors and hospitals near you. Real-time slots, zero waiting.
          </p>

          {/* Search Bar */}
          <div className="mt-8 bg-white p-2 rounded-2xl shadow-xl shadow-green-100/50 border border-gray-100 flex flex-col md:flex-row items-center gap-2 max-w-3xl mx-auto">
            <div className="flex-1 flex items-center px-4 h-14 w-full md:border-r border-gray-100">
              <Search className="text-gray-400 h-5 w-5 mr-3" />
              <input 
                type="text" 
                placeholder="Doctor, Specialty..." 
                className="w-full bg-transparent outline-none text-gray-900 placeholder-gray-400"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="flex-1 flex items-center px-4 h-14 w-full">
              <MapPin className="text-gray-400 h-5 w-5 mr-3" />
              <input 
                type="text" 
                placeholder="City (e.g. Delhi)" 
                className="w-full bg-transparent outline-none text-gray-900 placeholder-gray-400"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
              />
            </div>
            <button 
              onClick={handleSearch}
              className="w-full md:w-auto bg-green-500 hover:bg-green-600 text-white px-8 h-14 rounded-xl font-bold transition-all flex items-center justify-center"
            >
              {loading ? <Loader2 className="animate-spin h-5 w-5" /> : 'Search'}
            </button>
          </div>
        </div>
      </section>

      {/* --- 3. DOCTOR LIST --- */}
      <section className="max-w-7xl mx-auto px-4 py-16 w-full">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl font-bold text-gray-900">Top Rated Doctors</h2>
          {!loading && <span className="text-sm text-gray-500 font-medium">{doctors.length} results</span>}
        </div>

        {loading ? (
          <div className="flex justify-center py-20"><Loader2 className="h-10 w-10 text-green-500 animate-spin" /></div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {doctors.map((doc) => (
              <div key={doc.id} className="bg-white rounded-2xl p-6 border border-gray-100 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col group">
                <div className="flex justify-between items-start mb-4">
                  <div className="h-16 w-16 rounded-full bg-purple-50 overflow-hidden flex items-center justify-center text-purple-600 font-bold text-2xl">
                    {doc.image_url ? <img src={doc.image_url} className="h-full w-full object-cover"/> : doc.name[0]}
                  </div>
                  <div className="flex items-center text-xs font-bold bg-yellow-50 text-yellow-700 px-2.5 py-1 rounded-full border border-yellow-100">
                    <Star className="h-3 w-3 mr-1 fill-yellow-400 text-yellow-400" /> 4.9
                  </div>
                </div>
                
                <div className="mb-6">
                  <h3 className="font-bold text-lg text-gray-900 group-hover:text-purple-700 transition-colors">{doc.name}</h3>
                  <p className="text-green-600 text-sm font-semibold mb-1">{doc.specialty}</p>
                  <p className="text-gray-500 text-xs flex items-center">
                    <MapPin className="h-3 w-3 mr-1" /> {doc.hospitals?.name}, {doc.hospitals?.city}
                  </p>
                </div>

                <div className="mt-auto pt-5 border-t border-gray-50 flex items-center justify-between">
                  <div>
                    <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Consultation</span>
                    <p className="font-bold text-lg text-gray-900">₹{doc.price}</p>
                  </div>
                  <button 
                    onClick={() => handleBookClick(doc)}
                    className="bg-gray-900 text-white px-5 py-2.5 rounded-xl text-sm font-bold hover:bg-green-500 transition-colors"
                  >
                    Book Slot
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* --- 4. FEATURES (Static) --- */}
      <section className="bg-white py-20 border-t border-gray-100">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Healthcare made simple.</h2>
            <p className="text-gray-500">We bridge the gap between discovery and delivery.</p>
          </div>
          <div className="grid md:grid-cols-3 gap-10">
            <FeatureCard icon={<History className="text-purple-600"/>} title="Digital History" desc="Your records, accessible anywhere." />
            <FeatureCard icon={<ShieldCheck className="text-green-600"/>} title="Verified Clinics" desc="100% verified partners only." />
            <FeatureCard icon={<Stethoscope className="text-blue-600"/>} title="Instant Booking" desc="Confirmed slots in seconds." />
          </div>
        </div>
      </section>

      {/* --- 5. UPDATED FOOTER --- */}
      <footer className="bg-gray-900 text-white py-12 mt-auto border-t border-gray-800">
        <div className="max-w-7xl mx-auto px-4 grid md:grid-cols-3 gap-12">
          
          {/* Brand Column */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 font-bold text-2xl">
              <HeartPulse className="text-green-500" /> DocSlotBooking
            </div>
            <p className="text-gray-400 text-sm leading-relaxed max-w-xs">
              Connecting patients with the right doctors instantly. Fast, secure, and reliable healthcare booking.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-bold text-lg mb-4">Company</h3>
            <ul className="space-y-3 text-sm text-gray-400">
              <li><Link href="/about" className="hover:text-green-400 transition-colors">About Us</Link></li>
              <li><Link href="/contact" className="hover:text-green-400 transition-colors">Contact Support</Link></li>
              <li><Link href="/join" className="hover:text-green-400 transition-colors">For Doctors</Link></li>
              <li><Link href="/privacy" className="hover:text-green-400 transition-colors">Privacy Policy</Link></li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="font-bold text-lg mb-4">Contact Us</h3>
            <ul className="space-y-4 text-sm text-gray-400">
              <li className="flex items-center gap-3">
                <Mail className="h-5 w-5 text-purple-400"/>
                <span>support@docslotbooking.com</span>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="h-5 w-5 text-purple-400"/>
                <span>+91 98765 43210</span>
              </li>
              <li className="flex items-center gap-3">
                <Globe className="h-5 w-5 text-purple-400"/>
                <span>www.docslotbooking.com</span>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="text-center pt-8 mt-8 border-t border-gray-800 text-gray-500 text-xs">
          © {new Date().getFullYear()} DocSlotBooking Inc. All rights reserved.
        </div>
      </footer>

      {/* --- BOOKING MODAL --- */}
      {bookingDoc && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in">
          <div className="bg-white rounded-2xl p-8 w-full max-w-md shadow-2xl">
             <div className="flex justify-between items-start mb-6">
               <div>
                 <h2 className="text-xl font-bold text-gray-900">Book Appointment</h2>
                 <p className="text-gray-500 text-sm mt-1">with {bookingDoc.name}</p>
               </div>
               <button onClick={() => setBookingDoc(null)} className="p-2 hover:bg-gray-100 rounded-full"><X size={20}/></button>
             </div>
             
             <div className="bg-purple-50 p-4 rounded-xl mb-6 flex justify-between items-center">
                <span className="text-purple-900 font-bold text-sm">Consultation Fee</span>
                <span className="text-purple-900 font-bold text-lg">₹{bookingDoc.price}</span>
             </div>

             <label className="block text-xs font-bold text-gray-400 uppercase mb-2 ml-1">Select Time</label>
             <input 
               type="datetime-local" 
               className="w-full p-4 bg-gray-50 border border-gray-200 rounded-xl mb-6 outline-none focus:border-green-500 transition-all"
               onChange={(e) => { if(e.target.value) confirmBooking(e.target.value) }} 
             />
             <button onClick={() => setBookingDoc(null)} className="w-full py-3 text-gray-400 font-bold hover:text-gray-600">Cancel</button>
          </div>
        </div>
      )}

    </div>
  )
}

// Helper Component for Features
function FeatureCard({ icon, title, desc }: any) {
  return (
    <div className="bg-gray-50 p-8 rounded-2xl hover:bg-green-50 transition-colors border border-transparent hover:border-green-100">
      <div className="bg-white w-14 h-14 rounded-xl flex items-center justify-center shadow-sm mb-6 text-xl">
        {icon}
      </div>
      <h3 className="font-bold text-lg text-gray-900 mb-2">{title}</h3>
      <p className="text-gray-500 leading-relaxed">{desc}</p>
    </div>
  )
}