import React, { useState } from 'react';
import CreatePost from '../components/Feed/CreatePost';
import PostCard from '../components/Feed/PostCard';
import thermostatImage from '../assets/images/thermostat.jpeg';
// import showerImage from '../assets/images/douche.png';

const FeedPage = () => {
  const [posts, setPosts] = useState([
    {
      id: 1,
      userName: "Marie Dupont",
      userAvatar: "https://i.pravatar.cc/150?img=8",
      building: "Tour Éco-Logis",
      time: "Il y a 2 heures",
      content: "🎉 Défi relevé ! J'ai réduit ma consommation de chauffage de 18% ce mois-ci en réglant mon thermostat à 19°C la journée. Qui d'autre participe au défi température ?",
      stats: { saving: 18, energySaved: 45 },
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
      building: "Quartier Solidaire",
      time: "Il y a 5 heures",
      content: "📊 Résultats du mois : Notre quartier a économisé 1250 kWh de gaz ! Le bâtiment B est en tête avec -22% de consommation. Félicitations à tous !",
      stats: { saving: 12, energySaved: 1250 },
      likes: 42,
      comments: 15,
      shares: 7,
      commentList: []
    },
    {
      id: 3,
      userName: "Thomas Legrand",
      userAvatar: "https://i.pravatar.cc/150?img=12",
      building: "Résidence Les Tilleuls",
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
      building: "Tous bâtiments",
      time: "Il y a 1 jour",
      content: "🚀 Nouveau défi lancé : 'Douche Express' ! Objectif : réduire de 25% sa consommation d'eau chaude. Les 10 premiers gagnants recevront un kit économiseur d'eau !",
    //   image: showerImage,
      likes: 56,
      comments: 23,
      shares: 12,
      commentList: []
    }
  ]);

  const [editingPost, setEditingPost] = useState(null);
  const currentUserId = "Vous";

  // Fonction pour créer un nouveau post
  const handleCreatePost = (content, postId = null) => {
    if (postId) {
      // Édition d'un post existant
      setPosts(posts.map(post => 
        post.id === postId 
          ? { ...post, content, time: "Modifié à l'instant" }
          : post
      ));
      setEditingPost(null);
    } else {
      // Création d'un nouveau post
      const newPost = {
        id: posts.length + 1,
        userName: currentUserId,
        userAvatar: "https://i.pravatar.cc/150?img=5",
        building: "Votre bâtiment",
        time: "À l'instant",
        content: content,
        likes: 0,
        comments: 0,
        shares: 0,
        commentList: []
      };
      
      setPosts([newPost, ...posts]);
    }
  };

  // Fonction pour éditer un post
  const handleEditPost = (post) => {
    setEditingPost(post);
    // Faire défiler vers le haut pour voir le formulaire d'édition
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Fonction pour supprimer un post
  const handleDeletePost = (postId) => {
    setPosts(posts.filter(post => post.id !== postId));
  };

  // Fonction pour ajouter un commentaire
  const handleAddComment = (postId, comment) => {
    setPosts(posts.map(post => {
      if (post.id === postId) {
        return {
          ...post,
          commentList: [...(post.commentList || []), comment],
          comments: (post.comments || 0) + 1
        };
      }
      return post;
    }));
  };

  // Fonction pour annuler l'édition
  const handleCancelEdit = () => {
    setEditingPost(null);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-2xl mx-auto p-4 md:p-6">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-800">Fil d'actualité</h1>
          <p className="text-gray-600 mt-2">
            Échangez avec votre communauté, partagez vos astuces et suivez les défis
          </p>
        </div>
        
        {/* Formulaire de création/modification de post */}
        <CreatePost 
          onCreatePost={handleCreatePost}
          editingPost={editingPost}
          onCancelEdit={handleCancelEdit}
        />
        
        {/* Liste des posts */}
        <div className="space-y-6">
          {posts.map((post) => (
            <PostCard 
              key={post.id} 
              post={post} 
              onAddComment={handleAddComment}
              onEditPost={handleEditPost}
              onDeletePost={handleDeletePost}
              currentUserId={currentUserId}
            />
          ))}
        </div>
        
        {/* Message de fin */}
        {posts.length > 0 && (
          <div className="text-center py-8 text-gray-500">
            <p>Vous avez vu tous les posts récents</p>
            <p className="text-sm mt-1">Revenez plus tard pour plus d'actualités !</p>
          </div>
        )}
        
        {/* Message si aucun post */}
        {posts.length === 0 && (
          <div className="text-center py-12">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
              <h3 className="text-xl font-semibold text-gray-700 mb-2">Aucun post pour le moment</h3>
              <p className="text-gray-600 mb-4">Soyez le premier à partager vos économies d'énergie !</p>
              <p className="text-sm text-gray-500">
                Partagez vos astuces, vos défis réussis, ou posez des questions à la communauté.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default FeedPage;