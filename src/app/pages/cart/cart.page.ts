// src/app/pages/cart/cart.page.ts
import { Component, OnInit } from '@angular/core';
import { CartService } from '../../servicios/cart.service';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.page.html',
  styleUrls: ['./cart.page.scss'],
})
export class CartPage implements OnInit {
  cartItems: any[] = [];
  totalAmount: number = 0;

  constructor(private cartService: CartService) {}

  ngOnInit() {
    this.loadCartItems();
  }

  async loadCartItems() {
    const itemsObservable = await this.cartService.getCartItems();
    if (itemsObservable) {
      itemsObservable.subscribe((items: any[]) => {
        this.cartItems = items;
        this.calculateTotalAmount();
      });
    }
  }

  // Calcular el monto total
  calculateTotalAmount() {
    this.totalAmount = this.cartItems.reduce((total, item) => {
      return total + item.precio * item.quantity;
    }, 0);
  }

  // Aumentar cantidad
  increaseQuantity(item: any) {
    item.quantity += 1;
    this.cartService.updateItem(item); // Opcional, para persistencia
    this.calculateTotalAmount();
  }

  // Disminuir cantidad
  decreaseQuantity(item: any) {
    if (item.quantity > 1) {
      item.quantity -= 1;
      this.cartService.updateItem(item); // Opcional, para persistencia
      this.calculateTotalAmount();
    }
  }

  // Actualizar cantidad directamente desde un input
  updateQuantity(item: any, event: any) {
    const newQuantity = parseInt(event.detail.value, 10);
    if (newQuantity > 0) {
      item.quantity = newQuantity;
      this.cartService.updateItem(item); // Opcional, para persistencia
      this.calculateTotalAmount();
    }
  }

  // Eliminar un producto del carrito
  removeItem(itemId: string) {
    this.cartService.removeItem(itemId).then(() => {
      this.cartItems = this.cartItems.filter(item => item.id !== itemId);
      this.calculateTotalAmount();
    });
  }

  // Limpiar el carrito
  clearCart() {
    this.cartService.clearCart().then(() => {
      this.cartItems = [];
      this.calculateTotalAmount();
    });
  }
}
