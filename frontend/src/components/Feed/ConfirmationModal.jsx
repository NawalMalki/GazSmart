import React from 'react';
import { FiAlertTriangle, FiX } from 'react-icons/fi';

const ConfirmationModal = ({ 
  isOpen, 
  onClose, 
  onConfirm, 
  title, 
  message,
  confirmText = "Supprimer",
  cancelText = "Annuler",
  type = "danger",
  theme = "light" // ajout du theme
}) => {
  if (!isOpen) return null;

  const getColors = () => {
    switch (type) {
      case 'danger':
        return {
          bg: 'bg-red-50 dark:bg-red-900/30',
          border: 'border-red-200 dark:border-red-700',
          icon: 'text-red-600 dark:text-red-400',
          button: 'bg-red-600 hover:bg-red-700 dark:bg-red-500 dark:hover:bg-red-600',
          title: 'text-red-800 dark:text-red-300',
          text: 'text-red-700 dark:text-red-200'
        };
      case 'warning':
        return {
          bg: 'bg-yellow-50 dark:bg-yellow-900/30',
          border: 'border-yellow-200 dark:border-yellow-700',
          icon: 'text-yellow-600 dark:text-yellow-400',
          button: 'bg-yellow-600 hover:bg-yellow-700 dark:bg-yellow-500 dark:hover:bg-yellow-600',
          title: 'text-yellow-800 dark:text-yellow-300',
          text: 'text-yellow-700 dark:text-yellow-200'
        };
      case 'success':
        return {
          bg: 'bg-green-50 dark:bg-green-900/30',
          border: 'border-green-200 dark:border-green-700',
          icon: 'text-green-600 dark:text-green-400',
          button: 'bg-green-600 hover:bg-green-700 dark:bg-green-500 dark:hover:bg-green-600',
          title: 'text-green-800 dark:text-green-300',
          text: 'text-green-700 dark:text-green-200'
        };
      default:
        return {
          bg: 'bg-gray-50 dark:bg-gray-800/50',
          border: 'border-gray-200 dark:border-gray-700',
          icon: 'text-gray-600 dark:text-gray-300',
          button: 'bg-gray-600 hover:bg-gray-700 dark:bg-gray-500 dark:hover:bg-gray-600',
          title: 'text-gray-800 dark:text-gray-200',
          text: 'text-gray-700 dark:text-gray-300'
        };
    }
  };

  const colors = getColors();

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="relative mx-4 max-w-md w-full">
        <div className={`rounded-xl shadow-lg border ${colors.border} animate-fadeIn
          ${theme==='dark'?'bg-gray-900 text-gray-200':'bg-white text-gray-900'}`}>
          
          {/* Header */}
          <div className={`flex items-center justify-between p-4 border-b ${theme==='dark'?'border-gray-700':'border-gray-200'}`}>
            <div className="flex items-center space-x-3">
              <div className={`p-2 rounded-full ${colors.bg}`}>
                <FiAlertTriangle className={`text-lg ${colors.icon}`} />
              </div>
              <h3 className={`font-semibold ${colors.title}`}>{title}</h3>
            </div>
            <button
              onClick={onClose}
              className={`p-1 rounded-full transition-colors duration-200 ${theme==='dark'?'text-gray-400 hover:text-gray-200 hover:bg-gray-700':'text-gray-400 hover:text-gray-600 hover:bg-gray-100'}`}
            >
              <FiX size={20} />
            </button>
          </div>

          {/* Body */}
          <div className="p-6">
            <p className={`${colors.text}`}>{message}</p>
          </div>

          {/* Footer */}
          <div className={`flex justify-end space-x-3 p-4 border-t ${theme==='dark'?'border-gray-700':'border-gray-200'}`}>
            <button
              onClick={onClose}
              className={`px-4 py-2 rounded-lg border transition-colors duration-200 
                ${theme==='dark'?'border-gray-600 text-gray-300 hover:bg-gray-700':'border-gray-300 text-gray-700 hover:bg-gray-50'}`}
            >
              {cancelText}
            </button>
            <button
              onClick={() => { onConfirm(); onClose(); }}
              className={`px-4 py-2 text-white rounded-lg transition-colors duration-200 ${colors.button}`}
            >
              {confirmText}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationModal;
