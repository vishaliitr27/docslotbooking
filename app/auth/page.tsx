// 'use client'
// import { useState } from 'react'
// import { supabase } from '@/lib/supabase'
// import { useRouter } from 'next/navigation'
// import Link from 'next/link'

// export default function PatientAuth() {
//   const router = useRouter()
//   const [loading, setLoading] = useState(false)
//   const [isSignUp, setIsSignUp] = useState(false)
  
//   const [form, setForm] = useState({ 
//     email: '', password: '', name: '', mobile: '', age: '', gender: 'Male' 
//   })

//   const handleAuth = async (e: React.FormEvent) => {
//     e.preventDefault()
//     setLoading(true)

//     try {
//       if (isSignUp) {
//         // 1. Create Auth User
//         const { data, error } = await supabase.auth.signUp({
//           email: form.email,
//           password: form.password,
//         })
//         if (error) throw error

//         // 2. Create Patient Profile
//         if (data.user) {
//           const { error: profileError } = await supabase.from('profiles').insert({
//             id: data.user.id,
//             full_name: form.name,
//             mobile: form.mobile,
//             age: parseInt(form.age),
//             gender: form.gender
//           })
//           if (profileError) throw profileError
          
//           alert('Account Created! Logging in...')
//           router.push('/profile')
//         }
//       } else {
//         // Login
//         const { error } = await supabase.auth.signInWithPassword({
//           email: form.email,
//           password: form.password,
//         })
//         if (error) throw error
//         router.push('/profile')
//       }
//     } catch (err: any) {
//       alert(err.message)
//     } finally {
//       setLoading(false)
//     }
//   }

//   return (
//     <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
//       <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md">
//         <h1 className="text-2xl font-bold mb-6 text-center">{isSignUp ? 'New Patient Registration' : 'Patient Login'}</h1>
        
//         <form onSubmit={handleAuth} className="space-y-4">
//           {isSignUp && (
//             <>
//               <input placeholder="Full Name" required className="w-full p-3 border rounded-lg" onChange={e => setForm({...form, name: e.target.value})} />
//               <input placeholder="Mobile Number" required type="tel" className="w-full p-3 border rounded-lg" onChange={e => setForm({...form, mobile: e.target.value})} />
//               <div className="flex gap-2">
//                 <input placeholder="Age" required type="number" className="w-1/3 p-3 border rounded-lg" onChange={e => setForm({...form, age: e.target.value})} />
//                 <select className="w-2/3 p-3 border rounded-lg" onChange={e => setForm({...form, gender: e.target.value})}>
//                   <option>Male</option><option>Female</option><option>Other</option>
//                 </select>
//               </div>
//             </>
//           )}
          
//           <input type="email" placeholder="Email" required className="w-full p-3 border rounded-lg" onChange={e => setForm({...form, email: e.target.value})} />
//           <input type="password" placeholder="Password" required className="w-full p-3 border rounded-lg" onChange={e => setForm({...form, password: e.target.value})} />

//           <button disabled={loading} className="w-full bg-blue-600 text-white p-3 rounded-lg font-bold">
//             {loading ? 'Processing...' : (isSignUp ? 'Sign Up' : 'Login')}
//           </button>
//         </form>

//         <p className="mt-4 text-center text-sm text-blue-600 cursor-pointer" onClick={() => setIsSignUp(!isSignUp)}>
//           {isSignUp ? 'Already have an account? Login' : 'New here? Create Profile'}
//         </p>
//         <div className="mt-4 text-center border-t pt-4">
//              <Link href="/admin/login" className="text-xs text-gray-400 hover:text-gray-600">Doctor/Hospital Login</Link>
//         </div>
//       </div>
//     </div>
//   )
// }

// 'use client'

// import { useState } from 'react'
// import { useRouter } from 'next/navigation'
// import Link from 'next/link'
// import { supabase } from '@/lib/supabase'
// import { 
//   HeartPulse, Mail, Lock, Loader2, 
//   User, Building2, ArrowRight, Stethoscope 
// } from 'lucide-react'

// type Role = 'patient' | 'hospital'

// export default function AuthPage() {
//   const router = useRouter()
  
