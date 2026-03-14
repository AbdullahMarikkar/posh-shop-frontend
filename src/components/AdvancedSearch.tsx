import {
  Box,
  Paper,
  Typography,
  Divider,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Button,
  Collapse,
  Slider,
  ToggleButton,
  ToggleButtonGroup,
  Chip,
} from '@mui/material';
import FilterListRoundedIcon from '@mui/icons-material/FilterListRounded';
import RestartAltRoundedIcon from '@mui/icons-material/RestartAltRounded';
import ArrowUpwardRoundedIcon from '@mui/icons-material/ArrowUpwardRounded';
import ArrowDownwardRoundedIcon from '@mui/icons-material/ArrowDownwardRounded';
import type { SortField, SortOrder } from '../types';
import { useProductStore } from '../store/useProductStore';

const PRICE_MAX = 2000;

interface AdvancedSearchProps {
  isOpen: boolean;
  /** Unique categories derived from the product list */
  categories: string[];
  /** Unique brands derived from the product list */
  brands: string[];
}

export const AdvancedSearch = ({ isOpen, categories, brands }: AdvancedSearchProps) => {
  const { filters, setFilters, resetFilters } = useProductStore();

  const priceRange: [number, number] = [
    filters.minPrice === '' ? 0 : Number(filters.minPrice),
    filters.maxPrice === '' ? PRICE_MAX : Number(filters.maxPrice),
  ];

  const handlePriceChange = (_: Event, value: number | number[]) => {
    const [min, max] = value as [number, number];
    setFilters({
      minPrice: min === 0 ? '' : min,
      maxPrice: max === PRICE_MAX ? '' : max,
    });
  };

  const hasActiveFilters =
    filters.category !== '' ||
    filters.brand !== '' ||
    filters.minPrice !== '' ||
    filters.maxPrice !== '' ||
    filters.sortBy !== 'name' ||
    filters.sortOrder !== 'asc';

  return (
    <Collapse in={isOpen} unmountOnExit>
      <Paper
        elevation={0}
        sx={{
          mt: 1.5,
          p: 3,
          borderRadius: 3,
          border: '1.5px solid',
          borderColor: 'divider',
          bgcolor: 'background.paper',
        }}
      >
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2.5 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <FilterListRoundedIcon sx={{ color: 'primary.main', fontSize: 20 }} />
            <Typography variant="subtitle1" fontWeight={600}>
              Advanced Filters
            </Typography>
            {hasActiveFilters && (
              <Chip label="Active" size="small" color="primary" sx={{ height: 20, fontSize: '0.7rem' }} />
            )}
          </Box>
          <Button
            size="small"
            startIcon={<RestartAltRoundedIcon />}
            onClick={resetFilters}
            sx={{ color: 'text.secondary', fontWeight: 500 }}
            disabled={!hasActiveFilters}
          >
            Reset all
          </Button>
        </Box>

        <Divider sx={{ mb: 3 }} />

        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr', md: '1fr 1fr 1fr' },
            gap: 3,
          }}
        >
          {/* Category */}
          <FormControl fullWidth size="small">
            <InputLabel>Category</InputLabel>
            <Select
              value={filters.category}
              label="Category"
              onChange={(e) => setFilters({ category: e.target.value })}
            >
              <MenuItem value="">
                <em>All Categories</em>
              </MenuItem>
              {categories.map((cat) => (
                <MenuItem key={cat} value={cat}>
                  {cat}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          {/* Brand */}
          <FormControl fullWidth size="small">
            <InputLabel>Brand</InputLabel>
            <Select
              value={filters.brand}
              label="Brand"
              onChange={(e) => setFilters({ brand: e.target.value })}
            >
              <MenuItem value="">
                <em>All Brands</em>
              </MenuItem>
              {brands.map((brand) => (
                <MenuItem key={brand} value={brand}>
                  {brand}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          {/* Sort By */}
          <FormControl fullWidth size="small">
            <InputLabel>Sort By</InputLabel>
            <Select
              value={filters.sortBy}
              label="Sort By"
              onChange={(e) => setFilters({ sortBy: e.target.value as SortField })}
            >
              <MenuItem value="name">Name</MenuItem>
              <MenuItem value="price">Price</MenuItem>
              <MenuItem value="created_at">Newest</MenuItem>
            </Select>
          </FormControl>
        </Box>

        {/* Sort Order toggle + Price Range on same row */}
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: { xs: '1fr', sm: '1fr 2fr' },
            gap: 3,
            mt: 3,
            alignItems: 'flex-start',
          }}
        >
          {/* Sort Order */}
          <Box>
            <Typography variant="caption" color="text.secondary" fontWeight={600} sx={{ mb: 1, display: 'block' }}>
              Sort Order
            </Typography>
            <ToggleButtonGroup
              value={filters.sortOrder}
              exclusive
              onChange={(_, value: SortOrder | null) => {
                if (value) setFilters({ sortOrder: value });
              }}
              size="small"
              fullWidth
            >
              <ToggleButton
                value="asc"
                sx={{
                  '&.Mui-selected': { bgcolor: 'rgba(129,166,198,0.2)', color: 'primary.main', borderColor: 'primary.light' },
                }}
              >
                <ArrowUpwardRoundedIcon fontSize="small" sx={{ mr: 0.5 }} />
                Ascending
              </ToggleButton>
              <ToggleButton
                value="desc"
                sx={{
                  '&.Mui-selected': { bgcolor: 'rgba(129,166,198,0.2)', color: 'primary.main', borderColor: 'primary.light' },
                }}
              >
                <ArrowDownwardRoundedIcon fontSize="small" sx={{ mr: 0.5 }} />
                Descending
              </ToggleButton>
            </ToggleButtonGroup>
          </Box>

          {/* Price Range */}
          <Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
              <Typography variant="caption" color="text.secondary" fontWeight={600}>
                Price Range
              </Typography>
              <Typography variant="caption" color="primary.main" fontWeight={600}>
                ${priceRange[0]} – {priceRange[1] === PRICE_MAX ? 'Any' : `$${priceRange[1]}`}
              </Typography>
            </Box>
            <Slider
              value={priceRange}
              onChange={handlePriceChange}
              min={0}
              max={PRICE_MAX}
              step={10}
              valueLabelDisplay="auto"
              valueLabelFormat={(v) => `$${v}`}
              sx={{
                color: 'primary.main',
                '& .MuiSlider-thumb': { width: 16, height: 16 },
                '& .MuiSlider-track': { height: 4 },
                '& .MuiSlider-rail': { height: 4, bgcolor: '#D2C4B4' },
              }}
            />
            {/* Manual price inputs */}
            <Box sx={{ display: 'flex', gap: 2, mt: 1.5 }}>
              <TextField
                label="Min $"
                size="small"
                type="number"
                value={filters.minPrice}
                onChange={(e) =>
                  setFilters({ minPrice: e.target.value === '' ? '' : Number(e.target.value) })
                }
                inputProps={{ min: 0, max: PRICE_MAX }}
                sx={{ flex: 1 }}
              />
              <TextField
                label="Max $"
                size="small"
                type="number"
                value={filters.maxPrice}
                onChange={(e) =>
                  setFilters({ maxPrice: e.target.value === '' ? '' : Number(e.target.value) })
                }
                inputProps={{ min: 0, max: PRICE_MAX }}
                sx={{ flex: 1 }}
              />
            </Box>
          </Box>
        </Box>
      </Paper>
    </Collapse>
  );
};
