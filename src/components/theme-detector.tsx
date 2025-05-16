'use client'

import { useEffect } from 'react'

export function ThemeDetector() {
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
    
    const handleChange = (e: MediaQueryListEvent) => {
      document.documentElement.classList.toggle('dark', e.matches)
    }

    // Set initial value
    document.documentElement.classList.toggle('dark', mediaQuery.matches)
    
    // Listen for changes
    mediaQuery.addEventListener('change', handleChange)
    return () => mediaQuery.removeEventListener('change', handleChange)
  }, [])

  return null
}