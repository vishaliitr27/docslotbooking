// 'use client'

// import { useState } from 'react'
// import { useRouter } from 'next/navigation'
// import Link from 'next/link'
// import { supabase } from '@/lib/supabase'
// import { Building2, Mail, Lock, Loader2, ArrowLeft } from 'lucide-react'

// export default function HospitalLoginPage() {
//   const router = useRouter()
//   const [loading, setLoading] = useState(false)
//   const [error, setError] = useState<string | null>(null)
//   const [email, setEmail] = useState('')
//   const [password, setPassword] = useState('')

//   const handleLogin = async (e: React.FormEvent) => {
//     e.preventDefault()
//     setLoading(true)
//     setError(null)

//     try {
//       const { data, error } = await supabase.auth.signInWithPassword({ email, password })
//       if (error) throw error

//       // Security Check: Ensure this is actually a hospital account
//       if (data.user?.user_metadata?.role !== 'hospital') {
//         throw new Error("Access Denied. This portal is for Hospitals only.")
//       }

//       router.push('/hospital/dashboard')
//       router.refresh()
//     } catch (err: any) {
//       setError(err.message)
//     } finally {
//       setLoading(false)
//     }
//   }

//   return (
//     <div className="min-h-screen bg-purple-50 flex items-center justify-center p-4">
//       <Link href="/" className="absolute top-6 left-6 flex items-center gap-2 font-bold text-gray-600 hover:text-purple-900">
//         <ArrowLeft size={20} /> Home
//       </Link>

//       <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl border border-purple-100 overflow-hidden">
//         <div className="bg-purple-900 p-8 text-white text-center">
//           <Building2 size={40} className="mx-auto mb-3 text-purple-200" />
//           <h1 className="text-2xl font-bold">Hospital Partner</h1>
//           <p className="text-purple-200 text-sm">Manage doctors and slots</p>
//         </div>

//         <div className="p-8">
//           {error && <div className="mb-6 p-3 bg-red-50 border border-red-100 text-red-600 text-sm rounded-lg">{error}</div>}

//           <form onSubmit={handleLogin} className="space-y-5">
//             <div>
//               <label className="text-xs font-bold text-gray-500 uppercase ml-1 mb-1 block">Hospital Email</label>
//               <div className="flex items-center border border-gray-200 rounded-xl px-4 py-3 bg-gray-50 focus-within:ring-2 ring-purple-500 transition-all">
//                 <Mail className="text-gray-400 mr-3 h-5 w-5"/>
//                 <input required type="email" placeholder="admin@hospital.com" className="w-full bg-transparent outline-none" 
//                   value={email} onChange={e => setEmail(e.target.value)} />
//               </div>
//             </div>

//             <div>
//               <label className="text-xs font-bold text-gray-500 uppercase ml-1 mb-1 block">Password</label>
//               <div className="flex items-center border border-gray-200 rounded-xl px-4 py-3 bg-gray-50 focus-within:ring-2 ring-purple-500 transition-all">
//                 <Lock className="text-gray-400 mr-3 h-5 w-5"/>
//                 <input required type="password" placeholder="••••••••" className="w-full bg-transparent outline-none" 
//                   value={password} onChange={e => setPassword(e.target.value)} />
//               </div>
//             </div>

//             <button type="submit" disabled={loading} className="w-full bg-purple-900 text-white font-bold py-4 rounded-xl hover:bg-purple-800 transition-all flex justify-center items-center shadow-lg shadow-purple-200">
//               {loading ? <Loader2 className="animate-spin" /> : 'Access Dashboard'}
//             </button>
//           </form>

//           <div className="mt-8 text-center">
//             <p className="text-sm text-gray-500">Not a partner yet?</p>
//             <Link href="/join/signup" className="text-purple-700 font-bold hover:underline">
//               Register your Hospital
//             </Link>
//           </div>
//         </div>
//       </div>
//     </div>
//   )
// }




// // this is working code 
'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { supabase } from '@/lib/supabase'
import { Building2, Mail, Lock, Loader2, ArrowLeft, AlertCircle } from 'lucide-react'

