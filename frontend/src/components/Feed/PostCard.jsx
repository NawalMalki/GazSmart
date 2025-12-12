import React, { useState, useRef, useEffect } from 'react';
import { 
  FiThumbsUp, FiMessageCircle, FiShare2, FiMoreVertical, 
  FiSend, FiEdit2, FiTrash2, FiCheck, FiX 
} from 'react-icons/fi';
import ConfirmationModal from './ConfirmationModal'; // IMPORT AJOUTÉ

const PostCard = ({ 
  post, 
  onAddComment, 
  onEditPost, 
  onDeletePost,
  currentUserId = "Vous"
}) => {
  const [liked, setLiked] = useState(false);
  const [showComments, setShowComments] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false); // ÉTAT AJOUTÉ
  const [newComment, setNewComment] = useState('');
  const [likes, setLikes] = useState(post.likes || 0);
  const [comments, setComments] = useState(post.commentList || []);
  const [isEditingComment, setIsEditingComment] = useState(null);
  const [editCommentText, setEditCommentText] = useState('');
  const [showCommentDeleteModal, setShowCommentDeleteModal] = useState(false);
  const [commentToDelete, setCommentToDelete] = useState(null);
  
  const menuRef = useRef();
  const isCurrentUser = post.userName === currentUserId || post.userName === "Vous";

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setShowMenu(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleLike = () => {
    setLiked(!liked);
    setLikes(liked ? likes - 1 : likes + 1);
  };

  const handleAddComment = () => {
    if (newComment.trim() === '') return;
    
    const comment = {
      id: comments.length + 1,
      user: currentUserId,
      avatar: "https://i.pravatar.cc/40?img=5",
      text: newComment,
      time: "À l'instant"
    };
    
    setComments([...comments, comment]);
    
    if (onAddComment) {
      onAddComment(post.id, comment);
    }
    
    setNewComment('');
  };

  const handleEditComment = (commentId) => {
    const comment = comments.find(c => c.id === commentId);
    if (comment) {
      setIsEditingComment(commentId);
      setEditCommentText(comment.text);
    }
  };

  const handleSaveCommentEdit = (commentId) => {
    if (editCommentText.trim() === '') return;
    
    const updatedComments = comments.map(comment => 
      comment.id === commentId 
        ? { ...comment, text: editCommentText, edited: true }
        : comment
    );
    
    setComments(updatedComments);
    setIsEditingComment(null);
    setEditCommentText('');
  };

  const handleDeleteComment = (commentId) => {
    const updatedComments = comments.filter(comment => comment.id !== commentId);
    setComments(updatedComments);
    setShowCommentDeleteModal(false);
    setCommentToDelete(null);
  };

  const confirmDeleteComment = (commentId) => {
    setCommentToDelete(commentId);
    setShowCommentDeleteModal(true);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      if (isEditingComment) {
        handleSaveCommentEdit(isEditingComment);
      } else {
        handleAddComment();
      }
    }
  };

  const handleEditPost = () => {
    setShowMenu(false);
    if (onEditPost) {
      onEditPost(post);
    }
  };

  const handleDeletePost = () => {
    setShowMenu(false);
    setShowDeleteModal(true);
  };

  const confirmDeletePost = () => {
    if (onDeletePost) {
      onDeletePost(post.id);
    }
    setShowDeleteModal(false);
  };

  return (
    <>
      {/* Modal de suppression de post */}
      <ConfirmationModal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={confirmDeletePost}
        title="Supprimer la publication"
        message="Êtes-vous sûr de vouloir supprimer ce post ? Cette action est irréversible."
        confirmText="Supprimer"
        cancelText="Annuler"
        type="danger"
      />

      {/* Modal de suppression de commentaire */}
      <ConfirmationModal
        isOpen={showCommentDeleteModal}
        onClose={() => {
          setShowCommentDeleteModal(false);
          setCommentToDelete(null);
        }}
        onConfirm={() => handleDeleteComment(commentToDelete)}
        title="Supprimer le commentaire"
        message="Êtes-vous sûr de vouloir supprimer ce commentaire ?"
        confirmText="Supprimer"
        cancelText="Annuler"
        type="danger"
      />

      {/* Carte du post */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 mb-6">
        {/* Post Header */}
        <div className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <img 
                src={post.userAvatar} 
                alt={post.userName}
                className="w-10 h-10 rounded-full object-cover"
              />
              <div>
                <div className="flex items-center space-x-2">
                  <h3 className="font-semibold text-gray-800">{post.userName}</h3>
                  {isCurrentUser && (
                    <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full">
                      Vous
                    </span>
                  )}
                </div>
                <p className="text-xs text-gray-500">
                  {post.time} • <span className="text-green-600">{post.building}</span>
                </p>
              </div>
            </div>
            
            {/* Menu déroulant pour gestion */}
            <div className="relative" ref={menuRef}>
              <button 
                onClick={() => setShowMenu(!showMenu)}
                className="text-gray-400 hover:text-gray-600 p-1 rounded-full hover:bg-gray-100"
              >
                <FiMoreVertical size={20} />
              </button>
              
              {showMenu && (
                <div className="absolute right-0 mt-1 w-48 bg-white rounded-lg shadow-lg border border-gray-200 z-20">
                  <div className="py-1">
                    {isCurrentUser ? (
                      <>
                        <button 
                          onClick={handleEditPost}
                          className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-green-600"
                        >
                          <FiEdit2 className="mr-3" size={16} />
                          Modifier le post
                        </button>
                        <button 
                          onClick={handleDeletePost}
                          className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-red-600"
                        >
                          <FiTrash2 className="mr-3" size={16} />
                          Supprimer le post
                        </button>
                      </>
                    ) : (
                      <button className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-yellow-600">
                        <FiAlertTriangle className="mr-3" size={16} />
                        Signaler le post
                      </button>
                    )}
                    <div className="border-t border-gray-100 my-1"></div>
                    <button 
                      onClick={() => setShowMenu(false)}
                      className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      <FiX className="mr-3" size={16} />
                      Fermer
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
          
          {/* Post Content */}
          <div className="mt-4">
            <p className="text-gray-700 whitespace-pre-line">{post.content}</p>
            
            {/* Stats Badge */}
            {post.stats && (
              <div className="mt-3 inline-flex items-center bg-green-50 text-green-700 px-3 py-1 rounded-full text-sm">
                <span className="font-bold">-{post.stats.saving}%</span>
                <span className="mx-1">•</span>
                <span>{post.stats.energySaved} kWh économisés</span>
              </div>
            )}
            
            {/* Post Image */}
            {post.image && (
              <div className="mt-4 rounded-lg overflow-hidden">
                <img 
                  src={post.image} 
                  alt="Post visual" 
                  className="w-full h-48 object-cover"
                />
              </div>
            )}
          </div>
        </div>
        
        {/* Post Stats */}
        <div className="px-4 py-2 border-t border-gray-100 text-sm text-gray-500">
          {likes} mentions j'aime • {comments.length} commentaires • {post.shares} partages
        </div>
        
        {/* Action Buttons */}
        <div className="flex border-t border-gray-100">
          <button 
            onClick={handleLike}
            className={`flex-1 flex items-center justify-center py-3 space-x-2 transition-colors
              ${liked ? 'text-blue-600' : 'text-gray-600 hover:text-blue-600'}`}
          >
            <FiThumbsUp size={18} />
            <span>J'aime</span>
          </button>
          
          <button 
            onClick={() => setShowComments(!showComments)}
            className="flex-1 flex items-center justify-center py-3 space-x-2 text-gray-600 hover:text-green-600"
          >
            <FiMessageCircle size={18} />
            <span>Commenter</span>
          </button>
          
          <button className="flex-1 flex items-center justify-center py-3 space-x-2 text-gray-600 hover:text-green-600">
            <FiShare2 size={18} />
            <span>Partager</span>
          </button>
        </div>
        
        {/* Comment Section */}
        {showComments && (
          <div className="border-t border-gray-100 p-4">
            {/* Input pour nouveau commentaire */}
            <div className="flex space-x-3 mb-4">
              <img 
                src="https://i.pravatar.cc/40?img=5" 
                alt="Votre avatar"
                className="w-8 h-8 rounded-full"
              />
              <div className="flex-1 flex items-center space-x-2">
                <input 
                  type="text" 
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Écrivez un commentaire..."
                  className="flex-1 border border-gray-300 rounded-full px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                />
                <button 
                  onClick={handleAddComment}
                  disabled={!newComment.trim()}
                  className="bg-green-600 text-white p-2 rounded-full hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <FiSend size={16} />
                </button>
              </div>
            </div>
            
            {/* Liste des commentaires */}
            {comments.length > 0 ? (
              <div className="space-y-3">
                {comments.map((comment) => (
                  <div key={comment.id} className="flex space-x-3 group">
                    <img 
                      src={comment.avatar} 
                      alt={comment.user}
                      className="w-8 h-8 rounded-full"
                    />
                    <div className="flex-1">
                      {isEditingComment === comment.id ? (
                        // Mode édition du commentaire
                        <div className="flex space-x-2">
                          <input 
                            type="text" 
                            value={editCommentText}
                            onChange={(e) => setEditCommentText(e.target.value)}
                            onKeyPress={handleKeyPress}
                            className="flex-1 border border-green-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-green-500"
                            autoFocus
                          />
                          <div className="flex space-x-1">
                            <button 
                              onClick={() => handleSaveCommentEdit(comment.id)}
                              className="bg-green-600 text-white p-2 rounded-lg hover:bg-green-700"
                            >
                              <FiCheck size={14} />
                            </button>
                            <button 
                              onClick={() => {
                                setIsEditingComment(null);
                                setEditCommentText('');
                              }}
                              className="bg-gray-200 text-gray-700 p-2 rounded-lg hover:bg-gray-300"
                            >
                              <FiX size={14} />
                            </button>
                          </div>
                        </div>
                      ) : (
                        // Affichage normal du commentaire
                        <div className={`rounded-2xl px-4 py-2 ${comment.user === currentUserId ? 'bg-green-50' : 'bg-gray-100'}`}>
                          <div className="flex justify-between items-start">
                            <div className="flex items-center space-x-2">
                              <span className="font-semibold text-sm">{comment.user}</span>
                              {comment.user === currentUserId && (
                                <span className="text-xs text-green-600">• Vous</span>
                              )}
                            </div>
                            <div className="flex items-center space-x-2">
                              <span className="text-xs text-gray-500">{comment.time}</span>
                              {comment.edited && (
                                <span className="text-xs text-gray-400">(modifié)</span>
                              )}
                              {comment.user === currentUserId && (
                                <div className="flex space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                  <button 
                                    onClick={() => handleEditComment(comment.id)}
                                    className="text-gray-400 hover:text-green-600 p-1"
                                    title="Modifier"
                                  >
                                    <FiEdit2 size={12} />
                                  </button>
                                  <button 
                                    onClick={() => confirmDeleteComment(comment.id)}
                                    className="text-gray-400 hover:text-red-600 p-1"
                                    title="Supprimer"
                                  >
                                    <FiTrash2 size={12} />
                                  </button>
                                </div>
                              )}
                            </div>
                          </div>
                          <p className="text-sm mt-1">{comment.text}</p>
                        </div>
                      )}
                      <div className="flex space-x-4 mt-1 ml-4 text-xs text-gray-500">
                        <button className="hover:text-green-600">J'aime</button>
                        <button className="hover:text-green-600">Répondre</button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-4 text-gray-500 text-sm">
                Aucun commentaire pour le moment. Soyez le premier à réagir !
              </div>
            )}
          </div>
        )}
      </div>
    </>
  );
};

export default PostCard;