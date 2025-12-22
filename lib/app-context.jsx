"use client"
import { createContext, useContext, useState, useEffect } from 'react'

const AppContext = createContext(null)

export function AppProvider({ children }) {
    const [siteSettings, setSiteSettings] = useState(null)
    const [menu, setMenu] = useState(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        // Load shared data once on mount
        async function loadSharedData() {
            try {
                // Load both APIs in parallel
                const [settingsResponse, menuResponse] = await Promise.all([
                    fetch('/api/site-settings'),
                    fetch('/api/menu')
                ])

                if (settingsResponse.ok) {
                    const settings = await settingsResponse.json()
                    setSiteSettings(settings)
                }

                if (menuResponse.ok) {
                    const menuData = await menuResponse.json()
                    setMenu(menuData)
                }
            } catch (error) {
                console.error('Error loading shared data:', error)
            } finally {
                setLoading(false)
            }
        }

        loadSharedData()
    }, [])

    return (
        <AppContext.Provider value={{ siteSettings, menu, loading }}>
            {children}
        </AppContext.Provider>
    )
}

export function useAppContext() {
    const context = useContext(AppContext)
    if (!context) {
        throw new Error('useAppContext must be used within AppProvider')
    }
    return context
}

