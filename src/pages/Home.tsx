import { Typography, Box, Card, CardMedia, CardContent, CardActions, Button, Chip } from '@mui/material';
import Grid from '@mui/material/Grid';
import { AddShoppingCartRounded } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useCartStore } from '../store/useCartStore';
import type { Product } from '../types';

export const dummyProducts: Product[] = [
  {
    id: '1',
    name: 'Classic White T-Shirt',
    description: 'Everyday classic white tee made with 100% premium cotton. Perfectly comfortable all day.',
    price: 25.0,
    imageUrl: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    category: 'Clothing',
  },
  {
    id: '2',
    name: 'Denim Jacket',
    description: 'Vintage style denim jacket perfect for any season. Classic styling, durable construction.',
    price: 89.99,
    imageUrl: 'https://images.unsplash.com/photo-1576995853123-5a10305d93c0?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    category: 'Clothing',
  },
  {
    id: '3',
    name: 'Leather Sneakers',
    description: 'Comfortable and stylish low-top leather sneakers. Ideal for casual and daily wear.',
    price: 120.0,
    imageUrl: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    category: 'Footwear',
  },
  {
    id: '4',
    name: 'Minimalist Watch',
    description: 'Elegant minimalist watch with a leather strap — perfect for any occasion.',
    price: 150.0,
    imageUrl: 'https://images.unsplash.com/photo-1524805444758-089113d48a6d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    category: 'Accessories',
  },
];

export const Home = () => {
  const navigate = useNavigate();
  const addItem = useCartStore((state) => state.addItem);

  const handleAddToCart = (product: Product, e: React.MouseEvent) => {
    e.stopPropagation();
    addItem(product);
  };

  return (
    <Box>
      {/* Hero */}
      <Box
        sx={{
          mb: 6,
          py: 6,
          px: 4,
          borderRadius: 4,
          background: 'linear-gradient(135deg, #81A6C6 0%, #AACDDC 100%)',
          color: '#fff',
          textAlign: 'center',
        }}
      >
        <Typography variant="h2" component="h1" fontWeight="bold" gutterBottom>
          New Arrivals
        </Typography>
        <Typography variant="h6" sx={{ opacity: 0.9, maxWidth: 480, mx: 'auto' }}>
          Discover our latest collection of premium quality products.
        </Typography>
      </Box>

      {/* Product grid */}
      <Grid container spacing={3}>
        {dummyProducts.map((product) => (
          <Grid key={product.id} size={{ xs: 12, sm: 6, md: 4, lg: 3 }}>
            <Card
              sx={{
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                cursor: 'pointer',
                '&:hover': { transform: 'translateY(-5px)', boxShadow: '0 8px 24px rgba(129,116,100,0.15)' },
              }}
              onClick={() => navigate(`/product/${product.id}`)}
            >
              <CardMedia
                component="img"
                height="220"
                image={product.imageUrl}
                alt={product.name}
                sx={{ objectFit: 'cover' }}
              />
              <CardContent sx={{ flexGrow: 1, pb: 1 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1 }}>
                  <Typography variant="h6" fontWeight={600} sx={{ lineHeight: 1.3, flex: 1, mr: 1 }}>
                    {product.name}
                  </Typography>
                  <Typography variant="h6" color="primary.main" fontWeight="bold" sx={{ whiteSpace: 'nowrap' }}>
                    ${product.price.toFixed(2)}
                  </Typography>
                </Box>
                {product.category && (
                  <Chip
                    label={product.category}
                    size="small"
                    sx={{ mb: 1.5, bgcolor: 'rgba(170,205,220,0.3)', color: '#2d4a5e', fontWeight: 500 }}
                  />
                )}
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{
                    overflow: 'hidden',
                    display: '-webkit-box',
                    WebkitBoxOrient: 'vertical',
                    WebkitLineClamp: 2,
                  }}
                >
                  {product.description}
                </Typography>
              </CardContent>
              <CardActions sx={{ p: 2, pt: 0 }}>
                <Button
                  fullWidth
                  variant="contained"
                  color="primary"
                  startIcon={<AddShoppingCartRounded />}
                  onClick={(e) => handleAddToCart(product, e)}
                >
                  Add to Cart
                </Button>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};
