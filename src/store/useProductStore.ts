import { create } from 'zustand';
import type { Product, SearchFilters } from '../types';
import { DEFAULT_FILTERS } from '../types';

interface ProductState {
  // All products (fetched or dummy)
  allProducts: Product[];
  // Products after applying filters
  filteredProducts: Product[];
  // Current filter state
  filters: SearchFilters;
  // Loading / error state
  isLoading: boolean;
  error: string | null;

  // Actions
  setAllProducts: (products: Product[]) => void;
  setFilters: (filters: Partial<SearchFilters>) => void;
  resetFilters: () => void;
  applyFilters: () => void;
}

export const useProductStore = create<ProductState>()((set, get) => ({
  allProducts: [],
  filteredProducts: [],
  filters: DEFAULT_FILTERS,
  isLoading: false,
  error: null,

  setAllProducts: (products) => {
    set({ allProducts: products });
    // Immediately apply current filters to the new set
    applyFiltersInternal(get, set, products);
  },

  setFilters: (partial) => {
    const newFilters = { ...get().filters, ...partial };
    set({ filters: newFilters });
    applyFiltersInternal(get, set, get().allProducts, newFilters);
  },

  resetFilters: () => {
    set({ filters: DEFAULT_FILTERS });
    set({ filteredProducts: get().allProducts });
  },

  applyFilters: () => {
    applyFiltersInternal(get, set, get().allProducts);
  },
}));

// ─── Core filter/sort logic (runs client-side on dummy / cached data) ─────────
function applyFiltersInternal(
  get: () => ProductState,
  set: (state: Partial<ProductState>) => void,
  products: Product[],
  filters?: SearchFilters
) {
  const f = filters ?? get().filters;
  let result = [...products];

  // Full-text search across name, description, brand, sku
  if (f.key.trim()) {
    const q = f.key.toLowerCase();
    result = result.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q) ||
        (p.brand ?? '').toLowerCase().includes(q) ||
        (p.sku ?? '').toLowerCase().includes(q)
    );
  }

  // Category filter
  if (f.category) {
    result = result.filter(
      (p) => (p.category ?? '').toLowerCase() === f.category.toLowerCase()
    );
  }

  // Brand filter
  if (f.brand) {
    result = result.filter(
      (p) => (p.brand ?? '').toLowerCase() === f.brand.toLowerCase()
    );
  }

  // Price range
  if (f.minPrice !== '') {
    result = result.filter((p) => p.price >= Number(f.minPrice));
  }
  if (f.maxPrice !== '') {
    result = result.filter((p) => p.price <= Number(f.maxPrice));
  }

  // Sort
  result.sort((a, b) => {
    if (f.sortBy === 'price') {
      return f.sortOrder === 'asc' ? a.price - b.price : b.price - a.price;
    }
    const aVal = (f.sortBy === 'name' ? a.name : a.id) ?? '';
    const bVal = (f.sortBy === 'name' ? b.name : b.id) ?? '';
    const cmp = aVal.localeCompare(bVal);
    return f.sortOrder === 'asc' ? cmp : -cmp;
  });

  set({ filteredProducts: result });
}
