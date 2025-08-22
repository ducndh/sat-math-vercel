'use client'

import { useState } from 'react'
import { Calculator, FileText, X } from 'lucide-react'
import ReferenceSheet from './ReferenceSheet'

export default function Toolbar() {
  const [showCalculator, setShowCalculator] = useState(false)
  const [showReference, setShowReference] = useState(false)

  return (
    <>
      <div className="flex gap-4">
        <button
          onClick={() => setShowCalculator(true)}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Calculator className="w-4 h-4" />
          Calculator
        </button>
        
        <button
          onClick={() => setShowReference(true)}
          className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
        >
          <FileText className="w-4 h-4" />
          Reference
        </button>
      </div>

      {/* Calculator Modal */}
      {showCalculator && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full mx-4 max-h-[90vh] overflow-hidden">
            <div className="flex justify-between items-center p-4 border-b">
              <h3 className="text-lg font-semibold">Desmos Graphing Calculator</h3>
              <button
                onClick={() => setShowCalculator(false)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="h-[600px]">
              <iframe
                src="https://www.desmos.com/calculator"
                className="w-full h-full border-0"
                title="Desmos Graphing Calculator"
              />
            </div>
          </div>
        </div>
      )}

      {/* Reference Sheet Modal */}
      <ReferenceSheet isOpen={showReference} onClose={() => setShowReference(false)} />
    </>
  )
}