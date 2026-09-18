import { Component, OnInit, computed, signal } from '@angular/core';
import { CurrencyPipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { Product } from '../../models/product';
import { ProductService } from '../../services/product.service';

type SortColumn = 'name' | 'quantityInStock' | 'price';
type SortDirection = 'asc' | 'desc';

const LOW_STOCK_THRESHOLD = 10;

@Component({
  imports: [CurrencyPipe, RouterLink],
  selector: 'app-product-list',
  styleUrl: './product-list.scss',
  templateUrl: './product-list.html',
})
export class ProductList implements OnInit {
  products = signal<Product[]>([]);
  loading = signal(true);
  error = signal<string | null>(null);
  deletingId = signal<number | null>(null);
  searchTerm = signal('');
  sortColumn = signal<SortColumn>('name');
  sortDirection = signal<SortDirection>('asc');

  readonly displayedProducts = computed(() => {
    const term = this.searchTerm().trim().toLowerCase();
    const column = this.sortColumn();
    const direction = this.sortDirection();

    let list = this.products();
    if (term) {
      list = list.filter(
        (p) => p.name.toLowerCase().includes(term) || p.sku.toLowerCase().includes(term),
      );
    }

    return [...list].sort((a, b) => {
      const result =
        typeof a[column] === 'string'
          ? (a[column] as string).localeCompare(b[column] as string)
          : (a[column] as number) - (b[column] as number);
      return direction === 'asc' ? result : -result;
    });
  });

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

  onSearch(value: string): void {
    this.searchTerm.set(value);
  }

  setSort(column: SortColumn): void {
    if (this.sortColumn() === column) {
      this.sortDirection.update((d) => (d === 'asc' ? 'desc' : 'asc'));
    } else {
      this.sortColumn.set(column);
      this.sortDirection.set('asc');
    }
  }

  sortIndicator(column: SortColumn): string {
    if (this.sortColumn() !== column) {
      return '';
    }
    return this.sortDirection() === 'asc' ? '▲' : '▼';
  }

  isLowStock(product: Product): boolean {
    return product.quantityInStock <= LOW_STOCK_THRESHOLD;
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
