import { Component, ChangeDetectionStrategy, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ProductService } from '../../services/product.service';

@Component({
  selector: 'app-product-list',
  standalone: true,
  imports: [CommonModule, RouterModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="container">
      <div class="header">
        <h1>Products</h1>
        <a routerLink="/add" class="btn btn-primary">Add New Product</a>
      </div>

      @if (productService.products().length === 0) {
        <p class="empty-message">No products available. <a routerLink="/add">Add one now!</a></p>
      } @else {
        <table class="table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Description</th>
              <th>Price</th>
              <th>Quantity</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            @for (product of productService.products(); track product.id) {
              <tr>
                <td>{{ product.id }}</td>
                <td>{{ product.name }}</td>
                <td>{{ product.description }}</td>
                <td>\${{ product.price.toFixed(2) }}</td>
                <td>{{ product.quantity }}</td>
                <td class="actions">
                  <a [routerLink]="['/edit', product.id]" class="btn btn-sm btn-info">Edit</a>
                  <button (click)="deleteProduct(product.id)" class="btn btn-sm btn-danger">Delete</button>
                </td>
              </tr>
            }
          </tbody>
        </table>
      }
    </div>
  `,
  styles: [
    `
      .container {
        padding: 20px;
        max-width: 1000px;
        margin: 0 auto;
      }

      .header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 30px;
      }

      h1 {
        margin: 0;
        color: var(--text-primary);
      }

      .table {
        width: 100%;
        border-collapse: collapse;
        margin-top: 20px;
      }

      .table th,
      .table td {
        padding: 12px;
        text-align: left;
        border-bottom: 1px solid var(--border-color);
        color: var(--text-primary);
      }

      .table th {
        background-color: var(--bg-secondary);
        font-weight: bold;
      }

      .table tbody tr:hover {
        background-color: var(--table-hover);
      }

      .actions {
        display: flex;
        gap: 8px;
      }

      .btn {
        padding: 8px 16px;
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

      .btn-primary:hover {
        background-color: var(--btn-primary-hover);
      }

      .btn-info {
        background-color: var(--btn-info-bg);
        color: white;
        font-size: 12px;
      }

      .btn-info:hover {
        background-color: var(--btn-info-hover);
      }

      .btn-danger {
        background-color: var(--btn-danger-bg);
        color: white;
        font-size: 12px;
      }

      .btn-danger:hover {
        background-color: var(--btn-danger-hover);
      }

      .btn-sm {
        padding: 6px 12px;
        font-size: 12px;
      }

      .empty-message {
        text-align: center;
        color: var(--text-secondary);
        padding: 40px 20px;
        font-size: 16px;
      }

      .empty-message a {
        color: var(--btn-primary-bg);
        text-decoration: none;
      }

      .empty-message a:hover {
        text-decoration: underline;
      }
    `,
  ],
})
export class ProductListComponent {
  protected productService = inject(ProductService);

  deleteProduct(id: number) {
    if (confirm('Are you sure you want to delete this product?')) {
      this.productService.deleteProduct(id);
    }
  }
}
