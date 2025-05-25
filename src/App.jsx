import { BrowserRouter, Route, Routes, Navigate } from 'react-router-dom'
import Login from './pages/auth/Login'
import './index.css'
import ResetPassword from './pages/auth/ResetPassword'
import StudentDashboard from './pages/main/StudentDashboard'
import Layout from './components/layout'
import { useSelector } from 'react-redux'
import PrivateRoutes from './privateRoutes/privateRoutes'
import UserDashboard from './pages/main/UserDashboard'
import InactivityLogoutHandler from './InactivityLogoutHandler'
import StudentRankList from './pages/main/StudentRankList'

function App() {
  const token = useSelector((state) => state.user.token);

  return (
    <InactivityLogoutHandler>
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="/" element={<Layout />}>
          <Route element={<PrivateRoutes />}>
            <Route path="/" element={<Navigate to="/dashboard" />} />
            <Route path="/dashboard" element={<StudentDashboard />} />
            <Route path="/user-dashboard" element={<UserDashboard />} />
            <Route path="/student-rank-list" element={<StudentRankList />} />
          </Route>
        </Route>
        <Route path="*" element={token ? <Navigate to="/dashboard" /> : <Navigate to="/login" />} />
      </Routes>
    </BrowserRouter>
    </InactivityLogoutHandler>
  )
}

export default App
