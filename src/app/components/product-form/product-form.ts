import { Component, OnInit, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ProductService } from '../../services/product.service';
import { ToastService } from '../../shared/toast/toast.service';

@Component({
  imports: [ReactiveFormsModule],
  selector: 'app-product-form',
  styleUrl: './product-form.scss',
  templateUrl: './product-form.html',
})
export class ProductForm implements OnInit {
  private fb = inject(FormBuilder);
  private productService = inject(ProductService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private toastService = inject(ToastService);

  productId = signal<number | null>(null);
  submitting = signal(false);
  loading = signal(false);
  error = signal<string | null>(null);
  skuError = signal<string | null>(null);

  form = this.fb.group({
    name: ['', [Validators.required, Validators.maxLength(200)]],
    description: ['', [Validators.maxLength(1000)]],
    sku: ['', [Validators.required, Validators.maxLength(100)]],
    price: [0, [Validators.required, Validators.min(0)]],
    quantityInStock: [0, [Validators.required, Validators.min(0)]],
    category: ['', [Validators.maxLength(100)]],
  });

  ngOnInit(): void {
    const idParam = this.route.snapshot.paramMap.get('id');
    if (!idParam) {
      return;
    }

    const id = Number(idParam);
    this.productId.set(id);
    this.loading.set(true);

    this.productService.getById(id).subscribe({
      next: (product) => {
        this.form.patchValue({
          name: product.name,
          description: product.description,
          sku: product.sku,
          price: product.price,
          quantityInStock: product.quantityInStock,
          category: product.category,
        });
        this.loading.set(false);
      },
      error: (err) => {
        this.error.set('Failed to load product.');
        this.loading.set(false);
        console.error(err);
      },
    });
  }

  onSubmit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.submitting.set(true);
    this.error.set(null);
    this.skuError.set(null);

    const raw = this.form.getRawValue();
    const payload = {
      name: raw.name!,
      description: raw.description || null,
      sku: raw.sku!,
      price: raw.price!,
      quantityInStock: raw.quantityInStock!,
      category: raw.category || null,
    };

    const id = this.productId();
    const request = id
      ? this.productService.update(id, { id, ...payload })
      : this.productService.create(payload);

    request.subscribe({
      next: () => {
        this.toastService.show(id ? 'Product updated' : 'Product saved');
        this.router.navigate(['/']);
      },
      error: (err) => {
        if (err.status === 409) {
          this.skuError.set(err.error?.message ?? 'That SKU is already in use.');
        } else {
          this.error.set(id ? 'Failed to update product.' : 'Failed to create product.');
        }
        this.submitting.set(false);
        console.error(err);
      },
    });
  }
}
