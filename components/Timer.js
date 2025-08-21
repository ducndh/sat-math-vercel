'use client'

import { useState, useEffect } from 'react'
import { Clock, Eye, EyeOff } from 'lucide-react'

export default function Timer({ 
  initialMinutes = 70, 
  onTimeUp, 
  isActive = true 
}) {
  const [timeLeft, setTimeLeft] = useState(initialMinutes * 60) // Convert to seconds
  const [isVisible, setIsVisible] = useState(true)

  useEffect(() => {
    if (!isActive) return

    const interval = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(interval)
          onTimeUp?.()
          return 0
        }
        return prev - 1
      })
    }, 1000)

    return () => clearInterval(interval)
  }, [isActive, onTimeUp])

  // Auto-show timer in final 5 minutes
  useEffect(() => {
    if (timeLeft <= 300) { // 5 minutes = 300 seconds
      setIsVisible(true)
    }
  }, [timeLeft])

  const formatTime = (seconds) => {
    const hours = Math.floor(seconds / 3600)
    const minutes = Math.floor((seconds % 3600) / 60)
    const secs = seconds % 60

    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
    }
    return `${minutes}:${secs.toString().padStart(2, '0')}`
  }

  const getTimerClass = () => {
    if (timeLeft <= 300) return 'timer critical' // Last 5 minutes
    if (timeLeft <= 900) return 'timer warning' // Last 15 minutes
    return 'timer'
  }

  if (!isVisible) {
    return (
      <button
        onClick={() => setIsVisible(true)}
        className="flex items-center gap-2 px-3 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
        title="Show timer"
      >
        <Eye className="w-4 h-4" />
        <Clock className="w-4 h-4" />
      </button>
    )
  }

  return (
    <div className="flex items-center gap-2">
      <div className={getTimerClass()}>
        <Clock className="w-5 h-5 mr-2 inline" />
        {formatTime(timeLeft)}
      </div>
      
      {timeLeft > 300 && (
        <button
          onClick={() => setIsVisible(false)}
          className="p-1 text-gray-500 hover:text-gray-700 transition-colors"
          title="Hide timer"
        >
          <EyeOff className="w-4 h-4" />
        </button>
      )}
    </div>
  )
}