export default function HospitalLoginPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      // 1. Attempt Login
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (error) throw error

      // 2. SECURITY CHECK: Verify Role
      // If a 'patient' tries to login here, kick them out.
      const role = data.user?.user_metadata?.role
      
      if (role !== 'hospital') {
        // Sign them out immediately
        await supabase.auth.signOut()
        throw new Error("Access Denied. This login is for Hospital Partners only.")
      }

      // 3. Success -> Redirect to Dashboard
      router.push('/hospital/dashboard')
      router.refresh()

    } catch (err: any) {
      console.error(err)
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-white flex items-center justify-center p-4 font-sans">
      
      {/* Back to Home Link */}
      <Link href="/" className="absolute top-6 left-6 flex items-center gap-2 font-bold text-gray-500 hover:text-purple-900 transition-colors">
        <ArrowLeft size={20} /> Back to Home
      </Link>

      <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl border border-purple-100 overflow-hidden">
        
        {/* Header */}
        <div className="bg-purple-900 p-8 text-white text-center relative overflow-hidden">
          <div className="relative z-10">
            <div className="mx-auto bg-purple-800 w-16 h-16 rounded-2xl flex items-center justify-center mb-4 shadow-inner">
              <Building2 size={32} className="text-purple-200" />
            </div>
            <h1 className="text-2xl font-bold">Partner Login</h1>
            <p className="text-purple-200 text-sm mt-1">Manage your doctors & appointments</p>
          </div>
          
          {/* Decorative Circles */}
          <div className="absolute top-0 right-0 w-32 h-32 bg-purple-800 rounded-full blur-2xl opacity-50 -translate-y-10 translate-x-10"></div>
          <div className="absolute bottom-0 left-0 w-32 h-32 bg-indigo-800 rounded-full blur-2xl opacity-50 translate-y-10 -translate-x-10"></div>
        </div>

        {/* Form Section */}
        <div className="p-8">
          
          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-100 text-red-600 text-sm rounded-xl flex items-start gap-3">
              <AlertCircle size={18} className="shrink-0 mt-0.5" />
              <span className="font-medium">{error}</span>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-5">
            
            <div className="space-y-1">
              <label className="text-xs font-bold text-gray-500 uppercase ml-1">Work Email</label>
              <div className="flex items-center border border-gray-200 rounded-xl px-4 py-3 bg-gray-50 focus-within:bg-white focus-within:ring-2 ring-purple-500 transition-all">
                <Mail className="text-gray-400 mr-3 h-5 w-5"/>
                <input 
                  required 
                  type="email" 
                  placeholder="admin@hospital.com" 
                  className="w-full bg-transparent outline-none text-gray-900" 
                  value={email} 
                  onChange={e => setEmail(e.target.value)} 
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-gray-500 uppercase ml-1">Password</label>
              <div className="flex items-center border border-gray-200 rounded-xl px-4 py-3 bg-gray-50 focus-within:bg-white focus-within:ring-2 ring-purple-500 transition-all">
                <Lock className="text-gray-400 mr-3 h-5 w-5"/>
                <input 
                  required 
                  type="password" 
                  placeholder="••••••••" 
                  className="w-full bg-transparent outline-none text-gray-900" 
                  value={password} 
                  onChange={e => setPassword(e.target.value)} 
                />
              </div>
            </div>

            <button 
              type="submit" 
              disabled={loading} 
              className="w-full bg-purple-900 text-white font-bold py-4 rounded-xl hover:bg-purple-800 active:scale-[0.98] transition-all flex justify-center items-center shadow-lg shadow-purple-200 mt-2"
            >
              {loading ? <Loader2 className="animate-spin" /> : 'Access Dashboard'}
            </button>
          </form>

          {/* Footer Links */}
          <div className="mt-8 text-center border-t border-gray-100 pt-6">
            <p className="text-sm text-gray-500 mb-2">Want to list your practice?</p>
            <Link href="/join/signup" className="text-purple-700 font-bold hover:underline inline-flex items-center gap-1">
              Register as Hospital
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

