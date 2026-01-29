import { createContext, useContext, useState, useEffect } from 'react'

const ThemeContext = createContext(null)

export const ThemeProvider = ({ children }) => {
  // Récupérer le thème sauvegardé ou utiliser 'light' par défaut
  const [theme, setTheme] = useState(() => {
    const savedTheme = localStorage.getItem('theme')
    return savedTheme || 'light'
  })

  // Appliquer le thème au chargement et à chaque changement
useEffect(() => {
  const root = window.document.documentElement
  
  root.classList.remove('light', 'dark')
  root.classList.add(theme)
  
  // Ajouter des couleurs custom plus naturelles
  if (theme === 'dark') {
    root.style.setProperty('--color-bg-primary', '3 7 18') // gray-950
    root.style.setProperty('--color-bg-secondary', '17 24 39') // gray-900
    root.style.setProperty('--color-bg-tertiary', '31 41 55') // gray-800
    root.style.setProperty('--color-accent', '96 165 250') // blue-400 moins saturé
    root.style.setProperty('--color-accent-subtle', '59 130 246') // blue-500
  } else {
    root.style.setProperty('--color-bg-primary', '249 250 251') // gray-50
    root.style.setProperty('--color-bg-secondary', '255 255 255') // white
    root.style.setProperty('--color-bg-tertiary', '243 244 246') // gray-100
    root.style.setProperty('--color-accent', '59 130 246') // blue-600
    root.style.setProperty('--color-accent-subtle', '96 165 250') // blue-400
  }
  
  localStorage.setItem('theme', theme)
}, [theme])

  const toggleTheme = () => {
    setTheme(prevTheme => prevTheme === 'light' ? 'dark' : 'light')
  }

  const value = {
    theme,
    toggleTheme,
    isDark: theme === 'dark'
  }

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  )
}

export const useTheme = () => {
  const context = useContext(ThemeContext)
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider')
  }
  return context
}

