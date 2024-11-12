import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ProductosService } from '../../productos.service';
import { AllProductosPageModule } from './all-productos.module';

@Component({
  selector: 'app-all-productos',
  templateUrl: './all-productos.page.html',
  styleUrls: ['./all-productos.page.scss']
})
export class AllProductosPage implements OnInit { // Cambia ProductosComponent a ProductosPage
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
      
      });
    });
  }


}
