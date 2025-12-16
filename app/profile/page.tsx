// 'use client'

// import { useEffect, useState } from 'react'
// import { useRouter } from 'next/navigation'
// import Link from 'next/link'
// import { supabase } from '@/lib/supabase'
// import { 
//   HeartPulse, Search, LogOut, Calendar, Clock, 
//   MapPin, FileText, Download, ChevronRight, User, Loader2
// } from 'lucide-react'

// export default function ProfilePage() {
//   const router = useRouter()
//   const [loading, setLoading] = useState(true)
//   const [profile, setProfile] = useState<any>(null)
//   const [appointments, setAppointments] = useState<any[]>([])
  
//   // Search State for the "Find Doc" bar inside profile
//   const [searchTerm, setSearchTerm] = useState('')

//   useEffect(() => {
//     const fetchData = async () => {
//       // 1. Check Auth
//       const { data: { user } } = await supabase.auth.getUser()
//       if (!user) {
//         router.push('/auth')
//         return
//       }

//       // 2. Fetch Profile
//       const { data: profileData } = await supabase
//         .from('profiles')
//         .select('*')
//         .eq('id', user.id)
//         .single()
//       setProfile(profileData)

//       // 3. Fetch Appointments
//       const { data: apptData } = await supabase
//         .from('appointments')
//         .select(`
//           *,
//           doctors ( name, specialty, image_url, hospitals(name, city) )
//         `)
//         .eq('patient_id', user.id)
//         .order('appointment_date', { ascending: false })

//       setAppointments(apptData || [])
//       setLoading(false)
//     }
//     fetchData()
//   }, [])

//   const handleLogout = async () => {
//     await supabase.auth.signOut()
//     router.push('/')
//   }

//   const handleSearch = (e: React.FormEvent) => {
//     e.preventDefault()
//     if(searchTerm.trim()) {
//       // Redirect to home with search query
//       // (Assuming you update home page to read ?q= url param, 
//       // or just redirect to search page)
//       router.push(`/?search=${searchTerm}`) 
//     }
//   }

//   if (loading) return (
//     <div className="min-h-screen flex items-center justify-center bg-white">
//       <Loader2 className="h-10 w-10 text-brand-green-500 animate-spin" />
//     </div>
//   )

//   // Separate Lists
//   const upcoming = appointments.filter(a => new Date(a.appointment_date) >= new Date())
//   const past = appointments.filter(a => new Date(a.appointment_date) < new Date())

//   return (
//     <div className="min-h-screen bg-brand-green-50">
      
//       {/* --- 1. HEADER (Consistent with Home) --- */}
//       <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-gray-100">
//         <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
//           <Link href="/" className="flex items-center gap-2 font-bold text-2xl text-brand-purple-900">
//             <div className="bg-brand-green-500 text-white p-1.5 rounded-lg">
//               <HeartPulse size={24} />
//             </div>
//             DocSlot
//           </Link>
          
//           <div className="flex items-center gap-4">
//              <div className="hidden md:flex items-center gap-2 text-sm font-medium text-gray-700 bg-gray-100 px-3 py-1.5 rounded-full">
//                 <User size={16} />
//                 {profile?.full_name || 'Patient'}
//              </div>
//              <button onClick={handleLogout} className="text-sm font-bold text-red-500 hover:bg-red-50 px-3 py-2 rounded-lg transition-colors">
//                Log Out
//              </button>
//           </div>
//         </div>
//       </header>


//       {/* --- 2. HERO / QUICK BOOK SECTION --- */}
//       <div className="bg-white pb-12 pt-8 border-b border-gray-100">
//         <div className="max-w-5xl mx-auto px-4">
//           <h1 className="text-3xl font-bold text-gray-900 mb-2">
//             Welcome back, <span className="text-brand-purple-900">{profile?.full_name?.split(' ')[0]}</span> 👋
//           </h1>
//           <p className="text-gray-500 mb-8">Manage your health records and upcoming visits.</p>

//           {/* Search Bar (Similar to Home) */}
//           <form onSubmit={handleSearch} className="relative max-w-2xl bg-white rounded-2xl shadow-xl shadow-brand-green-100/50 border border-gray-200 flex items-center p-2">
//             <Search className="ml-4 text-gray-400" />
//             <input 
//               type="text" 
//               placeholder="Book a new specialist (e.g. Cardiologist)..." 
//               className="flex-1 p-3 outline-none text-gray-900 placeholder-gray-400"
//               value={searchTerm}
//               onChange={(e) => setSearchTerm(e.target.value)}
//             />
//             <button type="submit" className="bg-brand-green-500 text-white px-6 py-3 rounded-xl font-bold hover:bg-brand-green-600 transition-colors">
//               Search
//             </button>
//           </form>
//         </div>
//       </div>


//       {/* --- 3. MAIN DASHBOARD GRID --- */}
//       <div className="max-w-6xl mx-auto px-4 py-12 grid grid-cols-1 lg:grid-cols-3 gap-8">
        
//         {/* COLUMN 1: UPCOMING APPOINTMENTS (Width: 2/3) */}
//         <div className="lg:col-span-2 space-y-6">
//           <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
//             <Calendar className="text-brand-purple-500"/> Upcoming Appointments
//           </h2>

//           {upcoming.length === 0 ? (
//             <div className="bg-white p-8 rounded-3xl border border-dashed border-gray-300 text-center">
//               <p className="text-gray-500 mb-4">No upcoming appointments scheduled.</p>
//               <Link href="/" className="text-brand-green-500 font-bold hover:underline">Book your first slot now</Link>
//             </div>
//           ) : (
//             upcoming.map(appt => (
//               <AppointmentCard key={appt.id} appt={appt} />
//             ))
//           )}

//           {/* Past Appointments Section (Collapsible or List) */}
//           {past.length > 0 && (
//             <div className="mt-12 pt-8 border-t border-gray-200">
//               <h2 className="text-lg font-bold text-gray-500 mb-4">Past Visits History</h2>
//               <div className="space-y-4 opacity-80">
//                 {past.map(appt => (
//                   <AppointmentCard key={appt.id} appt={appt} isPast />
//                 ))}
//               </div>
//             </div>
//           )}
//         </div>


//         {/* COLUMN 2: MEDICAL RECORDS & PROFILE (Width: 1/3) */}
//         <div className="space-y-6">
          
//           {/* Profile Details Card */}
//           <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100">
//              <div className="flex items-center justify-between mb-4">
//                 <h3 className="font-bold text-gray-900">Patient Details</h3>
//                 <button className="text-xs text-brand-purple-900 font-bold uppercase hover:underline">Edit</button>
//              </div>
//              <div className="space-y-3 text-sm">
//                 <div className="flex justify-between py-2 border-b border-gray-50">
//                    <span className="text-gray-500">Mobile</span>
//                    <span className="font-medium">{profile?.mobile}</span>
//                 </div>
//                 <div className="flex justify-between py-2 border-b border-gray-50">
//                    <span className="text-gray-500">Gender</span>
//                    <span className="font-medium capitalize">{profile?.gender}</span>
//                 </div>
//                 <div className="flex justify-between py-2 border-b border-gray-50">
//                    <span className="text-gray-500">DOB</span>
//                    <span className="font-medium">{profile?.dob}</span>
//                 </div>
//              </div>
//           </div>

//           {/* Medical Reports Widget */}
//           <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100">
//              <div className="flex items-center gap-2 mb-6">
//                 <div className="bg-blue-50 p-2 rounded-lg text-blue-500"><FileText size={20}/></div>
//                 <h3 className="font-bold text-gray-900">Recent Reports</h3>
//              </div>

//              {/* Static Dummy List for now (Replace with DB later) */}
//              <div className="space-y-4">
//                {[1, 2].map((_, i) => (
//                  <div key={i} className="flex items-center justify-between p-3 rounded-xl bg-gray-50 group hover:bg-blue-50 transition-colors cursor-pointer">
//                     <div className="flex items-center gap-3">
//                        <div className="bg-white p-2 rounded-lg shadow-sm">
//                           <span className="text-xs font-bold text-gray-500">PDF</span>
//                        </div>
//                        <div>
//                           <p className="text-sm font-bold text-gray-900">Blood_Test_Report.pdf</p>
//                           <p className="text-[10px] text-gray-500">12 Oct, 2024</p>
//                        </div>
//                     </div>
//                     <Download size={16} className="text-gray-400 group-hover:text-blue-500"/>
//                  </div>
//                ))}
//              </div>
             
//              <button className="w-full mt-4 py-2 text-sm text-center text-gray-500 font-medium hover:text-brand-purple-900 flex items-center justify-center gap-1">
//                View All Reports <ChevronRight size={14}/>
//              </button>
//           </div>

//         </div>
//       </div>
//     </div>
//   )
// }

// // --- SUB COMPONENT: APPOINTMENT CARD ---
// function AppointmentCard({ appt, isPast }: { appt: any, isPast?: boolean }) {
//   const dateObj = new Date(appt.appointment_date)
  
//   return (
//     <div className={`bg-white rounded-3xl p-6 border transition-all ${isPast ? 'border-gray-100 grayscale-[0.3]' : 'border-gray-200 shadow-sm hover:shadow-md hover:border-brand-green-200'}`}>
//       <div className="flex flex-col md:flex-row gap-6 items-start">
        
//         {/* Doctor Image */}
//         <div className="h-16 w-16 flex-shrink-0 rounded-2xl bg-gray-200 overflow-hidden">
//            {appt.doctors?.image_url ? (
//              <img src={appt.doctors.image_url} className="h-full w-full object-cover" />
//            ) : (
//              <div className="h-full w-full flex items-center justify-center text-gray-400 font-bold text-2xl">
//                {appt.doctors?.name[0]}
//              </div>
//            )}
//         </div>

//         {/* Info */}
//         <div className="flex-1">
//           <div className="flex justify-between items-start">
//              <div>
//                <h3 className="text-lg font-bold text-gray-900">{appt.doctors?.name}</h3>
//                <p className="text-brand-green-600 font-medium text-sm">{appt.doctors?.specialty}</p>
//              </div>
//              {!isPast && (
//                <span className="bg-green-100 text-green-700 text-[10px] font-bold px-2 py-1 rounded-full uppercase tracking-wider">
//                  Confirmed
//                </span>
//              )}
//           </div>

//           <div className="mt-4 flex flex-wrap gap-4 text-sm text-gray-600">
//              <div className="flex items-center gap-1.5 bg-gray-50 px-3 py-1.5 rounded-lg">
//                <Calendar size={14} className="text-brand-purple-500"/>
//                <span className="font-semibold">{dateObj.toLocaleDateString()}</span>
//              </div>
//              <div className="flex items-center gap-1.5 bg-gray-50 px-3 py-1.5 rounded-lg">
//                <Clock size={14} className="text-brand-purple-500"/>
//                <span className="font-semibold">
//                  {dateObj.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
//                </span>
//              </div>
//              <div className="flex items-center gap-1.5 bg-gray-50 px-3 py-1.5 rounded-lg w-full md:w-auto">
//                <MapPin size={14} className="text-gray-400"/>
//                <span className="truncate max-w-[150px]">{appt.doctors?.hospitals?.name}, {appt.doctors?.hospitals?.city}</span>
//              </div>
//           </div>

