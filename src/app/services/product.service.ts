import { Injectable } from '@angular/core';
import { signal } from '@angular/core';

export interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  quantity: number;
}

@Injectable({
  providedIn: 'root',
})
export class ProductService {
  private productSignal = signal<Product[]>([
    { id: 1, name: 'Laptop', description: 'High-performance laptop', price: 999, quantity: 5 },
    { id: 2, name: 'Mouse', description: 'Wireless mouse', price: 29, quantity: 15 },
    { id: 3, name: 'Keyboard', description: 'Mechanical keyboard', price: 149, quantity: 10 },
  ]);

  products = this.productSignal.asReadonly();
  private nextId = 4;

  getProducts() {
    return this.products;
  }

  getProductById(id: number) {
    return this.products().find((p) => p.id === id);
  }

  addProduct(product: Omit<Product, 'id'>) {
    const newProduct: Product = {
      ...product,
      id: this.nextId++,
    };
    this.productSignal.update((products) => [...products, newProduct]);
    return newProduct;
  }

  updateProduct(id: number, updatedProduct: Omit<Product, 'id'>) {
    this.productSignal.update((products) =>
      products.map((p) =>
        p.id === id ? { ...p, id, ...updatedProduct } : p
      )
    );
  }

  deleteProduct(id: number) {
    this.productSignal.update((products) => products.filter((p) => p.id !== id));
  }

  deleteAllProducts() {
    this.productSignal.set([]);
  }
}