//   // State
//   const [role, setRole] = useState<Role>('patient') // Default to patient
//   const [isLogin, setIsLogin] = useState(true)
//   const [loading, setLoading] = useState(false)
//   const [error, setError] = useState<string | null>(null)

//   // Form State
//   const [email, setEmail] = useState('')
//   const [password, setPassword] = useState('')
  
//   // Patient Specific Signup Fields
//   const [name, setName] = useState('')
//   const [mobile, setMobile] = useState('')
//   const [age, setAge] = useState('')
//   const [gender, setGender] = useState('Male')

//   const handleAuth = async (e: React.FormEvent) => {
//     e.preventDefault()
//     setLoading(true)
//     setError(null)

//     try {
//       if (isLogin) {
//         // --- LOGIN LOGIC (Same for everyone) ---
//         const { data, error } = await supabase.auth.signInWithPassword({
//           email,
//           password,
//         })
//         if (error) throw error

//         // --- SMART REDIRECT ---
//         // Check the user's role from metadata to decide where to go
//         const userRole = data.user?.user_metadata?.role

//         if (userRole === 'hospital' || userRole === 'doctor') {
//           router.push('/hospital/dashboard')
//         } else {
//           // Default to profile for patients
//           router.push('/profile')
//         }
//         router.refresh()

//       } else {
//         // --- SIGNUP LOGIC ---
        
//         if (role === 'hospital') {
//           // If they try to signup as hospital here, redirect to the full registration page
//           router.push('/join/signup')
//           return
//         }

//         // Patient Signup
//         const { error } = await supabase.auth.signUp({
//           email,
//           password,
//           options: {
//             data: {
//               full_name: name,
//               mobile,
//               age,
//               gender,
//               role: 'patient' // IMPORTANT: Tag them as patient
//             }
//           }
//         })
//         if (error) throw error
        
//         // Redirect to profile
//         router.push('/profile')
//         router.refresh()
//       }
//     } catch (err: any) {
//       setError(err.message)
//     } finally {
//       setLoading(false)
//     }
//   }

//   return (
//     <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      
//       {/* Home Link */}
//       <Link href="/" className="absolute top-6 left-6 flex items-center gap-2 font-bold text-gray-600 hover:text-purple-900 transition-colors">
//         <HeartPulse className="text-green-500" /> Back to Home
//       </Link>

//       <div className="bg-white w-full max-w-md rounded-3xl shadow-2xl overflow-hidden border border-gray-100">
        
//         {/* Header Section */}
//         <div className="bg-purple-900 p-8 text-white text-center">
//           <h1 className="text-3xl font-bold mb-2">Welcome Back</h1>
//           <p className="text-purple-200 text-sm">Access your healthcare dashboard</p>
//         </div>

//         <div className="p-8">
          
//           {/* --- ROLE SELECTOR TABS --- */}
//           <div className="flex bg-gray-100 p-1 rounded-xl mb-8">
//             <button
//               onClick={() => setRole('patient')}
//               className={`flex-1 flex items-center justify-center gap-2 py-2.5 text-sm font-bold rounded-lg transition-all ${
//                 role === 'patient' 
//                   ? 'bg-white text-purple-900 shadow-sm' 
//                   : 'text-gray-500 hover:text-gray-700'
//               }`}
//             >
//               <User size={16} /> Patient
//             </button>
//             <button
//               onClick={() => setRole('hospital')}
//               className={`flex-1 flex items-center justify-center gap-2 py-2.5 text-sm font-bold rounded-lg transition-all ${
//                 role === 'hospital' 
//                   ? 'bg-white text-purple-900 shadow-sm' 
//                   : 'text-gray-500 hover:text-gray-700'
//               }`}
//             >
//               <Building2 size={16} /> Hospital / Doc
//             </button>
//           </div>

//           {error && (
//             <div className="mb-6 p-3 bg-red-50 border border-red-100 text-red-600 text-xs rounded-lg font-medium">
//               {error}
//             </div>
//           )}

//           {/* --- FORM --- */}
//           <form onSubmit={handleAuth} className="space-y-4">
            