//           {/* Problem / Reason */}
//           {appt.problem && (
//             <div className="mt-4 pt-4 border-t border-gray-50">
//               <p className="text-xs text-gray-400 font-bold uppercase mb-1">Reason for Visit</p>
//               <p className="text-sm text-gray-700 italic">"{appt.problem}"</p>
//             </div>
//           )}
//         </div>
//       </div>
//     </div>
//   )
// }




// 'use client'

// import { useState, useEffect } from 'react'
// import { useRouter } from 'next/navigation'
// import { supabase } from '@/lib/supabase'
// import { 
//   Search, MapPin, HeartPulse, User, Phone, 
//   Calendar, Clock, ShieldCheck, History, Stethoscope, 
//   LogOut, Star, X, Loader2 
// } from 'lucide-react'

// // Types
// type Doctor = {
//   id: string
//   name: string
//   specialty: string
//   price: number
//   image_url: string | null
//   hospitals: { name: string, city: string }
// }

// export default function ProfilePage() {
//   const router = useRouter()
//   const [loading, setLoading] = useState(true)
  
//   // User Data
//   const [user, setUser] = useState<any>(null)
//   const [profile, setProfile] = useState<any>(null)
//   const [myBookings, setMyBookings] = useState<any[]>([])

//   // Search Data
//   const [doctors, setDoctors] = useState<Doctor[]>([])
//   const [searchTerm, setSearchTerm] = useState('')
//   const [location, setLocation] = useState('')
//   const [searching, setSearching] = useState(false)
  
//   // Booking Modal State
//   const [bookingDoc, setBookingDoc] = useState<Doctor | null>(null)

//   // --- 1. INITIAL FETCH ---
//   useEffect(() => {
//     const init = async () => {
//       // Get Auth User
//       const { data: { user } } = await supabase.auth.getUser()
//       if (!user) { router.push('/auth'); return }
//       setUser(user)

//       // Get Profile Details
//       const { data: profileData } = await supabase
//         .from('profiles')
//         .select('*')
//         .eq('id', user.id)
//         .single()
//       setProfile(profileData)

//       // Get My Bookings History
//       const { data: history } = await supabase
//         .from('appointments')
//         .select('*, doctors(name, hospitals(name))')
//         .eq('patient_id', user.id)
//         .order('created_at', { ascending: false })
//       setMyBookings(history || [])

//       // Load Initial Doctors
//       fetchDoctors()
//       setLoading(false)
//     }
//     init()
//   }, [])

//   // --- 2. SEARCH LOGIC ---
//   const fetchDoctors = async () => {
//     setSearching(true)
//     try {
//       let query = supabase.from('doctors').select(`*, hospitals!inner(name, city)`)
      
//       if (searchTerm) {
//         query = query.or(`name.ilike.%${searchTerm}%,specialty.ilike.%${searchTerm}%`)
//       }

//       const { data, error } = await query
//       if (error) throw error

//       const filtered = (data as any[]).filter(doc => {
//         if (!location) return true
//         return doc.hospitals.city.toLowerCase().includes(location.toLowerCase()) || 
//                doc.hospitals.name.toLowerCase().includes(location.toLowerCase())
//       })
//       setDoctors(filtered)
//     } catch (err) {
//       console.error(err)
//     } finally {
//       setSearching(false)
//     }
//   }

//   // --- 3. CONFIRM BOOKING ---
//   const handleBooking = async (dateStr: string) => {
//     if (!bookingDoc || !user) return

//     const { error } = await supabase.from('appointments').insert({
//       doctor_id: bookingDoc.id,
//       patient_id: user.id,
//       patient_name: profile?.full_name,
//       patient_mobile: profile?.mobile,
//       appointment_date: new Date(dateStr).toISOString()
//     })

//     if (error) alert('Booking Failed')
//     else {
//       alert('Booking Request Sent!')
//       setBookingDoc(null)
//       // Refresh history
//       const { data } = await supabase.from('appointments').select('*, doctors(name, hospitals(name))').eq('patient_id', user.id).order('created_at', { ascending: false })
//       setMyBookings(data || [])
//     }
//   }

//   if (loading) return <div className="h-screen flex items-center justify-center"><Loader2 className="animate-spin text-green-500 h-10 w-10"/></div>

//   return (
//     <div className="min-h-screen bg-gray-50 font-sans text-gray-900">
      
//       {/* --- HEADER --- */}
//       <header className="bg-white border-b sticky top-0 z-40">
//         <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
//           <div className="flex items-center gap-2 font-bold text-xl text-purple-900">
//             <div className="bg-green-500 text-white p-1 rounded-lg"><HeartPulse size={20}/></div>
//             DocSlotBooking
//           </div>
//           <button 
//             onClick={async () => { await supabase.auth.signOut(); router.push('/') }} 
//             className="flex items-center gap-2 text-sm font-bold text-red-500 hover:bg-red-50 px-3 py-1.5 rounded-lg"
//           >
//             <LogOut size={16}/> Logout
//           </button>
//         </div>
//       </header>

//       <div className="max-w-7xl mx-auto px-4 py-8 grid lg:grid-cols-12 gap-8">
        
//         {/* === LEFT COLUMN: PERSONAL INFO & HISTORY (4 Cols) === */}
//         <div className="lg:col-span-4 space-y-6">
          
//           {/* 1. Profile Card */}
//           <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
//              <div className="flex items-center gap-4 mb-6">
//                <div className="h-16 w-16 bg-purple-100 rounded-full flex items-center justify-center text-purple-600 font-bold text-2xl">
//                  {profile?.full_name?.[0] || 'U'}
//                </div>
//                <div>
//                  <h2 className="font-bold text-lg">{profile?.full_name}</h2>
//                  <p className="text-sm text-gray-500">{user?.email}</p>
//                </div>
//              </div>
             
//              <div className="space-y-3 text-sm">
//                <div className="flex justify-between p-3 bg-gray-50 rounded-lg">
//                  <span className="text-gray-500 flex items-center gap-2"><Phone size={14}/> Mobile</span>
//                  <span className="font-bold">{profile?.mobile || 'N/A'}</span>
//                </div>
//                <div className="flex justify-between p-3 bg-gray-50 rounded-lg">
//                  <span className="text-gray-500 flex items-center gap-2"><User size={14}/> Age / Gender</span>
//                  <span className="font-bold">{profile?.age} / {profile?.gender}</span>
//                </div>
//              </div>
//           </div>

//           {/* 2. Booking History Mini-List */}
//           <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 h-[400px] overflow-y-auto">
//              <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
//                <History size={18} className="text-green-500"/> Recent Bookings
//              </h3>
             
//              {myBookings.length === 0 ? (
//                <p className="text-sm text-gray-400 text-center py-10">No appointments yet.</p>
//              ) : (
//                <div className="space-y-3">
//                  {myBookings.map(appt => (
//                    <div key={appt.id} className="border border-gray-100 p-3 rounded-xl hover:bg-gray-50 transition-colors">
//                       <div className="flex justify-between items-start mb-1">
//                         <span className="font-bold text-sm text-gray-800">{appt.doctors?.name}</span>
//                         <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase ${
//                           appt.status === 'confirmed' ? 'bg-green-100 text-green-700' : 
//                           appt.status === 'rejected' ? 'bg-red-50 text-red-500' : 'bg-yellow-100 text-yellow-700'
//                         }`}>{appt.status}</span>
//                       </div>
//                       <p className="text-xs text-gray-500 truncate">{appt.doctors?.hospitals?.name}</p>
//                       <p className="text-xs text-blue-600 font-semibold mt-2 flex items-center gap-1">
//                         <Calendar size={10}/> {new Date(appt.appointment_date).toLocaleDateString()}
//                         <Clock size={10} className="ml-2"/> {new Date(appt.appointment_date).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
//                       </p>
//                    </div>
//                  ))}
//                </div>
//              )}
//           </div>
//         </div>


//         {/* === RIGHT COLUMN: SEARCH & BOOKING (8 Cols) === */}
//         <div className="lg:col-span-8 space-y-8">
          
//           {/* 1. Welcome & Info Banner */}
//           <div className="bg-gradient-to-r from-purple-900 to-indigo-900 rounded-3xl p-8 text-white shadow-xl relative overflow-hidden">
//             <div className="relative z-10">
//               <h1 className="text-3xl font-bold mb-2">Hello, {profile?.full_name?.split(' ')[0] || 'User'}!</h1>
//               <p className="text-purple-100 mb-6 max-w-lg">
//                 Ready to find care? Search for specialists, clinics, or hospitals nearby and book instantly.
//               </p>
              
//               {/* Embedded Search Bar */}
//               <div className="bg-white p-2 rounded-xl flex flex-col md:flex-row gap-2 shadow-lg">
//                 <div className="flex-1 flex items-center px-3 h-12 border-b md:border-b-0 md:border-r border-gray-100">
//                   <Search className="text-gray-400 h-5 w-5 mr-2"/>
//                   <input placeholder="Doctor or Specialty..." className="w-full text-gray-900 outline-none placeholder:text-gray-400"
//                     value={searchTerm} onChange={e => setSearchTerm(e.target.value)} />
//                 </div>
//                 <div className="flex-1 flex items-center px-3 h-12">
//                   <MapPin className="text-gray-400 h-5 w-5 mr-2"/>
//                   <input placeholder="City..." className="w-full text-gray-900 outline-none placeholder:text-gray-400"
//                     value={location} onChange={e => setLocation(e.target.value)} />
//                 </div>
//                 <button onClick={fetchDoctors} className="bg-green-500 hover:bg-green-600 text-white px-6 py-2 rounded-lg font-bold transition-all">
//                   {searching ? <Loader2 className="animate-spin"/> : 'Search'}
//                 </button>
//               </div>
//             </div>
            
//             {/* Background Decor */}
//             <div className="absolute right-0 top-0 h-full w-1/3 bg-white/5 skew-x-12 transform translate-x-10"></div>
//           </div>

//           {/* 2. Doctor Results Grid */}
//           <div>
//             <div className="flex justify-between items-center mb-4">
//               <h2 className="font-bold text-xl text-gray-800">Available Doctors</h2>
//               <span className="text-sm text-gray-500">{doctors.length} results</span>
//             </div>
            
//             <div className="grid md:grid-cols-2 gap-4">
//               {doctors.map(doc => (
//                 <div key={doc.id} className="bg-white border border-gray-100 p-5 rounded-2xl hover:shadow-lg transition-all flex flex-col group">
//                   <div className="flex justify-between items-start mb-3">
//                     <div className="flex items-center gap-3">
//                       <div className="h-12 w-12 bg-purple-50 rounded-full flex items-center justify-center text-purple-600 font-bold text-lg">
//                         {doc.image_url ? <img src={doc.image_url} className="h-full w-full rounded-full object-cover"/> : doc.name[0]}
//                       </div>
//                       <div>
//                         <h4 className="font-bold text-gray-900 group-hover:text-purple-700">{doc.name}</h4>
//                         <p className="text-xs text-green-600 font-bold uppercase">{doc.specialty}</p>
//                       </div>
//                     </div>
//                     <div className="bg-yellow-50 text-yellow-700 text-xs font-bold px-2 py-1 rounded flex items-center">
//                       <Star size={10} className="fill-yellow-500 text-yellow-500 mr-1"/> 4.9
//                     </div>
//                   </div>
                  
//                   <div className="mt-auto pt-3 border-t border-gray-50 flex items-center justify-between">
//                     <p className="text-xs text-gray-500 flex items-center">
//                       <MapPin size={12} className="mr-1"/> {doc.hospitals.city}
//                     </p>
//                     <button onClick={() => setBookingDoc(doc)} className="bg-gray-900 text-white text-xs font-bold px-4 py-2 rounded-lg hover:bg-green-600 transition-colors">
//                       Book ₹{doc.price}
//                     </button>
//                   </div>
//                 </div>
//               ))}
//             </div>
//           </div>

//           {/* 3. Info / "Why Us" Section (Moved from Home) */}
//           <div className="bg-blue-50 rounded-2xl p-6 border border-blue-100">
//              <h3 className="font-bold text-blue-900 mb-4 text-center">Why CureOS?</h3>
//              <div className="grid grid-cols-3 gap-4 text-center">
//                 <div className="bg-white p-3 rounded-xl shadow-sm">
//                    <ShieldCheck className="mx-auto text-green-500 h-6 w-6 mb-2"/>
//                    <p className="text-xs font-bold text-gray-700">Verified Docs</p>
//                 </div>
//                 <div className="bg-white p-3 rounded-xl shadow-sm">
//                    <History className="mx-auto text-purple-500 h-6 w-6 mb-2"/>
//                    <p className="text-xs font-bold text-gray-700">Digital Records</p>
//                 </div>
//                 <div className="bg-white p-3 rounded-xl shadow-sm">
//                    <Stethoscope className="mx-auto text-blue-500 h-6 w-6 mb-2"/>
//                    <p className="text-xs font-bold text-gray-700">Instant Care</p>
//                 </div>
//              </div>
//           </div>

//         </div>
//       </div>

//       {/* --- BOOKING MODAL --- */}
//       {bookingDoc && (
//         <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in">
//           <div className="bg-white rounded-2xl p-6 w-full max-w-sm shadow-2xl">
//              <div className="flex justify-between items-center mb-4">
//                <h3 className="font-bold text-lg">Confirm Booking</h3>
//                <button onClick={() => setBookingDoc(null)}><X className="text-gray-400 hover:text-black"/></button>
//              </div>
             
//              <div className="bg-gray-50 p-3 rounded-lg mb-4 text-sm">
//                <p className="font-bold text-gray-900">{bookingDoc.name}</p>
//                <p className="text-gray-500">{bookingDoc.hospitals.name}</p>
//                <p className="text-purple-700 font-bold mt-1">₹{bookingDoc.price}</p>
//              </div>

//              <label className="text-xs font-bold text-gray-400 uppercase">Appointment Time</label>
//              <input type="datetime-local" className="w-full p-3 border rounded-lg mt-1 mb-4 outline-none focus:border-purple-500"
//                onChange={e => {if(e.target.value) handleBooking(e.target.value)}} />
               
//              <button onClick={() => setBookingDoc(null)} className="w-full py-2 text-gray-400 text-sm hover:text-red-500">Cancel</button>
//           </div>
//         </div>
//       )}
//     </div>
//   )
// }

// 'use client'

// import { useState, useEffect } from 'react'
// import { useRouter } from 'next/navigation'
// import Link from 'next/link'
// import { supabase } from '@/lib/supabase'
// import { 
//   User, Calendar, Clock, MapPin, Search, 
//   Stethoscope, X, CheckCircle2, Loader2, LogOut, 
//   ChevronRight, ShieldCheck, HeartPulse, Phone
// } from 'lucide-react'

// export default function PatientProfile() {
//   const router = useRouter()
//   const [loading, setLoading] = useState(true)
//   const [user, setUser] = useState<any>(null)
  
//   // Data State
//   const [doctors, setDoctors] = useState<any[]>([])
//   const [appointments, setAppointments] = useState<any[]>([])

//   // Booking Modal State
//   const [selectedDoctor, setSelectedDoctor] = useState<any>(null)
//   const [bookingStep, setBookingStep] = useState(1) 
//   const [selectedDate, setSelectedDate] = useState<string>('') 
//   const [selectedTime, setSelectedTime] = useState<string>('')
//   const [symptom, setSymptom] = useState('')
//   const [isBookingLoading, setIsBookingLoading] = useState(false)

//   // --- 1. FETCH DATA ---
//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         const { data: { user } } = await supabase.auth.getUser()
//         if (!user) { router.push('/auth'); return }
//         setUser(user)

//         // Fetch Doctors + Hospitals
//         const { data: docData } = await supabase
//           .from('doctors')
//           .select(`*, hospitals(name, city)`)
//         if (docData) setDoctors(docData)

//         // Fetch Appointments
//         const { data: apptData } = await supabase
//           .from('appointments')
//           .select(`*, doctors(name, specialty, hospitals(name, city))`)
//           .eq('patient_id', user.id)
//           .order('appointment_date', { ascending: true })
        
//         if (apptData) setAppointments(apptData)

//       } catch (error) {
//         console.error(error)
//       } finally {
//         setLoading(false)
//       }
//     }
//     fetchData()
//   }, [])

//   // --- 2. UTILS (Mock) ---
//   const generateSlots = () => ['10:00 AM', '10:30 AM', '11:00 AM', '04:00 PM', '04:30 PM', '05:00 PM']
//   const getNextDays = () => {
//     const dates = []
//     for(let i=0; i<4; i++) {
//       const d = new Date()
//       d.setDate(d.getDate() + i)
//       dates.push(d)
//     }
//     return dates
//   }

//   // --- 3. BOOKING HANDLER ---
//   const handleConfirmBooking = async () => {
//     setIsBookingLoading(true)
//     try {
//       const dateObj = new Date(selectedDate)
//       // Simple mock time parser
//       const [time, period] = selectedTime.split(' ')
//       let [hours, minutes] = time.split(':').map(Number)
//       if (period === 'PM' && hours !== 12) hours += 12
//       if (period === 'AM' && hours === 12) hours = 0
//       dateObj.setHours(hours, minutes, 0)

//       const { error } = await supabase.from('appointments').insert({
//         doctor_id: selectedDoctor.id,
//         patient_id: user.id,
//         patient_name: user.user_metadata.full_name,
//         patient_mobile: user.user_metadata.mobile,
//         appointment_date: dateObj.toISOString(),
//         status: 'pending'
//       })

//       if (error) throw error
      
//       setBookingStep(3) 
//       setAppointments([...appointments, {
//         id: 'temp', 
//         appointment_date: dateObj.toISOString(),
//         doctors: selectedDoctor,
//         status: 'pending'
//       }])

//     } catch (err) {
//       alert("Booking failed. Please try again.")
//     } finally {
//       setIsBookingLoading(false)
//     }
//   }

//   const closeBooking = () => {
//     setSelectedDoctor(null); setBookingStep(1); setSymptom(''); setSelectedTime(''); setSelectedDate('')
//   }

//   if (loading) return <div className="h-screen flex items-center justify-center bg-gray-50"><Loader2 className="animate-spin text-purple-600" size={40}/></div>

//   return (
//     <div className="min-h-screen bg-gray-50 font-sans text-gray-900 flex flex-col">
      
//       {/* --- HEADER --- */}
//       <header className="bg-white/80 backdrop-blur-md sticky top-0 z-40 border-b border-gray-100 px-6 h-20 flex justify-between items-center shadow-sm">
//         <Link href="/" className="flex items-center gap-2 font-bold text-xl text-purple-900">
//           <div className="bg-green-500 text-white p-1.5 rounded-lg"><HeartPulse size={20} /></div>
//           DocSlot
//         </Link>
        
//         <div className="flex items-center gap-4">
//            <div className="hidden md:block text-right mr-2">
//              <p className="text-sm font-bold text-gray-900">{user?.user_metadata?.full_name}</p>
//              <p className="text-xs text-green-600 font-medium">Patient Account</p>
//            </div>
//            <div className="w-10 h-10 bg-gradient-to-tr from-purple-100 to-blue-100 text-purple-700 rounded-full flex items-center justify-center font-bold text-lg border-2 border-white shadow-sm">
//              {user?.user_metadata?.full_name?.[0] || 'U'}
//            </div>
//            <button onClick={() => { supabase.auth.signOut(); router.push('/') }} className="bg-gray-100 p-2.5 rounded-full text-gray-500 hover:bg-red-50 hover:text-red-500 transition-colors" title="Logout">
//              <LogOut size={18} />
//            </button>
//         </div>
//       </header>

//       <main className="flex-grow max-w-5xl mx-auto w-full px-6 py-8 space-y-10">
        
//         {/* --- HERO / INFO SECTION --- */}
//         <section className="bg-purple-900 rounded-3xl p-8 md:p-12 text-white relative overflow-hidden shadow-2xl shadow-purple-900/20">
//           <div className="relative z-10 max-w-2xl">
//             <div className="inline-flex items-center gap-2 bg-purple-800/50 border border-purple-700/50 px-3 py-1 rounded-full text-xs font-bold text-purple-100 mb-4">
//               <ShieldCheck size={14} className="text-green-400"/> Trusted Healthcare Platform
//             </div>
//             <h1 className="text-3xl md:text-4xl font-bold mb-4 leading-tight">
//               Your health, prioritized. <br/>
//               <span className="text-purple-300">Book expert doctors instantly.</span>
//             </h1>
//             <p className="text-purple-100 mb-8 leading-relaxed max-w-lg">
//               Skip the waiting room. We connect you directly with top specialists in your area. 
//               Secure records, instant confirmation, and 24/7 support.
//             </p>
//             <div className="flex gap-8 text-sm font-medium text-purple-200">
//                <div className="flex items-center gap-2"><CheckCircle2 size={16} className="text-green-400"/> 100% Verified Doctors</div>
//                <div className="flex items-center gap-2"><CheckCircle2 size={16} className="text-green-400"/> Instant Booking</div>
//             </div>
//           </div>
          
//           {/* Abstract Background Decoration */}
//           <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-gradient-to-br from-purple-600 to-indigo-600 rounded-full blur-3xl opacity-30 -translate-y-20 translate-x-20"></div>
//           <div className="absolute bottom-0 left-0 w-[300px] h-[300px] bg-green-500 rounded-full blur-3xl opacity-10 translate-y-10 -translate-x-10"></div>
//         </section>

//         <div className="grid lg:grid-cols-3 gap-8 items-start">
          
//           {/* --- LEFT COL: APPOINTMENTS --- */}
//           <div className="lg:col-span-1 space-y-4">
//             <div className="flex items-center justify-between mb-2">
//               <h2 className="font-bold text-lg text-gray-900 flex items-center gap-2">
//                 <Calendar className="text-purple-600" size={20}/> Upcoming
//               </h2>
//               <span className="text-xs font-bold bg-gray-100 px-2 py-1 rounded-md text-gray-600">{appointments.length}</span>
//             </div>

