import {
  AppBar, Toolbar, Typography, Badge, IconButton, Button, Box, Avatar, Menu, MenuItem, Divider,
} from '@mui/material';
import ShoppingCartOutlinedIcon from '@mui/icons-material/ShoppingCartOutlined';
import FavoriteBorderOutlinedIcon from '@mui/icons-material/FavoriteBorderOutlined';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import { AutoAwesomeMosaicRounded } from '@mui/icons-material';
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
    <AppBar 
      position="sticky" 
      color="inherit" 
      elevation={0}
      sx={{ 
        borderBottom: '1px solid rgba(54, 79, 107, 0.08)',
        backdropFilter: 'blur(10px)',
        backgroundColor: 'rgba(255, 255, 255, 0.9)'
      }}
    >
      <Toolbar sx={{ gap: 2, height: 80 }}>
        {/* Logo */}
        <Box
          component={Link}
          to="/"
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 1.5,
            textDecoration: 'none',
            flexGrow: { xs: 1, md: 0 },
            mr: { md: 4 }
          }}
        >
          <AutoAwesomeMosaicRounded sx={{ color: 'primary.main', fontSize: 32 }} />
          <Typography
            variant="h5"
            sx={{ color: 'primary.main', fontWeight: 800, letterSpacing: '-0.02em', textTransform: 'uppercase' }}
          >
            Atelier
          </Typography>
        </Box>

        {/* Nav links (Desktop) */}
        <Box sx={{ display: { xs: 'none', md: 'flex' }, flexGrow: 1, gap: 3 }}>
          <Typography component={Link} to="/" variant="body1" fontWeight={600} sx={{ textDecoration: 'none', color: 'text.primary', '&:hover': { color: 'secondary.main' } }}>Shop</Typography>
          <Typography component={Link} to="/" variant="body1" fontWeight={600} sx={{ textDecoration: 'none', color: 'text.secondary', '&:hover': { color: 'secondary.main' } }}>Collections</Typography>
          <Typography component={Link} to="/" variant="body1" fontWeight={600} sx={{ textDecoration: 'none', color: 'text.secondary', '&:hover': { color: 'secondary.main' } }}>Journal</Typography>
        </Box>

        {/* Action Icons */}
        <IconButton sx={{ color: 'text.primary', '&:hover': { color: 'secondary.main', bgcolor: 'action.hover' } }}>
          <FavoriteBorderOutlinedIcon />
        </IconButton>

        <IconButton
          onClick={() => navigate('/cart')}
          sx={{
            color: 'text.primary',
            mr: 1,
            '&:hover': { color: 'secondary.main', bgcolor: 'action.hover' },
          }}
        >
          <Badge badgeContent={cartCount} color="error" overlap="circular">
            <ShoppingCartOutlinedIcon />
          </Badge>
        </IconButton>

        {/* User menu */}
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Button
            onClick={handleMenuOpen}
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 1,
              px: { xs: 0, sm: 1 },
              py: 0.5,
              minWidth: 'auto',
              borderRadius: 2,
              color: 'text.primary',
              '&:hover': { bgcolor: 'action.hover' },
            }}
          >
            <Avatar
              sx={{
                width: 36,
                height: 36,
                bgcolor: 'primary.main',
                color: 'white',
                fontSize: '0.85rem',
                fontWeight: 700,
              }}
            >
              {initials}
            </Avatar>
            <Typography variant="body2" fontWeight={600} sx={{ display: { xs: 'none', sm: 'block' } }}>
              {user?.name?.split(' ')[0] ?? user?.email ?? 'Account'}
            </Typography>
            <KeyboardArrowDownIcon fontSize="small" sx={{ color: 'text.secondary', display: { xs: 'none', sm: 'block' } }} />
          </Button>

          <Menu
            anchorEl={anchorEl}
            open={menuOpen}
            onClose={handleMenuClose}
            PaperProps={{
              elevation: 4,
              sx: {
                mt: 1.5,
                border: '1px solid rgba(54, 79, 107, 0.08)',
                borderRadius: 2,
                minWidth: 200,
                boxShadow: '0 10px 30px rgba(0,0,0,0.08)',
                '& .MuiMenuItem-root': { py: 1.5, px: 2, fontWeight: 500 },
              },
            }}
            transformOrigin={{ horizontal: 'right', vertical: 'top' }}
            anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
          >
            <Box sx={{ px: 2, py: 1.5 }}>
              <Typography variant="body2" fontWeight={700} color="primary.main">{user?.name ?? 'User'}</Typography>
              <Typography variant="caption" color="text.secondary">{user?.email}</Typography>
            </Box>
            <Divider sx={{ my: 0.5 }} />
            <MenuItem onClick={() => { handleMenuClose(); navigate('/cart'); }}>
              Curated Bag {cartCount > 0 && `(${cartCount})`}
            </MenuItem>
            <MenuItem onClick={handleMenuClose}>
              Wishlist
            </MenuItem>
            <Divider sx={{ my: 0.5 }} />
            <MenuItem onClick={handleLogout} sx={{ color: 'error.main', fontWeight: 600 }}>
              Sign Out
            </MenuItem>
          </Menu>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

