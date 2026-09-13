import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { Product } from '../../models/product';
import { ProductService } from '../../services/product.service';

@Component({
  imports: [CommonModule, RouterLink],
  selector: 'app-product-list',
  styleUrl: './product-list.scss',
  templateUrl: './product-list.html',
})
export class ProductList implements OnInit {
  products = signal<Product[]>([]);
  loading = signal(true);
  error = signal<string | null>(null);
  deletingId = signal<number | null>(null);

  constructor(private productService: ProductService) {}

  ngOnInit(): void {
    this.productService.getAll().subscribe({
      next: (products) => {
        this.products.set(products);
        this.loading.set(false);
      },
      error: (err) => {
        this.error.set('Failed to load products. Is the API running?');
        this.loading.set(false);
        console.error(err);
      },
    });
  }

  deleteProduct(product: Product): void {
    if (!confirm(`Delete "${product.name}"? This cannot be undone.`)) {
      return;
    }

    this.deletingId.set(product.id);

    this.productService.delete(product.id).subscribe({
      next: () => {
        this.products.update((products) => products.filter((p) => p.id !== product.id));
        this.deletingId.set(null);
      },
      error: (err) => {
        this.error.set('Failed to delete product.');
        this.deletingId.set(null);
        console.error(err);
      },
    });
  }
}
