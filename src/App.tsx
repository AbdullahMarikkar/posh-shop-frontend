import { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider, CssBaseline } from '@mui/material';
import theme from './theme';
import { Layout } from './components/Layout';
import { ProtectedRoute } from './components/ProtectedRoute';
import { Home } from './pages/Home';
import { ProductDetails } from './pages/ProductDetails';
import { Cart } from './pages/Cart';
import { Checkout } from './pages/Checkout';
import { Login } from './pages/Login';
import { Signup } from './pages/Signup';
import { useAuthStore } from './store/useAuthStore';
import { AuthService } from './api/auth.service';

function App() {
  const { accessToken, refreshToken, setTokens, logout, setSessionChecked, isAuthenticated } =
    useAuthStore();

  /**
   * On app mount: if we have stored tokens, attempt a session refresh to
   * verify they are still valid and get fresh tokens from the backend.
   * This prevents stale sessions from causing silent 401s mid-session.
   */
  useEffect(() => {
    const verifySession = async () => {
      if (!accessToken || !refreshToken) {
        // No tokens stored — mark session check complete, user is logged out
        setSessionChecked(true);
        return;
      }

      try {
        const data = await AuthService.refreshSession(accessToken, refreshToken);
        setTokens(data.access_token, data.refresh_token);
      } catch {
        // Refresh failed — tokens are expired or invalid, force logout
        logout();
      } finally {
        setSessionChecked(true);
      }
    };

    verifySession();
    // Run only once on mount
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <Routes>
          {/* Public routes */}
          <Route
            path="/login"
            element={isAuthenticated ? <Navigate to="/" replace /> : <Login />}
          />
          <Route
            path="/signup"
            element={isAuthenticated ? <Navigate to="/" replace /> : <Signup />}
          />

          {/* Protected routes — wrapped in Layout */}
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <Layout />
              </ProtectedRoute>
            }
          >
            <Route index element={<Home />} />
            <Route path="product/:id" element={<ProductDetails />} />
            <Route path="cart" element={<Cart />} />
            <Route path="checkout" element={<Checkout />} />
          </Route>

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
    </ThemeProvider>
  );
}

export default App;
