import { Component, OnInit } from '@angular/core';
import { CartService } from '../../servicios/cart.service';
import { DataService } from '../../data.service';
import { ActivatedRoute } from '@angular/router';
import { Observable, of } from 'rxjs';
import { ProductsService } from '../../productos.service';
import { AngularFirestore } from '@angular/fire/compat/firestore'; // Mantén solo AngularFirestore
import { AuthService } from '../../servicios/auth.service';

@Component({
  selector: 'app-all-productos',
  templateUrl: './all-productos.page.html',
  styleUrls: ['./all-productos.page.scss']
})
export class AllProductosPage implements OnInit {
  productos$: Observable<any[]> = new Observable();
  cartItems$: Observable<any[]> = of([]);

  constructor(
    private productosService: ProductsService,
    private route: ActivatedRoute,
    private cartService: CartService,
    private dataService: DataService,
    private firestore: AngularFirestore, // Usa solo AngularFirestore
    private authService: AuthService
  ) {}

  ngOnInit() {
    this.dataService.getData().subscribe(data => {
      // Asignar los productos desde el archivo JSON
      this.productos$ = of(data.productos);
    });
    this.cartItems$ = this.cartService.cartItems$;
  }
  

  async addToCart(product: any, event: Event): Promise<void> {
    event.preventDefault();  // Prevenir la acción de navegación
    event.stopPropagation(); // Detener la propagación del evento
  
    try {
      const userId = await this.authService.getCurrentUserId();
      if (userId) {
        const cartRef = this.firestore.collection(`users/${userId}/cart`);
        const cartQuery = cartRef.ref.where('id', '==', product.id);
        const cartItem = await cartQuery.get();
  
        if (!cartItem.empty) {
          const itemDoc = cartItem.docs[0];
          const itemData = itemDoc.data() as { quantity?: number };
          await cartRef.doc(itemDoc.id).update({ quantity: (itemData.quantity || 1) + 1 });
        } else {
          await cartRef.add({ ...product, quantity: 1 });
        }
        await this.updateCartItemCount();
      }
    } catch (error) {
      console.error('Error al añadir al carrito:', error);
    }
  }
  
  async updateCartItemCount(): Promise<void> {
    this.cartItems$ = this.cartService.cartItems$;
    console.log('Conteo de ítems actualizado.');
  }

  async removeFromCart(itemId: string) {
    try {
      await this.cartService.removeItem(itemId);
      console.log('Producto removido del carrito');
    } catch (error) {
      console.error('Error al remover producto del carrito:', error);
    }
  }

  async clearCart() {
    try {
      await this.cartService.clearCart();
      console.log('Carrito limpiado');
    } catch (error) {
      console.error('Error al limpiar el carrito:', error);
    }
  }
}

