import { Component, ChangeDetectionStrategy, inject, signal, computed, effect, PLATFORM_ID } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ProductService } from '../../services/product.service';
import { SnackbarService } from '../snackbar/snackbar.component';
import { ConfirmService } from '../confirm-modal/confirm-modal.component';

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
      <div class="bulk-actions">
        <button (click)="deleteSelected()" class="btn btn-danger btn-sm" [disabled]="selectedIds().size===0">
          Delete Selected
        </button>
      </div>

      <!-- search / filter bar -->
      <div class="toolbar">
        <input
          type="text"
          placeholder="Search name or description..."
          (input)="searchTerm.set($any($event.target).value)"
          [value]="searchTerm()"
          class="search-input"
        />
        <select
          class="filter-select"
          (change)="selectedCategory.set($any($event.target).value)"
          [value]="selectedCategory()"
        >
          <option value="">All categories</option>
          @for (cat of categories; track cat) {
            <option [value]="cat">{{ cat }}</option>
          }
        </select>
        <input
          type="text"
          placeholder="Filter tags..."
          (input)="tagTerm.set($any($event.target).value)"
          [value]="tagTerm()"
          class="search-input tag-input"
        />
      </div>

      @if (filteredProducts().length === 0) {
        <p class="empty-message">
          No products match your criteria. <a routerLink="/add">Add one now!</a>
        </p>
      } @else {
        <table class="table">
          <thead>
            <tr>
              <th><input type="checkbox" [checked]="pagedProducts().every(p=>selectedIds().has(p.id))" (change)="togglePageSelection($any($event.target).checked)"/></th>
              <th (click)="setSort('id')">
                ID
                @if (sortField() === 'id') {
                  <span>{{ sortDir() === 'asc' ? '▲' : '▼' }}</span>
                }
              </th>
              <th (click)="setSort('name')">
                Name
                @if (sortField() === 'name') {
                  <span>{{ sortDir() === 'asc' ? '▲' : '▼' }}</span>
                }
              </th>
              <th>Description</th>
              <th (click)="setSort('price')">
                Price
                @if (sortField() === 'price') {
                  <span>{{ sortDir() === 'asc' ? '▲' : '▼' }}</span>
                }
              </th>
              <th (click)="setSort('quantity')">
                Quantity
                @if (sortField() === 'quantity') {
                  <span>{{ sortDir() === 'asc' ? '▲' : '▼' }}</span>
                }
              </th>
              <th>Category</th>
              <th>Tags</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            @for (product of pagedProducts(); track product.id) {
              <tr [class.selected]="selectedIds().has(product.id)">
                <td><input type="checkbox" [checked]="selectedIds().has(product.id)" (change)="toggleSelection(product.id)"/></td>
                <td>{{ product.id }}</td>
                <td>{{ product.name }}</td>
                <td>{{ product.description }}</td>
                <td>\${{ product.price.toFixed(2) }}</td>
                <td>{{ product.quantity }}</td>
                <td>{{ product.category }}</td>
                <td>
                  @for (tg of product.tags || []; track tg) {
                    <span class="tag-badge">{{ tg }}</span>
                  }
                </td>
                <td class="actions">
                  <a [routerLink]="['/edit', product.id]" class="btn btn-sm btn-info">Edit</a>
                  <button (click)="deleteProduct(product.id)" class="btn btn-sm btn-danger">Delete</button>
                </td>
              </tr>
            }
          </tbody>
        </table>

        <!-- pagination controls -->
        <div class="pagination">
          <button (click)="currentPage.update(p => p - 1)" [disabled]="currentPage() === 1">« Prev</button>
          @for (i of pages(); track i) {
            <button
              class="page-btn"
              [class.active]="currentPage() === i"
              (click)="currentPage.set(i)"
            >
              {{ i }}
            </button>
          }
          <button (click)="currentPage.update(p => p + 1)" [disabled]="currentPage() === totalPages()">Next »</button>
        </div>
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

      .table tbody tr.selected {
        background-color: rgba(0, 123, 255, 0.1);
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

      /* search toolbar */
      .toolbar {
        margin: 15px 0;
        display: flex;
        justify-content: flex-start;
      }

      .bulk-actions {
        margin: 10px 0;
      }

      .search-input {
        padding: 8px 12px;
        border: 1px solid var(--input-border);
        border-radius: 4px;
        width: 100%;
        max-width: 300px;
        font-size: 14px;
      }

      .filter-select {
        margin-left: 10px;
        padding: 8px 12px;
        border: 1px solid var(--input-border);
        border-radius: 4px;
        font-size: 14px;
      }

      .tag-input {
        margin-left: 10px;
        max-width: 200px;
      }

      /* indicate headers are interactive */
      .table th {
        cursor: pointer;
        user-select: none;
      }

      .pagination {
        margin-top: 20px;
        display: flex;
        align-items: center;
        gap: 5px;
      }

      .pagination button {
        padding: 6px 10px;
        border: 1px solid var(--input-border);
        background: var(--bg-primary);
        cursor: pointer;
        border-radius: 4px;
      }

      .pagination button:disabled {
        opacity: 0.5;
        cursor: not-allowed;
      }

      .pagination .page-btn.active {
        background-color: var(--btn-primary-bg);
        color: white;
      }

      /* keep action buttons vertically centered inside row */
      td.actions {
        vertical-align: middle;
      }

      /* ensure pagination text is readable in dark mode */
      .pagination button {
        color: var(--text-primary);
      }

      .tag-badge {
        display: inline-block;
        background: var(--btn-info-bg);
        color: white;
        padding: 2px 6px;
        border-radius: 3px;
        font-size: 12px;
        margin-right: 4px;
      }
    `
  ],
})
export class ProductListComponent {
  protected productService = inject(ProductService);
  private confirm = inject(ConfirmService);
  private snack = inject(SnackbarService);
  private platformId = inject(PLATFORM_ID);

  private dataLoadingInit = false;

  constructor() {
    // Load data on component init (client-side only)
    effect(() => {
      if (isPlatformBrowser(this.platformId) && !this.dataLoadingInit && this.productService.products().length === 0) {
        this.dataLoadingInit = true;
        this.productService.loadData();
      }
    });
  }

  togglePageSelection(select: boolean) {
    this.selectedIds.update((set: Set<number>) => {
      const newSet = new Set(set);
      if (select) {
        this.pagedProducts().forEach((p) => newSet.add(p.id));
      } else {
        this.pagedProducts().forEach((p) => newSet.delete(p.id));
      }
      return newSet;
    });
  }

  toggleSelection(id: number) {
    this.selectedIds.update((set: Set<number>) => {
      const newSet = new Set(set);
      if (newSet.has(id)) {
        newSet.delete(id);
      } else {
        newSet.add(id);
      }
      return newSet;
    });
  }

  deleteSelected() {
    const ids = Array.from(this.selectedIds()) as number[];
    if (ids.length === 0) return;
    this.confirm
      .open({ message: 'Are you sure you want to delete selected products?' })
      .then((ok) => {
        if (ok) {
          Promise.all(ids.map((id) => this.productService.deleteProduct(id)))
            .then(() => {
              this.snack.show({ text: 'Selected products deleted' });
              this.selectedIds.set(new Set());
            })
            .catch((e: any) => this.snack.show({ text: 'Delete failed: ' + (e?.message || e) }));
        }
      });
  }

  // search/filter/sort signals
  searchTerm = signal('');
  selectedCategory = signal('');
  tagTerm = signal('');
  sortField = signal<keyof import('../../services/product.service').Product | null>(null);
  sortDir = signal<'asc' | 'desc'>('asc');
  selectedIds = signal(new Set<number>());

  categories = this.productService.getCategories();

  filteredProducts = computed(() => {
    let products = this.productService.products();

    // text filter
    const term = this.searchTerm().trim().toLowerCase();
    if (term) {
      products = products.filter(
        (p) =>
          p.name.toLowerCase().includes(term) ||
          p.description.toLowerCase().includes(term)
      );
    }

    // category filter
    const cat = this.selectedCategory();
    if (cat) {
      products = products.filter((p) => p.category === cat);
    }

    // tag filter
    const tterm = this.tagTerm().trim().toLowerCase();
    if (tterm) {
      products = products.filter(
        (p) => p.tags?.some((tg) => tg.toLowerCase().includes(tterm))
      );
    }

    // sorting
    const field = this.sortField();
    if (field) {
      products = [...products].sort((a, b) => {
        let v1: any = a[field];
        let v2: any = b[field];
        if (typeof v1 === 'string') {
          v1 = v1.toLowerCase();
          v2 = v2.toLowerCase();
        }
        if (v1 < v2) return this.sortDir() === 'asc' ? -1 : 1;
        if (v1 > v2) return this.sortDir() === 'asc' ? 1 : -1;
        return 0;
      });
    }

    return products;
  });

  // pagination
  currentPage = signal(1);
  pageSize = signal(5);

  pagedProducts = computed(() => {
    const all = this.filteredProducts();
    const start = (this.currentPage() - 1) * this.pageSize();
    return all.slice(start, start + this.pageSize());
  });

  totalPages = computed(() => {
    return Math.max(1, Math.ceil(this.filteredProducts().length / this.pageSize()));
  });

  pages = computed(() => {
    const t = this.totalPages();
    return Array.from({ length: t }, (_, i) => i + 1);
  });

  setSort(field: keyof import('../../services/product.service').Product) {
    if (this.sortField() === field) {
      // toggle direction
      this.sortDir.update((d) => (d === 'asc' ? 'desc' : 'asc'));
    } else {
      this.sortField.set(field);
      this.sortDir.set('asc');
    }
  }

  deleteProduct(id: number) {
    this.confirm
      .open({ message: 'Are you sure you want to delete this product?' })
      .then((ok) => {
        if (ok) {
          this.productService
            .deleteProduct(id)
            .then(() => this.snack.show({ text: 'Product deleted' }))
            .catch((e: any) => this.snack.show({ text: 'Delete failed: ' + (e?.message || e) }));
        }
      });
  }
}
