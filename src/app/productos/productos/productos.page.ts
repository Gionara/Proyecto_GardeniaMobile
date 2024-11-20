import { Component, OnInit } from '@angular/core';
import { CartService } from '../../servicios/cart.service';
import { DataService } from '../../data.service';
import { ActivatedRoute } from '@angular/router';
import { Observable, of } from 'rxjs';
import { ProductsService } from '../../productos.service';
import { AngularFirestore } from '@angular/fire/compat/firestore'; // Mantén solo AngularFirestore
import { AuthService } from '../../servicios/auth.service';

@Component({
  selector: 'app-productos',
  templateUrl: './productos.page.html',
  styleUrls: ['./productos.page.scss'],
})
export class ProductosPage implements OnInit {
  categoriaNombre: string = '';
  subcategoriaNombre: string = '';
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
    this.productos$ = this.firestore.collection('productos').valueChanges();
    this.cartItems$ = this.cartService.cartItems$;

    const categoriaNombre = this.route.snapshot.paramMap.get('categoria');
    const subcategoriaNombre = this.route.snapshot.paramMap.get('subcategoria');

    this.dataService.getData().subscribe(data => {
      const categoria = data.categorias.find((cat: any) => cat.nombre === categoriaNombre);
      const subcategoria = data.subcategorias.find(
        (subcat: any) =>
          subcat.nombre === subcategoriaNombre && subcat.categoria_id === categoria.id
      );

      if (categoria && subcategoria) {
        this.categoriaNombre = categoria.nombre;
        this.subcategoriaNombre = subcategoria.nombre;
        this.productos$ = of(
          data.productos.filter((producto: any) => producto.subcategoria_id === subcategoria.id)
        );
      }
    });
  }

  async addToCart(product: any): Promise<void> {
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

