import React, { useState } from 'react';
import { Typography, Box, Card, TextField, Button, Divider, Alert } from '@mui/material';
import Grid from '@mui/material/Grid';
import { CheckCircleRounded, ArrowBackRounded } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useCartStore } from '../store/useCartStore';

export const Checkout = () => {
  const navigate = useNavigate();
  const { items, getCartTotal, clearCart } = useCartStore();
  const total = getCartTotal();

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSuccess(true);
      clearCart();
    }, 1500);
  };

  if (isSuccess) {
    return (
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          py: 12,
          gap: 3,
          textAlign: 'center',
        }}
      >
        <CheckCircleRounded sx={{ fontSize: 80, color: 'primary.main' }} />
        <Typography variant="h4" fontWeight="bold" color="text.primary">
          Order Placed Successfully!
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ maxWidth: 400 }}>
          Thank you for shopping with Posh Shop. You will receive a confirmation email shortly.
        </Typography>
        <Button variant="contained" color="primary" size="large" onClick={() => navigate('/')}>
          Continue Shopping
        </Button>
      </Box>
    );
  }

  if (items.length === 0) {
    return (
      <Box textAlign="center" py={10}>
        <Typography variant="h5" gutterBottom>Your cart is empty.</Typography>
        <Button variant="contained" color="primary" onClick={() => navigate('/')} sx={{ mt: 2 }}>
          Return to Store
        </Button>
      </Box>
    );
  }

  return (
    <Box>
      <Button
        variant="text"
        startIcon={<ArrowBackRounded />}
        onClick={() => navigate('/cart')}
        sx={{ mb: 3, color: 'text.secondary' }}
      >
        Back to Cart
      </Button>
      <Typography variant="h3" component="h1" fontWeight="bold" gutterBottom color="text.primary">
        Checkout
      </Typography>

      <Grid container spacing={4} sx={{ mt: 1 }}>
        {/* Form */}
        <Grid size={{ xs: 12, md: 8 }}>
          <Card sx={{ p: { xs: 3, md: 4 } }}>
            <Typography variant="h5" fontWeight="bold" gutterBottom>
              Shipping Details
            </Typography>
            <Divider sx={{ mb: 3 }} />
            <form onSubmit={handleSubmit}>
              <Grid container spacing={2.5}>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <TextField required fullWidth label="First Name" autoComplete="given-name" />
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <TextField required fullWidth label="Last Name" autoComplete="family-name" />
                </Grid>
                <Grid size={{ xs: 12 }}>
                  <TextField required fullWidth label="Email Address" type="email" autoComplete="email" />
                </Grid>
                <Grid size={{ xs: 12 }}>
                  <TextField required fullWidth label="Delivery Address" autoComplete="street-address" />
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <TextField required fullWidth label="City" autoComplete="address-level2" />
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <TextField required fullWidth label="Postal Code" autoComplete="postal-code" />
                </Grid>
              </Grid>

              <Typography variant="h5" fontWeight="bold" sx={{ mt: 4, mb: 1 }}>
                Payment Details
              </Typography>
              <Divider sx={{ mb: 3 }} />

              <Alert severity="info" sx={{ mb: 3, borderRadius: 2 }}>
                Payment processing is handled securely by our payment service.
              </Alert>

              <Grid container spacing={2.5}>
                <Grid size={{ xs: 12 }}>
                  <TextField required fullWidth label="Cardholder Name" autoComplete="cc-name" />
                </Grid>
                <Grid size={{ xs: 12 }}>
                  <TextField required fullWidth label="Card Number" placeholder="**** **** **** ****" autoComplete="cc-number" />
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <TextField required fullWidth label="Expiry (MM/YY)" autoComplete="cc-exp" />
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <TextField required fullWidth label="CVC" autoComplete="cc-csc" />
                </Grid>
              </Grid>

              <Button
                type="submit"
                variant="contained"
                color="primary"
                size="large"
                fullWidth
                disabled={isSubmitting}
                sx={{ mt: 4, py: 1.8, fontSize: '1.05rem' }}
              >
                {isSubmitting ? 'Processing Payment…' : `Pay $${total.toFixed(2)}`}
              </Button>
            </form>
          </Card>
        </Grid>

        {/* Summary */}
        <Grid size={{ xs: 12, md: 4 }}>
          <Card sx={{ p: 3, position: 'sticky', top: 88 }}>
            <Typography variant="h5" fontWeight="bold" gutterBottom>
              Order Summary
            </Typography>
            <Divider sx={{ mb: 2 }} />

            <Box sx={{ maxHeight: 300, overflow: 'auto', mb: 2 }}>
              {items.map((item) => (
                <Box key={item.product.id} display="flex" alignItems="center" mb={2} gap={1.5}>
                  <Box
                    component="img"
                    src={item.product.imageUrl}
                    alt={item.product.name}
                    sx={{ width: 56, height: 56, objectFit: 'cover', borderRadius: 1.5 }}
                  />
                  <Box flex={1}>
                    <Typography variant="body2" fontWeight={600} noWrap>{item.product.name}</Typography>
                    <Typography variant="caption" color="text.secondary">Qty: {item.quantity}</Typography>
                  </Box>
                  <Typography variant="body2" fontWeight="bold">
                    ${(item.product.price * item.quantity).toFixed(2)}
                  </Typography>
                </Box>
              ))}
            </Box>

            <Divider sx={{ my: 2 }} />
            <Box display="flex" justifyContent="space-between" mb={1}>
              <Typography color="text.secondary">Subtotal</Typography>
              <Typography fontWeight={600}>${total.toFixed(2)}</Typography>
            </Box>
            <Box display="flex" justifyContent="space-between" mb={2}>
              <Typography color="text.secondary">Shipping</Typography>
              <Typography color="primary.main" fontWeight={500}>Free</Typography>
            </Box>
            <Divider sx={{ my: 2 }} />
            <Box display="flex" justifyContent="space-between">
              <Typography variant="h6" fontWeight="bold">Total</Typography>
              <Typography variant="h6" fontWeight="bold" color="primary.main">
                ${total.toFixed(2)}
              </Typography>
            </Box>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};
