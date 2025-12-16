// 'use client'

// import { useState } from 'react'
// import { useRouter } from 'next/navigation'
// import { supabase } from '@/lib/supabase'
// import { Loader2, Building2, MapPin, Mail, Lock, Upload } from 'lucide-react'

// export default function HospitalRegister() {
//   const router = useRouter()
//   const [loading, setLoading] = useState(false)
//   const [step, setStep] = useState(1)

//   // Form State
//   const [formData, setFormData] = useState({
//     name: '',
//     description: '',
//     address: '',
//     city: '',
//     email: '',
//     password: '',
//     image_url: 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&q=80&w=1000' // Default dummy
//   })

//   const handleRegister = async (e: React.FormEvent) => {
//     e.preventDefault()
//     setLoading(true)

//     try {
//       // 1. Sign up the User (Admin)
//       const { data: authData, error: authError } = await supabase.auth.signUp({
//         email: formData.email,
//         password: formData.password,
//       })

//       if (authError) throw authError
//       if (!authData.user) throw new Error("No user created")

//       // 2. Create the Hospital Entry
//       const { data: hospitalData, error: hospitalError } = await supabase
//         .from('hospitals')
//         .insert({
//           name: formData.name,
//           address: formData.address,
//           city: formData.city,
//           image_url: formData.image_url
//         })
//         .select()
//         .single()

//       if (hospitalError) throw hospitalError

//       // 3. Link Admin to Hospital
//       const { error: linkError } = await supabase
//         .from('hospital_admins')
//         .insert({
//           id: authData.user.id,
//           hospital_id: hospitalData.id
//         })

//       if (linkError) throw linkError

//       // Success -> Redirect to Admin Dashboard
//       router.push('/admin')

//     } catch (error: any) {
//       alert('Error: ' + error.message)
//     } finally {
//       setLoading(false)
//     }
//   }

//   return (
//     <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
//       <div className="bg-white max-w-2xl w-full rounded-3xl shadow-xl overflow-hidden flex flex-col md:flex-row">
        
//         {/* Left Side (Visual) */}
//         <div className="bg-brand-purple-900 w-full md:w-1/3 p-8 text-white flex flex-col justify-between">
//           <div>
//             <Building2 size={40} className="mb-4 text-brand-green-400" />
//             <h2 className="text-2xl font-bold">Partner Registration</h2>
//             <p className="text-brand-purple-200 text-sm mt-2">Join the largest digital health network.</p>
//           </div>
//           <div className="text-xs text-brand-purple-300">
//             Step {step} of 2
//           </div>
//         </div>

//         {/* Right Side (Form) */}
//         <div className="p-8 w-full md:w-2/3">
//           <form onSubmit={handleRegister} className="space-y-4">
            
//             {step === 1 ? (
//               <>
//                 <h3 className="text-xl font-bold text-gray-900 mb-4">Hospital Details</h3>
//                 <input 
//                   required
//                   placeholder="Hospital Name"
//                   className="w-full p-3 bg-gray-50 rounded-xl border border-gray-200 outline-none focus:border-brand-purple-500"
//                   value={formData.name}
//                   onChange={(e) => setFormData({...formData, name: e.target.value})}
//                 />
//                 <textarea 
//                   placeholder="Short Description..."
//                   className="w-full p-3 bg-gray-50 rounded-xl border border-gray-200 outline-none focus:border-brand-purple-500 h-24 resize-none"
//                   value={formData.description}
//                   onChange={(e) => setFormData({...formData, description: e.target.value})}
//                 />
//                 <div className="grid grid-cols-2 gap-4">
//                    <input 
//                     required
//                     placeholder="City (e.g. Bengaluru)"
//                     className="p-3 bg-gray-50 rounded-xl border border-gray-200 outline-none focus:border-brand-purple-500"
//                     value={formData.city}
//                     onChange={(e) => setFormData({...formData, city: e.target.value})}
//                   />
//                   <input 
//                     required
//                     placeholder="Address"
//                     className="p-3 bg-gray-50 rounded-xl border border-gray-200 outline-none focus:border-brand-purple-500"
//                     value={formData.address}
//                     onChange={(e) => setFormData({...formData, address: e.target.value})}
//                   />
//                 </div>
//                 <button type="button" onClick={() => setStep(2)} className="w-full bg-brand-purple-900 text-white py-3 rounded-xl font-bold mt-4">
//                   Next Step
//                 </button>
//               </>
//             ) : (
//               <>
//                 <h3 className="text-xl font-bold text-gray-900 mb-4">Admin Access</h3>
//                 <div className="relative">
//                   <Mail className="absolute left-3 top-3.5 text-gray-400" size={18}/>
//                   <input 
//                     required
//                     type="email"
//                     placeholder="Admin Email"
//                     className="w-full pl-10 p-3 bg-gray-50 rounded-xl border border-gray-200 outline-none focus:border-brand-purple-500"
//                     value={formData.email}
//                     onChange={(e) => setFormData({...formData, email: e.target.value})}
//                   />
//                 </div>
//                 <div className="relative">
//                   <Lock className="absolute left-3 top-3.5 text-gray-400" size={18}/>
//                   <input 
//                     required
//                     type="password"
//                     placeholder="Create Password"
//                     className="w-full pl-10 p-3 bg-gray-50 rounded-xl border border-gray-200 outline-none focus:border-brand-purple-500"
//                     value={formData.password}
//                     onChange={(e) => setFormData({...formData, password: e.target.value})}
//                   />
//                 </div>
                
