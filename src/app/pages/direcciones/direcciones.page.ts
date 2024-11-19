import { Component, ElementRef, NgZone, OnInit, AfterViewInit, ViewChild } from '@angular/core';

declare var google: any;

@Component({
  selector: 'app-direcciones',
  templateUrl: './direcciones.page.html',
  styleUrls: ['./direcciones.page.scss'],
})
export class DireccionesPage implements OnInit, AfterViewInit {
  center: google.maps.LatLngLiteral = { lat: -33.4489, lng: -70.6693 }; // Coordenadas iniciales
  options: google.maps.MapOptions = {
    zoom: 12,
    disableDefaultUI: true, // Opcional: Desactiva controles predeterminados
  };
  markers: google.maps.Marker[] = []; // Marcadores para el mapa
  direcciones: any[] = [];
  direccion = '';
  lat = 0;
  lng = 0;

  @ViewChild('autocomplete', { static: false }) autocompleteInput!: ElementRef;

  map: google.maps.Map | undefined;

  constructor(private ngZone: NgZone) {}

  ngOnInit() {
    console.log('Eliminando una advertencia de error sin sentido :)');
  }

  ngAfterViewInit() {
    setTimeout(() => {
      this.initAutocomplete(); // Inicializa el autocompletado
      this.initMap(); // Inicializa el mapa
    }, 1000);  // Un pequeño retardo para asegurar que el DOM esté listo
  }

  // Inicializa el autocompletado
  initAutocomplete() {
    if (typeof google !== 'undefined' && google.maps && google.maps.places) {
      const input = document.getElementById('autocomplete') as HTMLInputElement;
      const autocomplete = new google.maps.places.Autocomplete(input);
      autocomplete.addListener('place_changed', () => {
        const place = autocomplete.getPlace();
        if (place.geometry) {
          this.lat = place.geometry.location.lat();
          this.lng = place.geometry.location.lng();
          this.center = { lat: this.lat, lng: this.lng }; // Actualiza el centro del mapa

          // Coloca un marcador en la ubicación seleccionada
          this.placeMarker(this.lat, this.lng);
        }
      });
    } else {
      console.error('Google Maps no está cargado correctamente');
    }
  }

  // Inicializa el mapa
  initMap() {
    if (typeof google !== 'undefined') {
      this.map = new google.maps.Map(document.getElementById('map') as HTMLElement, {
        center: this.center,
        zoom: 12,
        disableDefaultUI: true,
      });
    }
  }

  // Coloca un marcador en el mapa
  placeMarker(lat: number, lng: number) {
    if (this.map) {
      const marker = new google.maps.Marker({
        position: { lat, lng },
        map: this.map,
        title: 'Ubicación seleccionada',
      });

      // Borra los marcadores anteriores
      this.markers.forEach(m => m.setMap(null));
      this.markers = [marker]; // Añade el nuevo marcador

      // Actualiza la dirección guardada
      this.direccion = `Lat: ${lat}, Lng: ${lng}`;
    }
  }

  // Método agregarDireccion
  agregarDireccion() {
    if (this.direccion) {
      this.direcciones.push({
        id: this.direcciones.length + 1,
        direccion: this.direccion,
        lat: this.lat,
        lng: this.lng,
      });
      this.direccion = ''; // Limpiar el campo de dirección
    }
  }

  // Método eliminarDireccion
  eliminarDireccion(id: number) {
    this.direcciones = this.direcciones.filter((direccion) => direccion.id !== id);
  }
}
