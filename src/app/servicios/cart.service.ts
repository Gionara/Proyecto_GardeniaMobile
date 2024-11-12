import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { AuthService } from './auth.service';
import { Observable, of, BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CartService {
  private cartItemCount = new BehaviorSubject<number>(0);
  cartItemCount$ = this.cartItemCount.asObservable();

  constructor(
    private firestore: AngularFirestore,
    private authService: AuthService
  ) {}

  // Método para añadir un producto al carrito
  async addToCart(product: any): Promise<void> {
    const userId = await this.authService.getCurrentUserId();
    if (userId) {
      const cartRef = this.firestore.collection(`users/${userId}/cart`);
      if (typeof product === 'object' && !Array.isArray(product)) {
        try {
          await cartRef.add(product);
          await this.updateCartItemCount();
        } catch (error) {
          console.error('Error al agregar el producto al carrito:', error);
          throw new Error('No se pudo agregar el producto al carrito');
        }
      } else {
        console.error('El producto debe ser un objeto válido y no un array');
        throw new Error('Producto no válido');
      }
    } else {
      console.log('Usuario no autenticado');
      throw new Error('Usuario no autenticado');
    }
  }

  // Método para obtener los elementos del carrito
  getCartItems(): Observable<any[]> {
    return new Observable((observer) => {
      this.authService.getCurrentUserId().then(userId => {
        if (userId) {
          this.firestore.collection(`users/${userId}/cart`).valueChanges()
            .subscribe(items => observer.next(items), error => observer.error(error));
        } else {
          observer.next([]);
        }
      });
    });
  }

  // Método para actualizar el conteo de productos en el carrito
  private async updateCartItemCount(): Promise<void> {
    const userId = await this.authService.getCurrentUserId();
    if (userId) {
      const cartRef = this.firestore.collection(`users/${userId}/cart`);
      const items = await cartRef.get().toPromise();
      const itemCount = items?.size || 0;
      this.cartItemCount.next(itemCount);
    }
  }

  // Método para remover un producto del carrito
  async removeItem(itemId: string): Promise<void> {
    const userId = await this.authService.getCurrentUserId();
    if (userId) {
      await this.firestore.doc(`users/${userId}/cart/${itemId}`).delete();
      await this.updateCartItemCount();
    }
  }

  // Método para limpiar el carrito
  async clearCart(): Promise<void> {
    const userId = await this.authService.getCurrentUserId();
    if (userId) {
      const cartRef = this.firestore.collection(`users/${userId}/cart`);
      const items = await cartRef.get().toPromise();
      const batch = this.firestore.firestore.batch();

      items?.forEach(item => batch.delete(item.ref));
      await batch.commit();
      this.cartItemCount.next(0);
    }
  }
}
