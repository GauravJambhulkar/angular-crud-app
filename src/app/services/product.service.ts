import { Injectable, inject } from '@angular/core';
import { signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';

export interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  quantity: number;
  category: string;
  tags: string[];
}

@Injectable({
  providedIn: 'root',
})
export class ProductService {
  private http = inject(HttpClient);
  private productSignal = signal<Product[]>([]);
  products = this.productSignal.asReadonly();
  private nextId = 121;
  private dataLoaded = false;

  private seedData: Product[] = [
    { id: 1, name: 'Laptop Pro', description: 'High-performance laptop for professionals', price: 999, quantity: 5, category: 'Electronics', tags: ['computer', 'portable', 'work'] },
    { id: 2, name: 'Wireless Mouse', description: 'Ergonomic wireless mouse', price: 29, quantity: 15, category: 'Accessories', tags: ['peripheral', 'wireless'] },
    { id: 3, name: 'Mechanical Keyboard', description: 'RGB mechanical keyboard', price: 149, quantity: 10, category: 'Accessories', tags: ['peripheral', 'gaming', 'rgb'] },
    { id: 4, name: 'USB-C Hub', description: 'Multi-port USB-C hub', price: 39, quantity: 20, category: 'Accessories', tags: ['connector', 'portable'] },
    { id: 5, name: 'Webcam 1080p', description: 'Full HD webcam with microphone', price: 59, quantity: 12, category: 'Electronics', tags: ['video', 'streaming'] },
    { id: 6, name: 'Monitor 27in', description: '4K Ultra HD monitor', price: 399, quantity: 8, category: 'Electronics', tags: ['display', '4k'] },
    { id: 7, name: 'Standing Desk', description: 'Adjustable standing desk', price: 299, quantity: 6, category: 'Furniture', tags: ['ergonomic', 'office'] },
    { id: 8, name: 'Office Chair', description: 'Ergonomic office chair', price: 199, quantity: 9, category: 'Furniture', tags: ['seating', 'ergonomic'] },
    { id: 9, name: 'Desk Lamp', description: 'LED desk lamp with USB', price: 49, quantity: 18, category: 'Accessories', tags: ['lighting', 'office'] },
    { id: 10, name: 'Phone Holder', description: 'Adjustable phone holder', price: 15, quantity: 30, category: 'Accessories', tags: ['mount', 'portable'] },
    { id: 11, name: 'Laptop Stand', description: 'Aluminum laptop stand', price: 45, quantity: 22, category: 'Accessories', tags: ['office', 'portable'] },
    { id: 12, name: 'Portable SSD', description: '1TB portable SSD', price: 129, quantity: 14, category: 'Electronics', tags: ['storage', 'portable'] },
    { id: 13, name: 'Wireless Charger', description: 'Fast wireless charger', price: 35, quantity: 25, category: 'Accessories', tags: ['charging', 'wireless'] },
    { id: 14, name: 'USB Cable', description: 'High-speed USB-C cable', price: 12, quantity: 50, category: 'Accessories', tags: ['connector', 'charging'] },
    { id: 15, name: 'Power Bank', description: '20000mAh power bank', price: 45, quantity: 19, category: 'Electronics', tags: ['portable', 'charging'] },
    { id: 16, name: 'Screen Protector', description: 'Tempered glass protector', price: 10, quantity: 40, category: 'Accessories', tags: ['protection'] },
    { id: 17, name: 'Phone Case', description: 'Durable phone case', price: 20, quantity: 35, category: 'Accessories', tags: ['protection', 'design'] },
    { id: 18, name: 'Bluetooth Speaker', description: 'Portable Bluetooth speaker', price: 79, quantity: 16, category: 'Electronics', tags: ['audio', 'portable', 'wireless'] },
    { id: 19, name: 'Headphones', description: 'Noise-cancelling headphones', price: 199, quantity: 11, category: 'Electronics', tags: ['audio', 'wireless'] },
    { id: 20, name: 'Earbuds', description: 'Wireless earbuds with case', price: 99, quantity: 13, category: 'Electronics', tags: ['audio', 'wireless', 'portable'] },
    { id: 21, name: 'Gaming Mouse Pad', description: 'Large gaming mouse pad', price: 25, quantity: 28, category: 'Accessories', tags: ['gaming', 'office'] },
    { id: 22, name: 'Cable Organizer', description: 'Cable management clips', price: 8, quantity: 60, category: 'Accessories', tags: ['organization'] },
    { id: 23, name: 'Desk Organizer', description: 'Multi-compartment desk organizer', price: 22, quantity: 32, category: 'Accessories', tags: ['organization', 'office'] },
    { id: 24, name: 'Monitor Stand', description: 'Height-adjustable monitor stand', price: 65, quantity: 15, category: 'Accessories', tags: ['office', 'ergonomic'] },
    { id: 25, name: 'Keyboard Wrist Rest', description: 'Ergonomic wrist rest', price: 18, quantity: 24, category: 'Accessories', tags: ['ergonomic'] },
    { id: 26, name: 'Mouse Pad Wrist Rest', description: 'Wrist rest mouse pad', price: 20, quantity: 26, category: 'Accessories', tags: ['ergonomic'] },
    { id: 27, name: 'Screen Light', description: 'Anti-glare screen light', price: 35, quantity: 19, category: 'Accessories', tags: ['lighting', 'health'] },
    { id: 28, name: 'HDMI Cable', description: 'High-speed HDMI cable', price: 15, quantity: 38, category: 'Accessories', tags: ['connector'] },
    { id: 29, name: 'VGA Cable', description: 'VGA video cable', price: 12, quantity: 42, category: 'Accessories', tags: ['connector'] },
    { id: 30, name: 'Ethernet Cable', description: 'CAT6 ethernet cable', price: 10, quantity: 45, category: 'Accessories', tags: ['connector', 'network'] },
  ];

