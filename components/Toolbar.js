'use client'

import { useState } from 'react'
import { Calculator, FileText, X } from 'lucide-react'

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
      {showReference && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-auto">
            <div className="flex justify-between items-center p-4 border-b">
              <h3 className="text-lg font-semibold">SAT Math Reference</h3>
              <button
                onClick={() => setShowReference(false)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6">
              <div className="space-y-6">
                <div>
                  <h4 className="font-semibold mb-3 text-gray-900">Area and Volume Formulas</h4>
                  <div className="space-y-2 text-sm">
                    <p><strong>Rectangle:</strong> A = lw</p>
                    <p><strong>Triangle:</strong> A = ½bh</p>
                    <p><strong>Circle:</strong> A = πr²</p>
                    <p><strong>Rectangular solid:</strong> V = lwh</p>
                    <p><strong>Cylinder:</strong> V = πr²h</p>
                    <p><strong>Sphere:</strong> V = (4/3)πr³</p>
                    <p><strong>Cone:</strong> V = (1/3)πr²h</p>
                    <p><strong>Pyramid:</strong> V = (1/3)Bh</p>
                  </div>
                </div>
                
                <div>
                  <h4 className="font-semibold mb-3 text-gray-900">Coordinate Geometry</h4>
                  <div className="space-y-2 text-sm">
                    <p><strong>Distance between points:</strong> d = √[(x₂-x₁)² + (y₂-y₁)²]</p>
                    <p><strong>Midpoint:</strong> ((x₁+x₂)/2, (y₁+y₂)/2)</p>
                  </div>
                </div>
                
                <div>
                  <h4 className="font-semibold mb-3 text-gray-900">Pythagorean Theorem</h4>
                  <div className="space-y-2 text-sm">
                    <p><strong>General:</strong> a² + b² = c²</p>
                    <p><strong>Special Right Triangles:</strong></p>
                    <p>• 30-60-90: sides in ratio 1 : √3 : 2</p>
                    <p>• 45-45-90: sides in ratio 1 : 1 : √2</p>
                  </div>
                </div>
                
                <div>
                  <h4 className="font-semibold mb-3 text-gray-900">Laws of Sines and Cosines</h4>
                  <div className="space-y-2 text-sm">
                    <p><strong>Law of Sines:</strong> sin A/a = sin B/b = sin C/c</p>
                    <p><strong>Law of Cosines:</strong> c² = a² + b² - 2ab cos C</p>
                  </div>
                </div>
                
                <div>
                  <h4 className="font-semibold mb-3 text-gray-900">Quadratic Formula</h4>
                  <div className="text-sm">
                    <p><strong>For ax² + bx + c = 0:</strong></p>
                    <p>x = (-b ± √(b² - 4ac)) / 2a</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  )
}