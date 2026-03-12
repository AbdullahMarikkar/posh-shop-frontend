import { Box, Container, Typography } from '@mui/material';
import { StorefrontRounded } from '@mui/icons-material';
import { Outlet } from 'react-router-dom';
import { Navbar } from './Navbar';

export const Layout = () => {
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        minHeight: '100vh',
        bgcolor: 'background.default',
      }}
    >
      <Navbar />
      <Container component="main" maxWidth="xl" sx={{ flexGrow: 1, py: 5, px: { xs: 2, md: 4 } }}>
        <Outlet />
      </Container>
      <Box
        component="footer"
        sx={{
          py: 3,
          px: 4,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 1,
          borderTop: '1px solid',
          borderColor: 'divider',
          bgcolor: 'background.paper',
        }}
      >
        <StorefrontRounded sx={{ color: 'primary.main', fontSize: 20 }} />
        <Typography variant="body2" color="text.secondary">
          © {new Date().getFullYear()} Posh Shop. All rights reserved.
        </Typography>
      </Box>
    </Box>
  );
};
