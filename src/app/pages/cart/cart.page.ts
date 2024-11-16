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

  // Cargar los elementos del carrito
  async loadCartItems() {
    const itemsObservable = await this.cartService.getCartItems();
    if (itemsObservable) {
      itemsObservable.subscribe((items: any[]) => {
        this.cartItems = items;
        this.calculateTotalAmount();
      });
    }
  }
  calculateTotalAmount() {
    this.totalAmount = this.cartItems.reduce((total, item) => {
      return total + item.precio * item.quantity; // Asegúrate de tener un campo de precio y cantidad
    }, 0);
  }

  // Eliminar un elemento del carrito
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
