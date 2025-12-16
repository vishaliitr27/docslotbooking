// 'use client'

// import { useState, useEffect } from 'react'
// import { useRouter } from 'next/navigation'
// import { supabase } from '@/lib/supabase'
// import { 
//   LayoutDashboard, UserPlus, Users, Calendar, 
//   LogOut, Plus, Trash2, MapPin, Loader2 
// } from 'lucide-react'

// export default function HospitalDashboard() {
//   const router = useRouter()
//   const [loading, setLoading] = useState(true)
//   const [activeTab, setActiveTab] = useState('overview')
  
//   // Data State
//   const [hospital, setHospital] = useState<any>(null)
//   const [doctors, setDoctors] = useState<any[]>([])
//   const [appointments, setAppointments] = useState<any[]>([])

//   // Form State for New Doctor
//   const [isAddMode, setIsAddMode] = useState(false)
//   const [newDoc, setNewDoc] = useState({
//     name: '',
//     specialty: '',
//     price: '',
//     experience: ''
//   })

//   // --- 1. INITIAL DATA FETCH ---
//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         const { data: { user } } = await supabase.auth.getUser()
//         if (!user) { router.push('/hospital/auth'); return }

//         // 1. Get Hospital Details
//         const { data: hospData, error: hospError } = await supabase
//           .from('hospitals')
//           .select('*')
//           .eq('owner_id', user.id)
//           .single()
        
//         if (hospError || !hospData) throw new Error("Hospital not found")
//         setHospital(hospData)

//         // 2. Get Doctors
//         const { data: docData } = await supabase
//           .from('doctors')
//           .select('*')
//           .eq('hospital_id', hospData.id)
        
//         if (docData) setDoctors(docData)

//         // 3. Get Appointments (Linked to these doctors)
//         if (docData && docData.length > 0) {
//           const doctorIds = docData.map(d => d.id)
//           const { data: apptData } = await supabase
//             .from('appointments')
//             .select(`
//               *,
//               doctors (name, specialty)
//             `)
//             .in('doctor_id', doctorIds)
//             .order('appointment_date', { ascending: true })
          
//           if (apptData) setAppointments(apptData)
//         }

//       } catch (error) {
//         console.error(error)
//       } finally {
//         setLoading(false)
//       }
//     }
//     fetchData()
//   }, [])

//   // --- 2. ADD DOCTOR LOGIC ---
//   const handleAddDoctor = async (e: React.FormEvent) => {
//     e.preventDefault()
//     if (!hospital) return

//     const { data, error } = await supabase.from('doctors').insert({
//       hospital_id: hospital.id,
//       name: newDoc.name,
//       specialty: newDoc.specialty,
//       price: parseFloat(newDoc.price),
//       image_url: null // Simplified for now
//     }).select()

//     if (!error && data) {
//       setDoctors([...doctors, data[0]])
//       setIsAddMode(false)
//       setNewDoc({ name: '', specialty: '', price: '', experience: '' })
//     } else {
//       alert('Error adding doctor')
//     }
//   }

//   // --- 3. DELETE DOCTOR LOGIC ---
//   const handleDeleteDoctor = async (id: string) => {
//     if(!confirm("Are you sure? This will hide the doctor from users.")) return;
    
//     const { error } = await supabase.from('doctors').delete().eq('id', id)
//     if(!error) {
//       setDoctors(doctors.filter(d => d.id !== id))
//     }
//   }

//   // --- 4. LOGOUT ---
//   const handleLogout = async () => {
//     await supabase.auth.signOut()
//     router.push('/')
//   }

//   if (loading) return <div className="h-screen flex items-center justify-center"><Loader2 className="animate-spin text-purple-600"/></div>

//   return (
//     <div className="min-h-screen bg-gray-50 flex font-sans text-gray-900">
      
//       {/* --- SIDEBAR --- */}
//       <aside className="w-64 bg-purple-900 text-white flex flex-col fixed h-full z-10">
//         <div className="p-6">
//           <h1 className="text-xl font-bold flex items-center gap-2">
//             <LayoutDashboard /> Partner Portal
//           </h1>
//           <p className="text-purple-300 text-xs mt-1">{hospital?.name}</p>
//         </div>

//         <nav className="flex-1 px-4 space-y-2 mt-4">
//           <SidebarItem icon={<LayoutDashboard size={20}/>} label="Overview" active={activeTab === 'overview'} onClick={() => setActiveTab('overview')} />
//           <SidebarItem icon={<UserPlus size={20}/>} label="Doctors" active={activeTab === 'doctors'} onClick={() => setActiveTab('doctors')} />
//           <SidebarItem icon={<Calendar size={20}/>} label="Appointments" active={activeTab === 'appointments'} onClick={() => setActiveTab('appointments')} />
//         </nav>

//         <div className="p-4 border-t border-purple-800">
//           <button onClick={handleLogout} className="flex items-center gap-3 text-purple-200 hover:text-white transition-colors text-sm w-full p-2">
//             <LogOut size={18} /> Logout
//           </button>
//         </div>
//       </aside>

//       {/* --- MAIN CONTENT --- */}
//       <main className="flex-1 ml-64 p-8">
        
//         {/* OVERVIEW TAB */}
//         {activeTab === 'overview' && (
//           <div className="space-y-6 animate-in fade-in">
//             <h2 className="text-2xl font-bold">Dashboard Overview</h2>
//             <div className="grid grid-cols-3 gap-6">
//               <StatCard title="Total Doctors" value={doctors.length} icon={<Users className="text-blue-500"/>} />
//               <StatCard title="Total Appointments" value={appointments.length} icon={<Calendar className="text-green-500"/>} />
//               <StatCard title="Revenue (Est)" value={`₹${appointments.reduce((acc, curr) => acc + (curr.doctors?.price || 0), 0)}`} icon={<div className="font-bold text-yellow-500">₹</div>} />
//             </div>
            
//             <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
//               <h3 className="font-bold mb-4">Hospital Details</h3>
//               <div className="text-sm space-y-2">
//                 <p><span className="text-gray-500">Name:</span> {hospital.name}</p>
//                 <p><span className="text-gray-500">City:</span> {hospital.city}</p>
//                 <p><span className="text-gray-500">Contact:</span> {hospital.contact_number}</p>
//               </div>
//             </div>
//           </div>
//         )}

//         {/* DOCTORS TAB */}
//         {activeTab === 'doctors' && (
//           <div className="space-y-6 animate-in fade-in">
//             <div className="flex justify-between items-center">
//               <h2 className="text-2xl font-bold">Manage Doctors</h2>
//               <button 
//                 onClick={() => setIsAddMode(!isAddMode)}
//                 className="bg-purple-900 text-white px-4 py-2 rounded-xl text-sm font-bold flex items-center gap-2 hover:bg-purple-800"
//               >
//                 {isAddMode ? 'Cancel' : <><Plus size={18}/> Add Doctor</>}
//               </button>
//             </div>