//                 <div className="flex gap-3 mt-6">
//                    <button type="button" onClick={() => setStep(1)} className="w-1/3 bg-gray-100 text-gray-600 py-3 rounded-xl font-bold">
//                      Back
//                    </button>
//                    <button type="submit" disabled={loading} className="w-2/3 bg-brand-green-500 text-white py-3 rounded-xl font-bold flex items-center justify-center">
//                      {loading ? <Loader2 className="animate-spin"/> : 'Complete Registration'}
//                    </button>
//                 </div>
//               </>
//             )}

//           </form>
//         </div>
//       </div>
//     </div>
//   )
// }


'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { supabase } from '@/lib/supabase'
import { 
  Building2, MapPin, Mail, Lock, Phone, 
  Loader2, HeartPulse, ArrowLeft 
} from 'lucide-react'

export default function HospitalSignupPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const [form, setForm] = useState({
    name: '',       // Hospital Name
    city: '',
    address: '',
    phone: '',
    email: '',
    password: ''
  })

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      // 1. Create Auth User (The Hospital Admin)
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: form.email,
        password: form.password,
        options: {
          data: {
            full_name: form.name, // Storing Hospital Name as the User Name
            role: 'hospital',     // IMPORTANT: Sets role to 'hospital'
            mobile: form.phone
          }
        }
      })

      if (authError) throw authError
      if (!authData.user) throw new Error("No user created")

      // 2. Create Hospital Entry in Database
      // We manually insert this to link the hospital to this new admin user
      const { error: dbError } = await supabase.from('hospitals').insert({
        owner_id: authData.user.id,
        name: form.name,
        city: form.city,
        address: form.address,
        contact_number: form.phone
      })

      if (dbError) throw dbError

      // 3. Success! Redirect to Hospital Dashboard
      router.push('/hospital/dashboard')

    } catch (err: any) {
      console.error(err)
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      
      {/* Back Button */}
      <Link href="/join" className="absolute top-6 left-6 flex items-center gap-2 text-gray-500 hover:text-purple-900 font-bold transition-colors">
        <ArrowLeft size={20} /> Back
      </Link>

      <div className="bg-white max-w-5xl w-full rounded-3xl shadow-2xl overflow-hidden grid md:grid-cols-2 animate-in fade-in zoom-in-95 duration-500">
        
        {/* Left Side: Visuals & Branding */}
        <div className="bg-gradient-to-br from-purple-900 to-indigo-900 p-12 text-white flex flex-col justify-between relative overflow-hidden">
          <div className="relative z-10">
            <div className="flex items-center gap-2 font-bold text-2xl mb-10">
              <div className="bg-green-500 text-white p-1.5 rounded-lg"><HeartPulse size={24}/></div>
              DocSlot Partner
            </div>
            <h1 className="text-4xl font-bold mb-6 leading-tight">
              Transform your <br/>healthcare practice.
            </h1>
            <ul className="space-y-4 text-purple-100">
              <li className="flex items-center gap-3">
                <div className="h-2 w-2 bg-green-400 rounded-full"></div> Smart Queue Management
              </li>
              <li className="flex items-center gap-3">
                <div className="h-2 w-2 bg-green-400 rounded-full"></div> Digital Patient Records
              </li>
              <li className="flex items-center gap-3">
                <div className="h-2 w-2 bg-green-400 rounded-full"></div> Automated Analytics
              </li>
            </ul>
          </div>
          
          <p className="text-xs text-purple-300 relative z-10 mt-12">
            By joining, you agree to our Partner Terms & Privacy Policy.
          </p>

          {/* Decorative Background Elements */}
          <div className="absolute top-0 right-0 w-80 h-80 bg-purple-800 rounded-full mix-blend-screen filter blur-3xl opacity-30 -translate-y-10 translate-x-10"></div>
          <div className="absolute bottom-0 left-0 w-80 h-80 bg-green-600 rounded-full mix-blend-screen filter blur-3xl opacity-20 translate-y-10 -translate-x-10"></div>
        </div>

        {/* Right Side: Registration Form */}
        <div className="p-10 md:p-12 overflow-y-auto max-h-[90vh]">
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900">Register Hospital</h2>
            <p className="text-gray-500 text-sm mt-1">Create your admin account to get started.</p>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-100 text-red-600 text-sm rounded-xl flex items-start gap-2">
              <div className="min-w-[4px] h-4 bg-red-500 rounded-full mt-0.5"></div>
              {error}
            </div>
          )}

          <form onSubmit={handleRegister} className="space-y-5">
            
            {/* Hospital Details Section */}
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase mb-1.5 ml-1">Hospital Name</label>
                <div className="flex items-center border border-gray-200 rounded-xl px-4 py-3 focus-within:ring-2 ring-purple-500 bg-gray-50 transition-all">
                  <Building2 className="text-gray-400 mr-3 h-5 w-5"/>
                  <input required placeholder="e.g. City Care Clinic" className="w-full bg-transparent outline-none text-gray-900 placeholder:text-gray-400"
                    value={form.name} onChange={e => setForm({...form, name: e.target.value})} />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase mb-1.5 ml-1">City</label>
                  <div className="flex items-center border border-gray-200 rounded-xl px-4 py-3 focus-within:ring-2 ring-purple-500 bg-gray-50 transition-all">
                    <MapPin className="text-gray-400 mr-3 h-5 w-5"/>
                    <input required placeholder="City" className="w-full bg-transparent outline-none text-gray-900"
                      value={form.city} onChange={e => setForm({...form, city: e.target.value})} />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase mb-1.5 ml-1">Phone</label>
                  <div className="flex items-center border border-gray-200 rounded-xl px-4 py-3 focus-within:ring-2 ring-purple-500 bg-gray-50 transition-all">
                    <Phone className="text-gray-400 mr-3 h-5 w-5"/>
                    <input required placeholder="Number" className="w-full bg-transparent outline-none text-gray-900"
                      value={form.phone} onChange={e => setForm({...form, phone: e.target.value})} />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase mb-1.5 ml-1">Full Address</label>
                <textarea required placeholder="Street Address, Area, Pincode..." className="w-full border border-gray-200 rounded-xl px-4 py-3 focus:ring-2 ring-purple-500 bg-gray-50 outline-none h-24 resize-none transition-all"
                  value={form.address} onChange={e => setForm({...form, address: e.target.value})} />
              </div>
            </div>

            {/* Login Credentials Section */}
            <div className="pt-6 border-t border-gray-100">
               <p className="text-sm font-bold text-gray-900 mb-4 flex items-center gap-2">
                 <Lock size={16} className="text-purple-600"/> Admin Access Details
               </p>
               
               <div className="space-y-4">
                 <div>
                   <label className="block text-xs font-bold text-gray-500 uppercase mb-1.5 ml-1">Email Address</label>
                   <div className="flex items-center border border-gray-200 rounded-xl px-4 py-3 focus-within:ring-2 ring-purple-500 bg-gray-50 transition-all">
                      <Mail className="text-gray-400 mr-3 h-5 w-5"/>
                      <input required type="email" placeholder="admin@hospital.com" className="w-full bg-transparent outline-none text-gray-900"
                        value={form.email} onChange={e => setForm({...form, email: e.target.value})} />
                   </div>
                 </div>
                 
                 <div>
                   <label className="block text-xs font-bold text-gray-500 uppercase mb-1.5 ml-1">Password</label>
                   <div className="flex items-center border border-gray-200 rounded-xl px-4 py-3 focus-within:ring-2 ring-purple-500 bg-gray-50 transition-all">
                      <Lock className="text-gray-400 mr-3 h-5 w-5"/>
                      <input required type="password" placeholder="••••••••" className="w-full bg-transparent outline-none text-gray-900"
                        value={form.password} onChange={e => setForm({...form, password: e.target.value})} />
                   </div>
                 </div>
               </div>
            </div>

            <button type="submit" disabled={loading} className="w-full bg-purple-900 text-white font-bold py-4 rounded-xl hover:bg-purple-800 transition-all flex justify-center items-center shadow-lg shadow-purple-200 mt-2">
              {loading ? <Loader2 className="animate-spin mr-2"/> : 'Create Hospital Account'}
            </button>

          </form>
          
          <div className="mt-6 text-center">
            <p className="text-sm text-gray-500">
              Already have an account? <Link href="/hospital/auth" className="text-purple-700 font-bold hover:underline">Log in</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}