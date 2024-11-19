import { Injectable,  OnDestroy  } from '@angular/core';
import { AngularFirestore, AngularFirestoreDocument } from '@angular/fire/compat/firestore';
import { AuthService } from './auth.service';
import { Observable, BehaviorSubject } from 'rxjs';
import { Subscription } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class CartService implements OnDestroy { // Implementar OnDestroy
  private cartItemCount = new BehaviorSubject<number>(0);
  cartItemCount$ = this.cartItemCount.asObservable();
  private subscriptions: Subscription = new Subscription();

  constructor(
    private firestore: AngularFirestore,
    private authService: AuthService
  ) {
    // Inicializamos el conteo de elementos del carrito al cargar el servicio
    this.authService.getCurrentUserId().then((userId) => {
      if (userId) {
        this.updateCartItemCount();
      }
    });
    
  }

  async updateItem(item: any): Promise<void> {
    const userId = await this.authService.getCurrentUserId();
    if (userId) {
      const itemRef: AngularFirestoreDocument = this.firestore.doc(`users/${userId}/cart/${item.id}`);
      await itemRef.update(item);
    }
  }
  /**
   * Incrementar la cantidad de un producto en el carrito.
   */
  async incrementItemQuantity(itemId: string): Promise<void> {
    const userId = await this.authService.getCurrentUserId();
    if (!userId) {
      console.warn('Usuario no autenticado');
      return;
    }
  
    const itemRef: AngularFirestoreDocument = this.firestore.doc(`users/${userId}/cart/${itemId}`);
    const itemSnapshot = await itemRef.get().toPromise();
  
    if (!itemSnapshot?.exists) {
      console.warn(`El elemento con ID ${itemId} no existe en el carrito.`);
      return;
    }
  
    const data = itemSnapshot.data() as { quantity?: number };
    const quantity = (data?.quantity || 1) + 1;
    await itemRef.update({ quantity });
    await this.updateCartItemCount();
  }
  
  async decrementItemQuantity(itemId: string): Promise<void> {
    const userId = await this.authService.getCurrentUserId();
    if (userId) {
      const itemRef: AngularFirestoreDocument = this.firestore.doc(`users/${userId}/cart/${itemId}`);
      const itemSnapshot = await itemRef.get().toPromise();
  
      if (itemSnapshot && itemSnapshot.exists) { // Validamos si itemSnapshot existe
        const data = itemSnapshot.data() as { quantity?: number }; // Asignamos tipo al dato
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
  

  /**
   * Añadir un producto al carrito.
   */
  async addToCart(product: any): Promise<void> {
    try {
      const userId = await this.authService.getCurrentUserId();
      if (!userId) {
        console.warn('Usuario no autenticado, no se puede añadir al carrito');
        return;
      }
  
      const cartRef = this.firestore.collection(`users/${userId}/cart`);
      const cartItemSnapshot = await cartRef.ref.where('id', '==', product.id).get();
  
      if (!cartItemSnapshot.empty) {
        const itemDoc = cartItemSnapshot.docs[0];
        const itemData = itemDoc.data() as { quantity: number };
        await itemDoc.ref.update({ quantity: itemData.quantity + 1 });
      } else {
        await cartRef.add({ ...product, quantity: 1 });
      }
  
      this.updateCartItemCount();
    } catch (error) {
      console.error('Error al añadir producto al carrito:', error);
    }
  }
  

  /**
   * Obtener los elementos del carrito como un observable.
   */
  getCartItems(): Observable<any[]> {
    return new Observable((observer) => {
      this.authService.getCurrentUserId().then((userId) => {
        if (!userId) {
          observer.next([]);
          return;
        }
  
        this.firestore
          .collection(`users/${userId}/cart`)
          .valueChanges()
          .subscribe(
            (items) => observer.next(items),
            (error) => {
              console.error('Error al obtener elementos del carrito:', error);
              observer.error(error);
            }
          );
      }).catch((error) => {
        console.error('Error al obtener el ID del usuario:', error);
        observer.error(error);
      });
    });
  }
  


  /**
   * Actualizar el conteo total de productos en el carrito.
   */
  private cartItemsSubject = new BehaviorSubject<any[]>([]);
  cartItems$ = this.cartItemsSubject.asObservable();
  
  private async updateCartItemCount(): Promise<void> {
    try {
      const userId = await this.authService.getCurrentUserId();
      if (userId) {
        this.firestore.collection(`users/${userId}/cart`).valueChanges().subscribe((items: any[]) => {
          const totalItems = items.reduce((count, item) => count + (item.quantity || 0), 0);
          this.cartItemCount.next(totalItems);
          this.cartItemsSubject.next(items); // Actualiza los elementos del carrito
        });
      }
    } catch (error) {
      console.error('Error al actualizar el conteo del carrito:', error);
    }
  }
  

  /**
   * Eliminar un producto del carrito.
   */
  async removeItem(itemId: string): Promise<void> {
    const userId = await this.authService.getCurrentUserId();
    if (userId) {
      await this.firestore.doc(`users/${userId}/cart/${itemId}`).delete();
      this.updateCartItemCount();
    }
  }

  /**
   * Limpiar todo el carrito.
   */
  async clearCart(): Promise<void> {
    const userId = await this.authService.getCurrentUserId();
    if (userId) {
      const cartRef = this.firestore.collection(`users/${userId}/cart`);
      const cartSnapshot = await cartRef.ref.get();
      const batch = this.firestore.firestore.batch();

      cartSnapshot.forEach((doc) => batch.delete(doc.ref));
      await batch.commit();
      this.cartItemCount.next(0);
    }
  }

 
  ngOnDestroy() {
    this.subscriptions.unsubscribe();
  }

}
