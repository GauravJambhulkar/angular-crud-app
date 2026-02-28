import { Component, ChangeDetectionStrategy, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterModule, ActivatedRoute } from '@angular/router';
import { ProductService } from '../../services/product.service';

interface ProductFormValue {
  name: string;
  description: string;
  price: number;
  quantity: number;
}

@Component({
  selector: 'app-edit-product',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="container">
      <h1>Edit Product</h1>
      @if (product) {
        <form [formGroup]="form" (ngSubmit)="onSubmit()" class="form">
          <div class="form-group">
            <label for="name">Product Name:</label>
            <input
              id="name"
              type="text"
              formControlName="name"
              class="form-control"
              placeholder="Enter product name"
            />
            @if (form.get('name')?.invalid && form.get('name')?.touched) {
              <span class="error">Product name is required</span>
            }
          </div>

          <div class="form-group">
            <label for="description">Description:</label>
            <textarea
              id="description"
              formControlName="description"
              class="form-control"
              placeholder="Enter product description"
              rows="4"
            ></textarea>
            @if (form.get('description')?.invalid && form.get('description')?.touched) {
              <span class="error">Description is required</span>
            }
          </div>

          <div class="form-group">
            <label for="price">Price:</label>
            <input
              id="price"
              type="number"
              formControlName="price"
              class="form-control"
              placeholder="Enter product price"
              step="0.01"
              min="0"
            />
            @if (form.get('price')?.invalid && form.get('price')?.touched) {
              <span class="error">Price must be a positive number</span>
            }
          </div>

          <div class="form-group">
            <label for="quantity">Quantity:</label>
            <input
              id="quantity"
              type="number"
              formControlName="quantity"
              class="form-control"
              placeholder="Enter quantity"
              min="0"
            />
            @if (form.get('quantity')?.invalid && form.get('quantity')?.touched) {
              <span class="error">Quantity must be a positive integer</span>
            }
          </div>

          <div class="form-actions">
            <button [disabled]="form.invalid" type="submit" class="btn btn-primary">
              Update Product
            </button>
            <a routerLink="/" class="btn btn-secondary">Cancel</a>
          </div>
        </form>
      } @else {
        <p class="error-message">Product not found</p>
        <a routerLink="/" class="btn btn-secondary">Go Back</a>
      }
    </div>
  `,
  styles: [
    `
      .container {
        padding: 20px;
        max-width: 600px;
        margin: 0 auto;
      }

      h1 {
        color: var(--text-primary);
        margin-bottom: 30px;
      }

      .form {
        background: var(--bg-secondary);
        padding: 20px;
        border-radius: 8px;
      }

      .form-group {
        margin-bottom: 20px;
        display: flex;
        flex-direction: column;
      }

      label {
        font-weight: 600;
        margin-bottom: 8px;
        color: var(--text-primary);
      }

      .form-control {
        padding: 10px;
        border: 1px solid var(--input-border);
        border-radius: 4px;
        font-size: 14px;
        font-family: inherit;
        background-color: var(--bg-primary);
        color: var(--text-primary);
        transition: border-color 0.3s ease;
      }

      .form-control:focus {
        outline: none;
        border-color: var(--input-focus);
        box-shadow: 0 0 0 3px rgba(25, 118, 210, 0.25);
      }

      .error {
        color: var(--btn-danger-bg);
        font-size: 12px;
        margin-top: 4px;
      }

      .error-message {
        color: var(--btn-danger-bg);
        font-size: 16px;
        margin-bottom: 20px;
      }

      .form-actions {
        display: flex;
        gap: 10px;
        margin-top: 30px;
      }

      .btn {
        padding: 10px 20px;
        border: none;
        border-radius: 4px;
        cursor: pointer;
        text-decoration: none;
        display: inline-block;
        font-size: 14px;
        transition: background-color 0.3s;
      }

      .btn-primary {
        background-color: var(--btn-primary-bg);
        color: white;
      }

      .btn-primary:hover:not(:disabled) {
        background-color: var(--btn-primary-hover);
      }

      .btn-primary:disabled {
        background-color: var(--btn-secondary-bg);
        cursor: not-allowed;
      }

      .btn-secondary {
        background-color: var(--btn-secondary-bg);
        color: white;
      }

      .btn-secondary:hover {
        background-color: var(--btn-secondary-hover);
      }
    `,
  ],
})
export class EditProductComponent implements OnInit {
  private fb = inject(FormBuilder);
  private productService = inject(ProductService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  form = this.fb.group({
    name: ['', Validators.required],
    description: ['', Validators.required],
    price: [0, [Validators.required, Validators.min(0)]],
    quantity: [0, [Validators.required, Validators.min(0)]],
  });

  product: any;

  ngOnInit() {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.product = this.productService.getProductById(id);

    if (this.product) {
      this.form.patchValue({
        name: this.product.name,
        description: this.product.description,
        price: this.product.price,
        quantity: this.product.quantity,
      });
    }
  }

  onSubmit() {
    if (this.form.valid && this.product) {
      this.productService.updateProduct(this.product.id, this.form.getRawValue() as ProductFormValue);
      this.router.navigate(['/']);
    }
  }
}
