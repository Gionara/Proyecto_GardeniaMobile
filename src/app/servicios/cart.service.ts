import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreDocument } from '@angular/fire/compat/firestore';
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
  ) {
    this.firestore.collection('test').valueChanges().subscribe(data => {
      console.log("Firestore conectado:", data);
    });
  }


  // Incrementa la cantidad del producto en el carrito
  async incrementItemQuantity(itemId: string): Promise<void> {
    const userId = await this.authService.getCurrentUserId();
    if (userId) {
      const itemRef: AngularFirestoreDocument = this.firestore.doc(`users/${userId}/cart/${itemId}`);
      const item = await itemRef.get().toPromise();
      
      if (item?.exists) {  // Verificamos si item existe
        const data = item.data() as { quantity?: number }; // Asignamos tipo al dato
        const quantity = (data?.quantity || 1) + 1; // Usamos data?.quantity para asegurar existencia
        await itemRef.update({ quantity });
        await this.updateCartItemCount();
      }
    }
  }

  // Decrementa la cantidad del producto en el carrito
  async decrementItemQuantity(itemId: string): Promise<void> {
    const userId = await this.authService.getCurrentUserId();
    if (userId) {
      const itemRef: AngularFirestoreDocument = this.firestore.doc(`users/${userId}/cart/${itemId}`);
      const item = await itemRef.get().toPromise();

      if (item?.exists) {  // Verificamos si item existe
        const data = item.data() as { quantity?: number }; // Asignamos tipo al dato
        const quantity = (data?.quantity || 1) - 1;
        
        if (quantity > 0) {
          await itemRef.update({ quantity });
        } else {
          await itemRef.delete();
        }
        await this.updateCartItemCount();
      }
    }
  }

  // Método para añadir un producto al carrito
  async addToCart(product: any): Promise<void> {
    try {
      const userId = await this.authService.getCurrentUserId();
      if (userId) {
        const cartRef = this.firestore.collection(`users/${userId}/cart`);
        const cartItem = await cartRef.ref.where('id', '==', product.id).get();

        if (!cartItem.empty) {
          const itemDoc = cartItem.docs[0];
          const itemData = itemDoc.data() as { quantity?: number };
          await itemDoc.ref.update({ quantity: (itemData.quantity || 1) + 1 });
        } else {
          await cartRef.add({ ...product, quantity: 1 });
        }
        await this.updateCartItemCount();
      }
    } catch (error) {
      console.error("Error al añadir al carrito:", error);
    }
  }

  // Método para obtener los elementos del carrito
  getCartItems(): Observable<any[]> {
    return new Observable(observer => {
      this.authService.getCurrentUserId().then(userId => {
        if (userId) {
          this.firestore.collection(`users/${userId}/cart`).valueChanges()
            .subscribe(
              items => observer.next(items),
              error => {
                console.error("Error al obtener elementos del carrito:", error);
                observer.error(error);
              }
            );
        } else {
          observer.next([]);
        }
      }).catch(error => observer.error(error));
    });
  }

  // Método para actualizar el conteo de productos en el carrito
  private async updateCartItemCount(): Promise<void> {
    const userId = await this.authService.getCurrentUserId();
    if (userId) {
      this.firestore.collection(`users/${userId}/cart`).valueChanges().subscribe(items => {
        this.cartItemCount.next(items.length);
      });
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
      if (items && !items.empty) {
        const batch = this.firestore.firestore.batch();
        items.forEach(item => batch.delete(item.ref));
        await batch.commit();
        this.cartItemCount.next(0);
      }
    }
  }
}
