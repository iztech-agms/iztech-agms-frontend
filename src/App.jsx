import { BrowserRouter, Route, Routes } from 'react-router-dom'
import Login from './pages/auth/Login'
import './index.css'
import ResetPassword from './pages/auth/ResetPassword'
import StudentDashboard from './pages/main/StudentDashboard'
import Layout from './components/layout'

function App() {
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
      </Routes>
    </BrowserRouter>
  )
}

export default App
