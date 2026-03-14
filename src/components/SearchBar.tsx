import { useState, useRef, useEffect } from 'react';
import {
  Box,
  InputBase,
  IconButton,
  Paper,
  CircularProgress,
  Typography,
  Divider,
  Chip,
} from '@mui/material';
import SearchRoundedIcon from '@mui/icons-material/SearchRounded';
import CloseRoundedIcon from '@mui/icons-material/CloseRounded';
import TuneRoundedIcon from '@mui/icons-material/TuneRounded';
import { useProductStore } from '../store/useProductStore';

interface SearchBarProps {
  onAdvancedToggle?: () => void;
  isAdvancedOpen?: boolean;
}

export const SearchBar = ({ onAdvancedToggle, isAdvancedOpen }: SearchBarProps) => {
  const { filters, setFilters, filteredProducts, allProducts } = useProductStore();
  const [focused, setFocused] = useState(false);
  const [isSearching, setIsSearching] = useState(false);

  // Debounce timer ref
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;

    if (timerRef.current) clearTimeout(timerRef.current);
    setIsSearching(true);

    timerRef.current = setTimeout(() => {
      setFilters({ key: value });
      setIsSearching(false);
    }, 300);
  };

  const handleClear = () => {
    if (timerRef.current) clearTimeout(timerRef.current);
    setFilters({ key: '' });
    setIsSearching(false);
  };

  // cleanup on unmount
  useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);

  const hasActiveSearch = filters.key.trim().length > 0;
  const resultCount = filteredProducts.length;
  const totalCount = allProducts.length;
  const showResultHint = hasActiveSearch && !isSearching;

  return (
    <Box sx={{ width: '100%' }}>
      <Paper
        elevation={0}
        sx={{
          display: 'flex',
          alignItems: 'center',
          border: '1.5px solid',
          borderColor: focused ? 'primary.main' : 'divider',
          borderRadius: 3,
          px: 2,
          py: 0.5,
          bgcolor: 'background.paper',
          transition: 'border-color 0.2s, box-shadow 0.2s',
          boxShadow: focused
            ? '0 0 0 3px rgba(129,166,198,0.18)'
            : '0 1px 4px rgba(129,116,100,0.07)',
        }}
      >
        {/* Search Icon */}
        <SearchRoundedIcon sx={{ color: focused ? 'primary.main' : 'text.disabled', mr: 1, flexShrink: 0 }} />

        {/* Input */}
        <InputBase
          placeholder="Search products by name, brand, description…"
          defaultValue={filters.key}
          onChange={handleInputChange}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          fullWidth
          inputProps={{ 'aria-label': 'search products' }}
          sx={{ fontSize: '0.95rem', '& input': { py: 1 } }}
        />

        {/* Right actions */}
        {isSearching && <CircularProgress size={18} sx={{ mx: 1, color: 'primary.main', flexShrink: 0 }} />}
        {hasActiveSearch && !isSearching && (
          <IconButton size="small" onClick={handleClear} tabIndex={-1} sx={{ flexShrink: 0 }}>
            <CloseRoundedIcon fontSize="small" />
          </IconButton>
        )}

        {onAdvancedToggle && (
          <>
            <Divider orientation="vertical" flexItem sx={{ mx: 1, my: 0.5 }} />
            <IconButton
              size="small"
              onClick={onAdvancedToggle}
              sx={{
                flexShrink: 0,
                color: isAdvancedOpen ? 'primary.main' : 'text.secondary',
                bgcolor: isAdvancedOpen ? 'rgba(129,166,198,0.12)' : 'transparent',
                borderRadius: 1.5,
                '&:hover': { bgcolor: 'rgba(129,166,198,0.15)', color: 'primary.main' },
              }}
              aria-label="toggle advanced filters"
            >
              <TuneRoundedIcon fontSize="small" />
            </IconButton>
          </>
        )}
      </Paper>

      {/* Result count hint */}
      {showResultHint && (
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 1, px: 0.5 }}>
          <Typography variant="caption" color="text.secondary">
            {resultCount === 0
              ? 'No products matched'
              : `${resultCount} of ${totalCount} product${totalCount !== 1 ? 's' : ''} matched`}
          </Typography>
          {filters.category && (
            <Chip
              label={`Category: ${filters.category}`}
              size="small"
              onDelete={() => setFilters({ category: '' })}
              sx={{ height: 20, fontSize: '0.7rem' }}
            />
          )}
          {filters.brand && (
            <Chip
              label={`Brand: ${filters.brand}`}
              size="small"
              onDelete={() => setFilters({ brand: '' })}
              sx={{ height: 20, fontSize: '0.7rem' }}
            />
          )}
        </Box>
      )}
    </Box>
  );
};
