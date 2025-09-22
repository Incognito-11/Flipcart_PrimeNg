import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Product } from 'src/app/shared/models/product.model';
import { ApiService } from 'src/app/core/services/api.service';
import { CartService } from 'src/app/core/services/cart.service';

@Component({
  selector: 'app-product-details',
  templateUrl: './products-details.component.html',
  styleUrls: ['./products-details.component.scss']
})
export class ProductsDetailsComponent implements OnInit {
  product: Product | null = null;    // Product to display
  loading: boolean = true;          // Loading state
  quantity: number = 1;             // Selected quantity

  constructor(
    private route: ActivatedRoute,
    private apiService: ApiService,
    private cartService:CartService
  ) {}

  ngOnInit(): void {
    const productId = this.route.snapshot.paramMap.get('id');
    if (productId) {
      this.loadProduct(productId);
    }
  }

  /**
   * Load product details by ID
   */
  private loadProduct(id: string): void {
    this.apiService.get<Product>(`/products/${id}`).subscribe({
      next: (product: Product) => {
        this.product = product;
        this.loading = false;
      },
      error: (error) => {
        console.error('Failed to load product', error);
        this.loading = false;
      }
    });
  }

  /**
   * Calculate discounted price (if any)
   */
  calculatePrice(): number {
    if (!this.product) return 0;

    const { price, discount = 0 } = this.product;
    const finalPrice = price * (1 - discount / 100);
    return +finalPrice.toFixed(2);
  }

  /**
   * Increase quantity
   */
  increaseQuantity(): void {
    this.quantity++;
  }

  /**
   * Decrease quantity (minimum 1)
   */
  decreaseQuantity(): void {
    if (this.quantity > 1) {
      this.quantity--;
    }
  }
  addToCart(): void {
    if (this.product) {
      this.cartService.addToCart(this.product, this.quantity);
      alert(`${this.quantity} x ${this.product.name} added to cart!`);
    }
  }
}