//             {isAddMode && (
//               <form onSubmit={handleAddDoctor} className="bg-white p-6 rounded-2xl shadow-lg border border-purple-100 mb-6 animate-in slide-in-from-top-4">
//                 <h3 className="font-bold text-lg mb-4">Add New Specialist</h3>
//                 <div className="grid grid-cols-2 gap-4 mb-4">
//                   <input required placeholder="Dr. Name" className="p-3 bg-gray-50 rounded-xl border outline-none" 
//                     value={newDoc.name} onChange={e => setNewDoc({...newDoc, name: e.target.value})} />
//                   <input required placeholder="Specialty (e.g. Cardiologist)" className="p-3 bg-gray-50 rounded-xl border outline-none" 
//                     value={newDoc.specialty} onChange={e => setNewDoc({...newDoc, specialty: e.target.value})} />
//                   <input required type="number" placeholder="Consultation Fee (₹)" className="p-3 bg-gray-50 rounded-xl border outline-none" 
//                     value={newDoc.price} onChange={e => setNewDoc({...newDoc, price: e.target.value})} />
//                 </div>
//                 <button type="submit" className="bg-green-500 text-white px-6 py-2 rounded-xl font-bold hover:bg-green-600">
//                   Save Doctor
//                 </button>
//               </form>
//             )}

//             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//               {doctors.map(doc => (
//                 <div key={doc.id} className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex flex-col relative group">
//                   <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
//                     <button onClick={() => handleDeleteDoctor(doc.id)} className="text-red-400 hover:text-red-600 p-1"><Trash2 size={18}/></button>
//                   </div>
//                   <div className="w-12 h-12 bg-purple-100 text-purple-600 rounded-full flex items-center justify-center font-bold text-xl mb-4">
//                     {doc.name[0]}
//                   </div>
//                   <h3 className="font-bold text-lg">{doc.name}</h3>
//                   <p className="text-sm text-gray-500 mb-2">{doc.specialty}</p>
//                   <p className="font-bold text-green-600">₹{doc.price}</p>
//                 </div>
//               ))}
//               {doctors.length === 0 && !isAddMode && (
//                 <div className="col-span-full text-center py-10 text-gray-400">No doctors added yet. Click "Add Doctor" to start.</div>
//               )}
//             </div>
//           </div>
//         )}

//         {/* APPOINTMENTS TAB */}
//         {activeTab === 'appointments' && (
//           <div className="space-y-6 animate-in fade-in">
//              <h2 className="text-2xl font-bold">Upcoming Appointments</h2>
//              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
//                 <table className="w-full text-left text-sm">
//                   <thead className="bg-gray-50 border-b border-gray-100 text-gray-500">
//                     <tr>
//                       <th className="p-4 font-bold">Patient Name</th>
//                       <th className="p-4 font-bold">Doctor</th>
//                       <th className="p-4 font-bold">Date & Time</th>
//                       <th className="p-4 font-bold">Contact</th>
//                     </tr>
//                   </thead>
//                   <tbody className="divide-y divide-gray-50">
//                     {appointments.map(appt => (
//                       <tr key={appt.id} className="hover:bg-gray-50 transition-colors">
//                         <td className="p-4 font-medium text-gray-900">{appt.patient_name || 'Guest User'}</td>
//                         <td className="p-4 text-purple-700 font-medium">Dr. {appt.doctors?.name}</td>
//                         <td className="p-4 text-gray-500">
//                           {new Date(appt.appointment_date).toLocaleDateString()} at {new Date(appt.appointment_date).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
//                         </td>
//                         <td className="p-4 text-gray-500">{appt.patient_mobile || 'N/A'}</td>
//                       </tr>
//                     ))}
//                     {appointments.length === 0 && (
//                       <tr><td colSpan={4} className="p-8 text-center text-gray-400">No appointments found.</td></tr>
//                     )}
//                   </tbody>
//                 </table>
//              </div>
//           </div>
//         )}
//       </main>
//     </div>
//   )
// }

// // Helper Components
// function SidebarItem({ icon, label, active, onClick }: any) {
//   return (
//     <button 
//       onClick={onClick}
//       className={`w-full flex items-center gap-3 p-3 rounded-xl transition-all font-medium text-sm ${
//         active ? 'bg-purple-800 text-white shadow-lg' : 'text-purple-200 hover:bg-purple-800/50 hover:text-white'
//       }`}
//     >
//       {icon} {label}
//     </button>
//   )
// }

// function StatCard({ title, value, icon }: any) {
//   return (
//     <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex items-center justify-between">
//       <div>
//         <p className="text-gray-500 text-xs font-bold uppercase mb-1">{title}</p>
//         <h3 className="text-3xl font-bold text-gray-900">{value}</h3>
//       </div>
//       <div className="w-12 h-12 bg-gray-50 rounded-full flex items-center justify-center text-xl">
//         {icon}
//       </div>
//     </div>
//   )
// }

// 'use client'

// import { useState, useEffect, useCallback } from 'react'
// import { useRouter } from 'next/navigation'
// import { supabase } from '@/lib/supabase'
// import { 
//   LayoutDashboard, UserPlus, Users, Calendar, 
//   LogOut, Plus, Trash2, Loader2, Bell 
// } from 'lucide-react'

// // Simple notification sound
// const playNotification = () => {
//   const audio = new Audio('https://assets.mixkit.co/sfx/preview/mixkit-positive-notification-951.mp3');
//   audio.play().catch(e => console.log("Audio play failed", e));
// }

// export default function HospitalDashboard() {
//   const router = useRouter()
//   const [loading, setLoading] = useState(true)
//   const [activeTab, setActiveTab] = useState('overview')
  
//   // Data State
//   const [hospital, setHospital] = useState<any>(null)
//   const [doctors, setDoctors] = useState<any[]>([])
//   const [appointments, setAppointments] = useState<any[]>([])

//   // Form State
//   const [isAddMode, setIsAddMode] = useState(false)
//   const [newDoc, setNewDoc] = useState({ name: '', specialty: '', price: '' })

//   // --- 1. REUSABLE FETCH FUNCTION ---
//   // We wrap this in useCallback so we can call it from the Realtime subscription
//   const fetchAppointments = useCallback(async (hospitalId: string) => {
//     // Get all doctors for this hospital first
//     const { data: docData } = await supabase
//       .from('doctors')
//       .select('id')
//       .eq('hospital_id', hospitalId)
    
//     if (docData && docData.length > 0) {
//       const doctorIds = docData.map(d => d.id)
      
//       // Fetch Appointments for these doctors
//       const { data: apptData } = await supabase
//         .from('appointments')
//         .select(`
//           *,
//           doctors (name, specialty)
//         `)
//         .in('doctor_id', doctorIds)
//         .order('appointment_date', { ascending: true })
      
//       if (apptData) setAppointments(apptData)
//     }
//   }, [])

//   // --- 2. INITIAL DATA LOAD ---
//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         const { data: { user } } = await supabase.auth.getUser()
//         if (!user) { router.push('/hospital/auth'); return }

//         // Get Hospital
//         const { data: hospData } = await supabase
//           .from('hospitals')
//           .select('*')
//           .eq('owner_id', user.id)
//           .single()
        
//         if (!hospData) throw new Error("Hospital not found")
//         setHospital(hospData)

//         // Get Doctors
//         const { data: docData } = await supabase
//           .from('doctors')
//           .select('*')
//           .eq('hospital_id', hospData.id)
//         if (docData) setDoctors(docData)

