import { Typography, Box, Card, CardContent, Button, IconButton, Divider, Snackbar } from '@mui/material';
import Grid from '@mui/material/Grid';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import ShoppingCartOutlinedIcon from '@mui/icons-material/ShoppingCartOutlined';
import LocalShippingOutlinedIcon from '@mui/icons-material/LocalShippingOutlined';
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
        py={16}
        sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3 }}
      >
        <ShoppingCartOutlinedIcon sx={{ fontSize: 80, color: 'rgba(54, 79, 107, 0.2)' }} />
        <Typography variant="h4" fontWeight="800" color="primary.main">
          Your Curated Bag is Empty
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ maxWidth: 400 }}>
          You have not selected any artifacts yet. Discover our collection of premium quality goods.
        </Typography>
        <Button variant="contained" color="secondary" size="large" onClick={() => navigate('/')} sx={{ mt: 2, px: 4 }}>
          Explore Gallery
        </Button>
      </Box>
    );
  }

  return (
    <Box sx={{ pb: 8 }}>
      <Typography variant="h2" component="h1" fontWeight="800" gutterBottom color="primary.main">
        Curated Bag
        <Typography component="span" variant="h5" color="text.secondary" fontWeight={500} sx={{ ml: 2, pb: 1 }}>
          ({items.length} {items.length === 1 ? 'artifact' : 'artifacts'})
        </Typography>
      </Typography>

      <Grid container spacing={6} sx={{ mt: 2 }}>
        {/* Item list */}
        <Grid size={{ xs: 12, md: 8 }}>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
            {items.map((item) => (
              <Card
                key={item.product.id}
                elevation={0}
                sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, overflow: 'hidden', border: '1px solid rgba(54, 79, 107, 0.08)' }}
              >
                <Box
                  component="img"
                  sx={{ width: { xs: '100%', sm: 180 }, height: { xs: 200, sm: 'auto' }, objectFit: 'cover' }}
                  src={item.product.imageUrl}
                  alt={item.product.name}
                />
                <CardContent
                  sx={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between', p: 3, '&:last-child': { pb: 3 } }}
                >
                  <Box>
                    <Box display="flex" justifyContent="space-between" alignItems="flex-start" mb={1}>
                      <Typography variant="h5" fontWeight={700} sx={{ flex: 1, mr: 2, color: 'primary.main' }}>
                        {item.product.name}
                      </Typography>
                      <Typography variant="h6" fontWeight="800">
                        ${(item.product.price * item.quantity).toFixed(2)}
                      </Typography>
                    </Box>
                    <Typography variant="body2" color="text.secondary">
                      ${item.product.price.toFixed(2)} each • SKU: {item.product.sku}
                    </Typography>
                  </Box>

                  <Box display="flex" justifyContent="space-between" alignItems="center" mt={3}>
                    <Box
                      display="flex"
                      alignItems="center"
                      sx={{
                        border: '1px solid rgba(54, 79, 107, 0.15)',
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
                      <Typography sx={{ px: 2, fontWeight: 700, minWidth: 40, textAlign: 'center' }}>
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
                      sx={{ color: 'text.disabled', '&:hover': { color: 'error.main' } }}
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
          <Card elevation={0} sx={{ p: 4, position: 'sticky', top: 100, border: '1px solid rgba(54, 79, 107, 0.08)' }}>
            <Typography variant="h5" fontWeight="800" sx={{ mb: 3 }} color="primary.main">
              Order Summary
            </Typography>
            
            <Box display="flex" justifyContent="space-between" mb={2}>
              <Typography color="text.secondary" fontWeight={500}>Subtotal</Typography>
              <Typography fontWeight={700}>${total.toFixed(2)}</Typography>
            </Box>
            <Box display="flex" justifyContent="space-between" mb={3}>
              <Box display="flex" alignItems="center" gap={1}>
                 <Typography color="text.secondary" fontWeight={500}>Shipping</Typography>
              </Box>
              <Typography color="secondary.main" fontWeight={700}>Complimentary</Typography>
            </Box>

            <Box display="flex" alignItems="flex-start" gap={1.5} sx={{ bgcolor: 'rgba(63, 193, 201, 0.08)', p: 2, borderRadius: 2, mb: 3 }}>
              <LocalShippingOutlinedIcon color="secondary" />
              <Typography variant="body2" color="secondary.dark" fontWeight={600} lineHeight={1.4}>
                Your order qualifies for complimentary white-glove delivery.
              </Typography>
            </Box>

            <Divider sx={{ mb: 3 }} />
            <Box display="flex" justifyContent="space-between" mb={4}>
              <Typography variant="h5" fontWeight="800" color="primary.main">Total</Typography>
              <Typography variant="h5" fontWeight="800" color="primary.main">
                ${total.toFixed(2)}
              </Typography>
            </Box>
            <Button
              variant="contained"
              color="secondary"
              size="large"
              fullWidth
              sx={{ py: 2, fontSize: '1.05rem' }}
              onClick={() => navigate('/checkout')}
            >
              Proceed to Checkout
            </Button>
            <Button
              variant="text"
              color="primary"
              fullWidth
              sx={{ mt: 2, py: 1, fontWeight: 600 }}
              onClick={() => navigate('/')}
            >
              Continue Browsing
            </Button>
          </Card>
        </Grid>
      </Grid>

      <Snackbar
        open={snackOpen}
        autoHideDuration={2500}
        onClose={() => setSnackOpen(false)}
        message="Artifact removed from bag"
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      />
    </Box>
  );
};

