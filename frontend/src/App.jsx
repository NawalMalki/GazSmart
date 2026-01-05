"use client"

import { useState } from "react"
import { Routes, Route, Navigate } from "react-router-dom"

import Sidebar from "./components/Sidebar"
import Header from "./components/Header"
import Footer from "./components/Footer"

import AdminSpace from "./pages/AdminSpace"
import Dashboard from "./pages/Dashboard"
import Profile from "./pages/Profile"
import Login from "./pages/Login"
import Signup from "./pages/Signup"
import DefisDisponibles from "./pages/DefisDisponibles"
import ChronoDouche from "./pages/ChronoDouche"
import VerifyEmail from "./pages/VerifyEmail"
import FeedPage from "./pages/FeedPage"
import Events from "./pages/Events"
import Leaderboard from "./pages/Leaderboard"
import CuisineMaligne from "./pages/CuisineMaligne"
import DefiTemperature from "./pages/DefiTemperature"
import RecommendationsPage from "./pages/RecommendationsPage"

import { ProtectedRoute } from "./components/ProtectedRoute"

import "./index.css"

function App() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true)

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen)
  }

  /* ===== Layout User ===== */
  const DashboardLayout = ({ children }) => (
    <div className="app-container flex flex-col sm:flex-row h-screen overflow-hidden">
      <div className="hidden sm:flex flex-shrink-0">
        <Sidebar isOpen={isSidebarOpen} isAdmin={false} />
      </div>

      <div className="flex flex-col w-full min-h-0">
        <Header
          onToggleSidebar={toggleSidebar}
          isSidebarOpen={isSidebarOpen}
          isAdmin={false}
        />

        <main className="flex-1 overflow-auto">{children}</main>

        <Footer />
      </div>
    </div>
  )

  /* ===== Layout Admin ===== */
  const AdminLayout = ({ children }) => (
    <div className="app-container flex flex-col sm:flex-row h-screen overflow-hidden">
      <div className="hidden sm:flex flex-shrink-0">
        <Sidebar isOpen={isSidebarOpen} isAdmin={true} />
      </div>

      <div className="flex flex-col w-full min-h-0">
        <Header
          onToggleSidebar={toggleSidebar}
          isSidebarOpen={isSidebarOpen}
          isAdmin={true}
        />

        <main className="flex-1 overflow-auto">{children}</main>

        <Footer />
      </div>
    </div>
  )

  return (
    <Routes>
      <Route path="/" element={<Navigate to="/login" replace />} />

      {/* Public */}
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/verify-email" element={<VerifyEmail />} />

      {/* ===== User Routes ===== */}
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <DashboardLayout>
              <Dashboard />
            </DashboardLayout>
          </ProtectedRoute>
        }
      />

      <Route
      path="/recommendations"
      element={
       <ProtectedRoute>
        <DashboardLayout>
          <RecommendationsPage />
        </DashboardLayout>
       </ProtectedRoute>
  }
/>

      <Route
        path="/defis"
        element={
          <ProtectedRoute>
            <DashboardLayout>
              <DefisDisponibles />
            </DashboardLayout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/chrono-douche"
        element={
          <ProtectedRoute>
            <DashboardLayout>
              <ChronoDouche />
            </DashboardLayout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/cuisine-maligne"
        element={
          <ProtectedRoute>
            <DashboardLayout>
              <CuisineMaligne />
            </DashboardLayout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/defi-temperature"
        element={
          <ProtectedRoute>
            <DashboardLayout>
              <DefiTemperature />
            </DashboardLayout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/profile"
        element={
          <ProtectedRoute>
            <DashboardLayout>
              <Profile />
            </DashboardLayout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/feed"
        element={
          <ProtectedRoute>
            <DashboardLayout>
              <FeedPage />
            </DashboardLayout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/events"
        element={
          <ProtectedRoute>
            <DashboardLayout>
              <Events />
            </DashboardLayout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/classement"
        element={
          <ProtectedRoute>
            <DashboardLayout>
              <Leaderboard />
            </DashboardLayout>
          </ProtectedRoute>
        }
      />

      {/* ===== Admin Routes ===== */}
      <Route
        path="/adminspace"
        element={
          <ProtectedRoute requireAdmin>
            <AdminLayout>
              <AdminSpace />
            </AdminLayout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/adminspace/profile"
        element={
          <ProtectedRoute requireAdmin>
            <AdminLayout>
              <Profile />
            </AdminLayout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/adminspace/alertes"
        element={
          <ProtectedRoute requireAdmin>
            <AdminLayout>
              <h1 className="p-8 text-3xl font-bold">Gestion des alertes</h1>
            </AdminLayout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/adminspace/defis"
        element={
          <ProtectedRoute requireAdmin>
            <AdminLayout>
              <h1 className="p-8 text-3xl font-bold">Gestion des défis</h1>
            </AdminLayout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/adminspace/recompenses"
        element={
          <ProtectedRoute requireAdmin>
            <AdminLayout>
              <h1 className="p-8 text-3xl font-bold">Gestion des récompenses</h1>
            </AdminLayout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/adminspace/feed"
        element={
          <ProtectedRoute requireAdmin>
            <AdminLayout>
              <h1 className="p-8 text-3xl font-bold">Modération du feed</h1>
            </AdminLayout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/adminspace/evenements"
        element={
          <ProtectedRoute requireAdmin>
            <AdminLayout>
              <h1 className="p-8 text-3xl font-bold">Gestion des événements</h1>
            </AdminLayout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/adminspace/settings"
        element={
          <ProtectedRoute requireAdmin>
            <AdminLayout>
              <h1 className="p-8 text-3xl font-bold">Paramètres</h1>
            </AdminLayout>
          </ProtectedRoute>
        }
      />
    </Routes>
  )
}

export default App