//             {appointments.length === 0 ? (
//               <div className="bg-white p-8 rounded-2xl text-center border border-dashed border-gray-300">
//                 <div className="w-12 h-12 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-3 text-gray-400">
//                   <Calendar size={24}/>
//                 </div>
//                 <p className="text-gray-900 font-bold text-sm">No bookings yet</p>
//                 <p className="text-gray-500 text-xs mt-1">Find a doctor to get started.</p>
//               </div>
//             ) : (
//               <div className="space-y-3">
//                 {appointments.map((appt: any) => (
//                   <div key={appt.id} className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all group cursor-default">
//                     <div className="flex justify-between items-start mb-3">
//                       <div className="flex gap-3">
//                         <div className="w-10 h-10 bg-purple-50 rounded-xl flex items-center justify-center text-purple-600 font-bold text-sm">
//                           Dr
//                         </div>
//                         <div>
//                           <h3 className="font-bold text-gray-900 text-sm">{appt.doctors?.name}</h3>
//                           <p className="text-xs text-gray-500">{appt.doctors?.specialty}</p>
//                         </div>
//                       </div>
//                       <span className={`text-[10px] font-bold px-2 py-1 rounded-full uppercase ${appt.status === 'confirmed' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
//                         {appt.status}
//                       </span>
//                     </div>
                    
//                     <div className="border-t border-gray-50 pt-3 flex items-center justify-between">
//                        <div className="text-xs text-gray-500 font-medium flex items-center gap-1.5">
//                          <Clock size={14} className="text-gray-400"/>
//                          {new Date(appt.appointment_date).toLocaleDateString()}
//                        </div>
//                        <div className="text-xs text-gray-500 font-medium">
//                          {new Date(appt.appointment_date).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
//                        </div>
//                     </div>
//                   </div>
//                 ))}
//               </div>
//             )}
//           </div>

//           {/* --- RIGHT COL: FIND DOCTORS --- */}
//           <div className="lg:col-span-2">
//             <h2 className="font-bold text-lg text-gray-900 mb-6 flex items-center gap-2">
//               <Stethoscope className="text-green-600" size={20}/> Top Specialists Near You
//             </h2>
            
//             {/* Search */}
//             <div className="relative mb-6 group">
//               <Search className="absolute left-4 top-3.5 text-gray-400 group-focus-within:text-purple-500 transition-colors" size={20}/>
//               <input 
//                 placeholder="Search by doctor name, specialty, or clinic..." 
//                 className="w-full pl-12 pr-4 py-3.5 bg-white border border-gray-200 rounded-2xl outline-none focus:ring-2 ring-purple-500/20 focus:border-purple-500 transition-all shadow-sm" 
//               />
//             </div>

//             <div className="grid md:grid-cols-2 gap-4">
//               {doctors.map((doc) => (
//                 <div key={doc.id} className="bg-white p-5 rounded-3xl border border-gray-100 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between h-full">
//                   <div>
//                     <div className="flex justify-between items-start mb-4">
//                       <div className="flex gap-4">
//                         <div className="w-14 h-14 bg-gray-100 rounded-2xl flex items-center justify-center text-gray-400">
//                            <User size={24} />
//                         </div>
//                         <div>
//                           <h3 className="font-bold text-gray-900">{doc.name}</h3>
//                           <p className="text-purple-600 text-sm font-medium">{doc.specialty}</p>
//                           <div className="flex items-center gap-1 text-xs text-gray-400 mt-1">
//                             <MapPin size={12} /> {doc.hospitals?.city || 'City'}
//                           </div>
//                         </div>
//                       </div>
//                     </div>
                    
//                     <div className="bg-gray-50 rounded-xl p-3 mb-4">
//                        <p className="text-xs text-gray-500 font-bold uppercase mb-1">Clinic</p>
//                        <p className="text-sm font-medium text-gray-900 truncate">{doc.hospitals?.name}</p>
//                     </div>
//                   </div>

//                   <div className="flex items-center gap-3 mt-2">
//                     <div className="bg-green-50 text-green-700 px-4 py-2.5 rounded-xl font-bold text-sm">
//                       ₹{doc.price}
//                     </div>
//                     <button 
//                       onClick={() => setSelectedDoctor(doc)}
//                       className="flex-1 bg-gray-900 text-white font-bold py-2.5 rounded-xl text-sm hover:bg-gray-800 transition-colors flex items-center justify-center gap-2 group"
//                     >
//                       Book Now <ChevronRight size={16} className="group-hover:translate-x-1 transition-transform"/>
//                     </button>
//                   </div>
//                 </div>
//               ))}
//             </div>
//           </div>

//         </div>
//       </main>

//       {/* --- FOOTER --- */}
//       <footer className="bg-white border-t border-gray-100 py-12 px-6 mt-12">
//         <div className="max-w-5xl mx-auto grid md:grid-cols-4 gap-8 mb-8">
//            <div className="col-span-1 md:col-span-2">
//               <div className="flex items-center gap-2 font-bold text-xl text-purple-900 mb-4">
//                 <div className="bg-green-500 text-white p-1 rounded-md"><HeartPulse size={18} /></div>
//                 DocSlotBooking
//               </div>
//               <p className="text-gray-500 text-sm leading-relaxed max-w-sm">
//                 Connecting patients with the best healthcare providers. Simple, secure, and fast appointment booking for everyone.
//               </p>
//            </div>
           
//            <div>
//              <h4 className="font-bold text-gray-900 mb-4">Platform</h4>
//              <ul className="space-y-2 text-sm text-gray-500">
//                <li><Link href="/" className="hover:text-purple-600">Home</Link></li>
//                <li><Link href="/join" className="hover:text-purple-600">For Doctors</Link></li>
//                <li><Link href="/auth" className="hover:text-purple-600">Login</Link></li>
//              </ul>
//            </div>
           
//            <div>
//              <h4 className="font-bold text-gray-900 mb-4">Support</h4>
//              <ul className="space-y-2 text-sm text-gray-500">
//                <li className="flex items-center gap-2"><Phone size={14}/> +91 98765 43210</li>
//                <li className="flex items-center gap-2"><ShieldCheck size={14}/> Privacy Policy</li>
//                <li>help@docslot.com</li>
//              </ul>
//            </div>
//         </div>
//         <div className="max-w-5xl mx-auto pt-8 border-t border-gray-50 text-center text-xs text-gray-400">
//           © 2024 DocSlotBooking Inc. All rights reserved.
//         </div>
//       </footer>


//       {/* --- BOOKING MODAL (Pop Up) --- */}
//       {selectedDoctor && (
//         <div className="fixed inset-0 z-50 flex items-end md:items-center justify-center p-4">
//           <div className="absolute inset-0 bg-gray-900/60 backdrop-blur-sm transition-opacity" onClick={closeBooking}></div>
          
//           <div className="bg-white w-full max-w-lg rounded-3xl shadow-2xl relative z-10 overflow-hidden flex flex-col max-h-[90vh] animate-in slide-in-from-bottom-10 duration-300">
            
//             {/* Modal Header */}
//             <div className="bg-gray-50 border-b border-gray-100 p-6 flex justify-between items-start sticky top-0">
//               <div>
//                 <p className="text-purple-600 text-xs font-bold uppercase tracking-wider mb-1">New Appointment</p>
//                 <h2 className="text-xl font-bold text-gray-900">Dr. {selectedDoctor.name}</h2>
//                 <p className="text-sm text-gray-500">{selectedDoctor.specialty} • ₹{selectedDoctor.price}</p>
//               </div>
//               <button onClick={closeBooking} className="bg-white border border-gray-200 p-2 rounded-full text-gray-500 hover:bg-gray-100 transition-colors">
//                 <X size={18}/>
//               </button>
//             </div>

//             <div className="p-6 overflow-y-auto">
              
//               {/* STEP 1: DATE & TIME */}
//               {bookingStep === 1 && (
//                 <div className="space-y-8">
//                   {/* Dates */}
//                   <div>
//                     <h3 className="font-bold text-gray-900 mb-3 flex items-center gap-2 text-sm">
//                       1. Select Date
//                     </h3>
//                     <div className="flex gap-3 overflow-x-auto pb-4 scrollbar-hide snap-x">
//                       {getNextDays().map((d, i) => {
//                          const dateStr = d.toDateString()
//                          const isSel = selectedDate === dateStr
//                          return (
//                            <button key={i} 
//                              onClick={() => setSelectedDate(dateStr)}
//                              className={`min-w-[80px] flex-1 p-3 rounded-2xl border transition-all snap-start ${isSel ? 'border-purple-600 bg-purple-600 text-white shadow-lg shadow-purple-200' : 'border-gray-100 bg-white hover:border-purple-200 text-gray-600'}`}
//                            >
//                              <span className="text-[10px] font-bold uppercase block opacity-80">{i === 0 ? 'Today' : i === 1 ? 'Tmrw' : d.toLocaleDateString('en-US', {weekday: 'short'})}</span>
//                              <span className="text-xl font-bold">{d.getDate()}</span>
//                            </button>
//                          )
//                       })}
//                     </div>
//                   </div>

//                   {/* Times */}
//                   <div className={`transition-all duration-500 ${selectedDate ? 'opacity-100' : 'opacity-40 pointer-events-none filter blur-[1px]'}`}>
//                     <h3 className="font-bold text-gray-900 mb-3 flex items-center gap-2 text-sm">
//                       2. Select Time
//                     </h3>
//                     <div className="grid grid-cols-3 gap-3">
//                       {generateSlots().map((slot) => (
//                         <button key={slot}
//                           onClick={() => setSelectedTime(slot)}
//                           className={`py-3 px-2 rounded-xl text-sm font-bold border transition-all ${selectedTime === slot ? 'bg-green-500 text-white border-green-500 shadow-lg shadow-green-200' : 'bg-white border-gray-200 text-gray-600 hover:border-green-400'}`}
//                         >
//                           {slot}
//                         </button>
//                       ))}
//                     </div>
//                   </div>
                  
//                   <div className="pt-2">
//                     <button 
//                       disabled={!selectedDate || !selectedTime}
//                       onClick={() => setBookingStep(2)}
//                       className="w-full bg-gray-900 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold py-4 rounded-xl hover:bg-gray-800 transition-all flex justify-center items-center gap-2 shadow-xl shadow-gray-200"
//                     >
//                       Continue <ChevronRight size={18} />
//                     </button>
//                   </div>
//                 </div>
//               )}

//               {/* STEP 2: DETAILS */}
//               {bookingStep === 2 && (
//                 <div className="space-y-6 animate-in slide-in-from-right-8 duration-300">
//                   <div>
//                     <h3 className="font-bold text-gray-900 mb-2">Describe your problem</h3>
//                     <p className="text-gray-400 text-xs mb-3">Optional but helpful for the doctor.</p>
//                     <textarea 
//                       autoFocus
//                       className="w-full h-32 p-4 bg-gray-50 border border-gray-200 rounded-2xl outline-none focus:ring-2 ring-purple-500/50 resize-none text-gray-900 text-sm transition-all focus:bg-white"
//                       placeholder="e.g. Fever, headache, stomach pain..."
//                       value={symptom}
//                       onChange={e => setSymptom(e.target.value)}
//                     />
//                   </div>
                  
//                   <div className="bg-purple-50 p-4 rounded-2xl flex gap-4 items-center border border-purple-100">
//                     <div className="bg-white p-2 rounded-xl text-purple-600 shadow-sm"><Calendar size={20} /></div>
//                     <div>
//                        <p className="text-xs text-gray-500 font-bold uppercase">Appointment At</p>
//                        <p className="text-sm font-bold text-purple-900">{selectedDate} • {selectedTime}</p>
//                     </div>
//                   </div>

