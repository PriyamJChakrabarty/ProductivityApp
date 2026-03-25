import { auth } from '@clerk/nextjs/server'
import { redirect } from 'next/navigation'
import { SignInButton } from '@clerk/nextjs'

export default async function Home() {
  const { userId } = await auth();

  // If user is already signed in, go straight to the monster battle page
  if (userId) {
    redirect('/dashboard');
  }

  return (
    <div className="min-h-screen bg-[#0f1711] flex flex-col items-center justify-center p-8 text-white overflow-hidden relative">
      {/* Background Decorative Elements */}
      <div className="absolute inset-0 opacity-10 pointer-events-none" 
           style={{ backgroundImage: 'radial-gradient(#4ade80 1px, transparent 1px)', backgroundSize: '40px 40px' }} />
      
      <div className="z-10 text-center max-w-2xl px-4">
        <h1 className="text-6xl md:text-8xl font-black text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 via-red-500 to-red-600 drop-shadow-[0_10px_10px_rgba(0,0,0,0.5)] uppercase tracking-tighter mb-6 italic">
          Monster Slayer
        </h1>
        
        <p className="text-xl md:text-2xl text-yellow-500/80 font-bold mb-12 uppercase tracking-[0.3em] drop-shadow-md">
          Turn your tasks into trophies
        </p>

        <SignInButton mode="modal">
          <button className="group relative bg-[#8b0000] hover:bg-[#a52a2a] text-white font-black py-6 px-12 rounded-2xl text-2xl uppercase tracking-widest transition-all shadow-[0_20px_40px_rgba(139,0,0,0.4)] hover:shadow-[0_25px_50px_rgba(139,0,0,0.6)] active:scale-95 border-b-8 border-[#4d0000] hover:border-b-4">
             Enter the Battleground
             <span className="ml-4 transition-transform group-hover:translate-x-2 inline-block">⚔️</span>
          </button>
        </SignInButton>

        <p className="mt-12 text-[#f4e4bc]/30 font-bold text-xs uppercase tracking-[0.5em]">
          Powered by Gemini & Neon
        </p>
      </div>

      {/* Hero Preview (Small visual flair) */}
      <div className="absolute -bottom-20 -left-20 opacity-20 grayscale pointer-events-none w-[500px] h-[500px]">
        <img src="/hero.png" alt="" className="w-full h-full object-contain" />
      </div>
      <div className="absolute -top-20 -right-20 opacity-20 grayscale pointer-events-none w-[500px] h-[500px]">
        <img src="/monster.png" alt="" className="w-full h-full object-contain rotate-12" />
      </div>
    </div>
  )
}
