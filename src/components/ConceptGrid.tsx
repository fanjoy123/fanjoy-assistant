interface Concept {
  title: string
  description: string
  image: string
  style: string
}

interface ConceptGridProps {
  concepts: Concept[]
}

export function ConceptGrid({ concepts }: ConceptGridProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mt-10">
      {concepts.map((concept, idx) => (
        <div 
          key={idx} 
          className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden"
        >
          <div className="bg-gray-100 h-48 rounded-t-xl" />
          <div className="p-4 space-y-3">
            <div>
              <h3 className="text-lg font-bold text-gray-900">{concept.title}</h3>
              <p className="text-sm text-gray-500">{concept.style}</p>
            </div>
            <p className="text-sm text-gray-600">{concept.description}</p>
            <button className="text-sm text-blue-500 hover:underline">
              Refine
            </button>
          </div>
        </div>
      ))}
    </div>
  )
} 