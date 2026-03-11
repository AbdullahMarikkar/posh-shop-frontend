import React, { useState } from "react";
import {
  Typography,
  Box,
  Card,
  TextField,
  Button,
  Divider,
  Alert,
} from "@mui/material";
import Grid from "@mui/material/Grid";
import { useNavigate } from "react-router-dom";
import { useCartStore } from "../store/useCartStore";

export const Checkout = () => {
  const navigate = useNavigate();
  const { items, getCartTotal, clearCart } = useCartStore();
  const total = getCartTotal();

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSuccess(true);
      clearCart();
    }, 1500);
  };

  if (isSuccess) {
    return (
      <Box textAlign="center" py={10}>
        <Alert severity="success" sx={{ mb: 4, display: "inline-flex" }}>
          Order placed successfully!
        </Alert>
        <Typography variant="h4" gutterBottom>
          Thank you for your purchase.
        </Typography>
        <Typography variant="body1" color="text.secondary" mb={4}>
          You will receive an email confirmation shortly.
        </Typography>
        <Button
          variant="contained"
          color="primary"
          onClick={() => navigate("/")}
        >
          Return to Store
        </Button>
      </Box>
    );
  }

  if (items.length === 0) {
    return (
      <Box textAlign="center" py={10}>
        <Typography variant="h5" gutterBottom>
          You have no items in your order.
        </Typography>
        <Button
          variant="contained"
          color="primary"
          onClick={() => navigate("/")}
          sx={{ mt: 2 }}
        >
          Return to Store
        </Button>
      </Box>
    );
  }

  return (
    <Box>
      <Typography variant="h3" component="h1" gutterBottom fontWeight="bold">
        Checkout
      </Typography>

      <Grid container spacing={4} sx={{ mt: 2 }}>
        <Grid size={{ xs: 12, md: 8 }}>
          <Card sx={{ p: 4 }}>
            <Typography variant="h5" fontWeight="bold" gutterBottom>
              Shipping Information
            </Typography>
            <Divider sx={{ mb: 3 }} />
            <form onSubmit={handleSubmit}>
              <Grid container spacing={3}>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <TextField required fullWidth label="First Name" />
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <TextField required fullWidth label="Last Name" />
                </Grid>
                <Grid size={{ xs: 12 }}>
                  <TextField
                    required
                    fullWidth
                    label="Email Address"
                    type="email"
                  />
                </Grid>
                <Grid size={{ xs: 12 }}>
                  <TextField required fullWidth label="Address Line 1" />
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <TextField required fullWidth label="City" />
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <TextField required fullWidth label="Zip / Postal Code" />
                </Grid>
                <Grid size={{ xs: 12 }}>
                  <TextField
                    required
                    fullWidth
                    label="Card Number"
                    placeholder="**** **** **** ****"
                  />
                </Grid>
                <Grid size={{ xs: 6, sm: 3 }}>
                  <TextField required fullWidth label="MM/YY" />
                </Grid>
                <Grid size={{ xs: 6, sm: 3 }}>
                  <TextField required fullWidth label="CVC" />
                </Grid>
              </Grid>

              <Box mt={4} display="flex" justifyContent="space-between">
                <Button variant="outlined" onClick={() => navigate("/cart")}>
                  Back to Cart
                </Button>
                <Button
                  type="submit"
                  variant="contained"
                  color="primary"
                  size="large"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Processing..." : `Pay $${total.toFixed(2)}`}
                </Button>
              </Box>
            </form>
          </Card>
        </Grid>

        <Grid size={{ xs: 12, md: 4 }}>
          <Card sx={{ p: 3, position: "sticky", top: 20 }}>
            <Typography variant="h5" fontWeight="bold" gutterBottom>
              Order Summary
            </Typography>
            <Divider sx={{ mb: 2 }} />

            <Box mb={3} sx={{ maxHeight: 300, overflow: "auto" }}>
              {items.map((item) => (
                <Box key={item.product.id} display="flex" mb={2}>
                  <Box
                    component="img"
                    src={item.product.imageUrl}
                    sx={{
                      width: 60,
                      height: 60,
                      objectFit: "cover",
                      borderRadius: 1,
                      mr: 2,
                    }}
                  />
                  <Box flex={1}>
                    <Typography variant="body2" fontWeight="bold">
                      {item.product.name}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Qty: {item.quantity}
                    </Typography>
                  </Box>
                  <Typography variant="body2" fontWeight="bold">
                    ${(item.product.price * item.quantity).toFixed(2)}
                  </Typography>
                </Box>
              ))}
            </Box>

            <Divider sx={{ my: 2 }} />
            <Box display="flex" justifyContent="space-between" mb={1}>
              <Typography variant="body1">Subtotal</Typography>
              <Typography variant="body1" fontWeight="bold">
                ${total.toFixed(2)}
              </Typography>
            </Box>
            <Box display="flex" justifyContent="space-between" mb={2}>
              <Typography variant="body1">Shipping</Typography>
              <Typography variant="body1">Free</Typography>
            </Box>
            <Divider sx={{ my: 2 }} />
            <Box display="flex" justifyContent="space-between">
              <Typography variant="h6" fontWeight="bold">
                Total
              </Typography>
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
