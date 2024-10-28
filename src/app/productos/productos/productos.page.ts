import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ProductosService } from '../../productos.service';

@Component({
  selector: 'app-productos',
  templateUrl: './productos.page.html',
  styleUrls: ['./productos.page.scss']
})
export class ProductosPage implements OnInit { // Cambia ProductosComponent a ProductosPage
  productos: any[] = [];
  datosProductos: any = {};
  categoriaNombre: string = '';
  subcategoriaNombre: string = '';

  constructor(
    private productosService: ProductosService,
    private route: ActivatedRoute
  ) { }

  ngOnInit() {
    this.route.params.subscribe(params => {
      this.categoriaNombre = params['categoria'];
      this.subcategoriaNombre = params['subcategoria'];

      this.productosService.getProductos().subscribe(data => {
        this.datosProductos = data;
        this.productos = this.datosProductos.productos;
        this.filtrarProductos();
      });
    });
  }

  filtrarProductos() {
    const categoria = this.datosProductos.categorias.find((c: any) => c.nombre === this.categoriaNombre);
    const subcategoria = this.datosProductos.subcategorias.find((sc: any) => 
      sc.nombre === this.subcategoriaNombre && sc.categoria_id === categoria?.id
    );

    if (categoria && subcategoria) {
      this.productos = this.productos.filter((producto: any) =>
        producto.subcategoria_id === subcategoria.id
      );
    }
  }
}
