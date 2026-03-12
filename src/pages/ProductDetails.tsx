import { Typography, Box, Button, Divider, Chip } from '@mui/material';
import Grid from '@mui/material/Grid';
import { ArrowBackRounded, AddShoppingCartRounded } from '@mui/icons-material';
import { useParams, useNavigate } from 'react-router-dom';
import { useCartStore } from '../store/useCartStore';
import { dummyProducts } from './Home';

export const ProductDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const addItem = useCartStore((state) => state.addItem);

  const product = dummyProducts.find((p) => p.id === id);

  if (!product) {
    return (
      <Box textAlign="center" py={10}>
        <Typography variant="h4" gutterBottom color="text.secondary">
          Product not found
        </Typography>
        <Button variant="outlined" onClick={() => navigate('/')} startIcon={<ArrowBackRounded />}>
          Back to Products
        </Button>
      </Box>
    );
  }

  return (
    <Box>
      <Button
        variant="text"
        color="primary"
        startIcon={<ArrowBackRounded />}
        onClick={() => navigate('/')}
        sx={{ mb: 3 }}
      >
        Back to Products
      </Button>

      <Grid container spacing={6}>
        <Grid size={{ xs: 12, md: 6 }}>
          <Box
            component="img"
            src={product.imageUrl}
            alt={product.name}
            sx={{
              width: '100%',
              height: 'auto',
              borderRadius: 3,
              border: '1px solid #D2C4B4',
              boxShadow: '0 4px 24px rgba(129,116,100,0.12)',
            }}
          />
        </Grid>

        <Grid size={{ xs: 12, md: 6 }}>
          {product.category && (
            <Chip
              label={product.category}
              sx={{ mb: 2, bgcolor: 'rgba(170,205,220,0.3)', color: '#2d4a5e', fontWeight: 600 }}
            />
          )}
          <Typography variant="h3" component="h1" fontWeight="bold" gutterBottom color="text.primary">
            {product.name}
          </Typography>
          <Typography variant="h4" color="primary.main" fontWeight="bold" gutterBottom>
            ${product.price.toFixed(2)}
          </Typography>

          <Divider sx={{ my: 3 }} />

          <Typography
            variant="body1"
            color="text.secondary"
            sx={{ fontSize: '1.05rem', lineHeight: 1.8 }}
            paragraph
          >
            {product.description}
          </Typography>

          <Box sx={{ mt: 4, display: 'flex', flexDirection: 'column', gap: 2 }}>
            <Button
              variant="contained"
              color="primary"
              size="large"
              fullWidth
              startIcon={<AddShoppingCartRounded />}
              sx={{ py: 1.8, fontSize: '1.05rem' }}
              onClick={() => addItem(product)}
            >
              Add to Cart
            </Button>
            <Button
              variant="outlined"
              color="primary"
              size="large"
              fullWidth
              sx={{ py: 1.8 }}
              onClick={() => { addItem(product); navigate('/cart'); }}
            >
              Buy Now
            </Button>
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
};
