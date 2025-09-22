import { Component, OnInit } from '@angular/core';
import { Product } from 'src/app/shared/models/product.model';
import { ApiService } from 'src/app/core/services/api.service';

@Component({
  selector: 'app-product-list',
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.scss']
})
export class ProductListComponent implements OnInit {
  // All products from the API
  products: Product[] = [];

  // Filtered products shown in UI
  filteredProducts: Product[] = [];

  // UI state
  loading: boolean = true;

  // Search and filter states
  searchQuery: string = '';
  selectedCategory: string = '';

  constructor(private apiService: ApiService) {}

  ngOnInit(): void {
    this.loadProducts();
  }

  /**
   * Fetch product list from API
   */
  private loadProducts(): void {
    this.apiService.get<Product[]>('/products').subscribe({
      next: (products: Product[]) => {
        this.products = products;
        this.filteredProducts = [...products];
        this.loading = false;
      },
      error: (error) => {
        console.error('Failed to load products', error);
        this.loading = false;
      }
    });
  }

  /**
   * Calculate the discounted price of a product
   */
  calculatePrice(product: Product): number {
    if (product.discount && product.discount > 0) {
      return +(product.price * (1 - product.discount / 100)).toFixed(2);
    }
    return product.price;
  }

  /**
   * Extract unique categories from the product list
   */
  getUniqueCategories(): string[] {
    const categorySet = new Set<string>();
    this.products.forEach(product => {
      if (product.category) {
        categorySet.add(product.category);
      }
    });
    return Array.from(categorySet);
  }

  /**
   * Filter products based on search query and selected category
   */
  applyFilters(): void {
    const query = this.searchQuery.toLowerCase();

    this.filteredProducts = this.products.filter(product => {
      const matchesSearch =
        product.name.toLowerCase().includes(query) ||
        product.description.toLowerCase().includes(query);

      const matchesCategory = this.selectedCategory
        ? product.category === this.selectedCategory
        : true;

      return matchesSearch && matchesCategory;
    });
  }
}