//                   <div className="flex gap-3 pt-2">
//                     <button onClick={() => setBookingStep(1)} className="px-6 py-4 rounded-xl font-bold text-gray-500 hover:bg-gray-100 transition-colors">
//                        Back
//                     </button>
//                     <button 
//                       onClick={handleConfirmBooking}
//                       disabled={isBookingLoading}
//                       className="flex-1 bg-green-500 text-white font-bold py-4 rounded-xl hover:bg-green-600 flex justify-center items-center shadow-lg shadow-green-200 transition-all active:scale-[0.98]"
//                     >
//                       {isBookingLoading ? <Loader2 className="animate-spin" /> : 'Confirm Booking'}
//                     </button>
//                   </div>
//                 </div>
//               )}

//               {/* STEP 3: SUCCESS */}
//               {bookingStep === 3 && (
//                 <div className="text-center py-12 animate-in zoom-in-95 duration-300">
//                   <div className="w-24 h-24 bg-green-50 text-green-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-sm">
//                     <CheckCircle2 size={48} />
//                   </div>
//                   <h3 className="text-2xl font-bold text-gray-900 mb-2">Booking Confirmed!</h3>
//                   <p className="text-gray-500 mb-8 max-w-xs mx-auto text-sm">
//                     Your appointment with <span className="font-bold text-gray-800">Dr. {selectedDoctor.name}</span> is set. We've sent the details to your dashboard.
//                   </p>
                  
//                   <button onClick={closeBooking} className="w-full bg-gray-900 text-white font-bold py-4 rounded-xl shadow-lg hover:bg-gray-800 transition-all">
//                     Back to Dashboard
//                   </button>
//                 </div>
//               )}

//             </div>
//           </div>
//         </div>
//       )}

//     </div>
//   )
// }


// 'use client'

// import { useState, useEffect } from 'react'
// import { useRouter } from 'next/navigation'
// import { supabase } from '@/lib/supabase'
// import { 
//   Search, MapPin, HeartPulse, User, Phone, 
//   Calendar, Clock, ShieldCheck, History, Stethoscope, 
//   LogOut, Star, X, Loader2, ChevronRight, CheckCircle2 
// } from 'lucide-react'

// // Types
// type Doctor = {
//   id: string
//   name: string
//   specialty: string
//   price: number
//   image_url: string | null
//   hospitals: { name: string, city: string }
// }

// export default function ProfilePage() {
//   const router = useRouter()
//   const [loading, setLoading] = useState(true)
  
//   // User Data
//   const [user, setUser] = useState<any>(null)
//   const [profile, setProfile] = useState<any>(null)
//   const [myBookings, setMyBookings] = useState<any[]>([])

//   // Search Data
//   const [doctors, setDoctors] = useState<Doctor[]>([])
//   const [searchTerm, setSearchTerm] = useState('')
//   const [location, setLocation] = useState('')
//   const [searching, setSearching] = useState(false)
  
//   // --- BOOKING STATE ---
//   const [bookingDoc, setBookingDoc] = useState<Doctor | null>(null)
//   const [bookingStep, setBookingStep] = useState(1) // 1: Slot, 2: Reason, 3: Success
//   const [selectedDate, setSelectedDate] = useState<string>('')
//   const [selectedTime, setSelectedTime] = useState<string>('')
//   const [symptom, setSymptom] = useState('')
//   const [isBookingLoading, setIsBookingLoading] = useState(false)

//   // --- 1. INITIAL FETCH ---
//   useEffect(() => {
//     const init = async () => {
//       // Get Auth User
//       const { data: { user } } = await supabase.auth.getUser()
//       if (!user) { router.push('/auth'); return }
//       setUser(user)

//       // Get Profile Details (Try 'profiles' table first, fallback to metadata)
//       const { data: profileData } = await supabase
//         .from('profiles')
//         .select('*')
//         .eq('id', user.id)
//         .single()
      
//       // Merge metadata if profile is incomplete
//       const finalProfile = {
//         ...profileData,
//         full_name: profileData?.full_name || user.user_metadata?.full_name,
//         mobile: profileData?.mobile || user.user_metadata?.mobile
//       }
//       setProfile(finalProfile)

//       // Get My Bookings History
//       const { data: history } = await supabase
//         .from('appointments')
//         .select('*, doctors(name, hospitals(name))')
//         .eq('patient_id', user.id)
//         .order('created_at', { ascending: false })
//       setMyBookings(history || [])

//       // Load Initial Doctors
//       fetchDoctors()
//       setLoading(false)
//     }
//     init()
//   }, [])

//   // --- 2. SEARCH LOGIC ---
//   const fetchDoctors = async () => {
//     setSearching(true)
//     try {
//       let query = supabase.from('doctors').select(`*, hospitals!inner(name, city)`)
      
//       if (searchTerm) {
//         query = query.or(`name.ilike.%${searchTerm}%,specialty.ilike.%${searchTerm}%`)
//       }

//       const { data, error } = await query
//       if (error) throw error

//       const filtered = (data as any[]).filter(doc => {
//         if (!location) return true
//         return doc.hospitals.city.toLowerCase().includes(location.toLowerCase()) || 
//                doc.hospitals.name.toLowerCase().includes(location.toLowerCase())
//       })
//       setDoctors(filtered)
//     } catch (err) {
//       console.error(err)
//     } finally {
//       setSearching(false)
//     }
//   }

//   // --- 3. HELPER FUNCTIONS FOR SLOTS ---
//   const generateSlots = () => ['10:00 AM', '10:30 AM', '11:00 AM', '11:30 AM', '04:00 PM', '04:30 PM', '05:00 PM']
  
//   const getNextDays = () => {
//     const dates = []
//     for(let i=0; i<4; i++) {
//       const d = new Date()
//       d.setDate(d.getDate() + i)
//       dates.push(d)
//     }
//     return dates
//   }

//   // --- 4. CONFIRM BOOKING ---
//   const handleConfirmBooking = async () => {
//     if (!bookingDoc || !user) return
//     setIsBookingLoading(true)

//     try {
//       // Parse Date and Time
//       const dateObj = new Date(selectedDate)
//       const [time, period] = selectedTime.split(' ')
//       let [hours, minutes] = time.split(':').map(Number)
//       if (period === 'PM' && hours !== 12) hours += 12
//       if (period === 'AM' && hours === 12) hours = 0
//       dateObj.setHours(hours, minutes, 0)

//       // INSERT INTO DB
//       const { error } = await supabase.from('appointments').insert({
//         doctor_id: bookingDoc.id,
//         patient_id: user.id,
//         patient_name: profile?.full_name || 'Guest User', // Auto-fill Name
//         patient_mobile: profile?.mobile || 'N/A',         // Auto-fill Mobile
//         appointment_date: dateObj.toISOString(),
//         status: 'pending'
//         // If you add a 'symptom' column to DB later: symptom: symptom
//       })

//       if (error) throw error

//       setBookingStep(3) // Move to Success Screen
      
//       // Refresh history locally
//       const newBooking = {
//         id: 'temp-' + Date.now(),
//         created_at: new Date().toISOString(),
//         appointment_date: dateObj.toISOString(),
//         status: 'pending',
//         doctors: bookingDoc
//       }
//       setMyBookings([newBooking, ...myBookings])

//     } catch (err) {
//       alert('Booking Failed. Please try again.')
//       console.error(err)
//     } finally {
//       setIsBookingLoading(false)
//     }
//   }

//   const closeBooking = () => {
//     setBookingDoc(null)
//     setBookingStep(1)
//     setSymptom('')
//     setSelectedDate('')
//     setSelectedTime('')
//   }

//   if (loading) return <div className="h-screen flex items-center justify-center"><Loader2 className="animate-spin text-green-500 h-10 w-10"/></div>

//   return (
//     <div className="min-h-screen bg-gray-50 font-sans text-gray-900">
      
//       {/* --- HEADER --- */}
//       <header className="bg-white border-b sticky top-0 z-40 shadow-sm">
//         <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
//           <div className="flex items-center gap-2 font-bold text-xl text-purple-900">
//             <div className="bg-green-500 text-white p-1.5 rounded-lg"><HeartPulse size={20}/></div>
//             DocSlotBooking
//           </div>
//           <button 
//             onClick={async () => { await supabase.auth.signOut(); router.push('/') }} 
//             className="flex items-center gap-2 text-sm font-bold text-gray-500 hover:text-red-500 hover:bg-red-50 px-3 py-1.5 rounded-lg transition-colors"
//           >
//             <LogOut size={16}/> Logout
//           </button>
//         </div>
//       </header>

//       <div className="max-w-7xl mx-auto px-4 py-8 grid lg:grid-cols-12 gap-8">
        
//         {/* === LEFT COLUMN: PERSONAL INFO & HISTORY (4 Cols) === */}
//         <div className="lg:col-span-4 space-y-6">
          
//           {/* 1. Profile Card */}
//           <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
//              <div className="flex items-center gap-4 mb-6">
//                <div className="h-16 w-16 bg-purple-100 rounded-full flex items-center justify-center text-purple-600 font-bold text-2xl border-4 border-white shadow-sm">
//                  {profile?.full_name?.[0] || 'U'}
//                </div>
//                <div>
//                  <h2 className="font-bold text-lg leading-tight">{profile?.full_name || 'User'}</h2>
//                  <p className="text-xs text-gray-400">{user?.email}</p>
//                  <span className="inline-block mt-1 bg-green-100 text-green-700 text-[10px] font-bold px-2 py-0.5 rounded-full">Patient</span>
//                </div>
//              </div>
             
//              <div className="space-y-3 text-sm">
//                <div className="flex justify-between p-3 bg-gray-50 rounded-xl">
//                  <span className="text-gray-500 flex items-center gap-2"><Phone size={14}/> Mobile</span>
//                  <span className="font-bold text-gray-900">{profile?.mobile || 'N/A'}</span>
//                </div>
//                <div className="flex justify-between p-3 bg-gray-50 rounded-xl">
//                  <span className="text-gray-500 flex items-center gap-2"><User size={14}/> Info</span>
//                  <span className="font-bold text-gray-900">{profile?.age ? `${profile.age} Yrs` : '--'} / {profile?.gender || '--'}</span>
//                </div>
//              </div>
//           </div>

//           {/* 2. Booking History Mini-List */}
//           <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 h-[400px] overflow-hidden flex flex-col">
//              <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
//                <History size={18} className="text-green-500"/> Recent Bookings
//              </h3>
             
//              <div className="overflow-y-auto pr-2 space-y-3 flex-1">
//                {myBookings.length === 0 ? (
//                  <div className="text-center py-10">
//                     <History className="mx-auto text-gray-300 h-8 w-8 mb-2"/>
//                     <p className="text-sm text-gray-400">No appointments yet.</p>
//                  </div>
//                ) : (
//                  myBookings.map(appt => (
//                    <div key={appt.id} className="border border-gray-100 p-3 rounded-xl hover:bg-gray-50 transition-colors group">
//                       <div className="flex justify-between items-start mb-1">
//                         <span className="font-bold text-sm text-gray-800">Dr. {appt.doctors?.name}</span>
//                         <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase ${
//                           appt.status === 'confirmed' ? 'bg-green-100 text-green-700' : 
//                           appt.status === 'rejected' ? 'bg-red-50 text-red-500' : 'bg-yellow-100 text-yellow-700'
//                         }`}>{appt.status}</span>
//                       </div>
//                       <p className="text-xs text-gray-500 truncate mb-2">{appt.doctors?.hospitals?.name}</p>
//                       <div className="flex items-center gap-2 text-xs text-gray-400 bg-gray-50 p-2 rounded-lg group-hover:bg-white transition-colors">
//                         <Calendar size={12}/> {new Date(appt.appointment_date).toLocaleDateString()}
//                         <span className="text-gray-300">|</span>
//                         <Clock size={12}/> {new Date(appt.appointment_date).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
//                       </div>
//                    </div>
//                  ))
//                )}
//              </div>
//           </div>
//         </div>


