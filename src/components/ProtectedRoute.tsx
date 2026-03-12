import { Navigate } from 'react-router-dom';
import { Box, CircularProgress, Typography } from '@mui/material';
import { useAuthStore } from '../store/useAuthStore';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const { isAuthenticated, isSessionChecked } = useAuthStore();

  // While the app-load session check is in progress, show a
  // fullscreen spinner so we don't flash /login prematurely.
  if (!isSessionChecked) {
    return (
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '100vh',
          backgroundColor: 'background.default',
          gap: 2,
        }}
      >
        <CircularProgress sx={{ color: 'primary.main' }} size={48} />
        <Typography variant="body2" color="text.secondary">
          Verifying session…
        </Typography>
      </Box>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
};
