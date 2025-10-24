import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import axios from 'axios';
import { ConfigProvider, Layout, notification, theme } from "antd";
import { AuthProvider } from './contexts/AuthContext';
import Dashboard from './components/Dashboard';
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
axios.defaults.baseURL = "http://144.172.91.194:9090/api"

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
          token: {
            colorPrimary: '#1890ff',
          },
        }}
      >
        <AuthProvider>
          <Router basename='/bet'>
            <Routes>
              <Route path="/" element={<Navigate to="/dashboard" replace />} />
              <Route path="/dashboard" element={
                <Layout>
                  <Dashboard />
                </Layout>
              } />
            </Routes>
          </Router>
        </AuthProvider>
      </ConfigProvider>
    </>
  );
}

export default App;