import { BrowserRouter, Route, Routes, Navigate } from 'react-router-dom'
import Login from './pages/auth/Login'
import './index.css'
import ResetPassword from './pages/auth/ResetPassword'
import StudentDashboard from './pages/main/StudentDashboard'
import Layout from './components/layout'
import { useSelector } from 'react-redux'

function App() {
  const token = useSelector((state) => state.user.token);

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route
          path="/dashboard"
          element={
            <Layout>
              <StudentDashboard />
            </Layout>
          }
        />
        <Route path="*" element={token ? <Navigate to="/dashboard" /> : <Navigate to="/login" />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
