import React from 'react'
import { useTheme } from '../context/ThemeContext'

const Footer = () => {
  const { theme } = useTheme()

  return (
    <footer
      className={`py-4 px-6 border-t 
        ${theme === 'dark' ? 'bg-gray-900 border-gray-700 text-gray-400' : 'bg-white border-gray-200 text-gray-600'}`}
    >
      <div className="flex items-center justify-between">
        <p className="text-sm">
          © 2025 GazSmart. Tous droits réservés.
        </p>
        <div className="flex space-x-4">
          <a href="#" className={`text-sm hover:text-teal-500 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>Aide</a>
          <a href="#" className={`text-sm hover:text-teal-500 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>Conditions</a>
          <a href="#" className={`text-sm hover:text-teal-500 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>Confidentialité</a>
        </div>
      </div>
    </footer>
  )
}

export default Footer
