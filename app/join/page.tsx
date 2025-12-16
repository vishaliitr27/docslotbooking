// 'use client'
// import { useState } from 'react'
// import { supabase } from '@/lib/supabase'
// import { useRouter } from 'next/navigation'
// import Link from 'next/link'

// export default function RegisterHospital() {
//   const router = useRouter()
//   const [loading, setLoading] = useState(false)
//   const [form, setForm] = useState({ 
//     email: '', password: '', hospitalName: '', city: '', doctorName: '', specialty: 'General' 
//   })

//   const handleRegister = async (e: React.FormEvent) => {
//     e.preventDefault()
//     setLoading(true)

//     try {
//       // 1. Create Auth User
//       const { data: authData, error: authErr } = await supabase.auth.signUp({
//         email: form.email,
//         password: form.password,
//       })
//       if (authErr) throw authErr

//       if (authData.user) {
//         // 2. Create Hospital
//         const { data: hosp, error: hospErr } = await supabase
//           .from('hospitals')
//           .insert({ name: form.hospitalName, city: form.city })
//           .select()
//           .single()
//         if (hospErr) throw hospErr

//         // 3. Link Admin to Hospital
//         await supabase.from('hospital_admins').insert({
//           id: authData.user.id,
//           hospital_id: hosp.id
//         })

//         // 4. Create First Doctor
//         await supabase.from('doctors').insert({
//           hospital_id: hosp.id,
//           name: form.doctorName,
//           specialty: form.specialty,
//           price: 500
//         })

//         alert('Hospital Registered! Logging into dashboard...')
//         router.push('/admin')
//       }
//     } catch (error: any) {
//       alert(error.message)
//     } finally {
//       setLoading(false)
//     }
//   }

//   return (
//     <div className="min-h-screen flex items-center justify-center bg-gray-900 p-4">
//       <form onSubmit={handleRegister} className="bg-white p-8 rounded-2xl shadow-2xl w-full max-w-lg space-y-4">
//         <h1 className="text-2xl font-bold text-gray-900">Partner with CureOS</h1>
//         <p className="text-sm text-gray-500">Register your clinic in 60 seconds.</p>

//         <div className="grid grid-cols-2 gap-4">
//             <input placeholder="Hospital Name" required className="p-3 border rounded-lg" onChange={e => setForm({...form, hospitalName: e.target.value})} />
//             <input placeholder="City" required className="p-3 border rounded-lg" onChange={e => setForm({...form, city: e.target.value})} />
//         </div>
        
//         <div className="bg-gray-50 p-4 rounded-lg border">
//             <h3 className="text-xs font-bold text-gray-400 uppercase mb-2">Primary Doctor Details</h3>
//             <input placeholder="Doctor Name" required className="w-full p-2 border rounded mb-2" onChange={e => setForm({...form, doctorName: e.target.value})} />
//             <input placeholder="Specialty (e.g. Cardiologist)" required className="w-full p-2 border rounded" onChange={e => setForm({...form, specialty: e.target.value})} />
//         </div>

//         <div className="pt-2">
//             <input type="email" placeholder="Admin Email" required className="w-full p-3 border rounded-lg mb-2" onChange={e => setForm({...form, email: e.target.value})} />
//             <input type="password" placeholder="Create Password" required className="w-full p-3 border rounded-lg" onChange={e => setForm({...form, password: e.target.value})} />
//         </div>

//         <button disabled={loading} className="w-full bg-purple-900 text-white p-3 rounded-lg font-bold">
//           {loading ? 'Creating Ecosystem...' : 'Register Hospital'}
//         </button>
//         <div className="text-center text-sm mt-4">
//             <Link href="/admin/login" className="text-blue-600 hover:underline">Already registered? Login here</Link>
//         </div>
//       </form>
//     </div>
//   )
// }





// 'use client'

// import { useState } from 'react'
// import { useRouter } from 'next/navigation'
// import { supabase } from '@/lib/supabase'
// import { Building2, MapPin, Mail, Lock, Phone, Loader2, HeartPulse } from 'lucide-react'

// export default function HospitalJoinPage() {
//   const router = useRouter()
//   const [loading, setLoading] = useState(false)
//   const [error, setError] = useState<string | null>(null)

//   const [form, setForm] = useState({
//     name: '',       // Hospital Name
//     city: '',
//     address: '',
//     phone: '',
//     email: '',
//     password: ''
//   })

//   const handleRegister = async (e: React.FormEvent) => {
//     e.preventDefault()
//     setLoading(true)
//     setError(null)

