import { Component, OnInit } from '@angular/core';
import { CartService } from '../../servicios/cart.service';
import { DataService } from '../../data.service';
import { ActivatedRoute } from '@angular/router';
import { Observable, of } from 'rxjs';
import { ProductosService } from '../../productos.service';

@Component({
  selector: 'app-productos',
  templateUrl: './productos.page.html',
  styleUrls: ['./productos.page.scss'],
})

export class ProductosPage implements OnInit {
  categoriaNombre: string = '';
  subcategoriaNombre: string = '';
  productos: any[] = [];
  cartItems$: Observable<any[]> = of([]);


  constructor(
    private productosService: ProductosService,
    private route: ActivatedRoute,
    private cartService: CartService,
    private dataService: DataService,
   
  ) {}

  ngOnInit() {
    this.cartItems$ = this.cartService.getCartItems();
    
    // Obtener parámetros de categoría y subcategoría desde la ruta
    const categoriaNombre = this.route.snapshot.paramMap.get('categoria');
    const subcategoriaNombre = this.route.snapshot.paramMap.get('subcategoria');
    
    // Cargar datos del JSON
    this.dataService.getData().subscribe(data => {
      // Obtener el nombre de la categoría y subcategoría
      const categoria = data.categorias.find((cat: any) => cat.nombre === categoriaNombre);
      const subcategoria = data.subcategorias.find((subcat: any) => subcat.nombre === subcategoriaNombre && subcat.categoria_id === categoria.id);
   
      if (categoria && subcategoria) {
         this.categoriaNombre = categoria.nombre;
         this.subcategoriaNombre = subcategoria.nombre;
   
         // Filtrar productos por subcategoría
         this.productos = data.productos.filter((producto: any) => producto.subcategoria_id === subcategoria.id);
      }
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