  async loadData() {
    if (this.dataLoaded) return;
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 3000);
      
      const data = await firstValueFrom(
        this.http.get<Product[]>('/assets/products-data.json')
      );
      
      clearTimeout(timeoutId);
      this.productSignal.set(data);
      this.nextId = Math.max(...data.map((p) => p.id)) + 1;
      this.dataLoaded = true;
      console.log('Products loaded successfully:', data.length, 'items');
    } catch (error) {
      console.warn('Failed to load products JSON, using seed data:', error);
      // Use seed data as fallback
      this.productSignal.set(this.seedData);
      this.nextId = 121;
      this.dataLoaded = true;
    }
  }

  // simple category list; could be dynamic later
  private categories = signal<string[]>(['Electronics', 'Accessories', 'Furniture', 'Clothing']);

  getCategories() {
    return this.categories();
  }

  getProducts() {
    return this.products;
  }

  getProductById(id: number) {
    return this.products().find((p) => p.id === id);
  }

  // simulate async operation with possible failure and optimistic updates
  private simulateRequest<T>(work: () => T): Promise<T> {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        // random failure 10%
        if (Math.random() < 0.1) {
          reject(new Error('Network error'));
        } else {
          try {
            resolve(work());
          } catch (e) {
            reject(e);
          }
        }
      }, 300);
    });
  }

  addProduct(product: Omit<Product, 'id'>): Promise<Product> {
    const newProduct: Product = {
      ...product,
      id: this.nextId++,
    };
    // optimistic update
    this.productSignal.update((products) => [...products, newProduct]);
    return this.simulateRequest(() => newProduct).catch((err) => {
      // rollback
      this.productSignal.update((products) => products.filter((p) => p.id !== newProduct.id));
      throw err;
    });
  }

  updateProduct(id: number, updatedProduct: Omit<Product, 'id'>): Promise<void> {
    const before = this.getProductById(id);
    if (!before) return Promise.reject(new Error('Product not found'));
    const backup = { ...before };
    this.productSignal.update((products) =>
      products.map((p) =>
        p.id === id ? { ...p, id, ...updatedProduct } : p
      )
    );
    return this.simulateRequest(() => undefined).catch((err) => {
      // rollback
      this.productSignal.update((products) =>
        products.map((p) => (p.id === id ? backup : p))
      );
      throw err;
    });
  }

  deleteProduct(id: number): Promise<void> {
    const before = this.getProductById(id);
    if (!before) return Promise.reject(new Error('Product not found'));
    this.productSignal.update((products) => products.filter((p) => p.id !== id));
    return this.simulateRequest(() => undefined).catch((err) => {
      // rollback
      this.productSignal.update((products) => [...products, before]);
      throw err;
    });
  }

  deleteAllProducts() {
    this.productSignal.set([]);
  }

  isNameTaken(name: string, excludeId?: number): boolean {
    const lower = name.trim().toLowerCase();
    return this.products().some((p) => p.name.trim().toLowerCase() === lower && p.id !== excludeId);
  }
}
