import { useEffect, useState, useMemo } from 'react';
import {
  Typography, Box, Card, CardMedia, CardContent, CardActions,
  Button, Chip, Alert,
} from '@mui/material';
import Grid from '@mui/material/Grid';
import { AddShoppingCartRounded, StorefrontRounded } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useCartStore } from '../store/useCartStore';
import { useProductStore } from '../store/useProductStore';
import { SearchBar } from '../components/SearchBar';
import { AdvancedSearch } from '../components/AdvancedSearch';
import type { Product } from '../types';

// ─── Dummy data (replace with ProductService.searchProducts() call) ───────────
export const dummyProducts: Product[] = [
  {
    id: '1',
    name: 'Classic White T-Shirt',
    description: 'Everyday classic white tee made with 100% premium cotton. Perfectly comfortable all day.',
    price: 25.0,
    imageUrl: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    category: 'Clothing',
    brand: 'BasicWear',
    sku: 'BW-WT-001',
  },
  {
    id: '2',
    name: 'Denim Jacket',
    description: 'Vintage style denim jacket perfect for any season. Classic styling, durable construction.',
    price: 89.99,
    imageUrl: 'https://images.unsplash.com/photo-1576995853123-5a10305d93c0?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    category: 'Clothing',
    brand: 'UrbanEdge',
    sku: 'UE-DJ-002',
  },
  {
    id: '3',
    name: 'Leather Sneakers',
    description: 'Comfortable and stylish low-top leather sneakers. Ideal for casual and daily wear.',
    price: 120.0,
    imageUrl: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    category: 'Footwear',
    brand: 'StepStyle',
    sku: 'SS-LS-003',
  },
  {
    id: '4',
    name: 'Minimalist Watch',
    description: 'Elegant minimalist watch with a leather strap — perfect for any occasion.',
    price: 150.0,
    imageUrl: 'https://images.unsplash.com/photo-1524805444758-089113d48a6d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    category: 'Accessories',
    brand: 'TimeCraft',
    sku: 'TC-MW-004',
  },
  {
    id: '5',
    name: 'Canvas Backpack',
    description: 'Spacious and durable canvas backpack with multiple compartments. Perfect for work or travel.',
    price: 65.0,
    imageUrl: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    category: 'Accessories',
    brand: 'UrbanEdge',
    sku: 'UE-BP-005',
  },
  {
    id: '6',
    name: 'Running Shoes',
    description: 'High-performance running shoes with superior cushioning and breathable mesh upper.',
    price: 95.0,
    imageUrl: 'https://images.unsplash.com/photo-1460353581641-37baddab0fa2?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    category: 'Footwear',
    brand: 'StepStyle',
    sku: 'SS-RS-006',
  },
  {
    id: '7',
    name: 'Slim Fit Chinos',
    description: 'Versatile slim fit chinos crafted from stretch cotton blend. Smart casual essential.',
    price: 55.0,
    imageUrl: 'https://images.unsplash.com/photo-1473966968600-fa801b869a1a?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    category: 'Clothing',
    brand: 'BasicWear',
    sku: 'BW-CH-007',
  },
  {
    id: '8',
    name: 'Leather Wallet',
    description: 'Slim genuine leather bifold wallet with RFID blocking. Fits all your essentials.',
    price: 40.0,
    imageUrl: 'https://images.unsplash.com/photo-1627123424574-724758594e93?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    category: 'Accessories',
    brand: 'TimeCraft',
    sku: 'TC-LW-008',
  },
];

// ─── Home Page ────────────────────────────────────────────────────────────────
export const Home = () => {
  const navigate = useNavigate();
  const addItem = useCartStore((state) => state.addItem);
  const { setAllProducts, filteredProducts, filters } = useProductStore();
  const [advancedOpen, setAdvancedOpen] = useState(false);

  // Seed the product store on mount
  useEffect(() => {
    setAllProducts(dummyProducts);
    // TODO: Replace with: ProductService.searchProducts({}).then(setAllProducts)
  }, [setAllProducts]);

  // Derive unique categories and brands from ALL products for filter dropdowns
  const categories = useMemo(
    () => [...new Set(dummyProducts.map((p) => p.category).filter(Boolean) as string[])].sort(),
    []
  );
  const brands = useMemo(
    () => [...new Set(dummyProducts.map((p) => p.brand).filter(Boolean) as string[])].sort(),
    []
  );

  const handleAddToCart = (product: Product, e: React.MouseEvent) => {
    e.stopPropagation();
    addItem(product);
  };

  const noResults =
    filteredProducts.length === 0 &&
    (filters.key || filters.category || filters.brand || filters.minPrice !== '' || filters.maxPrice !== '');

  return (
    <Box>
      {/* Hero */}
      <Box
        sx={{
          mb: 4,
          py: 5,
          px: 4,
          borderRadius: 4,
          background: 'linear-gradient(135deg, #81A6C6 0%, #AACDDC 100%)',
          color: '#fff',
          textAlign: 'center',
        }}
      >
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 1.5, mb: 1 }}>
          <StorefrontRounded sx={{ fontSize: 36, opacity: 0.9 }} />
          <Typography variant="h2" component="h1" fontWeight="bold">
            Posh Shop
          </Typography>
        </Box>
        <Typography variant="h6" sx={{ opacity: 0.9, maxWidth: 480, mx: 'auto', mb: 4 }}>
          Discover our curated collection of premium quality products.
        </Typography>

        {/* Search bar embedded in hero */}
        <Box sx={{ maxWidth: 680, mx: 'auto' }}>
          <SearchBar
            onAdvancedToggle={() => setAdvancedOpen((o) => !o)}
            isAdvancedOpen={advancedOpen}
          />
        </Box>
      </Box>

      {/* Advanced Search Panel */}
      <Box sx={{ maxWidth: 680, mx: 'auto', mb: 3 }}>
        <AdvancedSearch
          isOpen={advancedOpen}
          categories={categories}
          brands={brands}
        />
      </Box>

      {/* No results state */}
      {noResults && (
        <Alert
          severity="info"
          sx={{ mb: 3, borderRadius: 3 }}
          action={
            <Button
              size="small"
              color="inherit"
              onClick={() => useProductStore.getState().resetFilters()}
            >
              Clear Filters
            </Button>
          }
        >
          No products matched your search. Try adjusting your filters.
        </Alert>
      )}

      {/* Product grid */}
      <Grid container spacing={3}>
        {filteredProducts.map((product) => (
          <Grid key={product.id} size={{ xs: 12, sm: 6, md: 4, lg: 3 }}>
            <Card
              sx={{
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                cursor: 'pointer',
                '&:hover': {
                  transform: 'translateY(-5px)',
                  boxShadow: '0 8px 24px rgba(129,116,100,0.15)',
                },
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
                  <Typography
                    variant="h6"
                    color="primary.main"
                    fontWeight="bold"
                    sx={{ whiteSpace: 'nowrap' }}
                  >
                    ${product.price.toFixed(2)}
                  </Typography>
                </Box>

                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.75, mb: 1.5 }}>
                  {product.category && (
                    <Chip
                      label={product.category}
                      size="small"
                      sx={{ bgcolor: 'rgba(170,205,220,0.3)', color: '#2d4a5e', fontWeight: 500 }}
                    />
                  )}
                  {product.brand && (
                    <Chip
                      label={product.brand}
                      size="small"
                      variant="outlined"
                      sx={{ borderColor: '#D2C4B4', color: 'text.secondary', fontWeight: 500 }}
                    />
                  )}
                </Box>

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
