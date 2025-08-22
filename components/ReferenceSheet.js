'use client'

import { useState } from 'react'
import { X } from 'lucide-react'
import { InlineMath, BlockMath } from 'react-katex'

export default function ReferenceSheet({ isOpen, onClose }) {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-2xl font-bold text-gray-900">SAT Math Reference Sheet</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-8">
          {/* Area and Volume Formulas */}
          <section>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Area and Volume Formulas</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Rectangle */}
              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="font-medium text-gray-800 mb-2">Rectangle</h4>
                <div className="space-y-1">
                  <div>Area: <InlineMath math="A = lw" /></div>
                  <div className="text-sm text-gray-600">where <InlineMath math="l" /> = length, <InlineMath math="w" /> = width</div>
                </div>
              </div>

              {/* Triangle */}
              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="font-medium text-gray-800 mb-2">Triangle</h4>
                <div className="space-y-1">
                  <div>Area: <InlineMath math="A = \frac{1}{2}bh" /></div>
                  <div className="text-sm text-gray-600">where <InlineMath math="b" /> = base, <InlineMath math="h" /> = height</div>
                </div>
              </div>

              {/* Circle */}
              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="font-medium text-gray-800 mb-2">Circle</h4>
                <div className="space-y-1">
                  <div>Area: <InlineMath math="A = \pi r^2" /></div>
                  <div>Circumference: <InlineMath math="C = 2\pi r" /></div>
                  <div className="text-sm text-gray-600">where <InlineMath math="r" /> = radius</div>
                </div>
              </div>

              {/* Rectangular Prism */}
              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="font-medium text-gray-800 mb-2">Rectangular Prism</h4>
                <div className="space-y-1">
                  <div>Volume: <InlineMath math="V = lwh" /></div>
                  <div className="text-sm text-gray-600">where <InlineMath math="l" /> = length, <InlineMath math="w" /> = width, <InlineMath math="h" /> = height</div>
                </div>
              </div>

              {/* Cylinder */}
              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="font-medium text-gray-800 mb-2">Cylinder</h4>
                <div className="space-y-1">
                  <div>Volume: <InlineMath math="V = \pi r^2 h" /></div>
                  <div className="text-sm text-gray-600">where <InlineMath math="r" /> = radius, <InlineMath math="h" /> = height</div>
                </div>
              </div>

              {/* Sphere */}
              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="font-medium text-gray-800 mb-2">Sphere</h4>
                <div className="space-y-1">
                  <div>Volume: <InlineMath math="V = \frac{4}{3}\pi r^3" /></div>
                  <div className="text-sm text-gray-600">where <InlineMath math="r" /> = radius</div>
                </div>
              </div>

              {/* Cone */}
              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="font-medium text-gray-800 mb-2">Cone</h4>
                <div className="space-y-1">
                  <div>Volume: <InlineMath math="V = \frac{1}{3}\pi r^2 h" /></div>
                  <div className="text-sm text-gray-600">where <InlineMath math="r" /> = radius, <InlineMath math="h" /> = height</div>
                </div>
              </div>

              {/* Pyramid */}
              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="font-medium text-gray-800 mb-2">Pyramid</h4>
                <div className="space-y-1">
                  <div>Volume: <InlineMath math="V = \frac{1}{3}Bh" /></div>
                  <div className="text-sm text-gray-600">where <InlineMath math="B" /> = area of base, <InlineMath math="h" /> = height</div>
                </div>
              </div>
            </div>
          </section>

          {/* Special Right Triangles */}
          <section>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Special Right Triangles</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* 30-60-90 Triangle */}
              <div className="bg-blue-50 p-4 rounded-lg">
                <h4 className="font-medium text-gray-800 mb-2">30°-60°-90° Triangle</h4>
                <div className="space-y-2">
                  <div>If the side opposite 30° = <InlineMath math="x" /></div>
                  <div>Then side opposite 60° = <InlineMath math="x\sqrt{3}" /></div>
                  <div>And hypotenuse = <InlineMath math="2x" /></div>
                  <div className="text-sm text-gray-600 mt-2">
                    Ratio: <InlineMath math="1 : \sqrt{3} : 2" />
                  </div>
                </div>
              </div>

              {/* 45-45-90 Triangle */}
              <div className="bg-blue-50 p-4 rounded-lg">
                <h4 className="font-medium text-gray-800 mb-2">45°-45°-90° Triangle</h4>
                <div className="space-y-2">
                  <div>If each leg = <InlineMath math="x" /></div>
                  <div>Then hypotenuse = <InlineMath math="x\sqrt{2}" /></div>
                  <div className="text-sm text-gray-600 mt-2">
                    Ratio: <InlineMath math="1 : 1 : \sqrt{2}" />
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Pythagorean Theorem */}
          <section>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Pythagorean Theorem</h3>
            <div className="bg-green-50 p-4 rounded-lg">
              <div className="text-center">
                <BlockMath math="a^2 + b^2 = c^2" />
                <div className="text-sm text-gray-600 mt-2">
                  where <InlineMath math="a" /> and <InlineMath math="b" /> are the legs of a right triangle, and <InlineMath math="c" /> is the hypotenuse
                </div>
              </div>
            </div>
          </section>

          {/* Quadratic Formula */}
          <section>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Quadratic Formula</h3>
            <div className="bg-purple-50 p-4 rounded-lg">
              <div className="text-center">
                <div className="mb-2">For equation <InlineMath math="ax^2 + bx + c = 0" />:</div>
                <BlockMath math="x = \frac{-b \pm \sqrt{b^2 - 4ac}}{2a}" />
              </div>
            </div>
          </section>

          {/* Laws of Exponents */}
          <section>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Laws of Exponents</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-yellow-50 p-3 rounded">
                <InlineMath math="x^a \cdot x^b = x^{a+b}" />
              </div>
              <div className="bg-yellow-50 p-3 rounded">
                <InlineMath math="\frac{x^a}{x^b} = x^{a-b}" />
              </div>
              <div className="bg-yellow-50 p-3 rounded">
                <InlineMath math="(x^a)^b = x^{ab}" />
              </div>
              <div className="bg-yellow-50 p-3 rounded">
                <InlineMath math="x^0 = 1" /> (where <InlineMath math="x \neq 0" />)
              </div>
              <div className="bg-yellow-50 p-3 rounded">
                <InlineMath math="x^{-a} = \frac{1}{x^a}" />
              </div>
              <div className="bg-yellow-50 p-3 rounded">
                <InlineMath math="x^{\frac{1}{n}} = \sqrt[n]{x}" />
              </div>
            </div>
          </section>

          {/* Distance and Midpoint Formulas */}
          <section>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Distance and Midpoint Formulas</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-red-50 p-4 rounded-lg">
                <h4 className="font-medium text-gray-800 mb-2">Distance Formula</h4>
                <div className="text-center">
                  <BlockMath math="d = \sqrt{(x_2 - x_1)^2 + (y_2 - y_1)^2}" />
                </div>
              </div>
              <div className="bg-red-50 p-4 rounded-lg">
                <h4 className="font-medium text-gray-800 mb-2">Midpoint Formula</h4>
                <div className="text-center">
                  <BlockMath math="M = \left(\frac{x_1 + x_2}{2}, \frac{y_1 + y_2}{2}\right)" />
                </div>
              </div>
            </div>
          </section>

          {/* Other Important Formulas */}
          <section>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Other Important Formulas</h3>
            <div className="space-y-4">
              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="font-medium text-gray-800 mb-2">Slope</h4>
                <InlineMath math="m = \frac{y_2 - y_1}{x_2 - x_1}" />
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="font-medium text-gray-800 mb-2">Point-Slope Form</h4>
                <InlineMath math="y - y_1 = m(x - x_1)" />
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="font-medium text-gray-800 mb-2">Slope-Intercept Form</h4>
                <InlineMath math="y = mx + b" />
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="font-medium text-gray-800 mb-2">Standard Form of a Circle</h4>
                <InlineMath math="(x - h)^2 + (y - k)^2 = r^2" />
                <div className="text-sm text-gray-600 mt-1">
                  where <InlineMath math="(h, k)" /> is the center and <InlineMath math="r" /> is the radius
                </div>
              </div>
            </div>
          </section>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 rounded-b-lg">
          <p className="text-sm text-gray-600 text-center">
            This reference sheet is available during the SAT Math sections
          </p>
        </div>
      </div>
    </div>
  )
}