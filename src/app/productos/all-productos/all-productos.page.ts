import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ProductsService } from '../../productos.service';
import { DataService } from '../../data.service';
import { CartService } from '../../servicios/cart.service';
import { Observable, of } from 'rxjs';

@Component({
  selector: 'app-all-productos',
  templateUrl: './all-productos.page.html',
  styleUrls: ['./all-productos.page.scss']
})
export class AllProductosPage implements OnInit {
  productos: any[] = [];
  categoriaNombre: string = '';
  subcategoriaNombre: string = '';
  cartItems$: Observable<any[]> = of([]);

  constructor(
    private productService: ProductsService, // Asegúrate de que el nombre sea correcto aquí
    private route: ActivatedRoute,
    private cartService: CartService,
    private dataService: DataService,
  ) { }

  ngOnInit() {
    this.cartItems$ = this.cartService.getCartItems();
    
    // Obtener parámetros de categoría y subcategoría desde la ruta
    const categoriaNombre = this.route.snapshot.paramMap.get('categoria');
    const subcategoriaNombre = this.route.snapshot.paramMap.get('subcategoria');
    
    // Cargar datos del JSON
    this.dataService.getData().subscribe(data => {
      // Obtener el nombre de la categoría y subcategoría
      
   });
   
  }

  async addToCart(product: any) {
    try {
      await this.cartService.addToCart(product);
      console.log('Producto añadido al carrito');
    } catch (error) {
      console.error('Error al añadir producto al carrito:', error);
    }
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
