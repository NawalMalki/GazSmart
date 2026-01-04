import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';
import CreatePost from '../components/Feed/CreatePost';
import PostCard from '../components/Feed/PostCard';
import thermostatImage from '../assets/images/thermostat.jpeg';

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";

const FeedPage = () => {
  const { theme } = useTheme();
  const navigate = useNavigate();
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const [posts, setPosts] = useState([
    {
      id: 1,
      userName: "Marie Dupont",
      userAvatar: "https://i.pravatar.cc/150?img=8",
      time: "Il y a 2 heures",
      content: "🎉 Défi relevé ! J'ai réduit ma consommation de chauffage de 18% ce mois-ci en réglant mon thermostat à 19°C la journée. Qui d'autre participe au défi température ?",
      likes: 24,
      comments: 8,
      shares: 3,
      image: thermostatImage,
      commentList: [
        { id: 1, user: "Jean Martin", avatar: "https://i.pravatar.cc/40?img=2", text: "Bravo Marie ! Je suis à -15%, on continue !", time: "1h" },
        { id: 2, user: "Sophie Leroy", avatar: "https://i.pravatar.cc/40?img=3", text: "Quelle température recommandes-tu la nuit ?", time: "45m" }
      ]
    },
    {
      id: 2,
      userName: "Éco-Quartier Vert",
      userAvatar: "https://i.pravatar.cc/150?img=10",
      time: "Il y a 5 heures",
      content: "📊 Résultats du mois : Notre quartier a économisé 1250 kWh de gaz ! Le bâtiment B est en tête avec -22% de consommation. Félicitations à tous !",
      
      likes: 42,
      comments: 15,
      shares: 7,
      commentList: []
    },
    {
      id: 3,
      userName: "Thomas Legrand",
      userAvatar: "https://i.pravatar.cc/150?img=12",
      time: "Hier à 14:30",
      content: "Astuce du jour : J'ai installé des rideaux épais et baissé le chauffage de 1°C. Résultat : même confort, -7% sur la facture !",
      likes: 31,
      comments: 5,
      shares: 4,
      commentList: [
        { id: 3, user: "Laura Petit", avatar: "https://i.pravatar.cc/40?img=4", text: "Merci pour le conseil, je teste cette semaine !", time: "20h" }
      ]
    },
    {
      id: 4,
      userName: "Anis Banali",
      userAvatar: "https://i.pravatar.cc/150?img=15",
      time: "Il y a 1 jour",
      content: "🚀 Nouveau défi lancé : 'Douche Express' ! Objectif : réduire de 25% sa consommation d'eau chaude. Les 10 premiers gagnants recevront un kit économiseur d'eau !",
      likes: 56,
      comments: 23,
      shares: 12,
      commentList: []
    }
  ]);

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
            fullName: userData.full_name,
            avatar: userData.profile_picture || `https://i.pravatar.cc/150?img=5`,
          });
          setLoading(false);
        } else if (response.status === 401) {
          localStorage.removeItem("authToken");
          navigate("/login");
        }
      } catch (err) {
        console.error("Error fetching user:", err);
        setLoading(false);
      }
    };

    fetchCurrentUser();
  }, [navigate]);

  const handleCreatePost = (content, postId = null) => {
    if (postId) {
      setPosts(posts.map(post => post.id === postId ? { ...post, content, time: "Modifié à l'instant" } : post));
      setEditingPost(null);
    } else {
      const newPost = {
        id: posts.length + 1,
        userName: currentUser?.fullName || "Utilisateur",
        userAvatar: currentUser?.avatar || "https://i.pravatar.cc/150?img=5",
        time: "À l'instant",
        content,
        likes: 0,
        comments: 0,
        shares: 0,
        commentList: []
      };
      setPosts([newPost, ...posts]);
    }
  };

  const handleEditPost = (post) => {
    setEditingPost(post);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDeletePost = (postId) => {
    setPosts(posts.filter(post => post.id !== postId));
  };

  const handleAddComment = (postId, comment) => {
    setPosts(posts.map(post => post.id === postId ? { ...post, commentList: [...(post.commentList || []), comment], comments: (post.comments || 0) + 1 } : post));
  };

  const handleCancelEdit = () => setEditingPost(null);

  if (loading) {
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
            className="transition-colors duration-300"
            theme={theme} // si CreatePost accepte le prop theme pour appliquer dark mode
          />
        </div>

        {/* Posts */}
        <div className="space-y-6">
          {posts.map(post => (
            <div key={post.id} className="transition-colors duration-300">
              <PostCard 
                post={post} 
                onAddComment={handleAddComment}
                onEditPost={handleEditPost}
                onDeletePost={handleDeletePost}
                currentUserId={currentUser?.fullName || "Utilisateur"}
                theme={theme} // passer le theme à PostCard
                className="max-w-full mx-auto"
              />
            </div>
          ))}
        </div>

        {/* Message de fin */}
        {posts.length > 0 && (
          <div className={`text-center py-8 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
            <p>Vous avez vu tous les posts récents</p>
            <p className="text-sm mt-1">Revenez plus tard pour plus d'actualités !</p>
          </div>
        )}

        {/* Message si aucun post */}
        {posts.length === 0 && (
          <div className="text-center py-12">
            <div className={`rounded-xl border p-8 transition-colors duration-300 ${theme === 'dark' ? 'bg-gray-800 border-gray-700 text-gray-300' : 'bg-white border-gray-200 text-gray-700'}`}>
              <h3 className="text-xl font-semibold mb-2">Aucun post pour le moment</h3>
              <p className="mb-4">Soyez le premier à partager vos économies d'énergie !</p>
              <p className="text-sm">Partagez vos astuces, vos défis réussis, ou posez des questions à la communauté.</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default FeedPage;
