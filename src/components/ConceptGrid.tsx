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
          className="bg-white p-6 rounded-xl shadow hover:shadow-md transition-shadow"
        >
          <div className="bg-gray-100 h-48 rounded mb-4" />
          <h3 className="text-lg font-semibold text-gray-900">{concept.title}</h3>
          <p className="text-sm text-gray-600 mt-1 line-clamp-2">{concept.description}</p>
          <div className="mt-3 flex items-center justify-between">
            <button className="text-blue-500 text-sm hover:underline">
              Refine
            </button>
            <span className="text-xs text-gray-500">{concept.style}</span>
          </div>
        </div>
      ))}
    </div>
  )
} 