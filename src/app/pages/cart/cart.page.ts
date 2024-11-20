import { Component, OnInit, OnDestroy } from '@angular/core';
import { CartService } from '../../servicios/cart.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.page.html',
  styleUrls: ['./cart.page.scss'],
})
export class CartPage implements OnInit, OnDestroy {
  cartItems: any[] = [];
  totalAmount: number = 0;
  private subscription: Subscription = new Subscription();

  constructor(private cartService: CartService) {}

  ngOnInit() {
    this.subscription = this.cartService.cartItems$.subscribe((items) => {
      this.cartItems = items;
      this.calculateTotalAmount();
    }, (error) => {
      console.error('Error al obtener los items del carrito:', error);
    });
  }
  

  calculateTotalAmount() {
    this.totalAmount = this.cartItems.reduce((total, item) => total + item.precio * item.quantity, 0);
  }

  increaseQuantity(item: any) {
    item.quantity += 1;
    this.cartService.addToCart(item);
  }

  decreaseQuantity(item: any) {
    if (item.quantity > 1) {
      item.quantity -= 1;
      this.cartService.addToCart(item);
    } else {
      this.cartService.removeItem(item.docId);
    }
  }

  removeItem(itemId: string) {
    this.cartService.removeItem(itemId);
  }

  clearCart() {
    this.cartService.clearCart();
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}
