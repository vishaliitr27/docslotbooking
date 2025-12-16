'use client'

import { useState, useEffect, Suspense } from 'react'
import { useParams, useRouter, useSearchParams } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import { Calendar, Clock, CheckCircle, ArrowLeft, Loader2, Stethoscope, Info } from 'lucide-react'
import Link from 'next/link'

function BookingContent() {
  const params = useParams()
  const router = useRouter()
  const searchParams = useSearchParams()
  const doctorId = params.id as string
  
  // Read URL params (in case we just came back from Login)
  const urlDate = searchParams.get('date')
  const urlSlot = searchParams.get('slot')

  // Data State
  const [doctor, setDoctor] = useState<any>(null)
  const [user, setUser] = useState<any>(null)
  
  // Booking State
  const [selectedDate, setSelectedDate] = useState<Date>(urlDate ? new Date(urlDate) : new Date())
  const [selectedSlot, setSelectedSlot] = useState<string | null>(urlSlot)
  const [takenSlots, setTakenSlots] = useState<string[]>([])
  
  // Flow State
  const [step, setStep] = useState<'slot-selection' | 'problem-input' | 'confirmed'>('slot-selection')
  const [problem, setProblem] = useState('')
  const [loading, setLoading] = useState(true)
  const [processing, setProcessing] = useState(false)

  // 1. Initialize Data
  useEffect(() => {
    const init = async () => {
      // Fetch Doc
      const { data: doc } = await supabase
        .from('doctors')
        .select(`*, hospitals(name, address)`)
        .eq('id', doctorId)
        .single()
      setDoctor(doc)

      // Check Auth
      const { data: { user } } = await supabase.auth.getUser()
      setUser(user)
      
      setLoading(false)
      
      // If we came back from login with a slot pre-selected, move to next step
      if (user && urlSlot && urlDate) {
        setStep('problem-input')
      }
    }
    init()
  }, [doctorId, urlSlot, urlDate])

  // 2. Fetch Slots availability
  useEffect(() => {
    const fetchSlots = async () => {
      const startOfDay = new Date(selectedDate); startOfDay.setHours(0,0,0,0)
      const endOfDay = new Date(selectedDate); endOfDay.setHours(23,59,59,999)

      const { data } = await supabase
        .from('appointments')
        .select('appointment_date')
        .eq('doctor_id', doctorId)
        .gte('appointment_date', startOfDay.toISOString())
        .lte('appointment_date', endOfDay.toISOString())

      const taken = data?.map(app => {
        const d = new Date(app.appointment_date)
        return `${d.getHours()}:${d.getMinutes().toString().padStart(2, '0')}`
      }) || []
      setTakenSlots(taken)
    }
    fetchSlots()
  }, [selectedDate, doctorId])

  const generateSlots = () => {
    const slots = []
    for (let i = 9; i < 17; i++) {
      slots.push(`${i}:00`)
      slots.push(`${i}:30`)
    }
    return slots
  }

  // 3. Handle Book Click
  const proceedToBook = () => {
    if (!selectedSlot) return

    if (!user) {
      // Redirect to Auth with return URL containing current selection
      const returnUrl = `/booking/${doctorId}?date=${selectedDate.toISOString()}&slot=${selectedSlot}`
      router.push(`/auth?returnUrl=${encodeURIComponent(returnUrl)}`)
    } else {
      setStep('problem-input')
    }
  }

  // 4. Final Confirm
  const confirmBooking = async () => {
    setProcessing(true)
    if (!selectedSlot) return

    const [hours, minutes] = selectedSlot.split(':')
    const appointmentDate = new Date(selectedDate)
    appointmentDate.setHours(parseInt(hours), parseInt(minutes), 0)

    const { error } = await supabase.from('appointments').insert({
      doctor_id: doctorId,
      patient_id: user.id,
      appointment_date: appointmentDate.toISOString(),
      problem: problem, // Insert the problem
      status: 'confirmed'
    })

    setProcessing(false)
    if (error) {
      alert('Error booking: ' + error.message)
    } else {
      setStep('confirmed')
    }
  }

  if (loading) return <div className="p-20 text-center"><Loader2 className="animate-spin inline text-brand-green-500" /></div>

  // --- SUCCESS VIEW ---
  if (step === 'confirmed') {
    return (
      <div className="min-h-screen bg-brand-green-50 flex items-center justify-center p-4">
        <div className="bg-white p-8 rounded-3xl shadow-xl max-w-md w-full text-center">
          <div className="mx-auto h-20 w-20 bg-green-100 rounded-full flex items-center justify-center mb-6">
            <CheckCircle className="h-10 w-10 text-brand-green-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Booking Confirmed!</h2>
          <p className="text-gray-500 mb-6">
            Your appointment with <strong>{doctor.name}</strong> is set.
          </p>
          <div className="bg-gray-50 p-4 rounded-xl mb-6 text-left">
             <p className="text-sm text-gray-500">Problem</p>
             <p className="font-medium text-gray-900">{problem}</p>
             <div className="h-px bg-gray-200 my-2"></div>
             <p className="text-sm text-gray-500">Time</p>
             <p className="font-medium text-gray-900">{selectedDate.toLocaleDateString()} at {selectedSlot}</p>
          </div>
          <Link href="/profile" className="block w-full bg-brand-purple-900 text-white py-3 rounded-xl font-bold">
            Go to My Dashboard
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-white pb-24">
      {/* Header */}
      <div className="sticky top-0 bg-white/95 backdrop-blur z-10 border-b border-gray-100 px-4 py-4 flex items-center gap-4">
        <Link href="/" className="p-2 hover:bg-gray-100 rounded-full"><ArrowLeft size={20}/></Link>
        <div>
           <h1 className="font-bold text-lg">{doctor.name}</h1>
           <p className="text-xs text-gray-500">{doctor.specialty}</p>
        </div>
      </div>

      <div className="max-w-2xl mx-auto p-4 space-y-6">
        
        {/* Doctor Info Card */}
        <div className="bg-brand-purple-50 p-6 rounded-2xl flex items-start gap-4">
           <img src={doctor.image_url || ''} className="h-20 w-20 rounded-xl object-cover bg-white" />
           <div>
             <h3 className="font-bold text-brand-purple-900">About the Doctor</h3>
             <p className="text-sm text-gray-600 mt-1 line-clamp-2">{doctor.bio}</p>
             <div className="flex gap-2 mt-3">
               <span className="text-xs font-bold bg-white text-brand-purple-900 px-2 py-1 rounded-lg border border-brand-purple-100">
                 10+ Years Exp.
               </span>
               <span className="text-xs font-bold bg-white text-brand-purple-900 px-2 py-1 rounded-lg border border-brand-purple-100">
                 {doctor.hospitals?.name}
               </span>
             </div>
           </div>
        </div>

        {step === 'slot-selection' ? (
          <>
            {/* 1. Date Selection */}
            <div>
              <h3 className="font-bold text-gray-900 mb-3 flex items-center gap-2">
                <Calendar size={18} className="text-brand-green-500"/> Select Date
              </h3>
              <div className="flex gap-3 overflow-x-auto pb-2 no-scrollbar">
                {[...Array(7)].map((_, i) => {
                  const d = new Date(); d.setDate(d.getDate() + i)
                  const isSel = d.toDateString() === selectedDate.toDateString()
                  return (
                    <button key={i} onClick={() => {setSelectedDate(d); setSelectedSlot(null)}}
                      className={`flex-shrink-0 w-16 h-20 rounded-xl flex flex-col items-center justify-center border-2 transition-all ${isSel ? 'border-brand-green-500 bg-brand-green-50 text-brand-green-700' : 'border-transparent bg-gray-50'}`}>
                      <span className="text-xs font-bold uppercase">{d.toLocaleDateString('en-US',{weekday:'short'})}</span>
                      <span className="text-xl font-black">{d.getDate()}</span>
                    </button>
                  )
                })}
              </div>
            </div>

            {/* 2. Slot Selection */}
            <div>
              <h3 className="font-bold text-gray-900 mb-3 flex items-center gap-2">
                <Clock size={18} className="text-brand-green-500"/> Select Time
              </h3>
              <div className="grid grid-cols-3 gap-3">
                {generateSlots().map(slot => {
                   const isTaken = takenSlots.includes(slot)
                   return (
                     <button key={slot} disabled={isTaken} onClick={() => setSelectedSlot(slot)}
                       className={`py-3 rounded-xl text-sm font-bold border-2 transition-all ${
                         selectedSlot === slot ? 'border-brand-purple-900 bg-brand-purple-900 text-white' : 
                         isTaken ? 'bg-gray-100 text-gray-300 border-transparent decoration-slice line-through' : 
                         'bg-white border-gray-100 text-gray-700 hover:border-brand-purple-200'
                       }`}>
                       {slot}
                     </button>
                   )
                })}
              </div>
            </div>
          </>
        ) : (
          /* --- PROBLEM INPUT STEP --- */
          <div className="animate-in slide-in-from-right duration-300">
             <h3 className="font-bold text-gray-900 mb-3">What's the problem?</h3>
             <textarea 
               autoFocus
               value={problem}
               onChange={(e) => setProblem(e.target.value)}
               placeholder="Ex: High fever since last night, headache..."
               className="w-full h-32 p-4 rounded-xl border-2 border-brand-green-100 focus:border-brand-green-500 outline-none resize-none bg-gray-50 focus:bg-white transition-all"
             ></textarea>
             
             <div className="mt-4 bg-yellow-50 p-4 rounded-xl flex gap-3 text-sm text-yellow-800">
               <Info className="flex-shrink-0 mt-0.5" size={16} />
               <p>Consultation fees are settled directly at the clinic. No online payment required.</p>
             </div>
          </div>
        )}
      </div>

      {/* Footer Action */}
      <div className="fixed bottom-0 w-full bg-white border-t border-gray-100 p-4 safe-area-pb">
        <div className="max-w-2xl mx-auto">
          {step === 'slot-selection' ? (
            <button 
              onClick={proceedToBook}
              disabled={!selectedSlot}
              className="w-full bg-brand-green-500 disabled:bg-gray-200 disabled:text-gray-400 text-white py-4 rounded-xl font-bold text-lg shadow-lg shadow-brand-green-200 transition-all"
            >
              Continue to Book
            </button>
          ) : (
             <button 
              onClick={confirmBooking}
              disabled={!problem || processing}
              className="w-full bg-brand-purple-900 disabled:bg-gray-300 text-white py-4 rounded-xl font-bold text-lg shadow-lg shadow-brand-purple-200 transition-all flex items-center justify-center gap-2"
            >
              {processing ? <Loader2 className="animate-spin"/> : <>Confirm Booking <CheckCircle size={20}/></>}
            </button>
          )}
        </div>
      </div>
    </div>
  )
}

export default function BookingPage() {
  return <Suspense><BookingContent /></Suspense>
}