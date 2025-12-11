"use client"

import { useState } from "react"
import { Routes, Route, Navigate } from "react-router-dom"

import Sidebar from "./components/Sidebar"
import Header from "./components/Header"
import Footer from "./components/Footer"

import Dashboard from "./pages/Dashboard"
import Profile from "./pages/Profile"
import Login from "./pages/Login"
import Signup from "./pages/Signup"
import DefisDisponibles from "./pages/DefisDisponibles"
import ChronoDouche from "./pages/ChronoDouche"
import VerifyEmail from "./pages/VerifyEmail"

import { ProtectedRoute } from "./components/ProtectedRoute"

import "./index.css"

function App() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true)

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen)
  }

  const DashboardLayout = ({ children }) => (
    <div className="app-container flex flex-col sm:flex-row h-screen transition-colors duration-300 overflow-hidden">
      {/* Sidebar - Hidden on mobile, shown on small screens and up */}
      <div className="hidden sm:flex flex-shrink-0 transition-all duration-300">
        <Sidebar isOpen={isSidebarOpen} />
      </div>

      {/* Main content area */}
      <div className="flex flex-col w-full min-h-0 min-w-0">
        {/* Header */}
        <header className="flex-shrink-0">
          <Header onToggleSidebar={toggleSidebar} isSidebarOpen={isSidebarOpen} />
        </header>

        {/* Main content */}
        <main className="flex-1 overflow-auto transition-colors duration-300">
          {children}
        </main>

        {/* Footer */}
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

      {/* Protected Routes */}
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
        path="/profile"
        element={
          <ProtectedRoute>
            <DashboardLayout>
              <Profile />
            </DashboardLayout>
          </ProtectedRoute>
        }
      />
    </Routes>
  )
}

export default App
