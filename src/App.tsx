import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import axios from 'axios';
import { ConfigProvider, Layout, notification, App as AntdApp } from "antd";
import { AuthProvider } from './contexts/AuthContext';
import Dashboard from './components/Dashboard';
import Manage from './components/Manage';
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

// axios.defaults.baseURL = "/api"
axios.defaults.baseURL = "http://216.126.224.63:8089/api"

const AppContent = () => {
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
      duration: 5
    }),
    warning: (msg: string) => api.warning({
      message: "Warning",
      description: `${msg}`,
      showProgress: true,
      pauseOnHover: false,
      duration: 5
    }),
  }

  return (
    <>
      {contextHolder}
      <AuthProvider>
        <Router basename='/bet'>
          <Routes>
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
            <Route path="/dashboard" element={
              <Layout>
                <Dashboard />
              </Layout>
            } />
            <Route path="/manage" element={
              <Layout>
                <Manage />
              </Layout>
            } />
          </Routes>
        </Router>
      </AuthProvider>
    </>
  );
}

function App() {
  return (
    <ConfigProvider
      theme={{
        token: {
          colorPrimary: '#1890ff',
        },
      }}
    >
      <AntdApp>
        <AppContent />
      </AntdApp>
    </ConfigProvider>
  );
}

export default App;