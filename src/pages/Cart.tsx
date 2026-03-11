import {
  Typography,
  Box,
  Card,
  CardContent,
  Button,
  IconButton,
  Divider,
} from "@mui/material";
import Grid from "@mui/material/Grid";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import { useNavigate } from "react-router-dom";
import { useCartStore } from "../store/useCartStore";

export const Cart = () => {
  const navigate = useNavigate();
  const { items, updateQuantity, removeItem, getCartTotal } = useCartStore();

  const total = getCartTotal();

  if (items.length === 0) {
    return (
      <Box textAlign="center" py={10}>
        <Typography variant="h4" gutterBottom>
          Your Cart is Empty
        </Typography>
        <Button
          variant="contained"
          color="primary"
          onClick={() => navigate("/")}
          sx={{ mt: 2 }}
        >
          Continue Shopping
        </Button>
      </Box>
    );
  }

  return (
    <Box>
      <Typography variant="h3" component="h1" gutterBottom fontWeight="bold">
        Shopping Cart
      </Typography>

      <Grid container spacing={4} sx={{ mt: 2 }}>
        <Grid size={{ xs: 12, md: 8 }}>
          {items.map((item) => (
            <Card
              key={item.product.id}
              sx={{
                mb: 2,
                display: "flex",
                flexDirection: { xs: "column", sm: "row" },
              }}
            >
              <Box
                component="img"
                sx={{
                  width: { xs: "100%", sm: 150 },
                  height: 150,
                  objectFit: "cover",
                }}
                src={item.product.imageUrl}
                alt={item.product.name}
              />
              <CardContent
                sx={{
                  flex: 1,
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "space-between",
                }}
              >
                <Box display="flex" justifyContent="space-between">
                  <Typography variant="h6" fontWeight="bold">
                    {item.product.name}
                  </Typography>
                  <Typography
                    variant="h6"
                    fontWeight="bold"
                    color="primary.main"
                  >
                    ${(item.product.price * item.quantity).toFixed(2)}
                  </Typography>
                </Box>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  ${item.product.price.toFixed(2)} each
                </Typography>

                <Box
                  display="flex"
                  justifyContent="space-between"
                  alignItems="center"
                  mt={2}
                >
                  <Box
                    display="flex"
                    alignItems="center"
                    border={1}
                    borderColor="grey.300"
                    borderRadius={1}
                  >
                    <IconButton
                      size="small"
                      onClick={() =>
                        updateQuantity(item.product.id, item.quantity - 1)
                      }
                    >
                      <RemoveIcon fontSize="small" />
                    </IconButton>
                    <Typography sx={{ px: 2 }}>{item.quantity}</Typography>
                    <IconButton
                      size="small"
                      onClick={() =>
                        updateQuantity(item.product.id, item.quantity + 1)
                      }
                    >
                      <AddIcon fontSize="small" />
                    </IconButton>
                  </Box>
                  <IconButton
                    color="error"
                    onClick={() => removeItem(item.product.id)}
                  >
                    <DeleteOutlineIcon />
                  </IconButton>
                </Box>
              </CardContent>
            </Card>
          ))}
        </Grid>

        <Grid size={{ xs: 12, md: 4 }}>
          <Card sx={{ p: 3, position: "sticky", top: 20 }}>
            <Typography variant="h5" fontWeight="bold" gutterBottom>
              Order Summary
            </Typography>
            <Divider sx={{ my: 2 }} />
            <Box display="flex" justifyContent="space-between" mb={2}>
              <Typography variant="body1">Subtotal</Typography>
              <Typography variant="body1" fontWeight="bold">
                ${total.toFixed(2)}
              </Typography>
            </Box>
            <Box display="flex" justifyContent="space-between" mb={2}>
              <Typography variant="body1">Shipping</Typography>
              <Typography variant="body1">Calculated at checkout</Typography>
            </Box>
            <Divider sx={{ my: 2 }} />
            <Box display="flex" justifyContent="space-between" mb={3}>
              <Typography variant="h6" fontWeight="bold">
                Total
              </Typography>
              <Typography variant="h6" fontWeight="bold" color="primary.main">
                ${total.toFixed(2)}
              </Typography>
            </Box>
            <Button
              variant="contained"
              color="primary"
              size="large"
              fullWidth
              onClick={() => navigate("/checkout")}
            >
              Proceed to Checkout
            </Button>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};