//             {/* If Signing Up as Patient, show extra fields */}
//             {!isLogin && role === 'patient' && (
//               <div className="space-y-4 animate-in slide-in-from-top-4 fade-in">
//                 <div className="bg-blue-50 p-3 rounded-lg text-xs text-blue-700 font-medium mb-2">
//                   Create your patient profile to book appointments.
//                 </div>
//                 <input required placeholder="Full Name" className="w-full p-3 bg-gray-50 border rounded-xl outline-none focus:border-purple-500"
//                   value={name} onChange={e => setName(e.target.value)} />
//                 <div className="grid grid-cols-2 gap-3">
//                    <input required placeholder="Age" className="w-full p-3 bg-gray-50 border rounded-xl outline-none focus:border-purple-500"
//                     value={age} onChange={e => setAge(e.target.value)} />
//                    <select className="w-full p-3 bg-gray-50 border rounded-xl outline-none focus:border-purple-500"
//                     value={gender} onChange={e => setGender(e.target.value)}>
//                      <option>Male</option>
//                      <option>Female</option>
//                      <option>Other</option>
//                    </select>
//                 </div>
//                 <input required placeholder="Mobile Number" className="w-full p-3 bg-gray-50 border rounded-xl outline-none focus:border-purple-500"
//                   value={mobile} onChange={e => setMobile(e.target.value)} />
//               </div>
//             )}

//             {/* If Signing Up as Hospital, show Redirect Message */}
//             {!isLogin && role === 'hospital' ? (
//               <div className="text-center py-6 space-y-4 animate-in fade-in">
//                 <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-2">
//                   <Stethoscope size={32} />
//                 </div>
//                 <h3 className="font-bold text-gray-900">Partner Registration</h3>
//                 <p className="text-sm text-gray-500">
//                   Hospital and Doctor registration requires detailed verification. Please use our partner portal.
//                 </p>
//                 <Link href="/join/signup" className="block w-full bg-green-500 text-white font-bold py-3 rounded-xl hover:bg-green-600 transition-colors">
//                   Go to Partner Registration
//                 </Link>
//               </div>
//             ) : (
//               /* Standard Login/Patient Signup Fields */
//               <>
//                 <div className="space-y-4">
//                   <div className="flex items-center border border-gray-200 rounded-xl px-3 py-3 focus-within:ring-2 ring-purple-500 transition-all">
//                     <Mail className="text-gray-400 mr-3 h-5 w-5"/>
//                     <input required type="email" placeholder="Email Address" className="w-full outline-none text-gray-900 placeholder:text-gray-400"
//                       value={email} onChange={e => setEmail(e.target.value)} />
//                   </div>
//                   <div className="flex items-center border border-gray-200 rounded-xl px-3 py-3 focus-within:ring-2 ring-purple-500 transition-all">
//                     <Lock className="text-gray-400 mr-3 h-5 w-5"/>
//                     <input required type="password" placeholder="Password" className="w-full outline-none text-gray-900 placeholder:text-gray-400"
//                       value={password} onChange={e => setPassword(e.target.value)} />
//                   </div>
//                 </div>

//                 <button type="submit" disabled={loading} className="w-full bg-purple-900 text-white font-bold py-3.5 rounded-xl hover:bg-purple-800 transition-all flex justify-center items-center shadow-lg shadow-purple-200 mt-2">
//                   {loading ? <Loader2 className="animate-spin" /> : (isLogin ? 'Login Securely' : 'Create Account')}
//                 </button>
//               </>
//             )}

//           </form>

//           {/* Footer Toggle */}
//           {role !== 'hospital' || isLogin ? (
//             <div className="mt-6 text-center pt-6 border-t border-gray-100">
//               <p className="text-sm text-gray-500">
//                 {isLogin ? "Don't have an account?" : "Already have an account?"}
//               </p>
//               <button 
//                 onClick={() => setIsLogin(!isLogin)} 
//                 className="text-purple-700 font-bold text-sm hover:underline mt-1"
//               >
//                 {isLogin ? `Sign up as ${role === 'hospital' ? 'Partner' : 'Patient'}` : 'Back to Login'}
//               </button>
//             </div>
//           ) : null}

//         </div>
//       </div>
//     </div>
//   )
// }


// this is working code for patient auth page 




