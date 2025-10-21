import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './components/Login';
import Register from './components/Register';
import Layout from './components/Layout';
import axios from 'axios';
import { ConfigProvider, notification, theme } from "antd";
import { AuthProvider } from './contexts/AuthContext';
import ProtectedRoute from './utils/ProtectedRoute';
import Dashboard from './components/Dashboard';
import Bet from './components/Bet';
import History from './components/History';
interface Message {
  success: (msg: string) => void,
  error: (msg: string) => void,
  warning: (msg: string) => void
}
declare global {
  interface Window {
    SM: Message;
  }
}

axios.defaults.baseURL = "/api"
// axios.defaults.baseURL = "http://172.16.3.164:9090/api"

function App() {
  const [api, contextHolder] = notification.useNotification();

  window.SM = {
    success: (msg: string) => api.success({
      message: "Success",
      description: `${msg}`,
      showProgress: true,
      pauseOnHover: false,
      duration: 2
    }),
    error: (msg: string) => api.error({
      message: "Error",
      description: `${msg}`,
      showProgress: true,
      pauseOnHover: false,
      duration: 2
    }),
    warning: (msg: string) => api.warning({
      message: "Warning",
      description: `${msg}`,
      showProgress: true,
      pauseOnHover: false,
      duration: 2
    }),
  }
  return (
    <>
      {contextHolder}
      <ConfigProvider
        theme={{
          algorithm: theme.darkAlgorithm,
          token: {
            colorPrimary: '#10b981',
            colorBgContainer: '#1e293b',
            colorBgElevated: '#334155',
            colorBorder: '#475569',
            colorText: '#ffffff',
            colorTextSecondary: '#9ca3af',
          },
        }}
      >
        <AuthProvider>
          <Router basename='/welcome'>
            <Routes>
              <Route path="/" element={<Navigate to="/dashboard" replace />} />
              <Route path="/login" element={
                <Layout>
                  <Login />
                </Layout>
              } />
              <Route path="/register" element={
                <Layout>
                  <Register />
                </Layout>
              } />
              <Route path="/dashboard" element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              } />
              <Route path="/bet" element={
                <ProtectedRoute>
                  <Bet />
                </ProtectedRoute>
              } />
              <Route path="/history" element={
                <ProtectedRoute>
                  <History />
                </ProtectedRoute>
              } />
            </Routes>
          </Router>
        </AuthProvider>
      </ConfigProvider>
    </>
  );
}

export default App;