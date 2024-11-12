// app.component.ts
import { Component, OnInit } from '@angular/core';
import { CartService } from './servicios/cart.service';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent implements OnInit {
  cartItemCount: number = 0;

  constructor(private cartService: CartService) {}

  ngOnInit() {
    // Suscribirse a los cambios en el conteo del carrito
    this.cartService.cartItemCount$.subscribe(count => {
      this.cartItemCount = count;
    });
  }
}
