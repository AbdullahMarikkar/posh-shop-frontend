import { useEffect, useState, useMemo } from "react";
import {
  Typography,
  Box,
  Card,
  CardMedia,
  CardContent,
  CardActions,
  Button,
  Chip,
  Alert,
} from "@mui/material";
import Grid from "@mui/material/Grid";
import { AddShoppingCartRounded } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { useCartStore } from "../store/useCartStore";
import { useProductStore } from "../store/useProductStore";
import { SearchBar } from "../components/SearchBar";
import { AdvancedSearch } from "../components/AdvancedSearch";
import type { Product } from "../types";
import { ProductService } from "../api/product.service";



// ─── Home Page ────────────────────────────────────────────────────────────────
export const Home = () => {
  const navigate = useNavigate();
  const addItem = useCartStore((state) => state.addItem);
  const { allProducts, setAllProducts, filteredProducts, filters } = useProductStore();
  const [advancedOpen, setAdvancedOpen] = useState(false);

  // Fetch products when filters or sort change
  useEffect(() => {
    const params = {
      ...(filters.key && { key: filters.key }),
      ...(filters.category && { category: filters.category }),
      ...(filters.sortBy && { sortBy: filters.sortBy }),
      ...(filters.sortOrder && { sortOrder: filters.sortOrder }),
    };

    ProductService.searchProducts(params).then(setAllProducts);
  }, [
    setAllProducts,
    filters.key,
    filters.category,
    filters.sortBy,
    filters.sortOrder,
  ]);

  // Derive unique categories and brands from ALL products for filter dropdowns
  const categories = useMemo(
    () =>
      [
        ...new Set(
          allProducts.map((p) => p.category).filter(Boolean) as string[],
        ),
      ].sort(),
    [allProducts],
  );
  const brands = useMemo(
    () =>
      [
        ...new Set(
          allProducts.map((p) => p.brand).filter(Boolean) as string[],
        ),
      ].sort(),
    [allProducts],
  );

  const handleAddToCart = (product: Product, e: React.MouseEvent) => {
    e.stopPropagation();
    addItem(product);
  };

  const noResults =
    filteredProducts.length === 0 &&
    (filters.key ||
      filters.category ||
      filters.brand ||
      filters.minPrice !== "" ||
      filters.maxPrice !== "");

  return (
    <Box>
      {/* High-Impact Lifestyle Hero */}
      <Box
        sx={{
          mb: 6,
          mt: 2,
          py: 12,
          px: 4,
          borderRadius: 4,
          position: "relative",
          overflow: "hidden",
          color: "#fff",
          textAlign: "center",
          backgroundImage:
            "linear-gradient(rgba(27, 46, 69, 0.7), rgba(27, 46, 69, 0.7)), url('https://images.unsplash.com/photo-1490481651871-ab68de25d43d?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          boxShadow: "0 20px 40px rgba(54, 79, 107, 0.15)",
        }}
      >
        <Typography
          variant="overline"
          sx={{
            letterSpacing: 3,
            fontWeight: 700,
            mb: 2,
            display: "block",
            color: "secondary.main",
          }}
        >
          THE DIGITAL ATELIER
        </Typography>
        <Typography
          variant="h1"
          component="h1"
          fontWeight="800"
          sx={{ mb: 2, textShadow: "0 2px 10px rgba(0,0,0,0.3)" }}
        >
          Curated Artifacts
          <br />
          For Discerning Collectors
        </Typography>
        <Typography
          variant="h5"
          sx={{
            opacity: 0.9,
            maxWidth: 600,
            mx: "auto",
            mb: 6,
            fontWeight: 400,
            textShadow: "0 1px 5px rgba(0,0,0,0.3)",
          }}
        >
          Discover a gallery-like experience of art, design objects, and premium
          lifestyle goods.
        </Typography>

        {/* Search bar inside hero */}
        <Box
          sx={{
            maxWidth: 680,
            mx: "auto",
            bgcolor: "rgba(255,255,255,0.1)",
            p: 1,
            borderRadius: 3,
            backdropFilter: "blur(10px)",
          }}
        >
          <SearchBar
            onAdvancedToggle={() => setAdvancedOpen((o) => !o)}
            isAdvancedOpen={advancedOpen}
          />
        </Box>
      </Box>

      {/* Advanced Search Panel */}
      <Box sx={{ maxWidth: 680, mx: "auto", mb: 5 }}>
        <AdvancedSearch
          isOpen={advancedOpen}
          categories={categories}
          brands={brands}
        />
      </Box>

      {/* Curated Portfolio Categories */}
      <Box sx={{ mb: 6 }}>
        <Grid container spacing={2}>
          {["Minimalist", "Audio", "Botanicals", "Footwear"].map((cat) => (
            <Grid key={cat} size={{ xs: 6, sm: 3 }}>
              <Box
                sx={{
                  bgcolor: "#FFFFFF",
                  border: "1px solid rgba(54, 79, 107, 0.08)",
                  borderRadius: 3,
                  py: 3,
                  textAlign: "center",
                  cursor: "pointer",
                  transition: "all 0.3s ease",
                  "&:hover": {
                    bgcolor: "secondary.main",
                    color: "white",
                    transform: "translateY(-4px)",
                    boxShadow: "0 10px 20px rgba(63, 193, 201, 0.2)",
                  },
                }}
              >
                <Typography variant="subtitle1" fontWeight={700}>
                  {cat}
                </Typography>
              </Box>
            </Grid>
          ))}
        </Grid>
      </Box>

      {/* Section Title */}
      <Box
        sx={{
          mb: 4,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-end",
        }}
      >
        <Typography variant="h3" fontWeight={800} color="primary.main">
          Trending Artifacts
        </Typography>
        <Typography
          variant="button"
          sx={{
            color: "text.secondary",
            cursor: "pointer",
            "&:hover": { color: "secondary.main" },
          }}
        >
          View all collections →
        </Typography>
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
          No artifacts matched your curation criteria. Try adjusting your
          filters.
        </Alert>
      )}

      {/* Product grid / Trending Carousel */}
      <Grid container spacing={4}>
        {filteredProducts.map((product, idx) => (
          <Grid key={product.id} size={{ xs: 12, sm: 6, md: 4, lg: 3 }}>
            <Card
              sx={{
                height: "100%",
                display: "flex",
                flexDirection: "column",
                cursor: "pointer",
              }}
              onClick={() => navigate(`/product/${product.id}`)}
              elevation={0}
            >
              <Box sx={{ position: "relative" }}>
                <CardMedia
                  component="img"
                  height="300"
                  image={product.imageUrl}
                  alt={product.name}
                  sx={{
                    objectFit: "cover",
                    transition: "transform 0.5s ease",
                    "&:hover": { transform: "scale(1.05)" },
                  }}
                />
                {idx % 3 === 0 && ( // Just applying "Atelier Pick" badge randomly for visual impact
                  <Chip
                    label="Atelier Pick"
                    size="small"
                    sx={{
                      position: "absolute",
                      top: 16,
                      left: 16,
                      bgcolor: "error.main",
                      color: "white",
                      fontWeight: 700,
                    }}
                  />
                )}
              </Box>

              <CardContent sx={{ flexGrow: 1, p: 3 }}>
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "flex-start",
                    mb: 1.5,
                  }}
                >
                  <Typography
                    variant="h5"
                    fontWeight={700}
                    sx={{
                      lineHeight: 1.3,
                      flex: 1,
                      mr: 1,
                      color: "primary.main",
                    }}
                  >
                    {product.name}
                  </Typography>
                </Box>

                <Typography
                  variant="h6"
                  color="text.secondary"
                  fontWeight="600"
                  sx={{ mb: 2 }}
                >
                  Investment: ${product.price.toFixed(2)}
                </Typography>

                <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1, mb: 2 }}>
                  {product.category && (
                    <Chip
                      label={product.category}
                      size="small"
                      sx={{
                        bgcolor: "rgba(63, 193, 201, 0.1)",
                        color: "secondary.dark",
                        fontWeight: 600,
                      }}
                    />
                  )}
                  {product.brand && (
                    <Chip
                      label={product.brand}
                      size="small"
                      variant="outlined"
                      sx={{
                        borderColor: "rgba(54, 79, 107, 0.2)",
                        color: "text.secondary",
                        fontWeight: 600,
                      }}
                    />
                  )}
                </Box>

                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{
                    overflow: "hidden",
                    display: "-webkit-box",
                    WebkitBoxOrient: "vertical",
                    WebkitLineClamp: 2,
                    lineHeight: 1.6,
                  }}
                >
                  {product.description}
                </Typography>
              </CardContent>
              <CardActions sx={{ p: 3, pt: 0 }}>
                <Button
                  fullWidth
                  variant="contained"
                  color="secondary"
                  sx={{ py: 1.5, fontSize: "1rem" }}
                  startIcon={<AddShoppingCartRounded />}
                  onClick={(e) => handleAddToCart(product, e)}
                >
                  Add to Curated Bag
                </Button>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};
