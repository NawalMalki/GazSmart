import React, { useState, useEffect } from 'react';
import { FiImage, FiSend, FiX } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";

const CreatePost = ({ onCreatePost, editingPost, onCancelEdit, theme = 'light' }) => {
  const [postContent, setPostContent] = useState('');
  const [selectedImage, setSelectedImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (editingPost) {
      setPostContent(editingPost.content || '');
      setImagePreview(editingPost.image || null);
    } else {
      setPostContent('');
      setSelectedImage(null);
      setImagePreview(null);
    }
  }, [editingPost]);

  const handleImageSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Vérifier le type de fichier
      if (!file.type.match('image.*')) {
        alert('Veuillez sélectionner une image valide (JPEG, PNG, GIF)');
        return;
      }
      
      // Vérifier la taille (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        alert('L\'image est trop volumineuse. Taille max: 5MB');
        return;
      }
      
      setSelectedImage(file);
      
      // Créer une preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async () => {
    if (!postContent.trim()) {
      alert('Veuillez écrire quelque chose avant de publier');
      return;
    }

    setIsUploading(true);

    try {
      const token = localStorage.getItem("authToken");
      if (!token) {
        alert('Veuillez vous connecter');
        navigate('/login');
        return;
      }

      const formData = new FormData();
      formData.append('content', postContent.trim());
      
      if (selectedImage) {
        formData.append('image', selectedImage);
      }

      let method;
      let url;
      
      if (editingPost) {
        method = 'PUT';
        url = `${API_URL}/api/posts/${editingPost.id}`;
      } else {
        method = 'POST';
        url = `${API_URL}/api/posts`;
      }

      console.log(`Envoi ${method} à:`, url);
      
      const response = await fetch(url, {
        method: method,
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        body: formData,
      });

      console.log("Réponse:", response.status, response.statusText);
      
      if (response.ok) {
        const postData = await response.json();
        console.log('Post créé/modifié avec succès:', postData);
        
        // Appeler la fonction callback parent
        if (onCreatePost) {
          if (editingPost) {
            onCreatePost(postContent, editingPost.id, postData);
          } else {
            onCreatePost(postContent, null, postData);
          }
        }
        
        // Reset form
        setPostContent('');
        setSelectedImage(null);
        setImagePreview(null);
        
        if (onCancelEdit) onCancelEdit();
        
      } else {
        let errorMessage = 'Erreur lors de la publication';
        try {
          const errorData = await response.json();
          errorMessage = errorData.detail || errorData.message || errorMessage;
          console.error('Error response:', errorData);
        } catch (e) {
          const errorText = await response.text();
          console.error('Error text:', errorText);
          errorMessage = `Erreur ${response.status}: ${response.statusText}`;
        }
        throw new Error(errorMessage);
      }
    } catch (error) {
      console.error('Error creating/updating post:', error);
      alert(error.message || 'Une erreur est survenue. Veuillez réessayer.');
    } finally {
      setIsUploading(false);
    }
  };

  const handleCancel = () => {
    setPostContent('');
    setSelectedImage(null);
    setImagePreview(null);
    if (onCancelEdit) onCancelEdit();
  };

  const removeImage = () => {
    setSelectedImage(null);
    setImagePreview(null);
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
            disabled={isUploading}
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
        disabled={isUploading}
      />
      
      {/* Image Preview */}
      {imagePreview && (
        <div className="mb-4 relative">
          <img 
            src={imagePreview} 
            alt="Preview" 
            className="rounded-lg w-full h-48 object-cover"
          />
          <button
            onClick={removeImage}
            className={`absolute top-2 right-2 p-2 rounded-full bg-red-500 text-white hover:bg-red-600 transition-colors
              ${theme === 'dark' ? 'bg-red-600 hover:bg-red-700' : ''}`}
            disabled={isUploading}
            type="button"
          >
            <FiX size={16} />
          </button>
        </div>
      )}
      
      <div className="flex items-center justify-between">
        <div className="flex space-x-2">
          {/* Bouton pour ajouter une image */}
          <label className={`flex items-center space-x-2 px-3 py-2 rounded-lg transition-colors duration-200 cursor-pointer
            ${theme === 'dark' 
              ? 'text-gray-300 hover:text-green-400 hover:bg-gray-700' 
              : 'text-gray-600 hover:text-green-600 hover:bg-gray-50'
            } ${isUploading ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            <FiImage size={18} />
            <span className="text-sm">Image</span>
            <input
              type="file"
              accept="image/*"
              onChange={handleImageSelect}
              className="hidden"
              disabled={isUploading}
            />
          </label>
        </div>
        
        <div className="flex space-x-2">
          {editingPost && (
            <button 
              onClick={handleCancel}
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors duration-200
                ${theme === 'dark' ? 'bg-gray-700 text-gray-200 hover:bg-gray-600' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}
              disabled={isUploading}
              type="button"
            >
              <span>Annuler</span>
            </button>
          )}
          
          <button 
            onClick={handleSubmit}
            disabled={!postContent.trim() || isUploading}
            className={`flex items-center space-x-2 px-4 py-2 rounded-lg text-white transition-colors duration-200
              ${theme === 'dark' 
                ? 'bg-green-600 hover:bg-green-500 disabled:opacity-50 disabled:cursor-not-allowed' 
                : 'bg-green-600 hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed'
              }`}
            type="button"
          >
            {isUploading ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                <span>{editingPost ? "Modification..." : "Publication..."}</span>
              </>
            ) : (
              <>
                <FiSend size={18} />
                <span>{editingPost ? "Modifier" : "Publier"}</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default CreatePost;