//     try {
//       // 1. Create Auth User
//       const { data: authData, error: authError } = await supabase.auth.signUp({
//         email: form.email,
//         password: form.password,
//         options: {
//           data: {
//             full_name: form.name, // Storing Hospital Name as the "User Name"
//             role: 'hospital',
//             mobile: form.phone
//           }
//         }
//       })

//       if (authError) throw authError
//       if (!authData.user) throw new Error("No user created")

//       // 2. Create Hospital Entry
//       // We manually insert this because it's specific data not in the 'profiles' trigger
//       const { error: dbError } = await supabase.from('hospitals').insert({
//         owner_id: authData.user.id,
//         name: form.name,
//         city: form.city,
//         address: form.address,
//         contact_number: form.phone
//       })

//       if (dbError) throw dbError

//       // 3. Success! Redirect to Hospital Dashboard
//       router.push('/hospital/dashboard')

//     } catch (err: any) {
//       console.error(err)
//       setError(err.message)
//     } finally {
//       setLoading(false)
//     }
//   }

//   return (
//     <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
//       <div className="bg-white max-w-4xl w-full rounded-2xl shadow-xl overflow-hidden grid md:grid-cols-2">
        
//         {/* Left Side: Visuals */}
//         <div className="bg-purple-900 p-10 text-white flex flex-col justify-between relative overflow-hidden">
//           <div className="relative z-10">
//             <div className="flex items-center gap-2 font-bold text-2xl mb-8">
//               <div className="bg-green-500 p-1.5 rounded-lg"><HeartPulse size={24}/></div>
//               DocSlot Partner
//             </div>
//             <h1 className="text-4xl font-bold mb-4">Grow your practice with us.</h1>
//             <p className="text-purple-200">Manage appointments, doctors, and patient records in one seamless dashboard.</p>
//           </div>
          
//           {/* Decorative Circles */}
//           <div className="absolute top-0 right-0 w-64 h-64 bg-purple-800 rounded-full mix-blend-multiply filter blur-3xl opacity-50 -translate-y-10 translate-x-10"></div>
//           <div className="absolute bottom-0 left-0 w-64 h-64 bg-green-900 rounded-full mix-blend-multiply filter blur-3xl opacity-50 translate-y-10 -translate-x-10"></div>
//         </div>

//         {/* Right Side: Form */}
//         <div className="p-10">
//           <h2 className="text-2xl font-bold text-gray-900 mb-6">Register your Hospital</h2>

//           {error && (
//             <div className="mb-4 p-3 bg-red-50 border border-red-100 text-red-600 text-sm rounded-lg">
//               {error}
//             </div>
//           )}

//           <form onSubmit={handleRegister} className="space-y-4">
            
//             {/* Hospital Info */}
//             <div>
//               <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Hospital Name</label>
//               <div className="flex items-center border border-gray-200 rounded-xl px-3 py-2 focus-within:ring-2 ring-purple-500 bg-gray-50">
//                 <Building2 className="text-gray-400 mr-2 h-5 w-5"/>
//                 <input required placeholder="City Care Clinic" className="w-full bg-transparent outline-none"
//                   value={form.name} onChange={e => setForm({...form, name: e.target.value})} />
//               </div>
//             </div>

//             <div className="grid grid-cols-2 gap-4">
//               <div>
//                 <label className="block text-xs font-bold text-gray-500 uppercase mb-1">City</label>
//                 <div className="flex items-center border border-gray-200 rounded-xl px-3 py-2 focus-within:ring-2 ring-purple-500 bg-gray-50">
//                   <MapPin className="text-gray-400 mr-2 h-5 w-5"/>
//                   <input required placeholder="Mumbai" className="w-full bg-transparent outline-none"
//                     value={form.city} onChange={e => setForm({...form, city: e.target.value})} />
//                 </div>
//               </div>
//               <div>
//                 <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Phone</label>
//                 <div className="flex items-center border border-gray-200 rounded-xl px-3 py-2 focus-within:ring-2 ring-purple-500 bg-gray-50">
//                   <Phone className="text-gray-400 mr-2 h-5 w-5"/>
//                   <input required placeholder="98765..." className="w-full bg-transparent outline-none"
//                     value={form.phone} onChange={e => setForm({...form, phone: e.target.value})} />
//                 </div>
//               </div>
//             </div>

//             <div>
//               <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Full Address</label>
//               <textarea required placeholder="Street, Area, Pincode" className="w-full border border-gray-200 rounded-xl px-3 py-2 focus:ring-2 ring-purple-500 bg-gray-50 outline-none h-20 resize-none"
//                 value={form.address} onChange={e => setForm({...form, address: e.target.value})} />
//             </div>

