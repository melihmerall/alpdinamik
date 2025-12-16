"use client"
import { createContext, useContext, useState, useEffect } from 'react'

const LoadingContext = createContext({
  isLoading: false,
  setLoading: () => {},
  pendingRequests: 0,
  incrementRequests: () => {},
  decrementRequests: () => {},
})

export const useLoading = () => {
  const context = useContext(LoadingContext)
  if (!context) {
    throw new Error('useLoading must be used within LoadingProvider')
  }
  return context
}

export const LoadingProvider = ({ children }) => {
  const [isLoading, setIsLoading] = useState(false)
  const [pendingRequests, setPendingRequests] = useState(0)

  const setLoading = (loading) => {
    setIsLoading(loading)
  }

  const incrementRequests = () => {
    setPendingRequests(prev => prev + 1)
  }

  const decrementRequests = () => {
    setPendingRequests(prev => Math.max(0, prev - 1))
  }

  // Track fetch requests globally
  useEffect(() => {
    const originalFetch = window.fetch

    window.fetch = async (...args) => {
      // Only track API requests, not static assets
      const url = typeof args[0] === 'string' ? args[0] : args[0]?.url || ''
      const isApiRequest = url.includes('/api/') || url.startsWith('/api')
      
      if (isApiRequest) {
        incrementRequests()
        try {
          const response = await originalFetch(...args)
          return response
        } finally {
          decrementRequests()
        }
      } else {
        return originalFetch(...args)
      }
    }

    return () => {
      window.fetch = originalFetch
    }
  }, [])

  // Don't auto-hide - let PageLoader component handle it
  // This prevents conflicts

  return (
    <LoadingContext.Provider
      value={{
        isLoading: isLoading || pendingRequests > 0,
        setLoading,
        pendingRequests,
        incrementRequests,
        decrementRequests,
      }}
    >
      {children}
    </LoadingContext.Provider>
  )
}