//         {/* === RIGHT COLUMN: SEARCH & BOOKING (8 Cols) === */}
//         <div className="lg:col-span-8 space-y-8">
          
//           {/* 1. Welcome & Info Banner */}
//           <div className="bg-gradient-to-br from-purple-900 to-indigo-800 rounded-3xl p-8 text-white shadow-xl relative overflow-hidden">
//             <div className="relative z-10">
//               <h1 className="text-3xl font-bold mb-2">Hello, {profile?.full_name?.split(' ')[0] || 'User'}!</h1>
//               <p className="text-purple-100 mb-6 max-w-lg text-sm leading-relaxed">
//                 Find the right specialist for your needs. Search by name, specialty or city and get instant confirmation.
//               </p>
              
//               {/* Embedded Search Bar */}
//               <div className="bg-white p-2 rounded-2xl flex flex-col md:flex-row gap-2 shadow-lg shadow-purple-900/20">
//                 <div className="flex-1 flex items-center px-3 h-12 border-b md:border-b-0 md:border-r border-gray-100">
//                   <Search className="text-gray-400 h-5 w-5 mr-3"/>
//                   <input placeholder="Ex: Cardiologist, Dr. Smith..." className="w-full text-gray-900 outline-none placeholder:text-gray-400 text-sm"
//                     value={searchTerm} onChange={e => setSearchTerm(e.target.value)} />
//                 </div>
//                 <div className="flex-1 flex items-center px-3 h-12">
//                   <MapPin className="text-gray-400 h-5 w-5 mr-3"/>
//                   <input placeholder="City (e.g. Mumbai)..." className="w-full text-gray-900 outline-none placeholder:text-gray-400 text-sm"
//                     value={location} onChange={e => setLocation(e.target.value)} />
//                 </div>
//                 <button onClick={fetchDoctors} className="bg-green-500 hover:bg-green-600 text-white px-8 py-2 rounded-xl font-bold transition-all shadow-md shadow-green-200">
//                   {searching ? <Loader2 className="animate-spin"/> : 'Search'}
//                 </button>
//               </div>
//             </div>
            
//             {/* Background Decor */}
//             <div className="absolute right-0 top-0 h-64 w-64 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3"></div>
//           </div>

//           {/* 2. Doctor Results Grid */}
//           <div>
//             <div className="flex justify-between items-center mb-6">
//               <h2 className="font-bold text-xl text-gray-900 flex items-center gap-2">
//                  <Stethoscope className="text-green-600" size={24} /> Available Doctors
//               </h2>
//               <span className="text-xs font-bold bg-gray-200 px-3 py-1 rounded-full text-gray-600">{doctors.length} Found</span>
//             </div>
            
//             <div className="grid md:grid-cols-2 gap-5">
//               {doctors.map(doc => (
//                 <div key={doc.id} className="bg-white border border-gray-100 p-5 rounded-3xl hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col group">
//                   <div className="flex justify-between items-start mb-4">
//                     <div className="flex items-center gap-4">
//                       <div className="h-14 w-14 bg-gray-50 rounded-2xl flex items-center justify-center text-gray-400 font-bold text-xl overflow-hidden">
//                         {doc.image_url ? <img src={doc.image_url} className="h-full w-full object-cover"/> : <User />}
//                       </div>
//                       <div>
//                         <h4 className="font-bold text-gray-900 text-lg">{doc.name}</h4>
//                         <p className="text-xs text-purple-600 font-bold uppercase tracking-wider">{doc.specialty}</p>
//                       </div>
//                     </div>
//                     <div className="bg-yellow-50 text-yellow-700 text-xs font-bold px-2 py-1 rounded-lg flex items-center">
//                       <Star size={12} className="fill-yellow-500 text-yellow-500 mr-1"/> 4.9
//                     </div>
//                   </div>
                  
//                   <div className="bg-gray-50 rounded-xl p-3 mb-4">
//                     <p className="text-xs text-gray-500 font-bold uppercase mb-1">Clinic</p>
//                     <p className="text-sm text-gray-800 font-medium truncate">{doc.hospitals.name}</p>
//                     <p className="text-xs text-gray-500 flex items-center gap-1 mt-1"><MapPin size={10}/> {doc.hospitals.city}</p>
//                   </div>

//                   <div className="mt-auto flex items-center gap-3">
//                     <div className="font-bold text-green-700 text-lg">₹{doc.price}</div>
//                     <button 
//                       onClick={() => setBookingDoc(doc)} 
//                       className="flex-1 bg-gray-900 text-white text-sm font-bold py-3 rounded-xl hover:bg-gray-800 transition-colors flex justify-center items-center gap-2"
//                     >
//                       Book Now <ChevronRight size={14} />
//                     </button>
//                   </div>
//                 </div>
//               ))}
              
//               {doctors.length === 0 && !searching && (
//                  <div className="col-span-2 text-center py-12 bg-white rounded-3xl border border-dashed border-gray-300">
//                     <p className="text-gray-400 font-medium">No doctors found matching your criteria.</p>
//                  </div>
//               )}
//             </div>
//           </div>

//           {/* 3. Info / "Why Us" Section */}
//           <div className="grid grid-cols-3 gap-4">
//              <div className="bg-blue-50 p-6 rounded-2xl border border-blue-100 text-center">
//                 <ShieldCheck className="mx-auto text-blue-600 h-8 w-8 mb-3"/>
//                 <p className="font-bold text-blue-900 text-sm">Verified Doctors</p>
//                 <p className="text-xs text-blue-700/60 mt-1">100% Background Check</p>
//              </div>
//              <div className="bg-purple-50 p-6 rounded-2xl border border-purple-100 text-center">
//                 <History className="mx-auto text-purple-600 h-8 w-8 mb-3"/>
//                 <p className="font-bold text-purple-900 text-sm">Digital Records</p>
//                 <p className="text-xs text-purple-700/60 mt-1">Safe & Secure History</p>
//              </div>
//              <div className="bg-green-50 p-6 rounded-2xl border border-green-100 text-center">
//                 <Stethoscope className="mx-auto text-green-600 h-8 w-8 mb-3"/>
//                 <p className="font-bold text-green-900 text-sm">Instant Care</p>
//                 <p className="text-xs text-green-700/60 mt-1">Book in 30 seconds</p>
//              </div>
//           </div>

//         </div>
//       </div>

//       {/* --- ADVANCED BOOKING MODAL --- */}
//       {bookingDoc && (
//         <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-end md:items-center justify-center p-4 animate-in fade-in duration-200">
//           <div className="bg-white rounded-3xl w-full max-w-lg shadow-2xl overflow-hidden flex flex-col max-h-[90vh] animate-in slide-in-from-bottom-10">
             
//              {/* Modal Header */}
//              <div className="bg-gray-50 p-5 border-b border-gray-100 flex justify-between items-center sticky top-0 z-10">
//                <div>
//                   <p className="text-xs font-bold text-purple-600 uppercase tracking-wide">New Appointment</p>
//                   <h3 className="font-bold text-lg text-gray-900">{bookingDoc.name}</h3>
//                   <p className="text-xs text-gray-500">{bookingDoc.hospitals.name}</p>
//                </div>
//                <button onClick={closeBooking} className="bg-white p-2 rounded-full border border-gray-200 text-gray-500 hover:bg-gray-100 transition-colors">
//                  <X size={18}/>
//                </button>
//              </div>
             
//              <div className="p-6 overflow-y-auto">
               
//                {/* STEP 1: DATE & TIME */}
//                {bookingStep === 1 && (
//                  <div className="space-y-6">
//                     {/* Date Selector */}
//                     <div>
//                       <h4 className="font-bold text-gray-800 mb-3 flex items-center gap-2 text-sm"><Calendar size={16}/> Select Date</h4>
//                       <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
//                         {getNextDays().map((d, i) => {
//                           const dateStr = d.toDateString()
//                           const isSel = selectedDate === dateStr
//                           return (
//                             <button key={i} onClick={() => setSelectedDate(dateStr)}
//                               className={`min-w-[80px] flex-1 py-3 rounded-xl border text-center transition-all ${isSel ? 'bg-purple-600 text-white border-purple-600 shadow-md' : 'border-gray-100 text-gray-600 hover:border-purple-200'}`}
//                             >
//                               <span className="block text-[10px] font-bold uppercase opacity-80">{i === 0 ? 'Today' : d.toLocaleDateString('en-US', {weekday: 'short'})}</span>
//                               <span className="block text-xl font-bold">{d.getDate()}</span>
//                             </button>
//                           )
//                         })}
//                       </div>
//                     </div>

//                     {/* Time Selector */}
//                     <div className={`transition-all ${selectedDate ? 'opacity-100' : 'opacity-40 pointer-events-none'}`}>
//                       <h4 className="font-bold text-gray-800 mb-3 flex items-center gap-2 text-sm"><Clock size={16}/> Select Time</h4>
//                       <div className="grid grid-cols-3 gap-3">
//                         {generateSlots().map(slot => (
//                           <button key={slot} onClick={() => setSelectedTime(slot)}
//                             className={`py-2 text-sm font-medium rounded-lg border transition-all ${selectedTime === slot ? 'bg-green-500 text-white border-green-500 shadow-md' : 'border-gray-200 text-gray-600 hover:border-green-400'}`}
//                           >
//                             {slot}
//                           </button>
//                         ))}
//                       </div>
//                     </div>

//                     <button disabled={!selectedDate || !selectedTime} onClick={() => setBookingStep(2)}
//                       className="w-full mt-4 bg-gray-900 disabled:opacity-50 text-white font-bold py-3.5 rounded-xl hover:bg-gray-800 transition-all flex justify-center items-center gap-2 shadow-lg"
//                     >
//                       Continue <ChevronRight size={16}/>
//                     </button>
//                  </div>
//                )}

//                {/* STEP 2: PROBLEM / CONFIRM */}
//                {bookingStep === 2 && (
//                  <div className="space-y-5 animate-in slide-in-from-right-10">
//                     <div className="bg-purple-50 p-4 rounded-xl flex gap-3 items-center border border-purple-100">
//                       <div className="bg-white p-2 rounded-lg text-purple-600 shadow-sm"><Calendar size={20}/></div>
//                       <div>
//                         <p className="text-xs text-gray-500 font-bold uppercase">Booking On</p>
//                         <p className="font-bold text-purple-900">{selectedDate} at {selectedTime}</p>
//                       </div>
//                     </div>

//                     <div>
//                       <label className="font-bold text-gray-800 text-sm mb-2 block">Reason for visit (Optional)</label>
//                       <textarea 
//                         className="w-full p-4 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:ring-2 ring-purple-500 text-sm h-28 resize-none"
//                         placeholder="e.g. Fever, Consultation, Checkup..."
//                         value={symptom} onChange={e => setSymptom(e.target.value)}
//                       />
//                     </div>

