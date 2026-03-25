import { auth } from '@clerk/nextjs/server'
import { SignInButton, UserButton } from '@clerk/nextjs'
import Link from 'next/link'

export default async function Home() {
  const { userId } = await auth();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-8 bg-gray-50 text-gray-900">
      <h1 className="text-4xl font-extrabold tracking-tight mb-4">Welcome</h1>
      <p className="mb-8 text-lg text-gray-600">A simple app integrating Next.js App Router, Clerk, and Neon DB.</p>

      {!userId ? (
        <SignInButton>
          <button className="bg-blue-600 text-white font-semibold py-3 px-6 rounded-lg shadow-md hover:bg-blue-700 transition">
            Sign In with Clerk
          </button>
        </SignInButton>
      ) : (
        <div className="flex flex-col items-center gap-4">
          <UserButton />
          <Link href="/dashboard" className="text-blue-600 font-semibold hover:underline border-b border-blue-600 border-transparent hover:border-blue-600">
            Go to Dashboard &rarr;
          </Link>
        </div>
      )}
    </div>
  )
}
