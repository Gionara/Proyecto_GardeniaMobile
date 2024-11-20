import { Injectable, OnDestroy } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { AuthService } from './auth.service';
import { BehaviorSubject, Subscription } from 'rxjs';
import { CartItem } from './cart-item.model';

@Injectable({
  providedIn: 'root',
})
export class CartService implements OnDestroy {
  private cartItemsSubject = new BehaviorSubject<any[]>([]);
  cartItems$ = this.cartItemsSubject.asObservable();
  private cartItemCountSubject = new BehaviorSubject<number>(0);
  cartItemCount$ = this.cartItemCountSubject.asObservable();
  private subscriptions: Subscription = new Subscription();

  constructor(private firestore: AngularFirestore, private authService: AuthService) {
    this.initializeCart();
  }
  getCartRef() {
    return this.firestore.collection(`users/${this.authService.getCurrentUserId()}/cart`);
  }
  
  private initializeCart() {
    this.authService.isAuthenticated().subscribe(isAuthenticated => {
      if (isAuthenticated) {
        this.authService.getCurrentUserId().then(userId => {
          if (userId) {
            console.log('user', userId);
            const cartRef = this.firestore.collection(`users/${userId}/cart`);
            this.subscriptions.add(
              cartRef.snapshotChanges().subscribe(
                (actions) => {
                  const formattedItems = actions.map((a) => {
                    const data = a.payload.doc.data() as CartItem;
                    const docId = a.payload.doc.id;
                    return { ...data, docId };
                  });
  
                  this.cartItemsSubject.next(formattedItems);
                  this.cartItemCountSubject.next(formattedItems.reduce((count, item) => count + item.quantity, 0));
                },
                (error) => console.error('Error al inicializar el carrito:', error)
              )
            );
          }
        });
      } else {
        console.warn('Usuario no autenticado. El carrito no puede inicializarse.');
      }
    });
  }
  
  

 
async addToCart(product: CartItem): Promise<void> {
  try {
    const userId = await this.authService.getCurrentUserId();
    if (!userId) throw new Error('Usuario no autenticado');

    const cartRef = this.firestore.collection(`users/${userId}/cart`);
    const existingItem = await cartRef.ref.where('id', '==', product.id).get();

    if (!existingItem.empty) {
      const doc = existingItem.docs[0];
      const data = doc.data() as CartItem; // Convertimos el tipo 'unknown' a 'CartItem'
      await doc.ref.update({ quantity: (data.quantity || 0) + 1 });
    } else {
      await cartRef.add({ ...product, quantity: 1 });
    }
  } catch (error) {
    console.error('Error al añadir producto al carrito:', error);
  }
}

  async removeItem(itemId: string): Promise<void> {
    try {
      const userId = await this.authService.getCurrentUserId();
      if (userId) {
        await this.firestore.doc(`users/${userId}/cart/${itemId}`).delete();
      }
    } catch (error) {
      console.error('Error al eliminar producto:', error);
    }
  }

  async clearCart(): Promise<void> {
    try {
      const userId = await this.authService.getCurrentUserId();
      if (userId) {
        const cartRef = this.firestore.collection(`users/${userId}/cart`);
        const cartSnapshot = await cartRef.ref.get();
        const batch = this.firestore.firestore.batch();
        cartSnapshot.forEach((doc) => batch.delete(doc.ref));
        await batch.commit();
      }
    } catch (error) {
      console.error('Error al vaciar el carrito:', error);
    }
  }

  ngOnDestroy() {
    this.subscriptions.unsubscribe();
  }
}
