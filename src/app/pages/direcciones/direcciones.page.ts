import { Component, OnInit } from '@angular/core';
import { DireccionesService } from '../../servicios/direcciones.service';

@Component({
  selector: 'app-direcciones',
  templateUrl: './direcciones.page.html',
  styleUrls: ['./direcciones.page.scss'],
})
export class DireccionesPage implements OnInit {
  center: google.maps.LatLngLiteral = { lat: -33.4489, lng: -70.6693 }; // Santiago
  options: google.maps.MapOptions = {
    zoom: 12,
    disableDefaultUI: true,
  };
  direcciones: any[] = [];
  direccion = '';
  lat = 0;
  lng = 0;
  markers: { position: google.maps.LatLngLiteral; title: string }[] = [];

  constructor(private direccionesService: DireccionesService) {}

  async ngOnInit() {
    await this.cargarDirecciones();
  }

  async cargarDirecciones() {
    this.direcciones = await this.direccionesService.getDirecciones();
    // Llenamos los marcadores con las direcciones
    this.markers = this.direcciones.map(dir => ({
      position: { lat: dir.lat, lng: dir.lng },
      title: dir.direccion,
    }));
  }

  agregarDireccion() {
    this.direccionesService
      .addDireccion(this.direccion, this.lat, this.lng)
      .then(() => this.cargarDirecciones());
  }

  eliminarDireccion(id: number) {
    this.direccionesService
      .deleteDireccion(id)
      .then(() => this.cargarDirecciones());
  }
}
