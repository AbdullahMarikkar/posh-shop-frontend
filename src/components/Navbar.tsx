import {
  AppBar, Toolbar, Typography, Badge, IconButton, Button, Box, Avatar, Menu, MenuItem, Divider,
} from '@mui/material';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import { StorefrontRounded } from '@mui/icons-material';
import { Link, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { useCartStore } from '../store/useCartStore';
import { useAuthStore } from '../store/useAuthStore';

export const Navbar = () => {
  const navigate = useNavigate();
  const cartItems = useCartStore((state) => state.items);
  const cartCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);
  const { user, logout } = useAuthStore();

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const menuOpen = Boolean(anchorEl);

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => setAnchorEl(event.currentTarget);
  const handleMenuClose = () => setAnchorEl(null);

  const handleLogout = () => {
    handleMenuClose();
    logout();
    navigate('/login', { replace: true });
  };

  const initials = user?.name
    ? user.name.split(' ').map((n) => n[0]).join('').slice(0, 2).toUpperCase()
    : user?.email?.[0]?.toUpperCase() ?? 'U';

  return (
    <AppBar position="sticky" color="transparent" elevation={0}>
      <Toolbar sx={{ gap: 1 }}>
        {/* Logo */}
        <Box
          component={Link}
          to="/"
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 1,
            textDecoration: 'none',
            flexGrow: 1,
          }}
        >
          <StorefrontRounded sx={{ color: 'primary.main', fontSize: 28 }} />
          <Typography
            variant="h6"
            sx={{ color: 'primary.main', fontWeight: 'bold', letterSpacing: '-0.01em' }}
          >
            Posh Shop
          </Typography>
        </Box>

        {/* Nav links */}
        <Button
          component={Link}
          to="/"
          color="inherit"
          sx={{ color: 'text.secondary', '&:hover': { color: 'primary.main' } }}
        >
          Products
        </Button>

        {/* Cart */}
        <IconButton
          onClick={() => navigate('/cart')}
          sx={{
            color: 'text.secondary',
            '&:hover': { color: 'primary.main', bgcolor: 'action.hover' },
          }}
        >
          <Badge badgeContent={cartCount} color="primary">
            <ShoppingCartIcon />
          </Badge>
        </IconButton>

        {/* User menu */}
        <Box sx={{ display: 'flex', alignItems: 'center', ml: 1 }}>
          <Button
            onClick={handleMenuOpen}
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 1,
              px: 1,
              py: 0.5,
              borderRadius: 2,
              color: 'text.primary',
              '&:hover': { bgcolor: 'action.hover' },
            }}
          >
            <Avatar
              sx={{
                width: 32,
                height: 32,
                bgcolor: 'primary.main',
                color: 'white',
                fontSize: '0.8rem',
                fontWeight: 700,
              }}
            >
              {initials}
            </Avatar>
            <Typography variant="body2" fontWeight={600} sx={{ display: { xs: 'none', sm: 'block' } }}>
              {user?.name?.split(' ')[0] ?? user?.email ?? 'Account'}
            </Typography>
            <KeyboardArrowDownIcon fontSize="small" sx={{ color: 'text.secondary' }} />
          </Button>

          <Menu
            anchorEl={anchorEl}
            open={menuOpen}
            onClose={handleMenuClose}
            PaperProps={{
              elevation: 0,
              sx: {
                mt: 1.5,
                border: '1px solid #D2C4B4',
                borderRadius: 2,
                minWidth: 180,
                '& .MuiMenuItem-root': { py: 1.2, px: 2 },
              },
            }}
            transformOrigin={{ horizontal: 'right', vertical: 'top' }}
            anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
          >
            <Box sx={{ px: 2, py: 1 }}>
              <Typography variant="body2" fontWeight={600}>{user?.name ?? 'User'}</Typography>
              <Typography variant="caption" color="text.secondary">{user?.email}</Typography>
            </Box>
            <Divider />
            <MenuItem onClick={() => { handleMenuClose(); navigate('/cart'); }}>
              Shopping Cart {cartCount > 0 && `(${cartCount})`}
            </MenuItem>
            <Divider />
            <MenuItem onClick={handleLogout} sx={{ color: 'error.main' }}>
              Sign Out
            </MenuItem>
          </Menu>
        </Box>
      </Toolbar>
    </AppBar>
  );
};