//                     <div className="flex gap-3 pt-2">
//                        <button onClick={() => setBookingStep(1)} className="px-5 py-3 rounded-xl font-bold text-gray-500 hover:bg-gray-100 transition-colors">Back</button>
//                        <button onClick={handleConfirmBooking} disabled={isBookingLoading}
//                          className="flex-1 bg-green-500 text-white font-bold py-3 rounded-xl hover:bg-green-600 shadow-lg shadow-green-200 flex justify-center items-center"
//                        >
//                          {isBookingLoading ? <Loader2 className="animate-spin"/> : 'Confirm Booking'}
//                        </button>
//                     </div>
//                  </div>
//                )}

//                {/* STEP 3: SUCCESS */}
//                {bookingStep === 3 && (
//                  <div className="text-center py-10 animate-in zoom-in-95">
//                     <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
//                       <CheckCircle2 size={40}/>
//                     </div>
//                     <h3 className="text-2xl font-bold text-gray-900 mb-2">Booking Confirmed!</h3>
//                     <p className="text-gray-500 text-sm mb-8">We have sent the details to <b>Dr. {bookingDoc.name}</b>.</p>
//                     <button onClick={closeBooking} className="w-full bg-gray-900 text-white font-bold py-3.5 rounded-xl shadow-lg hover:bg-gray-800">
//                       Back to Dashboard
//                     </button>
//                  </div>
//                )}

//              </div>
//           </div>
//         </div>
//       )}
//     </div>
//   )
// }



'use client'

