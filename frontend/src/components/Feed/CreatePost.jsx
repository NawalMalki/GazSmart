import React, { useState, useEffect } from 'react';
import { FiImage, FiBarChart2, FiAward, FiSend, FiX } from 'react-icons/fi';

const CreatePost = ({ onCreatePost, editingPost, onCancelEdit, theme = 'light' }) => {
  const [postContent, setPostContent] = useState('');
  const [showOptions, setShowOptions] = useState(false);

  useEffect(() => {
    if (editingPost) {
      setPostContent(editingPost.content);
    } else {
      setPostContent('');
    }
  }, [editingPost]);

  const handleSubmit = () => {
    if (postContent.trim()) {
      onCreatePost(postContent, editingPost?.id);
      setPostContent('');
      setShowOptions(false);
    }
  };

  const handleCancel = () => {
    setPostContent('');
    setShowOptions(false);
    if (onCancelEdit) onCancelEdit();
  };

  return (
    <div className={`rounded-xl shadow-sm border p-4 mb-6 transition-colors duration-300
      ${theme === 'dark' 
        ? 'bg-gray-800 border-gray-700 text-gray-200' 
        : 'bg-white border-gray-200 text-gray-900'
      }`}
    >
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-3">
          <img 
            src="https://i.pravatar.cc/40?img=5" 
            alt="Your avatar"
            className="w-10 h-10 rounded-full"
          />
          <div className="flex-1">
            <h3 className="font-semibold">
              {editingPost ? "Modifier votre publication" : "Quoi de neuf ?"}
            </h3>
            <p className={`text-xs ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
              {editingPost ? "Modifiez votre post ci-dessous" : "Partagez vos économies d'énergie"}
            </p>
          </div>
        </div>
        
        {editingPost && (
          <button 
            onClick={handleCancel}
            className={`p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors
              ${theme === 'dark' ? 'text-gray-300 hover:text-red-500' : 'text-gray-500 hover:text-red-600'}`}
            title="Annuler"
          >
            <FiX size={20} />
          </button>
        )}
      </div>
      
      <textarea 
        value={postContent}
        onChange={(e) => setPostContent(e.target.value)}
        placeholder="Partagez vos astuces d'économie de gaz, vos défis réussis, ou posez une question à la communauté..."
        className={`w-full border rounded-lg p-3 mb-3 focus:outline-none focus:ring-2 focus:ring-green-500 resize-none
          ${theme === 'dark' 
            ? 'bg-gray-700 border-gray-600 text-gray-200 placeholder-gray-400 focus:border-green-400' 
            : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500 focus:border-green-500'
          }`}
        rows="3"
      />
      
      <div className="flex items-center justify-between">
        <div className="flex space-x-2">
          {!editingPost && (
            <>
              <button 
                onClick={() => setShowOptions(!showOptions)}
                className={`flex items-center space-x-2 px-3 py-2 rounded-lg transition-colors duration-200
                  ${theme === 'dark' 
                    ? 'text-gray-300 hover:text-green-400 hover:bg-gray-700' 
                    : 'text-gray-600 hover:text-green-600 hover:bg-gray-50'
                  }`}
              >
                <FiImage size={18} />
                <span className="text-sm">Ajouter</span>
              </button>
              
              <button className={`flex items-center space-x-2 px-3 py-2 rounded-lg transition-colors duration-200
                ${theme === 'dark' 
                  ? 'text-gray-300 hover:text-green-400 hover:bg-gray-700' 
                  : 'text-gray-600 hover:text-green-600 hover:bg-gray-50'
                }`}
              >
                <FiBarChart2 size={18} />
                <span className="text-sm">Statistiques</span>
              </button>
            </>
          )}
        </div>
        
        <div className="flex space-x-2">
          {editingPost && (
            <button 
              onClick={handleCancel}
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors duration-200
                ${theme === 'dark' ? 'bg-gray-700 text-gray-200 hover:bg-gray-600' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}
            >
              <span>Annuler</span>
            </button>
          )}
          
          <button 
            onClick={handleSubmit}
            disabled={!postContent.trim()}
            className={`flex items-center space-x-2 px-4 py-2 rounded-lg text-white transition-colors duration-200
              ${theme === 'dark' 
                ? 'bg-green-600 hover:bg-green-500 disabled:opacity-50 disabled:cursor-not-allowed' 
                : 'bg-green-600 hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed'
              }`}
          >
            <FiSend size={18} />
            <span>{editingPost ? "Modifier" : "Publier"}</span>
          </button>
        </div>
      </div>
      
      {!editingPost && showOptions && (
        <div className={`mt-4 pt-4 border-t grid grid-cols-2 gap-2 transition-colors duration-300
          ${theme === 'dark' ? 'border-gray-600' : 'border-gray-200'}`}
        >
          <button className={`flex items-center justify-center space-x-2 p-2 rounded-lg transition-colors duration-200
            ${theme === 'dark' ? 'text-gray-300 hover:text-green-400 hover:bg-gray-700' : 'text-gray-600 hover:text-green-600 hover:bg-gray-50'}`}>
            <FiAward size={16} />
            <span className="text-sm">Défi réussi</span>
          </button>
          <button className={`flex items-center justify-center space-x-2 p-2 rounded-lg transition-colors duration-200
            ${theme === 'dark' ? 'text-gray-300 hover:text-green-400 hover:bg-gray-700' : 'text-gray-600 hover:text-green-600 hover:bg-gray-50'}`}>
            <FiBarChart2 size={16} />
            <span className="text-sm">Graphique conso</span>
          </button>
        </div>
      )}
    </div>
  );
};

export default CreatePost;
