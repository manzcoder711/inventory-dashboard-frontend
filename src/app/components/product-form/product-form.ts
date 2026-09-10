import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ProductService } from '../../services/product.service';

@Component({
  imports: [ReactiveFormsModule],
  selector: 'app-product-form',
  styleUrl: './product-form.scss',
  templateUrl: './product-form.html',
})
export class ProductForm {
  private fb = inject(FormBuilder);
  private productService = inject(ProductService);
  private router = inject(Router);

  submitting = signal(false);
  error = signal<string | null>(null);

  form = this.fb.group({
    name: ['', [Validators.required, Validators.maxLength(200)]],
    description: ['', [Validators.maxLength(1000)]],
    sku: ['', [Validators.required, Validators.maxLength(100)]],
    price: [0, [Validators.required, Validators.min(0)]],
    quantityInStock: [0, [Validators.required, Validators.min(0)]],
    category: ['', [Validators.maxLength(100)]],
  });

  onSubmit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.submitting.set(true);
    this.error.set(null);

    const raw = this.form.getRawValue();
    this.productService
      .create({
        name: raw.name!,
        description: raw.description || null,
        sku: raw.sku!,
        price: raw.price!,
        quantityInStock: raw.quantityInStock!,
        category: raw.category || null,
      })
      .subscribe({
        next: () => {
          this.router.navigate(['/']);
        },
        error: (err) => {
          this.error.set('Failed to create product.');
          this.submitting.set(false);
          console.error(err);
        },
      });
  }
}