//             {/* Login Credentials */}
//             <div className="pt-4 border-t border-gray-100">
//                <p className="text-sm font-bold text-gray-900 mb-3">Admin Login Details</p>
//                <div className="space-y-4">
//                  <div className="flex items-center border border-gray-200 rounded-xl px-3 py-2 focus-within:ring-2 ring-purple-500 bg-gray-50">
//                     <Mail className="text-gray-400 mr-2 h-5 w-5"/>
//                     <input required type="email" placeholder="admin@hospital.com" className="w-full bg-transparent outline-none"
//                       value={form.email} onChange={e => setForm({...form, email: e.target.value})} />
//                  </div>
//                  <div className="flex items-center border border-gray-200 rounded-xl px-3 py-2 focus-within:ring-2 ring-purple-500 bg-gray-50">
//                     <Lock className="text-gray-400 mr-2 h-5 w-5"/>
//                     <input required type="password" placeholder="Create Password" className="w-full bg-transparent outline-none"
//                       value={form.password} onChange={e => setForm({...form, password: e.target.value})} />
//                  </div>
//                </div>
//             </div>

//             <button type="submit" disabled={loading} className="w-full bg-purple-900 text-white font-bold py-3 rounded-xl hover:bg-purple-800 transition-all flex justify-center items-center mt-6">
//               {loading ? <Loader2 className="animate-spin"/> : 'Register Hospital'}
//             </button>

//           </form>
          
//           <p className="text-center text-xs text-gray-400 mt-4">
//             Already a partner? <a href="/auth" className="text-purple-600 font-bold hover:underline">Login here</a>
//           </p>
//         </div>
//       </div>
//     </div>
//   )
// }

'use client'

import Link from 'next/link'
import { 
  HeartPulse, CheckCircle2, TrendingUp, Users, 
  CalendarCheck, ShieldCheck, ArrowRight, Menu, X 
} from 'lucide-react'
import { useState } from 'react'