import { useState, useEffect, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import { 
  Search, MapPin, HeartPulse, User, Phone, 
  Calendar, Clock, ShieldCheck, History, Stethoscope, 
  LogOut, Star, X, Loader2, ChevronRight, CheckCircle2 
} from 'lucide-react'

// Types
type Doctor = {
  id: string
  name: string
  specialty: string
  price: number
  image_url: string | null
  hospitals: { name: string, city: string }
}

export default function ProfilePage() {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  
  // User Data
  const [user, setUser] = useState<any>(null)
  const [profile, setProfile] = useState<any>(null)
  const [myBookings, setMyBookings] = useState<any[]>([])

  // Search Data
  const [doctors, setDoctors] = useState<Doctor[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [location, setLocation] = useState('')
  const [searching, setSearching] = useState(false)
  
  // --- BOOKING STATE ---
  const [bookingDoc, setBookingDoc] = useState<Doctor | null>(null)
  const [bookingStep, setBookingStep] = useState(1) // 1: Slot, 2: Reason, 3: Success
  const [selectedDate, setSelectedDate] = useState<string>('')
  const [selectedTime, setSelectedTime] = useState<string>('')
  const [symptom, setSymptom] = useState('')
  const [isBookingLoading, setIsBookingLoading] = useState(false)

  // --- 1. FETCH DATA (Wrapped in useCallback for Realtime reuse) ---
  const fetchMyBookings = useCallback(async (userId: string) => {
    const { data: history } = await supabase
      .from('appointments')
      .select('*, doctors(name, hospitals(name))')
      .eq('patient_id', userId)
      .order('created_at', { ascending: false })
    
    if (history) setMyBookings(history)
  }, [])

  // --- 2. INITIAL LOAD ---
  useEffect(() => {
    const init = async () => {
      // Get Auth User
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) { router.push('/auth'); return }

      // 🛑 SECURITY CHECK: Redirect if user is a Hospital
      if (user.user_metadata?.role === 'hospital') {
        router.push('/hospital/dashboard')
        return
      }

      setUser(user)

      // Get Profile Details
      const { data: profileData } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single()
      
      const finalProfile = {
        ...profileData,
        full_name: profileData?.full_name || user.user_metadata?.full_name,
        mobile: profileData?.mobile || user.user_metadata?.mobile
      }
      setProfile(finalProfile)

      // Load Data
      await fetchMyBookings(user.id)
      fetchDoctors()
      setLoading(false)
    }
    init()
  }, [router, fetchMyBookings])

  // --- 3. REALTIME LISTENER (Auto-update Status) ---
  useEffect(() => {
    if (!user) return

    const channel = supabase
      .channel('patient-updates')
      .on(
        'postgres_changes',
        { 
          event: 'UPDATE', 
          schema: 'public', 
          table: 'appointments',
          filter: `patient_id=eq.${user.id}` // Only listen to MY appointments
        },
        (payload) => {
          console.log("Status Updated!", payload)
          fetchMyBookings(user.id) // Refresh list instantly
        }
      )
      .subscribe()

    return () => { supabase.removeChannel(channel) }
  }, [user, fetchMyBookings])

  // --- 4. SEARCH LOGIC ---
  const fetchDoctors = async () => {
    setSearching(true)
    try {
      let query = supabase.from('doctors').select(`*, hospitals!inner(name, city)`)
      
      if (searchTerm) {
        query = query.or(`name.ilike.%${searchTerm}%,specialty.ilike.%${searchTerm}%`)
      }

      const { data, error } = await query
      if (error) throw error

      const filtered = (data as any[]).filter(doc => {
        if (!location) return true
        return doc.hospitals.city.toLowerCase().includes(location.toLowerCase()) || 
               doc.hospitals.name.toLowerCase().includes(location.toLowerCase())
      })
      setDoctors(filtered)
    } catch (err) {
      console.error(err)
    } finally {
      setSearching(false)
    }
  }

  // --- 5. HELPER FUNCTIONS ---
  const generateSlots = () => ['10:00 AM', '10:30 AM', '11:00 AM', '11:30 AM', '04:00 PM', '04:30 PM', '05:00 PM']
  
  const getNextDays = () => {
    const dates = []
    for(let i=0; i<4; i++) {
      const d = new Date()
      d.setDate(d.getDate() + i)
      dates.push(d)
    }
    return dates
  }

  // --- 6. CONFIRM BOOKING ---
  const handleConfirmBooking = async () => {
    if (!bookingDoc || !user) return
    setIsBookingLoading(true)

    try {
      // Parse Date and Time safely
      const dateObj = new Date(selectedDate)
      const [time, period] = selectedTime.split(' ')
      let [hours, minutes] = time.split(':').map(Number)
      if (period === 'PM' && hours !== 12) hours += 12
      if (period === 'AM' && hours === 12) hours = 0
      dateObj.setHours(hours, minutes, 0)

      // Payload
      const payload = {
        doctor_id: bookingDoc.id,
        patient_id: user.id,
        patient_name: profile?.full_name || 'Guest User',
        patient_mobile: profile?.mobile || 'N/A',
        appointment_date: dateObj.toISOString(),
        status: 'pending'
      }

      // INSERT
      const { error } = await supabase.from('appointments').insert(payload)

      if (error) throw error

      setBookingStep(3) // Success
      
      // Refresh list
      fetchMyBookings(user.id)

    } catch (err) {
      alert('Booking Failed. Please try again.')
      console.error(err)
    } finally {
      setIsBookingLoading(false)
    }
  }

  const closeBooking = () => {
    setBookingDoc(null)
    setBookingStep(1)
    setSymptom('')
    setSelectedDate('')
    setSelectedTime('')
  }

  if (loading) return <div className="h-screen flex items-center justify-center"><Loader2 className="animate-spin text-green-500 h-10 w-10"/></div>

  return (
    <div className="min-h-screen bg-gray-50 font-sans text-gray-900">
      
      {/* --- HEADER --- */}
      <header className="bg-white border-b sticky top-0 z-40 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2 font-bold text-xl text-purple-900">
            <div className="bg-green-500 text-white p-1.5 rounded-lg"><HeartPulse size={20}/></div>
            DocSlotBooking
          </div>
          <button 
            onClick={async () => { await supabase.auth.signOut(); router.push('/') }} 
            className="flex items-center gap-2 text-sm font-bold text-gray-500 hover:text-red-500 hover:bg-red-50 px-3 py-1.5 rounded-lg transition-colors"
          >
            <LogOut size={16}/> Logout
          </button>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 py-8 grid lg:grid-cols-12 gap-8">
        
        {/* === LEFT COLUMN: INFO & HISTORY === */}
        <div className="lg:col-span-4 space-y-6">
          
          {/* Profile Card */}
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
             <div className="flex items-center gap-4 mb-6">
               <div className="h-16 w-16 bg-purple-100 rounded-full flex items-center justify-center text-purple-600 font-bold text-2xl border-4 border-white shadow-sm">
                 {profile?.full_name?.[0]?.toUpperCase() || 'U'}
               </div>
               <div>
                 <h2 className="font-bold text-lg leading-tight">{profile?.full_name || 'User'}</h2>
                 <p className="text-xs text-gray-400">{user?.email}</p>
                 <span className="inline-block mt-1 bg-green-100 text-green-700 text-[10px] font-bold px-2 py-0.5 rounded-full">Patient</span>
               </div>
             </div>
             
             <div className="space-y-3 text-sm">
               <div className="flex justify-between p-3 bg-gray-50 rounded-xl">
                 <span className="text-gray-500 flex items-center gap-2"><Phone size={14}/> Mobile</span>
                 <span className="font-bold text-gray-900">{profile?.mobile || 'N/A'}</span>
               </div>
               <div className="flex justify-between p-3 bg-gray-50 rounded-xl">
                 <span className="text-gray-500 flex items-center gap-2"><User size={14}/> Info</span>
                 <span className="font-bold text-gray-900">{profile?.age ? `${profile.age} Yrs` : '--'} / {profile?.gender || '--'}</span>
               </div>
             </div>
          </div>

          {/* Booking History (Live Updates) */}
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 h-[400px] overflow-hidden flex flex-col">
             <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
               <History size={18} className="text-green-500"/> Recent Bookings
             </h3>
             
             <div className="overflow-y-auto pr-2 space-y-3 flex-1">
               {myBookings.length === 0 ? (
                 <div className="text-center py-10">
                    <History className="mx-auto text-gray-300 h-8 w-8 mb-2"/>
                    <p className="text-sm text-gray-400">No appointments yet.</p>
                 </div>
               ) : (
                 myBookings.map(appt => (
                   <div key={appt.id} className="border border-gray-100 p-3 rounded-xl hover:bg-gray-50 transition-colors group">
                      <div className="flex justify-between items-start mb-1">
                        <span className="font-bold text-sm text-gray-800">Dr. {appt.doctors?.name}</span>
                        {/* Status Badge */}
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase transition-all duration-300 ${
                          appt.status === 'confirmed' ? 'bg-green-100 text-green-700' : 
                          appt.status === 'rejected' ? 'bg-red-50 text-red-500' : 'bg-yellow-100 text-yellow-700'
                        }`}>
                          {appt.status}
                        </span>
                      </div>
                      <p className="text-xs text-gray-500 truncate mb-2">{appt.doctors?.hospitals?.name}</p>
                      <div className="flex items-center gap-2 text-xs text-gray-400 bg-gray-50 p-2 rounded-lg group-hover:bg-white transition-colors">
                        <Calendar size={12}/> {new Date(appt.appointment_date).toLocaleDateString()}
                        <span className="text-gray-300">|</span>
                        <Clock size={12}/> {new Date(appt.appointment_date).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                      </div>
                   </div>
                 ))
               )}
             </div>
          </div>
        </div>


        {/* === RIGHT COLUMN: SEARCH & BOOKING === */}
        <div className="lg:col-span-8 space-y-8">
          
          {/* Welcome Banner */}
          <div className="bg-gradient-to-br from-purple-900 to-indigo-800 rounded-3xl p-8 text-white shadow-xl relative overflow-hidden">
            <div className="relative z-10">
              <h1 className="text-3xl font-bold mb-2">Hello, {profile?.full_name?.split(' ')[0] || 'User'}!</h1>
              <p className="text-purple-100 mb-6 max-w-lg text-sm leading-relaxed">
                Find the right specialist for your needs. Search by name, specialty or city and get instant confirmation.
              </p>
              
              <div className="bg-white p-2 rounded-2xl flex flex-col md:flex-row gap-2 shadow-lg shadow-purple-900/20">
                <div className="flex-1 flex items-center px-3 h-12 border-b md:border-b-0 md:border-r border-gray-100">
                  <Search className="text-gray-400 h-5 w-5 mr-3"/>
                  <input placeholder="Ex: Cardiologist, Dr. Smith..." className="w-full text-gray-900 outline-none placeholder:text-gray-400 text-sm"
                    value={searchTerm} onChange={e => setSearchTerm(e.target.value)} />
                </div>
                <div className="flex-1 flex items-center px-3 h-12">
                  <MapPin className="text-gray-400 h-5 w-5 mr-3"/>
                  <input placeholder="City (e.g. Mumbai)..." className="w-full text-gray-900 outline-none placeholder:text-gray-400 text-sm"
                    value={location} onChange={e => setLocation(e.target.value)} />
                </div>
                <button onClick={fetchDoctors} className="bg-green-500 hover:bg-green-600 text-white px-8 py-2 rounded-xl font-bold transition-all shadow-md shadow-green-200">
                  {searching ? <Loader2 className="animate-spin"/> : 'Search'}
                </button>
              </div>
            </div>
            
            <div className="absolute right-0 top-0 h-64 w-64 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3"></div>
          </div>

          {/* Doctors Grid */}
          <div>
            <div className="flex justify-between items-center mb-6">
              <h2 className="font-bold text-xl text-gray-900 flex items-center gap-2">
                 <Stethoscope className="text-green-600" size={24} /> Available Doctors
              </h2>
              <span className="text-xs font-bold bg-gray-200 px-3 py-1 rounded-full text-gray-600">{doctors.length} Found</span>
            </div>
            
            <div className="grid md:grid-cols-2 gap-5">
              {doctors.map(doc => (
                <div key={doc.id} className="bg-white border border-gray-100 p-5 rounded-3xl hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col group">
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex items-center gap-4">
                      <div className="h-14 w-14 bg-gray-50 rounded-2xl flex items-center justify-center text-gray-400 font-bold text-xl overflow-hidden">
                        {doc.image_url ? <img src={doc.image_url} className="h-full w-full object-cover"/> : <User />}
                      </div>
                      <div>
                        <h4 className="font-bold text-gray-900 text-lg">{doc.name}</h4>
                        <p className="text-xs text-purple-600 font-bold uppercase tracking-wider">{doc.specialty}</p>
                      </div>
                    </div>
                    <div className="bg-yellow-50 text-yellow-700 text-xs font-bold px-2 py-1 rounded-lg flex items-center">
                      <Star size={12} className="fill-yellow-500 text-yellow-500 mr-1"/> 4.9
                    </div>
                  </div>
                  
                  <div className="bg-gray-50 rounded-xl p-3 mb-4">
                    <p className="text-xs text-gray-500 font-bold uppercase mb-1">Clinic</p>
                    <p className="text-sm text-gray-800 font-medium truncate">{doc.hospitals.name}</p>
                    <p className="text-xs text-gray-500 flex items-center gap-1 mt-1"><MapPin size={10}/> {doc.hospitals.city}</p>
                  </div>

                  <div className="mt-auto flex items-center gap-3">
                    <div className="font-bold text-green-700 text-lg">₹{doc.price}</div>
                    <button 
                      onClick={() => setBookingDoc(doc)} 
                      className="flex-1 bg-gray-900 text-white text-sm font-bold py-3 rounded-xl hover:bg-gray-800 transition-colors flex justify-center items-center gap-2"
                    >
                      Book Now <ChevronRight size={14} />
                    </button>
                  </div>
                </div>
              ))}
              
              {doctors.length === 0 && !searching && (
                 <div className="col-span-2 text-center py-12 bg-white rounded-3xl border border-dashed border-gray-300">
                    <p className="text-gray-400 font-medium">No doctors found matching your criteria.</p>
                 </div>
              )}
            </div>
          </div>

          {/* Info Section */}
          <div className="grid grid-cols-3 gap-4">
             <div className="bg-blue-50 p-6 rounded-2xl border border-blue-100 text-center">
                <ShieldCheck className="mx-auto text-blue-600 h-8 w-8 mb-3"/>
                <p className="font-bold text-blue-900 text-sm">Verified Doctors</p>
                <p className="text-xs text-blue-700/60 mt-1">100% Background Check</p>
             </div>
             <div className="bg-purple-50 p-6 rounded-2xl border border-purple-100 text-center">
                <History className="mx-auto text-purple-600 h-8 w-8 mb-3"/>
                <p className="font-bold text-purple-900 text-sm">Digital Records</p>
                <p className="text-xs text-purple-700/60 mt-1">Safe & Secure History</p>
             </div>
             <div className="bg-green-50 p-6 rounded-2xl border border-green-100 text-center">
                <Stethoscope className="mx-auto text-green-600 h-8 w-8 mb-3"/>
                <p className="font-bold text-green-900 text-sm">Instant Care</p>
                <p className="text-xs text-green-700/60 mt-1">Book in 30 seconds</p>
             </div>
          </div>

        </div>
      </div>

      {/* --- BOOKING MODAL --- */}
      {bookingDoc && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-end md:items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl w-full max-w-lg shadow-2xl overflow-hidden flex flex-col max-h-[90vh] animate-in slide-in-from-bottom-10">
             
             {/* Header */}
             <div className="bg-gray-50 p-5 border-b border-gray-100 flex justify-between items-center sticky top-0 z-10">
               <div>
                  <p className="text-xs font-bold text-purple-600 uppercase tracking-wide">New Appointment</p>
                  <h3 className="font-bold text-lg text-gray-900">{bookingDoc.name}</h3>
                  <p className="text-xs text-gray-500">{bookingDoc.hospitals.name}</p>
               </div>
               <button onClick={closeBooking} className="bg-white p-2 rounded-full border border-gray-200 text-gray-500 hover:bg-gray-100 transition-colors">
                 <X size={18}/>
               </button>
             </div>
             
             <div className="p-6 overflow-y-auto">
               
               {/* Step 1: Date & Time */}
               {bookingStep === 1 && (
                 <div className="space-y-6">
                    <div>
                      <h4 className="font-bold text-gray-800 mb-3 flex items-center gap-2 text-sm"><Calendar size={16}/> Select Date</h4>
                      <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
                        {getNextDays().map((d, i) => {
                          const dateStr = d.toDateString()
                          const isSel = selectedDate === dateStr
                          return (
                            <button key={i} onClick={() => setSelectedDate(dateStr)}
                              className={`min-w-[80px] flex-1 py-3 rounded-xl border text-center transition-all ${isSel ? 'bg-purple-600 text-white border-purple-600 shadow-md' : 'border-gray-100 text-gray-600 hover:border-purple-200'}`}
                            >
                              <span className="block text-[10px] font-bold uppercase opacity-80">{i === 0 ? 'Today' : d.toLocaleDateString('en-US', {weekday: 'short'})}</span>
                              <span className="block text-xl font-bold">{d.getDate()}</span>
                            </button>
                          )
                        })}
                      </div>
                    </div>

                    <div className={`transition-all ${selectedDate ? 'opacity-100' : 'opacity-40 pointer-events-none'}`}>
                      <h4 className="font-bold text-gray-800 mb-3 flex items-center gap-2 text-sm"><Clock size={16}/> Select Time</h4>
                      <div className="grid grid-cols-3 gap-3">
                        {generateSlots().map(slot => (
                          <button key={slot} onClick={() => setSelectedTime(slot)}
                            className={`py-2 text-sm font-medium rounded-lg border transition-all ${selectedTime === slot ? 'bg-green-500 text-white border-green-500 shadow-md' : 'border-gray-200 text-gray-600 hover:border-green-400'}`}
                          >
                            {slot}
                          </button>
                        ))}
                      </div>
                    </div>

                    <button disabled={!selectedDate || !selectedTime} onClick={() => setBookingStep(2)}
                      className="w-full mt-4 bg-gray-900 disabled:opacity-50 text-white font-bold py-3.5 rounded-xl hover:bg-gray-800 transition-all flex justify-center items-center gap-2 shadow-lg"
                    >
                      Continue <ChevronRight size={16}/>
                    </button>
                 </div>
               )}

               {/* Step 2: Confirm */}
               {bookingStep === 2 && (
                 <div className="space-y-5 animate-in slide-in-from-right-10">
                    <div className="bg-purple-50 p-4 rounded-xl flex gap-3 items-center border border-purple-100">
                      <div className="bg-white p-2 rounded-lg text-purple-600 shadow-sm"><Calendar size={20}/></div>
                      <div>
                        <p className="text-xs text-gray-500 font-bold uppercase">Booking On</p>
                        <p className="font-bold text-purple-900">{selectedDate} at {selectedTime}</p>
                      </div>
                    </div>

                    <div>
                      <label className="font-bold text-gray-800 text-sm mb-2 block">Reason for visit (Optional)</label>
                      <textarea 
                        className="w-full p-4 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:ring-2 ring-purple-500 text-sm h-28 resize-none"
                        placeholder="e.g. Fever, Consultation, Checkup..."
                        value={symptom} onChange={e => setSymptom(e.target.value)}
                      />
                    </div>

                    <div className="flex gap-3 pt-2">
                       <button onClick={() => setBookingStep(1)} className="px-5 py-3 rounded-xl font-bold text-gray-500 hover:bg-gray-100 transition-colors">Back</button>
                       <button onClick={handleConfirmBooking} disabled={isBookingLoading}
                         className="flex-1 bg-green-500 text-white font-bold py-3 rounded-xl hover:bg-green-600 shadow-lg shadow-green-200 flex justify-center items-center"
                       >
                         {isBookingLoading ? <Loader2 className="animate-spin"/> : 'Confirm Booking'}
                       </button>
                    </div>
                 </div>
               )}

               {/* Step 3: Success */}
               {bookingStep === 3 && (
                 <div className="text-center py-10 animate-in zoom-in-95">
                    <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                      <CheckCircle2 size={40}/>
                    </div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-2">Booking Confirmed!</h3>
                    <p className="text-gray-500 text-sm mb-8">We have sent the details to <b>Dr. {bookingDoc.name}</b>.</p>
                    <button onClick={closeBooking} className="w-full bg-gray-900 text-white font-bold py-3.5 rounded-xl shadow-lg hover:bg-gray-800">
                      Back to Dashboard
                    </button>
                 </div>
               )}

             </div>
          </div>
        </div>
      )}
    </div>
  )
}
