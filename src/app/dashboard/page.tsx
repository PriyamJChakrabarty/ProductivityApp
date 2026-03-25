import { submitFormAction } from "./actions";
import { UserButton } from "@clerk/nextjs";
import { sql } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

export default async function Dashboard() {
  const { userId } = await auth();
  if (!userId) redirect("/sign-in");

  // Fetch all records for the current user
  let records: any[] = [];
  try {
    records = await sql`
      SELECT id, name, number, created_at 
      FROM contacts 
      WHERE user_id = ${userId}
      ORDER BY created_at DESC
    `;
  } catch (error) {
    // If table doesn't exist yet, it will throw an error. We can catch it and return an empty array.
  }

  return (
    <div className="min-h-screen p-8 max-w-4xl mx-auto flex flex-col gap-8">
      <header className="w-full flex justify-between items-center pb-6 border-b border-gray-200">
        <h1 className="text-3xl font-extrabold tracking-tight text-gray-900">Dashboard</h1>
        <UserButton />
      </header>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-start">
        {/* Form Section */}
        <main className="md:col-span-1 bg-white shadow-lg rounded-xl p-6 border border-gray-100 h-fit sticky top-8">
          <h2 className="text-xl font-bold mb-4 text-gray-800">Add Contact</h2>
          <form action={submitFormAction} className="flex flex-col gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Name</label>
              <input 
                name="name"
                type="text" 
                required 
                className="w-full border border-gray-300 rounded-lg px-4 py-2 text-black focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                placeholder="Alice"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Number</label>
              <input 
                name="number"
                type="text" 
                required 
                className="w-full border border-gray-300 rounded-lg px-4 py-2 text-black focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                placeholder="123-456-7890"
              />
            </div>
            <button 
              type="submit" 
              className="mt-2 bg-blue-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-blue-700 transition shadow-md touch-manipulation"
            >
              Save Details
            </button>
          </form>
        </main>

        {/* Display Section */}
        <section className="md:col-span-2 flex flex-col gap-6">
          <h2 className="text-2xl font-bold text-gray-800">Your Contacts</h2>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {records.length === 0 ? (
              <p className="text-gray-500 italic col-span-full bg-white p-6 rounded-xl border border-dashed border-gray-300 text-center">
                No contacts added yet. Use the form to add one!
              </p>
            ) : (
              records.map((record) => (
                <div key={record.id} className="bg-white p-5 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition">
                  <h3 className="text-lg font-bold text-gray-900 mb-1">{record.name}</h3>
                  <div className="inline-flex items-center gap-2 text-gray-600 font-medium bg-gray-50 px-3 py-1 rounded-full text-sm">
                    <svg className="w-4 h-4 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" /></svg>
                    {record.number}
                  </div>
                </div>
              ))
            )}
          </div>
        </section>
      </div>
    </div>
  );
}
