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

import { ProtectedRoute } from "./components/ProtectedRoute"
import FeedPage from "./pages/FeedPage" 

import "./index.css"
import CuisineMaligne from "./pages/CuisineMaligne"
import DefiTemperature from "./pages/DefiTemperature"

function App() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true)

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen)
  }

  // Layout pour utilisateurs normaux
  const DashboardLayout = ({ children }) => (
    <div className="app-container flex flex-col sm:flex-row h-screen transition-colors duration-300 overflow-hidden">
      <div className="hidden sm:flex flex-shrink-0 transition-all duration-300">
        <Sidebar isOpen={isSidebarOpen} isAdmin={false} />
      </div>

      <div className="flex flex-col w-full min-h-0 min-w-0">
        <header className="flex-shrink-0">
          <Header onToggleSidebar={toggleSidebar} isSidebarOpen={isSidebarOpen} isAdmin={false} />
        </header>

        <main className="flex-1 overflow-auto transition-colors duration-300">
          {children}
        </main>

        <footer className="flex-shrink-0">
          <Footer />
        </footer>
      </div>
    </div>
  )

  // Layout pour admin (même structure mais isAdmin={true})
  const AdminLayout = ({ children }) => (
    <div className="app-container flex flex-col sm:flex-row h-screen transition-colors duration-300 overflow-hidden">
      <div className="hidden sm:flex flex-shrink-0 transition-all duration-300">
        <Sidebar isOpen={isSidebarOpen} isAdmin={true} />
      </div>

      <div className="flex flex-col w-full min-h-0 min-w-0">
        <header className="flex-shrink-0">
          <Header onToggleSidebar={toggleSidebar} isSidebarOpen={isSidebarOpen} isAdmin={true} />
        </header>

        <main className="flex-1 overflow-auto transition-colors duration-300">
          {children}
        </main>

        <footer className="flex-shrink-0">
          <Footer />
        </footer>
      </div>
    </div>
  )

  return (
    <Routes>
      <Route path="/" element={<Navigate to="/login" replace />} />

      {/* Public routes */}
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/verify-email" element={<VerifyEmail />} />

      {/* Protected Routes - User Dashboard */}
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

      <Route path="/feed" 
        element={
          <ProtectedRoute>
            <DashboardLayout>
              <FeedPage />
            </DashboardLayout>
          </ProtectedRoute>
        } 
      /> 

      {/* Protected Routes - Admin Space */}
      <Route
        path="/adminspace"
        element={
          <ProtectedRoute requireAdmin={true}>
            <AdminLayout>
              <AdminSpace />
            </AdminLayout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/adminspace/profile"
        element={
          <ProtectedRoute requireAdmin={true}>
            <AdminLayout>
              <Profile />
            </AdminLayout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/adminspace/alertes"
        element={
          <ProtectedRoute requireAdmin={true}>
            <AdminLayout>
              <div className="p-8">
                <h1 className="text-3xl font-bold">Gestion des alertes</h1>
                <p className="text-gray-600 mt-2">Gérer les alertes système</p>
              </div>
            </AdminLayout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/adminspace/defis"
        element={
          <ProtectedRoute requireAdmin={true}>
            <AdminLayout>
              <div className="p-8">
                <h1 className="text-3xl font-bold">Gestion des défis</h1>
                <p className="text-gray-600 mt-2">Créer et modifier les défis</p>
              </div>
            </AdminLayout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/adminspace/recompenses"
        element={
          <ProtectedRoute requireAdmin={true}>
            <AdminLayout>
              <div className="p-8">
                <h1 className="text-3xl font-bold">Gestion des récompenses</h1>
                <p className="text-gray-600 mt-2">Gérer les récompenses</p>
              </div>
            </AdminLayout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/adminspace/feed"
        element={
          <ProtectedRoute requireAdmin={true}>
            <AdminLayout>
              <div className="p-8">
                <h1 className="text-3xl font-bold">Contrôle des postes</h1>
                <p className="text-gray-600 mt-2">Modération du fil d'actualité</p>
              </div>
            </AdminLayout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/adminspace/evenements"
        element={
          <ProtectedRoute requireAdmin={true}>
            <AdminLayout>
              <div className="p-8">
                <h1 className="text-3xl font-bold">Gestion des événements</h1>
                <p className="text-gray-600 mt-2">Créer et gérer les événements</p>
              </div>
            </AdminLayout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/adminspace/settings"
        element={
          <ProtectedRoute requireAdmin={true}>
            <AdminLayout>
              <div className="p-8">
                <h1 className="text-3xl font-bold">Paramètres</h1>
                <p className="text-gray-600 mt-2">Configuration du système</p>
              </div>
            </AdminLayout>
          </ProtectedRoute>
        }
      />

    </Routes>
  )
}

export default App