//         // Get Appointments (Initial Load)
//         await fetchAppointments(hospData.id)

//       } catch (error) {
//         console.error(error)
//       } finally {
//         setLoading(false)
//       }
//     }
//     fetchData()
//   }, [fetchAppointments, router])

//   // --- 3. REALTIME AUTO-UPDATE SUBSCRIPTION ---
//   useEffect(() => {
//     if (!hospital) return;

//     // Create a subscription to the 'appointments' table
//     const channel = supabase
//       .channel('hospital-bookings')
//       .on(
//         'postgres_changes',
//         { event: 'INSERT', schema: 'public', table: 'appointments' },
//         (payload) => {
//           console.log('New Booking Received!', payload)
          
//           // 1. Play Sound
//           playNotification()
          
//           // 2. Refresh the list to show the new data with joined Doctor names
//           // (We re-fetch because the raw payload doesn't have the doctor's name, only the ID)
//           fetchAppointments(hospital.id)
//         }
//       )
//       .subscribe()

//     // Cleanup subscription when leaving the page
//     return () => {
//       supabase.removeChannel(channel)
//     }
//   }, [hospital, fetchAppointments])

//   // --- 4. ACTION HANDLERS ---
//   const handleAddDoctor = async (e: React.FormEvent) => {
//     e.preventDefault()
//     if (!hospital) return
//     const { data, error } = await supabase.from('doctors').insert({
//       hospital_id: hospital.id,
//       name: newDoc.name,
//       specialty: newDoc.specialty,
//       price: parseFloat(newDoc.price)
//     }).select()
//     if (!error && data) {
//       setDoctors([...doctors, data[0]])
//       setIsAddMode(false)
//       setNewDoc({ name: '', specialty: '', price: '' })
//     }
//   }

//   const handleDeleteDoctor = async (id: string) => {
//     if(!confirm("Remove doctor?")) return;
//     const { error } = await supabase.from('doctors').delete().eq('id', id)
//     if(!error) setDoctors(doctors.filter(d => d.id !== id))
//   }

//   if (loading) return <div className="h-screen flex items-center justify-center"><Loader2 className="animate-spin text-purple-600"/></div>

//   return (
//     <div className="min-h-screen bg-gray-50 flex font-sans text-gray-900">
      
//       {/* SIDEBAR */}
//       <aside className="w-64 bg-purple-900 text-white flex flex-col fixed h-full z-10">
//         <div className="p-6">
//           <h1 className="text-xl font-bold flex items-center gap-2">
//             <LayoutDashboard /> Partner Portal
//           </h1>
//           <p className="text-purple-300 text-xs mt-1">{hospital?.name}</p>
//         </div>
//         <nav className="flex-1 px-4 space-y-2 mt-4">
//           <button onClick={() => setActiveTab('overview')} className={`w-full flex items-center gap-3 p-3 rounded-xl text-sm font-medium transition-all ${activeTab === 'overview' ? 'bg-purple-800 shadow-lg' : 'hover:bg-purple-800/50'}`}><LayoutDashboard size={20}/> Overview</button>
//           <button onClick={() => setActiveTab('doctors')} className={`w-full flex items-center gap-3 p-3 rounded-xl text-sm font-medium transition-all ${activeTab === 'doctors' ? 'bg-purple-800 shadow-lg' : 'hover:bg-purple-800/50'}`}><UserPlus size={20}/> Doctors</button>
//           <button onClick={() => setActiveTab('appointments')} className={`w-full flex items-center gap-3 p-3 rounded-xl text-sm font-medium transition-all ${activeTab === 'appointments' ? 'bg-purple-800 shadow-lg' : 'hover:bg-purple-800/50'}`}>
//             <div className="relative"><Calendar size={20}/>{appointments.length > 0 && <span className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full"></span>}</div> Appointments
//           </button>
//         </nav>
//         <div className="p-4 border-t border-purple-800">
//           <button onClick={() => {supabase.auth.signOut(); router.push('/')}} className="flex items-center gap-3 text-purple-200 hover:text-white text-sm w-full p-2"><LogOut size={18} /> Logout</button>
//         </div>
//       </aside>

//       {/* MAIN */}
//       <main className="flex-1 ml-64 p-8">
        
//         {/* DASHBOARD HEADER */}
//         <header className="flex justify-between items-center mb-8">
//           <h2 className="text-2xl font-bold capitalize">{activeTab}</h2>
//           <div className="flex items-center gap-4">
//              <div className="bg-white p-2 rounded-full shadow-sm text-gray-500 relative">
//                <Bell size={20} />
//                <span className="absolute top-0 right-0 w-3 h-3 bg-red-500 border-2 border-white rounded-full animate-pulse"></span>
//              </div>
//              <div className="bg-purple-100 text-purple-900 px-4 py-2 rounded-full text-xs font-bold">
//                Live Updates: ON
//              </div>
//           </div>
//         </header>

//         {/* --- TABS --- */}

//         {/* 1. OVERVIEW */}
//         {activeTab === 'overview' && (
//           <div className="grid grid-cols-3 gap-6 animate-in fade-in">
//              <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
//                 <p className="text-gray-500 text-xs font-bold uppercase">Total Doctors</p>
//                 <h3 className="text-4xl font-bold text-gray-900 mt-2">{doctors.length}</h3>
//              </div>
//              <div className="bg-purple-600 text-white p-6 rounded-2xl shadow-lg shadow-purple-200">
//                 <p className="text-purple-100 text-xs font-bold uppercase">Active Appointments</p>
//                 <h3 className="text-4xl font-bold mt-2">{appointments.length}</h3>
//              </div>
//              <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
//                 <p className="text-gray-500 text-xs font-bold uppercase">Est. Revenue</p>
//                 <h3 className="text-4xl font-bold text-green-600 mt-2">₹{appointments.reduce((acc, curr) => acc + (curr.doctors?.price || 0), 0)}</h3>
//              </div>
//           </div>
//         )}

//         {/* 2. DOCTORS */}
//         {activeTab === 'doctors' && (
//           <div className="animate-in fade-in">
//              <div className="flex justify-end mb-6">
//                 <button onClick={() => setIsAddMode(!isAddMode)} className="bg-gray-900 text-white px-4 py-2 rounded-xl text-sm font-bold flex gap-2">{isAddMode ? 'Cancel' : <><Plus size={16}/> Add Doctor</>}</button>
//              </div>
             
//              {isAddMode && (
//                <form onSubmit={handleAddDoctor} className="bg-white p-6 rounded-2xl shadow-lg mb-6 border border-purple-100">
//                   <div className="grid grid-cols-3 gap-4 mb-4">
//                      <input required placeholder="Name" className="p-3 bg-gray-50 rounded-xl border" value={newDoc.name} onChange={e => setNewDoc({...newDoc, name: e.target.value})} />
//                      <input required placeholder="Specialty" className="p-3 bg-gray-50 rounded-xl border" value={newDoc.specialty} onChange={e => setNewDoc({...newDoc, specialty: e.target.value})} />
//                      <input required type="number" placeholder="Fee (₹)" className="p-3 bg-gray-50 rounded-xl border" value={newDoc.price} onChange={e => setNewDoc({...newDoc, price: e.target.value})} />
//                   </div>
//                   <button type="submit" className="bg-green-500 text-white px-6 py-2 rounded-xl font-bold text-sm">Save</button>
//                </form>
//              )}

