import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';
import CreatePost from '../components/Feed/CreatePost';
import PostCard from '../components/Feed/PostCard';

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";

const FeedPage = () => {
  const { theme } = useTheme();
  const navigate = useNavigate();
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [posts, setPosts] = useState([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [editingPost, setEditingPost] = useState(null);

  // Récupérer l'utilisateur connecté
  useEffect(() => {
    const fetchCurrentUser = async () => {
      try {
        const token = localStorage.getItem("authToken");
        if (!token) {
          navigate("/login");
          return;
        }

        const response = await fetch(`${API_URL}/api/auth/me`, {
          headers: { "Authorization": `Bearer ${token}` },
        });

        if (response.ok) {
          const userData = await response.json();
          setCurrentUser({
            id: userData.id,
            fullName: userData.full_name,
            avatar: userData.profile_picture || `https://i.pravatar.cc/150?img=5`,
            role: userData.role,
          });
          // Charger les posts après avoir récupéré l'utilisateur
          await loadInitialPosts();
        } else if (response.status === 401) {
          localStorage.removeItem("authToken");
          navigate("/login");
        }
      } catch (err) {
        console.error("Error fetching user:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchCurrentUser();
  }, [navigate]);

  // Récupérer les posts
  const fetchPosts = async (pageNum = 1) => {
    try {
      const token = localStorage.getItem("authToken");
      if (!token) {
        console.error("No token found");
        return [];
      }

      console.log("Fetching posts page", pageNum);
      
      const response = await fetch(`${API_URL}/api/posts?page=${pageNum}&limit=10`, {
        headers: { 
          "Authorization": `Bearer ${token}`,
          "Accept": "application/json"
        },
      });

      if (response.ok) {
        const data = await response.json();
        console.log("Posts fetched successfully:", data.posts?.length || 0, "posts");
        return data.posts || [];
      } else {
        console.error("Error fetching posts:", response.status, response.statusText);
        return [];
      }
    } catch (error) {
      console.error("Error fetching posts:", error);
      return [];
    }
  };

  const loadInitialPosts = async () => {
    setLoading(true);
    try {
      const postsData = await fetchPosts(1);
      console.log("Initial posts loaded:", postsData);
      setPosts(postsData);
      setPage(2);
      setHasMore(postsData.length === 10);
    } catch (error) {
      console.error("Error loading initial posts:", error);
    } finally {
      setLoading(false);
    }
  };

  const loadMorePosts = async () => {
    if (!hasMore || loading) return;
    
    setLoading(true);
    try {
      const newPosts = await fetchPosts(page);
      
      if (newPosts.length > 0) {
        setPosts(prev => [...prev, ...newPosts]);
        setPage(prev => prev + 1);
        setHasMore(newPosts.length === 10);
      } else {
        setHasMore(false);
      }
    } catch (error) {
      console.error("Error loading more posts:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreatePost = async (content, postId = null, postData = null) => {
    console.log("handleCreatePost called with:", { postId, postData });
    
    try {
      if (postId && postData) {
        // Mise à jour du post existant
        setPosts(posts.map(post => 
          post.id === postId ? { 
            ...post, 
            content: postData.content || content,
            image: postData.image_url || postData.image || post.image,
            time: "Modifié à l'instant" 
          } : post
        ));
        setEditingPost(null);
      } else if (postData) {
        // Nouveau post - ajouter en haut de la liste
        const newPost = {
          id: postData.id,
          userName: postData.userName || postData.user_name || currentUser?.fullName || "Utilisateur",
          userAvatar: postData.userAvatar || postData.user_avatar || currentUser?.avatar || "https://i.pravatar.cc/150?img=5",
          time: postData.time || "À l'instant",
          content: postData.content || content,
          likes: postData.likes || postData.likes_count || 0,
          comments: postData.comments || postData.comments_count || 0,
          shares: postData.shares || postData.shares_count || 0,
          image: postData.image_url || postData.image,
          commentList: postData.commentList || [],
          user_liked: postData.user_liked || 0
        };
        
        console.log("Adding new post to state:", newPost);
        setPosts(prev => [newPost, ...prev]);
      } else {
        // Si pas de postData, rafraîchir depuis l'API
        console.log("Refreshing posts from API");
        await loadInitialPosts();
      }
    } catch (error) {
      console.error("Error handling post creation:", error);
    }
  };

  const handleEditPost = (post) => {
    console.log("Editing post:", post);
    setEditingPost(post);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDeletePost = async (postId) => {
    try {
      const token = localStorage.getItem("authToken");
      const response = await fetch(`${API_URL}/api/posts/${postId}`, {
        method: 'DELETE',
        headers: { "Authorization": `Bearer ${token}` },
      });

      if (response.ok) {
        console.log("Post deleted successfully:", postId);
        setPosts(posts.filter(post => post.id !== postId));
      } else {
        const errorData = await response.json();
        console.error("Error deleting post:", errorData);
        alert('Erreur lors de la suppression du post');
      }
    } catch (error) {
      console.error("Error deleting post:", error);
      alert('Erreur lors de la suppression du post');
    }
  };

  const handleAddComment = async (postId, comment) => {
    try {
      const token = localStorage.getItem("authToken");
      console.log("Adding comment to post", postId, ":", comment.text);
      
      const response = await fetch(`${API_URL}/api/posts/${postId}/comments`, {
        method: 'POST',
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ content: comment.text }),
      });

      if (response.ok) {
        const newComment = await response.json();
        console.log("Comment added successfully:", newComment);
        
        setPosts(posts.map(post => {
          if (post.id === postId) {
            return { 
              ...post, 
              commentList: [...(post.commentList || []), newComment],
              comments: (post.comments || 0) + 1 
            };
          }
          return post;
        }));
      } else {
        const errorData = await response.json();
        console.error("Error adding comment:", errorData);
      }
    } catch (error) {
      console.error("Error adding comment:", error);
    }
  };

  const handleLike = async (postId) => {
    try {
      const token = localStorage.getItem("authToken");
      console.log("Toggling like for post", postId);
      
      const response = await fetch(`${API_URL}/api/posts/${postId}/like`, {
        method: 'POST',
        headers: { "Authorization": `Bearer ${token}` },
      });

      if (response.ok) {
        const data = await response.json();
        console.log("Like toggled successfully:", data);
        
        setPosts(posts.map(post => {
          if (post.id === postId) {
            return { 
              ...post, 
              likes: data.likes_count,
              user_liked: data.action === 'liked' ? 1 : 0
            };
          }
          return post;
        }));
      } else {
        const errorData = await response.json();
        console.error("Error toggling like:", errorData);
      }
    } catch (error) {
      console.error("Error toggling like:", error);
    }
  };

  const handleCancelEdit = () => {
    console.log("Cancel edit");
    setEditingPost(null);
  };

  // Rafraîchir les posts lors du retour sur la page
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible' && currentUser) {
        console.log("Page visible, refreshing posts");
        loadInitialPosts();
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [currentUser]);

  if (loading && posts.length === 0) {
    return (
      <div className={`min-h-screen flex items-center justify-center transition-colors duration-300 ${theme === 'dark' ? 'bg-gray-900' : 'bg-gray-50'}`}>
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-600 border-t-transparent mx-auto mb-4"></div>
          <p className={`${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>Chargement du fil d'actualité...</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen transition-colors duration-300 ${theme === 'dark' ? 'bg-gray-900' : 'bg-gray-50'}`}>
      <div className="max-w-4xl mx-auto p-4 md:p-6">
        <div className="mb-8">
          <h1 className={`${theme === 'dark' ? 'text-white' : 'text-gray-800'} text-2xl font-bold`}>Fil d'actualité</h1>
          <p className={`${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'} mt-2`}>
            Échangez avec votre communauté, partagez vos astuces et suivez les défis
          </p>
        </div>

        {/* CreatePost */}
        <div className="mb-6">
          <CreatePost 
            onCreatePost={handleCreatePost}
            editingPost={editingPost}
            onCancelEdit={handleCancelEdit}
            theme={theme}
          />
        </div>

        {/* Posts */}
        <div className="space-y-6">
          {posts.length > 0 ? (
            posts.map(post => (
              <div key={post.id} className="transition-colors duration-300">
                <PostCard 
                  post={post}
                  onAddComment={handleAddComment}
                  onEditPost={handleEditPost}
                  onDeletePost={handleDeletePost}
                  onLikePost={handleLike}
                  currentUserId={currentUser?.fullName || "Utilisateur"}
                  theme={theme}
                />
              </div>
            ))
          ) : (
            <div className="text-center py-12">
              <div className={`rounded-xl border p-8 transition-colors duration-300 ${theme === 'dark' ? 'bg-gray-800 border-gray-700 text-gray-300' : 'bg-white border-gray-200 text-gray-700'}`}>
                <h3 className="text-xl font-semibold mb-2">Aucun post pour le moment</h3>
                <p className="mb-4">Soyez le premier à partager vos économies d'énergie !</p>
                <p className="text-sm">Partagez vos astuces, vos défis réussis, ou posez des questions à la communauté.</p>
              </div>
            </div>
          )}
        </div>

        {/* Bouton Charger plus */}
        {hasMore && posts.length > 0 && (
          <div className="text-center py-8">
            <button
              onClick={loadMorePosts}
              disabled={loading}
              className={`px-6 py-2 rounded-lg transition-colors duration-200
                ${theme === 'dark'
                  ? 'bg-gray-700 text-gray-200 hover:bg-gray-600 disabled:opacity-50'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300 disabled:opacity-50'
                }`}
            >
              {loading ? 'Chargement...' : 'Charger plus de posts'}
            </button>
          </div>
        )}

        {/* Message de fin */}
        {posts.length > 0 && !hasMore && (
          <div className={`text-center py-8 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
            <p>Vous avez vu tous les posts récents</p>
            <p className="text-sm mt-1">Revenez plus tard pour plus d'actualités !</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default FeedPage;