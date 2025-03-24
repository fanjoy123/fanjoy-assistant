import { ChatInterface } from '@/components/chat/ChatInterface'

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-gray-50 to-white">
      <main className="max-w-2xl mx-auto px-4 text-center space-y-8 py-16">
        <div className="space-y-4">
          <h1 className="text-4xl font-bold text-gray-900">Let's Bring Your Merch to Life</h1>
          <p className="text-base text-gray-600">Your personal design assistant is here to help</p>
        </div>
        
        <div className="space-y-8">
          <div className="space-y-2">
            <p className="text-base text-gray-600">Pick a vibe ✨</p>
            <select 
              className="rounded-lg border px-4 py-2 shadow-sm text-sm bg-white hover:border-gray-300 focus:border-black focus:ring-2 focus:ring-black/5 transition-colors"
              defaultValue=""
            >
              <option value="" disabled>Choose Style</option>
              <option value="minimal">Minimal</option>
              <option value="bold">Bold & Vibrant</option>
              <option value="vintage">Vintage</option>
              <option value="modern">Modern</option>
            </select>
          </div>
          
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
            <ChatInterface />
          </div>
        </div>
      </main>
    </div>
  )
} 