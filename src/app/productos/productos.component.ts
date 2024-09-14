import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ProductosService } from '../productos.service';

@Component({
  selector: 'app-productos',
  templateUrl: './productos.component.html',
  styleUrls: ['./productos.component.scss']
})
export class ProductosComponent implements OnInit {
  productos: any[] = [];
  categoriaNombre: string = '';
  subcategoriaNombre: string = '';

  constructor(
    private productosService: ProductosService,
    private route: ActivatedRoute
  ) { }

  ngOnInit() {
    // Obtener parámetros de la ruta
    this.route.params.subscribe(params => {
      this.categoriaNombre = params['categoria'];
      this.subcategoriaNombre = params['subcategoria'];
      
      // Obtener productos
      this.productosService.getProductos().subscribe(data => {
        this.productos = data.productos;
        this.filtrarProductos();
      });
    });
  }

  filtrarProductos() {
    // Lógica para filtrar productos por categoría y subcategoría
    this.productos = this.productos.filter(producto =>
      producto.categoria.nombre === this.categoriaNombre &&
      producto.subcategoria.nombre === this.subcategoriaNombre
    );
  }
}
