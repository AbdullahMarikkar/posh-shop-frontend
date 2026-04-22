import { Typography, Box, Button, Divider, Chip, MenuItem, Select, FormControl, InputLabel, RadioGroup, FormControlLabel, Radio } from '@mui/material';
import Grid from '@mui/material/Grid';
import { ArrowBackRounded, AutoAwesomeOutlined, LocalShippingOutlined, PolicyOutlined } from '@mui/icons-material';
import { useParams, useNavigate } from 'react-router-dom';
import { useCartStore } from '../store/useCartStore';
import { useEffect, useState } from 'react';
import { ProductService } from '../api/product.service';
import type { Product } from '../types';

export const ProductDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const addItem = useCartStore((state) => state.addItem);
  const [dimension, setDimension] = useState('standard');
  const [finish, setFinish] = useState('matte');
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      ProductService.getProductById(id)
        .then(setProduct)
        .catch(console.error)
        .finally(() => setLoading(false));
    }
  }, [id]);

  if (loading) {
    return (
      <Box textAlign="center" py={10}>
        <Typography variant="h5" color="text.secondary">Loading artifact...</Typography>
      </Box>
    );
  }

  if (!product) {
    return (
      <Box textAlign="center" py={10}>
        <Typography variant="h4" gutterBottom color="text.secondary">
          Artifact not found
        </Typography>
        <Button variant="outlined" onClick={() => navigate('/')} startIcon={<ArrowBackRounded />}>
          Back to Gallery
        </Button>
      </Box>
    );
  }

  return (
    <Box sx={{ pb: 8 }}>
      <Button
        variant="text"
        color="primary"
        startIcon={<ArrowBackRounded />}
        onClick={() => navigate('/')}
        sx={{ mb: 4, fontWeight: 700 }}
      >
        Back to Gallery
      </Button>

      <Grid container spacing={8}>
        {/* Immersive Imagery */}
        <Grid size={{ xs: 12, md: 7 }}>
          <Box
            component="img"
            src={product.imageUrl}
            alt={product.name}
            sx={{
              width: '100%',
              height: { xs: 400, md: 600, lg: 700 },
              objectFit: 'cover',
              borderRadius: 4,
              boxShadow: '0 20px 40px rgba(54, 79, 107, 0.1)',
            }}
          />
        </Grid>

        {/* Curation Details */}
        <Grid size={{ xs: 12, md: 5 }}>
          {product.category && (
            <Chip
              label={product.category.toUpperCase()}
              size="small"
              sx={{ mb: 3, bgcolor: 'rgba(63, 193, 201, 0.15)', color: 'secondary.dark', fontWeight: 700, letterSpacing: 1 }}
            />
          )}
          
          <Typography variant="h3" component="h1" fontWeight="800" sx={{ mb: 1, color: 'primary.main', letterSpacing: '-0.02em' }}>
            {product.name}
          </Typography>
          
          <Typography variant="h5" color="text.secondary" fontWeight="400" sx={{ mb: 3, opacity: 0.8 }}>
            Curated by Atelier • SKU: {product.sku}
          </Typography>

          <Typography variant="h4" color="primary.main" fontWeight="800" sx={{ mb: 4 }}>
            ${product.price.toFixed(2)}
          </Typography>

          <Typography
            variant="body1"
            color="text.secondary"
            sx={{ fontSize: '1.1rem', lineHeight: 1.8, mb: 4 }}
          >
            {product.description} This exceptional artifact has been selected for its unique design language and premium craftsmanship, adding a touch of sophistication to your collection.
          </Typography>

          <Divider sx={{ mb: 4 }} />

          {/* Options Selectors */}
          <Box sx={{ mb: 4 }}>
            <FormControl fullWidth sx={{ mb: 3 }}>
              <InputLabel id="dimension-label">Select Dimension</InputLabel>
              <Select
                labelId="dimension-label"
                value={dimension}
                label="Select Dimension"
                onChange={(e) => setDimension(e.target.value)}
                sx={{ borderRadius: 2 }}
              >
                <MenuItem value="small">Petite - Compact & Subdued</MenuItem>
                <MenuItem value="standard">Standard - Gallery Grade</MenuItem>
                <MenuItem value="large">Grand - Exhibition Scale (+$50)</MenuItem>
              </Select>
            </FormControl>

            <Typography variant="subtitle2" fontWeight={700} sx={{ mb: 1, color: 'text.primary' }}>
              Tonal Finish
            </Typography>
            <RadioGroup
              row
              value={finish}
              onChange={(e) => setFinish(e.target.value)}
              sx={{ gap: 2 }}
            >
              <FormControlLabel value="matte" control={<Radio color="primary" />} label="Matte Indigo" />
              <FormControlLabel value="gloss" control={<Radio color="primary" />} label="Luminous Gloss" />
              <FormControlLabel value="natural" control={<Radio color="primary" />} label="Raw Natural" />
            </RadioGroup>
          </Box>

          <Box sx={{ mt: 5, display: 'flex', flexDirection: 'column', gap: 2 }}>
            <Button
              variant="contained"
              color="secondary" // Accent Pink from theme
              size="large"
              fullWidth
              startIcon={<AutoAwesomeOutlined />}
              sx={{ py: 2, fontSize: '1.1rem', fontWeight: 700, borderRadius: 2 }}
              onClick={() => addItem(product)}
            >
              Add to Curated Bag
            </Button>
            <Button
              variant="outlined"
              color="primary"
              size="large"
              fullWidth
              sx={{ py: 2, fontWeight: 700, borderRadius: 2 }}
              onClick={() => { addItem(product); navigate('/cart'); }}
            >
              Acquire Immediately
            </Button>
          </Box>

          {/* Utility/Trust elements */}
          <Box sx={{ mt: 4, display: 'flex', gap: 3, opacity: 0.7 }}>
             <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
               <LocalShippingOutlined fontSize="small" />
               <Typography variant="body2" fontWeight={600}>Complimentary White-Glove Delivery</Typography>
             </Box>
             <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
               <PolicyOutlined fontSize="small" />
               <Typography variant="body2" fontWeight={600}>Authenticity Guaranteed</Typography>
             </Box>
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
};