//              <div className="grid grid-cols-3 gap-6">
//                {doctors.map(doc => (
//                  <div key={doc.id} className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm relative group">
//                     <button onClick={() => handleDeleteDoctor(doc.id)} className="absolute top-4 right-4 text-gray-300 hover:text-red-500"><Trash2 size={16}/></button>
//                     <div className="w-10 h-10 bg-purple-50 text-purple-600 rounded-full flex items-center justify-center font-bold mb-3">{doc.name[0]}</div>
//                     <h3 className="font-bold">{doc.name}</h3>
//                     <p className="text-sm text-gray-500">{doc.specialty}</p>
//                     <p className="font-bold text-green-600 mt-2">₹{doc.price}</p>
//                  </div>
//                ))}
//              </div>
//           </div>
//         )}

//         {/* 3. APPOINTMENTS (The Realtime Part) */}
//         {activeTab === 'appointments' && (
//           <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden animate-in fade-in">
//              <table className="w-full text-left text-sm">
//                 <thead className="bg-gray-50 text-gray-500 border-b border-gray-100">
//                    <tr>
//                       <th className="p-4">Patient</th>
//                       <th className="p-4">Doctor</th>
//                       <th className="p-4">Time</th>
//                       <th className="p-4">Status</th>
//                    </tr>
//                 </thead>
//                 <tbody className="divide-y divide-gray-50">
//                    {appointments.map(appt => (
//                       <tr key={appt.id} className="hover:bg-gray-50 transition-colors">
//                          <td className="p-4">
//                             <p className="font-bold text-gray-900">{appt.patient_name || 'Guest'}</p>
//                             <p className="text-xs text-gray-500">{appt.patient_mobile}</p>
//                          </td>
//                          <td className="p-4 text-purple-700 font-medium">Dr. {appt.doctors?.name}</td>
//                          <td className="p-4 text-gray-500">
//                             {new Date(appt.appointment_date).toLocaleDateString()} <br/>
//                             {new Date(appt.appointment_date).toLocaleTimeString([], {hour:'2-digit', minute:'2-digit'})}
//                          </td>
//                          <td className="p-4">
//                             <span className="bg-yellow-100 text-yellow-700 px-2 py-1 rounded-full text-xs font-bold uppercase">{appt.status}</span>
//                          </td>
//                       </tr>
//                    ))}
//                    {appointments.length === 0 && <tr><td colSpan={4} className="p-8 text-center text-gray-400">No bookings yet.</td></tr>}
//                 </tbody>
//              </table>
//           </div>
//         )}

//       </main>
//     </div>
//   )
// }

// 'use client'

// import { useState, useEffect, useCallback, useRef } from 'react'
// import { useRouter } from 'next/navigation'
// import { supabase } from '@/lib/supabase'
// import { 
//   LayoutDashboard, UserPlus, Users, Calendar, 
//   LogOut, Plus, Trash2, Loader2, Bell, Volume2 
// } from 'lucide-react'

// export default function HospitalDashboard() {
//   const router = useRouter()
//   const [loading, setLoading] = useState(true)
//   const [activeTab, setActiveTab] = useState('appointments')
  
//   // Data State
//   const [hospital, setHospital] = useState<any>(null)
//   const [doctors, setDoctors] = useState<any[]>([])
//   const [appointments, setAppointments] = useState<any[]>([])

//   // Form State
//   const [isAddMode, setIsAddMode] = useState(false)
//   const [newDoc, setNewDoc] = useState({ name: '', specialty: '', price: '' })

//   // Audio Ref
//   const audioPlayer = useRef<HTMLAudioElement | null>(null)

//   // --- 1. SOUND PLAYER ---
//   const playNotification = () => {
//     if (audioPlayer.current) {
//       // Reset time to 0 so it can play rapidly if multiple bookings come in
//       audioPlayer.current.currentTime = 0; 
//       audioPlayer.current.play().catch(error => {
//         console.warn("Audio blocked by browser. Click 'Test Sound' once to enable.", error);
//       });
//     }
//   }

//   // --- 2. FETCH DATA FUNCTION ---
//   const fetchAppointments = useCallback(async (hospitalId: string) => {
//     // Get all doctors for this hospital
//     const { data: docData } = await supabase
//       .from('doctors')
//       .select('id')
//       .eq('hospital_id', hospitalId)
    
//     if (docData && docData.length > 0) {
//       const doctorIds = docData.map(d => d.id)
      
//       // Fetch Appointments for these doctors
//       const { data: apptData } = await supabase
//         .from('appointments')
//         .select(`
//           *,
//           doctors (name, specialty)
//         `)
//         .in('doctor_id', doctorIds)
//         .order('created_at', { ascending: false }) // Newest first
      
//       if (apptData) setAppointments(apptData)
//     }
//   }, [])

//   // --- 3. INITIAL LOAD ---
//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         const { data: { user } } = await supabase.auth.getUser()
//         if (!user) { router.push('/hospital/auth'); return }

//         // Get Hospital Profile
//         const { data: hospData } = await supabase
//           .from('hospitals')
//           .select('*')
//           .eq('owner_id', user.id)
//           .single()
        
//         if (!hospData) throw new Error("Hospital not found")
//         setHospital(hospData)

//         // Get Doctors
//         const { data: docData } = await supabase
//           .from('doctors')
//           .select('*')
//           .eq('hospital_id', hospData.id)
//         if (docData) setDoctors(docData)

//         // Get Appointments
//         await fetchAppointments(hospData.id)

//       } catch (error) {
//         console.error(error)
//       } finally {
//         setLoading(false)
//       }
//     }
//     fetchData()
//   }, [fetchAppointments, router])

//   // --- 4. REALTIME SUBSCRIPTION ---
//   useEffect(() => {
//     if (!hospital) return;

//     console.log("🟢 Listening for new bookings...");

//     const channel = supabase
//       .channel('hospital-bookings')
//       .on(
//         'postgres_changes',
//         { event: 'INSERT', schema: 'public', table: 'appointments' },
//         (payload) => {
//           console.log('🔔 NEW BOOKING!', payload)
//           playNotification() // Play Sound
//           fetchAppointments(hospital.id) // Refresh Data
//         }
//       )
//       .subscribe()

//     return () => {
//       supabase.removeChannel(channel)
//     }
//   }, [hospital, fetchAppointments])

//   // --- 5. HANDLERS ---
//   const handleAddDoctor = async (e: React.FormEvent) => {
//     e.preventDefault()
//     if (!hospital) return
//     const { data, error } = await supabase.from('doctors').insert({
//       hospital_id: hospital.id,
//       name: newDoc.name,
//       specialty: newDoc.specialty,
//       price: parseFloat(newDoc.price)
//     }).select()
//     if (!error && data) {
//       setDoctors([...doctors, data[0]])
//       setIsAddMode(false)
//       setNewDoc({ name: '', specialty: '', price: '' })
//     }
//   }

//   const handleDeleteDoctor = async (id: string) => {
//     if(!confirm("Remove doctor?")) return;
//     const { error } = await supabase.from('doctors').delete().eq('id', id)
//     if(!error) setDoctors(doctors.filter(d => d.id !== id))
//   }

//   if (loading) return <div className="h-screen flex items-center justify-center"><Loader2 className="animate-spin text-purple-600 h-10 w-10"/></div>

//   return (
//     <div className="min-h-screen bg-gray-50 flex font-sans text-gray-900">
      
//       {/* SIDEBAR */}
//       <aside className="w-64 bg-purple-900 text-white flex flex-col fixed h-full z-10 transition-all">
//         <div className="p-6">
//           <h1 className="text-xl font-bold flex items-center gap-2">
//             <LayoutDashboard className="text-purple-300"/> Partner Portal
//           </h1>
//           <p className="text-purple-300 text-xs mt-1 truncate">{hospital?.name}</p>
//         </div>
//         <nav className="flex-1 px-4 space-y-2 mt-4">
//              <button onClick={() => setActiveTab('appointments')} 
//             className={`w-full flex items-center gap-3 p-3 rounded-xl text-sm font-medium transition-all ${activeTab === 'appointments' ? 'bg-purple-800 text-white shadow-lg' : 'text-purple-200 hover:bg-purple-800/50'}`}>
//             <div className="relative">
//               <Calendar size={20}/>
//               {appointments.some(a => a.status === 'pending') && <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-purple-900"></span>}
//             </div> 
//             Appointments
//           </button>
//           <button onClick={() => setActiveTab('overview')} 
//             className={`w-full flex items-center gap-3 p-3 rounded-xl text-sm font-medium transition-all ${activeTab === 'overview' ? 'bg-purple-800 text-white shadow-lg' : 'text-purple-200 hover:bg-purple-800/50'}`}>
//             <LayoutDashboard size={20}/> Overview
//           </button>
//           <button onClick={() => setActiveTab('doctors')} 
//             className={`w-full flex items-center gap-3 p-3 rounded-xl text-sm font-medium transition-all ${activeTab === 'doctors' ? 'bg-purple-800 text-white shadow-lg' : 'text-purple-200 hover:bg-purple-800/50'}`}>
//             <UserPlus size={20}/> Doctors
//           </button>
//           {/* <button onClick={() => setActiveTab('appointments')} 
//             className={`w-full flex items-center gap-3 p-3 rounded-xl text-sm font-medium transition-all ${activeTab === 'appointments' ? 'bg-purple-800 text-white shadow-lg' : 'text-purple-200 hover:bg-purple-800/50'}`}>
//             <div className="relative">
//               <Calendar size={20}/>
//               {appointments.some(a => a.status === 'pending') && <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-purple-900"></span>}
//             </div> 
//             Appointments
//           </button> */}
//         </nav>
//         <div className="p-4 border-t border-purple-800">
//           <button onClick={() => {supabase.auth.signOut(); router.push('/')}} className="flex items-center gap-3 text-purple-300 hover:text-white text-sm w-full p-2 transition-colors">
//             <LogOut size={18} /> Logout
//           </button>
//         </div>
//       </aside>

//       {/* MAIN CONTENT */}
//       <main className="flex-1 ml-64 p-8">
        
//         {/* HEADER */}
//         <header className="flex justify-between items-center mb-8">
//           <h2 className="text-2xl font-bold capitalize text-gray-800">{activeTab}</h2>
          
//           <div className="flex items-center gap-4">
//              {/* TEST SOUND BUTTON */}
//              <button 
//                onClick={playNotification}
//                className="flex items-center gap-2 text-xs font-bold text-purple-700 bg-purple-50 hover:bg-purple-100 px-4 py-2 rounded-full border border-purple-200 transition-all active:scale-95"
//                title="Click this once to enable sound for this session"
//              >
//                <Volume2 size={14}/> Test Sound
//              </button>

//              <div className="bg-white p-2.5 rounded-full shadow-sm text-gray-500 relative border border-gray-100">
//                <Bell size={20} />
//                <span className="absolute top-0 right-0 w-3 h-3 bg-red-500 border-2 border-white rounded-full animate-ping"></span>
//                <span className="absolute top-0 right-0 w-3 h-3 bg-red-500 border-2 border-white rounded-full"></span>
//              </div>
             
//              <div className="text-right hidden md:block">
//                 <p className="text-sm font-bold text-gray-900">{hospital?.name}</p>
//                 <p className="text-xs text-green-600 font-bold">Online</p>
//              </div>
//           </div>
//         </header>

//         {/* --- TABS --- */}

//         {/* 1. OVERVIEW */}
//         {activeTab === 'overview' && (
//           <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-in fade-in slide-in-from-bottom-4">
//              <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
//                 <div className="flex justify-between items-start">
//                    <div>
//                       <p className="text-gray-500 text-xs font-bold uppercase tracking-wider">Total Doctors</p>
//                       <h3 className="text-4xl font-bold text-gray-900 mt-2">{doctors.length}</h3>
//                    </div>
//                    <div className="bg-blue-50 p-3 rounded-xl text-blue-600"><Users size={24}/></div>
//                 </div>
//              </div>
//              <div className="bg-gradient-to-br from-purple-600 to-indigo-700 text-white p-6 rounded-2xl shadow-lg shadow-purple-200">
//                 <div className="flex justify-between items-start">
//                    <div>
//                       <p className="text-purple-100 text-xs font-bold uppercase tracking-wider">Total Bookings</p>
//                       <h3 className="text-4xl font-bold mt-2">{appointments.length}</h3>
//                    </div>
//                    <div className="bg-white/20 p-3 rounded-xl text-white"><Calendar size={24}/></div>
//                 </div>
//              </div>
//              <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
//                 <div className="flex justify-between items-start">
//                    <div>
//                       <p className="text-gray-500 text-xs font-bold uppercase tracking-wider">Est. Revenue</p>
//                       <h3 className="text-4xl font-bold text-green-600 mt-2">₹{appointments.reduce((acc, curr) => acc + (curr.doctors?.price || 0), 0)}</h3>
//                    </div>
//                    <div className="bg-green-50 p-3 rounded-xl text-green-600 font-bold text-xl">₹</div>
//                 </div>
//              </div>
//           </div>
//         )}

//         {/* 2. DOCTORS */}
//         {activeTab === 'doctors' && (
//           <div className="animate-in fade-in">
//              <div className="flex justify-between items-center mb-6">
//                 <h3 className="font-bold text-gray-700">Manage Staff</h3>
//                 <button onClick={() => setIsAddMode(!isAddMode)} className="bg-gray-900 hover:bg-black text-white px-5 py-2.5 rounded-xl text-sm font-bold flex gap-2 transition-all shadow-lg shadow-gray-200">
//                   {isAddMode ? 'Cancel' : <><Plus size={18}/> Add Doctor</>}
//                 </button>
//              </div>
             
