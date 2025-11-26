/**
 * Loading Skeletons para melhor UX durante carregamento
 */

export function PageLoadingSkeleton() {
  return (
    <div className="min-h-screen bg-gray-50 p-6 animate-pulse">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="h-12 bg-gray-200 rounded-lg w-1/3"></div>
        
        {/* Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-white rounded-lg p-6 space-y-3">
              <div className="h-4 bg-gray-200 rounded w-2/3"></div>
              <div className="h-8 bg-gray-200 rounded w-1/2"></div>
            </div>
          ))}
        </div>
        
        {/* Table */}
        <div className="bg-white rounded-lg p-6 space-y-4">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="h-12 bg-gray-200 rounded"></div>
          ))}
        </div>
      </div>
    </div>
  )
}

export function ChatLoadingSkeleton() {
  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <div className="w-80 bg-white border-r border-gray-200 p-4 space-y-3 animate-pulse">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <div key={i} className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-gray-200 rounded-full"></div>
            <div className="flex-1 space-y-2">
              <div className="h-4 bg-gray-200 rounded w-3/4"></div>
              <div className="h-3 bg-gray-200 rounded w-1/2"></div>
            </div>
          </div>
        ))}
      </div>
      
      {/* Main Chat */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <div className="h-16 bg-white border-b border-gray-200 px-6 flex items-center animate-pulse">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gray-200 rounded-full"></div>
            <div className="space-y-2">
              <div className="h-4 bg-gray-200 rounded w-32"></div>
              <div className="h-3 bg-gray-200 rounded w-24"></div>
            </div>
          </div>
        </div>
        
        {/* Messages */}
        <div className="flex-1 p-6 space-y-4 overflow-hidden animate-pulse">
          {[1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className={`flex ${i % 2 === 0 ? 'justify-end' : 'justify-start'}`}
            >
              <div className={`max-w-md p-3 rounded-lg ${
                i % 2 === 0 ? 'bg-blue-100' : 'bg-gray-200'
              }`}>
                <div className="h-4 bg-gray-300 rounded w-48"></div>
              </div>
            </div>
          ))}
        </div>
        
        {/* Input */}
        <div className="h-20 bg-white border-t border-gray-200 px-6 flex items-center animate-pulse">
          <div className="flex-1 h-12 bg-gray-200 rounded-lg"></div>
        </div>
      </div>
    </div>
  )
}

export function TableLoadingSkeleton() {
  return (
    <div className="bg-white rounded-lg shadow animate-pulse">
      <div className="p-6 border-b border-gray-200">
        <div className="h-6 bg-gray-200 rounded w-1/4"></div>
      </div>
      <div className="p-6 space-y-4">
        {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
          <div key={i} className="grid grid-cols-5 gap-4">
            <div className="h-4 bg-gray-200 rounded"></div>
            <div className="h-4 bg-gray-200 rounded"></div>
            <div className="h-4 bg-gray-200 rounded"></div>
            <div className="h-4 bg-gray-200 rounded"></div>
            <div className="h-4 bg-gray-200 rounded"></div>
          </div>
        ))}
      </div>
    </div>
  )
}

export function DashboardLoadingSkeleton() {
  return (
    <div className="p-6 space-y-6 animate-pulse">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="bg-white rounded-lg p-6 space-y-3">
            <div className="h-4 bg-gray-200 rounded w-2/3"></div>
            <div className="h-8 bg-gray-200 rounded w-1/2"></div>
            <div className="h-3 bg-gray-200 rounded w-full"></div>
          </div>
        ))}
      </div>
      
      {/* Charts */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {[1, 2].map((i) => (
          <div key={i} className="bg-white rounded-lg p-6 space-y-4">
            <div className="h-6 bg-gray-200 rounded w-1/3"></div>
            <div className="h-64 bg-gray-200 rounded"></div>
          </div>
        ))}
      </div>
    </div>
  )
}

export function FormLoadingSkeleton() {
  return (
    <div className="bg-white rounded-lg p-6 space-y-6 animate-pulse">
      <div className="h-8 bg-gray-200 rounded w-1/4"></div>
      
      {[1, 2, 3, 4].map((i) => (
        <div key={i} className="space-y-2">
          <div className="h-4 bg-gray-200 rounded w-1/6"></div>
          <div className="h-12 bg-gray-200 rounded"></div>
        </div>
      ))}
      
      <div className="flex justify-end space-x-3">
        <div className="h-10 bg-gray-200 rounded w-24"></div>
        <div className="h-10 bg-gray-200 rounded w-24"></div>
      </div>
    </div>
  )
}

// Skeleton genérico
export function GenericSkeleton({ lines = 3 }: { lines?: number }) {
  return (
    <div className="space-y-3 animate-pulse">
      {Array.from({ length: lines }).map((_, i) => (
        <div key={i} className="h-4 bg-gray-200 rounded"></div>
      ))}
    </div>
  )
}
