import { Typography, Box, Button, Divider, Chip } from "@mui/material";
import Grid from "@mui/material/Grid";
import { useParams, useNavigate } from "react-router-dom";
import { useCartStore } from "../store/useCartStore";
import { dummyProducts } from "./Home";

export const ProductDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const addItem = useCartStore((state) => state.addItem);

  const product = dummyProducts.find((p) => p.id === id);

  if (!product) {
    return (
      <Box textAlign="center" py={10}>
        <Typography variant="h4">Product not found</Typography>
        <Button onClick={() => navigate("/")} sx={{ mt: 2 }}>
          Back to Home
        </Button>
      </Box>
    );
  }

  return (
    <Box sx={{ mt: 4 }}>
      <Grid container spacing={6}>
        <Grid size={{ xs: 12, md: 6 }}>
          <Box
            component="img"
            src={product.imageUrl}
            alt={product.name}
            sx={{
              width: "100%",
              height: "auto",
              borderRadius: 2,
              boxShadow: 3,
            }}
          />
        </Grid>
        <Grid size={{ xs: 12, md: 6 }}>
          <Typography
            variant="h3"
            component="h1"
            fontWeight="bold"
            gutterBottom
          >
            {product.name}
          </Typography>
          <Typography
            variant="h4"
            color="primary.main"
            fontWeight="bold"
            gutterBottom
          >
            ${product.price.toFixed(2)}
          </Typography>

          {product.category && <Chip label={product.category} sx={{ mb: 3 }} />}

          <Divider sx={{ my: 3 }} />

          <Typography
            variant="body1"
            color="text.secondary"
            paragraph
            sx={{ fontSize: "1.1rem", lineHeight: 1.8 }}
          >
            {product.description}
          </Typography>

          <Box sx={{ mt: 4 }}>
            <Button
              variant="contained"
              color="primary"
              size="large"
              fullWidth
              sx={{ py: 2, fontSize: "1.1rem" }}
              onClick={() => addItem(product)}
            >
              Add to Cart
            </Button>
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
};
