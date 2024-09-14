import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ProductosService } from '../productos.service';

@Component({
  selector: 'app-all-productos',
  templateUrl: './all-productos.component.html',
  styleUrls: ['./all-productos.component.scss']
})
export class AllProductosComponent implements OnInit {
  productos: any[] = [];

  constructor(private productosService: ProductosService,
    private route: ActivatedRoute
  ) { }

  ngOnInit() {
    this.productosService.getProductos().subscribe(data => {
      this.productos = data.productos; // Asumiendo que el JSON tiene una clave 'productos'
    });
  }
}



  

