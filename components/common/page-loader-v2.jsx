"use client"
import { useEffect, useState, useRef } from 'react'
import { usePathname } from 'next/navigation'
import { useLoading } from '@/lib/loading-context'

const PageLoaderV2 = () => {
  const { pendingRequests } = useLoading()
  const pathname = usePathname()
  const [showLoader, setShowLoader] = useState(false)
  const prevPathname = useRef(pathname)
  const hideTimerRef = useRef(null)
  const minShowTimeRef = useRef(null)

  // Track route changes only
  useEffect(() => {
    if (prevPathname.current !== pathname) {
      // Clear any pending hide timer
      if (hideTimerRef.current) {
        clearTimeout(hideTimerRef.current)
        hideTimerRef.current = null
      }

      // Show loader on route change
      setShowLoader(true)
      
      // Set minimum show time (prevent flickering)
      if (minShowTimeRef.current) {
        clearTimeout(minShowTimeRef.current)
      }
      minShowTimeRef.current = setTimeout(() => {
        minShowTimeRef.current = null
      }, 300)

      prevPathname.current = pathname
    }
  }, [pathname])

  // Hide loader when no pending requests and minimum time has passed
  useEffect(() => {
    if (showLoader && pendingRequests === 0) {
      // Clear any existing timer
      if (hideTimerRef.current) {
        clearTimeout(hideTimerRef.current)
      }

      // Wait for minimum show time, then hide
      hideTimerRef.current = setTimeout(() => {
        setShowLoader(false)
        hideTimerRef.current = null
      }, 400)
    }

    return () => {
      if (hideTimerRef.current) {
        clearTimeout(hideTimerRef.current)
      }
    }
  }, [pendingRequests, showLoader])

  if (!showLoader) {
    return null
  }

  return (
    <div 
      className="page-loader-overlay"
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        backgroundColor: 'rgba(255, 255, 255, 0.96)',
        backdropFilter: 'blur(6px)',
        WebkitBackdropFilter: 'blur(6px)',
        zIndex: 99999,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        transition: 'opacity 0.4s cubic-bezier(0.4, 0, 0.2, 1), visibility 0.4s',
        opacity: showLoader ? 1 : 0,
        visibility: showLoader ? 'visible' : 'hidden',
        pointerEvents: showLoader ? 'auto' : 'none',
      }}
    >
      <div className="page-loader-content" style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '24px',
        transform: showLoader ? 'scale(1)' : 'scale(0.9)',
        transition: 'transform 0.3s ease'
      }}>
        {/* Modern Multi-Ring Spinner */}
        <div className="spinner-container" style={{
          position: 'relative',
          width: '70px',
          height: '70px'
        }}>
          {/* Outer Ring */}
          <div className="spinner-ring-outer" style={{
            position: 'absolute',
            width: '70px',
            height: '70px',
            border: '5px solid rgba(34, 119, 187, 0.1)',
            borderTop: '5px solid var(--primary-color-1, #2277BB)',
            borderRight: '5px solid var(--primary-color-1, #2277BB)',
            borderRadius: '50%',
            animation: 'spin 1.2s cubic-bezier(0.5, 0, 0.5, 1) infinite'
          }} />
          
          {/* Middle Ring */}
          <div className="spinner-ring-middle" style={{
            position: 'absolute',
            top: '10px',
            left: '10px',
            width: '50px',
            height: '50px',
            border: '4px solid rgba(34, 119, 187, 0.15)',
            borderTop: '4px solid var(--primary-color-1, #2277BB)',
            borderRadius: '50%',
            animation: 'spin 0.9s cubic-bezier(0.5, 0, 0.5, 1) infinite reverse'
          }} />
          
          {/* Inner Ring */}
          <div className="spinner-ring-inner" style={{
            position: 'absolute',
            top: '20px',
            left: '20px',
            width: '30px',
            height: '30px',
            border: '3px solid rgba(34, 119, 187, 0.2)',
            borderTop: '3px solid var(--primary-color-1, #2277BB)',
            borderRadius: '50%',
            animation: 'spin 0.6s linear infinite'
          }} />
          
          {/* Center Dot */}
          <div style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: '8px',
            height: '8px',
            backgroundColor: 'var(--primary-color-1, #2277BB)',
            borderRadius: '50%',
            animation: 'pulse 1.5s ease-in-out infinite'
          }} />
        </div>
        
        {/* Loading Text with Animation */}
        <div style={{
          fontSize: '15px',
          color: 'var(--text-heading-color, #1a1a1a)',
          fontWeight: '600',
          letterSpacing: '0.8px',
          textTransform: 'uppercase',
          display: 'flex',
          alignItems: 'center',
          gap: '8px'
        }}>
          <span style={{
            animation: 'dots 1.5s steps(4, end) infinite'
          }}>Yükleniyor</span>
          <span style={{
            animation: 'dots 1.5s steps(4, end) infinite 0.2s'
          }}>.</span>
          <span style={{
            animation: 'dots 1.5s steps(4, end) infinite 0.4s'
          }}>.</span>
          <span style={{
            animation: 'dots 1.5s steps(4, end) infinite 0.6s'
          }}>.</span>
        </div>
      </div>

      <style jsx>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        
        @keyframes pulse {
          0%, 100% {
            opacity: 1;
            transform: translate(-50%, -50%) scale(1);
          }
          50% {
            opacity: 0.5;
            transform: translate(-50%, -50%) scale(0.8);
          }
        }
        
        @keyframes dots {
          0%, 20% {
            opacity: 0;
          }
          50% {
            opacity: 1;
          }
          100% {
            opacity: 0;
          }
        }
        
        .page-loader-overlay {
          animation: fadeIn 0.4s cubic-bezier(0.4, 0, 0.2, 1);
        }
        
        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }
      `}</style>
    </div>
  )
}

export default PageLoaderV2

