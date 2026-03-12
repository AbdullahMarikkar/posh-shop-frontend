import { Typography, Box, Card, CardContent, Button, IconButton, Divider, Snackbar } from '@mui/material';
import Grid from '@mui/material/Grid';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import ShoppingCartOutlinedIcon from '@mui/icons-material/ShoppingCartOutlined';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { useCartStore } from '../store/useCartStore';

export const Cart = () => {
  const navigate = useNavigate();
  const { items, updateQuantity, removeItem, getCartTotal } = useCartStore();
  const [snackOpen, setSnackOpen] = useState(false);

  const total = getCartTotal();

  const handleRemove = (id: string) => {
    removeItem(id);
    setSnackOpen(true);
  };

  if (items.length === 0) {
    return (
      <Box
        textAlign="center"
        py={12}
        sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3 }}
      >
        <ShoppingCartOutlinedIcon sx={{ fontSize: 80, color: '#D2C4B4' }} />
        <Typography variant="h4" fontWeight="bold" color="text.primary">
          Your cart is empty
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Looks like you haven't added anything yet.
        </Typography>
        <Button variant="contained" color="primary" size="large" onClick={() => navigate('/')}>
          Start Shopping
        </Button>
      </Box>
    );
  }

  return (
    <Box>
      <Typography variant="h3" component="h1" fontWeight="bold" gutterBottom color="text.primary">
        Shopping Cart
        <Typography component="span" variant="h5" color="text.secondary" fontWeight={400} sx={{ ml: 1.5 }}>
          ({items.length} {items.length === 1 ? 'item' : 'items'})
        </Typography>
      </Typography>

      <Grid container spacing={4} sx={{ mt: 1 }}>
        {/* Item list */}
        <Grid size={{ xs: 12, md: 8 }}>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            {items.map((item) => (
              <Card
                key={item.product.id}
                sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, overflow: 'hidden' }}
              >
                <Box
                  component="img"
                  sx={{ width: { xs: '100%', sm: 160 }, height: { xs: 200, sm: 'auto' }, objectFit: 'cover' }}
                  src={item.product.imageUrl}
                  alt={item.product.name}
                />
                <CardContent
                  sx={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between', p: 3 }}
                >
                  <Box>
                    <Box display="flex" justifyContent="space-between" alignItems="flex-start" mb={0.5}>
                      <Typography variant="h6" fontWeight={600} sx={{ flex: 1, mr: 2 }}>
                        {item.product.name}
                      </Typography>
                      <Typography variant="h6" fontWeight="bold" color="primary.main">
                        ${(item.product.price * item.quantity).toFixed(2)}
                      </Typography>
                    </Box>
                    <Typography variant="body2" color="text.secondary">
                      ${item.product.price.toFixed(2)} each
                    </Typography>
                  </Box>

                  <Box display="flex" justifyContent="space-between" alignItems="center" mt={2}>
                    <Box
                      display="flex"
                      alignItems="center"
                      sx={{
                        border: '1px solid #D2C4B4',
                        borderRadius: 2,
                        overflow: 'hidden',
                      }}
                    >
                      <IconButton
                        size="small"
                        sx={{ borderRadius: 0, px: 1.5 }}
                        onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                      >
                        <RemoveIcon fontSize="small" />
                      </IconButton>
                      <Typography sx={{ px: 2, fontWeight: 600, minWidth: 32, textAlign: 'center' }}>
                        {item.quantity}
                      </Typography>
                      <IconButton
                        size="small"
                        sx={{ borderRadius: 0, px: 1.5 }}
                        onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                      >
                        <AddIcon fontSize="small" />
                      </IconButton>
                    </Box>
                    <IconButton
                      sx={{ color: '#D2C4B4', '&:hover': { color: 'error.main' } }}
                      onClick={() => handleRemove(item.product.id)}
                    >
                      <DeleteOutlineIcon />
                    </IconButton>
                  </Box>
                </CardContent>
              </Card>
            ))}
          </Box>
        </Grid>

        {/* Order summary */}
        <Grid size={{ xs: 12, md: 4 }}>
          <Card sx={{ p: 3, position: 'sticky', top: 88 }}>
            <Typography variant="h5" fontWeight="bold" gutterBottom>
              Order Summary
            </Typography>
            <Divider sx={{ my: 2 }} />
            <Box display="flex" justifyContent="space-between" mb={1.5}>
              <Typography color="text.secondary">Subtotal</Typography>
              <Typography fontWeight={600}>${total.toFixed(2)}</Typography>
            </Box>
            <Box display="flex" justifyContent="space-between" mb={1.5}>
              <Typography color="text.secondary">Shipping</Typography>
              <Typography color="primary.main" fontWeight={500}>Free</Typography>
            </Box>
            <Divider sx={{ my: 2 }} />
            <Box display="flex" justifyContent="space-between" mb={3}>
              <Typography variant="h6" fontWeight="bold">Total</Typography>
              <Typography variant="h6" fontWeight="bold" color="primary.main">
                ${total.toFixed(2)}
              </Typography>
            </Box>
            <Button
              variant="contained"
              color="primary"
              size="large"
              fullWidth
              sx={{ py: 1.5 }}
              onClick={() => navigate('/checkout')}
            >
              Proceed to Checkout
            </Button>
            <Button
              variant="text"
              color="inherit"
              fullWidth
              sx={{ mt: 1, color: 'text.secondary' }}
              onClick={() => navigate('/')}
            >
              Continue Shopping
            </Button>
          </Card>
        </Grid>
      </Grid>

      <Snackbar
        open={snackOpen}
        autoHideDuration={2500}
        onClose={() => setSnackOpen(false)}
        message="Item removed from cart"
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      />
    </Box>
  );
};
