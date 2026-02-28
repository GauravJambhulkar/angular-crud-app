import { Component, ChangeDetectionStrategy, inject } from '@angular/core';
import { SnackbarService } from '../../components/snackbar/snackbar.component';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { ProductService } from '../../services/product.service';

@Component({
  selector: 'app-add-product',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="container">
      <h1>Add New Product</h1>
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
          @if (form.get('name')?.pending) {
            <span class="info">Checking availability...</span>
          }
          @if (form.get('name')?.hasError('required') && form.get('name')?.touched) {
            <span class="error">Product name is required</span>
          } @if (form.get('name')?.hasError('nameTaken') && form.get('name')?.touched) {
            <span class="error">Name already in use</span>
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

        <div class="form-group">
          <label for="category">Category:</label>
          <select id="category" formControlName="category" class="form-control">
            <option value="" disabled>Select category</option>
            @for (cat of categories; track cat) {
              <option [value]="cat">{{ cat }}</option>
            }
          </select>
          @if (form.get('category')?.invalid && form.get('category')?.touched) {
            <span class="error">Category is required</span>
          }
        </div>

        <div class="form-group">
          <label for="tags">Tags (comma separated):</label>
          <input
            id="tags"
            type="text"
            formControlName="tags"
            class="form-control"
            placeholder="e.g. portable, gaming"
          />
        </div>

        <div class="form-actions">
          <button [disabled]="form.invalid" type="submit" class="btn btn-primary">
            Add Product
          </button>
          <a routerLink="/" class="btn btn-secondary">Cancel</a>
        </div>
      </form>
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

      .info {
        color: var(--text-secondary);
        font-size: 12px;
        margin-top: 4px;
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
    `
  ],
})
export class AddProductComponent {
  private fb = inject(FormBuilder);
  private productService = inject(ProductService);
  private router = inject(Router);
  private snack = inject(SnackbarService);

  form = this.fb.group({
    name: ['', {
      validators: [Validators.required],
      asyncValidators: [this.nameUniqueValidator.bind(this)],
      updateOn: 'blur'
    }],
    description: ['', Validators.required],
    price: [0, [Validators.required, Validators.min(0)]],
    quantity: [0, [Validators.required, Validators.min(0)]],
    category: ['', Validators.required],
    tags: [''], // comma-separated
  });

  categories = this.productService.getCategories();

  async nameUniqueValidator(control: import('@angular/forms').AbstractControl) {
    const name = control.value;
    if (!name) {
      return null;
    }
    return new Promise((resolve) => {
      setTimeout(() => {
        if (this.productService.isNameTaken(name)) {
          resolve({ nameTaken: true });
        } else {
          resolve(null);
        }
      }, 300);
    });
  }

  onSubmit() {
    if (this.form.valid) {
      const raw = this.form.getRawValue() as {
        name: string;
        description: string;
        price: number;
        quantity: number;
        category: string;
        tags: string;
      };
      const toSend = {
        name: raw.name,
        description: raw.description,
        price: raw.price,
        quantity: raw.quantity,
        category: raw.category,
        tags: raw.tags
          ? raw.tags.split(',').map((t) => t.trim()).filter((t) => t)
          : [],
      };
      this.productService
        .addProduct(toSend)
        .then(() => {
          this.snack.show({ text: 'Product added successfully' });
          this.router.navigate(['/']);
        })
        .catch((err) => {
          this.snack.show({ text: 'Failed to add product: ' + err.message });
        });
    }
  }
}