export default function HospitalLandingPage() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  return (
    <div className="min-h-screen bg-white font-sans text-gray-900">
      
      {/* --- 1. HEADER --- */}
      <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          
          <Link href="/" className="flex items-center gap-2 font-bold text-2xl text-purple-900">
            <div className="bg-green-500 text-white p-1.5 rounded-lg">
              <HeartPulse size={24} />
            </div>
            DocSlotBooking
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-8">
            <Link href="#benefits" className="text-sm font-medium text-gray-600 hover:text-purple-900">Why Us?</Link>
            <Link href="#how-it-works" className="text-sm font-medium text-gray-600 hover:text-purple-900">How it Works</Link>
            <Link href="/hospital/auth" className="text-sm font-bold text-gray-900">Login</Link>
            <Link href="/join/signup" className="bg-purple-900 text-white px-6 py-2.5 rounded-xl text-sm font-bold hover:bg-purple-800 transition-all shadow-lg shadow-purple-200">
              Register Now
            </Link>
          </div>

          {/* Mobile Menu Toggle */}
          <button className="md:hidden" onClick={() => setIsMenuOpen(!isMenuOpen)}>
            {isMenuOpen ? <X /> : <Menu />}
          </button>
        </div>

        {/* Mobile Nav */}
        {isMenuOpen && (
           <div className="md:hidden bg-white border-t p-4 flex flex-col gap-4 shadow-lg absolute w-full">
             <Link href="/hospital/auth" className="font-bold">Login</Link>
             <Link href="/join/signup" className="bg-purple-900 text-white px-4 py-3 rounded-lg text-center font-bold">Register Now</Link>
           </div>
        )}
      </header>

      {/* --- 2. HERO SECTION --- */}
      <section className="relative overflow-hidden bg-purple-50 pt-20 pb-32 px-6">
        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-12 items-center">
          
          <div className="space-y-8 z-10">
            <div className="inline-flex items-center gap-2 bg-white px-4 py-2 rounded-full shadow-sm text-xs font-bold text-purple-700 uppercase tracking-wide">
              <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
              For Hospitals & Clinics
            </div>
            <h1 className="text-5xl md:text-6xl font-extrabold text-gray-900 leading-tight">
              Manage your practice <br/>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-blue-600">
                like a Pro.
              </span>
            </h1>
            <p className="text-lg text-gray-600 max-w-lg leading-relaxed">
              Join thousands of top doctors. Streamline appointments, reduce no-shows, and grow your patient base with our digital ecosystem.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link href="/join/signup" className="bg-green-500 hover:bg-green-600 text-white px-8 py-4 rounded-xl font-bold text-lg transition-all flex items-center justify-center gap-2 shadow-xl shadow-green-200">
                Get Started Free <ArrowRight size={20}/>
              </Link>
              <Link href="#benefits" className="bg-white hover:bg-gray-50 text-gray-900 border px-8 py-4 rounded-xl font-bold text-lg transition-all flex items-center justify-center">
                Learn More
              </Link>
            </div>
            <div className="flex items-center gap-4 text-sm text-gray-500 font-medium pt-4">
              <div className="flex -space-x-2">
                {[1,2,3,4].map(i => (
                  <div key={i} className="w-8 h-8 rounded-full bg-gray-200 border-2 border-white"></div>
                ))}
              </div>
              <p>Trusted by 500+ Doctors</p>
            </div>
          </div>

          {/* Abstract Dashboard Visual */}
          <div className="relative">
             <div className="absolute inset-0 bg-gradient-to-tr from-purple-200 to-blue-200 rounded-full filter blur-3xl opacity-30 animate-pulse"></div>
             <div className="bg-white rounded-2xl shadow-2xl p-6 border border-gray-100 relative z-10 transform rotate-2 hover:rotate-0 transition-all duration-500">
                <div className="flex justify-between items-center mb-6 border-b pb-4">
                   <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-purple-100 rounded-lg"></div>
                      <div>
                        <div className="h-2 w-24 bg-gray-200 rounded mb-1"></div>
                        <div className="h-2 w-16 bg-gray-100 rounded"></div>
                      </div>
                   </div>
                   <div className="h-8 w-20 bg-green-100 rounded-lg"></div>
                </div>
                <div className="space-y-4">
                   {[1,2,3].map(i => (
                     <div key={i} className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
                        <div className="flex gap-3">
                           <div className="w-8 h-8 bg-gray-200 rounded-full"></div>
                           <div className="space-y-1">
                             <div className="h-2 w-20 bg-gray-300 rounded"></div>
                             <div className="h-2 w-12 bg-gray-200 rounded"></div>
                           </div>
                        </div>
                        <div className="h-6 w-16 bg-blue-100 rounded-md"></div>
                     </div>
                   ))}
                </div>
             </div>
          </div>
        </div>
      </section>

      {/* --- 3. BENEFITS GRID --- */}
      <section id="benefits" className="py-24 px-6 max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold mb-4">Why Partner with DocSlot?</h2>
          <p className="text-gray-500 max-w-2xl mx-auto">We provide the tools you need to focus on what matters most: your patients.</p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          <BenefitCard 
            icon={<TrendingUp className="text-purple-600" size={32}/>}
            title="Grow Your Reach"
            desc="Get discovered by thousands of patients searching for specialists in your area every day."
          />
          <BenefitCard 
            icon={<CalendarCheck className="text-green-600" size={32}/>}
            title="Smart Scheduling"
            desc="Automated booking system that manages slots, prevents double-booking, and sends reminders."
          />
          <BenefitCard 
            icon={<ShieldCheck className="text-blue-600" size={32}/>}
            title="Digital Records"
            desc="Securely store and access patient history. HIPAA compliant and 100% secure."
          />
        </div>
      </section>

      {/* --- 4. CTA FOOTER --- */}
      <section className="bg-gray-900 py-20 px-6 text-center text-white">
        <div className="max-w-3xl mx-auto space-y-8">
          <h2 className="text-4xl font-bold">Ready to modernize your clinic?</h2>
          <p className="text-gray-400 text-lg">Join the fastest growing healthcare network today. Setup takes less than 5 minutes.</p>
          <div className="flex justify-center gap-4">
            <Link href="/join/signup" className="bg-green-500 hover:bg-green-600 text-white px-8 py-4 rounded-xl font-bold text-lg transition-all shadow-lg shadow-green-900/50">
              Register Hospital
            </Link>
          </div>
          <p className="text-xs text-gray-500 mt-8">
            © 2024 DocSlotBooking. All rights reserved. <Link href="/contact" className="underline hover:text-white">Contact Support</Link>
          </p>
        </div>
      </section>
    </div>
  )
}

function BenefitCard({ icon, title, desc }: any) {
  return (
    <div className="p-8 border border-gray-100 rounded-2xl bg-white hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
      <div className="w-16 h-16 bg-gray-50 rounded-2xl flex items-center justify-center mb-6">
        {icon}
      </div>
      <h3 className="text-xl font-bold text-gray-900 mb-3">{title}</h3>
      <p className="text-gray-500 leading-relaxed">{desc}</p>
    </div>
  )
}