//              {isAddMode && (
//                <form onSubmit={handleAddDoctor} className="bg-white p-6 rounded-2xl shadow-lg mb-8 border border-purple-100 animate-in slide-in-from-top-4">
//                   <h4 className="font-bold text-sm mb-4">Add New Specialist</h4>
//                   <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
//                      <input required placeholder="Dr. Name" className="p-3 bg-gray-50 rounded-xl border outline-none focus:border-purple-500 transition-colors" value={newDoc.name} onChange={e => setNewDoc({...newDoc, name: e.target.value})} />
//                      <input required placeholder="Specialty (e.g. Cardiologist)" className="p-3 bg-gray-50 rounded-xl border outline-none focus:border-purple-500 transition-colors" value={newDoc.specialty} onChange={e => setNewDoc({...newDoc, specialty: e.target.value})} />
//                      <input required type="number" placeholder="Consultation Fee (₹)" className="p-3 bg-gray-50 rounded-xl border outline-none focus:border-purple-500 transition-colors" value={newDoc.price} onChange={e => setNewDoc({...newDoc, price: e.target.value})} />
//                   </div>
//                   <button type="submit" className="bg-green-500 hover:bg-green-600 text-white px-8 py-2.5 rounded-xl font-bold text-sm shadow-md shadow-green-200 transition-all">Save Doctor</button>
//                </form>
//              )}

//              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//                {doctors.map(doc => (
//                  <div key={doc.id} className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm relative group hover:shadow-md transition-all">
//                     <button onClick={() => handleDeleteDoctor(doc.id)} className="absolute top-4 right-4 text-gray-300 hover:text-red-500 bg-gray-50 hover:bg-red-50 p-2 rounded-lg transition-colors"><Trash2 size={16}/></button>
//                     <div className="flex items-center gap-4 mb-4">
//                       <div className="w-12 h-12 bg-purple-50 text-purple-600 rounded-2xl flex items-center justify-center font-bold text-lg">{doc.name[0]}</div>
//                       <div>
//                         <h3 className="font-bold text-gray-900">{doc.name}</h3>
//                         <p className="text-xs text-gray-500 uppercase font-bold tracking-wide">{doc.specialty}</p>
//                       </div>
//                     </div>
//                     <div className="border-t border-gray-50 pt-3 flex justify-between items-center">
//                        <span className="text-xs text-gray-400">Consultation Fee</span>
//                        <span className="font-bold text-green-600">₹{doc.price}</span>
//                     </div>
//                  </div>
//                ))}
//                {doctors.length === 0 && !isAddMode && <p className="text-gray-400 col-span-3 text-center py-10">No doctors added yet.</p>}
//              </div>
//           </div>
//         )}

//         {/* 3. APPOINTMENTS (Realtime Table) */}
//         {activeTab === 'appointments' && (
//           <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden animate-in fade-in">
//              <table className="w-full text-left text-sm">
//                 <thead className="bg-gray-50/50 text-gray-500 border-b border-gray-100">
//                    <tr>
//                       <th className="p-4 font-semibold">Patient Details</th>
//                       <th className="p-4 font-semibold">Assigned Doctor</th>
//                       <th className="p-4 font-semibold">Date & Time</th>
//                       <th className="p-4 font-semibold">Status</th>
//                       <th className="p-4 font-semibold text-right">Actions</th>
//                    </tr>
//                 </thead>
//                 <tbody className="divide-y divide-gray-50">
//                    {appointments.map(appt => (
//                       <tr key={appt.id} className="hover:bg-gray-50/80 transition-colors group">
//                          <td className="p-4">
//                             <p className="font-bold text-gray-900">{appt.patient_name || 'Guest Patient'}</p>
//                             <p className="text-xs text-gray-400 mt-0.5 flex items-center gap-1"><Volume2 size={10}/> {appt.patient_mobile}</p>
//                          </td>
//                          <td className="p-4">
//                             <div className="flex items-center gap-2">
//                                <div className="w-6 h-6 rounded-full bg-purple-100 text-purple-600 flex items-center justify-center text-xs font-bold">Dr</div>
//                                <span className="font-medium text-gray-700">{appt.doctors?.name}</span>
//                             </div>
//                          </td>
//                          <td className="p-4 text-gray-500">
//                             <div className="flex flex-col">
//                                <span className="font-bold text-gray-700">{new Date(appt.appointment_date).toLocaleDateString()}</span>
//                                <span className="text-xs">{new Date(appt.appointment_date).toLocaleTimeString([], {hour:'2-digit', minute:'2-digit'})}</span>
//                             </div>
//                          </td>
//                          <td className="p-4">
//                             <span className={`px-2.5 py-1 rounded-full text-xs font-bold uppercase tracking-wide ${
//                                appt.status === 'confirmed' ? 'bg-green-100 text-green-700' : 
//                                appt.status === 'pending' ? 'bg-yellow-100 text-yellow-700' : 'bg-red-50 text-red-500'
//                             }`}>
//                                {appt.status}
//                             </span>
//                          </td>
//                          <td className="p-4 text-right">
//                            {appt.status === 'pending' && (
//                              <button className="text-xs bg-green-500 text-white px-3 py-1.5 rounded-lg hover:bg-green-600 transition-colors font-bold shadow-sm shadow-green-200">
//                                Accept
//                              </button>
//                            )}
//                          </td>
//                       </tr>
//                    ))}
//                    {appointments.length === 0 && <tr><td colSpan={5} className="p-12 text-center text-gray-400">No bookings found yet.</td></tr>}
//                 </tbody>
//              </table>
//           </div>
//         )}

//       </main>

//       {/* HIDDEN AUDIO ELEMENT */}
//       <audio 
//         ref={audioPlayer} 
//         src="https://assets.mixkit.co/active_storage/sfx/2869/2869-preview.mp3" 
//         preload="auto"
//       />

//     </div>
//   )
// }


'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import { 
  LayoutDashboard, UserPlus, Users, Calendar, 
  LogOut, Plus, Trash2, Loader2, Bell, Volume2, Check, XCircle 
} from 'lucide-react'