'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { supabase } from '@/lib/supabase'
import { HeartPulse, Mail, Lock, Loader2, ArrowLeft } from 'lucide-react'

export default function PatientAuthPage() {
  const router = useRouter()
  const [isLogin, setIsLogin] = useState(true)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Form State
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  
  // Signup Fields
  const [name, setName] = useState('')
  const [mobile, setMobile] = useState('')
  const [age, setAge] = useState('')
  const [gender, setGender] = useState('Male')

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      if (isLogin) {
        // --- LOGIN ---
        const { error } = await supabase.auth.signInWithPassword({ email, password })
        if (error) throw error
        router.push('/profile') // Always go to Patient Profile
        router.refresh()
      } else {
        // --- SIGNUP ---
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: {
              full_name: name,
              mobile,
              age,
              gender,
              role: 'patient' // Strictly Patient
            }
          }
        })
        if (error) throw error
        router.push('/profile')
        router.refresh()
      }
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <Link href="/" className="absolute top-6 left-6 flex items-center gap-2 font-bold text-gray-600 hover:text-purple-900">
        <ArrowLeft size={20} /> Home
      </Link>

      <div className="bg-white w-full max-w-md rounded-3xl shadow-xl overflow-hidden">
        <div className="bg-gradient-to-r from-green-400 to-green-600 p-8 text-white text-center">
          <HeartPulse size={48} className="mx-auto mb-2 text-white/90" />
          <h1 className="text-2xl font-bold">Patient Portal</h1>
          <p className="text-green-100 text-sm">Login to book appointments</p>
        </div>

        <div className="p-8">
          {error && <div className="mb-4 p-3 bg-red-50 text-red-600 text-sm rounded-lg">{error}</div>}

          <form onSubmit={handleAuth} className="space-y-4">
            
            {!isLogin && (
              <div className="space-y-3 animate-in slide-in-from-top-4">
                <input required placeholder="Full Name" className="w-full p-3 bg-gray-50 border rounded-xl outline-none" value={name} onChange={e => setName(e.target.value)} />
                <div className="grid grid-cols-2 gap-3">
                   <input required placeholder="Age" className="w-full p-3 bg-gray-50 border rounded-xl outline-none" value={age} onChange={e => setAge(e.target.value)} />
                   <select className="w-full p-3 bg-gray-50 border rounded-xl outline-none" value={gender} onChange={e => setGender(e.target.value)}>
                     <option>Male</option> <option>Female</option> <option>Other</option>
                   </select>
                </div>
                <input required placeholder="Mobile Number" className="w-full p-3 bg-gray-50 border rounded-xl outline-none" value={mobile} onChange={e => setMobile(e.target.value)} />
              </div>
            )}

            <div className="flex items-center border rounded-xl px-3 py-3 bg-gray-50">
              <Mail className="text-gray-400 mr-3 h-5 w-5"/>
              <input required type="email" placeholder="Email Address" className="w-full bg-transparent outline-none" value={email} onChange={e => setEmail(e.target.value)} />
            </div>
            <div className="flex items-center border rounded-xl px-3 py-3 bg-gray-50">
              <Lock className="text-gray-400 mr-3 h-5 w-5"/>
              <input required type="password" placeholder="Password" className="w-full bg-transparent outline-none" value={password} onChange={e => setPassword(e.target.value)} />
            </div>

            <button type="submit" disabled={loading} className="w-full bg-gray-900 text-white font-bold py-3 rounded-xl hover:bg-gray-800 transition-all flex justify-center items-center">
              {loading ? <Loader2 className="animate-spin" /> : (isLogin ? 'Login' : 'Create Account')}
            </button>
          </form>

          <div className="mt-6 text-center border-t pt-4">
            <p className="text-sm text-gray-500 mb-2">{isLogin ? "New user?" : "Already have an account?"}</p>
            <button onClick={() => setIsLogin(!isLogin)} className="text-green-600 font-bold hover:underline">
              {isLogin ? 'Sign Up as Patient' : 'Back to Login'}
            </button>
            <div className="mt-4 pt-4 border-t text-xs">
                <Link href="/hospital/auth" className="text-purple-600 hover:underline">Are you a Hospital Admin?</Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

