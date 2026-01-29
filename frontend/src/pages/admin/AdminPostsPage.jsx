import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useTheme } from "../../context/ThemeContext";
import {
  FiTrash2,
  FiMessageSquare,
  FiThumbsUp,
  FiCalendar,
  FiChevronLeft,
  FiChevronRight,
  FiAlertTriangle,
  FiShield,
  FiUser,
  FiMail,
  FiClock,
} from "react-icons/fi";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";
const PAGE_LIMIT = 20;

const AdminPostsPage = () => {
  const { theme } = useTheme();
  const navigate = useNavigate();

  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const [selectedPost, setSelectedPost] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteReason, setDeleteReason] = useState("");
  const [deleting, setDeleting] = useState(false);

  const [error, setError] = useState(null);
  const [userRole, setUserRole] = useState(null);

  /* ===================== AUTH + LOAD ===================== */

  useEffect(() => {
    const init = async () => {
      const token = localStorage.getItem("authToken");
      if (!token) return navigate("/login");

      try {
        const meRes = await fetch(`${API_URL}/api/auth/me`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!meRes.ok) return navigate("/login");

        const me = await meRes.json();
        setUserRole(me.role);

        if (me.role !== "admin") return navigate("/feed");

        await loadPosts(1);
      } catch {
        setError("Erreur de connexion au serveur");
      } finally {
        setLoading(false);
      }
    };

    init();
  }, [navigate]);

  /* ===================== LOAD POSTS ===================== */

  const loadPosts = async (pageNum = 1) => {
    try {
      setLoading(true);
      setError(null);

      const token = localStorage.getItem("authToken");

      const res = await fetch(
        `${API_URL}/api/admin/posts?page=${pageNum}&limit=${PAGE_LIMIT}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
          },
        }
      );

      if (res.status === 403) return navigate("/feed");
      if (!res.ok) throw new Error();

      const data = await res.json();

      setPosts(data.posts || []);
      setPage(data.page || 1);
      setTotalPages(Math.ceil((data.total || 0) / PAGE_LIMIT));
    } catch {
      setError("Erreur lors du chargement des posts");
    } finally {
      setLoading(false);
    }
  };

  /* ===================== DELETE ===================== */

  const handleDeletePost = async () => {
    if (!selectedPost || deleting) return;

    try {
      setDeleting(true);
      const token = localStorage.getItem("authToken");

      const res = await fetch(
        `${API_URL}/api/admin/posts/${selectedPost.id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            reason: deleteReason.trim() || "Administrative action",
          }),
        }
      );

      if (!res.ok) {
        const err = await res.json();
        alert(err.detail || "Suppression échouée");
        return;
      }

      setPosts((prev) => prev.filter((p) => p.id !== selectedPost.id));
      setShowDeleteModal(false);
      setSelectedPost(null);
      setDeleteReason("");

      if (posts.length === 1 && page > 1) {
        loadPosts(page - 1);
      }
    } catch {
      alert("Erreur réseau");
    } finally {
      setDeleting(false);
    }
  };

  /* ===================== UTILS ===================== */

  const formatDate = (date) =>
    new Date(date).toLocaleDateString("fr-FR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });

  const timeAgo = (date) => {
    const diff = (Date.now() - new Date(date)) / 60000;
    if (diff < 1) return "À l'instant";
    if (diff < 60) return `Il y a ${Math.floor(diff)} min`;
    if (diff < 1440) return `Il y a ${Math.floor(diff / 60)} h`;
    return `Il y a ${Math.floor(diff / 1440)} j`;
  };

  /* ===================== LOADING ===================== */

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center">
        <div className="animate-spin h-12 w-12 border-4 border-blue-600 border-t-transparent rounded-full mb-4" />
        <p className="text-gray-600 dark:text-gray-400 font-medium">
          Chargement des publications...
        </p>
      </div>
    );
  }

  /* ===================== RENDER ===================== */

  return (
    <div
      className={`min-h-screen transition-colors duration-200 ${
        theme === "dark" 
          ? "bg-gradient-to-br from-gray-900 to-gray-950 text-gray-100" 
          : "bg-gradient-to-br from-gray-50 to-gray-100 text-gray-900"
      }`}
    >
      <div className="max-w-6xl mx-auto p-4 md:p-6 lg:p-8">
        {/* HEADER */}
        <div className={`flex items-center gap-4 mb-8 p-5 rounded-xl ${
          theme === "dark" 
            ? "bg-gradient-to-r from-gray-800/70 to-gray-900/50 border border-gray-700/50" 
            : "bg-gradient-to-r from-white/90 to-gray-50/90 border border-gray-200/50 shadow-soft"
        }`}>
          <div className={`p-3 rounded-xl ${
            theme === "dark" 
              ? "bg-gradient-to-br from-red-500/20 to-red-600/10 border border-red-500/20" 
              : "bg-gradient-to-br from-red-50 to-red-100 border border-red-200"
          }`}>
            <FiShield className="text-red-500 text-2xl" />
          </div>
          <div>
            <h1 className="text-2xl md:text-3xl font-bold heading-premium">
              Administration des Posts
            </h1>
            <p className="text-sm opacity-80 mt-1">
              Gestion et modération des publications
            </p>
          </div>
        </div>

        {/* ERROR MESSAGE */}
        {error && (
          <div className={`mb-6 p-4 rounded-xl border animation-slideIn ${
            theme === "dark"
              ? "bg-red-900/20 border-red-700/30"
              : "bg-red-50 border-red-200"
          }`}>
            <div className="flex items-center gap-3">
              <FiAlertTriangle className="text-red-500 flex-shrink-0" />
              <p className="font-medium">{error}</p>
            </div>
          </div>
        )}

        {/* POSTS LIST */}
        <div className="space-y-4">
          {posts.length === 0 ? (
            <div className={`text-center py-16 rounded-xl ${
              theme === "dark" 
                ? "bg-gray-800/50 border border-gray-700/50" 
                : "bg-white/90 border border-gray-200/50"
            }`}>
              <div className="max-w-md mx-auto">
                <div className={`w-16 h-16 mx-auto mb-4 rounded-full flex items-center justify-center ${
                  theme === "dark" 
                    ? "bg-gray-800" 
                    : "bg-gray-100"
                }`}>
                  <FiMessageSquare className="text-2xl opacity-50" />
                </div>
                <h3 className="text-lg font-semibold mb-2">
                  Aucun post à afficher
                </h3>
                <p className="opacity-70">
                  Aucune publication à gérer pour le moment.
                </p>
              </div>
            </div>
          ) : (
            posts.map((post) => (
              <div
                key={post.id}
                className={`rounded-xl border transition-all duration-200 card ${
                  theme === "dark"
                    ? "bg-gradient-to-br from-gray-800/60 to-gray-900/40 border-gray-700/50 hover:border-gray-600/50"
                    : "bg-white/90 border-gray-200/70 hover:border-gray-300 hover:shadow-medium"
                }`}
              >
                <div className="p-5">
                  {/* USER INFO HEADER */}
                  <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 mb-5">
                    <div className="flex items-start gap-3">
                      <div className={`p-2 rounded-lg ${
                        theme === "dark" 
                          ? "bg-gray-800" 
                          : "bg-gray-100"
                      }`}>
                        <FiUser className={theme === "dark" ? "text-gray-400" : "text-gray-600"} />
                      </div>
                      <div>
                        <h3 className="font-semibold text-lg">
                          {post.user_name}
                        </h3>
                        <p className="text-sm opacity-80 flex items-center gap-1 mt-1">
                          <FiMail className="opacity-60" />
                          {post.user_email}
                        </p>
                      </div>
                    </div>

                    <button
                      onClick={() => {
                        setSelectedPost(post);
                        setShowDeleteModal(true);
                      }}
                      className="px-4 py-2.5 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-lg hover:from-red-600 hover:to-red-700 transition-all duration-200 flex items-center gap-2 shadow-md hover:shadow-lg self-start"
                    >
                      <FiTrash2 />
                      Supprimer
                    </button>
                  </div>

                  {/* DATE INFO */}
                  <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-sm mb-4 ${
                    theme === "dark"
                      ? "bg-gray-800 text-gray-400"
                      : "bg-gray-100 text-gray-600"
                  }`}>
                    <FiCalendar className="opacity-60" />
                    <span>{formatDate(post.created_at)}</span>
                    <span className="opacity-60">•</span>
                    <FiClock className="opacity-60" />
                    <span>{timeAgo(post.created_at)}</span>
                  </div>

                  {/* POST CONTENT */}
                  <div className="mb-5">
                    <p className="whitespace-pre-line text-gray-800 dark:text-gray-200 leading-relaxed">
                      {post.content}
                    </p>
                  </div>

                  {/* STATS */}
                  <div className="flex flex-wrap items-center gap-4 pt-4 border-t border-gray-700/20 dark:border-gray-700/20">
                    <span className={`flex items-center gap-2 px-3 py-1.5 rounded-full ${
                      theme === "dark"
                        ? "bg-gray-800"
                        : "bg-gray-100"
                    }`}>
                      <FiThumbsUp className="text-blue-500" />
                      <span className="font-medium">{post.likes_count || 0}</span>
                      <span className="opacity-70">likes</span>
                    </span>
                    
                    <span className={`flex items-center gap-2 px-3 py-1.5 rounded-full ${
                      theme === "dark"
                        ? "bg-gray-800"
                        : "bg-gray-100"
                    }`}>
                      <FiMessageSquare className="text-green-500" />
                      <span className="font-medium">{post.comments_count || 0}</span>
                      <span className="opacity-70">commentaires</span>
                    </span>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* PAGINATION */}
        {totalPages > 1 && (
          <div className={`mt-8 p-4 rounded-xl border ${
            theme === "dark" 
              ? "bg-gray-800/50 border-gray-700/50" 
              : "bg-white/90 border-gray-200/50 shadow-soft"
          }`}>
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="text-sm opacity-80">
                Page {page} sur {totalPages}
              </div>

              <div className="flex items-center gap-2">
                <button
                  disabled={page <= 1}
                  onClick={() => loadPosts(page - 1)}
                  className={`p-3 rounded-lg border ${
                    page <= 1
                      ? theme === "dark"
                        ? "border-gray-800 text-gray-600 cursor-not-allowed"
                        : "border-gray-300 text-gray-400 cursor-not-allowed"
                      : theme === "dark"
                        ? "border-gray-700 hover:bg-gray-800 hover:border-gray-600"
                        : "border-gray-300 hover:bg-gray-100 hover:border-gray-400"
                  } transition-colors`}
                >
                  <FiChevronLeft />
                </button>

                <div className="flex items-center gap-1">
                  {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                    let pageNum;
                    if (totalPages <= 5) {
                      pageNum = i + 1;
                    } else if (page <= 3) {
                      pageNum = i + 1;
                    } else if (page >= totalPages - 2) {
                      pageNum = totalPages - 4 + i;
                    } else {
                      pageNum = page - 2 + i;
                    }

                    return (
                      <button
                        key={pageNum}
                        onClick={() => loadPosts(pageNum)}
                        className={`w-10 h-10 rounded-lg border flex items-center justify-center ${
                          page === pageNum
                            ? "bg-blue-500 border-blue-500 text-white"
                            : theme === "dark"
                              ? "border-gray-700 hover:bg-gray-800"
                              : "border-gray-300 hover:bg-gray-100"
                        } transition-colors`}
                      >
                        {pageNum}
                      </button>
                    );
                  })}
                </div>

                <button
                  disabled={page >= totalPages}
                  onClick={() => loadPosts(page + 1)}
                  className={`p-3 rounded-lg border ${
                    page >= totalPages
                      ? theme === "dark"
                        ? "border-gray-800 text-gray-600 cursor-not-allowed"
                        : "border-gray-300 text-gray-400 cursor-not-allowed"
                      : theme === "dark"
                        ? "border-gray-700 hover:bg-gray-800 hover:border-gray-600"
                        : "border-gray-300 hover:bg-gray-100 hover:border-gray-400"
                  } transition-colors`}
                >
                  <FiChevronRight />
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* DELETE MODAL */}
      {showDeleteModal && selectedPost && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50 animation-fadeIn">
          <div className={`w-full max-w-md rounded-2xl border overflow-hidden ${
            theme === "dark" 
              ? "bg-gray-900 border-gray-700" 
              : "bg-white border-gray-200 shadow-strong"
          }`}>
            {/* MODAL HEADER */}
            <div className={`p-6 border-b ${
              theme === "dark" 
                ? "border-gray-800 bg-gradient-to-r from-red-900/20 to-red-800/10" 
                : "border-gray-100 bg-gradient-to-r from-red-50 to-red-100"
            }`}>
              <div className="flex items-center gap-3 mb-2">
                <div className={`p-2 rounded-lg ${
                  theme === "dark" 
                    ? "bg-red-900/40" 
                    : "bg-red-200"
                }`}>
                  <FiAlertTriangle className="text-red-500 text-xl" />
                </div>
                <div>
                  <h3 className="text-xl font-bold">
                    Confirmer la suppression
                  </h3>
                  <p className="text-sm opacity-80 mt-1">
                    Cette action est irréversible
                  </p>
                </div>
              </div>
            </div>

            {/* MODAL BODY */}
            <div className="p-6">
              <div className="mb-6">
                <p className="mb-3 opacity-90">
                  Vous êtes sur le point de supprimer le post de{' '}
                  <span className="font-semibold">{selectedPost.user_name}</span>
                </p>
                <div className={`p-4 rounded-lg ${
                  theme === "dark" 
                    ? "bg-gray-800/50" 
                    : "bg-gray-100/50"
                }`}>
                  <p className="text-sm line-clamp-3 italic opacity-80">
                    "{selectedPost.content.substring(0, 150)}
                    {selectedPost.content.length > 150 ? '...' : ''}"
                  </p>
                </div>
              </div>

              <div className="mb-6">
                <label className="block text-sm font-medium mb-2 opacity-80">
                  Raison de la suppression (optionnel)
                </label>
                <textarea
                  value={deleteReason}
                  onChange={(e) => setDeleteReason(e.target.value)}
                  placeholder="Ex: Contenu inapproprié, violation des règles..."
                  rows="3"
                  className={`w-full p-3 rounded-lg border ${
                    theme === "dark"
                      ? "bg-gray-800 border-gray-700 focus:border-red-500 focus:ring-2 focus:ring-red-500/20"
                      : "bg-white border-gray-300 focus:border-red-500 focus:ring-2 focus:ring-red-500/20"
                  } transition-all duration-200 resize-none`}
                />
              </div>

              {/* MODAL ACTIONS */}
              <div className="flex justify-end gap-3">
                <button
                  onClick={() => {
                    setShowDeleteModal(false);
                    setSelectedPost(null);
                    setDeleteReason("");
                  }}
                  className={`px-5 py-2.5 rounded-lg border ${
                    theme === "dark"
                      ? "border-gray-700 hover:bg-gray-800"
                      : "border-gray-300 hover:bg-gray-100"
                  } transition-colors font-medium`}
                >
                  Annuler
                </button>
                <button
                  onClick={handleDeletePost}
                  disabled={deleting}
                  className="px-5 py-2.5 bg-gradient-to-r from-red-600 to-red-700 text-white rounded-lg hover:from-red-700 hover:to-red-800 transition-all duration-200 font-medium shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                >
                  {deleting ? (
                    <>
                      <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full" />
                      Suppression...
                    </>
                  ) : (
                    <>
                      <FiTrash2 />
                      Supprimer définitivement
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminPostsPage;