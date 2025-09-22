import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ConfirmationService, MessageService } from 'primeng/api';

import { ApiService } from 'src/app/core/services/api.service';
import { Product } from 'src/app/shared/models/product.model';
import { Category } from 'src/app/shared/models/category.model';

@Component({
  selector: 'app-product-management',
  templateUrl: './product-management.component.html',
  styleUrls: ['./product-management.component.scss'],
  providers: [ConfirmationService, MessageService],
})
export class ProductManagementComponent implements OnInit {
  products: Product[] = [];
  categories: Category[] = [];

  productForm!: FormGroup;
  selectedProduct: Product | null = null;
  displayDialog = false;
  isEditMode = false;
  loading = false;

  constructor(
    private api: ApiService,
    private fb: FormBuilder,
    private confirm: ConfirmationService,
    private toast: MessageService
  ) {}

  ngOnInit(): void {
    this.initForm();
    this.loadProducts();
    this.loadCategories();
  }

  initForm(): void {
    this.productForm = this.fb.group({
      name: ['', Validators.required],
      description: ['', Validators.required],
      price: [0, [Validators.required, Validators.min(0)]],
      stock: [0, [Validators.required, Validators.min(0)]],
      category: ['', Validators.required],
      brand: [''],
      imageUrl: ['', Validators.required],
      rating: [0, [Validators.min(0), Validators.max(5)]],
      discount: [0, [Validators.min(0), Validators.max(100)]],
    });
  }

  loadProducts(): void {
    this.loading = true;
    this.api.get<Product[]>('/products').subscribe({
      next: (products) => {
        this.products = products;
        this.loading = false;
      },
      error: () => {
        this.toast.add({ severity: 'error', summary: 'Error', detail: 'Failed to load products' });
        this.loading = false;
      },
    });
  }

  loadCategories(): void {
    this.api.get<Category[]>('/categories').subscribe({
      next: (categories) => (this.categories = categories),
      error: () => {
        this.toast.add({ severity: 'error', summary: 'Error', detail: 'Failed to load categories' });
      },
    });
  }

  showAddDialog(): void {
    this.isEditMode = false;
    this.selectedProduct = null;
    this.productForm.reset();
    this.displayDialog = true;
  }

  showEditDialog(product: Product): void {
    this.isEditMode = true;
    this.selectedProduct = product;
    this.productForm.patchValue(product);
    this.displayDialog = true;
  }

  saveProduct(): void {
    if (this.productForm.invalid) return;

    const formData = this.productForm.value;

    if (this.isEditMode && this.selectedProduct) {
      this.api.put<Product>(`/products/${this.selectedProduct.id}`, formData).subscribe({
        next: (updated) => {
          const index = this.products.findIndex((p) => p.id === updated.id);
          if (index !== -1) this.products[index] = updated;
          this.toast.add({ severity: 'success', summary: 'Updated', detail: 'Product updated successfully' });
          this.displayDialog = false;
        },
        error: () => {
          this.toast.add({ severity: 'error', summary: 'Error', detail: 'Failed to update product' });
        },
      });
    } else {
      this.api.post<Product>('/products', formData).subscribe({
        next: (created) => {
          this.products.push(created);
          this.toast.add({ severity: 'success', summary: 'Added', detail: 'Product added successfully' });
          this.displayDialog = false;
        },
        error: () => {
          this.toast.add({ severity: 'error', summary: 'Error', detail: 'Failed to add product' });
        },
      });
    }
  }

  confirmDelete(product: Product): void {
    this.confirm.confirm({
      message: `Are you sure you want to delete "${product.name}"?`,
      header: 'Confirm Delete',
      icon: 'pi pi-exclamation-triangle',
      accept: () => this.deleteProduct(product),
    });
  }

  deleteProduct(product: Product): void {
    this.api.delete(`/products/${product.id}`).subscribe({
      next: () => {
        this.products = this.products.filter((p) => p.id !== product.id);
        this.toast.add({ severity: 'success', summary: 'Deleted', detail: 'Product deleted successfully' });
      },
      error: () => {
        this.toast.add({ severity: 'error', summary: 'Error', detail: 'Failed to delete product' });
      },
    });
  }
}