export default function HospitalDashboard() {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('appointments')
  
  // Data State
  const [hospital, setHospital] = useState<any>(null)
  const [doctors, setDoctors] = useState<any[]>([])
  const [appointments, setAppointments] = useState<any[]>([])

  // Form State
  const [isAddMode, setIsAddMode] = useState(false)
  const [newDoc, setNewDoc] = useState({ name: '', specialty: '', price: '' })

  // Audio Ref
  const audioPlayer = useRef<HTMLAudioElement | null>(null)

  // --- 1. SOUND PLAYER ---
  const playNotification = () => {
    if (audioPlayer.current) {
      audioPlayer.current.currentTime = 0; 
      audioPlayer.current.play().catch(error => {
        console.warn("Audio blocked. Click 'Test Sound' to enable.", error);
      });
    }
  }

  // --- 2. FETCH DATA FUNCTION ---
  const fetchAppointments = useCallback(async (hospitalId: string) => {
    const { data: docData } = await supabase
      .from('doctors')
      .select('id')
      .eq('hospital_id', hospitalId)
    
    if (docData && docData.length > 0) {
      const doctorIds = docData.map(d => d.id)
      
      const { data: apptData } = await supabase
        .from('appointments')
        .select(`*, doctors (name, specialty)`)
        .in('doctor_id', doctorIds)
        .order('created_at', { ascending: false })
      
      if (apptData) setAppointments(apptData)
    }
  }, [])

  // --- 3. INITIAL LOAD ---
  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser()
        if (!user) { router.push('/hospital/auth'); return }

        const { data: hospData } = await supabase
          .from('hospitals')
          .select('*')
          .eq('owner_id', user.id)
          .single()
        
        if (!hospData) throw new Error("Hospital not found")
        setHospital(hospData)

        const { data: docData } = await supabase
          .from('doctors')
          .select('*')
          .eq('hospital_id', hospData.id)
        if (docData) setDoctors(docData)

        await fetchAppointments(hospData.id)

      } catch (error) {
        console.error(error)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [fetchAppointments, router])

  // --- 4. REALTIME SUBSCRIPTION ---
  useEffect(() => {
    if (!hospital) return;

    const channel = supabase
      .channel('hospital-bookings')
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'appointments' },
        (payload) => {
          console.log('🔔 NEW BOOKING!', payload)
          playNotification()
          fetchAppointments(hospital.id)
        }
      )
      .subscribe()

    return () => { supabase.removeChannel(channel) }
  }, [hospital, fetchAppointments])

  // --- 5. HANDLERS ---
  const handleAddDoctor = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!hospital) return
    const { data, error } = await supabase.from('doctors').insert({
      hospital_id: hospital.id,
      name: newDoc.name,
      specialty: newDoc.specialty,
      price: parseFloat(newDoc.price)
    }).select()
    if (!error && data) {
      setDoctors([...doctors, data[0]])
      setIsAddMode(false)
      setNewDoc({ name: '', specialty: '', price: '' })
    }
  }

  const handleDeleteDoctor = async (id: string) => {
    if(!confirm("Remove doctor?")) return;
    const { error } = await supabase.from('doctors').delete().eq('id', id)
    if(!error) setDoctors(doctors.filter(d => d.id !== id))
  }

  // ✅ NEW: HANDLE STATUS UPDATE (Accept/Reject)
  const handleStatusUpdate = async (id: string, newStatus: string) => {
    // 1. Update UI immediately (Optimistic update)
    setAppointments(prev => prev.map(a => a.id === id ? {...a, status: newStatus} : a))

    // 2. Update Database
    const { error } = await supabase
      .from('appointments')
      .update({ status: newStatus })
      .eq('id', id)
    
    if (error) {
      console.error("Error updating status:", error)
      alert("Failed to update status. Check console.")
      // Revert UI if failed
      fetchAppointments(hospital.id)
    }
  }

  if (loading) return <div className="h-screen flex items-center justify-center"><Loader2 className="animate-spin text-purple-600 h-10 w-10"/></div>

  return (
    <div className="min-h-screen bg-gray-50 flex font-sans text-gray-900">
      
      {/* SIDEBAR */}
      <aside className="w-64 bg-purple-900 text-white flex flex-col fixed h-full z-10 transition-all">
        <div className="p-6">
          <h1 className="text-xl font-bold flex items-center gap-2">
            <LayoutDashboard className="text-purple-300"/> Partner Portal
          </h1>
          <p className="text-purple-300 text-xs mt-1 truncate">{hospital?.name}</p>
        </div>
        <nav className="flex-1 px-4 space-y-2 mt-4">
             <button onClick={() => setActiveTab('appointments')} 
            className={`w-full flex items-center gap-3 p-3 rounded-xl text-sm font-medium transition-all ${activeTab === 'appointments' ? 'bg-purple-800 text-white shadow-lg' : 'text-purple-200 hover:bg-purple-800/50'}`}>
            <div className="relative">
              <Calendar size={20}/>
              {appointments.some(a => a.status === 'pending') && <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-purple-900"></span>}
            </div> 
            Appointments
          </button>
          <button onClick={() => setActiveTab('overview')} 
            className={`w-full flex items-center gap-3 p-3 rounded-xl text-sm font-medium transition-all ${activeTab === 'overview' ? 'bg-purple-800 text-white shadow-lg' : 'text-purple-200 hover:bg-purple-800/50'}`}>
            <LayoutDashboard size={20}/> Overview
          </button>
          <button onClick={() => setActiveTab('doctors')} 
            className={`w-full flex items-center gap-3 p-3 rounded-xl text-sm font-medium transition-all ${activeTab === 'doctors' ? 'bg-purple-800 text-white shadow-lg' : 'text-purple-200 hover:bg-purple-800/50'}`}>
            <UserPlus size={20}/> Doctors
          </button>
        </nav>
        <div className="p-4 border-t border-purple-800">
          <button onClick={() => {supabase.auth.signOut(); router.push('/')}} className="flex items-center gap-3 text-purple-300 hover:text-white text-sm w-full p-2 transition-colors">
            <LogOut size={18} /> Logout
          </button>
        </div>
      </aside>

      {/* MAIN CONTENT */}
      <main className="flex-1 ml-64 p-8">
        
        {/* HEADER */}
        <header className="flex justify-between items-center mb-8">
          <h2 className="text-2xl font-bold capitalize text-gray-800">{activeTab}</h2>
          
          <div className="flex items-center gap-4">
             <button 
               onClick={playNotification}
               className="flex items-center gap-2 text-xs font-bold text-purple-700 bg-purple-50 hover:bg-purple-100 px-4 py-2 rounded-full border border-purple-200 transition-all active:scale-95"
             >
               <Volume2 size={14}/> Test Sound
             </button>

             <div className="bg-white p-2.5 rounded-full shadow-sm text-gray-500 relative border border-gray-100">
               <Bell size={20} />
               {appointments.some(a => a.status === 'pending') && (
                 <>
                   <span className="absolute top-0 right-0 w-3 h-3 bg-red-500 border-2 border-white rounded-full animate-ping"></span>
                   <span className="absolute top-0 right-0 w-3 h-3 bg-red-500 border-2 border-white rounded-full"></span>
                 </>
               )}
             </div>
             
             <div className="text-right hidden md:block">
                <p className="text-sm font-bold text-gray-900">{hospital?.name}</p>
                <p className="text-xs text-green-600 font-bold">Online</p>
             </div>
          </div>
        </header>

        {/* --- TABS --- */}

        {/* 1. OVERVIEW */}
        {activeTab === 'overview' && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-in fade-in slide-in-from-bottom-4">
             <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                <div className="flex justify-between items-start">
                   <div>
                      <p className="text-gray-500 text-xs font-bold uppercase tracking-wider">Total Doctors</p>
                      <h3 className="text-4xl font-bold text-gray-900 mt-2">{doctors.length}</h3>
                   </div>
                   <div className="bg-blue-50 p-3 rounded-xl text-blue-600"><Users size={24}/></div>
                </div>
             </div>
             <div className="bg-gradient-to-br from-purple-600 to-indigo-700 text-white p-6 rounded-2xl shadow-lg shadow-purple-200">
                <div className="flex justify-between items-start">
                   <div>
                      <p className="text-purple-100 text-xs font-bold uppercase tracking-wider">Total Bookings</p>
                      <h3 className="text-4xl font-bold mt-2">{appointments.length}</h3>
                   </div>
                   <div className="bg-white/20 p-3 rounded-xl text-white"><Calendar size={24}/></div>
                </div>
             </div>
             <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                <div className="flex justify-between items-start">
                   <div>
                      <p className="text-gray-500 text-xs font-bold uppercase tracking-wider">Est. Revenue</p>
                      <h3 className="text-4xl font-bold text-green-600 mt-2">₹{appointments.reduce((acc, curr) => acc + (curr.doctors?.price || 0), 0)}</h3>
                   </div>
                   <div className="bg-green-50 p-3 rounded-xl text-green-600 font-bold text-xl">₹</div>
                </div>
             </div>
          </div>
        )}

        {/* 2. DOCTORS */}
        {activeTab === 'doctors' && (
          <div className="animate-in fade-in">
             <div className="flex justify-between items-center mb-6">
                <h3 className="font-bold text-gray-700">Manage Staff</h3>
                <button onClick={() => setIsAddMode(!isAddMode)} className="bg-gray-900 hover:bg-black text-white px-5 py-2.5 rounded-xl text-sm font-bold flex gap-2 transition-all shadow-lg shadow-gray-200">
                  {isAddMode ? 'Cancel' : <><Plus size={18}/> Add Doctor</>}
                </button>
             </div>
             
             {isAddMode && (
               <form onSubmit={handleAddDoctor} className="bg-white p-6 rounded-2xl shadow-lg mb-8 border border-purple-100 animate-in slide-in-from-top-4">
                  <h4 className="font-bold text-sm mb-4">Add New Specialist</h4>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                     <input required placeholder="Dr. Name" className="p-3 bg-gray-50 rounded-xl border outline-none focus:border-purple-500 transition-colors" value={newDoc.name} onChange={e => setNewDoc({...newDoc, name: e.target.value})} />
                     <input required placeholder="Specialty (e.g. Cardiologist)" className="p-3 bg-gray-50 rounded-xl border outline-none focus:border-purple-500 transition-colors" value={newDoc.specialty} onChange={e => setNewDoc({...newDoc, specialty: e.target.value})} />
                     <input required type="number" placeholder="Consultation Fee (₹)" className="p-3 bg-gray-50 rounded-xl border outline-none focus:border-purple-500 transition-colors" value={newDoc.price} onChange={e => setNewDoc({...newDoc, price: e.target.value})} />
                  </div>
                  <button type="submit" className="bg-green-500 hover:bg-green-600 text-white px-8 py-2.5 rounded-xl font-bold text-sm shadow-md shadow-green-200 transition-all">Save Doctor</button>
               </form>
             )}

             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
               {doctors.map(doc => (
                 <div key={doc.id} className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm relative group hover:shadow-md transition-all">
                    <button onClick={() => handleDeleteDoctor(doc.id)} className="absolute top-4 right-4 text-gray-300 hover:text-red-500 bg-gray-50 hover:bg-red-50 p-2 rounded-lg transition-colors"><Trash2 size={16}/></button>
                    <div className="flex items-center gap-4 mb-4">
                      <div className="w-12 h-12 bg-purple-50 text-purple-600 rounded-2xl flex items-center justify-center font-bold text-lg">{doc.name[0]}</div>
                      <div>
                        <h3 className="font-bold text-gray-900">{doc.name}</h3>
                        <p className="text-xs text-gray-500 uppercase font-bold tracking-wide">{doc.specialty}</p>
                      </div>
                    </div>
                    <div className="border-t border-gray-50 pt-3 flex justify-between items-center">
                       <span className="text-xs text-gray-400">Consultation Fee</span>
                       <span className="font-bold text-green-600">₹{doc.price}</span>
                    </div>
                 </div>
               ))}
               {doctors.length === 0 && !isAddMode && <p className="text-gray-400 col-span-3 text-center py-10">No doctors added yet.</p>}
             </div>
          </div>
        )}

        {/* 3. APPOINTMENTS */}
        {activeTab === 'appointments' && (
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden animate-in fade-in">
             <table className="w-full text-left text-sm">
                <thead className="bg-gray-50/50 text-gray-500 border-b border-gray-100">
                   <tr>
                      <th className="p-4 font-semibold">Patient Details</th>
                      <th className="p-4 font-semibold">Assigned Doctor</th>
                      <th className="p-4 font-semibold">Date & Time</th>
                      <th className="p-4 font-semibold">Status</th>
                      <th className="p-4 font-semibold text-right">Actions</th>
                   </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                   {appointments.map(appt => (
                      <tr key={appt.id} className="hover:bg-gray-50/80 transition-colors group">
                         <td className="p-4">
                            <p className="font-bold text-gray-900">{appt.patient_name || 'Guest Patient'}</p>
                            <p className="text-xs text-gray-400 mt-0.5 flex items-center gap-1"><Volume2 size={10}/> {appt.patient_mobile}</p>
                         </td>
                         <td className="p-4">
                            <div className="flex items-center gap-2">
                               <div className="w-6 h-6 rounded-full bg-purple-100 text-purple-600 flex items-center justify-center text-xs font-bold">Dr</div>
                               <span className="font-medium text-gray-700">{appt.doctors?.name}</span>
                            </div>
                         </td>
                         <td className="p-4 text-gray-500">
                            <div className="flex flex-col">
                               <span className="font-bold text-gray-700">{new Date(appt.appointment_date).toLocaleDateString()}</span>
                               <span className="text-xs">{new Date(appt.appointment_date).toLocaleTimeString([], {hour:'2-digit', minute:'2-digit'})}</span>
                            </div>
                         </td>
                         <td className="p-4">
                            <span className={`px-2.5 py-1 rounded-full text-xs font-bold uppercase tracking-wide ${
                               appt.status === 'confirmed' ? 'bg-green-100 text-green-700' : 
                               appt.status === 'pending' ? 'bg-yellow-100 text-yellow-700' : 'bg-red-50 text-red-500'
                            }`}>
                               {appt.status}
                            </span>
                         </td>
                         <td className="p-4 text-right">
                           {appt.status === 'pending' ? (
                             <div className="flex gap-2 justify-end">
                               {/* ACCEPT BUTTON */}
                               <button 
                                 onClick={() => handleStatusUpdate(appt.id, 'confirmed')}
                                 className="flex items-center gap-1 text-xs bg-green-500 text-white px-3 py-1.5 rounded-lg hover:bg-green-600 transition-colors font-bold shadow-sm shadow-green-200"
                               >
                                 <Check size={14} /> Accept
                               </button>
                               {/* REJECT BUTTON */}
                               <button 
                                 onClick={() => handleStatusUpdate(appt.id, 'rejected')}
                                 className="flex items-center gap-1 text-xs bg-white border border-red-200 text-red-500 px-3 py-1.5 rounded-lg hover:bg-red-50 transition-colors font-bold"
                               >
                                 <XCircle size={14} /> 
                               </button>
                             </div>
                           ) : (
                             <span className="text-xs text-gray-400 font-medium">Completed</span>
                           )}
                         </td>
                      </tr>
                   ))}
                   {appointments.length === 0 && <tr><td colSpan={5} className="p-12 text-center text-gray-400">No bookings found yet.</td></tr>}
                </tbody>
             </table>
          </div>
        )}

      </main>

      {/* HIDDEN AUDIO ELEMENT */}
      <audio 
        ref={audioPlayer} 
        src="https://assets.mixkit.co/active_storage/sfx/2869/2869-preview.mp3" 
        preload="auto"
      />

    </div>
  )
}